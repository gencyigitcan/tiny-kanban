process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// ============================================================
//  tests/test_columns_timeline_notifications.ts
//  Automated Verification of:
//  1. Workspace Dynamic Workflow Columns CRUD & 5-Column Template
//  2. Card Dependencies ("Blocks" / "Blocked by")
//  3. Automation & Notifications (Team Action to Managers + 24h Due Soon alerts)
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { adminRouter } from '../src/routes/admin.js';
import { cardRouter } from '../src/routes/cards.js';
import { columnRouter } from '../src/routes/columns.js';
import { notificationsRouter } from '../src/routes/notifications.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword, getTenantIndex, saveTenantIndex } from '../src/lib/db.js';
import type { User, BoardColumn } from '../src/types/index.js';

initDb();

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cards', requireAuth, cardRouter);
app.use('/api/columns', requireAuth, columnRouter);
app.use('/api/notifications', requireAuth, notificationsRouter);
app.use(errorHandler);

let server: any;
let port: number;
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
    console.log('🚀 Starting Roadmap Verification Test Suite (Dynamic Columns, Dependencies, Notifications)...\n');

    server = app.listen(0);
    port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const testSuffix = Date.now().toString(36);
        const superadminEmail = `admin_${testSuffix}@company.com`;
        const standardUserEmail = `dev_${testSuffix}@company.com`;

        // 1. Setup Super Admin & Standard Team Member in personal DB
        const personalDb = readDb({ tenantId: 'personal' } as any);
        personalDb.users = personalDb.users || [];

        const superUser: User = {
            id: `usr_super_${testSuffix}`,
            username: `super_${testSuffix}`,
            passwordHash: hashPassword('SuperSecret123!'),
            name: 'Yiğitcan Genç',
            role: 'superadmin',
            createdAt: new Date().toISOString()
        };

        const standardUser: User = {
            id: `usr_dev_${testSuffix}`,
            username: `dev_${testSuffix}`,
            passwordHash: hashPassword('DevPassword123!'),
            name: 'Can Developer',
            role: 'user',
            createdAt: new Date().toISOString()
        };

        personalDb.users.push(superUser, standardUser);
        writeDbSync(personalDb, { tenantId: 'personal' } as any);

        // Login both users to acquire auth tokens
        const loginSuper = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: superUser.username, password: 'SuperSecret123!' })
        });
        assert.strictEqual(loginSuper.status, 200, 'Super admin login must succeed');
        const superToken = loginSuper.body.token;

        const loginDev = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: standardUser.username, password: 'DevPassword123!' })
        });
        assert.strictEqual(loginDev.status, 200, 'Developer login must succeed');
        const devToken = loginDev.body.token;

        console.log('✅ Step 1: Users authenticated successfully');

        // 2. Create Software Team Workspace with 5-Column Template
        const createWsRes = await req('/api/admin/workspaces', {
            method: 'POST',
            headers: { Authorization: `Bearer ${superToken}` },
            body: JSON.stringify({
                name: 'Finans Ürün ve Mühendislik',
                description: 'Yazılım geliştirme panosu',
                template: 'software',
                memberIds: [standardUser.id]
            })
        });
        assert.strictEqual(createWsRes.status, 201, 'Workspace creation must return 201 Created');
        const wsId = createWsRes.body.workspace?.id || createWsRes.body.id;
        assert.ok(wsId, 'Workspace must have an ID');

        // Switch both users to this workspace
        const switchSuper = await req('/api/auth/switch-workspace', {
            method: 'POST',
            headers: { Authorization: `Bearer ${superToken}` },
            body: JSON.stringify({ workspaceId: wsId })
        });
        assert.strictEqual(switchSuper.status, 200);
        const superWsToken = switchSuper.body.token;

        const switchDev = await req('/api/auth/switch-workspace', {
            method: 'POST',
            headers: { Authorization: `Bearer ${devToken}` },
            body: JSON.stringify({ workspaceId: wsId })
        });
        assert.strictEqual(switchDev.status, 200);
        const devWsToken = switchDev.body.token;

        console.log('✅ Step 2: Software workspace created with members & active tokens acquired');

        // 3. Verify Software Team 5 Dynamic Columns Initialized
        const colsRes = await req('/api/columns', {
            headers: { Authorization: `Bearer ${superWsToken}` }
        });
        assert.strictEqual(colsRes.status, 200);
        assert.strictEqual(colsRes.body.length, 5, 'Software template must have 5 columns');
        const colNames = colsRes.body.map((c: BoardColumn) => c.name);
        assert.ok(colNames.includes('Backlog / Yapılacak'), 'Must have Backlog / Yapılacak');
        assert.ok(colNames.includes('Analiz & Tasarım'), 'Must have Analiz & Tasarım');
        assert.ok(colNames.includes('Geliştirme'), 'Must have Geliştirme');
        assert.ok(colNames.includes('Test & QA'), 'Must have Test & QA');
        assert.ok(colNames.includes('Canlıda / Tamamlandı'), 'Must have Canlıda / Tamamlandı');

        console.log(`✅ Step 3: Software 5-column template verified: [${colNames.join(', ')}]`);

        // 4. Test Column Authorization: Standard user cannot create or delete columns
        const devAddColRes = await req('/api/columns', {
            method: 'POST',
            headers: { Authorization: `Bearer ${devWsToken}` },
            body: JSON.stringify({ name: 'Hacker Col' })
        });
        assert.strictEqual(devAddColRes.status, 403, 'Standard user must not be allowed to create columns');

        // Superadmin adds a 6th custom column "Kod İnceleme (Code Review)"
        const addColRes = await req('/api/columns', {
            method: 'POST',
            headers: { Authorization: `Bearer ${superWsToken}` },
            body: JSON.stringify({
                name: 'Kod İnceleme',
                color: '#8b5cf6',
                wipLimit: 4,
                isDone: false
            })
        });
        assert.strictEqual(addColRes.status, 201);
        assert.strictEqual(addColRes.body.name, 'Kod İnceleme');
        assert.strictEqual(addColRes.body.wipLimit, 4);
        const reviewColId = addColRes.body.id;

        // Update column (WIP limit change)
        const updColRes = await req(`/api/columns/${reviewColId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${superWsToken}` },
            body: JSON.stringify({ wipLimit: 2 })
        });
        assert.strictEqual(updColRes.status, 200);
        assert.strictEqual(updColRes.body.wipLimit, 2);

        console.log('✅ Step 4: RBAC permissions and dynamic column additions verified');

        // 5. Test Card Dependencies ("blockedBy" / "blocks")
        const cardARes = await req('/api/cards', {
            method: 'POST',
            headers: { Authorization: `Bearer ${superWsToken}` },
            body: JSON.stringify({
                title: 'Backend API Servisi Geliştirme',
                col: 'development',
                priority: 'high',
                assignee: standardUser.name
            })
        });
        assert.strictEqual(cardARes.status, 201);
        const cardA = cardARes.body;

        const cardBRes = await req('/api/cards', {
            method: 'POST',
            headers: { Authorization: `Bearer ${superWsToken}` },
            body: JSON.stringify({
                title: 'Frontend API Entegrasyonu',
                col: reviewColId,
                priority: 'medium',
                assignee: standardUser.name,
                blockedBy: [cardA.id]
            })
        });
        assert.strictEqual(cardBRes.status, 201);
        const cardB = cardBRes.body;

        // Query cards and verify dependencies
        const cardsListRes = await req('/api/cards', {
            headers: { Authorization: `Bearer ${superWsToken}` }
        });
        assert.strictEqual(cardsListRes.status, 200);
        const fetchedCardA = cardsListRes.body.find((c: any) => c.id === cardA.id);
        const fetchedCardB = cardsListRes.body.find((c: any) => c.id === cardB.id);

        assert.deepStrictEqual(fetchedCardB.blockedBy, [cardA.id], 'Card B must be blocked by Card A');
        assert.ok(fetchedCardA.blocks.includes(cardB.id), 'Card A must block Card B');

        console.log('✅ Step 5: Card dependencies bidirectional linking verified (Card A blocks Card B)');

        // 6. Test Column Deletion with Card Migration
        // Currently Card B is in reviewColId. Deleting reviewColId should migrate Card B to fallback col (e.g. qa)
        const delColRes = await req(`/api/columns/${reviewColId}?fallbackCol=qa`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${superWsToken}` }
        });
        assert.strictEqual(delColRes.status, 200);
        assert.strictEqual(delColRes.body.migratedCount, 1, 'Card B should have been migrated');

        const cardBAfterDel = (await req(`/api/cards`, { headers: { Authorization: `Bearer ${superWsToken}` } })).body.find((c: any) => c.id === cardB.id);
        assert.strictEqual(cardBAfterDel.col, 'qa', 'Card B must have migrated to qa column');

        console.log('✅ Step 6: Column deletion with automatic card migration verified');

        // 7. Test Automation Rule A: Team member action sends notification to workspace manager
        const memberCommentRes = await req(`/api/cards/${cardA.id}/comments`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${devWsToken}` },
            body: JSON.stringify({
                text: 'API entegrasyonu tamamlandı, test ortamına aktarılıyor.'
            })
        });
        assert.strictEqual(memberCommentRes.status, 201);

        // Check superadmin's notifications
        const superNotifsRes = await req('/api/notifications', {
            headers: { Authorization: `Bearer ${superWsToken}` }
        });
        assert.strictEqual(superNotifsRes.status, 200);
        const actionNotif = superNotifsRes.body.find((n: any) => n.type === 'team-action');
        assert.ok(actionNotif, 'Super admin manager must receive team-action notification');
        assert.ok(actionNotif.text.includes(standardUser.name), 'Notification text should mention the acting team member');

        // Verify standard user (actor) did NOT receive a self-notification
        const devNotifsRes = await req('/api/notifications', {
            headers: { Authorization: `Bearer ${devWsToken}` }
        });
        assert.strictEqual(devNotifsRes.status, 200);
        const devActionNotif = devNotifsRes.body.find((n: any) => n.type === 'team-action');
        assert.strictEqual(devActionNotif, undefined, 'Actor should not receive self-notification');

        console.log('✅ Step 7: Rule A: Team member actions automatically notified to workspace managers');

        // 8. Test Automation Rule B: Cards due within 24 hours trigger due-soon notification
        const dueSoonRes = await req('/api/cards', {
            method: 'POST',
            headers: { Authorization: `Bearer ${superWsToken}` },
            body: JSON.stringify({
                title: 'Kritik Güvenlik Güncellemesi',
                col: 'development',
                priority: 'high',
                assignee: standardUser.name,
                dueDate: new Date(Date.now() + 10 * 3600 * 1000).toISOString() // 10 hours from now (<24h)
            })
        });
        assert.strictEqual(dueSoonRes.status, 201);
        const dueSoonCard = dueSoonRes.body;

        // Fetch notifications (which internally triggers checkAndNotifyDueSoonCards)
        const afterDueCheckSuperNotifs = await req('/api/notifications', {
            headers: { Authorization: `Bearer ${superWsToken}` }
        });
        const dueSoonNotifForSuper = afterDueCheckSuperNotifs.body.find((n: any) => n.type === 'due-soon' && n.cardId === dueSoonCard.id);
        assert.ok(dueSoonNotifForSuper, 'Manager must receive due-soon notification for card expiring within 24h');

        const afterDueCheckDevNotifs = await req('/api/notifications', {
            headers: { Authorization: `Bearer ${devWsToken}` }
        });
        const dueSoonNotifForDev = afterDueCheckDevNotifs.body.find((n: any) => n.type === 'due-soon' && n.cardId === dueSoonCard.id);
        assert.ok(dueSoonNotifForDev, 'Assignee must receive due-soon notification for card expiring within 24h');

        // Test De-duplication: Requesting again should not add duplicate notifications
        const notifCountBefore = afterDueCheckSuperNotifs.body.filter((n: any) => n.type === 'due-soon' && n.cardId === dueSoonCard.id).length;
        const recheckRes = await req('/api/notifications', {
            headers: { Authorization: `Bearer ${superWsToken}` }
        });
        const notifCountAfter = recheckRes.body.filter((n: any) => n.type === 'due-soon' && n.cardId === dueSoonCard.id).length;
        assert.strictEqual(notifCountAfter, notifCountBefore, 'De-duplication must prevent multiple 24h alerts for the same ticket');

        console.log('✅ Step 8: Rule B: 24h deadline notifications & de-duplication verified');

        console.log('\n🎉 ALL ROADMAP ITEM TESTS PASSED PERFECTLY!\n');
    } finally {
        if (server) server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
});
