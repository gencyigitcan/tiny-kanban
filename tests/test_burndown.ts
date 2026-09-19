process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// ============================================================
//  tests/test_burndown.ts
//  Automated Verification of:
//  1. Sprint burndown calculation (ideal vs actual Story Points remaining)
//  2. Sprint burnup calculation (total scope vs completed story points)
//  3. Day-by-day time series generation
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { cardRouter } from '../src/routes/cards.js';
import { sprintRouter } from '../src/routes/sprints.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword } from '../src/lib/db.js';
import type { User } from '../src/types/index.js';

initDb();

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/cards', requireAuth, cardRouter);
app.use('/api/sprints', requireAuth, sprintRouter);
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
    console.log('🧪 Starting Sprint Burndown & Burnup Test Suite...\n');

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const personalDb = readDb({ tenantId: 'personal' } as any);
        const testSuffix = Date.now().toString(36);
        const superUser: User = {
            id: `usr_bd_${testSuffix}`,
            username: `super_bd_${testSuffix}`,
            passwordHash: hashPassword('BdPass123!'),
            name: 'Burndown Admin',
            role: 'superadmin',
            createdAt: new Date().toISOString()
        };
        personalDb.users.push(superUser);
        writeDbSync(personalDb, { tenantId: 'personal' } as any);

        const loginRes = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: superUser.username,
                password: 'BdPass123!'
            })
        });
        assert.strictEqual(loginRes.status, 200, 'Superadmin login failed');
        const token = loginRes.body.token;
        const authHeaders = { Authorization: `Bearer ${token}` };

        // Test 1: Create a Sprint spanning 10 days
        console.log('Test 1: Creating a test sprint...');
        const startDate = new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10);
        const endDate = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);

        const createSprintRes = await req('/api/sprints', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Sprint 2026-Q3 Titan',
                startDate,
                endDate
            })
        });
        assert.strictEqual(createSprintRes.status, 201);
        const sprint = createSprintRes.body;
        console.log(`✓ Sprint created: ${sprint.name} (${sprint.id})`);

        // Test 2: Create 3 cards in the sprint with Story Points (8, 5, 3 => Total 16 SP)
        console.log('\nTest 2: Adding cards to sprint with Story Points (8, 5, 3)...');
        const card1Res = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Titan Card 1: Auth Architecture',
                storyPoints: 8,
                col: 'todo',
                sprintId: sprint.id
            })
        });
        assert.strictEqual(card1Res.status, 201);
        const card1 = card1Res.body;

        const card2Res = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Titan Card 2: DB Index Optimization',
                storyPoints: 5,
                col: 'todo',
                sprintId: sprint.id
            })
        });
        assert.strictEqual(card2Res.status, 201);
        const card2 = card2Res.body;

        const card3Res = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Titan Card 3: Cache Invalidation',
                storyPoints: 3,
                col: 'todo',
                sprintId: sprint.id
            })
        });
        assert.strictEqual(card3Res.status, 201);
        console.log('✓ Cards created with total 16 Story Points.');

        // Test 3: Move Card 2 (5 SP) to 'done'
        console.log('\nTest 3: Moving Card 2 (5 SP) to done...');
        const moveRes = await req(`/api/cards/${card2.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                col: 'done'
            })
        });
        assert.strictEqual(moveRes.status, 200);
        console.log('✓ Card 2 marked as done.');

        // Test 4: Call GET /api/sprints/:id/burndown
        console.log('\nTest 4: Calling GET /api/sprints/:id/burndown...');
        const bdRes = await req(`/api/sprints/${sprint.id}/burndown`, { headers: authHeaders });
        assert.strictEqual(bdRes.status, 200);
        const data = bdRes.body;

        // Verify sprint summary
        assert.strictEqual(data.sprint.id, sprint.id);
        assert.strictEqual(data.sprint.totalSP, 16);
        assert.strictEqual(data.sprint.completedSP, 5);
        assert.strictEqual(data.sprint.remainingSP, 11);
        assert.strictEqual(data.summary.completedSP, 5);
        assert.strictEqual(data.summary.remainingSP, 11);
        assert.strictEqual(data.summary.velocityPct, Math.round((5 / 16) * 100));

        // Verify day-by-day burndown structure
        assert.ok(Array.isArray(data.days));
        assert.ok(data.days.length >= 10);
        
        // Day 0: Ideal remaining should be 16 SP
        const firstDay = data.days[0];
        assert.strictEqual(firstDay.idealRemainingSP, 16);
        assert.strictEqual(firstDay.totalScopeSP, 16);

        // Final Day: Ideal remaining should descend to 0 SP
        const lastDay = data.days[data.days.length - 1];
        assert.strictEqual(lastDay.idealRemainingSP, 0);

        console.log(`✓ Burndown generated: total ${data.days.length} days, ideal 16 SP -> 0 SP, remaining 11 SP.`);

        console.log('\n🎉 ALL SPRINT BURNDOWN & BURNUP TESTS PASSED PERFECTLY!\n');
    } finally {
        server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
