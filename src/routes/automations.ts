// ============================================================
//  Automations Routes (Monday.com Style No-Code Rules)
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity, getEnvironment, getTenantIndex } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError, AppError, asyncHandler } from '../middleware/error.js';
import { createAutomationSchema, updateAutomationSchema } from '../lib/schemas.js';
import type { AutomationRule } from '../types/index.js';

export const automationsRouter = Router();
automationsRouter.use(requireAuth);

async function checkCanManageAutomations(req: any) {
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

    throw new AppError('Otomasyonları yönetmek için yönetici yetkisi gereklidir', 403);
}

/** GET /api/automations - List all automation rules for active workspace */
automationsRouter.get('/', (req, res) => {
    const db = readDb(req);
    const rules = (db.automations || []).map(r => ({
        ...r,
        isActive: r.active
    }));
    res.json(rules);
});

/** POST /api/automations - Create an automation rule */
automationsRouter.post('/', validate(createAutomationSchema), asyncHandler(async (req, res) => {
    await checkCanManageAutomations(req);
    const db = readDb(req);
    if (!Array.isArray(db.automations)) db.automations = [];

    const body = req.body;
    const isAct = body.active !== undefined ? body.active : (body.isActive !== undefined ? body.isActive : true);
    const rule: AutomationRule = {
        id: 'rule-' + uid(),
        name: body.name.trim(),
        active: isAct,
        trigger: body.trigger,
        triggerCondition: body.triggerCondition,
        action: body.action,
        actionConfig: body.actionConfig,
        createdAt: Date.now(),
        executionCount: 0
    };

    db.automations.push(rule);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'WORKSPACE_UPDATE',
        entityType: 'workspace',
        entityId: req.tenantId || 'personal',
        details: `Yeni otomasyon kuralı tanımlandı: '${rule.name}'`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.status(201).json({ ...rule, isActive: rule.active });
}));

/** PUT /api/automations/:id - Update an automation rule */
automationsRouter.put('/:id', validate(updateAutomationSchema), asyncHandler(async (req, res) => {
    await checkCanManageAutomations(req);
    const db = readDb(req);
    if (!Array.isArray(db.automations)) db.automations = [];

    const ruleId = String(req.params.id);
    const rule = db.automations.find(r => r.id === ruleId);
    if (!rule) {
        throw new NotFoundError('Otomasyon kuralı bulunamadı');
    }

    if (req.body.name !== undefined) rule.name = req.body.name.trim();
    if (req.body.active !== undefined) rule.active = req.body.active;
    else if (req.body.isActive !== undefined) rule.active = req.body.isActive;
    if (req.body.trigger !== undefined) rule.trigger = req.body.trigger;
    if (req.body.triggerCondition !== undefined) rule.triggerCondition = req.body.triggerCondition;
    if (req.body.action !== undefined) rule.action = req.body.action;
    if (req.body.actionConfig !== undefined) rule.actionConfig = req.body.actionConfig;

    writeDbSync(db, req);
    res.json({ ...rule, isActive: rule.active });
}));

/** DELETE /api/automations/:id - Delete an automation rule */
automationsRouter.delete('/:id', asyncHandler(async (req, res) => {
    await checkCanManageAutomations(req);
    const db = readDb(req);
    if (!Array.isArray(db.automations)) db.automations = [];

    const ruleId = String(req.params.id);
    const idx = db.automations.findIndex(r => r.id === ruleId);
    if (idx === -1) {
        throw new NotFoundError('Otomasyon kuralı bulunamadı');
    }

    const removed = db.automations.splice(idx, 1)[0];
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'WORKSPACE_UPDATE',
        entityType: 'workspace',
        entityId: req.tenantId || 'personal',
        details: `'${removed.name}' otomasyon kuralı silindi.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json({ success: true });
}));
