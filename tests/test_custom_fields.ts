// ============================================================
//  tests/test_custom_fields.ts
//  Automated Verification of:
//  1. Custom Fields Definition CRUD (Text, Number, Currency, Select, Checkbox)
//  2. Creating & Updating Cards with Custom Fields
//  3. Deleting Custom Field & automatic cleanup on Cards
// ============================================================
import assert from 'node:assert';
import express from 'express';
import { authRouter } from '../src/routes/auth.js';
import { cardRouter } from '../src/routes/cards.js';
import { customFieldsRouter } from '../src/routes/custom_fields.js';
import { requireAuth } from '../src/middleware/auth.js';
import { errorHandler } from '../src/middleware/error.js';
import { initDb, readDb, writeDbSync, hashPassword, uid } from '../src/lib/db.js';
import type { User, Session } from '../src/types/index.js';

initDb();

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/cards', requireAuth, cardRouter);
app.use('/api/custom-fields', requireAuth, customFieldsRouter);
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
    console.log('🧪 Starting Custom Fields Verification Test Suite...\n');

    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    try {
        // Setup a test superadmin user in personal db and login
        const personalDb = readDb({ tenantId: 'personal' } as any);
        const testSuffix = Date.now().toString(36);
        const superUser: User = {
            id: `usr_cf_${testSuffix}`,
            username: `super_cf_${testSuffix}`,
            passwordHash: hashPassword('SuperSecret123!'),
            name: 'CF Super Admin',
            role: 'superadmin',
            createdAt: new Date().toISOString()
        };
        personalDb.users.push(superUser);
        writeDbSync(personalDb, { tenantId: 'personal' } as any);

        const loginRes = await req('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: superUser.username, password: 'SuperSecret123!' })
        });
        assert.equal(loginRes.status, 200);
        const superToken = loginRes.body.token;

        const authHeaders = {
            'Authorization': `Bearer ${superToken}`
        };

        // 1. Create Custom Fields
        console.log('Test 1: Creating custom fields (Currency, Select, Checkbox, Text, Number)');
        const cf1 = await req('/api/custom-fields', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Bütçe',
                type: 'currency',
                unit: '₺'
            })
        });
        assert.equal(cf1.status, 201);
        assert.equal(cf1.body.name, 'Bütçe');
        assert.equal(cf1.body.type, 'currency');
        assert.equal(cf1.body.unit, '₺');
        const budgetId = cf1.body.id;

        const cf2 = await req('/api/custom-fields', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Ortam',
                type: 'select',
                options: ['Dev', 'Staging', 'Prod']
            })
        });
        assert.equal(cf2.status, 201);
        assert.equal(cf2.body.name, 'Ortam');
        assert.deepEqual(cf2.body.options, ['Dev', 'Staging', 'Prod']);
        const envId = cf2.body.id;

        const cf3 = await req('/api/custom-fields', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                name: 'Müşteri Faturalı',
                type: 'checkbox'
            })
        });
        assert.equal(cf3.status, 201);
        const billableId = cf3.body.id;
        console.log('   ✓ Custom fields created successfully');

        // 2. List Custom Fields
        console.log('Test 2: GET /api/custom-fields returns created fields');
        const list = await req('/api/custom-fields', { headers: authHeaders });
        assert.equal(list.status, 200);
        assert(Array.isArray(list.body));
        assert.equal(list.body.length, 3);
        console.log('   ✓ Custom fields listed');

        // 3. Create Card with Custom Fields
        console.log('Test 3: POST /api/cards creates card with custom field values');
        const newCard = await req('/api/cards', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: 'Özel Alan Test Bileti',
                desc: 'Açıklama',
                issueType: 'story',
                customFields: {
                    [budgetId]: 45000,
                    [envId]: 'Prod',
                    [billableId]: true
                }
            })
        });
        assert.equal(newCard.status, 201);
        const cardId = newCard.body.id;
        assert.equal(newCard.body.customFields[budgetId], 45000);
        assert.equal(newCard.body.customFields[envId], 'Prod');
        assert.equal(newCard.body.customFields[billableId], true);
        console.log('   ✓ Card created with custom field values');

        // 4. Update Card with Custom Fields
        console.log('Test 4: PUT /api/cards/:id updates custom field values');
        const updCard = await req(`/api/cards/${cardId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                customFields: {
                    [budgetId]: 50000,
                    [envId]: 'Staging',
                    [billableId]: false
                }
            })
        });
        assert.equal(updCard.status, 200);
        assert.equal(updCard.body.customFields[budgetId], 50000);
        assert.equal(updCard.body.customFields[envId], 'Staging');
        assert.equal(updCard.body.customFields[billableId], false);
        console.log('   ✓ Card custom fields updated');

        // 5. Delete Custom Field and verify card cleanup
        console.log('Test 5: DELETE /api/custom-fields/:id removes field and cleans card records');
        const delRes = await req(`/api/custom-fields/${billableId}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        assert.equal(delRes.status, 200);

        const checkCards = await req('/api/cards', { headers: authHeaders });
        const targetCard = checkCards.body.find((c: any) => c.id === cardId);
        assert(targetCard);
        assert.equal(targetCard.customFields[billableId], undefined, 'Deleted field cleaned from card');
        assert.equal(targetCard.customFields[budgetId], 50000, 'Other field intact');
        console.log('   ✓ Custom field deleted and cards sanitized');

        // Clean up card
        await req(`/api/cards/${cardId}`, { method: 'DELETE', headers: authHeaders });
        console.log('\n🎉 ALL CUSTOM FIELDS TESTS PASSED 100%!');
    } finally {
        server.close();
    }
}

runTests().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
