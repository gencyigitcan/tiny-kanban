process.env.APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// ============================================================
//  tests/test_demo_timeline.ts – Unit Test for Dynamic Demo Timeline
// ============================================================

import assert from 'assert';
import { createDefaultDemoDb } from '../src/lib/demo_data.js';
import { alignDemoDbToCurrentDate, getMondayOfWeek, formatDate } from '../src/lib/demo_timeline.js';

console.log('🚀 Running Dynamic Demo Timeline Tests...\n');

// ── Test 1: Today (2026-09-17) ──────────────────────────────
{
    const today = new Date('2026-09-17T10:00:00Z');
    const demoDb = createDefaultDemoDb();
    const result = alignDemoDbToCurrentDate(demoDb, today);

    assert.strictEqual(result.changed, true, 'Alignment should indicate changed');
    
    // Find active sprint
    const activeSprint = demoDb.sprints.find(s => s.active);
    assert.ok(activeSprint, 'There must be an active sprint');
    assert.strictEqual(activeSprint.startDate, '2026-09-14', 'Sprint covering 2026-09-17 must start on 2026-09-14');
    assert.strictEqual(activeSprint.endDate, '2026-09-20', 'Sprint covering 2026-09-17 must end on 2026-09-20');
    console.log(`   ✓ Test 1: Today (2026-09-17) -> Active Sprint is ${activeSprint.name} (${activeSprint.startDate} - ${activeSprint.endDate})`);

    // Check past sprint cards
    const s1Cards = demoDb.cards.filter(c => c.sprintId === 's1');
    assert.ok(s1Cards.length > 0, 'Sprint 1 must have cards');
    assert.ok(s1Cards.every(c => c.col === 'done'), 'All Sprint 1 cards must be col: done');
    console.log(`   ✓ Test 1b: All past sprint (Sprint 1) cards are completed (col: done)`);

    // Check active sprint cards
    const activeCards = demoDb.cards.filter(c => c.sprintId === activeSprint.id);
    assert.ok(activeCards.length > 0, 'Active sprint must have cards');
    const hasDone = activeCards.some(c => c.col === 'done');
    const hasDoing = activeCards.some(c => c.col === 'doing');
    const hasTodo = activeCards.some(c => c.col === 'todo');
    assert.ok(hasDone && hasDoing && hasTodo, 'Active sprint must have realistic mix of done, doing, and todo');
    console.log(`   ✓ Test 1c: Active sprint cards have active progress (done: ${activeCards.filter(c => c.col === 'done').length}, doing: ${activeCards.filter(c => c.col === 'doing').length}, todo: ${activeCards.filter(c => c.col === 'todo').length})`);

    // Check future sprint cards
    const s104Cards = demoDb.cards.filter(c => c.sprintId === 's104');
    assert.ok(s104Cards.every(c => c.col === 'todo'), 'Sprint 104 cards must be col: todo');
    console.log(`   ✓ Test 1d: Future sprint cards are col: todo`);
}

// ── Test 2: Two Months Later (2026-11-17) ───────────────────
{
    const futureDate = new Date('2026-11-17T10:00:00Z');
    const demoDb = createDefaultDemoDb();
    const result = alignDemoDbToCurrentDate(demoDb, futureDate);

    const activeSprint = demoDb.sprints.find(s => s.active);
    assert.ok(activeSprint, 'There must be an active sprint in November 2026');
    assert.strictEqual(activeSprint.startDate, '2026-11-16');
    assert.strictEqual(activeSprint.endDate, '2026-11-22');
    console.log(`   ✓ Test 2: 2 Months Later (2026-11-17) -> Active Sprint automatically shifted to ${activeSprint.name} (${activeSprint.startDate} - ${activeSprint.endDate})`);

    // Sprints before November 16 should now be completed
    const septSprintCards = demoDb.cards.filter(c => c.sprintId === 's37');
    assert.ok(septSprintCards.every(c => c.col === 'done'), 'September sprint (s37) cards should now be completed');
    console.log(`   ✓ Test 2b: Previous September sprint cards automatically marked done`);
}

// ── Test 3: Next Year (2027-04-10) ──────────────────────────
{
    const nextYearDate = new Date('2027-04-10T10:00:00Z');
    const demoDb = createDefaultDemoDb();
    const result = alignDemoDbToCurrentDate(demoDb, nextYearDate);

    const activeSprint = demoDb.sprints.find(s => s.active);
    assert.ok(activeSprint, 'There must be an active sprint in April 2027');
    assert.strictEqual(activeSprint.startDate, '2027-04-05');
    assert.strictEqual(activeSprint.endDate, '2027-04-11');
    console.log(`   ✓ Test 3: Next Year (2027-04-10) -> Active Sprint is ${activeSprint.name} (${activeSprint.startDate} - ${activeSprint.endDate})`);
}

// ── Test 4: Beyond Horizon (2028-06-15) ─────────────────────
{
    const future2028 = new Date('2028-06-15T10:00:00Z');
    const demoDb = createDefaultDemoDb();
    const result = alignDemoDbToCurrentDate(demoDb, future2028);

    const activeSprint = demoDb.sprints.find(s => s.active);
    assert.ok(activeSprint, 'There must be an active sprint even in 2028');
    assert.ok(activeSprint.startDate <= '2028-06-15' && activeSprint.endDate >= '2028-06-15', 'Active sprint dates must encompass 2028-06-15');
    console.log(`   ✓ Test 4: Beyond Horizon (2028-06-15) -> Sprints shifted forward into 2028! Active: ${activeSprint.name} (${activeSprint.startDate} - ${activeSprint.endDate})`);
}

console.log('\n🎉 ALL DYNAMIC DEMO TIMELINE TESTS PASSED 100%!');
