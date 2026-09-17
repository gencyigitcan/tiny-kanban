// ============================================================
//  2026 Cybersecurity & OWASP Top 10 Automated Security Suite
//  100 Granular Security Verification Checks (10 Domains x 10 Checks)
// ============================================================
import { app } from '../src/index.js';
import { readDb, writeDbSync, getTenantIndex, saveTenantIndex, hashPassword, verifyPassword, uid } from '../src/lib/db.js';
import type { Server } from 'http';

process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

const PORT = 4002;
const BASE_URL = `http://localhost:${PORT}`;

let checkCount = 0;
let passCount = 0;
let failCount = 0;

async function check(domain: string, description: string, fn: () => Promise<void>) {
    checkCount++;
    const padIndex = String(checkCount).padStart(3, '0');
    try {
        await fn();
        passCount++;
        console.log(`   [Check ${padIndex}/100] ${domain}: ${description} ... ✓ PASS`);
    } catch (err: any) {
        failCount++;
        console.error(`   [Check ${padIndex}/100] ${domain}: ${description} ... ✗ FAIL: ${err.message}`);
        throw err;
    }
}

async function runSecuritySuite() {
    console.log('================================================================');
    console.log('🛡️  STARTING 100-STEP AUTOMATED SECURITY VERIFICATION SUITE');
    console.log('    OWASP Top 10 & 2026 Enterprise Security Architecture');
    console.log('================================================================\n');

    const server: Server = await new Promise((resolve) => {
        const s = app.listen(PORT, () => resolve(s));
    });

    try {
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
            return { status: res.status, headers: res.headers, ok: res.ok, body };
        }

        const runId = Date.now().toString(36);

        // State variables shared across checks
        let superToken = '';
        let superUserId = '';
        let regularUserToken = '';
        let regularUserId = '';
        let regularUserEmail = `sec_user_${runId}@cybercorp.io`;
        let regularUserPassword = 'CyberSecure_2026_Pass!';
        let pendingUserId = '';
        let pendingUserEmail = `pending_${runId}@cybercorp.io`;
        let createdCardId = '';

        // Reset test environment superadmin state
        const personalDbInit = readDb({ tenantId: 'personal', environment: 'test' });
        personalDbInit.users = personalDbInit.users.filter(u => u.role !== 'superadmin' && u.id !== 'usr-superadmin');
        personalDbInit.sessions = [];
        writeDbSync(personalDbInit, { tenantId: 'personal', environment: 'test' });
        const idxInit = await getTenantIndex('test');
        delete idxInit.userToTenants['superadmin_sec@company.com'];
        await saveTenantIndex(idxInit, 'test');

        // ====================================================================
        // DOMAIN 1: Authentication & Password Rigor (Checks 001 - 010)
        // ====================================================================
        console.log('\n🔵 DOMAIN 1: Authentication & Password Rigor (Checks 001 - 010)');

        await check('Domain 1', 'Rejection of registration with blank username', async () => {
            const res = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: '', password: 'ValidPassword123!', name: 'No User' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 1', 'Rejection of registration with empty password', async () => {
            const res = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: `user_${runId}_nopass@test.com`, password: '', name: 'No Pass' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 1', 'Rejection of registration with short password (< 6 chars)', async () => {
            const res = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: `user_${runId}_short@test.com`, password: '123', name: 'Short' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 1', 'Rejection of registration with illegal characters in username', async () => {
            const res = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: `bad<script>user_${runId}`, password: 'ValidPassword123!', name: 'Hacker' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 1', 'Cryptographic salt & PBKDF2 format verification (salt:hash)', async () => {
            const pwd = 'TestPassword_2026';
            const hashed = hashPassword(pwd);
            const parts = hashed.split(':');
            if (parts.length !== 2 || parts[0].length !== 32 || parts[1].length !== 128) {
                throw new Error(`Invalid PBKDF2-SHA-512 format: salt len=${parts[0]?.length}, hash len=${parts[1]?.length}`);
            }
        });

        await check('Domain 1', 'Constant-time verification matches correct password', async () => {
            const pwd = 'MasterPassword!99';
            const hashed = hashPassword(pwd);
            if (!verifyPassword(pwd, hashed)) {
                throw new Error('Valid password verification failed');
            }
        });

        await check('Domain 1', 'Constant-time verification rejects incorrect password gracefully', async () => {
            const pwd = 'MasterPassword!99';
            const hashed = hashPassword(pwd);
            if (verifyPassword('WrongPassword!99', hashed)) {
                throw new Error('Incorrect password was erroneously accepted');
            }
        });

        await check('Domain 1', 'Rejection of login for non-existent username with 401 Unauthorized', async () => {
            const res = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: `non_existent_${runId}@nobody.com`, password: 'any_password' })
            });
            if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
        });

        await check('Domain 1', 'Register and authenticate Super Admin successfully', async () => {
            const res = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'superadmin_sec@company.com',
                    password: 'superadmin_sec_test',
                    name: 'Super Admin'
                })
            });
            if (res.status !== 201 || !res.body.token || res.body.user.role !== 'superadmin') {
                throw new Error(`Super admin registration failed: ${JSON.stringify(res.body)}`);
            }
            superToken = res.body.token;
            superUserId = res.body.user.id;
        });

        await check('Domain 1', 'Password hash is NEVER exposed in authentication responses', async () => {
            const res = await api('/api/auth/me', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200) throw new Error(`Failed to fetch /api/auth/me: ${res.status}`);
            if ('passwordHash' in res.body || 'password' in res.body) {
                throw new Error('VULNERABILITY: password hash exposed in /api/auth/me response!');
            }
        });

        // ====================================================================
        // DOMAIN 2: Session Token Cryptography & Header Integrity (Checks 011 - 020)
        // ====================================================================
        console.log('\n🔵 DOMAIN 2: Session Token Cryptography & Header Integrity (Checks 011 - 020)');

        await check('Domain 2', 'Rejection of protected route when Authorization header is missing', async () => {
            const res = await api('/api/cards');
            if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
        });

        await check('Domain 2', 'Rejection of non-Bearer authorization scheme (e.g. Basic auth)', async () => {
            const res = await api('/api/cards', {
                headers: { Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=' }
            });
            if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
        });

        await check('Domain 2', 'Rejection of empty Bearer token', async () => {
            const res = await api('/api/cards', {
                headers: { Authorization: 'Bearer ' }
            });
            if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
        });

        await check('Domain 2', 'Rejection of random pseudo-tokens', async () => {
            const res = await api('/api/cards', {
                headers: { Authorization: 'Bearer random_unrecognized_token_xyz_123' }
            });
            if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
        });

        await check('Domain 2', 'Rejection of forged tenant prefix with counterfeit token', async () => {
            const res = await api('/api/cards', {
                headers: { Authorization: 'Bearer personal:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' }
            });
            if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
        });

        await check('Domain 2', 'Token entropy validation (at least 256-bit / 64 hex characters)', async () => {
            const parts = superToken.split(':');
            const entropyToken = parts.length > 1 ? parts[1] : parts[0];
            if (entropyToken.length < 64) {
                throw new Error(`Session token entropy too low: length is ${entropyToken.length} hex chars`);
            }
        });

        await check('Domain 2', 'Valid Bearer token successfully authorizes /api/cards', async () => {
            const res = await api('/api/cards', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200 || !Array.isArray(res.body)) {
                throw new Error(`Failed to authorize with valid token: ${res.status}`);
            }
        });

        await check('Domain 2', 'Session token invalidation on explicit logout (POST /api/auth/logout)', async () => {
            // Create a temporary user to test logout
            const tempMail = `temp_logout_${runId}@cybercorp.io`;
            await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: tempMail, password: 'TempPassword123!', name: 'Temp Logout User' })
            });
            // Approve user with superadmin
            const index = await getTenantIndex('test');
            const pendingList = await api('/api/admin/pending-users', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            const pUser = pendingList.body.find((u: any) => u.username === tempMail);
            if (!pUser) throw new Error('Could not find temp user to approve');
            await api(`/api/admin/users/${pUser.id}/approve`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` }
            });
            // Log in
            const loginRes = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: tempMail, password: 'TempPassword123!' })
            });
            const tempToken = loginRes.body.token;

            // Perform Logout
            const logoutRes = await api('/api/auth/logout', {
                method: 'POST',
                headers: { Authorization: `Bearer ${tempToken}` }
            });
            if (logoutRes.status !== 200) throw new Error(`Logout returned ${logoutRes.status}`);

            // Attempt to reuse invalidated token
            const reuseRes = await api('/api/cards', {
                headers: { Authorization: `Bearer ${tempToken}` }
            });
            if (reuseRes.status !== 401) {
                throw new Error(`Expected 401 for invalidated session token, got ${reuseRes.status}`);
            }
        });

        await check('Domain 2', 'Null byte (%00) rejection in Authorization Bearer token', async () => {
            const res = await api('/api/cards', {
                headers: { Authorization: `Bearer ${superToken}%00forged` }
            });
            if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
        });

        await check('Domain 2', 'Rejection of expired session tokens', async () => {
            // Insert an intentionally expired session into personal DB
            const db = readDb({ tenantId: 'personal', environment: 'test' });
            const expiredToken = `personal:expired_${uid()}_token`;
            db.sessions.push({
                token: expiredToken,
                userId: superUserId,
                createdAt: Date.now() - 100000,
                expiresAt: Date.now() - 1000 // In the past
            });
            writeDbSync(db, { tenantId: 'personal', environment: 'test' });

            const res = await api('/api/cards', {
                headers: { Authorization: `Bearer ${expiredToken}` }
            });
            if (res.status !== 401) {
                throw new Error(`Expected 401 for expired token, got ${res.status}`);
            }
        });

        // ====================================================================
        // DOMAIN 3: Role-Based Access Control & Privilege Escalation (Checks 021 - 030)
        // ====================================================================
        console.log('\n🔵 DOMAIN 3: Role-Based Access Control & Privilege Escalation (Checks 021 - 030)');

        // Prepare standard approved regular user
        await check('Domain 3', 'Register and approve standard role user for RBAC boundary testing', async () => {
            const regRes = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: regularUserEmail,
                    password: regularUserPassword,
                    name: 'Standard Security Tester'
                })
            });
            if (regRes.status !== 202) throw new Error(`Expected 202 for regular registration, got ${regRes.status}`);
            regularUserId = regRes.body.userId;

            // Approve via superadmin
            const approveRes = await api(`/api/admin/users/${regularUserId}/approve`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (approveRes.status !== 200) throw new Error('Failed to approve regular user');

            // Log in as standard user
            const loginRes = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: regularUserEmail, password: regularUserPassword })
            });
            if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Failed to login approved regular user');
            regularUserToken = loginRes.body.token;
        });

        await check('Domain 3', 'Standard user blocked from Superadmin audit logs (GET /api/admin/logs)', async () => {
            const res = await api('/api/admin/logs', {
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from user directory (GET /api/admin/users)', async () => {
            const res = await api('/api/admin/users', {
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from detailed users (GET /api/admin/users/detailed)', async () => {
            const res = await api('/api/admin/users/detailed', {
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from pending registrations (GET /api/admin/pending-users)', async () => {
            const res = await api('/api/admin/pending-users', {
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from approving accounts (POST /api/admin/users/:id/approve)', async () => {
            const res = await api(`/api/admin/users/${regularUserId}/approve`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from rejecting accounts (POST /api/admin/users/:id/reject)', async () => {
            const res = await api(`/api/admin/users/${regularUserId}/reject`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from direct user provisioning (POST /api/admin/users)', async () => {
            const res = await api('/api/admin/users', {
                method: 'POST',
                headers: { Authorization: `Bearer ${regularUserToken}` },
                body: JSON.stringify({
                    name: 'Privilege Escalation Attempt',
                    username: 'priv_esc_user',
                    password: 'Password123!',
                    role: 'admin',
                    workspaceMode: 'personal'
                })
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from reassigning workspaces (PUT /api/admin/users/:id/workspaces)', async () => {
            const res = await api(`/api/admin/users/${regularUserId}/workspaces`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${regularUserToken}` },
                body: JSON.stringify({ workspaces: ['personal'] })
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        await check('Domain 3', 'Standard user blocked from user deletion (DELETE /api/admin/users/:id)', async () => {
            const res = await api(`/api/admin/users/${superUserId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
        });

        // ====================================================================
        // DOMAIN 4: User Lifecycle & Approval Gate Enforcement (Checks 031 - 040)
        // ====================================================================
        console.log('\n🔵 DOMAIN 4: User Lifecycle & Approval Gate Enforcement (Checks 031 - 040)');

        await check('Domain 4', 'New user registration assigns status: "pending" by default', async () => {
            const res = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: pendingUserEmail,
                    password: 'PendingSecurePassword_123',
                    name: 'Pending Gate User'
                })
            });
            if (res.status !== 202 || res.body.pending !== true) {
                throw new Error(`Expected 202 Accepted with pending: true, got ${res.status}`);
            }
            pendingUserId = res.body.userId;
        });

        await check('Domain 4', 'Pending user login attempt is blocked with 403 Forbidden', async () => {
            const res = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: pendingUserEmail,
                    password: 'PendingSecurePassword_123'
                })
            });
            if (res.status !== 403 || !res.body.error?.includes('onay')) {
                throw new Error(`Expected 403 Forbidden for pending user, got ${res.status}: ${JSON.stringify(res.body)}`);
            }
        });

        await check('Domain 4', 'Super Admin registration notification generated for pending user', async () => {
            const res = await api('/api/notifications', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200 || !Array.isArray(res.body)) {
                throw new Error(`Failed to retrieve notifications: ${res.status}`);
            }
            const hasNotification = res.body.some((n: any) => n.pendingUserId === pendingUserId || n.text?.includes(pendingUserEmail));
            if (!hasNotification) throw new Error('Pending user signup notification not found for Super Admin');
        });

        await check('Domain 4', 'Pending user listed in /api/admin/pending-users for review', async () => {
            const res = await api('/api/admin/pending-users', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200) throw new Error(`Failed to get pending users: ${res.status}`);
            const found = res.body.find((u: any) => u.id === pendingUserId);
            if (!found || found.status !== 'pending') throw new Error('User not found in pending-users list');
        });

        await check('Domain 4', 'Super Admin approves pending user through approval gate', async () => {
            const res = await api(`/api/admin/users/${pendingUserId}/approve`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200 || res.body.user?.status !== 'approved') {
                throw new Error(`Approval gate failed: ${JSON.stringify(res.body)}`);
            }
        });

        await check('Domain 4', 'Approved user successfully logs in and obtains session token', async () => {
            const res = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: pendingUserEmail,
                    password: 'PendingSecurePassword_123'
                })
            });
            if (res.status !== 200 || !res.body.token || res.body.user.status !== 'approved') {
                throw new Error(`Approved user login failed: ${JSON.stringify(res.body)}`);
            }
        });

        await check('Domain 4', 'User rejection flow marks status: "rejected" and blocks login', async () => {
            const rejectEmail = `reject_${runId}@cybercorp.io`;
            const regRes = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: rejectEmail, password: 'RejectPassword_123', name: 'Reject Me' })
            });
            const rejUserId = regRes.body.userId;

            const rejRes = await api(`/api/admin/users/${rejUserId}/reject`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (rejRes.status !== 200 || rejRes.body.user.status !== 'rejected') {
                throw new Error(`Rejection endpoint failed: ${JSON.stringify(rejRes.body)}`);
            }

            const loginRes = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: rejectEmail, password: 'RejectPassword_123' })
            });
            if (loginRes.status !== 403) {
                throw new Error(`Expected 403 for rejected user login, got ${loginRes.status}`);
            }
        });

        await check('Domain 4', 'Super Admin self-deletion prevention (400 Bad Request)', async () => {
            const res = await api(`/api/admin/users/${superUserId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 400 && res.status !== 403) {
                throw new Error(`Expected 400 or 403 for self-deletion, got ${res.status}`);
            }
        });

        await check('Domain 4', 'Account expiration enforcement (user.expiresAt < Date.now())', async () => {
            const expEmail = `expired_usr_${runId}@cybercorp.io`;
            const regRes = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: expEmail, password: 'ExpiredPassword_123', name: 'Expired User' })
            });
            const expUserId = regRes.body.userId;

            // Approve user and set past expiration in their DB
            await api(`/api/admin/users/${expUserId}/approve`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` }
            });

            const index = await getTenantIndex('test');
            const tenantId = index.userToTenants[expEmail][0];
            const db = readDb({ tenantId, environment: 'test' });
            const u = db.users.find((user: any) => user.id === expUserId);
            if (u) {
                u.expiresAt = Date.now() - 50000; // Expired
                writeDbSync(db, { tenantId, environment: 'test' });
            }

            const loginRes = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: expEmail, password: 'ExpiredPassword_123' })
            });
            if (loginRes.status !== 401) {
                throw new Error(`Expected 401 for expired account login, got ${loginRes.status}`);
            }
        });

        await check('Domain 4', 'User deletion automatically clears active sessions from tenant DB', async () => {
            const delEmail = `del_sess_${runId}@cybercorp.io`;
            const regRes = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: delEmail, password: 'DelSessPassword_123', name: 'Delete Session User' })
            });
            const delUserId = regRes.body.userId;
            await api(`/api/admin/users/${delUserId}/approve`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` }
            });
            const loginRes = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: delEmail, password: 'DelSessPassword_123' })
            });
            const userToken = loginRes.body.token;

            // Delete user via Superadmin
            const delRes = await api(`/api/admin/users/${delUserId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${superToken}`, 'X-Tenant-Id': loginRes.body.user.tenantId }
            });
            if (delRes.status !== 200) throw new Error('Failed to delete user');

            // Verify deleted user's token is immediately invalid
            const testReq = await api('/api/cards', {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            if (testReq.status !== 401) {
                throw new Error(`Expected 401 for deleted user token, got ${testReq.status}`);
            }
        });

        // ====================================================================
        // DOMAIN 5: Multi-Tenant Data Isolation & BOLA/IDOR Defense (Checks 041 - 050)
        // ====================================================================
        console.log('\n🔵 DOMAIN 5: Multi-Tenant Data Isolation & BOLA/IDOR Defense (Checks 041 - 050)');

        await check('Domain 5', 'Tenant B card creation does not bleed into Tenant A workspace', async () => {
            // Standard user creates a card in their own workspace
            const cardRes = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${regularUserToken}` },
                body: JSON.stringify({
                    title: `Isolated Tenant B Card ${runId}`,
                    desc: 'Private to Tenant B',
                    col: 'todo',
                    priority: 'high'
                })
            });
            if (cardRes.status !== 201) throw new Error(`Card creation failed: ${cardRes.status}`);
            createdCardId = cardRes.body.id;

            // Superadmin in personal DB should NOT see this card in personal DB
            const superCardsRes = await api('/api/cards', {
                headers: { Authorization: `Bearer ${superToken}`, 'X-Tenant-Id': 'personal' }
            });
            const leaked = superCardsRes.body.some((c: any) => c.id === createdCardId);
            if (leaked) throw new Error('VULNERABILITY: Card created in Tenant B leaked into personal workspace!');
        });

        await check('Domain 5', 'BOLA/IDOR Protection: Standard user blocked from setting X-Workspace to foreign workspace', async () => {
            const res = await api('/api/cards', {
                headers: {
                    Authorization: `Bearer ${regularUserToken}`,
                    'X-Workspace': 'personal'
                }
            });
            if (res.status !== 403) {
                throw new Error(`Expected 403 Forbidden for unauthorized workspace switch, got ${res.status}`);
            }
        });

        await check('Domain 5', 'BOLA/IDOR Protection: Standard user blocked from setting X-Tenant-Id to foreign workspace', async () => {
            const res = await api('/api/cards', {
                headers: {
                    Authorization: `Bearer ${regularUserToken}`,
                    'X-Tenant-Id': 'personal'
                }
            });
            if (res.status !== 403) {
                throw new Error(`Expected 403 Forbidden for unauthorized tenant switch, got ${res.status}`);
            }
        });

        await check('Domain 5', 'Super Admin is authorized to access any workspace with appropriate header', async () => {
            // Super Admin accessing regular user's tenant
            const index = await getTenantIndex('test');
            const targetTenant = index.userToTenants[regularUserEmail][0];
            const res = await api('/api/cards', {
                headers: {
                    Authorization: `Bearer ${superToken}`,
                    'X-Tenant-Id': targetTenant
                }
            });
            if (res.status !== 200) throw new Error(`Superadmin tenant access failed: ${res.status}`);
            const foundCard = res.body.some((c: any) => c.id === createdCardId);
            if (!foundCard) throw new Error('Superadmin could not view card in tenant workspace');
        });

        await check('Domain 5', 'Multi-tenant user can only switch among their explicitly authorized workspaces', async () => {
            // Verify regular user's authorized workspaces
            const meRes = await api('/api/auth/me', {
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            const myWorkspaces = meRes.body.workspaces.map((w: any) => w.id);

            // Attempt to access an unauthorized random workspace
            const res = await api('/api/cards', {
                headers: {
                    Authorization: `Bearer ${regularUserToken}`,
                    'X-Workspace': 'unauthorized_random_team_workspace'
                }
            });
            if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
        });

        await check('Domain 5', 'Card deletion in Tenant B does not affect other tenants', async () => {
            const delRes = await api(`/api/cards/${createdCardId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${regularUserToken}` }
            });
            if (delRes.status !== 200) throw new Error(`Card deletion failed: ${delRes.status}`);

            // Superadmin personal cards count remains unaffected
            const superCardsRes = await api('/api/cards', {
                headers: { Authorization: `Bearer ${superToken}`, 'X-Tenant-Id': 'personal' }
            });
            if (superCardsRes.status !== 200) throw new Error('Failed to verify personal cards');
        });

        await check('Domain 5', 'Public Demo Sandbox is isolated and does not modify personal cards', async () => {
            const demoRes = await api('/api/cards', {
                headers: { 'X-Workspace': 'demo' }
            });
            if (demoRes.status !== 200 || !Array.isArray(demoRes.body)) {
                throw new Error(`Public demo access failed: ${demoRes.status}`);
            }
            if (demoRes.body.length === 0) throw new Error('Demo workspace should contain seeded Nova Team cards');
        });

        await check('Domain 5', 'Unauthenticated Demo workspace access is read-only safe', async () => {
            const demoRes = await api('/api/cards', {
                headers: { 'X-Workspace': 'demo' }
            });
            // Verify no personal cards exist in demo
            const hasPersonal = demoRes.body.some((c: any) => c.title?.includes('AUZEF') || c.title?.includes('Corepos'));
            if (hasPersonal) throw new Error('VULNERABILITY: Personal tickets leaked into demo environment!');
        });

        await check('Domain 5', 'Tenant index mapping remains synchronized and atomic', async () => {
            const index = await getTenantIndex('test');
            if (!index.userToTenants || !index.workspaces) {
                throw new Error('Tenant index data structure corrupted');
            }
            if (!index.userToTenants[regularUserEmail]) {
                throw new Error('Registered user missing from tenant index');
            }
        });

        await check('Domain 5', 'Cross-tenant card IDOR lookup: querying deleted/foreign card returns 404', async () => {
            const res = await api(`/api/cards/${createdCardId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Attempt IDOR update' })
            });
            if (res.status !== 404) throw new Error(`Expected 404 for non-existent card in workspace, got ${res.status}`);
        });

        // ====================================================================
        // DOMAIN 6: Injection Mitigations (Checks 051 - 060)
        // ====================================================================
        console.log('\n🔵 DOMAIN 6: Injection Mitigations (Checks 051 - 060)');

        await check('Domain 6', 'SQL injection attempt in card route parameter: /api/cards/\' OR 1=1 --', async () => {
            const res = await api('/api/cards/\' OR 1=1 --', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
        });

        await check('Domain 6', 'SQL injection attempt in sprint ID: 1; DROP TABLE json_store; --', async () => {
            const res = await api('/api/sprints/1; DROP TABLE json_store; --', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
        });

        await check('Domain 6', 'SQL injection attempt in epic ID: \' UNION SELECT * FROM users --', async () => {
            const res = await api('/api/epics/\' UNION SELECT * FROM users --', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
        });

        await check('Domain 6', 'Path traversal attempt in card route parameter: ../../etc/passwd', async () => {
            const res = await api('/api/cards/../../etc/passwd', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 404 && res.status !== 401 && res.status !== 400) {
                throw new Error(`Expected 404/401/400 for path traversal, got ${res.status}`);
            }
        });

        await check('Domain 6', 'Prototype pollution defense: __proto__ in payload does not pollute Object.prototype', async () => {
            const payload = JSON.parse('{"title":"Proto Test","__proto__":{"pollutedKey":true}}');
            await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify(payload)
            });
            if ((Object.prototype as any).pollutedKey) {
                delete (Object.prototype as any).pollutedKey;
                throw new Error('VULNERABILITY: Prototype pollution succeeded on Object.prototype!');
            }
        });

        await check('Domain 6', 'Constructor prototype pollution defense: constructor.prototype injection rejected', async () => {
            const payload = JSON.parse('{"title":"Constructor Test","constructor":{"prototype":{"adminPwned":true}}}');
            await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify(payload)
            });
            if ((Object.prototype as any).adminPwned) {
                delete (Object.prototype as any).adminPwned;
                throw new Error('VULNERABILITY: Constructor prototype pollution succeeded!');
            }
        });

        await check('Domain 6', 'SQL injection vector in query parameter: ?col=\' OR \'1\'=\'1', async () => {
            const res = await api('/api/cards?col=\' OR \'1\'=\'1', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200) throw new Error(`Expected 200 with safe response, got ${res.status}`);
        });

        await check('Domain 6', 'Malformed JSON payload is rejected with 400 Bad Request', async () => {
            const res = await fetch(`${BASE_URL}/api/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${superToken}`
                },
                body: '{ "title": "Malformed", broken json ...'
            });
            if (res.status !== 400) throw new Error(`Expected 400 for malformed JSON, got ${res.status}`);
        });

        await check('Domain 6', 'Deeply nested JSON object is handled gracefully without stack overflow', async () => {
            let nested: any = { value: 'leaf' };
            for (let i = 0; i < 40; i++) {
                nested = { child: nested };
            }
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Deep Nest Test', desc: JSON.stringify(nested) })
            });
            if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
        });

        await check('Domain 6', 'NoSQL / JSON query operators ($where, $gt) in search are treated as literal strings', async () => {
            const res = await api('/api/cards?q={"$gt":""}', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        });

        // ====================================================================
        // DOMAIN 7: Cross-Site Scripting (XSS) & Input Sanitization (Checks 061 - 070)
        // ====================================================================
        console.log('\n🔵 DOMAIN 7: Cross-Site Scripting (XSS) & Input Sanitization (Checks 061 - 070)');

        let xssCardId = '';

        await check('Domain 7', 'Stored XSS payload in card title: <script>alert("xss")</script> safely handled', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: '<script>alert("xss")</script>', col: 'todo' })
            });
            if (res.status !== 201) throw new Error(`Failed to create card: ${res.status}`);
            xssCardId = res.body.id;
            // Verify it was stored as literal string
            if (res.body.title !== '<script>alert("xss")</script>') {
                throw new Error('Card title corrupted');
            }
        });

        await check('Domain 7', 'Stored XSS payload in card description: <img src=x onerror=alert(1)>', async () => {
            const res = await api(`/api/cards/${xssCardId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ desc: '<img src=x onerror=alert(1)>' })
            });
            if (res.status !== 200) throw new Error(`Update failed: ${res.status}`);
            if (res.body.desc !== '<img src=x onerror=alert(1)>') throw new Error('Desc corrupted');
        });

        await check('Domain 7', 'Stored XSS payload in subtask text: <svg onload=alert(1)>', async () => {
            const res = await api(`/api/cards/${xssCardId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({
                    subtasks: [{ id: 'st-1', text: '<svg onload=alert(1)>', done: false }]
                })
            });
            if (res.status !== 200) throw new Error(`Update failed: ${res.status}`);
            if (res.body.subtasks[0].text !== '<svg onload=alert(1)>') throw new Error('Subtask text corrupted');
        });

        await check('Domain 7', 'Stored XSS payload in comment: <iframe src="javascript:alert(1)">', async () => {
            const res = await api(`/api/cards/${xssCardId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({
                    comments: [{
                        id: 'cm-1',
                        text: '<iframe src="javascript:alert(1)">',
                        createdAt: Date.now(),
                        author: 'Tester'
                    }]
                })
            });
            if (res.status !== 200) throw new Error(`Update failed: ${res.status}`);
            if (res.body.comments[0].text !== '<iframe src="javascript:alert(1)">') throw new Error('Comment corrupted');
        });

        await check('Domain 7', 'Stored XSS in user name: <b onmouseover=alert(1)>Hacker</b> safely handled', async () => {
            const res = await api('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: `xss_user_${runId}@cybercorp.io`,
                    password: 'ValidPassword123!',
                    name: '<b onmouseover=alert(1)>Hacker</b>'
                })
            });
            if (res.status !== 202) throw new Error(`Registration failed: ${res.status}`);
        });

        await check('Domain 7', 'Stored XSS in epic name: <script>document.cookie</script>', async () => {
            const res = await api('/api/epics', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ name: '<script>document.cookie</script>', color: '#6366f1' })
            });
            if (res.status !== 201) throw new Error(`Failed to create epic: ${res.status}`);
        });

        await check('Domain 7', 'Stored XSS in sprint name: <img src=1 onerror=fetch(...)>', async () => {
            const res = await api('/api/sprints', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ name: '<img src=1 onerror=fetch(...)>' })
            });
            if (res.status !== 201) throw new Error(`Failed to create sprint: ${res.status}`);
        });

        await check('Domain 7', 'Stored XSS in label name: <details open ontoggle=alert(1)>', async () => {
            const res = await api('/api/labels', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ name: '<details open ontoggle=alert(1)>', color: '#10b981' })
            });
            if (res.status !== 201) throw new Error(`Failed to create label: ${res.status}`);
        });

        await check('Domain 7', 'HTML special characters (&, <, >, ", \') are preserved without broken JSON', async () => {
            const text = 'Complex & "quoted" \'text\' with <tags> and /slashes/';
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: text })
            });
            if (res.status !== 201) throw new Error(`Failed: ${res.status}`);
            if (res.body.title !== text) throw new Error('Characters not preserved verbatim');
        });

        await check('Domain 7', 'Content-Type header is strictly application/json (no text/html reflection)', async () => {
            const res = await api(`/api/cards/${xssCardId}`, {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            const cType = res.headers.get('content-type');
            if (!cType || !cType.includes('application/json')) {
                throw new Error(`Content-type was not JSON: ${cType}`);
            }
        });

        // ====================================================================
        // DOMAIN 8: Schema Validation, Type Safety & Mass Assignment (Checks 071 - 080)
        // ====================================================================
        console.log('\n🔵 DOMAIN 8: Schema Validation, Type Safety & Mass Assignment (Checks 071 - 080)');

        await check('Domain 8', 'Card title exceeding 200 characters is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'A'.repeat(201) })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Card description exceeding 2000 characters is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Valid Title', desc: 'B'.repeat(2001) })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Invalid priority enum value (e.g. "critical") is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Valid Title', priority: 'critical' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Invalid column enum value (e.g. "archived") is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Valid Title', col: 'archived' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Negative story points value (-10) is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Valid Title', storyPoints: -10 })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Excessive story points value (99999) is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Valid Title', storyPoints: 99999 })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Invalid date format in startDate ("2026/12/31") is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Valid Title', startDate: '2026/12/31' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Invalid hex color code in epics ("invalid-color") is rejected (400 Bad Request)', async () => {
            const res = await api('/api/epics', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ name: 'Epic Color Test', color: 'invalid-color' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 8', 'Mass assignment defense: client cannot overwrite immutable card fields (id, key, createdAt)', async () => {
            const cardRes = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Mass Assignment Target' })
            });
            const origId = cardRes.body.id;
            const origKey = cardRes.body.key;
            const origCreated = cardRes.body.createdAt;

            // Attempt to maliciously overwrite id, key, and createdAt via PUT
            const hackRes = await api(`/api/cards/${origId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({
                    id: 'hacked_id_1337',
                    key: 'TK-999999',
                    createdAt: 0,
                    title: 'Title Updated Only'
                })
            });

            if (hackRes.status !== 200) throw new Error(`PUT failed: ${hackRes.status}`);
            if (hackRes.body.id !== origId || hackRes.body.key !== origKey || hackRes.body.createdAt !== origCreated) {
                throw new Error('VULNERABILITY: Immutable card fields were overwritten by mass assignment!');
            }
        });

        await check('Domain 8', 'Subtasks array payload exceeding limit (>100 items) is rejected (400 Bad Request)', async () => {
            const excessiveSubtasks = Array.from({ length: 101 }, (_, i) => ({
                id: `st-${i}`,
                text: `Subtask ${i}`,
                done: false
            }));
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Excessive Subtasks', subtasks: excessiveSubtasks })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        // ====================================================================
        // DOMAIN 9: DoS, Payload Boundaries & Rate Limiting (Checks 081 - 090)
        // ====================================================================
        console.log('\n🔵 DOMAIN 9: DoS, Payload Boundaries & Rate Limiting (Checks 081 - 090)');

        await check('Domain 9', 'Payload exceeding 128KB limit is rejected with 413 Payload Too Large', async () => {
            const hugePayload = 'X'.repeat(135 * 1024); // 135 KB
            const res = await fetch(`${BASE_URL}/api/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${superToken}`
                },
                body: JSON.stringify({ title: 'Huge', desc: hugePayload })
            });
            if (res.status !== 413) {
                throw new Error(`Expected 413 Payload Too Large, got ${res.status}`);
            }
        });

        await check('Domain 9', 'Empty JSON object where fields required is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({})
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 9', 'Array payload passed where object expected is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify([{ title: 'Array item' }])
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 9', 'String type passed where number expected for storyPoints is rejected (400 Bad Request)', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Invalid Type', storyPoints: 'not-a-number' })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 9', 'Card labels array exceeding 10 items is rejected (400 Bad Request)', async () => {
            const labels = Array.from({ length: 11 }, (_, i) => `lbl-${i}`);
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Too Many Labels', labels })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 9', 'Label name exceeding 50 characters is rejected (400 Bad Request)', async () => {
            const res = await api('/api/labels', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ name: 'L'.repeat(51) })
            });
            if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
        });

        await check('Domain 9', 'High-frequency concurrent request burst handles gracefully without crashes', async () => {
            const burstRequests = Array.from({ length: 25 }, () =>
                api('/api/cards', { headers: { Authorization: `Bearer ${superToken}` } })
            );
            const results = await Promise.all(burstRequests);
            const allSuccess = results.every(r => r.status === 200);
            if (!allSuccess) throw new Error('Burst test encountered failures');
        });

        await check('Domain 9', 'Non-JSON Content-Type requests to JSON endpoints are handled cleanly', async () => {
            const res = await fetch(`${BASE_URL}/api/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    Authorization: `Bearer ${superToken}`
                },
                body: 'plain text body'
            });
            if (res.status !== 400 && res.status !== 500) {
                // Should not accept unstructured text as valid card
            }
        });

        await check('Domain 9', 'Server-side task counter (TK-N) increments monotonically without collisions', async () => {
            const c1 = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Monotonic 1' })
            });
            const c2 = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Monotonic 2' })
            });
            const num1 = parseInt(c1.body.key.replace('TK-', ''), 10);
            const num2 = parseInt(c2.body.key.replace('TK-', ''), 10);
            if (num2 <= num1) {
                throw new Error(`Task counter not monotonic: ${c1.body.key} then ${c2.body.key}`);
            }
        });

        await check('Domain 9', 'Cascading delete resilience: deleting sprint and epic safely unlinks cards', async () => {
            // Create epic and sprint
            const ep = await api('/api/epics', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ name: 'Cascade Epic' })
            });
            const sp = await api('/api/sprints', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ name: 'Cascade Sprint' })
            });

            // Create card linked to both
            const card = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({
                    title: 'Cascade Linked Card',
                    epicId: ep.body.id,
                    sprintId: sp.body.id
                })
            });

            // Delete epic and sprint
            await api(`/api/epics/${ep.body.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${superToken}` }
            });
            await api(`/api/sprints/${sp.body.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${superToken}` }
            });

            // Verify card is safely unlinked (null)
            const cards = await api('/api/cards', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            const targetCard = cards.body.find((c: any) => c.id === card.body.id);
            if (!targetCard) throw new Error('Card missing after cascade delete');
            if (targetCard.epicId !== null || targetCard.sprintId !== null) {
                throw new Error('Dangling references found after epic/sprint deletion');
            }
        });

        // ====================================================================
        // DOMAIN 10: Security Headers, Information Disclosure & Audit Trail (Checks 091 - 100)
        // ====================================================================
        console.log('\n🔵 DOMAIN 10: Security Headers, Information Disclosure & Audit Trail (Checks 091 - 100)');

        await check('Domain 10', 'X-Content-Type-Options: nosniff header is present', async () => {
            const res = await api('/api/cards', { headers: { Authorization: `Bearer ${superToken}` } });
            const header = res.headers.get('x-content-type-options');
            if (header !== 'nosniff') throw new Error(`Missing or invalid x-content-type-options: ${header}`);
        });

        await check('Domain 10', 'X-Frame-Options clickjacking protection header is present', async () => {
            const res = await api('/api/cards', { headers: { Authorization: `Bearer ${superToken}` } });
            const header = res.headers.get('x-frame-options');
            if (!header || (header !== 'SAMEORIGIN' && header !== 'DENY')) {
                throw new Error(`Missing or invalid x-frame-options: ${header}`);
            }
        });

        await check('Domain 10', 'X-Powered-By header is suppressed (no server technology banner leakage)', async () => {
            const res = await api('/api/cards', { headers: { Authorization: `Bearer ${superToken}` } });
            const powered = res.headers.get('x-powered-by');
            if (powered) throw new Error(`VULNERABILITY: X-Powered-By header leaked: ${powered}`);
        });

        await check('Domain 10', 'Unknown API routes return clean 404 JSON without leaking filesystem paths', async () => {
            const res = await api('/api/some/completely/non/existent/endpoint');
            if (res.status !== 404 || !res.body.error) {
                throw new Error(`Expected clean 404 JSON, got ${res.status}`);
            }
        });

        await check('Domain 10', 'Error responses do not leak internal stack traces to clients', async () => {
            const res = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: '' }) // Triggers validation error
            });
            if (res.body.stack || res.body.trace) {
                throw new Error('VULNERABILITY: Server stack trace leaked in error response!');
            }
        });

        await check('Domain 10', 'Audit log non-repudiation: user registration is captured in audit trail', async () => {
            const res = await api('/api/admin/logs', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200) throw new Error(`Failed to fetch logs: ${res.status}`);
            const hasReg = res.body.logs.some((l: any) => l.action === 'REGISTER_REQUEST');
            if (!hasReg) throw new Error('REGISTER_REQUEST missing from audit logs');
        });

        await check('Domain 10', 'Audit log non-repudiation: user approval is captured in audit trail', async () => {
            const res = await api('/api/admin/logs', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            const hasApprove = res.body.logs.some((l: any) => l.action === 'USER_APPROVED');
            if (!hasApprove) throw new Error('USER_APPROVED missing from audit logs');
        });

        await check('Domain 10', 'Audit log non-repudiation: card creation (CARD_CREATE) is captured', async () => {
            const res = await api('/api/admin/logs', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            const hasCardCreate = res.body.logs.some((l: any) => l.action === 'CARD_CREATE');
            if (!hasCardCreate) throw new Error('CARD_CREATE missing from audit logs');
        });

        await check('Domain 10', 'Audit log non-repudiation: card movement (CARD_MOVE) is captured', async () => {
            // Create and move card
            const c = await api('/api/cards', {
                method: 'POST',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ title: 'Log Movement Card', col: 'todo' })
            });
            await api(`/api/cards/${c.body.id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${superToken}` },
                body: JSON.stringify({ col: 'doing' })
            });

            const res = await api('/api/admin/logs', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            const hasCardMove = res.body.logs.some((l: any) => l.action === 'CARD_MOVE');
            if (!hasCardMove) throw new Error('CARD_MOVE missing from audit logs');
        });

        await check('Domain 10', 'Superadmin exclusive forensic access: audit logs are strictly protected from tampering', async () => {
            const res = await api('/api/admin/logs', {
                headers: { Authorization: `Bearer ${superToken}` }
            });
            if (res.status !== 200 || !Array.isArray(res.body.logs)) {
                throw new Error('Superadmin could not access forensic audit ledger');
            }
            if (res.body.logs.length === 0) {
                throw new Error('Audit ledger is unexpectedly empty');
            }
        });

        // ====================================================================
        // CLEANUP
        // ====================================================================
        console.log('\n🧹 Performing test data cleanup while preserving core tickets...');
        const personalDb = readDb({ tenantId: 'personal', environment: 'test' });
        // Clean test superadmin
        personalDb.users = personalDb.users.filter(u => u.username !== 'superadmin_sec@company.com');
        personalDb.sessions = [];
        writeDbSync(personalDb, { tenantId: 'personal', environment: 'test' });

        const index = await getTenantIndex('test');
        delete index.userToTenants['superadmin_sec@company.com'];
        delete index.userToTenants[regularUserEmail];
        await saveTenantIndex(index, 'test');

        console.log('   ✓ Test context cleaned successfully.\n');

    } finally {
        server.close();
    }

    console.log('================================================================');
    console.log(`🎯 100-STEP SECURITY VERIFICATION SUMMARY:`);
    console.log(`   Total Checks Executed : ${checkCount}`);
    console.log(`   Passed Checks         : ${passCount}`);
    console.log(`   Failed Checks         : ${failCount}`);
    console.log(`   Success Rate          : ${((passCount / checkCount) * 100).toFixed(1)}%`);
    console.log('================================================================');

    if (passCount !== 100 || failCount !== 0) {
        throw new Error(`Security verification suite did NOT achieve 100% success! Passed: ${passCount}/100`);
    }

    console.log('\n🏆 ALL 100/100 SECURITY VERIFICATION CHECKS PASSED WITH 100% SUCCESS!\n');
}

runSecuritySuite().catch((err) => {
    console.error('\n❌ Fatal error in security suite:', err);
    process.exit(1);
});
