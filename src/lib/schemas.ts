// ============================================================
//  Zod Validation Schemas
// ============================================================
import { z } from 'zod';

const priority = z.enum(['high', 'medium', 'low']);
const issueType = z.enum(['task', 'bug', 'story', 'incident', 'improvement']);
const column = z.string().min(1).max(50);
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/).nullable().optional();
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/).optional();

const subtaskSchema = z.object({
    id: z.string(),
    text: z.string().min(1).max(500),
    done: z.boolean(),
});

const commentSchema = z.object({
    id: z.string(),
    text: z.string().min(1).max(2000),
    createdAt: z.number(),
    author: z.string().max(100).optional(),
    authorId: z.string().optional(),
});

// ── Cards ────────────────────────────────────────────────────
export const createCardSchema = z.object({
    title: z.string().min(1, 'Başlık boş olamaz').max(200).trim(),
    desc: z.string().max(2000).optional().default(''),
    issueType: issueType.optional().default('task'),
    assignee: z.string().max(100).optional().default(''),
    priority: priority.optional().default('medium'),
    col: column.optional().default('todo'),
    startDate: dateStr,
    dueDate: dateStr,
    labels: z.array(z.string().max(50)).max(10).optional().default([]),
    storyPoints: z.number().int().min(0).max(9999).nullable().optional(),
    estimatedEffort: z.number().int().min(0).max(9999).nullable().optional(),
    spentEffort: z.number().int().min(0).max(9999).nullable().optional(),
    subtasks: z.array(subtaskSchema).max(100).optional().default([]),
    epicId: z.string().nullable().optional(),
    sprintId: z.string().nullable().optional(),
    blockedBy: z.array(z.string()).optional().default([]),
    blocks: z.array(z.string()).optional().default([]),
    customFields: z.record(z.string(), z.any()).optional().default({}),
    slaTargetHours: z.number().min(0).max(8760).nullable().optional(),
});

export const updateCardSchema = z.object({
    title: z.string().min(1, 'Başlık boş olamaz').max(200).trim().optional(),
    desc: z.string().max(2000).optional(),
    issueType: issueType.optional(),
    assignee: z.string().max(100).optional(),
    priority: priority.optional(),
    col: column.optional(),
    column: column.optional(),
    startDate: dateStr,
    dueDate: dateStr,
    labels: z.array(z.string().max(50)).max(10).optional(),
    storyPoints: z.number().int().min(0).max(9999).nullable().optional(),
    estimatedEffort: z.number().int().min(0).max(9999).nullable().optional(),
    spentEffort: z.number().int().min(0).max(9999).nullable().optional(),
    subtasks: z.array(subtaskSchema).max(100).optional(),
    comments: z.array(commentSchema).max(500).optional(),
    epicId: z.string().nullable().optional(),
    sprintId: z.string().nullable().optional(),
    blockedBy: z.array(z.string()).optional(),
    blocks: z.array(z.string()).optional(),
    customFields: z.record(z.string(), z.any()).optional(),
    slaTargetHours: z.number().min(0).max(8760).nullable().optional(),
    slaDueAt: z.number().nullable().optional(),
    slaCompletedAt: z.number().nullable().optional(),
    slaBreached: z.boolean().optional(),
});

export const createCustomFieldSchema = z.object({
    name: z.string().min(1, 'Alan adı boş olamaz').max(50).trim(),
    type: z.enum(['text', 'number', 'currency', 'select', 'checkbox']),
    options: z.array(z.string().max(100)).max(50).optional(),
    unit: z.string().max(20).optional(),
    required: z.boolean().optional().default(false)
});

export const updateCustomFieldSchema = z.object({
    name: z.string().min(1).max(50).trim().optional(),
    type: z.enum(['text', 'number', 'currency', 'select', 'checkbox']).optional(),
    options: z.array(z.string().max(100)).max(50).optional(),
    unit: z.string().max(20).optional(),
    required: z.boolean().optional()
});

export const createAutomationSchema = z.object({
    name: z.string().min(1, 'Kural adı boş olamaz').max(100).trim(),
    active: z.boolean().optional(),
    isActive: z.boolean().optional(),
    trigger: z.enum(['card_created', 'status_changed', 'priority_changed', 'assignee_changed']),
    triggerCondition: z.object({
        field: z.string().max(50).optional(),
        operator: z.enum(['equals', 'not_equals', 'contains']).optional(),
        value: z.any().optional()
    }).optional(),
    action: z.enum(['set_priority', 'set_column', 'add_label', 'assign_user', 'send_notification', 'set_sla']),
    actionConfig: z.object({
        priority: priority.optional(),
        column: z.string().max(50).optional(),
        labelId: z.string().max(50).optional(),
        assignee: z.string().max(100).optional(),
        notifyMessage: z.string().max(500).optional(),
        message: z.string().max(500).optional(),
        slaHours: z.number().min(1).max(8760).optional()
    }).passthrough().optional()
});

export const updateAutomationSchema = z.object({
    name: z.string().min(1).max(100).trim().optional(),
    active: z.boolean().optional(),
    isActive: z.boolean().optional(),
    trigger: z.enum(['card_created', 'status_changed', 'priority_changed', 'assignee_changed']).optional(),
    triggerCondition: z.object({
        field: z.string().max(50).optional(),
        operator: z.enum(['equals', 'not_equals', 'contains']).optional(),
        value: z.any().optional()
    }).optional(),
    action: z.enum(['set_priority', 'set_column', 'add_label', 'assign_user', 'send_notification', 'set_sla']).optional(),
    actionConfig: z.object({
        priority: priority.optional(),
        column: z.string().max(50).optional(),
        labelId: z.string().max(50).optional(),
        assignee: z.string().max(100).optional(),
        notifyMessage: z.string().max(500).optional(),
        message: z.string().max(500).optional(),
        slaHours: z.number().min(1).max(8760).optional()
    }).passthrough().optional()
});

// ── Columns ──────────────────────────────────────────────────
export const createColumnSchema = z.object({
    id: z.string().min(1).max(50).optional(),
    name: z.string().min(1, 'Kolon adı boş olamaz').max(100).trim(),
    color: hexColor.optional().default('#6366f1'),
    wipLimit: z.number().int().min(0).max(999).optional().default(0),
    order: z.number().int().min(0).optional(),
    isDone: z.boolean().optional().default(false)
});

export const updateColumnSchema = z.object({
    name: z.string().min(1, 'Kolon adı boş olamaz').max(100).trim().optional(),
    color: hexColor.optional(),
    wipLimit: z.number().int().min(0).max(999).optional(),
    order: z.number().int().min(0).optional(),
    isDone: z.boolean().optional()
});

export const reorderColumnsSchema = z.object({
    columnIds: z.array(z.string().min(1))
});

// ── Epics ────────────────────────────────────────────────────
export const createEpicSchema = z.object({
    name: z.string().min(1, 'Epic adı boş olamaz').max(100).trim(),
    color: hexColor.default('#6366f1'),
});

export const updateEpicSchema = createEpicSchema.partial();

// ── Sprints ──────────────────────────────────────────────────
export const createSprintSchema = z.object({
    name: z.string().min(1, 'Sprint adı boş olamaz').max(100).trim(),
    startDate: dateStr,
    endDate: dateStr,
});

export const updateSprintSchema = createSprintSchema.partial().extend({
    active: z.boolean().optional(),
    status: z.enum(['planned', 'active', 'closed']).optional(),
});

export const completeSprintSchema = z.object({
    incompleteAction: z.enum(['backlog', 'next_sprint']).default('backlog'),
    targetSprintId: z.string().nullable().optional(),
});
export type CompleteSprintInput = z.infer<typeof completeSprintSchema>;

export const performanceFilterSchema = z.object({
    timeRange: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sprintId: z.string().optional(),
    assignee: z.string().optional(),
});
export type PerformanceFilterInput = z.infer<typeof performanceFilterSchema>;

// ── Auth ─────────────────────────────────────────────────────
export const registerSchema = z.object({
    username: z.string().min(3, 'Kullanıcı adı veya e-posta en az 3 karakter olmalıdır').max(100).regex(/^[a-zA-Z0-9_.@+-]+$/, 'Geçersiz kullanıcı adı veya e-posta'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(100),
    name: z.string().min(1, 'İsim boş olamaz').max(100).trim(),
    company: z.string().max(100).optional(),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Kullanıcı adı veya e-posta gerekli').max(100),
    password: z.string().min(1, 'Şifre gerekli'),
    company: z.string().max(100).optional(),
});

// ── Labels ───────────────────────────────────────────────────
export const createLabelSchema = z.object({
    name: z.string().min(1, 'Etiket adı boş olamaz').max(50).trim(),
    color: hexColor.default('#6366f1'),
});

export const updateLabelSchema = createLabelSchema.partial();

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type CreateEpicInput = z.infer<typeof createEpicSchema>;
export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;

export const requestDemoSchema = z.object({
    name: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır').max(100).trim(),
    email: z.string().email('Geçersiz e-posta adresi').trim(),
});
export type RequestDemoInput = z.infer<typeof requestDemoSchema>;

