// ============================================================
//  api.js – REST client
// ============================================================
const API = {
    // Cards
    async getCards() { return _get('/api/cards'); },
    async addCard(d) { return _post('/api/cards', d); },
    async updateCard(id, d) { return _put(`/api/cards/${id}`, d); },
    async deleteCard(id) { return _del(`/api/cards/${id}`); },
    // Epics
    async getEpics() { return _get('/api/epics'); },
    async addEpic(d) { return _post('/api/epics', d); },
    async updateEpic(id, d) { return _put(`/api/epics/${id}`, d); },
    async deleteEpic(id) { return _del(`/api/epics/${id}`); },
    // Sprints
    async getSprints() { return _get('/api/sprints'); },
    async addSprint(d) { return _post('/api/sprints', d); },
    async updateSprint(id, d) { return _put(`/api/sprints/${id}`, d); },
    async deleteSprint(id) { return _del(`/api/sprints/${id}`); },
};

async function _get(url) {
    const r = await fetch(url); if (!r.ok) throw new Error(`GET ${url} failed`); return r.json();
}
async function _post(url, d) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    if (!r.ok) throw new Error(`POST ${url} failed`); return r.json();
}
async function _put(url, d) {
    const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
    if (!r.ok) throw new Error(`PUT ${url} failed`); return r.json();
}
async function _del(url) {
    const r = await fetch(url, { method: 'DELETE' }); if (!r.ok) throw new Error(`DELETE ${url} failed`); return r.json();
}
