// ============================================================
//  Sprint Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError, AppError } from '../middleware/error.js';
import { createSprintSchema, updateSprintSchema, completeSprintSchema } from '../lib/schemas.js';
import type { Sprint, Card, SprintCloseReport, SprintMemberMetric, SprintCardSummary, BoardColumn } from '../types/index.js';

export const sprintRouter = Router();

/**
 * Builds a comprehensive Sprint Close Report from current sprint cards and columns.
 */
export function buildSprintReport(
    sprint: Sprint,
    cards: Card[],
    columns?: BoardColumn[],
    options?: {
        incompleteAction?: 'backlog' | 'next_sprint';
        targetSprintId?: string | null;
        targetSprintName?: string | null;
        closedBy?: { id: string; name: string; username: string };
    }
): SprintCloseReport {
    function isCardDone(colId: string): boolean {
        if (columns && columns.length > 0) {
            const found = columns.find(c => c.id === colId);
            if (found && typeof found.isDone === 'boolean') return found.isDone;
        }
        return colId === 'done';
    }

    const sprintCards = cards.filter(c => c.sprintId === sprint.id);
    const completedCards = sprintCards.filter(c => isCardDone(c.col));
    const incompleteCards = sprintCards.filter(c => !isCardDone(c.col));

    const committedSP = sprintCards.reduce((sum, c) => sum + (Number(c.storyPoints) || 0), 0);
    const completedSP = completedCards.reduce((sum, c) => sum + (Number(c.storyPoints) || 0), 0);
    const velocityPct = committedSP > 0 ? Math.round((completedSP / committedSP) * 100) : (completedCards.length ? 100 : 0);

    const totalEstimatedEffort = sprintCards.reduce((sum, c) => sum + (Number(c.estimatedEffort) || 0), 0);
    const totalSpentEffort = sprintCards.reduce((sum, c) => sum + (Number(c.spentEffort) || 0), 0);
    const effortVariance = totalSpentEffort - totalEstimatedEffort;

    // Member metrics breakdown
    const memberMap = new Map<string, {
        assigned: Card[];
        completed: Card[];
    }>();

    sprintCards.forEach(c => {
        const key = (c.assignee || 'Atanmamış').trim();
        if (!memberMap.has(key)) {
            memberMap.set(key, { assigned: [], completed: [] });
        }
        const m = memberMap.get(key)!;
        m.assigned.push(c);
        if (isCardDone(c.col)) {
            m.completed.push(c);
        }
    });

    const memberMetrics: SprintMemberMetric[] = Array.from(memberMap.entries()).map(([name, data]) => {
        const cSP = data.completed.reduce((sum, c) => sum + (Number(c.storyPoints) || 0), 0);
        const est = data.assigned.reduce((sum, c) => sum + (Number(c.estimatedEffort) || 0), 0);
        const spent = data.assigned.reduce((sum, c) => sum + (Number(c.spentEffort) || 0), 0);
        return {
            name,
            assignedCardsCount: data.assigned.length,
            completedCardsCount: data.completed.length,
            completedSP: cSP,
            estimatedEffort: est,
            spentEffort: spent,
            effortVariance: spent - est,
            completedCardKeys: data.completed.map(c => c.key).filter(Boolean),
        };
    }).sort((a, b) => b.completedSP - a.completedSP || b.completedCardsCount - a.completedCardsCount);

    const mapSummary = (c: Card): SprintCardSummary => {
        const colDef = columns?.find(col => col.id === c.col);
        return {
            id: c.id,
            key: c.key || '',
            title: c.title,
            col: c.col,
            colName: colDef?.name || c.col,
            assignee: c.assignee || null,
            storyPoints: c.storyPoints ?? null,
            estimatedEffort: c.estimatedEffort ?? null,
            spentEffort: c.spentEffort ?? null,
            isDone: isCardDone(c.col),
        };
    };

    return {
        sprintId: sprint.id,
        sprintName: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        closedAt: sprint.closedAt || Date.now(),
        closedBy: options?.closedBy || sprint.closedBy,
        totalCards: sprintCards.length,
        completedCardsCount: completedCards.length,
        incompleteCardsCount: incompleteCards.length,
        incompleteAction: options?.incompleteAction || 'backlog',
        movedCardsCount: incompleteCards.length,
        targetSprintId: options?.targetSprintId || null,
        targetSprintName: options?.targetSprintName || null,
        committedSP,
        completedSP,
        velocityPct,
        totalEstimatedEffort,
        totalSpentEffort,
        effortVariance,
        memberMetrics,
        completedCards: completedCards.map(mapSummary),
        incompleteCards: incompleteCards.map(mapSummary),
    };
}

/** GET /api/sprints */
sprintRouter.get('/', (req, res) => {
    res.json(readDb(req).sprints);
});

/** GET /api/sprints/:id/report */
sprintRouter.get('/:id/report', (req, res) => {
    const db = readDb(req);
    const sprint = db.sprints.find(s => s.id === req.params.id);
    if (!sprint) throw new NotFoundError('Sprint not found');

    if (sprint.report) {
        return res.json(sprint.report);
    }

    const report = buildSprintReport(sprint, db.cards, db.columns);
    return res.json(report);
});

/** POST /api/sprints */
sprintRouter.post('/', validate(createSprintSchema), (req, res) => {
    const db = readDb(req);
    const sprint: Sprint = {
        id: uid(),
        name: req.body.name as string,
        startDate: (req.body.startDate as string | undefined) ?? null,
        endDate: (req.body.endDate as string | undefined) ?? null,
        active: false,
        status: 'planned',
        createdAt: Date.now(),
    };
    db.sprints.push(sprint);

    logActivity({
        userId: req.user?.id || 'admin',
        username: req.user?.username || 'admin',
        name: req.user?.name || 'Yönetici',
        userRole: req.user?.role || 'admin',
        action: 'SPRINT_CREATE',
        entityType: 'sprint',
        entityId: sprint.id,
        details: `"${sprint.name}" adında yeni sprint oluşturuldu.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || 'production',
    }, req);

    writeDbSync(db, req);
    res.status(201).json(sprint);
});

/** PUT /api/sprints/:id  — activating a sprint deactivates all others */
sprintRouter.put('/:id', validate(updateSprintSchema), (req, res) => {
    const db = readDb(req);
    const idx = db.sprints.findIndex(s => s.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Sprint not found');

    if (req.body.active === true) {
        db.sprints.forEach(s => {
            s.active = false;
            if (s.status === 'active') s.status = 'closed';
        });
        req.body.status = 'active';
    }

    const allowed = ['name', 'startDate', 'endDate', 'active', 'status'] as const;
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            (db.sprints[idx] as unknown as Record<string, unknown>)[key] = req.body[key];
        }
    }

    logActivity({
        userId: req.user?.id || 'admin',
        username: req.user?.username || 'admin',
        name: req.user?.name || 'Yönetici',
        userRole: req.user?.role || 'admin',
        action: 'SPRINT_UPDATE',
        entityType: 'sprint',
        entityId: db.sprints[idx].id,
        details: `"${db.sprints[idx].name}" sprinti güncellendi${req.body.active ? ' ve aktif yapıldı' : ''}.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || 'production',
    }, req);

    writeDbSync(db, req);
    res.json(db.sprints[idx]);
});

/** POST /api/sprints/:id/complete  — Jira Complete Sprint workflow */
sprintRouter.post('/:id/complete', validate(completeSprintSchema), (req, res) => {
    const db = readDb(req);
    const sprint = db.sprints.find(s => s.id === req.params.id);
    if (!sprint) throw new NotFoundError('Sprint not found');

    const { incompleteAction, targetSprintId } = req.body;
    let targetSprintName: string | null = null;

    if (incompleteAction === 'next_sprint') {
        if (!targetSprintId) {
            throw new AppError('Tamamlanmayan biletler için hedef sprint seçilmelidir', 400);
        }
        const targetSprint = db.sprints.find(s => s.id === targetSprintId);
        if (!targetSprint) {
            throw new AppError('Hedef sprint bulunamadı', 404);
        }
        targetSprintName = targetSprint.name;
    }

    const closedBy = req.user ? {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
    } : { id: 'admin', name: 'Yönetici', username: 'admin' };

    // Build the report based on current sprint state before moving incomplete cards
    const report = buildSprintReport(sprint, db.cards, db.columns, {
        incompleteAction,
        targetSprintId,
        targetSprintName,
        closedBy,
    });

    // Helper to check done status
    function isCardDone(colId: string): boolean {
        if (db.columns && db.columns.length > 0) {
            const found = db.columns.find(c => c.id === colId);
            if (found && typeof found.isDone === 'boolean') return found.isDone;
        }
        return colId === 'done';
    }

    // Move incomplete cards
    db.cards.forEach(c => {
        if (c.sprintId === sprint.id && !isCardDone(c.col)) {
            const destName = incompleteAction === 'next_sprint' && targetSprintName ? `"${targetSprintName}" sprintine` : 'Backlog\'a';
            c.sprintId = (incompleteAction === 'next_sprint' && targetSprintId) ? targetSprintId : null;
            c.activity = c.activity || [];
            c.activity.push({
                id: uid(),
                userId: closedBy.id,
                username: closedBy.username,
                name: closedBy.name,
                action: 'CARD_MOVE',
                details: `"${sprint.name}" sprinti tamamlandığında ${destName} aktarıldı.`,
                createdAt: Date.now(),
            });
        }
    });

    // Close the sprint
    sprint.active = false;
    sprint.status = 'closed';
    sprint.closedAt = Date.now();
    sprint.closedBy = closedBy;
    sprint.report = report;

    // Log Activity
    logActivity({
        userId: closedBy.id,
        username: closedBy.username,
        name: closedBy.name,
        userRole: req.user?.role || 'admin',
        action: 'SPRINT_COMPLETE',
        entityType: 'sprint',
        entityId: sprint.id,
        details: `"${sprint.name}" sprinti tamamlandı ve kapatıldı. (${report.completedCardsCount} bilet tamamlandı, ${report.incompleteCardsCount} bilet aktarıldı).`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || 'production',
    }, req);

    // Notifications to workspace users
    db.notifications = db.notifications || [];
    const actor = req.user;
    for (const u of db.users || []) {
        db.notifications.unshift({
            id: 'ntf-' + uid(),
            userId: u.id,
            senderId: actor?.id || 'system',
            senderName: actor?.name || 'Sistem',
            cardId: '',
            cardTitle: sprint.name,
            text: `🏁 "${sprint.name}" sprinti tamamlandı! ${report.completedCardsCount} bilet tamamlandı (${report.completedSP} SP).`,
            read: false,
            type: 'sprint-completed',
            createdAt: Date.now(),
        });
    }

    writeDbSync(db, req);
    return res.json({ ok: true, sprint, report });
});

/** DELETE /api/sprints/:id  — also unlinks cards */
sprintRouter.delete('/:id', (req, res) => {
    const db = readDb(req);
    const sprint = db.sprints.find(s => s.id === req.params.id);
    if (!sprint) throw new NotFoundError('Sprint not found');

    db.sprints = db.sprints.filter(s => s.id !== req.params.id);
    db.cards.forEach(c => { if (c.sprintId === req.params.id) c.sprintId = null; });

    logActivity({
        userId: req.user?.id || 'admin',
        username: req.user?.username || 'admin',
        name: req.user?.name || 'Yönetici',
        userRole: req.user?.role || 'admin',
        action: 'SPRINT_DELETE',
        entityType: 'sprint',
        entityId: req.params.id,
        details: `"${sprint.name}" sprinti silindi ve biletleri ayrıldı.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || 'production',
    }, req);

    writeDbSync(db, req);
    res.json({ ok: true });
});
