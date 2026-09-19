process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// ============================================================
//  tests/test_sla.ts
//  Automated Verification of:
//  1. Automatic SLA Resolution Due Calculation (Incident -> 4h, High -> 24h, Custom)
//  2. SLA Completion upon moving to 'done' column
//  3. SLA Breach detection (on-time vs missed deadline)
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { cardRouter } from '../src/routes/cards.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword } from '../src/lib/db.js';
import type { User } from '../src/types/index.js';

initDb();

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/cards', requireAuth, cardRouter);
app.use(errorHandler);

let server: any;
let baseUrl: string;

async function req(path: string, options: any = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    const text = await res.text();
    let body;
    try {
        body = JSON.parse(text);
    } catch {
        body = text;
    }
    return { status: res.status, headers: res.headers, body };
}

async function runTests() {
    console.log('🧪 Starting SLA Verification Test Suite...\n');

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const personalDb = readDb({ tenantId: 'personal' } as any);
        const testSuffix = Date.now().toString(36);
        const superUser: User = {
            id: `usr_sla_${testSuffix}`,
            username: `super_sla_${testSuffix}`,
            passwordHash: hashPassword('SlaPassword123!'),
            name: 'SLA Manager',
            role: 'superadmin',
            createdAt: new Date().toISOString()
        };
        personalDb.users.push(superUser);
        writeDbSync(personalDb, { tenantId: 'personal' } as any);

        const loginRes = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: superUser.username, password: 'SlaPassword123!' })
        });
        assert.equal(loginRes.status, 200);
        const token = loginRes.body.token;
        const authHeaders = { 'Authorization': `Bearer ${token}` };

        // 1. Incident Card -> Auto 4h SLA
        console.log('Test 1: Incident Issue Type auto-defaults to 4-hour SLA');
        const incRes = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Kritik Ödeme Servisi Çöküşü',
                issueType: 'incident',
                priority: 'high'
            })
        });
        assert.equal(incRes.status, 201);
        const incidentCard = incRes.body;
        assert.equal(incidentCard.slaTargetHours, 4);
        assert(incidentCard.slaDueAt > Date.now() + (3.9 * 3600 * 1000));
        assert(incidentCard.slaDueAt <= Date.now() + (4.1 * 3600 * 1000));
        assert.equal(incidentCard.slaBreached, false);
        console.log('   ✓ Incident SLA set to 4 hours with correct due timestamp');

        // 2. High Priority Card -> Auto 24h SLA
        console.log('Test 2: High Priority auto-defaults to 24-hour SLA');
        const highRes = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Ana Sayfa Banner Görseli Bozuk',
                issueType: 'bug',
                priority: 'high'
            })
        });
        assert.equal(highRes.status, 201);
        const highCard = highRes.body;
        assert.equal(highCard.slaTargetHours, 24);
        assert(highCard.slaDueAt > Date.now() + (23.9 * 3600 * 1000));
        console.log('   ✓ High priority SLA set to 24 hours');

        // 3. Custom SLA specification
        console.log('Test 3: Custom SLA target hours explicitly set');
        const customRes = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Müşteri Özel Talebi',
                issueType: 'task',
                priority: 'medium',
                slaTargetHours: 8
            })
        });
        assert.equal(customRes.status, 201);
        assert.equal(customRes.body.slaTargetHours, 8);
        console.log('   ✓ Custom 8-hour SLA verified');

        // 4. Moving card to done completes SLA
        console.log('Test 4: Moving card to done records slaCompletedAt and verifies on-time completion');
        const moveDone = await req(`/api/cards/${incidentCard.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ col: 'done' })
        });
        assert.equal(moveDone.status, 200);
        assert(moveDone.body.slaCompletedAt > 0);
        assert.equal(moveDone.body.slaBreached, false);
        console.log('   ✓ Card completed within SLA on time');

        // 5. Breached SLA simulation
        console.log('Test 5: Simulating SLA breach (past deadline)');
        const pastDueAt = Date.now() - 3600000; // 1 hour ago
        const breachCardRes = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Zamanı Geçmiş Ticket',
                slaTargetHours: 1
            })
        });
        const breachId = breachCardRes.body.id;
        // Force past dueAt in card
        const updatePast = await req(`/api/cards/${breachId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ slaDueAt: pastDueAt, col: 'done' })
        });
        assert.equal(updatePast.status, 200);
        assert.equal(updatePast.body.slaBreached, true, 'Card completed after slaDueAt should be flagged as breached');
        console.log('   ✓ SLA breach accurately detected');

        // Cleanup
        await req(`/api/cards/${incidentCard.id}`, { method: 'DELETE', headers: authHeaders });
        await req(`/api/cards/${highCard.id}`, { method: 'DELETE', headers: authHeaders });
        await req(`/api/cards/${customRes.body.id}`, { method: 'DELETE', headers: authHeaders });
        await req(`/api/cards/${breachId}`, { method: 'DELETE', headers: authHeaders });

        console.log('\n🎉 ALL SLA TESTS PASSED 100%!');
    } finally {
        server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
