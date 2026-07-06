// ============================================================
//  api.js – REST client with Automatic LocalStorage Fallback
// ============================================================

const API_ROOT = '';
const IS_DEMO = window.location.pathname.includes('demo.html');
const LS_KEY = IS_DEMO ? 'tiny_kanban_demo_db' : 'tiny_kanban_db';

// Global state to track mode
window.isLocalStorageMode = IS_DEMO || false;

// Default empty structure
const EMPTY_DB = { cards: [], epics: [], sprints: [] };

function getLocalData() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) {
            localStorage.setItem(LS_KEY, JSON.stringify(EMPTY_DB));
            return structuredClone(EMPTY_DB);
        }
        const parsed = JSON.parse(raw);
        return {
            cards: Array.isArray(parsed.cards) ? parsed.cards : [],
            epics: Array.isArray(parsed.epics) ? parsed.epics : [],
            sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
        };
    } catch {
        return structuredClone(EMPTY_DB);
    }
}

function saveLocalData(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// Generate client-side short collision-resistant ID
function localUid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// REST wrapper helper that falls back on network errors
async function request(url, options = {}) {
    if (window.isLocalStorageMode) {
        throw new Error('Local storage mode active');
    }
    try {
        const token = localStorage.getItem('tiny_kanban_token');
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        const r = await fetch(url, options);
        if (r.status === 401) {
            localStorage.removeItem('tiny_kanban_token');
            window.dispatchEvent(new Event('unauthorized'));
            throw new Error('Unauthorized');
        }
        if (!r.ok) {
            const errBody = await r.json().catch(() => ({}));
            throw new Error(errBody.error || `Server returned status ${r.status}`);
        }
        return await r.json();
    } catch (e) {
        if (e.message === 'Unauthorized') {
            throw e;
        }
        // Fall back to LocalStorage on connection error (except on clean exit / aborted fetches)
        if (!IS_DEMO && !window.isLocalStorageMode) {
            console.warn('API server is offline. Switching to client-side LocalStorage mode.', e);
            window.isLocalStorageMode = true;
            if (window.showToast) {
                window.showToast('Sunucu çevrimdışı. Tarayıcı hafızası moduna geçildi.', 'warn');
            }
        }
        throw e;
    }
}

const API = {
    // ── Cards ────────────────────────────────────────────────
    async getCards() {
        try {
            return await request('/api/cards');
        } catch {
            return getLocalData().cards;
        }
    },
    async addCard(payload) {
        try {
            return await request('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch {
            const db = getLocalData();
            const newCard = {
                id: localUid(),
                title: payload.title?.trim() || 'Yeni Görev',
                desc: payload.desc || '',
                assignee: payload.assignee || '',
                priority: payload.priority || 'medium',
                col: payload.col || 'todo',
                startDate: payload.startDate || null,
                dueDate: payload.dueDate || null,
                labels: Array.isArray(payload.labels) ? payload.labels : [],
                storyPoints: payload.storyPoints != null ? Number(payload.storyPoints) : null,
                estimatedEffort: payload.estimatedEffort != null ? Number(payload.estimatedEffort) : null,
                spentEffort: payload.spentEffort != null ? Number(payload.spentEffort) : null,
                subtasks: Array.isArray(payload.subtasks) ? payload.subtasks : [],
                comments: Array.isArray(payload.comments) ? payload.comments : [],
                epicId: payload.epicId || null,
                sprintId: payload.sprintId || null,
                createdAt: Date.now()
            };
            db.cards.push(newCard);
            saveLocalData(db);
            return newCard;
        }
    },
    async updateCard(id, payload) {
        try {
            return await request(`/api/cards/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch {
            const db = getLocalData();
            const idx = db.cards.findIndex(c => c.id === id);
            if (idx === -1) throw new Error('Card not found');
            
            const card = db.cards[idx];
            // Merging fields
            if (payload.title !== undefined) card.title = payload.title.trim();
            if (payload.desc !== undefined) card.desc = payload.desc;
            if (payload.assignee !== undefined) card.assignee = payload.assignee;
            if (payload.priority !== undefined) card.priority = payload.priority;
            if (payload.col !== undefined) card.col = payload.col;
            if (payload.startDate !== undefined) card.startDate = payload.startDate;
            if (payload.dueDate !== undefined) card.dueDate = payload.dueDate;
            if (payload.labels !== undefined) card.labels = payload.labels;
            if (payload.storyPoints !== undefined) card.storyPoints = payload.storyPoints != null ? Number(payload.storyPoints) : null;
            if (payload.estimatedEffort !== undefined) card.estimatedEffort = payload.estimatedEffort != null ? Number(payload.estimatedEffort) : null;
            if (payload.spentEffort !== undefined) card.spentEffort = payload.spentEffort != null ? Number(payload.spentEffort) : null;
            if (payload.subtasks !== undefined) card.subtasks = payload.subtasks;
            if (payload.comments !== undefined) card.comments = payload.comments;
            if (payload.epicId !== undefined) card.epicId = payload.epicId;
            if (payload.sprintId !== undefined) card.sprintId = payload.sprintId;

            saveLocalData(db);
            return card;
        }
    },
    async deleteCard(id) {
        try {
            return await request(`/api/cards/${id}`, { method: 'DELETE' });
        } catch {
            const db = getLocalData();
            db.cards = db.cards.filter(c => c.id !== id);
            saveLocalData(db);
            return { success: true };
        }
    },

    // ── Epics ────────────────────────────────────────────────
    async getEpics() {
        try {
            return await request('/api/epics');
        } catch {
            return getLocalData().epics;
        }
    },
    async addEpic(payload) {
        try {
            return await request('/api/epics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch {
            const db = getLocalData();
            const newEpic = {
                id: localUid(),
                name: payload.name?.trim() || 'Yeni Epic',
                color: payload.color || '#6366f1',
                createdAt: Date.now()
            };
            db.epics.push(newEpic);
            saveLocalData(db);
            return newEpic;
        }
    },
    async updateEpic(id, payload) {
        try {
            return await request(`/api/epics/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch {
            const db = getLocalData();
            const idx = db.epics.findIndex(e => e.id === id);
            if (idx === -1) throw new Error('Epic not found');
            if (payload.name !== undefined) db.epics[idx].name = payload.name.trim();
            if (payload.color !== undefined) db.epics[idx].color = payload.color;
            saveLocalData(db);
            return db.epics[idx];
        }
    },
    async deleteEpic(id) {
        try {
            return await request(`/api/epics/${id}`, { method: 'DELETE' });
        } catch {
            const db = getLocalData();
            db.epics = db.epics.filter(e => e.id !== id);
            // Unlink cards with this epicId
            db.cards.forEach(c => {
                if (c.epicId === id) c.epicId = null;
            });
            saveLocalData(db);
            return { success: true };
        }
    },

    // ── Sprints ──────────────────────────────────────────────
    async getSprints() {
        try {
            return await request('/api/sprints');
        } catch {
            return getLocalData().sprints;
        }
    },
    async addSprint(payload) {
        try {
            return await request('/api/sprints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch {
            const db = getLocalData();
            const newSprint = {
                id: localUid(),
                name: payload.name?.trim() || 'Yeni Sprint',
                startDate: payload.startDate || null,
                endDate: payload.endDate || null,
                active: false,
                createdAt: Date.now()
            };
            db.sprints.push(newSprint);
            saveLocalData(db);
            return newSprint;
        }
    },
    async updateSprint(id, payload) {
        try {
            return await request(`/api/sprints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch {
            const db = getLocalData();
            const idx = db.sprints.findIndex(s => s.id === id);
            if (idx === -1) throw new Error('Sprint not found');
            const sprint = db.sprints[idx];
            if (payload.name !== undefined) sprint.name = payload.name.trim();
            if (payload.startDate !== undefined) sprint.startDate = payload.startDate;
            if (payload.endDate !== undefined) sprint.endDate = payload.endDate;
            if (payload.active !== undefined) {
                sprint.active = payload.active;
                if (payload.active) {
                    // Deactivate all other sprints
                    db.sprints.forEach(s => {
                        if (s.id !== id) s.active = false;
                    });
                }
            }
            saveLocalData(db);
            return sprint;
        }
    },
    async deleteSprint(id) {
        try {
            return await request(`/api/sprints/${id}`, { method: 'DELETE' });
        } catch {
            const db = getLocalData();
            db.sprints = db.sprints.filter(s => s.id !== id);
            // Unlink cards with this sprintId
            db.cards.forEach(c => {
                if (c.sprintId === id) c.sprintId = null;
            });
            saveLocalData(db);
            return { success: true };
        }
    },
    // ── Authentication ──────────────────────────────────────
    async login(username, password) {
        const res = await request('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (res.token) {
            localStorage.setItem('tiny_kanban_token', res.token);
        }
        return res;
    },
    async register(username, password, name) {
        const res = await request('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, name })
        });
        if (res.token) {
            localStorage.setItem('tiny_kanban_token', res.token);
        }
        return res;
    },
    async logout() {
        try {
            await request('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.warn('Logout server request failed:', e);
        } finally {
            localStorage.removeItem('tiny_kanban_token');
        }
    },
    async getMe() {
        return await request('/api/auth/me');
    },
    async getUsers() {
        try {
            return await request('/api/users');
        } catch (e) {
            // Local fallback users
            return [
                { id: 'usr-1', username: 'admin', name: 'Ali Yılmaz', avatarColor: '#4f46e5' },
                { id: 'usr-2', username: 'zeynep', name: 'Zeynep Kaya', avatarColor: '#0ea5e9' },
                { id: 'usr-3', username: 'mehmet', name: 'Mehmet Demir', avatarColor: '#10b981' }
            ];
        }
    },
    // ── Custom Labels ────────────────────────────────────────
    async getLabels() {
        try {
            return await request('/api/labels');
        } catch {
            return getLocalData().labels || [];
        }
    },
    async addLabel(payload) {
        try {
            return await request('/api/labels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch {
            const db = getLocalData();
            db.labels = db.labels || [];
            const hex = payload.color || '#6366f1';
            const newLabel = {
                id: localUid(),
                name: payload.name.trim(),
                color: hex,
                bg: `${hex}1a`,
                createdAt: Date.now()
            };
            db.labels.push(newLabel);
            saveLocalData(db);
            return newLabel;
        }
    },
    async deleteLabel(id) {
        try {
            return await request(`/api/labels/${id}`, { method: 'DELETE' });
        } catch {
            const db = getLocalData();
            db.labels = (db.labels || []).filter(l => l.id !== id);
            db.cards.forEach(c => {
                if (c.labels) c.labels = c.labels.filter(lid => lid !== id);
            });
            saveLocalData(db);
            return { success: true };
        }
    },
    // ── Notifications ────────────────────────────────────────
    async getNotifications() {
        try {
            return await request('/api/notifications');
        } catch {
            return [];
        }
    },
    async readNotification(id) {
        try {
            return await request(`/api/notifications/${id}/read`, { method: 'POST' });
        } catch {
            return { success: true };
        }
    },
    async readAllNotifications() {
        try {
            return await request('/api/notifications/read-all', { method: 'POST' });
        } catch {
            return { success: true };
        }
    }
};

// Expose state methods for seeder integration
window.getLocalData = getLocalData;
window.saveLocalData = saveLocalData;
