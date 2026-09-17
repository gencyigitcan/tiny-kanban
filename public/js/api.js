// ============================================================
//  api.js – Pure REST Client for Kanban Web Application
//  Direct server database communication with token management.
//  No client-side database emulation (localStorage DB eliminated).
// ============================================================

const API_ROOT = '';
const IS_DEMO = window.IS_DEMO_PAGE === true || window.location.pathname.includes('demo');

// REST wrapper helper that sends requests directly to the server API
async function request(url, options = {}) {
    const token = localStorage.getItem('tiny_kanban_token');
    options.headers = {
        ...(options.headers || {})
    };
    
    // In demo mode, automatically scope requests to demo tenant
    if (IS_DEMO) {
        options.headers['X-Workspace'] = 'demo';
        options.headers['X-Tenant-Id'] = 'demo';
    }
    
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    let r;
    try {
        r = await fetch(url, options);
    } catch (networkErr) {
        console.error('Network request failed:', networkErr);
        throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    }

    if (r.status === 401) {
        if (!IS_DEMO) {
            localStorage.removeItem('tiny_kanban_token');
            window.dispatchEvent(new Event('unauthorized'));
        }
        throw new Error('Oturum süresi doldu veya yetkisiz erişim');
    }

    if (!r.ok) {
        const errBody = await r.json().catch(() => ({}));
        throw new Error(errBody.error || `Sunucu hatası (${r.status})`);
    }

    return await r.json();
}

const API = {
    // ── Cards ────────────────────────────────────────────────
    async getCards() {
        return await request('/api/cards');
    },
    async addCard(payload) {
        return await request('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async updateCard(id, payload) {
        return await request(`/api/cards/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async deleteCard(id) {
        return await request(`/api/cards/${id}`, { method: 'DELETE' });
    },
    async recordCardView(id) {
        try {
            return await request(`/api/cards/${id}/view`, { method: 'POST' });
        } catch (e) {
            return null;
        }
    },
    async getCardActivity(id) {
        try {
            return await request(`/api/cards/${id}/activity`);
        } catch (e) {
            return { activity: [] };
        }
    },
    async addCardComment(id, text) {
        return await request(`/api/cards/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
    },

    // ── Epics ────────────────────────────────────────────────
    async getEpics() {
        return await request('/api/epics');
    },
    async addEpic(payload) {
        return await request('/api/epics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async updateEpic(id, payload) {
        return await request(`/api/epics/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async deleteEpic(id) {
        return await request(`/api/epics/${id}`, { method: 'DELETE' });
    },

    // ── Sprints ──────────────────────────────────────────────
    async getSprints() {
        return await request('/api/sprints');
    },
    async addSprint(payload) {
        return await request('/api/sprints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async updateSprint(id, payload) {
        return await request(`/api/sprints/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async deleteSprint(id) {
        return await request(`/api/sprints/${id}`, { method: 'DELETE' });
    },

    // ── Authentication & Session ────────────────────────────
    async login(username, password, company) {
        const res = await request('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, company: company || undefined })
        });
        if (res.token) {
            localStorage.setItem('tiny_kanban_token', res.token);
        }
        return res;
    },
    async register(username, password, name, company) {
        const res = await request('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, name, company: company || undefined })
        });
        if (res.token) {
            localStorage.setItem('tiny_kanban_token', res.token);
        }
        return res;
    },
    async switchWorkspace(workspaceId) {
        const res = await request('/api/auth/switch-workspace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workspaceId })
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
            console.warn('Logout request failed:', e);
        } finally {
            localStorage.removeItem('tiny_kanban_token');
        }
    },
    async getMe() {
        return await request('/api/auth/me');
    },

    // ── Workspaces & Team Administration ────────────────────
    async getWorkspaces() {
        return await request('/api/admin/workspaces');
    },
    async createWorkspace(name, description) {
        return await request('/api/admin/workspaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });
    },
    async getAdminUsers() {
        return await request('/api/admin/users');
    },
    async createAdminUser(payload) {
        return await request('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async updateUserWorkspaces(userId, workspaces) {
        return await request(`/api/admin/users/${userId}/workspaces`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workspaces })
        });
    },
    async deleteAdminUser(userId) {
        return await request(`/api/admin/users/${userId}`, { method: 'DELETE' });
    },
    async getPendingUsers() {
        return await request('/api/admin/pending-users');
    },
    async approveUser(userId) {
        return await request(`/api/admin/users/${userId}/approve`, { method: 'POST' });
    },
    async rejectUser(userId) {
        return await request(`/api/admin/users/${userId}/reject`, { method: 'POST' });
    },
    async getDetailedUsers() {
        return await request('/api/admin/users/detailed');
    },
    async getAuditLogs(params = {}) {
        const qs = new URLSearchParams();
        if (params.user) qs.set('user', params.user);
        if (params.action) qs.set('action', params.action);
        if (params.cardKey) qs.set('cardKey', params.cardKey);
        if (params.q) qs.set('q', params.q);
        const query = qs.toString() ? `?${qs.toString()}` : '';
        return await request(`/api/admin/logs${query}`);
    },
    async getUsers() {
        return await request('/api/users');
    },

    // ── Custom Labels ────────────────────────────────────────
    async getLabels() {
        return await request('/api/labels');
    },
    async addLabel(payload) {
        return await request('/api/labels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async deleteLabel(id) {
        return await request(`/api/labels/${id}`, { method: 'DELETE' });
    },

    // ── Notifications ────────────────────────────────────────
    async getNotifications() {
        return await request('/api/notifications');
    },
    async readNotification(id) {
        return await request(`/api/notifications/${id}/read`, { method: 'POST' });
    },
    async readAllNotifications() {
        return await request('/api/notifications/read-all', { method: 'POST' });
    }
};
