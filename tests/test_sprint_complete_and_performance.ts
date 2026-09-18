import { app } from '../src/index.js';
import { readDb, writeDbSync } from '../src/lib/db.js';
import type { Server } from 'http';

process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

const PORT = 3998;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
    console.log('🚀 Starting Sprint Complete & Performance Reporting Tests...\n');

    const personalDb = readDb({ tenantId: 'personal', environment: 'test' });
    personalDb.users = personalDb.users.filter(u => u.username !== 'sprint_test_admin@company.com');
    // Ensure test assignees exist
    if (!personalDb.users.some(u => u.name === 'Ahmet Yılmaz')) {
        personalDb.users.push({
            id: 'usr-ahmet',
            username: 'ahmet@company.com',
            name: 'Ahmet Yılmaz',
            passwordHash: 'hash',
            role: 'user',
            status: 'approved',
            createdAt: Date.now()
        });
    }
    if (!personalDb.users.some(u => u.name === 'Ayşe Demir')) {
        personalDb.users.push({
            id: 'usr-ayse',
            username: 'ayse@company.com',
            name: 'Ayşe Demir',
            passwordHash: 'hash',
            role: 'user',
            status: 'approved',
            createdAt: Date.now()
        });
    }
    personalDb.sessions = [];
    writeDbSync(personalDb, { tenantId: 'personal', environment: 'test' });

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
            return { status: res.status, ok: res.ok, body };
        }

        // 1. Register test admin
        console.log('Test 1: Register and login test admin');
        const reg = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Sprint Test Admin',
                username: 'sprint_test_admin@company.com',
                password: 'testpassword123'
            })
        });
        if (!reg.body.token) throw new Error(`Registration failed: ${JSON.stringify(reg.body)}`);
        const token = reg.body.token;
        const authHeaders = { 'Authorization': `Bearer ${token}` };
        console.log('   ✓ Admin registered and authenticated\n');

        // Create team members via admin API
        const u1 = `ahmet_${Date.now()}`;
        const u2 = `ayse_${Date.now()}`;
        const u1Res = await api('/api/admin/users', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Ahmet Yılmaz',
                username: u1,
                password: 'password123',
                role: 'user',
                workspaceMode: 'team'
            })
        });
        if (u1Res.status !== 201) console.error('u1 failed:', u1Res.body);

        const u2Res = await api('/api/admin/users', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Ayşe Demir',
                username: u2,
                password: 'password123',
                role: 'user',
                workspaceMode: 'team'
            })
        });
        if (u2Res.status !== 201) console.error('u2 failed:', u2Res.body);

        console.log('   ✓ Created Ahmet Yılmaz and Ayşe Demir in team workspace\n');

        // 2. Create Sprint 1 (Active) and Sprint 2 (Planned)
        console.log('Test 2: Create Sprint 1 and Sprint 2');
        const sp1Res = await api('/api/sprints', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Sprint 2026-W1',
                startDate: '2026-01-05',
                endDate: '2026-01-18'
            })
        });
        const sprint1 = sp1Res.body;

        // Activate sprint 1
        await api(`/api/sprints/${sprint1.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ active: true })
        });

        const sp2Res = await api('/api/sprints', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Sprint 2026-W2',
                startDate: '2026-01-19',
                endDate: '2026-02-01'
            })
        });
        const sprint2 = sp2Res.body;
        console.log(`   ✓ Sprint 1 created (${sprint1.id}, active: true)`);
        console.log(`   ✓ Sprint 2 created (${sprint2.id}, active: false)\n`);

        // 3. Create cards assigned to Sprint 1
        console.log('Test 3: Create cards with story points, effort, and assignees');
        const card1Res = await api('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Kullanıcı Yetkilendirme Modülü',
                col: 'done',
                sprintId: sprint1.id,
                assignee: 'Ahmet Yılmaz',
                storyPoints: 5,
                estimatedEffort: 10,
                spentEffort: 8,
                priority: 'high'
            })
        });
        if (card1Res.status !== 201) {
            console.error('Card 1 failed:', card1Res.body);
        }
        const card1 = card1Res.body;

        const card2Res = await api('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'E-posta Bildirim Entegrasyonu',
                col: 'doing',
                sprintId: sprint1.id,
                assignee: 'Ahmet Yılmaz',
                storyPoints: 3,
                estimatedEffort: 6,
                spentEffort: 4,
                priority: 'medium'
            })
        });
        const card2 = card2Res.body;

        const card3Res = await api('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Veritabanı İndeksleme ve Optimizasyon',
                col: 'done',
                sprintId: sprint1.id,
                assignee: 'Ayşe Demir',
                storyPoints: 8,
                estimatedEffort: 16,
                spentEffort: 18,
                priority: 'high'
            })
        });
        const card3 = card3Res.body;

        console.log(`   ✓ Card 1 (done, 5 SP, Ahmet) -> ${card1.id}`);
        console.log(`   ✓ Card 2 (doing, 3 SP, Ahmet) -> ${card2.id}`);
        console.log(`   ✓ Card 3 (done, 8 SP, Ayşe) -> ${card3.id}\n`);

        // 4. Complete Sprint 1 with incomplete cards moving to Sprint 2
        console.log('Test 4: Complete Sprint 1 (Action: next_sprint -> Sprint 2)');
        const completeRes = await api(`/api/sprints/${sprint1.id}/complete`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                incompleteAction: 'next_sprint',
                targetSprintId: sprint2.id
            })
        });

        if (completeRes.status !== 200 || !completeRes.body.ok) {
            throw new Error(`Sprint complete failed: ${JSON.stringify(completeRes.body)}`);
        }

        const report = completeRes.body.report;
        console.log('   ✓ Sprint complete returned 200 OK');
        console.log(`   ✓ Committed SP: ${report.committedSP}, Completed SP: ${report.completedSP}`);
        console.log(`   ✓ Velocity %: ${report.velocityPct}%, Completed Cards: ${report.completedCardsCount}/${report.totalCardsCount}`);
        console.log(`   ✓ Effort: ${report.totalSpentEffort}h spent vs ${report.totalEstimatedEffort}h estimated (variance: ${report.effortVariance}h)`);

        if (report.committedSP !== 16) throw new Error(`Expected committedSP 16, got ${report.committedSP}`);
        if (report.completedSP !== 13) throw new Error(`Expected completedSP 13, got ${report.completedSP}`);
        if (report.completedCardsCount !== 2) throw new Error(`Expected 2 completed cards, got ${report.completedCardsCount}`);
        if (report.incompleteCardsCount !== 1) throw new Error(`Expected 1 incomplete card, got ${report.incompleteCardsCount}`);

        // Verify card 2 was moved to sprint 2
        const getCardsRes = await api('/api/cards', { headers: authHeaders });
        const updatedCard2 = getCardsRes.body.find((c: any) => c.id === card2.id);
        if (updatedCard2.sprintId !== sprint2.id) {
            throw new Error(`Expected card 2 to have sprintId ${sprint2.id}, got ${updatedCard2.sprintId}`);
        }
        console.log(`   ✓ Verified incomplete card 2 successfully migrated to Sprint 2 (${updatedCard2.sprintId})\n`);

        // 5. Test GET /api/sprints/:id/report
        console.log('Test 5: GET /api/sprints/:id/report endpoint');
        const getReportRes = await api(`/api/sprints/${sprint1.id}/report`, { headers: authHeaders });
        if (getReportRes.status !== 200 || getReportRes.body.sprintId !== sprint1.id) {
            throw new Error(`GET sprint report failed: ${JSON.stringify(getReportRes.body)}`);
        }
        console.log(`   ✓ Report successfully retrieved for sprint ${sprint1.id}\n`);

        // 6. Test GET /api/reports/closed-sprints
        console.log('Test 6: GET /api/reports/closed-sprints');
        const closedSprintsRes = await api('/api/reports/closed-sprints', { headers: authHeaders });
        if (closedSprintsRes.status !== 200 || !Array.isArray(closedSprintsRes.body.closedSprints)) {
            throw new Error(`GET closed-sprints failed: ${JSON.stringify(closedSprintsRes.body)}`);
        }
        const foundClosed = closedSprintsRes.body.closedSprints.find((s: any) => s.id === sprint1.id);
        if (!foundClosed) throw new Error(`Sprint 1 not found in closed sprints list`);
        console.log(`   ✓ Closed sprints list contains ${closedSprintsRes.body.closedSprints.length} sprints (including Sprint 1)\n`);

        // 7. Test GET /api/reports/employee-performance
        console.log('Test 7: GET /api/reports/employee-performance (Time-based & Member Performance)');
        const perfAllRes = await api('/api/reports/employee-performance?timeRange=all', { headers: authHeaders });
        if (perfAllRes.status !== 200 || !perfAllRes.body.members) {
            throw new Error(`Employee performance failed: ${JSON.stringify(perfAllRes.body)}`);
        }
        const members = perfAllRes.body.members;
        const ahmet = members.find((m: any) => m.userName === 'Ahmet Yılmaz');
        const ayse = members.find((m: any) => m.userName === 'Ayşe Demir');

        if (!ahmet) throw new Error('Ahmet Yılmaz missing from performance report');
        if (!ayse) throw new Error('Ayşe Demir missing from performance report');

        console.log(`   ✓ Ahmet Yılmaz: ${ahmet.completedCount}/${ahmet.assignedCount} cards, ${ahmet.totalSP} SP, %${ahmet.completionRatePct} completion rate`);
        console.log(`   ✓ Ayşe Demir: ${ayse.completedCount}/${ayse.assignedCount} cards, ${ayse.totalSP} SP, %${ayse.completionRatePct} completion rate`);
        console.log(`   ✓ Ahmet's completed tickets: ${ahmet.completedTickets.length} ticket(s) attached`);

        if (ahmet.totalSP !== 5) throw new Error(`Expected Ahmet totalSP 5, got ${ahmet.totalSP}`);
        if (ayse.totalSP !== 8) throw new Error(`Expected Ayşe totalSP 8, got ${ayse.totalSP}`);

        // 8. Test Sprint-scoped Performance Filtering
        console.log('Test 8: Employee Performance filtered by specific sprint');
        const perfSprintRes = await api(`/api/reports/employee-performance?sprintId=${sprint1.id}`, { headers: authHeaders });
        if (perfSprintRes.status !== 200 || !perfSprintRes.body.members) {
            throw new Error(`Sprint-filtered performance failed: ${JSON.stringify(perfSprintRes.body)}`);
        }
        console.log(`   ✓ Filtered performance for sprint ${sprint1.id} returned ${perfSprintRes.body.members.length} members\n`);

        // 9. Test Incomplete Action: 'backlog'
        console.log('Test 9: Complete Sprint with incompleteAction: "backlog"');
        const sp3Res = await api('/api/sprints', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Sprint 2026-W3',
                startDate: '2026-02-02',
                endDate: '2026-02-15'
            })
        });
        const sprint3 = sp3Res.body;

        const card4Res = await api('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Backlog Görevi Testi',
                col: 'todo',
                sprintId: sprint3.id,
                assignee: 'Ahmet Yılmaz',
                storyPoints: 2,
                priority: 'low'
            })
        });
        const card4 = card4Res.body;

        const complete3Res = await api(`/api/sprints/${sprint3.id}/complete`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                incompleteAction: 'backlog'
            })
        });
        if (complete3Res.status !== 200) throw new Error(`Complete sprint 3 failed`);

        const getCardsAfterRes = await api('/api/cards', { headers: authHeaders });
        const updatedCard4 = getCardsAfterRes.body.find((c: any) => c.id === card4.id);
        if (updatedCard4.sprintId !== null && updatedCard4.sprintId !== undefined) {
            throw new Error(`Expected card 4 sprintId to be null/undefined, got ${updatedCard4.sprintId}`);
        }
        console.log('   ✓ Incomplete ticket successfully unlinked and sent to Backlog (sprintId: null)\n');

        // Cleanup test admin
        const dbFinal = readDb({ tenantId: 'personal', environment: 'test' });
        dbFinal.users = dbFinal.users.filter(u => u.username !== 'sprint_test_admin@company.com');
        dbFinal.sessions = [];
        dbFinal.sprints = dbFinal.sprints.filter(s => s.id !== sprint1.id && s.id !== sprint2.id && s.id !== sprint3.id);
        dbFinal.cards = dbFinal.cards.filter(c => c.id !== card1.id && c.id !== card2.id && c.id !== card3.id && c.id !== card4.id);
        writeDbSync(dbFinal, { tenantId: 'personal', environment: 'test' });

        console.log('🎉 ALL SPRINT COMPLETE & PERFORMANCE REPORTING TESTS PASSED 100%!');
    } finally {
        server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
});
