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
    activity?: CardActivity[];
}

export interface CardActivity {
    id: string;
    userId: string;
    username: string;
    name: string;
    action: ActivityAction | string;
    details: string;
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

export interface WorkspaceMember {
    userId: string;
    username: string;
    role: 'admin' | 'member';
}

export interface Workspace {
    id: string;
    name: string;
    type: 'personal' | 'team' | 'user';
    description?: string;
    ownerId?: string;
    members?: WorkspaceMember[];
    createdAt: number;
}

export interface User {
    id: string;
    username: string;
    email?: string;
    name: string;
    passwordHash: string;
    avatarColor: string;
    role?: 'superadmin' | 'admin' | 'user';
    status?: 'pending' | 'approved' | 'rejected';
    createdAt: number;
    lastLoginAt?: number;
    expiresAt?: number;
    tenantId?: string;
    workspaces?: string[];
    company?: string;
}

export interface Session {
    token: string;
    userId: string;
    expiresAt: number;
    tenantId?: string;
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
    pendingUserId?: string;
    requestStatus?: 'pending' | 'approved' | 'rejected';
}

export type ActivityAction =
    | 'LOGIN'
    | 'LOGOUT'
    | 'REGISTER_REQUEST'
    | 'USER_APPROVED'
    | 'USER_REJECTED'
    | 'USER_CREATED'
    | 'USER_DELETED'
    | 'CARD_CREATE'
    | 'CARD_UPDATE'
    | 'CARD_DELETE'
    | 'CARD_MOVE'
    | 'CARD_VIEW'
    | 'CARD_COMMENT'
    | 'CARD_EFFORT'
    | 'SUBTASK_TOGGLE'
    | 'SUBTASK_ADD'
    | 'WORKSPACE_SWITCH'
    | 'WORKSPACE_CREATE'
    | 'WORKSPACE_UPDATE'
    | 'WORKSPACE_DELETE'
    | 'WORKSPACE_MEMBER_UPDATE';

export interface ActivityLog {
    id: string;
    userId: string;
    username: string;
    name: string;
    userRole: string;
    action: ActivityAction;
    entityType: 'auth' | 'card' | 'workspace' | 'user';
    entityId?: string;
    details: string;
    workspaceId?: string;
    environment: string;
    createdAt: number;
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
    workspaces?: Workspace[];
    logs?: ActivityLog[];
}

export interface TenantMeta {
    id: string;
    name: string;
    type: 'personal' | 'team' | 'user';
    ownerId?: string;
    createdAt: number;
}

export interface TenantIndex {
    workspaces: Workspace[];
    userToTenants: Record<string, string[]>; // username -> workspaceIds
}


