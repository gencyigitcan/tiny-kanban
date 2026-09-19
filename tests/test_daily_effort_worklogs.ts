process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// ============================================================
//  tests/test_daily_effort_worklogs.ts
//  Automated Verification of Daily Effort (Worklogs) Feature:
//  1. Card creation with estimated effort
//  2. Adding daily worklog entries (Day 1: 1.5h, Day 2: 2.5h)
//  3. Verification that spentEffort dynamically sums daily worklogs (1.5 -> 4.0h)
//  4. Listing worklogs (GET /api/cards/:id/worklogs)
//  5. Validation constraints (reject negative, reject >24h, invalid date)
//  6. Activity logging (CARD_WORKLOG action & details)
//  7. Deleting a worklog entry and verifying dynamic recalculation (4.0 -> 2.5h)
//  8. Sprint burndown daily effort tracking
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { cardRouter } from '../src/routes/cards.js';
import { sprintRouter } from '../src/routes/sprints.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword } from '../src/lib/db.js';
import type { User, Sprint } from '../src/types/index.js';

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
    console.log('⏱️ Starting Daily Effort (Worklogs) Test Suite...\n');

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const personalDb = readDb({ tenantId: 'personal' } as any);
        const testSuffix = Date.now().toString(36);
        const testUser: User = {
            id: `usr_wl_${testSuffix}`,
            username: `dev_wl_${testSuffix}`,
            passwordHash: hashPassword('WorklogSecret123!'),
            name: 'Geliştirici Can',
            role: 'superadmin',
            status: 'approved',
            createdAt: Date.now()
        };
        personalDb.users.push(testUser);
        writeDbSync(personalDb, { tenantId: 'personal' } as any);

        // Login to obtain JWT
        const loginRes = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: testUser.username,
                password: 'WorklogSecret123!'
            })
        });
        assert.strictEqual(loginRes.status, 200, 'Login should succeed');
        const token = loginRes.body.token;
        const authHeader = { 'Authorization': `Bearer ${token}` };

        // 1. Create a card with estimatedEffort = 8
        console.log('Test 1: Create a card with estimatedEffort = 8');
        const createRes = await req('/api/cards', {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                title: 'Ödeme Entegrasyonu Geliştirmesi',
                estimatedEffort: 8,
                priority: 'high'
            })
        });
        assert.strictEqual(createRes.status, 201, 'Card should be created');
        const cardId = createRes.body.id;
        assert.strictEqual(createRes.body.estimatedEffort, 8);
        assert.strictEqual(createRes.body.spentEffort, null);
        console.log('   ✓ Card created successfully with estimatedEffort = 8\n');

        // 2. Add Day 1 worklog: 1.5 hours
        console.log('Test 2: Log 1.5 hours daily effort for Day 1');
        const wl1Res = await req(`/api/cards/${cardId}/worklogs`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                date: '2026-09-18',
                hours: 1.5,
                description: 'Ödeme gateway API dokümantasyonu incelendi ve servis iskeleti kuruldu'
            })
        });
        assert.strictEqual(wl1Res.status, 201, 'Worklog should be added');
        assert.strictEqual(wl1Res.body.success, true);
        assert.strictEqual(wl1Res.body.worklog.hours, 1.5);
        assert.strictEqual(wl1Res.body.worklog.date, '2026-09-18');
        assert.strictEqual(wl1Res.body.worklog.userName, 'Geliştirici Can');
        assert.strictEqual(wl1Res.body.spentEffort, 1.5, 'Card spentEffort should be updated to 1.5');
        const wl1Id = wl1Res.body.worklog.id;
        console.log('   ✓ Day 1 worklog logged: 1.5 hours, card spentEffort = 1.5\n');

        // 3. Add Day 2 worklog: 2.5 hours
        console.log('Test 3: Log 2.5 hours daily effort for Day 2');
        const wl2Res = await req(`/api/cards/${cardId}/worklogs`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                date: '2026-09-19',
                hours: 2.5,
                description: 'Webhook işleyicisi ve hata yönetimi yazıldı'
            })
        });
        assert.strictEqual(wl2Res.status, 201, 'Worklog should be added');
        assert.strictEqual(wl2Res.body.spentEffort, 4.0, 'Card spentEffort should sum up to 4.0');
        assert.strictEqual(wl2Res.body.worklogs.length, 2);
        const wl2Id = wl2Res.body.worklog.id;
        console.log('   ✓ Day 2 worklog logged: 2.5 hours, card spentEffort = 4.0 (1.5 + 2.5)\n');

        // 4. GET /api/cards/:id/worklogs
        console.log('Test 4: Retrieve all worklogs for the card');
        const getWlRes = await req(`/api/cards/${cardId}/worklogs`, {
            headers: authHeader
        });
        assert.strictEqual(getWlRes.status, 200);
        assert.strictEqual(getWlRes.body.worklogs.length, 2);
        console.log('   ✓ Retrieved 2 worklogs via GET /api/cards/:id/worklogs\n');

        // 5. Validation constraints
        console.log('Test 5: Validation rules (reject negative hours, >24h, invalid date)');
        const negRes = await req(`/api/cards/${cardId}/worklogs`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({ hours: -2 })
        });
        assert.strictEqual(negRes.status, 400, 'Negative hours should be rejected');

        const over24Res = await req(`/api/cards/${cardId}/worklogs`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({ hours: 25 })
        });
        assert.strictEqual(over24Res.status, 400, 'Over 24h should be rejected');

        const badDateRes = await req(`/api/cards/${cardId}/worklogs`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({ date: '19-09-2026', hours: 1 })
        });
        assert.strictEqual(badDateRes.status, 400, 'Bad date format should be rejected');
        console.log('   ✓ Validation constraints enforced properly (400 Bad Request)\n');

        // 6. Activity log check
        console.log('Test 6: Verify CARD_WORKLOG in card activity timeline');
        const cardDetail = await req(`/api/cards/${cardId}`, { headers: authHeader });
        const activities = cardDetail.body.activity || [];
        const worklogActs = activities.filter((a: any) => a.action === 'CARD_WORKLOG');
        assert.ok(worklogActs.length >= 2, 'Should have at least 2 CARD_WORKLOG activities');
        assert.ok(worklogActs[0].details.includes('günlük efor kaydedildi'));
        console.log('   ✓ CARD_WORKLOG activities recorded with detailed logs\n');

        // 7. Delete Day 1 worklog and check recalculation
        console.log('Test 7: Delete Day 1 worklog and verify recalculation');
        const delRes = await req(`/api/cards/${cardId}/worklogs/${wl1Id}`, {
            method: 'DELETE',
            headers: authHeader
        });
        assert.strictEqual(delRes.status, 200);
        assert.strictEqual(delRes.body.success, true);
        assert.strictEqual(delRes.body.worklogs.length, 1);
        assert.strictEqual(delRes.body.spentEffort, 2.5, 'Card spentEffort should drop to 2.5');

        // Double check card via GET
        const updatedCard = await req(`/api/cards/${cardId}`, { headers: authHeader });
        assert.strictEqual(updatedCard.body.spentEffort, 2.5);
        assert.strictEqual(updatedCard.body.worklogs.length, 1);
        console.log('   ✓ Worklog deleted and spentEffort correctly updated to 2.5\n');

        // 8. Sprint Burndown dailyEffort verification
        console.log('Test 8: Sprint Burndown includes daily logged effort');
        const db = readDb({ tenantId: 'personal' } as any);
        const sprintId = `spr_test_${testSuffix}`;
        const newSprint: Sprint = {
            id: sprintId,
            name: 'Sprint 2026-W38',
            startDate: '2026-09-14',
            endDate: '2026-09-28',
            active: true,
            status: 'active',
            createdAt: Date.now()
        };
        db.sprints.push(newSprint);
        // Assign card to sprint
        const cIdx = db.cards.findIndex((c: any) => c.id === cardId);
        if (cIdx !== -1) {
            db.cards[cIdx].sprintId = sprintId;
        }
        writeDbSync(db, { tenantId: 'personal' } as any);

        const burndownRes = await req(`/api/sprints/${sprintId}/burndown`, { headers: authHeader });
        assert.strictEqual(burndownRes.status, 200);
        assert.ok(Array.isArray(burndownRes.body.days));
        const dayWithWorklog = burndownRes.body.days.find((d: any) => d.date === '2026-09-19');
        assert.ok(dayWithWorklog, 'Burndown should contain 2026-09-19');
        assert.strictEqual(dayWithWorklog.dailyEffort, 2.5, 'Burndown should report 2.5 daily effort on 2026-09-19');
        console.log('   ✓ Sprint burndown correctly tracks daily effort per date\n');

        // Cleanup
        console.log('🧹 Cleanup test data...');
        const cleanDb = readDb({ tenantId: 'personal' } as any);
        cleanDb.users = cleanDb.users.filter((u: any) => u.id !== testUser.id);
        cleanDb.cards = cleanDb.cards.filter((c: any) => c.id !== cardId);
        cleanDb.sprints = cleanDb.sprints.filter((s: any) => s.id !== sprintId);
        writeDbSync(cleanDb, { tenantId: 'personal' } as any);
        console.log('   ✓ Cleaned test user, card, and sprint\n');

        console.log('🎉 ALL DAILY EFFORT / WORKLOG TESTS PASSED SUCCESSFULLY!');

    } finally {
        if (server) server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
