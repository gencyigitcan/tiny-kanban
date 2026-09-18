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
export type Column = 'todo' | 'doing' | 'done' | string;
export type IssueType = 'task' | 'bug' | 'story' | 'incident' | 'improvement';

export interface BoardColumn {
    id: string;
    name: string;
    color?: string;
    wipLimit?: number;
    order: number;
    isDone?: boolean;
}

export type CustomFieldType = 'text' | 'number' | 'currency' | 'select' | 'checkbox';

export interface CustomFieldDefinition {
    id: string;
    name: string;
    type: CustomFieldType;
    options?: string[];
    unit?: string;
    required?: boolean;
    createdAt: number;
}

export interface Card {
    id: string;
    key: string;
    title: string;
    desc: string;
    issueType?: IssueType;
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
    blockedBy?: string[];
    blocks?: string[];
    dueNotificationSentAt?: number;
    customFields?: Record<string, any>;
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

export interface SprintCardSummary {
    id: string;
    key: string;
    title: string;
    col: string;
    colName?: string;
    assignee: string | null;
    storyPoints: number | null;
    estimatedEffort: number | null;
    spentEffort: number | null;
    isDone: boolean;
}

export interface SprintMemberMetric {
    userId?: string;
    username?: string;
    name: string;
    avatarColor?: string;
    assignedCardsCount: number;
    completedCardsCount: number;
    completedSP: number;
    estimatedEffort: number;
    spentEffort: number;
    effortVariance: number;
    completedCardKeys: string[];
}

export interface SprintCloseReport {
    sprintId: string;
    sprintName: string;
    startDate: string | null;
    endDate: string | null;
    closedAt: number;
    closedBy?: { id: string; name: string; username: string };
    totalCards: number;
    completedCardsCount: number;
    incompleteCardsCount: number;
    incompleteAction: 'backlog' | 'next_sprint';
    movedCardsCount: number;
    targetSprintId?: string | null;
    targetSprintName?: string | null;
    committedSP: number;
    completedSP: number;
    velocityPct: number;
    totalEstimatedEffort: number;
    totalSpentEffort: number;
    effortVariance: number;
    memberMetrics: SprintMemberMetric[];
    completedCards: SprintCardSummary[];
    incompleteCards: SprintCardSummary[];
}

export interface EmployeePerformanceSummary {
    name: string;
    username?: string;
    avatarColor?: string;
    assignedCount: number;
    completedCount: number;
    completionRatePct: number;
    totalSP: number;
    estimatedEffort: number;
    spentEffort: number;
    effortAccuracyPct: number;
    completedTickets: {
        id: string;
        key: string;
        title: string;
        sprintName?: string;
        completedAt?: number;
        spentEffort?: number;
        storyPoints?: number;
    }[];
}

export interface Sprint {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    active: boolean;
    status?: 'planned' | 'active' | 'closed';
    closedAt?: number | null;
    closedBy?: { id: string; name: string; username: string };
    report?: SprintCloseReport | null;
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
    | 'WORKSPACE_MEMBER_UPDATE'
    | 'COLUMN_CREATE'
    | 'COLUMN_UPDATE'
    | 'COLUMN_DELETE'
    | 'COLUMN_REORDER'
    | 'SPRINT_COMPLETE'
    | 'SPRINT_CREATE'
    | 'SPRINT_UPDATE'
    | 'SPRINT_DELETE';

export interface ActivityLog {
    id: string;
    userId: string;
    username: string;
    name: string;
    userRole: string;
    action: ActivityAction;
    entityType: 'auth' | 'card' | 'workspace' | 'user' | 'sprint';
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
    columns?: BoardColumn[];
    notifications: Notification[];
    taskCounter: number;
    workspaces?: Workspace[];
    logs?: ActivityLog[];
    customFields?: CustomFieldDefinition[];
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


