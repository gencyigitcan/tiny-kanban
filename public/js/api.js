// ============================================================
//  api.js – Pure REST Client for Kanban Web Application
//  Direct server database communication with token management.
//  No client-side database emulation (localStorage DB eliminated).
// ============================================================

const API_ROOT = '';
const IS_DEMO = window.IS_DEMO_PAGE === true || window.location.pathname.includes('demo');

// REST wrapper helper that sends requests directly to the server API
async function request(url, options = {}) {
    const token = localStorage.getItem('tiny_kanban_token') || localStorage.getItem('kanban_token');
    options.headers = {
        ...(options.headers || {})
    };
    
    // In demo mode or if session is demo, scope requests to demo tenant
    if ((token && token.startsWith('demo:')) || IS_DEMO) {
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
        const errBody = await r.json().catch(() => ({}));
        
        // When attempting login or register, throw the exact server message (e.g. "Kullanıcı adı veya şifre hatalı")
        if (url.includes('/api/auth/login') || url.includes('/api/auth/demo-login') || url.includes('/api/auth/register')) {
            throw new Error(errBody.error || 'Kullanıcı adı veya şifre hatalı');
        }

        if (!IS_DEMO) {
            localStorage.removeItem('tiny_kanban_token');
            localStorage.removeItem('kanban_token');
            window.dispatchEvent(new Event('unauthorized'));
        }
        throw new Error(errBody.error || 'Oturum süresi doldu veya yetkisiz erişim');
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
    async completeSprint(id, payload) {
        return await request(`/api/sprints/${id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async getSprintReport(id) {
        return await request(`/api/sprints/${id}/report`);
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
            localStorage.setItem('kanban_token', res.token);
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
            localStorage.setItem('kanban_token', res.token);
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
            localStorage.setItem('kanban_token', res.token);
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
            localStorage.removeItem('kanban_token');
        }
    },
    async getMe() {
        return await request('/api/auth/me');
    },

    // ── Workspaces & Team Administration ────────────────────
    async getWorkspaces() {
        return await request('/api/admin/workspaces');
    },
    async createWorkspace(name, description, memberIds, template, columns) {
        return await request('/api/admin/workspaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, memberIds, template, columns })
        });
    },

    // ── Dynamic Workflow Columns ───────────────────────────
    async getColumns() {
        return await request('/api/columns');
    },
    async createColumn(payload) {
        return await request('/api/columns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async updateColumn(columnId, payload) {
        return await request(`/api/columns/${columnId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async reorderColumns(columnIds) {
        return await request('/api/columns/reorder', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ columnIds })
        });
    },
    async deleteColumn(columnId, fallbackCol) {
        const query = fallbackCol ? `?fallbackCol=${encodeURIComponent(fallbackCol)}` : '';
        return await request(`/api/columns/${columnId}${query}`, {
            method: 'DELETE'
        });
    },
    async getCustomFields() {
        return await request('/api/custom-fields');
    },
    async createCustomField(data) {
        return await request('/api/custom-fields', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    async updateCustomField(fieldId, data) {
        return await request(`/api/custom-fields/${fieldId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    async deleteCustomField(fieldId) {
        return await request(`/api/custom-fields/${fieldId}`, {
            method: 'DELETE'
        });
    },
    async getAutomations() {
        return await request('/api/automations');
    },
    async createAutomation(data) {
        return await request('/api/automations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    async updateAutomation(ruleId, data) {
        return await request(`/api/automations/${ruleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    async deleteAutomation(ruleId) {
        return await request(`/api/automations/${ruleId}`, {
            method: 'DELETE'
        });
    },
    async updateWorkspace(workspaceId, data) {
        return await request(`/api/admin/workspaces/${workspaceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    async deleteWorkspace(workspaceId) {
        return await request(`/api/admin/workspaces/${workspaceId}`, {
            method: 'DELETE'
        });
    },
    async getWorkspaceMembers(workspaceId) {
        return await request(`/api/admin/workspaces/${workspaceId}/members`);
    },
    async updateWorkspaceMembers(workspaceId, members) {
        return await request(`/api/admin/workspaces/${workspaceId}/members`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ members })
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
        if (params.workspace) qs.set('workspace', params.workspace);
        const query = qs.toString() ? `?${qs.toString()}` : '';
        return await request(`/api/admin/logs${query}`);
    },
    async getDemoUsers() {
        return await request('/api/auth/demo-users');
    },
    async demoLogin(username) {
        const res = await request('/api/auth/demo-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        if (res.token) {
            localStorage.setItem('tiny_kanban_token', res.token);
            localStorage.setItem('kanban_token', res.token);
        }
        return res;
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
    },

    // ── Reports & Performance ────────────────────────────────
    async getEmployeePerformance(params = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') query.append(k, v);
        });
        const qs = query.toString();
        return await request(`/api/reports/employee-performance${qs ? '?' + qs : ''}`);
    },
    async getClosedSprints() {
        return await request('/api/reports/closed-sprints');
    },

    // ── Issue Templates ──────────────────────────────────────
    async getTemplates() {
        return await request('/api/templates');
    },
    async createTemplate(payload) {
        return await request('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    },
    async deleteTemplate(id) {
        return await request(`/api/templates/${id}`, { method: 'DELETE' });
    }
};
