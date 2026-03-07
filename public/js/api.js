// ============================================================
//  api.js – REST client (used by board.html only)
// ============================================================

const API = {
    async getCards() {
        const r = await fetch('/api/cards');
        if (!r.ok) throw new Error('Failed to load cards');
        return r.json();
    },
    async addCard(data) {
        const r = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!r.ok) throw new Error('Failed to add card');
        return r.json();
    },
    async updateCard(id, data) {
        const r = await fetch(`/api/cards/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!r.ok) throw new Error('Failed to update card');
        return r.json();
    },
    async deleteCard(id) {
        const r = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
        if (!r.ok) throw new Error('Failed to delete card');
        return r.json();
    }
};
