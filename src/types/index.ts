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
    author?: string;
    authorId?: string;
}

export type Priority = 'high' | 'medium' | 'low';
export type Column = 'todo' | 'doing' | 'done';

export interface Card {
    id: string;
    key: string;
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

export interface User {
    id: string;
    username: string;
    name: string;
    passwordHash: string;
    avatarColor: string;
    createdAt: number;
    expiresAt?: number;
}

export interface Session {
    token: string;
    userId: string;
    expiresAt: number;
}

export interface Label {
    id: string;
    name: string;
    color: string;
    bg: string;
    createdAt: number;
}

export interface Notification {
    id: string;
    userId: string;
    senderId: string;
    senderName: string;
    cardId: string;
    cardTitle: string;
    text: string;
    read: boolean;
    createdAt: number;
    type?: string;
    email?: string;
    name?: string;
    demoStatus?: 'pending' | 'approved';
}

export interface DbSchema {
    cards: Card[];
    epics: Epic[];
    sprints: Sprint[];
    users: User[];
    sessions: Session[];
    labels: Label[];
    notifications: Notification[];
    taskCounter: number;
}

