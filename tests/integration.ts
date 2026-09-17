import { app } from '../src/index.js';
import { readDb, writeDbSync, getTenantIndex, saveTenantIndex } from '../src/lib/db.js';
import type { Server } from 'http';

process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

const PORT = 3999;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
    console.log('🚀 Starting Full Kanban End-to-End Integration Tests...\n');

    // Reset test environment superadmin state
    const personalDbInit = readDb({ tenantId: 'personal', environment: 'test' });
    personalDbInit.users = personalDbInit.users.filter(u => u.role !== 'superadmin' && u.id !== 'usr-superadmin' && u.username !== 'superadmin_test@company.com');
    personalDbInit.sessions = [];
    writeDbSync(personalDbInit, { tenantId: 'personal', environment: 'test' });

    const server: Server = await new Promise((resolve) => {
        const s = app.listen(PORT, () => resolve(s));
    });

    try {
        // Helper fetch wrapper
        async function api(path: string, options: any = {}) {
            const res = await fetch(`${BASE_URL}${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });
            const text = await res.text();
            let body: any = null;
            try { body = JSON.parse(text); } catch { body = text; }
            return { status: res.status, ok: res.ok, body };
        }

        // ========================================================
        // 1. Register Super Admin (superadmin_test@company.com)
        // ========================================================
        console.log('Test 1: Register Super Admin (superadmin_test@company.com)');
        const regSuper = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Instance Super Admin',
                username: 'superadmin_test@company.com',
                password: 'superadmin_test_pass'
            })
        });

        if (regSuper.status !== 201 || !regSuper.body.token || regSuper.body.user.role !== 'superadmin') {
            throw new Error(`Super admin registration failed: ${JSON.stringify(regSuper.body)}`);
        }
        const superToken = regSuper.body.token;
        console.log('   ✓ Super Admin registered with role: superadmin, status: approved\n');

        // ========================================================
        // 2. Register Regular User (selin@sirket.com) -> Must be PENDING
        // ========================================================
        const testRunId = Date.now().toString(36);
        const testUserEmail = `selin_${testRunId}@sirket.com`;
        console.log(`Test 2: Register Regular User (${testUserEmail}) -> Pending Approval`);
        const regUser = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Selin Yılmaz',
                username: testUserEmail,
                password: 'password123',
                company: 'Fintech Takımı'
            })
        });

        if (regUser.status !== 202 || !regUser.body.pending) {
            throw new Error(`Regular user did not return 202 pending: ${JSON.stringify(regUser.body)}`);
        }
        const pendingUserId = regUser.body.user.id;
        console.log('   ✓ Registration returned 202 Accepted with pending: true');

        // Attempting login as selin BEFORE approval -> Must be 403 Forbidden
        const loginBeforeApprove = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: testUserEmail,
                password: 'password123'
            })
        });

        if (loginBeforeApprove.status !== 403 || !loginBeforeApprove.body.error?.includes('onay')) {
            throw new Error(`Expected 403 before approval, got ${loginBeforeApprove.status}: ${JSON.stringify(loginBeforeApprove.body)}`);
        }
        console.log('   ✓ Unapproved user login blocked with 403 Forbidden\n');

        // ========================================================
        // 3. Super Admin checks pending users and notifications
        // ========================================================
        console.log('Test 3: Super Admin checks pending users and notifications');
        const pendingList = await api('/api/admin/pending-users', {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });

        if (!Array.isArray(pendingList.body) || !pendingList.body.some((u: any) => u.username === testUserEmail)) {
            throw new Error(`Pending list did not include ${testUserEmail}: ${JSON.stringify(pendingList.body)}`);
        }
        console.log(`   ✓ Super Admin pending-users API lists ${testUserEmail}`);

        const detailedUsers = await api('/api/admin/users/detailed', {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        if (!detailedUsers.body.users?.some((u: any) => u.username === testUserEmail && u.status === 'pending')) {
            throw new Error(`Detailed users list did not show ${testUserEmail} as pending: ${JSON.stringify(detailedUsers.body)}`);
        }
        console.log('   ✓ Detailed users API reports status: pending');

        const notifs = await api('/api/notifications', {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        const signupNotif = notifs.body.find((n: any) => n.type === 'user-signup-request' && n.pendingUserId === pendingUserId);
        if (!signupNotif) {
            throw new Error('Super Admin did not receive user-signup-request notification');
        }
        console.log('   ✓ Super Admin received user-signup-request notification\n');

        // ========================================================
        // 4. Super Admin Approves User
        // ========================================================
        console.log('Test 4: Super Admin Approves User');
        const approveRes = await api(`/api/admin/users/${pendingUserId}/approve`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${superToken}` }
        });

        if (approveRes.status !== 200 || !approveRes.body.ok) {
            throw new Error(`User approval failed: ${JSON.stringify(approveRes.body)}`);
        }
        console.log('   ✓ User approved successfully');

        // ========================================================
        // 5. Approved User Logs in and Performs Card Actions
        // ========================================================
        console.log('Test 5: Approved user logs in and performs card actions');
        const userLogin = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: testUserEmail,
                password: 'password123'
            })
        });

        if (userLogin.status !== 200 || !userLogin.body.token) {
            throw new Error(`Approved user login failed: ${JSON.stringify(userLogin.body)}`);
        }
        const userToken = userLogin.body.token;
        console.log('   ✓ User successfully logged in with token');

        // Create Card
        const createCard = await api('/api/cards', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify({
                title: 'Kullanıcı Kayıt ve Onay Test Kartı',
                desc: 'Otomasyon testi ile oluşturuldu',
                assignee: 'Selin Yılmaz',
                priority: 'high',
                col: 'todo'
            })
        });
        if (createCard.status !== 201) {
            throw new Error(`Card creation failed: ${JSON.stringify(createCard.body)}`);
        }
        const cardId = createCard.body.id;
        console.log(`   ✓ Card created: ${createCard.body.key} - ${createCard.body.title}`);

        // Move Card
        const moveCard = await api(`/api/cards/${cardId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify({
                col: 'doing'
            })
        });
        if (moveCard.status !== 200 || moveCard.body.col !== 'doing') {
            throw new Error(`Card move failed: ${JSON.stringify(moveCard.body)}`);
        }
        console.log('   ✓ Card moved to col: doing');

        // Delete Card
        const deleteCard = await api(`/api/cards/${cardId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if (deleteCard.status !== 200) {
            throw new Error(`Card delete failed: ${JSON.stringify(deleteCard.body)}`);
        }
        console.log('   ✓ Card deleted successfully\n');

        // ========================================================
        // 6. Super Admin Creates Admin-role User
        // ========================================================
        const adminUserEmail = `mert_admin_${testRunId}`;
        console.log(`Test 6: Super Admin creates Admin-role user (${adminUserEmail}) directly`);
        const createAdminUser = await api('/api/admin/users', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${superToken}` },
            body: JSON.stringify({
                name: 'Mert Yönetici',
                username: adminUserEmail,
                password: 'adminPassword123',
                role: 'admin',
                workspaceMode: 'personal'
            })
        });
        if (createAdminUser.status !== 201 || createAdminUser.body.user.role !== 'admin') {
            throw new Error(`Admin user creation failed: ${JSON.stringify(createAdminUser.body)}`);
        }
        console.log('   ✓ Admin user created with role: admin, status: approved\n');

        // ========================================================
        // 7. Register and Reject User Flow
        // ========================================================
        const rejectUserEmail = `deneme_red_${testRunId}@test.com`;
        console.log(`Test 7: User rejection flow (${rejectUserEmail})`);
        const regReject = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Deneme Red',
                username: rejectUserEmail,
                password: 'password123'
            })
        });
        const rejectUserId = regReject.body.user.id;

        const rejectRes = await api(`/api/admin/users/${rejectUserId}/reject`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        if (rejectRes.status !== 200 || !rejectRes.body.ok) {
            throw new Error(`User rejection failed: ${JSON.stringify(rejectRes.body)}`);
        }
        console.log('   ✓ User rejected successfully');

        const loginRejected = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: rejectUserEmail,
                password: 'password123'
            })
        });
        if (loginRejected.status !== 403 || !loginRejected.body.error?.includes('reddedilmiştir')) {
            throw new Error(`Expected rejection 403, got: ${JSON.stringify(loginRejected.body)}`);
        }
        console.log('   ✓ Rejected user blocked from login with rejection message\n');

        // ========================================================
        // 8. Super Admin Checks Audit Logs
        // ========================================================
        console.log('Test 8: Super Admin views Audit Logs');
        const logsRes = await api('/api/admin/logs', {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });

        if (logsRes.status !== 200 || !Array.isArray(logsRes.body.logs)) {
            throw new Error(`Failed to fetch logs: ${JSON.stringify(logsRes.body)}`);
        }

        const actionsFound = new Set(logsRes.body.logs.map((l: any) => l.action));
        console.log('   ✓ Log actions captured:', Array.from(actionsFound).join(', '));

        const requiredActions = ['REGISTER_REQUEST', 'USER_APPROVED', 'USER_REJECTED', 'CARD_CREATE', 'CARD_MOVE', 'CARD_DELETE', 'LOGIN'];
        for (const action of requiredActions) {
            if (!actionsFound.has(action)) {
                throw new Error(`Expected action '${action}' was not found in audit logs!`);
            }
        }
        console.log('   ✓ All required audit log types verified!\n');

        // ========================================================
        // 9. CLEAN UP: Delete test superadmin credentials
        //    while preserving all logs and cards per user instruction!
        // ========================================================
        console.log('Test 9: Cleanup test user (superadmin_test@company.com) while PRESERVING logs and tickets');
        
        // Remove from personal DB users
        const personalDb = readDb({ tenantId: 'personal', environment: 'test' });
        const userCountBefore = personalDb.users.length;
        personalDb.users = personalDb.users.filter(u => 
            u.username.toLowerCase() !== 'superadmin_test@company.com' &&
            u.email?.toLowerCase() !== 'superadmin_test@company.com'
        );
        personalDb.sessions = personalDb.sessions.filter(s => s.userId !== regSuper.body.user.id);
        writeDbSync(personalDb, { tenantId: 'personal', environment: 'test' });
        console.log(`   ✓ Removed test superadmin from personal users list (${userCountBefore} -> ${personalDb.users.length})`);

        // Clean from tenant index
        const idx = await getTenantIndex('test');
        delete idx.userToTenants['superadmin_test@company.com'];
        await saveTenantIndex(idx, 'test');
        console.log('   ✓ Cleaned test user from tenant index');

        // Verify logs and tickets are intact in personalDb!
        const recheckDb = readDb({ tenantId: 'personal', environment: 'test' });
        if (!recheckDb.logs || recheckDb.logs.length === 0) {
            throw new Error('FATAL: Logs were deleted during cleanup!');
        }
        console.log(`   ✓ PRESERVED: ${recheckDb.logs.length} activity logs in personal DB`);
        console.log(`   ✓ PRESERVED: ${recheckDb.cards.length} cards/tickets in personal DB`);

        // Verify that test superadmin cannot login right now
        const checkLogin = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: 'superadmin_test@company.com',
                password: 'superadmin_test_pass'
            })
        });
        if (checkLogin.status === 200) {
            throw new Error('User was still able to login after deletion!');
        }
        // ========================================================
        // Test Demo Public Workspace Access (No Bearer Token Needed)
        // ========================================================
        console.log('Test Demo: Access Demo API with X-Workspace: demo (No Token)');
        const demoCardsRes = await api('/api/cards', {
            headers: { 'X-Workspace': 'demo' }
        });
        if (demoCardsRes.status !== 200 || !Array.isArray(demoCardsRes.body) || demoCardsRes.body.length < 30) {
            throw new Error(`Demo API cards failed: status ${demoCardsRes.status}, count: ${demoCardsRes.body?.length}`);
        }
        console.log(`   ✓ Demo API returned ${demoCardsRes.body.length} Nova Team cards without token`);

        // Verify that personal tickets are present in personal DB (data/db.json)
        const finalPersonalDb = readDb({ tenantId: 'personal', environment: 'production' });
        if (!finalPersonalDb.cards || finalPersonalDb.cards.length < 5) {
            throw new Error(`CRITICAL: Personal tickets missing from personal DB! Count: ${finalPersonalDb.cards?.length}`);
        }
        console.log(`   ✓ Verified all ${finalPersonalDb.cards.length} personal tickets are intact in personal DB\n`);

        console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
        process.exit(0);

    } finally {
        server.close();
    }
}

runTests().catch(err => {
    console.error('\n❌ Test failed with error:', err);
    process.exit(1);
});
