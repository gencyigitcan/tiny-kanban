// ============================================================
//  Automations Engine (Monday.com Style No-Code Rules Engine)
// ============================================================
import { logActivity, getEnvironment, uid } from './db.js';
import type { DbSchema, Card, AutomationTrigger, Notification } from '../types/index.js';

export interface AutomationEvent {
    trigger: AutomationTrigger;
    card: Card;
    previousCard?: Partial<Card>;
    db: DbSchema;
    req: any;
}

export function executeAutomations(event: AutomationEvent): boolean {
    const { trigger, card, db, req } = event;
    if (!Array.isArray(db.automations) || db.automations.length === 0) {
        return false;
    }

    let modified = false;
    const rules = db.automations.filter(r => r.active && r.trigger === trigger);

    for (const rule of rules) {
        // Check condition if specified
        if (rule.triggerCondition && rule.triggerCondition.field) {
            const field = rule.triggerCondition.field as keyof Card;
            const op = rule.triggerCondition.operator || 'equals';
            const expected = rule.triggerCondition.value;
            const actual = card[field];

            let matches = false;
            if (op === 'equals') {
                matches = actual === expected;
            } else if (op === 'not_equals') {
                matches = actual !== expected;
            } else if (op === 'contains') {
                if (Array.isArray(actual)) {
                    matches = actual.includes(expected);
                } else if (typeof actual === 'string') {
                    matches = actual.toLowerCase().includes(String(expected).toLowerCase());
                }
            }
            if (!matches) continue;
        }

        // Execute action
        const cfg = rule.actionConfig || {};
        let actionExecuted = false;

        switch (rule.action) {
            case 'set_priority':
                if (cfg.priority && card.priority !== cfg.priority) {
                    card.priority = cfg.priority;
                    actionExecuted = true;
                    modified = true;
                }
                break;

            case 'set_column':
                if (cfg.column && card.col !== cfg.column) {
                    card.col = cfg.column;
                    actionExecuted = true;
                    modified = true;
                }
                break;

            case 'add_label':
                if (cfg.labelId) {
                    if (!Array.isArray(card.labels)) card.labels = [];
                    if (!card.labels.includes(cfg.labelId)) {
                        card.labels.push(cfg.labelId);
                        actionExecuted = true;
                        modified = true;
                    }
                }
                break;

            case 'assign_user':
                if (cfg.assignee && card.assignee !== cfg.assignee) {
                    card.assignee = cfg.assignee;
                    actionExecuted = true;
                    modified = true;
                }
                break;

            case 'set_sla':
                if (typeof cfg.slaHours === 'number' && cfg.slaHours > 0) {
                    card.slaTargetHours = cfg.slaHours;
                    card.slaDueAt = card.createdAt + cfg.slaHours * 3600 * 1000;
                    actionExecuted = true;
                    modified = true;
                }
                break;

            case 'send_notification':
                actionExecuted = true;
                if (!Array.isArray(db.notifications)) db.notifications = [];
                const targetUser = card.assignee || req?.user?.id || 'all';
                const notif: Notification = {
                    id: 'notif-' + uid(),
                    userId: targetUser,
                    senderId: 'system-automation',
                    senderName: 'Otomasyon Motoru',
                    cardId: card.id,
                    cardTitle: card.title,
                    text: cfg.notifyMessage || cfg.message || `'${card.title}' (${card.key || card.id}) biletinde '${rule.name}' kuralı tetiklendi.`,
                    read: false,
                    createdAt: Date.now(),
                    type: 'automation'
                };
                db.notifications.unshift(notif);
                modified = true;
                break;
        }

        if (actionExecuted) {
            rule.executionCount = (rule.executionCount || 0) + 1;
            logActivity({
                userId: req?.user?.id || 'system',
                username: req?.user?.username || 'automation',
                name: 'Otomasyon Motoru',
                userRole: 'system',
                action: 'CARD_UPDATE',
                entityType: 'card',
                entityId: card.id,
                details: `Otomasyon kuralı çalıştırıldı: '${rule.name}' (${rule.action}) -> '${card.title}' (${card.key})`,
                workspaceId: req?.tenantId || 'personal',
                environment: req?.environment || getEnvironment(req)
            }, req);
        }
    }

    return modified;
}
