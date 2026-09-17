// ============================================================
//  Test: Activity Logging & Audit Trail Verification
// ============================================================
import { app } from '../src/index.js';
import { readDb, writeDbSync } from '../src/lib/db.js';
import type { Server } from 'http';

process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

let server: Server;
let BASE_URL: string;

async function api(path: string, options: any = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    const text = await res.text();
    let body: any;
    try {
        body = JSON.parse(text);
    } catch {
        body = text;
    }
    return { status: res.status, headers: res.headers, body };
}

async function runTests() {
    console.log('🚀 Running Activity Logging & Audit Trail Verification Tests...\n');

    // Reset test environment superadmin state
    const personalDbInit = readDb({ tenantId: 'personal', environment: 'test' });
    personalDbInit.users = personalDbInit.users.filter(u => u.role !== 'superadmin' && u.id !== 'usr-superadmin');
    personalDbInit.sessions = [];
    writeDbSync(personalDbInit, { tenantId: 'personal', environment: 'test' });

    server = await new Promise((resolve) => {
        const s = app.listen(0, () => resolve(s));
    });
    const addr: any = server.address();
    BASE_URL = `http://localhost:${addr.port}`;

    const rnd = Math.random().toString(36).substring(2, 8);

    try {
        // 1. Register Superadmin
        const superRes = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: 'superadmin_act@company.com',
                name: 'Super Admin',
                password: 'superpassword123'
            })
        });
        const superToken = superRes.body.token;
        if (!superToken) throw new Error('Failed to register super admin');
        console.log('   ✓ Super Admin registered');

        // 2. Register Teammate User
        const memberRes = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: `member_${rnd}@company.com`,
                name: 'Mehmet Demir',
                password: 'memberpassword123'
            })
        });
        const memberUserId = memberRes.body.userId;
        // Approve member
        await api(`/api/admin/users/${memberUserId}/approve`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${superToken}` }
        });
        const memberLogin = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: `member_${rnd}@company.com`,
                password: 'memberpassword123'
            })
        });
        const memberToken = memberLogin.body.token;
        console.log('   ✓ Teammate user approved and logged in');

        // 3. Teammate creates a card
        const cardRes = await api('/api/cards', {
            method: 'POST',
            headers: { Authorization: `Bearer ${memberToken}` },
            body: JSON.stringify({
                title: `Aktivite Test Kartı ${rnd}`,
                col: 'todo',
                priority: 'high',
                estimatedEffort: 10
            })
        });
        const cardId = cardRes.body.id;
        console.log(`   ✓ Card created: ${cardRes.body.key}`);

        // 4. Teammate views the card -> CARD_VIEW
        const viewRes1 = await api(`/api/cards/${cardId}/view`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${memberToken}` }
        });
        if (viewRes1.status !== 200 || !viewRes1.body.logged) {
            throw new Error(`Expected view logged=true, got ${JSON.stringify(viewRes1.body)}`);
        }
        console.log('   ✓ Teammate viewing ticket logged CARD_VIEW');

        // Rapid second view by same user -> throttled
        const viewRes2 = await api(`/api/cards/${cardId}/view`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${memberToken}` }
        });
        if (viewRes2.body.throttled !== true) {
            throw new Error('Expected rapid duplicate view to be throttled');
        }
        console.log('   ✓ Duplicate rapid view correctly throttled');

        // 5. Teammate posts a comment -> CARD_COMMENT
        const commentRes = await api(`/api/cards/${cardId}/comments`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${memberToken}` },
            body: JSON.stringify({
                text: 'API entegrasyonuna başladım, yarın tamamlanacak.'
            })
        });
        if (commentRes.status !== 201 || !commentRes.body.comment) {
            throw new Error(`Failed to post comment: ${commentRes.status}`);
        }
        console.log('   ✓ Comment added and CARD_COMMENT logged');

        // 6. Update card status to doing -> CARD_MOVE
        await api(`/api/cards/${cardId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${memberToken}` },
            body: JSON.stringify({ col: 'doing' })
        });
        console.log('   ✓ Card moved to doing, CARD_MOVE logged');

        // 7. Log spent effort -> CARD_EFFORT
        await api(`/api/cards/${cardId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${memberToken}` },
            body: JSON.stringify({ spentEffort: 4 })
        });
        console.log('   ✓ Spent effort logged, CARD_EFFORT logged');

        // 8. Fetch ticket activity history
        const actRes = await api(`/api/cards/${cardId}/activity`, {
            headers: { Authorization: `Bearer ${memberToken}` }
        });
        if (actRes.status !== 200 || !Array.isArray(actRes.body.activity)) {
            throw new Error('Failed to fetch card activity timeline');
        }
        const actions = actRes.body.activity.map((a: any) => a.action);
        console.log('   Ticket Activity Timeline actions:', actions);
        if (!actions.includes('CARD_CREATE')) throw new Error('Missing CARD_CREATE in card activity');
        if (!actions.includes('CARD_VIEW')) throw new Error('Missing CARD_VIEW in card activity');
        if (!actions.includes('CARD_COMMENT')) throw new Error('Missing CARD_COMMENT in card activity');
        if (!actions.includes('CARD_MOVE')) throw new Error('Missing CARD_MOVE in card activity');
        if (!actions.includes('CARD_EFFORT')) throw new Error('Missing CARD_EFFORT in card activity');
        console.log('   ✓ Full card activity timeline verified with all expected actions');

        // 9. Superadmin checks global audit logs with filters
        // By action=CARD_VIEW
        const filterActionRes = await api('/api/admin/logs?action=CARD_VIEW', {
            headers: { Authorization: `Bearer ${superToken}` }
        });
        if (!filterActionRes.body.logs.every((l: any) => l.action === 'CARD_VIEW')) {
            throw new Error('Filter by action=CARD_VIEW returned mismatched actions');
        }
        console.log('   ✓ Admin log filter by action=CARD_VIEW verified');

        // By user
        const filterUserRes = await api(`/api/admin/logs?user=member_${rnd}@company.com`, {
            headers: { Authorization: `Bearer ${superToken}` }
        });
        if (filterUserRes.body.logs.length === 0 || !filterUserRes.body.logs.every((l: any) => l.username.includes(`member_${rnd}`))) {
            throw new Error('Filter by user returned mismatched logs');
        }
        console.log('   ✓ Admin log filter by user verified');

        // By search query
        const filterQueryRes = await api(`/api/admin/logs?q=${rnd}`, {
            headers: { Authorization: `Bearer ${superToken}` }
        });
        if (filterQueryRes.body.logs.length === 0) {
            throw new Error('Filter by query q returned 0 logs');
        }
        console.log('   ✓ Admin log filter by keyword search query verified');

        // 10. Standard user blocked from /api/admin/logs
        const regularBlockRes = await api('/api/admin/logs', {
            headers: { Authorization: `Bearer ${memberToken}` }
        });
        if (regularBlockRes.status !== 403) {
            throw new Error(`Expected regular user to be blocked (403), got ${regularBlockRes.status}`);
        }
        console.log('   ✓ Regular user strictly blocked from /api/admin/logs (403)');

        console.log('\n🎉 ALL ACTIVITY LOGGING & AUDIT TRAIL TESTS PASSED 100%!');
    } finally {
        try {
            const { readDb, writeDbSync } = await import('../src/lib/db.js');
            const personalDb = readDb({ tenantId: 'personal', environment: 'test' });
            personalDb.users = personalDb.users.filter(u => u.username !== 'superadmin_act@company.com');
            writeDbSync(personalDb, { tenantId: 'personal', environment: 'test' });
        } catch {}
        server.close();
    }
}

runTests().catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
});
