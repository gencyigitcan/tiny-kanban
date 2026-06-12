// ============================================================
//  Domain Types — shared across all modules
// ============================================================

export interface Subtask {
    id: string;
    text: string;
    done: boolean;
}

export interface Comment {
    id: string;
    text: string;
    createdAt: number;
}

export type Priority = 'high' | 'medium' | 'low';
export type Column = 'todo' | 'doing' | 'done';

export interface Card {
    id: string;
    title: string;
    desc: string;
    assignee: string;
    priority: Priority;
    col: Column;
    startDate: string | null;
    dueDate: string | null;
    labels: string[];
    storyPoints: number | null;
    estimatedEffort: number | null;
    spentEffort: number | null;
    subtasks: Subtask[];
    comments: Comment[];
    epicId: string | null;
    sprintId: string | null;
    createdAt: number;
}

export interface Epic {
    id: string;
    name: string;
    color: string;
    createdAt: number;
}

export interface Sprint {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    active: boolean;
    createdAt: number;
}

export interface DbSchema {
    cards: Card[];
    epics: Epic[];
    sprints: Sprint[];
}
