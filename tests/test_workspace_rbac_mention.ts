process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// ============================================================
//  tests/test_workspace_rbac_mention.ts
//  Verification of:
//  1. Workspace CRUD & Member Assignment (Super Admin / Admin)
//  2. Strict RBAC (Standard user blocked from admin endpoints)
//  3. Comment @Mentions & Notifications (Assignee & Mentioned Teammates)
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { adminRouter } from '../src/routes/admin.js';
import { cardRouter } from '../src/routes/cards.js';
import { notificationsRouter } from '../src/routes/notifications.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword, getTenantIndex, saveTenantIndex } from '../src/lib/db.js';
import type { User } from '../src/types/index.js';

initDb();

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cards', requireAuth, cardRouter);
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
    console.log('🚀 Starting Workspace Management, RBAC & Comment Mentions Test Suite...\n');

    server = app.listen(0);
    port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const testSuffix = Date.now().toString(36);
        const superadminEmail = `yigitcan_super_${testSuffix}@company.com`;
        const regularEmail = `user_ali_${testSuffix}@company.com`;
        const teammateEmail = `user_zeynep_${testSuffix}@company.com`;
        const password = 'Password123!';

        // ── Step 1: Setup Super Admin & Users ─────────────────
        console.log('🔹 Phase 1: Setup Accounts (Superadmin, Regular User, Teammate)...');

        // Create Super Admin in personalDb
        const personalDb = readDb({ tenantId: 'personal', environment: 'test' });
        const superId = `usr-super-${testSuffix}`;
        const superUser: User = {
            id: superId,
            username: superadminEmail,
            email: superadminEmail,
            name: 'Yiğitcan Genç',
            passwordHash: hashPassword(password),
            avatarColor: '#0ea5e9',
            role: 'superadmin',
            status: 'approved',
            tenantId: 'personal',
            workspaces: ['personal'],
            createdAt: Date.now()
        };
        personalDb.users.push(superUser);

        // Regular User
        const regularId = `usr-reg-${testSuffix}`;
        const regularUser: User = {
            id: regularId,
            username: regularEmail,
            email: regularEmail,
            name: 'Ali Veli',
            passwordHash: hashPassword(password),
            avatarColor: '#10b981',
            role: 'user',
            status: 'approved',
            tenantId: 'personal',
            workspaces: ['personal'],
            createdAt: Date.now()
        };
        personalDb.users.push(regularUser);

        // Teammate
        const teamId = `usr-team-${testSuffix}`;
        const teamUser: User = {
            id: teamId,
            username: teammateEmail,
            email: teammateEmail,
            name: 'Zeynep Kaya',
            passwordHash: hashPassword(password),
            avatarColor: '#f59e0b',
            role: 'user',
            status: 'approved',
            tenantId: 'personal',
            workspaces: ['personal'],
            createdAt: Date.now()
        };
        personalDb.users.push(teamUser);

        writeDbSync(personalDb, { tenantId: 'personal', environment: 'test' });

        const tenantIndex = await getTenantIndex('test');
        tenantIndex.userToTenants[superadminEmail] = ['personal'];
        tenantIndex.userToTenants[regularEmail] = ['personal'];
        tenantIndex.userToTenants[teammateEmail] = ['personal'];
        await saveTenantIndex(tenantIndex, 'test');

        // Login Superadmin
        const superLogin = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: superadminEmail, password })
        });
        assert.strictEqual(superLogin.status, 200, 'Superadmin login failed');
        const superToken = superLogin.body.token;

        // Login Regular User
        const regLogin = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: regularEmail, password })
        });
        assert.strictEqual(regLogin.status, 200, 'Regular user login failed');
        const regToken = regLogin.body.token;

        // Login Teammate
        const teamLogin = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: teammateEmail, password })
        });
        assert.strictEqual(teamLogin.status, 200, 'Teammate login failed');
        const teamToken = teamLogin.body.token;

        console.log('   ✓ Accounts created and authenticated successfully.');

        // ── Step 2: RBAC Verification for Standard User ───────
        console.log('\n🔹 Phase 2: Testing Strict RBAC (Standard User Denied from Admin Endpoints)...');

        // Regular user should get 403 on /api/admin/users
        const regGetUsers = await req('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${regToken}` }
        });
        assert.strictEqual(regGetUsers.status, 403, 'Standard user must get 403 on /api/admin/users');
        console.log('   ✓ Standard user correctly blocked from /api/admin/users (403 Forbidden)');

        // Regular user should get 403 on /api/admin/workspaces (POST)
        const regCreateWs = await req('/api/admin/workspaces', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${regToken}` },
            body: JSON.stringify({ name: 'İzinsiz Pano' })
        });
        assert.strictEqual(regCreateWs.status, 403, 'Standard user must get 403 on creating workspaces');
        console.log('   ✓ Standard user correctly blocked from creating workspaces (403 Forbidden)');

        // Regular user should get 403 on /api/admin/workspaces/:id (PUT)
        const regUpdateWs = await req('/api/admin/workspaces/personal', {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${regToken}` },
            body: JSON.stringify({ name: 'Yeni Ad' })
        });
        assert.strictEqual(regUpdateWs.status, 403, 'Standard user must get 403 on updating workspaces');
        console.log('   ✓ Standard user correctly blocked from updating workspaces (403 Forbidden)');

        // ── Step 3: Super Admin Workspace CRUD & Member Assignment ──
        console.log('\n🔹 Phase 3: Super Admin Workspace Management (Create, Edit, Assign Members, Delete)...');

        // 3a: Create Workspace
        const createRes = await req('/api/admin/workspaces', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${superToken}` },
            body: JSON.stringify({
                name: 'Mobil Uygulama Takımı',
                description: 'iOS ve Android mobil geliştirme projeleri.',
                memberIds: [regularId, teamId]
            })
        });
        assert.strictEqual(createRes.status, 201, 'Workspace creation failed');
        const createdWs = createRes.body.workspace;
        assert.strictEqual(createdWs.name, 'Mobil Uygulama Takımı');
        const newWsId = createdWs.id;
        console.log(`   ✓ Workspace created: '${createdWs.name}' (ID: ${newWsId})`);

        // 3b: Verify Workspace in GET /api/admin/workspaces with enriched members
        const getWsRes = await req('/api/admin/workspaces', {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        assert.strictEqual(getWsRes.status, 200);
        const wsObj = getWsRes.body.workspaces.find((w: any) => w.id === newWsId);
        assert(wsObj, 'Created workspace must be in workspaces list');
        assert(wsObj.members.length >= 2, `Workspace must have assigned members, got: ${wsObj.members.length}`);
        console.log(`   ✓ Enriched workspace verified with ${wsObj.members.length} members`);

        // 3c: Edit Workspace Name & Description
        const editRes = await req(`/api/admin/workspaces/${newWsId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${superToken}` },
            body: JSON.stringify({
                name: 'Mobil & Tablet Takımı',
                description: 'Yeni nesil çoklu platform projeleri.'
            })
        });
        assert.strictEqual(editRes.status, 200, 'Workspace update failed');
        assert.strictEqual(editRes.body.workspace.name, 'Mobil & Tablet Takımı');
        console.log(`   ✓ Workspace updated to: '${editRes.body.workspace.name}'`);

        // 3d: Get Workspace Members
        const getMembersRes = await req(`/api/admin/workspaces/${newWsId}/members`, {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        assert.strictEqual(getMembersRes.status, 200);
        assert(Array.isArray(getMembersRes.body.members));
        console.log(`   ✓ Workspace members endpoint returned ${getMembersRes.body.members.length} members`);

        // 3e: Update Workspace Members (Make Ali an admin in this workspace)
        const updateMembersRes = await req(`/api/admin/workspaces/${newWsId}/members`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${superToken}` },
            body: JSON.stringify({
                members: [
                    { userId: regularId, role: 'admin' },
                    { userId: teamId, role: 'member' }
                ]
            })
        });
        assert.strictEqual(updateMembersRes.status, 200);
        console.log('   ✓ Workspace members updated with roles');

        // 3f: Test Super Admin workspace switching to any workspace
        const switchRes = await req('/api/auth/switch-workspace', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${superToken}` },
            body: JSON.stringify({ workspaceId: newWsId })
        });
        assert.strictEqual(switchRes.status, 200, 'Super admin should switch to newly created workspace without 403');
        assert(switchRes.body.token, 'Must return new workspace token');
        
        // Verify me with switched token
        const switchedMe = await req('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${switchRes.body.token}` }
        });
        assert.strictEqual(switchedMe.status, 200, 'Super admin authenticated in target workspace');
        assert.strictEqual(switchedMe.body.role, 'superadmin');
        console.log(`   ✓ Super Admin switched to '${newWsId}' seamlessly`);

        // Test switching back to personal
        const switchBackRes = await req('/api/auth/switch-workspace', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${switchRes.body.token}` },
            body: JSON.stringify({ workspaceId: 'personal' })
        });
        assert.strictEqual(switchBackRes.status, 200, 'Super admin switched back to personal');
        console.log('   ✓ Super Admin switched back to personal workspace');

        // ── Step 4: Card Creation, Commenting, @Mention & Notifications ──
        console.log('\n🔹 Phase 4: Testing Card Commenting, @Mentions & Notifications...');

        // Create a card assigned to Zeynep
        const cardRes = await req('/api/cards', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${superToken}` },
            body: JSON.stringify({
                title: 'Ödeme Entegrasyonu Geliştirme',
                desc: 'Stripe ve Iyzico entegrasyon adımları',
                assignee: 'Zeynep Kaya',
                priority: 'high',
                col: 'todo'
            })
        });
        assert.strictEqual(cardRes.status, 201);
        const card = cardRes.body;
        console.log(`   ✓ Card created: '${card.title}' (${card.key}) assigned to: ${card.assignee}`);

        // Ali comments and mentions Superadmin (@yigitcan_super)
        const commentRes = await req(`/api/cards/${card.id}/comments`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${regToken}` },
            body: JSON.stringify({
                text: `Merhaba @${superadminEmail}, ödeme akışını inceleyebilir misin? @Zeynep Kaya da baksın.`
            })
        });
        assert.strictEqual(commentRes.status, 201);
        assert(commentRes.body.comment);
        console.log('   ✓ Ali commented with mentions: @SuperAdmin and @Zeynep');

        // Check Notifications for Super Admin (was mentioned)
        const superNotifsRes = await req('/api/notifications', {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        assert.strictEqual(superNotifsRes.status, 200);
        const superMentionNotif = superNotifsRes.body.find((n: any) =>
            n.cardId === card.id && (n.type === 'mention' || n.text.includes('sizden bahsetti'))
        );
        assert(superMentionNotif, 'Super Admin must receive a mention notification');
        console.log(`   ✓ Super Admin received notification: "${superMentionNotif.text}"`);

        // Check Notifications for Zeynep (was assignee AND mentioned)
        const teamNotifsRes = await req('/api/notifications', {
            headers: { 'Authorization': `Bearer ${teamToken}` }
        });
        assert.strictEqual(teamNotifsRes.status, 200);
        const teamNotif = teamNotifsRes.body.find((n: any) => n.cardId === card.id);
        assert(teamNotif, 'Zeynep must receive a notification for her card / mention');
        console.log(`   ✓ Teammate (Assignee) received notification: "${teamNotif.text}"`);

        // 3f: Clean up created workspace
        const delRes = await req(`/api/admin/workspaces/${newWsId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        assert.strictEqual(delRes.status, 200);
        console.log('   ✓ Workspace successfully deleted');

        // Cleanup test users from personalDb
        const freshDb = readDb({ tenantId: 'personal', environment: 'test' });
        freshDb.users = freshDb.users.filter(u => u.id !== superId && u.id !== regularId && u.id !== teamId);
        freshDb.cards = freshDb.cards.filter(c => c.id !== card.id);
        writeDbSync(freshDb, { tenantId: 'personal', environment: 'test' });

        console.log('\n🎉 ALL WORKSPACE MANAGEMENT, RBAC & COMMENT MENTION TESTS PASSED WITH 100% SUCCESS!\n');
    } finally {
        if (server) server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    if (server) server.close();
    process.exit(1);
});
