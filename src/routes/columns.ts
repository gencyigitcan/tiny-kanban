// ============================================================
//  Columns Routes (Workspace-Specific Custom Workflows)
// ============================================================
import { Router } from 'express';
import { readDb, writeDbSync, uid, logActivity, getEnvironment, DEFAULT_COLUMNS, getTenantIndex } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { NotFoundError, AppError, asyncHandler } from '../middleware/error.js';
import { createColumnSchema, updateColumnSchema, reorderColumnsSchema } from '../lib/schemas.js';
import type { BoardColumn } from '../types/index.js';

export const columnRouter = Router();
columnRouter.use(requireAuth);

async function checkCanManageColumns(req: any) {
    const role = req.user?.role;
    if (role === 'superadmin' || role === 'admin') return;
    const currentTenant = req.tenantId || 'personal';
    if (currentTenant === 'personal') return;

    const env = req.environment || getEnvironment(req);
    const index = await getTenantIndex(env);
    const ws = index.workspaces.find(w => w.id === currentTenant);
    if (ws?.ownerId === req.user?.id) return;
    const member = ws?.members?.find(m => m.userId === req.user?.id);
    if (member?.role === 'admin') return;

    throw new AppError('Bu çalışma alanında kolonları yönetmek için yönetici yetkisi gereklidir', 403);
}

/** GET /api/columns - Get active workspace columns */
columnRouter.get('/', (req, res) => {
    const db = readDb(req);
    if (!Array.isArray(db.columns) || db.columns.length === 0) {
        db.columns = [...DEFAULT_COLUMNS];
        writeDbSync(db, req);
    }
    const sorted = [...db.columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    res.json(sorted);
});

/** POST /api/columns - Add a new column to the active workspace */
columnRouter.post('/', validate(createColumnSchema), asyncHandler(async (req, res) => {
    await checkCanManageColumns(req);
    const db = readDb(req);
    db.columns = Array.isArray(db.columns) && db.columns.length > 0 ? db.columns : [...DEFAULT_COLUMNS];

    const body = req.body;
    let colId = body.id ? body.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_') : null;
    if (!colId) {
        colId = 'col_' + uid();
    }

    if (db.columns.some(c => c.id === colId)) {
        colId = colId + '_' + Math.random().toString(36).slice(2, 5);
    }

    const maxOrder = db.columns.reduce((max, c) => Math.max(max, c.order ?? 0), -1);
    const newCol: BoardColumn = {
        id: colId,
        name: body.name.trim(),
        color: body.color || '#6366f1',
        wipLimit: body.wipLimit ?? 0,
        order: body.order !== undefined ? body.order : maxOrder + 1,
        isDone: Boolean(body.isDone)
    };

    db.columns.push(newCol);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'COLUMN_CREATE',
        entityType: 'workspace',
        entityId: colId,
        details: `'${newCol.name}' kolonu eklendi (ID: ${newCol.id}).`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.status(201).json(newCol);
}));

/** PUT /api/columns/reorder - Reorder columns */
columnRouter.put('/reorder', validate(reorderColumnsSchema), asyncHandler(async (req, res) => {
    await checkCanManageColumns(req);
    const db = readDb(req);
    db.columns = Array.isArray(db.columns) && db.columns.length > 0 ? db.columns : [...DEFAULT_COLUMNS];

    const { columnIds } = req.body as { columnIds: string[] };
    const colMap = new Map(db.columns.map(c => [c.id, c]));

    const reordered: BoardColumn[] = [];
    columnIds.forEach((id, idx) => {
        const col = colMap.get(id);
        if (col) {
            col.order = idx;
            reordered.push(col);
            colMap.delete(id);
        }
    });

    // Append any columns not explicitly in columnIds
    let nextOrder = reordered.length;
    colMap.forEach(col => {
        col.order = nextOrder++;
        reordered.push(col);
    });

    db.columns = reordered;
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'COLUMN_REORDER',
        entityType: 'workspace',
        details: 'Kolon sıralaması güncellendi.',
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json(db.columns);
}));

/** PUT /api/columns/:id - Update column name, color, wipLimit, isDone */
columnRouter.put('/:id', validate(updateColumnSchema), asyncHandler(async (req, res) => {
    await checkCanManageColumns(req);
    const db = readDb(req);
    db.columns = Array.isArray(db.columns) && db.columns.length > 0 ? db.columns : [...DEFAULT_COLUMNS];

    const col = db.columns.find(c => c.id === req.params.id);
    if (!col) throw new NotFoundError('Kolon bulunamadı');

    const body = req.body;
    if (body.name !== undefined) col.name = body.name.trim();
    if (body.color !== undefined) col.color = body.color;
    if (body.wipLimit !== undefined) col.wipLimit = Math.max(0, body.wipLimit);
    if (body.order !== undefined) col.order = body.order;
    if (body.isDone !== undefined) col.isDone = Boolean(body.isDone);

    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'COLUMN_UPDATE',
        entityType: 'workspace',
        entityId: col.id,
        details: `'${col.name}' kolonu güncellendi (WIP: ${col.wipLimit}, Bitti Durumu: ${col.isDone ? 'Evet' : 'Hayır'}).`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json(col);
}));

/** DELETE /api/columns/:id - Delete a column and migrate cards */
columnRouter.delete('/:id', asyncHandler(async (req, res) => {
    await checkCanManageColumns(req);
    const db = readDb(req);
    db.columns = Array.isArray(db.columns) && db.columns.length > 0 ? db.columns : [...DEFAULT_COLUMNS];

    if (db.columns.length <= 1) {
        throw new AppError('Panoda en az 1 kolon bulunmalıdır. Tek kalan kolon silinemez.', 400);
    }

    const colIndex = db.columns.findIndex(c => c.id === req.params.id);
    if (colIndex === -1) throw new NotFoundError('Kolon bulunamadı');

    const colToDelete = db.columns[colIndex];
    const requestedFallback = req.query.fallbackCol as string | undefined;
    const fallbackCol = (requestedFallback && db.columns.find(c => c.id === requestedFallback && c.id !== req.params.id))
        || db.columns.find(c => c.id !== req.params.id)!;

    // Migrate any cards currently in this column to the fallback column
    let migratedCount = 0;
    for (const card of db.cards || []) {
        if (card.col === req.params.id) {
            card.col = fallbackCol.id;
            migratedCount++;
        }
    }

    db.columns.splice(colIndex, 1);
    writeDbSync(db, req);

    logActivity({
        userId: req.user?.id || 'unknown',
        username: req.user?.username || 'unknown',
        name: req.user?.name || 'Kullanıcı',
        userRole: req.user?.role || 'user',
        action: 'COLUMN_DELETE',
        entityType: 'workspace',
        entityId: colToDelete.id,
        details: `'${colToDelete.name}' kolonu silindi. ${migratedCount > 0 ? `${migratedCount} kart '${fallbackCol.name}' kolonuna aktarıldı.` : ''}`,
        workspaceId: req.tenantId || 'personal',
        environment: req.environment || getEnvironment(req)
    }, req);

    res.json({
        ok: true,
        deletedId: colToDelete.id,
        migratedCount,
        fallbackColId: fallbackCol.id
    });
}));
