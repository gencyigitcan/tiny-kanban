// ============================================================
//  tests/test_automations.ts
//  Automated Verification of:
//  1. Creation and retrieval of No-Code Automation Rules
//  2. Trigger 'card_created' executing action 'set_priority'
//  3. Trigger 'status_changed' executing action 'send_notification'
//  4. Toggling isActive on an automation rule
//  5. Deleting an automation rule
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { cardRouter } from '../src/routes/cards.js';
import { automationsRouter } from '../src/routes/automations.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword } from '../src/lib/db.js';
import type { User } from '../src/types/index.js';

initDb();

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/cards', requireAuth, cardRouter);
app.use('/api/automations', requireAuth, automationsRouter);
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
    console.log('🧪 Starting Automations Verification Test Suite...\n');

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const personalDb = readDb({ tenantId: 'personal' } as any);
        const testSuffix = Date.now().toString(36);
        const superUser: User = {
            id: `usr_auto_${testSuffix}`,
            username: `super_auto_${testSuffix}`,
            passwordHash: hashPassword('AutoPass123!'),
            name: 'Automation Admin',
            role: 'superadmin',
            createdAt: new Date().toISOString()
        };
        personalDb.users.push(superUser);
        writeDbSync(personalDb, { tenantId: 'personal' } as any);

        const loginRes = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: superUser.username,
                password: 'AutoPass123!'
            })
        });
        assert.strictEqual(loginRes.status, 200, 'Superadmin login failed');
        const token = loginRes.body.token;
        const authHeaders = { Authorization: `Bearer ${token}` };

        // Test 1: Create an automation rule: when card_created -> set_priority to high
        console.log('Test 1: Creating automation rule (card_created -> set_priority high)...');
        const createRuleRes = await req('/api/automations', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Auto escalate new cards to high',
                trigger: 'card_created',
                action: 'set_priority',
                actionConfig: { priority: 'high' },
                isActive: true
            })
        });
        assert.strictEqual(createRuleRes.status, 201, `Create rule failed: ${JSON.stringify(createRuleRes.body)}`);
        const rule1 = createRuleRes.body;
        assert.strictEqual(rule1.trigger, 'card_created');
        assert.strictEqual(rule1.action, 'set_priority');
        assert.strictEqual(rule1.isActive, true);
        console.log('✓ Rule 1 created successfully.');

        // Test 2: Create a second rule: when status_changed -> send_notification
        console.log('\nTest 2: Creating automation rule (status_changed -> send_notification)...');
        const createRule2Res = await req('/api/automations', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Notify when card moved',
                trigger: 'status_changed',
                action: 'send_notification',
                actionConfig: { message: 'Card was moved to a new column!' },
                isActive: true
            })
        });
        assert.strictEqual(createRule2Res.status, 201);
        const rule2 = createRule2Res.body;
        console.log('✓ Rule 2 created successfully.');

        // Test 3: List automation rules
        console.log('\nTest 3: Listing automation rules...');
        const listRes = await req('/api/automations', {
            method: 'GET',
            headers: authHeaders
        });
        assert.strictEqual(listRes.status, 200);
        assert.ok(Array.isArray(listRes.body));
        assert.ok(listRes.body.some((r: any) => r.id === rule1.id));
        assert.ok(listRes.body.some((r: any) => r.id === rule2.id));
        console.log(`✓ Retrieved ${listRes.body.length} automation rules.`);

        // Test 4: Create a card with priority 'low', verify automation escalates it to 'high'
        console.log('\nTest 4: Creating a card with low priority and checking automatic escalation to high...');
        const createCardRes = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Automated Test Ticket',
                column: 'todo',
                priority: 'low',
                type: 'task'
            })
        });
        assert.strictEqual(createCardRes.status, 201, `Card creation failed: ${JSON.stringify(createCardRes.body)}`);
        const createdCard = createCardRes.body;
        assert.strictEqual(createdCard.priority, 'high', 'Automation did not escalate priority to high');
        console.log('✓ Card priority was automatically escalated to high by trigger card_created!');

        // Test 5: Move card to 'done' and verify notification was created
        console.log('\nTest 5: Moving card to done and verifying notification generated by automation...');
        const updateCardRes = await req(`/api/cards/${createdCard.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                column: 'done'
            })
        });
        assert.strictEqual(updateCardRes.status, 200);

        // Check db notifications for superUser
        const updatedDb = readDb({ tenantId: 'personal' } as any);
        const notification = updatedDb.notifications?.find(n => n.userId === superUser.id && n.text?.includes('moved to a new column'));
        assert.ok(notification, 'Expected notification was not created by automation');
        console.log('✓ Status change trigger successfully dispatched notification!');

        // Test 6: Deactivate rule1
        console.log('\nTest 6: Deactivating rule 1...');
        const toggleRes = await req(`/api/automations/${rule1.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ isActive: false })
        });
        assert.strictEqual(toggleRes.status, 200);
        assert.strictEqual(toggleRes.body.isActive, false);
        console.log('✓ Rule 1 successfully deactivated.');

        // Test 7: Delete rule 2
        console.log('\nTest 7: Deleting rule 2...');
        const deleteRes = await req(`/api/automations/${rule2.id}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        assert.strictEqual(deleteRes.status, 200);
        console.log('✓ Rule 2 successfully deleted.');

        console.log('\n🎉 ALL AUTOMATIONS ENGINE TESTS PASSED PERFECTLY!\n');
    } finally {
        server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
