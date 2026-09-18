// ============================================================
//  Issue Templates Routes (Jira / Monday Style Issue Templates)
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity, getEnvironment } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError, AppError, asyncHandler } from '../middleware/error.js';
import { createTemplateSchema, updateTemplateSchema } from '../lib/schemas.js';
import type { CardTemplate } from '../types/index.js';

export const templatesRouter = Router();
templatesRouter.use(requireAuth);

export const DEFAULT_SYSTEM_TEMPLATES: CardTemplate[] = [
    {
        id: 'sys-tpl-bug',
        name: '🐛 Hata Bildirimi (Bug Report)',
        description: 'Standart hata bildirimi şablonu (Adımlar, Beklenen & Gerçekleşen sonuç)',
        issueType: 'bug',
        titleTemplate: '[HATA] ',
        descTemplate: `### 📋 Adımlar (Steps to Reproduce):
1. ...
2. ...

### 🎯 Beklenen Sonuç:
...

### 💥 Gerçekleşen Sonuç:
...

### 🖥️ Ortam Bilgileri:
- Tarayıcı / OS:
- Versiyon:`,
        priority: 'high',
        labels: ['bug', 'triage'],
        subtasks: ['Hatayı yerel ortamda test et & doğrula', 'Kök neden analizi yap', 'Düzeltme PR\'ı hazırla', 'Regresyon testi yap'],
        createdAt: 1700000000000
    },
    {
        id: 'sys-tpl-story',
        name: '📖 Kullanıcı Hikayesi (User Story)',
        description: 'Gherkin / Acceptance Criteria formatında özellik şablonu',
        issueType: 'story',
        titleTemplate: 'Kullanıcı olarak ... istiyorum böylece ...',
        descTemplate: `### 👤 Kullanıcı Değeri:
Kullanıcı olarak [rol], [eylem] yapmak istiyorum, böylece [fayda] elde edebileyim.

### ✅ Kabul Kriterleri (Acceptance Criteria):
- [ ] GIVEN [başlangıç durumu] WHEN [eylem] THEN [beklenen sonuç]
- [ ] Tasarım kılavuzlarına ve responsive standartlara uyum
- [ ] Başarılı ve başarısız senaryolar için test kapsamı`,
        priority: 'medium',
        labels: ['feature', 'user-story'],
        subtasks: ['UI/UX tasarımı onayla', 'Backend API entegrasyonu', 'Frontend bileşenlerini kodla', 'QA kabul testlerini tamamla'],
        createdAt: 1700000000000
    },
    {
        id: 'sys-tpl-spike',
        name: '💡 Teknik İnceleme / Spike',
        description: 'Mimari araştırma, PoC ve teknoloji değerlendirme şablonu',
        issueType: 'task',
        titleTemplate: 'Teknik İnceleme: ',
        descTemplate: `### 🎯 Araştırma Amacı & Kapsam:
...

### 🔍 Araştırılacak Alternatifler:
1. Alternatif A (Artılar / Eksiler)
2. Alternatif B (Artılar / Eksiler)

### 📊 Beklenen Çıktılar:
- [ ] Karar dökümanı (ADR)
- [ ] Çalışan örnek PoC
- [ ] Ekip ile paylaşım & sunum`,
        priority: 'medium',
        labels: ['spike', 'tech-debt'],
        subtasks: ['Dokümantasyon & kütüphane incelemesi', 'Hızlı PoC prototipi oluştur', 'Maliyet & performans kıyaslama raporu hazırla'],
        createdAt: 1700000000000
    }
];

/** GET /api/templates - Get all templates (built-in + workspace-defined) */
templatesRouter.get('/', (req, res) => {
    const db = readDb(req);
    const custom = db.templates || [];
    res.json([...DEFAULT_SYSTEM_TEMPLATES, ...custom]);
});

/** POST /api/templates - Create a new custom template */
templatesRouter.post('/', validate(createTemplateSchema), asyncHandler(async (req, res) => {
    const db = readDb(req);
    if (!Array.isArray(db.templates)) db.templates = [];

    const body = req.body;
    const template: CardTemplate = {
        id: 'tpl-' + uid(),
        name: body.name.trim(),
        description: body.description?.trim() || '',
        issueType: body.issueType || 'task',
        titleTemplate: body.titleTemplate || '',
        descTemplate: body.descTemplate || '',
        priority: body.priority || 'medium',
        labels: body.labels || [],
        subtasks: body.subtasks || [],
        createdAt: Date.now()
    };

    db.templates.push(template);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'WORKSPACE_UPDATE',
        entityType: 'workspace',
        entityId: req.tenantId || 'personal',
        details: `Yeni bilet şablonu oluşturuldu: '${template.name}'`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.status(201).json(template);
}));

/** PUT /api/templates/:id - Update a custom template */
templatesRouter.put('/:id', validate(updateTemplateSchema), asyncHandler(async (req, res) => {
    const templateId = String(req.params.id);
    if (DEFAULT_SYSTEM_TEMPLATES.some(t => t.id === templateId)) {
        throw new AppError('Sistem şablonları düzenlenemez', 400);
    }

    const db = readDb(req);
    if (!Array.isArray(db.templates)) db.templates = [];

    const template = db.templates.find(t => t.id === templateId);
    if (!template) {
        throw new NotFoundError('Şablon bulunamadı');
    }

    const body = req.body;
    if (body.name !== undefined) template.name = body.name.trim();
    if (body.description !== undefined) template.description = body.description.trim();
    if (body.issueType !== undefined) template.issueType = body.issueType;
    if (body.titleTemplate !== undefined) template.titleTemplate = body.titleTemplate;
    if (body.descTemplate !== undefined) template.descTemplate = body.descTemplate;
    if (body.priority !== undefined) template.priority = body.priority;
    if (body.labels !== undefined) template.labels = body.labels;
    if (body.subtasks !== undefined) template.subtasks = body.subtasks;

    writeDbSync(db, req);
    res.json(template);
}));

/** DELETE /api/templates/:id - Delete a custom template */
templatesRouter.delete('/:id', asyncHandler(async (req, res) => {
    const templateId = String(req.params.id);
    if (DEFAULT_SYSTEM_TEMPLATES.some(t => t.id === templateId)) {
        throw new AppError('Sistem şablonları silinemez', 400);
    }

    const db = readDb(req);
    if (!Array.isArray(db.templates)) db.templates = [];

    const idx = db.templates.findIndex(t => t.id === templateId);
    if (idx === -1) {
        throw new NotFoundError('Şablon bulunamadı');
    }

    const removed = db.templates.splice(idx, 1)[0];
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'WORKSPACE_UPDATE',
        entityType: 'workspace',
        entityId: req.tenantId || 'personal',
        details: `'${removed.name}' bilet şablonu silindi.`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json({ success: true });
}));
