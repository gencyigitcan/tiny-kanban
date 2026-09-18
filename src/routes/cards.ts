// ============================================================
//  Card Routes
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity, getEnvironment, getTenantIndex } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError, AppError, asyncHandler } from '../middleware/error.js';
import { createCardSchema, updateCardSchema } from '../lib/schemas.js';
import { executeAutomations } from '../lib/automations_engine.js';
import type { Card } from '../types/index.js';

export const cardRouter = Router();

function addNotification(db: any, notif: any, req: any) {
    db.notifications = db.notifications || [];
    db.notifications.push(notif);
    const env = req?.environment || getEnvironment(req);
    const currentTenant = req?.tenantId || 'personal';
    if (currentTenant !== 'personal') {
        try {
            const personalDb = readDb({ tenantId: 'personal', environment: env });
            if (personalDb && personalDb !== db) {
                personalDb.notifications = personalDb.notifications || [];
                if (!personalDb.notifications.some((n: any) => n.id === notif.id)) {
                    personalDb.notifications.push(notif);
                    writeDbSync(personalDb, { tenantId: 'personal', environment: env });
                }
            }
        } catch {}
    }
}

function notifyAssignee(db: any, cardId: string, cardTitle: string, assigneeName: string, sender: any, req?: any) {
    if (!assigneeName || !sender) return;
    const recipient = db.users.find((u: any) => u.name.toLowerCase() === assigneeName.toLowerCase());
    if (recipient && recipient.id !== sender.id) {
        const notification = {
            id: 'ntf-' + uid(),
            userId: recipient.id,
            senderId: sender.id,
            senderName: sender.name,
            cardId,
            cardTitle,
            text: `${sender.name} size '${cardTitle}' görevini atadı.`,
            read: false,
            createdAt: Date.now()
        };
        addNotification(db, notification, req);
    }
}

async function notifyWorkspaceManagers(
    db: any,
    card: Card,
    actionDesc: string,
    actor: any,
    req: any
) {
    if (!actor || !actor.id) return;
    const actorId = actor.id;
    const env = req?.environment || getEnvironment(req);
    const tenantId = req?.tenantId || 'personal';

    // If personal workspace or demo, no manager hierarchy exists
    if (tenantId === 'personal' || tenantId === 'demo') return;

    try {
        const index = await getTenantIndex(env);
        const ws = index.workspaces.find(w => w.id === tenantId);
        const managerUserIds = new Set<string>();

        // 1. Workspace owner
        if (ws?.ownerId && ws.ownerId !== actorId) {
            managerUserIds.add(ws.ownerId);
        }

        // 2. Workspace admin members
        for (const m of ws?.members || []) {
            if (m.role === 'admin' && m.userId && m.userId !== actorId) {
                managerUserIds.add(m.userId);
            }
        }

        // 3. Super Admins
        const personalDb = readDb({ tenantId: 'personal', environment: env });
        for (const u of personalDb.users || []) {
            if (u.role === 'superadmin' && u.id !== actorId) {
                managerUserIds.add(u.id);
            }
        }

        // Remove actor in case they are among managers
        managerUserIds.delete(actorId);
        if (managerUserIds.size === 0) return;

        for (const mgrId of managerUserIds) {
            const notif = {
                id: 'ntf-' + uid(),
                userId: mgrId,
                senderId: actorId,
                senderName: actor.name || 'Takım Üyesi',
                cardId: card.id,
                cardTitle: card.title,
                text: `${actor.name || 'Takım üyesi'}, '${card.title}' (${card.key}) biletinde işlem yaptı: ${actionDesc}`,
                type: 'team-action',
                read: false,
                createdAt: Date.now()
            };
            addNotification(db, notif, req);
        }
    } catch {}
}

export async function checkAndNotifyDueSoonCards(db: any, req?: any) {
    if (!db || !Array.isArray(db.cards) || db.cards.length === 0) return;
    const now = Date.now();
    const env = req?.environment || (typeof req === 'string' ? req : 'production');
    const tenantId = req?.tenantId || (typeof req === 'object' && req?.tenantId) || 'personal';

    const doneColIds = new Set<string>(['done']);
    if (Array.isArray(db.columns)) {
        db.columns.forEach((c: any) => {
            if (c.isDone || c.id === 'done') doneColIds.add(c.id);
        });
    }

    let modified = false;

    for (const card of db.cards) {
        if (!card.dueDate || doneColIds.has(card.col)) continue;

        const dueTime = card.dueDate.includes('T')
            ? new Date(card.dueDate).getTime()
            : new Date(`${card.dueDate}T23:59:59`).getTime();
        if (isNaN(dueTime)) continue;

        const diffMs = dueTime - now;
        const diffHours = diffMs / (1000 * 60 * 60);

        // Within 24 hours
        if (diffHours > 0 && diffHours <= 24) {
            if (card.dueNotificationSentAt && (now - card.dueNotificationSentAt < 24 * 60 * 60 * 1000)) {
                continue;
            }

            card.dueNotificationSentAt = now;
            modified = true;

            const dueText = `⏰ Son 24 Saat: '${card.title}' (${card.key}) biletinin tamamlanmasına 24 saatten az süre kaldı! (Bitiş: ${card.dueDate})`;

            // 1. Notify Assignee
            if (card.assignee) {
                const assigneeLower = card.assignee.trim().toLowerCase();
                const assigneeUser = (db.users || []).find((u: any) =>
                    (u.name && u.name.toLowerCase() === assigneeLower) ||
                    (u.username && u.username.toLowerCase() === assigneeLower)
                );
                if (assigneeUser) {
                    addNotification(db, {
                        id: 'ntf-' + uid(),
                        userId: assigneeUser.id,
                        senderId: 'system',
                        senderName: 'Sistem Hatırlatıcı',
                        cardId: card.id,
                        cardTitle: card.title,
                        text: dueText,
                        type: 'due-soon',
                        read: false,
                        createdAt: now
                    }, req);
                }
            }

            // 2. Notify Workspace Managers
            if (tenantId !== 'personal' && tenantId !== 'demo') {
                try {
                    const index = await getTenantIndex(env);
                    const ws = index.workspaces.find(w => w.id === tenantId);
                    const managerUserIds = new Set<string>();
                    if (ws?.ownerId) managerUserIds.add(ws.ownerId);
                    for (const m of ws?.members || []) {
                        if (m.role === 'admin' && m.userId) managerUserIds.add(m.userId);
                    }
                    const personalDb = readDb({ tenantId: 'personal', environment: env });
                    for (const u of personalDb.users || []) {
                        if (u.role === 'superadmin') managerUserIds.add(u.id);
                    }

                    for (const mgrId of managerUserIds) {
                        addNotification(db, {
                            id: 'ntf-' + uid(),
                            userId: mgrId,
                            senderId: 'system',
                            senderName: 'Sistem Hatırlatıcı',
                            cardId: card.id,
                            cardTitle: card.title,
                            text: dueText,
                            type: 'due-soon',
                            read: false,
                            createdAt: now
                        }, req);
                    }
                } catch {}
            }
        }
    }

    if (modified && req) {
        writeDbSync(db, req);
    }
}

export function syncCardDependencies(cards: Card[]): void {
    const blocksMap = new Map<string, Set<string>>();
    for (const card of cards) {
        if (!blocksMap.has(card.id)) blocksMap.set(card.id, new Set());
        if (Array.isArray(card.blockedBy)) {
            for (const blockerId of card.blockedBy) {
                if (!blocksMap.has(blockerId)) blocksMap.set(blockerId, new Set());
                blocksMap.get(blockerId)!.add(card.id);
            }
        }
    }
    for (const card of cards) {
        const blockingSet = blocksMap.get(card.id) || new Set();
        if (Array.isArray(card.blocks)) {
            for (const b of card.blocks) blockingSet.add(b);
        }
        card.blocks = Array.from(blockingSet);
        if (!Array.isArray(card.blockedBy)) {
            card.blockedBy = [];
        }
    }
}

/** GET /api/cards */
cardRouter.get('/', asyncHandler(async (req, res) => {
    const db = readDb(req);
    await checkAndNotifyDueSoonCards(db, req);
    syncCardDependencies(db.cards);
    res.json(db.cards);
}));

/** GET /api/cards/:id */
cardRouter.get('/:id', (req, res) => {
    const card = readDb(req).cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');
    res.json(card);
});

/** POST /api/cards/:id/view - Record user card read/inspection event */
cardRouter.post('/:id/view', (req, res) => {
    const db = readDb(req);
    const card = db.cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');

    const userId = req.user?.id || 'guest';
    const username = req.user?.username || 'misafir';
    const name = req.user?.name || 'Misafir Kullanıcı';
    const role = req.user?.role || 'user';

    // Throttling: If same user viewed this card within last 2 minutes, avoid logging duplicate spam
    const lastActivity = (card.activity || []).find(a => a.userId === userId && (a.action === 'CARD_VIEW' || a.action === 'VIEW'));
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    let logged = false;
    if (!lastActivity || lastActivity.createdAt < twoMinutesAgo) {
        logActivity({
            userId,
            username,
            name,
            userRole: role,
            action: 'CARD_VIEW',
            entityType: 'card',
            entityId: card.id,
            details: `'${card.title}' (${card.key}) biletini açtı ve inceledi.`,
            workspaceId: req.tenantId || 'personal',
            environment: req.environment || getEnvironment(req)
        }, req);
        logged = true;
    }

    const freshDb = readDb(req);
    const freshCard = freshDb.cards.find(c => c.id === req.params.id) || card;

    res.json({ success: true, logged, throttled: !logged, activity: freshCard.activity || [] });
});

/** GET /api/cards/:id/activity - Get card activity history */
cardRouter.get('/:id/activity', (req, res) => {
    const db = readDb(req);
    const card = db.cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');
    res.json({ activity: card.activity || [] });
});

/** POST /api/cards/:id/comments - Add comment directly with activity logging & mention notifications */
cardRouter.post('/:id/comments', (req, res) => {
    const db = readDb(req);
    const card = db.cards.find(c => c.id === req.params.id);
    if (!card) throw new NotFoundError('Card not found');

    const text = String(req.body.text || '').trim();
    if (!text) throw new AppError('Yorum metni boş olamaz', 400);

    const authorName = req.user?.name || req.body.author || 'Misafir';
    const authorId = req.user?.id || req.body.authorId || '';

    const newComment = {
        id: 'comm-' + uid(),
        text,
        createdAt: Date.now(),
        author: authorName,
        authorId
    };

    card.comments = card.comments || [];
    card.comments.push(newComment);

    const textSnippet = text.length > 50 ? text.slice(0, 47) + '…' : text;
    const notifiedUserIds = new Set<string>();
    if (authorId) notifiedUserIds.add(authorId);
    if (req.user?.id) notifiedUserIds.add(req.user.id);

    // 1. Detect mentions (@username or @name)
    const mentionRegex = /@([a-zA-Z0-9_.@+-]+)/g;
    let match;
    const mentionedKeys = new Set<string>();
    while ((match = mentionRegex.exec(text)) !== null) {
        mentionedKeys.add(match[1].toLowerCase());
    }

    const candidateUsers = (db.users && db.users.length > 0) ? db.users : [];

    for (const u of candidateUsers) {
        const uName = (u.username || '').toLowerCase();
        const fName = (u.name || '').toLowerCase();
        const isMentioned = mentionedKeys.has(uName) || 
                            mentionedKeys.has(fName) || 
                            text.toLowerCase().includes(`@${uName}`) || 
                            text.toLowerCase().includes(`@${fName}`);

        if (isMentioned && !notifiedUserIds.has(u.id)) {
            notifiedUserIds.add(u.id);
            const notif = {
                id: 'ntf-' + uid(),
                userId: u.id,
                senderId: req.user?.id || authorId || 'system',
                senderName: authorName,
                cardId: card.id,
                cardTitle: card.title,
                text: `${authorName}, '${card.title}' (${card.key}) biletinde sizden bahsetti: "${textSnippet}"`,
                type: 'mention',
                read: false,
                createdAt: Date.now()
            };
            addNotification(db, notif, req);
        }
    }

    // 2. Notify assignee if not the commenter and not already notified
    if (card.assignee && card.assignee.trim()) {
        const assigneeLower = card.assignee.trim().toLowerCase();
        const assigneeUser = candidateUsers.find((u: any) =>
            (u.name && u.name.toLowerCase() === assigneeLower) ||
            (u.username && u.username.toLowerCase() === assigneeLower)
        );
        if (assigneeUser && !notifiedUserIds.has(assigneeUser.id)) {
            notifiedUserIds.add(assigneeUser.id);
            const notif = {
                id: 'ntf-' + uid(),
                userId: assigneeUser.id,
                senderId: req.user?.id || authorId || 'system',
                senderName: authorName,
                cardId: card.id,
                cardTitle: card.title,
                text: `${authorName}, size ait '${card.title}' (${card.key}) biletine yorum ekledi: "${textSnippet}"`,
                type: 'comment',
                read: false,
                createdAt: Date.now()
            };
            addNotification(db, notif, req);
        }
    }

    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'guest',
        username: req.user?.username || 'misafir',
        name: authorName,
        userRole: req.user?.role || 'user',
        action: 'CARD_COMMENT',
        entityType: 'card',
        entityId: card.id,
        details: `'${card.title}' (${card.key}) biletine yorum ekledi: "${text.length > 60 ? text.slice(0, 57) + '…' : text}"`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    // Notify workspace managers when a team member adds a comment
    notifyWorkspaceManagers(db, card, `Yorum ekledi: "${textSnippet}"`, req.user, req).catch(() => {});

    res.status(201).json({ comment: newComment, comments: card.comments, activity: card.activity || [] });
});

/** POST /api/cards */
cardRouter.post('/', validate(createCardSchema), (req, res) => {
    const body = req.body as Omit<Card, 'id' | 'key' | 'comments' | 'createdAt'>;
    const db = readDb(req);

    // Validate that assignee belongs to the active workspace / team
    if (body.assignee && body.assignee.trim()) {
        const trimmed = body.assignee.trim().toLowerCase();
        const availableUsers = (db.users && db.users.length > 0) ? db.users : (req.user ? [req.user] : []);
        const exists = availableUsers.some((u: any) => 
            (u.name && u.name.toLowerCase() === trimmed) ||
            (u.username && u.username.toLowerCase() === trimmed)
        );
        if (!exists) {
            throw new AppError('Atanan kullanıcı bu çalışma alanında veya takımda bulunmuyor', 400);
        }
    }

    db.taskCounter = (db.taskCounter ?? 0) + 1;
    const key = `TK-${db.taskCounter}`;
    const card: Card = {
        id: uid(),
        key,
        title: body.title,
        desc: body.desc ?? '',
        issueType: body.issueType ?? 'task',
        assignee: body.assignee,
        priority: body.priority ?? 'medium',
        col: body.col ?? 'todo',
        startDate: body.startDate ?? null,
        dueDate: body.dueDate ?? null,
        labels: body.labels ?? [],
        storyPoints: body.storyPoints ?? null,
        estimatedEffort: body.estimatedEffort ?? null,
        spentEffort: body.spentEffort ?? null,
        subtasks: body.subtasks ?? [],
        comments: [],
        epicId: body.epicId ?? null,
        sprintId: body.sprintId ?? null,
        createdAt: Date.now(),
        activity: [],
        blockedBy: body.blockedBy ?? [],
        blocks: body.blocks ?? [],
        customFields: body.customFields ?? {},
        slaTargetHours: body.slaTargetHours !== undefined ? body.slaTargetHours : (body.issueType === 'incident' ? 4 : (body.priority === 'high' ? 24 : null)),
        slaDueAt: (() => {
            const hours = body.slaTargetHours !== undefined ? body.slaTargetHours : (body.issueType === 'incident' ? 4 : (body.priority === 'high' ? 24 : null));
            return (typeof hours === 'number' && hours > 0) ? (Date.now() + hours * 3600 * 1000) : null;
        })(),
        slaCompletedAt: null,
        slaBreached: false,
        recurrence: body.recurrence ?? null
    };
    db.cards.push(card);
    executeAutomations({ trigger: 'card_created', card, db, req });
    syncCardDependencies(db.cards);
    notifyAssignee(db, card.id, card.title, card.assignee, req.user, req);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'CARD_CREATE',
        entityType: 'card',
        entityId: card.id,
        details: `'${card.title}' (${card.key}) yeni kartı oluşturuldu.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.status(201).json(card);
});

/** PUT /api/cards/:id */
cardRouter.put('/:id', validate(updateCardSchema), asyncHandler(async (req, res) => {
    const db = readDb(req);
    const idx = db.cards.findIndex(c => c.id === req.params.id);
    if (idx === -1) throw new NotFoundError('Card not found');

    // Validate that new assignee belongs to the active workspace / team
    if (req.body.assignee !== undefined && req.body.assignee && String(req.body.assignee).trim()) {
        const trimmed = String(req.body.assignee).trim().toLowerCase();
        const availableUsers = (db.users && db.users.length > 0) ? db.users : (req.user ? [req.user] : []);
        const exists = availableUsers.some((u: any) => 
            (u.name && u.name.toLowerCase() === trimmed) ||
            (u.username && u.username.toLowerCase() === trimmed)
        );
        if (!exists) {
            throw new AppError('Atanan kullanıcı bu çalışma alanında veya takımda bulunmuyor', 400);
        }
    }

    const target = db.cards[idx];
    const oldAssignee = target.assignee;
    const oldCol = target.col;
    const oldPriority = target.priority;
    const oldDue = target.dueDate;
    const oldSpent = target.spentEffort;
    const newAssignee = req.body.assignee;
    const title = req.body.title || target.title;
    if (req.body.column && !req.body.col) {
        req.body.col = req.body.column;
    }

    const allowed: (keyof Card)[] = [
        'title', 'desc', 'issueType', 'assignee', 'priority', 'col',
        'startDate', 'dueDate', 'labels', 'storyPoints',
        'estimatedEffort', 'spentEffort',
        'subtasks', 'comments', 'epicId', 'sprintId',
        'blockedBy', 'blocks', 'customFields',
        'slaTargetHours', 'slaDueAt', 'slaCompletedAt', 'slaBreached',
        'recurrence'
    ];
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            (db.cards[idx] as unknown as Record<string, unknown>)[key] = req.body[key];
        }
    }

    const currentCard = db.cards[idx];
    const isDoneCol = (colId: string) => {
        if (colId === 'done') return true;
        const colDef = (db.columns || []).find(c => c.id === colId);
        return !!colDef?.isDone;
    };

    if (req.body.slaTargetHours !== undefined) {
        currentCard.slaTargetHours = req.body.slaTargetHours;
        currentCard.slaDueAt = (typeof currentCard.slaTargetHours === 'number' && currentCard.slaTargetHours > 0)
            ? (currentCard.createdAt + currentCard.slaTargetHours * 3600 * 1000)
            : null;
    }

    if (req.body.col && req.body.col !== oldCol) {
        if (isDoneCol(req.body.col)) {
            if (!currentCard.slaCompletedAt) {
                currentCard.slaCompletedAt = Date.now();
                if (currentCard.slaDueAt) {
                    currentCard.slaBreached = currentCard.slaCompletedAt > currentCard.slaDueAt;
                }
            }
            // Recurring task auto-schedule on completion
            if (currentCard.recurrence && currentCard.recurrence.interval) {
                const interval = currentCard.recurrence.interval;
                const msMap: Record<string, number> = {
                    daily: 24 * 3600 * 1000,
                    weekly: 7 * 24 * 3600 * 1000,
                    monthly: 30 * 24 * 3600 * 1000
                };
                const deltaMs = msMap[interval] || (24 * 3600 * 1000);
                const nextRunAt = Date.now() + deltaMs;
                
                let nextDueDate: string | null = null;
                if (currentCard.dueDate) {
                    const prevDue = new Date(currentCard.dueDate).getTime();
                    if (!isNaN(prevDue)) {
                        nextDueDate = new Date(prevDue + deltaMs).toISOString().slice(0, 10);
                    }
                }

                const nextCard: Card = {
                    id: uid(),
                    key: `TK-${++db.taskCounter}`,
                    title: currentCard.title,
                    desc: currentCard.desc,
                    issueType: currentCard.issueType || 'task',
                    assignee: currentCard.assignee,
                    priority: currentCard.priority,
                    col: (db.columns && db.columns[0]?.id) || 'todo',
                    startDate: new Date().toISOString().slice(0, 10),
                    dueDate: nextDueDate,
                    labels: [...(currentCard.labels || [])],
                    storyPoints: currentCard.storyPoints,
                    estimatedEffort: currentCard.estimatedEffort,
                    spentEffort: 0,
                    subtasks: (currentCard.subtasks || []).map(s => ({ ...s, id: uid(), done: false })),
                    comments: [],
                    epicId: currentCard.epicId,
                    sprintId: currentCard.sprintId,
                    createdAt: Date.now(),
                    activity: [],
                    blockedBy: [],
                    blocks: [],
                    customFields: { ...(currentCard.customFields || {}) },
                    recurrence: {
                        interval,
                        nextRunAt
                    },
                    slaTargetHours: currentCard.slaTargetHours,
                    slaDueAt: currentCard.slaTargetHours ? (Date.now() + currentCard.slaTargetHours * 3600 * 1000) : null,
                    slaCompletedAt: null,
                    slaBreached: false
                };

                db.cards.push(nextCard);
                logActivity({
                    userId: req.user?.id || 'unknown',
                    username: req.user?.username || 'unknown',
                    name: req.user?.name || 'Kullanıcı',
                    userRole: req.user?.role || 'user',
                    action: 'CARD_CREATE',
                    entityType: 'card',
                    entityId: nextCard.id,
                    details: `Tekrarlayan görev döngüsü başlatıldı: '${nextCard.title}' (${nextCard.key}) [${interval}]`,
                    workspaceId: req.tenantId || 'personal',
                    environment: req.environment || getEnvironment(req)
                }, req);

                if (nextCard.assignee) {
                    notifyAssignee(db, nextCard.id, nextCard.title, nextCard.assignee, req.user, req);
                }
            }
        } else {
            currentCard.slaCompletedAt = null;
            if (currentCard.slaDueAt) {
                currentCard.slaBreached = Date.now() > currentCard.slaDueAt;
            }
        }
    }

    if (newAssignee && newAssignee !== oldAssignee) {
        notifyAssignee(db, db.cards[idx].id, title, newAssignee, req.user, req);
    }

    if (req.body.col && req.body.col !== oldCol) {
        executeAutomations({ trigger: 'status_changed', card: currentCard, previousCard: { col: oldCol }, db, req });
    }
    if (req.body.priority && req.body.priority !== oldPriority) {
        executeAutomations({ trigger: 'priority_changed', card: currentCard, previousCard: { priority: oldPriority }, db, req });
    }
    if (newAssignee && newAssignee !== oldAssignee) {
        executeAutomations({ trigger: 'assignee_changed', card: currentCard, previousCard: { assignee: oldAssignee }, db, req });
    }

    syncCardDependencies(db.cards);
    writeDbSync(db, req);

    let action: any = 'CARD_UPDATE';
    let details = `'${db.cards[idx].title}' (${db.cards[idx].key}) kartı güncellendi.`;

    if (req.body.col && req.body.col !== oldCol) {
        action = 'CARD_MOVE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) kartı '${oldCol}' kolonundan '${db.cards[idx].col}' kolonuna taşındı.`;
    } else if (req.body.spentEffort !== undefined && req.body.spentEffort !== oldSpent) {
        action = 'CARD_EFFORT';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) harcanan efor güncellendi: ${req.body.spentEffort} sa (önceki: ${oldSpent || 0} sa).`;
    } else if (newAssignee !== undefined && newAssignee !== oldAssignee) {
        action = 'CARD_UPDATE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) ataması değiştirildi: ${oldAssignee || 'Atanmamış'} → ${newAssignee || 'Atanmamış'}.`;
    } else if (req.body.dueDate !== undefined && req.body.dueDate !== oldDue) {
        action = 'CARD_UPDATE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) bitiş tarihi değiştirildi: ${req.body.dueDate || 'Kaldırıldı'}.`;
    } else if (req.body.priority !== undefined && req.body.priority !== oldPriority) {
        action = 'CARD_UPDATE';
        details = `'${db.cards[idx].title}' (${db.cards[idx].key}) önceliği '${oldPriority}' → '${req.body.priority}' olarak değiştirildi.`;
    }

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action,
        entityType: 'card',
        entityId: db.cards[idx].id,
        details,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    // Notify workspace managers when a team member takes an action on a card
    await notifyWorkspaceManagers(db, db.cards[idx], details, req.user, req);

    res.json(db.cards[idx]);
}));

/** DELETE /api/cards/:id */
cardRouter.delete('/:id', (req, res) => {
    const db = readDb(req);
    const cardToDelete = db.cards.find(c => c.id === req.params.id);
    const before = db.cards.length;
    db.cards = db.cards.filter(c => c.id !== req.params.id);
    if (db.cards.length === before) throw new NotFoundError('Card not found');
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'CARD_DELETE',
        entityType: 'card',
        entityId: req.params.id,
        details: `'${cardToDelete?.title || req.params.id}' (${cardToDelete?.key || ''}) kartı silindi.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json({ ok: true });
});

