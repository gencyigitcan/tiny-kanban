// ============================================================
//  demo_timeline.ts – Dynamic Rolling Demo Timeline Engine
//  Ensures Demo Environment (tenantId: 'demo') always mirrors
//  the current real-world calendar week, whether visited today,
//  in 2 months, or in future years.
// ============================================================

import type { DbSchema, Sprint } from '../types/index.js';

/**
 * Returns Monday of the week for a given date at 00:00:00.000 local time
 */
export function getMondayOfWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
}

/**
 * Formats a Date object as YYYY-MM-DD
 */
export function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD into a Date object at 00:00:00.000
 */
export function parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Adds days to a YYYY-MM-DD string and returns the new YYYY-MM-DD string
 */
export function addDaysToDateStr(dateStr: string, days: number): string {
    const d = parseDate(dateStr);
    d.setDate(d.getDate() + days);
    return formatDate(d);
}

/**
 * Simple deterministic hash function for stable card distributions
 */
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

/**
 * Shifts all sprint and card dates by shiftDays if the base dataset needs year/range shifting.
 */
function shiftDemoDates(demoDb: DbSchema, shiftDays: number): void {
    if (shiftDays === 0) return;

    for (const sprint of demoDb.sprints) {
        if (sprint.startDate) sprint.startDate = addDaysToDateStr(sprint.startDate, shiftDays);
        if (sprint.endDate) sprint.endDate = addDaysToDateStr(sprint.endDate, shiftDays);
    }

    for (const card of demoDb.cards) {
        if (card.startDate) card.startDate = addDaysToDateStr(card.startDate, shiftDays);
        if (card.dueDate) card.dueDate = addDaysToDateStr(card.dueDate, shiftDays);
    }
}

/**
 * Aligns the Demo database to the current calendar date.
 * - Current week's sprint is marked active: true
 * - Past sprints are marked active: false and their cards col: 'done'
 * - Current week's cards have a realistic spread: 40% done, 40% doing, 20% todo
 * - Future sprints are marked active: false and cards col: 'todo'
 * - Sprints and card dates dynamically shift if visited beyond the original 104-week horizon.
 */
export function alignDemoDbToCurrentDate(demoDb: DbSchema, now: Date = new Date()): { db: DbSchema; changed: boolean } {
    if (!demoDb || !Array.isArray(demoDb.sprints) || demoDb.sprints.length === 0) {
        return { db: demoDb, changed: false };
    }

    const currentMonday = getMondayOfWeek(now);
    const currentMondayStr = formatDate(currentMonday);
    const todayStr = formatDate(now);

    const firstSprint = demoDb.sprints[0];
    const lastSprint = demoDb.sprints[demoDb.sprints.length - 1];

    let changed = false;

    // 1. Check if dates need a global shift (if current date is beyond the 104-week window)
    if (firstSprint && lastSprint && firstSprint.startDate && lastSprint.endDate &&
        (todayStr < firstSprint.startDate || todayStr > lastSprint.endDate)) {
        // Calculate week difference from first sprint's start date
        const baseStart = parseDate(firstSprint.startDate);
        const diffMs = currentMonday.getTime() - baseStart.getTime();
        const diffWeeks = Math.floor(diffMs / (7 * 24 * 3600 * 1000));
        
        // Shift by diffWeeks (aligned to start from beginning or keep current week in range)
        const shiftWeeks = Math.floor(diffWeeks / 52) * 52;
        if (shiftWeeks !== 0) {
            shiftDemoDates(demoDb, shiftWeeks * 7);
            changed = true;
        }
    }

    // 2. Identify the sprint that covers currentMondayStr or todayStr
    let activeSprint: Sprint | undefined = demoDb.sprints.find(
        s => Boolean(s.startDate && s.endDate && s.startDate <= todayStr && s.endDate >= todayStr)
    );

    if (!activeSprint) {
        // Fallback: find sprint where startDate matches currentMondayStr
        activeSprint = demoDb.sprints.find(s => s.startDate === currentMondayStr);
    }

    if (!activeSprint) {
        // Fallback: find closest sprint
        activeSprint = demoDb.sprints.find(s => Boolean(s.startDate && s.startDate >= todayStr)) || demoDb.sprints[demoDb.sprints.length - 1];
    }

    // 3. Update Sprint statuses
    const sprintMap = new Map<string, Sprint>();
    for (const sprint of demoDb.sprints) {
        const shouldBeActive = Boolean(activeSprint && sprint.id === activeSprint.id);
        if (sprint.active !== shouldBeActive) {
            sprint.active = shouldBeActive;
            changed = true;
        }
        sprintMap.set(sprint.id, sprint);
    }

    // 4. Update Card statuses and progress according to sprint position
    for (const card of demoDb.cards) {
        const sprint = card.sprintId ? sprintMap.get(card.sprintId) : undefined;

        if (sprint) {
            if (sprint.active) {
                // Current active sprint: realistic agile sprint progress
                const hash = simpleHash(card.id || card.title || 'card');
                const mod = hash % 10;
                let targetCol = 'todo';
                if (mod < 4) {
                    targetCol = 'done';
                    if (card.subtasks) {
                        card.subtasks.forEach(st => {
                            if (!st.done) { st.done = true; changed = true; }
                        });
                    }
                    if (card.estimatedEffort && (!card.spentEffort || card.spentEffort === 0)) {
                        card.spentEffort = card.estimatedEffort;
                        changed = true;
                    }
                } else if (mod < 8) {
                    targetCol = 'doing';
                    if (card.subtasks && card.subtasks.length > 0) {
                        card.subtasks.forEach((st, idx) => {
                            const expectedDone = (idx === 0);
                            if (st.done !== expectedDone) { st.done = expectedDone; changed = true; }
                        });
                    }
                    if (card.estimatedEffort && (!card.spentEffort || card.spentEffort === 0)) {
                        card.spentEffort = Math.max(1, Math.round(card.estimatedEffort * 0.5));
                        changed = true;
                    }
                } else {
                    targetCol = 'todo';
                    if (card.subtasks) {
                        card.subtasks.forEach(st => {
                            if (st.done) { st.done = false; changed = true; }
                        });
                    }
                }
                if (card.col !== targetCol) {
                    card.col = targetCol as any;
                    changed = true;
                }
            } else if (sprint.endDate && sprint.endDate < currentMondayStr) {
                // Past sprint: 100% completed
                if (card.col !== 'done') {
                    card.col = 'done';
                    changed = true;
                }
                if (card.subtasks) {
                    card.subtasks.forEach(st => {
                        if (!st.done) { st.done = true; changed = true; }
                    });
                }
                if (card.estimatedEffort && (!card.spentEffort || card.spentEffort === 0)) {
                    card.spentEffort = card.estimatedEffort;
                    changed = true;
                }
            } else {
                // Future sprint: planned in backlog/todo
                if (card.col !== 'todo') {
                    card.col = 'todo';
                    changed = true;
                }
                if (card.subtasks) {
                    card.subtasks.forEach(st => {
                        if (st.done) { st.done = false; changed = true; }
                    });
                }
            }
        } else {
            // Unassigned to sprint: check dueDate
            if (card.dueDate && card.dueDate < todayStr) {
                if (card.col !== 'done') {
                    card.col = 'done';
                    changed = true;
                }
            }
        }
    }

    return { db: demoDb, changed };
}
