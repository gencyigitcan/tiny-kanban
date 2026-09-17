import { app } from '../src/index.js';
import { getTenantIndex, readDb, saveTenantIndex, writeDbSync } from '../src/lib/db.js';

let server: any;
let baseUrl: string;

async function api(path: string, options: any = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    let body: any;
    const text = await res.text();
    try {
        body = JSON.parse(text);
    } catch {
        body = text;
    }
    return { status: res.status, body, headers: res.headers };
}

async function runTenantIsolationTests() {
    console.log('🚀 Starting Universal Tenant Isolation & Cross-Assignment Security Tests...\n');

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const runId = Math.random().toString(36).substring(2, 7);

        // 1. Register Super Admin to approve users
        const superRes = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: 'superadmin_iso@company.com',
                password: 'SuperPassword123!',
                name: 'Super Admin'
            })
        });
        const superToken = superRes.body.token;

        // 2. Register User Alpha
        const userAlphaEmail = `alpha_${runId}@company.com`;
        await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: userAlphaEmail,
                password: 'AlphaPassword123!',
                name: 'Alpha User'
            })
        });

        // 3. Register User Beta
        const userBetaEmail = `beta_${runId}@company.com`;
        await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: userBetaEmail,
                password: 'BetaPassword123!',
                name: 'Beta User'
            })
        });

        // Approve both users
        const pendingList = await api('/api/admin/pending-users', {
            headers: { Authorization: `Bearer ${superToken}` }
        });
        const alphaPending = pendingList.body.find((u: any) => u.username === userAlphaEmail);
        const betaPending = pendingList.body.find((u: any) => u.username === userBetaEmail);

        await api(`/api/admin/users/${alphaPending.id}/approve`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${superToken}` }
        });
        await api(`/api/admin/users/${betaPending.id}/approve`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${superToken}` }
        });

        // 4. Log in as User Alpha
        const alphaLogin = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: userAlphaEmail, password: 'AlphaPassword123!' })
        });
        const alphaToken = alphaLogin.body.token;

        // Check active workspace of Alpha: MUST NOT be 'personal'
        if (alphaLogin.body.activeWorkspaceId === 'personal') {
            throw new Error('SECURITY VIOLATION: Non-superadmin defaulted to personal workspace!');
        }
        console.log('   ✓ User Alpha isolated tenant:', alphaLogin.body.activeWorkspaceId);

        // 5. User Alpha checks GET /api/users
        const alphaUsers = await api('/api/users', {
            headers: { Authorization: `Bearer ${alphaToken}` }
        });
        const hasSuperInAlpha = alphaUsers.body.some((u: any) => u.name === 'Super Admin' || u.username === 'superadmin_iso@company.com');
        const hasBetaInAlpha = alphaUsers.body.some((u: any) => u.name === 'Beta User');
        if (hasSuperInAlpha) throw new Error('SECURITY LEAK: Super Admin leaked to User Alpha!');
        if (hasBetaInAlpha) throw new Error('SECURITY LEAK: User Beta leaked to User Alpha!');
        console.log('   ✓ User Alpha only sees isolated users (No Super Admin, No User Beta)');

        // 6. User Alpha attempts cross-assignment to Super Admin
        const crossAssignRes = await api('/api/cards', {
            method: 'POST',
            headers: { Authorization: `Bearer ${alphaToken}` },
            body: JSON.stringify({
                title: 'Malicious assignment to Super Admin',
                assignee: 'Super Admin'
            })
        });
        if (crossAssignRes.status !== 400) {
            throw new Error(`SECURITY VIOLATION: Cross-assignment to Super Admin returned ${crossAssignRes.status} instead of 400 Bad Request!`);
        }
        console.log('   ✓ Cross-assignment to Super Admin blocked with 400 Bad Request');

        // 7. User Alpha attempts cross-assignment to User Beta
        const crossAssignBeta = await api('/api/cards', {
            method: 'POST',
            headers: { Authorization: `Bearer ${alphaToken}` },
            body: JSON.stringify({
                title: 'Malicious assignment to User Beta',
                assignee: 'User Beta'
            })
        });
        if (crossAssignBeta.status !== 400) {
            throw new Error(`SECURITY VIOLATION: Cross-assignment to User Beta returned ${crossAssignBeta.status} instead of 400 Bad Request!`);
        }
        console.log('   ✓ Cross-assignment to Beta User blocked with 400 Bad Request');

        // 8. User Alpha attempts valid assignment to teammate in their workspace
        const validAssignRes = await api('/api/cards', {
            method: 'POST',
            headers: { Authorization: `Bearer ${alphaToken}` },
            body: JSON.stringify({
                title: 'Valid teammate task',
                assignee: 'Alpha User'
            })
        });
        if (validAssignRes.status !== 201) {
            throw new Error(`Valid teammate assignment failed with ${validAssignRes.status}!`);
        }
        console.log('   ✓ Valid assignment to teammate/self succeeded');

        // 9. User Alpha attempts unauthorized switch to personal workspace
        const switchRes = await api('/api/auth/switch-workspace', {
            method: 'POST',
            headers: { Authorization: `Bearer ${alphaToken}` },
            body: JSON.stringify({ workspaceId: 'personal' })
        });
        if (switchRes.status !== 403) {
            throw new Error(`SECURITY VIOLATION: Unauthorized switch to personal returned ${switchRes.status} instead of 403 Forbidden!`);
        }
        console.log('   ✓ Unauthorized switch to personal workspace blocked with 403 Forbidden');

        // Cleanup superadmin user
        const personalDb = readDb({ tenantId: 'personal', environment: 'test' });
        personalDb.users = personalDb.users.filter(u => u.username !== 'superadmin_iso@company.com');
        writeDbSync(personalDb, { tenantId: 'personal', environment: 'test' });

        console.log('\n🎉 ALL UNIVERSAL TENANT ISOLATION TESTS PASSED WITH 100% SUCCESS!\n');
    } finally {
        server.close();
    }
}

runTenantIsolationTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
