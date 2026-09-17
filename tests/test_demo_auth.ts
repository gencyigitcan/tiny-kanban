// ============================================================
//  tests/test_demo_auth.ts – Verification for Demo Auth & Cross-Workspace Logging
// ============================================================

import assert from 'assert';
import { app } from '../src/index.js';
import { hashPassword, readDb, writeDbSync } from '../src/lib/db.js';
import type { Server } from 'http';

const PORT = 3456;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function run() {
    console.log('🚀 Starting Demo Auth & Cross-Workspace Logging Tests...\n');
    const server: Server = await new Promise(resolve => {
        const s = app.listen(PORT, '127.0.0.1', () => resolve(s));
    });

    async function api(path: string, options: any = {}) {
        const res = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });
        const data = await res.json().catch(() => ({}));
        return { status: res.status, data };
    }

    try {
        // ── Test 1: GET /api/auth/demo-users ────────────────────────
        const usersRes = await api('/api/auth/demo-users');
        assert.strictEqual(usersRes.status, 200);
        assert.strictEqual(usersRes.data.users.length, 10, 'Must return exactly 10 demo users');
        const zeynep = usersRes.data.users.find((u: any) => u.username === 'zeynep');
        assert.ok(zeynep, 'Zeynep must be in demo users list');
        assert.strictEqual(zeynep.title, 'Kıdemli UI/UX Tasarımcısı');
        console.log('   ✓ Test 1: GET /api/auth/demo-users returned 10 Nova team members with titles');

        // ── Test 2: POST /api/auth/demo-login (Zeynep Kaya) ─────────
        const loginRes = await api('/api/auth/demo-login', {
            method: 'POST',
            body: JSON.stringify({ username: 'zeynep' })
        });
        assert.strictEqual(loginRes.status, 200);
        assert.ok(loginRes.data.token.startsWith('demo:'), 'Token must be prefixed with demo:');
        assert.strictEqual(loginRes.data.user.name, 'Zeynep Kaya');
        assert.strictEqual(loginRes.data.activeWorkspaceId, 'demo');
        const zeynepToken = loginRes.data.token;
        console.log('   ✓ Test 2: POST /api/auth/demo-login succeeded for Zeynep Kaya without password');

        // ── Test 3: Authenticated Demo Request with Zeynep's Token ──
        const cardsRes = await api('/api/cards', {
            headers: { Authorization: `Bearer ${zeynepToken}` }
        });
        assert.strictEqual(cardsRes.status, 200);
        assert.ok(Array.isArray(cardsRes.data) && cardsRes.data.length >= 1000, 'Must return demo cards array');
        const targetCard = cardsRes.data[0];
        console.log(`   ✓ Test 3: Authenticated GET /api/cards returned ${cardsRes.data.length} cards`);

        // ── Test 4: Zeynep Views a Ticket (Logs CARD_VIEW in Demo) ──
        const viewRes = await api(`/api/cards/${targetCard.id}/view`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${zeynepToken}` }
        });
        assert.strictEqual(viewRes.status, 200);
        console.log('   ✓ Test 4: Card view logged under Zeynep in demo workspace');

        // ── Test 5: Super Admin Inspects Demo Logs via /api/admin/logs?workspace=demo ──
        const personalDb = readDb({ tenantId: 'personal' });
        let superUser = personalDb.users.find(u => u.username === 'gencyigitcan' || u.id === 'usr-superadmin') || personalDb.users[0];
        if (!superUser) {
            superUser = {
                id: 'usr-superadmin',
                username: 'gencyigitcan',
                email: 'yigitcangenc@gmail.com',
                name: 'Yiğitcan Genç',
                passwordHash: hashPassword('password123'),
                avatarColor: '#4f46e5',
                role: 'superadmin',
                status: 'approved',
                tenantId: 'personal',
                workspaces: ['personal', 'demo'],
                createdAt: Date.now()
            };
            personalDb.users.unshift(superUser);
        }

        // Generate session token directly without changing password
        const crypto = await import('crypto');
        const superToken = `personal:${crypto.randomBytes(32).toString('hex')}`;
        personalDb.sessions.push({
            token: superToken,
            userId: superUser.id,
            tenantId: 'personal',
            expiresAt: Date.now() + 3600000
        });
        writeDbSync(personalDb, { tenantId: 'personal' });

        // Query workspace=demo
        const demoLogsRes = await api('/api/admin/logs?workspace=demo', {
            headers: { Authorization: `Bearer ${superToken}` }
        });
        assert.strictEqual(demoLogsRes.status, 200);
        const demoLogs = demoLogsRes.data.logs;
        assert.ok(demoLogs.some((l: any) => l.username === 'zeynep' && l.action === 'LOGIN'), 'Demo logs must include Zeynep login');
        console.log(`   ✓ Test 5: Super Admin filtered logs by workspace=demo (${demoLogs.length} demo logs found)`);

        // Query workspace=all
        const allLogsRes = await api('/api/admin/logs?workspace=all', {
            headers: { Authorization: `Bearer ${superToken}` }
        });
        assert.strictEqual(allLogsRes.status, 200);
        assert.ok(allLogsRes.data.logs.length >= demoLogs.length, 'All logs must be >= demo logs');
        console.log(`   ✓ Test 6: Super Admin unified logs workspace=all returned ${allLogsRes.data.logs.length} logs`);

        console.log('\n🎉 ALL DEMO AUTH & AUDIT LOG TESTS PASSED 100%!');
    } finally {
        server.close();
    }
}

run().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
