// ============================================================
//  Reports & Performance Analytics Routes
// ============================================================
import { Router } from 'express';
import { readDb } from '../lib/db.js';
import { buildSprintReport } from './sprints.js';
import type { EmployeePerformanceSummary } from '../types/index.js';

export const reportsRouter = Router();

/**
 * GET /api/reports/employee-performance
 * Returns time-based & sprint-based performance metrics for employees and project velocity.
 */
reportsRouter.get('/employee-performance', (req, res) => {
    const db = readDb(req);
    const {
        timeRange = 'all',
        startDate,
        endDate,
        sprintId,
        assignee
    } = req.query as {
        timeRange?: string;
        startDate?: string;
        endDate?: string;
        sprintId?: string;
        assignee?: string;
    };

    // Calculate time bounds
    let minTime = 0;
    let maxTime = Infinity;

    if (timeRange === '30d') {
        minTime = Date.now() - 30 * 86400000;
        maxTime = Date.now();
    } else if (timeRange === '90d') {
        minTime = Date.now() - 90 * 86400000;
        maxTime = Date.now();
    } else if (timeRange === '180d') {
        minTime = Date.now() - 180 * 86400000;
        maxTime = Date.now();
    } else if (timeRange === '2026') {
        minTime = new Date('2026-01-01T00:00:00').getTime();
        maxTime = new Date('2026-12-31T23:59:59').getTime();
    } else if (timeRange === '2027') {
        minTime = new Date('2027-01-01T00:00:00').getTime();
        maxTime = new Date('2027-12-31T23:59:59').getTime();
    } else if (timeRange === 'custom' && (startDate || endDate)) {
        if (startDate) minTime = new Date(`${startDate}T00:00:00`).getTime();
        if (endDate) maxTime = new Date(`${endDate}T23:59:59`).getTime();
    }

    // Helper to check if card is done
    function isCardDone(colId: string): boolean {
        if (db.columns && db.columns.length > 0) {
            const found = db.columns.find(c => c.id === colId);
            if (found && typeof found.isDone === 'boolean') return found.isDone;
        }
        return colId === 'done';
    }

    const sprintMap = new Map(db.sprints.map(s => [s.id, s.name]));

    // Filter cards
    const filteredCards = db.cards.filter(c => {
        // Sprint filter
        if (sprintId && sprintId !== 'all') {
            if (c.sprintId !== sprintId) return false;
        }

        // Assignee filter
        if (assignee && assignee !== 'all') {
            const cAss = (c.assignee || 'Atanmamış').trim().toLowerCase();
            if (cAss !== assignee.trim().toLowerCase()) return false;
        }

        // Time filter
        if (minTime > 0 || maxTime < Infinity) {
            let cardTime = c.createdAt;
            if (c.dueDate) {
                const dt = new Date(c.dueDate).getTime();
                if (!isNaN(dt)) cardTime = dt;
            }
            if (cardTime < minTime || cardTime > maxTime) return false;
        }

        return true;
    });

    // Group by Assignee
    const memberMap = new Map<string, {
        assignedCards: typeof filteredCards;
        completedCards: typeof filteredCards;
    }>();

    filteredCards.forEach(c => {
        const name = (c.assignee || 'Atanmamış').trim();
        if (!memberMap.has(name)) {
            memberMap.set(name, { assignedCards: [], completedCards: [] });
        }
        const m = memberMap.get(name)!;
        m.assignedCards.push(c);
        if (isCardDone(c.col)) {
            m.completedCards.push(c);
        }
    });

    // Also include team members with 0 tasks if they are in db.users
    db.users.forEach(u => {
        if (!memberMap.has(u.name) && (!assignee || assignee === 'all' || assignee.toLowerCase() === u.name.toLowerCase())) {
            memberMap.set(u.name, { assignedCards: [], completedCards: [] });
        }
    });

    const userMap = new Map(db.users.map(u => [u.name, u]));

    const members: EmployeePerformanceSummary[] = Array.from(memberMap.entries()).map(([name, data]) => {
        const u = userMap.get(name);
        const assignedCount = data.assignedCards.length;
        const completedCount = data.completedCards.length;
        const completionRatePct = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;
        const totalSP = data.completedCards.reduce((sum, c) => sum + (Number(c.storyPoints) || 0), 0);
        const estimatedEffort = data.assignedCards.reduce((sum, c) => sum + (Number(c.estimatedEffort) || 0), 0);
        const spentEffort = data.assignedCards.reduce((sum, c) => sum + (Number(c.spentEffort) || 0), 0);
        const effortAccuracyPct = estimatedEffort > 0 ? Math.round((spentEffort / estimatedEffort) * 100) : 100;

        const completedTickets = data.completedCards.map(c => ({
            id: c.id,
            key: c.key || '',
            title: c.title,
            sprintName: c.sprintId ? sprintMap.get(c.sprintId) || 'Sprint' : 'Backlog',
            completedAt: c.createdAt,
            spentEffort: c.spentEffort ?? undefined,
            storyPoints: c.storyPoints ?? undefined,
        }));

        return {
            userId: u?.id,
            userName: name,
            name,
            username: u?.username,
            avatarColor: u?.avatarColor,
            assignedCount,
            completedCount,
            completionRatePct,
            totalSP,
            estimatedEffort,
            spentEffort,
            effortAccuracyPct,
            completedTickets,
        };
    }).sort((a, b) => b.totalSP - a.totalSP || b.completedCount - a.completedCount);

    // Project aggregated metrics
    const totalAssignedCards = filteredCards.length;
    const totalCompletedCards = filteredCards.filter(c => isCardDone(c.col)).length;
    const totalDeliveredSP = filteredCards.filter(c => isCardDone(c.col)).reduce((sum, c) => sum + (Number(c.storyPoints) || 0), 0);
    const totalEstimatedEffort = filteredCards.reduce((sum, c) => sum + (Number(c.estimatedEffort) || 0), 0);
    const totalSpentEffort = filteredCards.reduce((sum, c) => sum + (Number(c.spentEffort) || 0), 0);

    const closedSprints = db.sprints.filter(s => s.status === 'closed' || (!s.active && isSprintCompleted(s, db.cards)));
    const averageVelocity = closedSprints.length ? Math.round(totalDeliveredSP / closedSprints.length) : totalDeliveredSP;

    function isSprintCompleted(s: any, cards: any[]): boolean {
        const sc = cards.filter(c => c.sprintId === s.id);
        return sc.length > 0 && sc.every(c => isCardDone(c.col));
    }

    res.json({
        timeRange,
        startDate: minTime > 0 ? new Date(minTime).toISOString().slice(0, 10) : null,
        endDate: maxTime < Infinity ? new Date(maxTime).toISOString().slice(0, 10) : null,
        projectMetrics: {
            totalAssignedCards,
            totalCompletedCards,
            overallCompletionRatePct: totalAssignedCards > 0 ? Math.round((totalCompletedCards / totalAssignedCards) * 100) : 0,
            totalDeliveredSP,
            totalEstimatedEffort,
            totalSpentEffort,
            effortVariance: totalSpentEffort - totalEstimatedEffort,
            closedSprintsCount: closedSprints.length,
            averageVelocity,
        },
        members,
    });
});

/**
 * GET /api/reports/closed-sprints
 * Returns list of completed / closed sprints with their close reports.
 */
reportsRouter.get('/closed-sprints', (req, res) => {
    const db = readDb(req);
    function isCardDone(colId: string): boolean {
        if (db.columns && db.columns.length > 0) {
            const found = db.columns.find(c => c.id === colId);
            if (found && typeof found.isDone === 'boolean') return found.isDone;
        }
        return colId === 'done';
    }

    const closedSprints = db.sprints.filter(s => {
        if (s.status === 'closed') return true;
        if (!s.active) {
            const sc = db.cards.filter(c => c.sprintId === s.id);
            return sc.length > 0 && sc.every(c => isCardDone(c.col));
        }
        return false;
    });

    const summaries = closedSprints.map(s => ({
        id: s.id,
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
        active: s.active,
        status: s.status || 'closed',
        closedAt: s.closedAt || s.report?.closedAt || null,
        closedBy: s.closedBy || s.report?.closedBy || null,
        report: s.report || buildSprintReport(s, db.cards, db.columns),
    })).sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0));

    res.json({ closedSprints: summaries });
});
