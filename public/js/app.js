// ============================================================
//  app.js – Unified interactive controller for Kanban Board
// ============================================================

// ── App state ──────────────────────────────────────────────
let cards = [];
let epics = [];
let sprints = [];
let currentView = 'board';

// ── Boot ──────────────────────────────────────────────────
async function boot() {
    try {
        // Probe and initialize localStorage mode if appropriate
        [cards, epics, sprints] = await Promise.all([
            API.getCards(),
            API.getEpics(),
            API.getSprints()
        ]);
        
        // If in localStorage mode, verify if demo needs seeding
        if (window.isLocalStorageMode) {
            const isDemo = window.location.pathname.includes('demo.html');
            if (cards.length === 0 && epics.length === 0 && sprints.length === 0) {
                seed2026Data(isDemo);
                // Reload after seed
                [cards, epics, sprints] = await Promise.all([
                    API.getCards(),
                    API.getEpics(),
                    API.getSprints()
                ]);
            }
        }
        
        renderAll();
    } catch (err) {
        console.error('Boot error:', err);
        showToast('Sunucuya bağlanılamadı. Tarayıcı önbelleği yükleniyor...', 'warn');
        // Fallback load
        try {
            cards = window.getLocalData().cards;
            epics = window.getLocalData().epics;
            sprints = window.getLocalData().sprints;
            renderAll();
        } catch {
            showToast('Hafıza yükleme hatası.', 'error');
        }
    }
}

function renderAll() {
    renderBoard(cards, epics);
    if (currentView === 'list') renderListView(cards, epics);
    if (currentView === 'backlog') renderBacklogView(cards, sprints, epics);
    if (currentView === 'dashboard') renderDashboard(cards, epics, sprints);
    if (currentView === 'gantt') renderGantt(cards);
    if (currentView === 'reports') renderReports(cards, epics, sprints);
    updateSprintBadge();
}

function updateSprintBadge() {
    const active = sprints.find(s => s.active);
    const el = document.getElementById('sprintBadge');
    if (el) el.textContent = active ? `🟢 ${active.name}` : 'Sprint yok';
}

// ── View switcher ─────────────────────────────────────────
document.querySelectorAll('.view-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        currentView = btn.dataset.view;
        document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.view-container').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        
        const container = document.getElementById('view-' + currentView);
        if (container) container.classList.add('active');
        
        if (currentView === 'list') renderListView(cards, epics);
        if (currentView === 'backlog') renderBacklogView(cards, sprints, epics);
        if (currentView === 'dashboard') renderDashboard(cards, epics, sprints);
        if (currentView === 'gantt') renderGantt(cards);
        if (currentView === 'reports') renderReports(cards, epics, sprints);
    });
});

// ── Drag & Drop (Unified server/local) ─────────────────────
async function onDrop(e) {
    e.preventDefault();
    const body = e.currentTarget;
    const toCol = body.dataset.col;
    body.classList.remove('drag-over');
    removePlaceholders();
    if (!dragId) return;
    const card = cards.find(c => c.id === dragId);
    if (!card || card.col === toCol) { dragId = null; return; }
    try {
        const upd = await API.updateCard(dragId, { col: toCol });
        Object.assign(card, upd);
        renderAll();
    } catch { showToast('Taşıma başarısız', 'error'); }
    dragId = null;
}

// ── Card Detail Modal ─────────────────────────────────────
let _editSubtasks = [];
let _editComments = [];

function openCardDetail(id) {
    const isNew = !id;
    const card = isNew ? null : cards.find(c => c.id === id);
    document.getElementById('cardModalTitle').textContent = isNew ? 'Yeni Görev' : 'Görevi Düzenle';
    document.getElementById('editCardId').value = id || '';
    document.getElementById('cardTitle').value = card?.title || '';
    document.getElementById('cardDesc').value = card?.desc || '';
    document.getElementById('cardAssignee').value = card?.assignee || '';
    document.getElementById('cardPriority').value = card?.priority || 'medium';
    document.getElementById('cardColumn').value = card?.col || 'todo';
    document.getElementById('cardSP').value = card?.storyPoints ?? '';
    document.getElementById('cardEstimatedEffort').value = card?.estimatedEffort ?? '';
    document.getElementById('cardSpentEffort').value = card?.spentEffort ?? '';
    document.getElementById('cardStart').value = card?.startDate || '';
    document.getElementById('cardDue').value = card?.dueDate || '';

    // Epics dropdown
    const epicSel = document.getElementById('cardEpic');
    epicSel.innerHTML = '<option value="">— Epic seç —</option>' +
        epics.map(e => `<option value="${e.id}" ${card?.epicId === e.id ? 'selected' : ''}>${escHtml(e.name)}</option>`).join('');

    // Sprints dropdown
    const sprintSel = document.getElementById('cardSprint');
    sprintSel.innerHTML = '<option value="">— Sprint seç —</option>' +
        sprints.map(s => `<option value="${s.id}" ${card?.sprintId === s.id ? 'selected' : ''}>${escHtml(s.name)}</option>`).join('');

    // Labels
    const selectedLabels = new Set(card?.labels || []);
    document.getElementById('labelsGrid').innerHTML = LABELS.map(l =>
        `<div class="label-chip${selectedLabels.has(l.id) ? ' selected' : ''}" style="background:${l.bg};color:${l.color}" data-lid="${l.id}" onclick="toggleLabel(this)">${escHtml(l.name)}</div>`
    ).join('');

    // Subtasks & Comments
    _editSubtasks = JSON.parse(JSON.stringify(card?.subtasks || []));
    _editComments = JSON.parse(JSON.stringify(card?.comments || []));
    renderSubtasksList();
    renderCommentsList();
    document.getElementById('commentsSection').style.display = id ? 'block' : 'none';
    document.getElementById('deleteCardBtn').style.display = id ? 'inline-flex' : 'none';
    document.getElementById('newSubtask').value = '';
    document.getElementById('newComment').value = '';
    openModal('cardModal');
    document.getElementById('cardTitle').focus();
}

function toggleLabel(el) {
    el.classList.toggle('selected');
}

function renderSubtasksList() {
    document.getElementById('subtasksList').innerHTML = _editSubtasks.map((st, i) => `
        <div class="subtask-row">
            <input class="subtask-check" type="checkbox" ${st.done ? 'checked' : ''} onchange="_editSubtasks[${i}].done=this.checked;renderSubtasksList()">
            <span class="subtask-text${st.done ? ' done-text' : ''}">${escHtml(st.text)}</span>
            <button type="button" class="subtask-del" onclick="_editSubtasks.splice(${i},1);renderSubtasksList()">✕</button>
        </div>`).join('');
}

function renderCommentsList() {
    document.getElementById('commentsList').innerHTML = _editComments.map(c => `
        <div class="comment-row">
            <div class="comment-meta">${new Date(c.createdAt).toLocaleString('tr-TR')}</div>
            <div class="comment-body">${escHtml(c.text)}</div>
        </div>`).join('');
}

document.getElementById('addSubtaskBtn').addEventListener('click', () => {
    const inp = document.getElementById('newSubtask');
    const text = inp.value.trim();
    if (!text) return;
    _editSubtasks.push({ id: Date.now().toString(36), text, done: false });
    renderSubtasksList();
    inp.value = '';
});

document.getElementById('newSubtask').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('addSubtaskBtn').click(); }
});

document.getElementById('addCommentBtn').addEventListener('click', () => {
    const inp = document.getElementById('newComment');
    const text = inp.value.trim();
    if (!text) return;
    _editComments.push({ id: Date.now().toString(36), text, createdAt: Date.now() });
    renderCommentsList();
    inp.value = '';
});

document.getElementById('cardSaveBtn').addEventListener('click', async () => {
    const id = document.getElementById('editCardId').value;
    const title = document.getElementById('cardTitle').value.trim();
    if (!title) { showToast('Başlık boş olamaz', 'warn'); return; }
    const selectedLabels = [...document.querySelectorAll('#labelsGrid .label-chip.selected')].map(el => el.dataset.lid);
    
    const payload = {
        title,
        desc: document.getElementById('cardDesc').value,
        assignee: document.getElementById('cardAssignee').value,
        priority: document.getElementById('cardPriority').value,
        col: document.getElementById('cardColumn').value,
        storyPoints: document.getElementById('cardSP').value ? Number(document.getElementById('cardSP').value) : null,
        estimatedEffort: document.getElementById('cardEstimatedEffort').value ? Number(document.getElementById('cardEstimatedEffort').value) : null,
        spentEffort: document.getElementById('cardSpentEffort').value ? Number(document.getElementById('cardSpentEffort').value) : null,
        startDate: document.getElementById('cardStart').value || null,
        dueDate: document.getElementById('cardDue').value || null,
        epicId: document.getElementById('cardEpic').value || null,
        sprintId: document.getElementById('cardSprint').value || null,
        labels: selectedLabels,
        subtasks: _editSubtasks,
        comments: _editComments,
    };

    try {
        if (id) {
            const upd = await API.updateCard(id, payload);
            const idx = cards.findIndex(c => c.id === id);
            if (idx !== -1) cards[idx] = upd;
            showToast('Güncellendi ✓');
        } else {
            const card = await API.addCard(payload);
            cards.push(card);
            showToast('Eklendi ✓');
        }
        closeModal('cardModal');
        renderAll();
    } catch (e) { 
        console.error(e);
        showToast('Kaydedilemedi', 'error'); 
    }
});

document.getElementById('deleteCardBtn').addEventListener('click', async () => {
    const id = document.getElementById('editCardId').value;
    if (!id) return;
    const card = cards.find(c => c.id === id);
    if (!confirm(`"${card?.title}" silinsin mi?`)) return;
    try {
        await API.deleteCard(id);
        cards = cards.filter(c => c.id !== id);
        closeModal('cardModal');
        renderAll();
        showToast('Silindi');
    } catch { showToast('Silinemedi', 'error'); }
});

document.getElementById('cardCancelBtn').addEventListener('click', () => closeModal('cardModal'));
document.getElementById('cardModalClose').addEventListener('click', () => closeModal('cardModal'));

// Expose modal binding globally for board clicks
window.openCardDetail = openCardDetail;

// ── Quick-add ─────────────────────────────────────────────
document.querySelectorAll('.quick-add-input').forEach(input => {
    input.addEventListener('keydown', async e => {
        if (e.key !== 'Enter') return;
        const title = input.value.trim();
        const col = input.dataset.col;
        if (!title) return;
        try {
            const card = await API.addCard({ title, col });
            cards.push(card);
            input.value = '';
            renderAll();
            showToast('Eklendi ✓');
        } catch { showToast('Eklenemedi', 'error'); }
    });
});

// ── Search & Filter ───────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', () => renderAll());
document.getElementById('filterAssignee').addEventListener('change', () => renderAll());
document.getElementById('filterPriority').addEventListener('change', () => renderAll());

// ── Header buttons ────────────────────────────────────────
document.getElementById('addTaskBtn').addEventListener('click', () => openCardDetail(null));
document.getElementById('clearBtn').addEventListener('click', async () => {
    if (!cards.length) { showToast('Pano zaten boş'); return; }
    if (!confirm('Tüm görevler silinsin mi?')) return;
    try {
        await Promise.all(cards.map(c => API.deleteCard(c.id)));
        cards = [];
        renderAll();
        showToast('Temizlendi');
    } catch { showToast('Hata', 'error'); }
});

// ── Epic Manager ──────────────────────────────────────────
function renderEpicList() {
    document.getElementById('epicList').innerHTML = epics.map(e => `
        <div class="manager-item">
            <span style="width:14px;height:14px;border-radius:50%;background:${e.color};display:inline-block;flex-shrink:0"></span>
            <div class="manager-item-info">
                <div class="manager-item-name">${escHtml(e.name)}</div>
                <div class="manager-item-sub">${cards.filter(c => c.epicId === e.id).length} görev</div>
            </div>
            <div class="manager-item-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteEpic('${e.id}')">Sil</button>
            </div>
        </div>`).join('') || '<p style="color:var(--text-muted);font-size:13px">Henüz epic yok</p>';
}

const manageEpicsBtn = document.getElementById('manageEpicsBtn');
if (manageEpicsBtn) {
    manageEpicsBtn.addEventListener('click', () => {
        renderEpicList(); openModal('epicModal');
    });
}

const addEpicBtn = document.getElementById('addEpicBtn');
if (addEpicBtn) {
    addEpicBtn.addEventListener('click', async () => {
        const name = document.getElementById('newEpicName').value.trim();
        const color = document.getElementById('newEpicColor').value;
        if (!name) return;
        try {
            const epic = await API.addEpic({ name, color });
            epics.push(epic);
            document.getElementById('newEpicName').value = '';
            renderEpicList();
            renderAll();
        } catch { showToast('Epic eklenemedi', 'error'); }
    });
}

async function deleteEpic(id) {
    if (!confirm('Epic silinsin mi?')) return;
    try {
        await API.deleteEpic(id);
        epics = epics.filter(e => e.id !== id);
        // Clean epicIds locally
        cards.forEach(c => { if (c.epicId === id) c.epicId = null; });
        renderEpicList();
        renderAll();
    } catch { showToast('Epic silinemedi', 'error'); }
}
window.deleteEpic = deleteEpic;

// ── Sprint Manager ────────────────────────────────────────
function renderSprintList() {
    document.getElementById('sprintList').innerHTML = sprints.map(s => `
        <div class="manager-item">
            <div class="manager-item-info">
                <div class="manager-item-name">${escHtml(s.name)} ${s.active ? '<span class="sprint-active-badge">Aktif</span>' : ''}</div>
                <div class="manager-item-sub">${s.startDate || '?'} → ${s.endDate || '?'} &nbsp;·&nbsp; ${cards.filter(c => c.sprintId === s.id).length} görev</div>
            </div>
            <div class="manager-item-actions">
                ${!s.active ? `<button class="btn btn-sm btn-secondary" onclick="activateSprint('${s.id}')">Aktif Yap</button>` : ''}
                <button class="btn btn-sm btn-danger" onclick="deleteSprint('${s.id}')">Sil</button>
            </div>
        </div>`).join('') || '<p style="color:var(--text-muted);font-size:13px">Henüz sprint yok</p>';
}

const manageSprintsBtn = document.getElementById('manageSprintsBtn');
if (manageSprintsBtn) {
    manageSprintsBtn.addEventListener('click', () => {
        renderSprintList(); openModal('sprintModal');
    });
}

const addSprintBtn = document.getElementById('addSprintBtn');
if (addSprintBtn) {
    addSprintBtn.addEventListener('click', async () => {
        const name = document.getElementById('newSprintName').value.trim();
        const start = document.getElementById('newSprintStart').value;
        const end = document.getElementById('newSprintEnd').value;
        if (!name) return;
        try {
            const sprint = await API.addSprint({ name, startDate: start, endDate: end });
            sprints.push(sprint);
            document.getElementById('newSprintName').value = '';
            document.getElementById('newSprintStart').value = '';
            document.getElementById('newSprintEnd').value = '';
            renderSprintList();
            renderAll();
        } catch { showToast('Sprint eklenemedi', 'error'); }
    });
}

async function activateSprint(id) {
    try {
        await API.updateSprint(id, { active: true });
        sprints.forEach(s => { s.active = s.id === id; });
        renderSprintList();
        renderAll();
    } catch { showToast('Sprint aktifleştirilemedi', 'error'); }
}
window.activateSprint = activateSprint;

async function deleteSprint(id) {
    if (!confirm('Sprint silinsin mi?')) return;
    try {
        await API.deleteSprint(id);
        sprints = sprints.filter(s => s.id !== id);
        // Clean sprintIds locally
        cards.forEach(c => { if (c.sprintId === id) c.sprintId = null; });
        renderSprintList();
        renderAll();
    } catch { showToast('Sprint silinemedi', 'error'); }
}
window.deleteSprint = deleteSprint;

// ── Modal helpers ─────────────────────────────────────────
function openModal(id) {
    document.getElementById(id).classList.add('open');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
});
window.closeModal = closeModal;

// ── Keyboard shortcuts ────────────────────────────────────
document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tag)) return;
    if (e.key === 'n' || e.key === 'N') openCardDetail(null);
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
});

// ── Boot Application ──────────────────────────────────────
boot();
