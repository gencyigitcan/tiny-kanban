// ============================================================
//  Custom Fields Routes (Monday & Jira Customizable Columns)
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity, getEnvironment, getTenantIndex } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError, AppError, asyncHandler } from '../middleware/error.js';
import { createCustomFieldSchema, updateCustomFieldSchema } from '../lib/schemas.js';
import type { CustomFieldDefinition } from '../types/index.js';

export const customFieldsRouter = Router();
customFieldsRouter.use(requireAuth);

async function checkCanManageFields(req: any) {
    const role = req.user?.role;
    if (role === 'superadmin' || role === 'admin') return;
    const currentTenant = req.tenantId || 'personal';
    if (currentTenant === 'personal') return;

    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const ws = index.workspaces?.find(w => w.id === currentTenant);
    if (ws?.ownerId === req.user?.id) return;
    const member = ws?.members?.find(m => m.userId === req.user?.id);
    if (member?.role === 'admin') return;

    throw new AppError('Özel alanları yönetmek için yönetici yetkisi gereklidir', 403);
}

/** GET /api/custom-fields - List all custom fields for the active workspace */
customFieldsRouter.get('/', (req, res) => {
    const db = readDb(req);
    const fields = db.customFields || [];
    res.json(fields);
});

/** POST /api/custom-fields - Create a new custom field */
customFieldsRouter.post('/', validate(createCustomFieldSchema), asyncHandler(async (req, res) => {
    await checkCanManageFields(req);
    const db = readDb(req);
    if (!Array.isArray(db.customFields)) {
        db.customFields = [];
    }

    const body = req.body;
    const fieldId = 'cf_' + uid();
    const newField: CustomFieldDefinition = {
        id: fieldId,
        name: body.name.trim(),
        type: body.type,
        options: body.options || [],
        unit: body.unit || '',
        required: !!body.required,
        createdAt: Date.now()
    };

    db.customFields.push(newField);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'WORKSPACE_UPDATE',
        entityType: 'workspace',
        entityId: req.tenantId || 'personal',
        details: `Yeni özel alan eklendi: '${newField.name}' (${newField.type})`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.status(201).json(newField);
}));

/** PUT /api/custom-fields/:id - Update an existing custom field */
customFieldsRouter.put('/:id', validate(updateCustomFieldSchema), asyncHandler(async (req, res) => {
    await checkCanManageFields(req);
    const db = readDb(req);
    if (!Array.isArray(db.customFields)) db.customFields = [];

    const fieldId = String(req.params.id);
    const field = db.customFields.find(f => f.id === fieldId);
    if (!field) {
        throw new NotFoundError('Özel alan bulunamadı');
    }

    if (req.body.name !== undefined) field.name = req.body.name.trim();
    if (req.body.type !== undefined) field.type = req.body.type;
    if (req.body.options !== undefined) field.options = req.body.options;
    if (req.body.unit !== undefined) field.unit = req.body.unit;
    if (req.body.required !== undefined) field.required = req.body.required;

    writeDbSync(db, req);
    res.json(field);
}));

/** DELETE /api/custom-fields/:id - Delete a custom field and clean from cards */
customFieldsRouter.delete('/:id', asyncHandler(async (req, res) => {
    await checkCanManageFields(req);
    const db = readDb(req);
    if (!Array.isArray(db.customFields)) db.customFields = [];

    const fieldId = String(req.params.id);
    const idx = db.customFields.findIndex(f => f.id === fieldId);
    if (idx === -1) {
        throw new NotFoundError('Özel alan bulunamadı');
    }

    const removed = db.customFields.splice(idx, 1)[0];

    // Clean up cards
    for (const card of db.cards) {
        if (card.customFields && card.customFields[fieldId] !== undefined) {
            delete card.customFields[fieldId];
        }
    }

    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'WORKSPACE_UPDATE',
        entityType: 'workspace',
        entityId: req.tenantId || 'personal',
        details: `'${removed.name}' özel alanı silindi.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json({ success: true });
}));
