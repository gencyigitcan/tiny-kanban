process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// ============================================================
//  tests/test_templates_recurring.ts
//  Automated Verification of:
//  1. Default system templates and custom issue template creation
//  2. Updating and deleting custom templates
//  3. Creating a ticket with recurring configuration (weekly)
//  4. Moving recurring ticket to 'done' and auto-spawning next iteration
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { cardRouter } from '../src/routes/cards.js';
import { templatesRouter } from '../src/routes/templates.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword } from '../src/lib/db.js';
import type { User } from '../src/types/index.js';

initDb();

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/cards', requireAuth, cardRouter);
app.use('/api/templates', requireAuth, templatesRouter);
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
    console.log('🧪 Starting Issue Templates & Recurring Tasks Test Suite...\n');

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        const personalDb = readDb({ tenantId: 'personal' } as any);
        const testSuffix = Date.now().toString(36);
        const superUser: User = {
            id: `usr_tpl_${testSuffix}`,
            username: `super_tpl_${testSuffix}`,
            passwordHash: hashPassword('TplPass123!'),
            name: 'Template Admin',
            role: 'superadmin',
            createdAt: new Date().toISOString()
        };
        personalDb.users.push(superUser);
        writeDbSync(personalDb, { tenantId: 'personal' } as any);

        const loginRes = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: superUser.username,
                password: 'TplPass123!'
            })
        });
        assert.strictEqual(loginRes.status, 200, 'Superadmin login failed');
        const token = loginRes.body.token;
        const authHeaders = { Authorization: `Bearer ${token}` };

        // Test 1: Fetch templates and verify built-in templates
        console.log('Test 1: GET /api/templates returns default system templates...');
        const tplsRes = await req('/api/templates', { headers: authHeaders });
        assert.strictEqual(tplsRes.status, 200);
        assert.ok(Array.isArray(tplsRes.body));
        assert.ok(tplsRes.body.some((t: any) => t.id === 'sys-tpl-bug'));
        assert.ok(tplsRes.body.some((t: any) => t.id === 'sys-tpl-story'));
        console.log(`✓ Retrieved ${tplsRes.body.length} templates (including Jira bug & story templates).`);

        // Test 2: Create a custom template
        console.log('\nTest 2: POST /api/templates creates custom team template...');
        const createTplRes = await req('/api/templates', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'DevOps Haftalık Sunucu Bakım Şablonu',
                description: 'Haftalık sunucu güvenlik ve log temizleme checklisti',
                issueType: 'task',
                titleTemplate: '[BAKIM] Haftalık Sunucu & DB Kontrolleri',
                descTemplate: 'Sunucu metriklerini kontrol et ve logları arşivle.',
                priority: 'medium',
                subtasks: [
                    'Disk doluluk oranlarını kontrol et',
                    'Postgres yedeklerinin tamamlandığını doğrula',
                    'Güvenlik yamalarını uygula'
                ]
            })
        });
        assert.strictEqual(createTplRes.status, 201);
        const customTpl = createTplRes.body;
        assert.strictEqual(customTpl.name, 'DevOps Haftalık Sunucu Bakım Şablonu');
        assert.strictEqual(customTpl.subtasks.length, 3);
        console.log('✓ Custom template created successfully.');

        // Test 3: Update custom template
        console.log('\nTest 3: PUT /api/templates/:id updates custom template...');
        const updateTplRes = await req(`/api/templates/${customTpl.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                priority: 'high'
            })
        });
        assert.strictEqual(updateTplRes.status, 200);
        assert.strictEqual(updateTplRes.body.priority, 'high');
        console.log('✓ Custom template updated successfully.');

        // Test 4: Create a recurring card using template info
        console.log('\nTest 4: Creating card with recurring interval (weekly)...');
        const createCardRes = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: customTpl.titleTemplate,
                desc: customTpl.descTemplate,
                issueType: customTpl.issueType,
                priority: customTpl.priority,
                col: 'todo',
                subtasks: customTpl.subtasks.map((st: string, idx: number) => ({ id: 'st-' + idx, text: st, done: false })),
                recurrence: {
                    interval: 'weekly'
                }
            })
        });
        assert.strictEqual(createCardRes.status, 201, `Card creation failed: ${JSON.stringify(createCardRes.body)}`);
        const recurringCard = createCardRes.body;
        assert.ok(recurringCard.recurrence);
        assert.strictEqual(recurringCard.recurrence.interval, 'weekly');
        console.log(`✓ Recurring card created (${recurringCard.key}) with weekly interval.`);

        // Test 5: Move card to 'done', trigger automatic creation of next iteration
        console.log('\nTest 5: Moving recurring card to done, verifying auto-scheduled iteration...');
        const moveDoneRes = await req(`/api/cards/${recurringCard.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                col: 'done'
            })
        });
        assert.strictEqual(moveDoneRes.status, 200);

        // Check cards in DB for spawned next iteration
        const updatedDb = readDb({ tenantId: 'personal' } as any);
        const spawnedCard = updatedDb.cards.find(c =>
            c.id !== recurringCard.id &&
            c.title === recurringCard.title &&
            c.col === 'todo' &&
            c.recurrence?.interval === 'weekly'
        );
        assert.ok(spawnedCard, 'Next iteration of recurring card was not auto-scheduled');
        assert.strictEqual(spawnedCard.subtasks.length, 3);
        assert.strictEqual(spawnedCard.subtasks.every((s: any) => !s.done), true, 'Spawned card subtasks should be reset to incomplete');
        console.log(`✓ Next recurring cycle ticket was automatically scheduled: ${spawnedCard.key} in 'todo' with reset subtasks!`);

        // Test 6: Delete custom template
        console.log('\nTest 6: Deleting custom template...');
        const deleteTplRes = await req(`/api/templates/${customTpl.id}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        assert.strictEqual(deleteTplRes.status, 200);
        console.log('✓ Custom template deleted successfully.');

        console.log('\n🎉 ALL ISSUE TEMPLATES & RECURRING TASKS TESTS PASSED PERFECTLY!\n');
    } finally {
        server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
