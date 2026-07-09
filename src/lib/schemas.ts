// ============================================================
//  Zod Validation Schemas
// ============================================================
import { z } from 'zod';

const priority = z.enum(['high', 'medium', 'low']);
const column = z.enum(['todo', 'doing', 'done']);
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional();
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
    assignee: z.string().min(1, 'Kişi seçimi zorunludur').max(100).trim(),
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
});

export const updateCardSchema = createCardSchema.partial().extend({
    comments: z.array(commentSchema).max(500).optional(),
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
});

// ── Auth ─────────────────────────────────────────────────────
export const registerSchema = z.object({
    username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Geçersiz kullanıcı adı (sadece harf, sayı ve alt çizgi)'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(100),
    name: z.string().min(1, 'İsim boş olamaz').max(100).trim(),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Kullanıcı adı gerekli'),
    password: z.string().min(1, 'Şifre gerekli'),
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

