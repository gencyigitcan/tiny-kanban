// ============================================================
//  app.js – Unified interactive controller for Kanban Board
// ============================================================

// ── App state ──────────────────────────────────────────────
let cards = [];
let epics = [];
let sprints = [];
let users = [];
let labels = [];
let notifications = [];
let currentUser = null;
window.currentUser = null;
let currentView = 'board';
let syncIntervalId = null;

// ── Boot ──────────────────────────────────────────────────
// ── Boot ──────────────────────────────────────────────────
async function boot() {
    const token = localStorage.getItem('tiny_kanban_token');
    
    // Switch to local storage mode only if we are on demo page or explicitly offline
    if (!token && !window.isLocalStorageMode) {
        showAuthScreen();
        return;
    }

    try {
        if (token && !window.isLocalStorageMode) {
            try {
                currentUser = await API.getMe();
                window.currentUser = currentUser;
                updateUserHeader();
            } catch (e) {
                console.error('Session verify failed, showing login screen:', e);
                showAuthScreen();
                return;
            }
        }

        // Fetch core data
        [cards, epics, sprints, users, labels, notifications] = await Promise.all([
            API.getCards(),
            API.getEpics(),
            API.getSprints(),
            API.getUsers(),
            API.getLabels(),
            API.getNotifications()
        ]);
        window.LABELS = labels;
        window.LABEL_MAP = Object.fromEntries(labels.map(l => [l.id, l]));
        
        // Setup dropdown elements with registered users list
        populateAssigneeSelects();

        // Render notifications in header
        renderNotifications();
        
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
        
        hideAuthScreen();
        renderAll();
        
        // Initialize background sync poll
        setupBackgroundSync();
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
    if (currentView === 'my-tasks') renderMyTasksView(cards, epics);
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
    document.getElementById('cardModalTitle').textContent = isNew ? 'Yeni Görev' : `${card?.key || ''}: Görevi Düzenle`;
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
    document.getElementById('labelsGrid').innerHTML = labels.map(l =>
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
    document.getElementById('commentsList').innerHTML = _editComments.map(c => {
        const authorName = c.author || 'Misafir';
        const init = initials(authorName);
        const hue = [...authorName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
        const avatarBg = `hsl(${hue}, 60%, 50%)`;
        
        return `
            <div class="comment-row">
                <div class="comment-avatar" style="background:${avatarBg}">${escHtml(init)}</div>
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="comment-author">${escHtml(authorName)}</span>
                        <span class="comment-time">${new Date(c.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                    <div class="comment-body">${escHtml(c.text)}</div>
                </div>
            </div>`;
    }).join('');
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
    _editComments.push({
        id: Date.now().toString(36),
        text,
        createdAt: Date.now(),
        author: currentUser ? currentUser.name : 'Misafir',
        authorId: currentUser ? currentUser.id : ''
    });
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
    const approved = await showConfirm(`"${card?.title}" silinsin mi?`, 'Görevi Sil');
    if (!approved) return;
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
    const approved = await showConfirm('Tüm görevler silinsin mi?', 'Panoyu Temizle');
    if (!approved) return;
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
    const approved = await showConfirm('Epic silinsin mi?', 'Epic Sil');
    if (!approved) return;
    try {
        await API.deleteEpic(id);
        epics = epics.filter(e => e.id !== id);
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
    const approved = await showConfirm('Sprint silinsin mi?', 'Sprint Sil');
    if (!approved) return;
    try {
        await API.deleteSprint(id);
        sprints = sprints.filter(s => s.id !== id);
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

// ── Authentication UI Helpers and Event Handlers ─────────
window.addEventListener('unauthorized', () => {
    showAuthScreen();
});

function showAuthScreen() {
    document.getElementById('authOverlay').classList.add('open');
    document.getElementById('headerUser').style.display = 'none';
    if (syncIntervalId) {
        clearInterval(syncIntervalId);
        syncIntervalId = null;
    }
}

function hideAuthScreen() {
    document.getElementById('authOverlay').classList.remove('open');
    if (currentUser) {
        document.getElementById('headerUser').style.display = 'flex';
    }
}

function updateUserHeader() {
    if (!currentUser) return;
    document.getElementById('userProfileName').textContent = currentUser.name;
    const badge = document.getElementById('userProfileBadge');
    if (badge) {
        badge.textContent = initials(currentUser.name);
        badge.style.backgroundColor = currentUser.avatarColor || '#4f46e5';
    }
}

function populateAssigneeSelects() {
    const select = document.getElementById('cardAssignee');
    if (select) {
        select.innerHTML = '<option value="">— Atanmamış —</option>' +
            users.map(u => `<option value="${escHtml(u.name)}">${escHtml(u.name)}</option>`).join('');
    }
    // Also update board assignee filter
    const filter = document.getElementById('filterAssignee');
    if (filter) {
        filter.innerHTML = '<option value="">Tüm kişiler</option>' +
            users.map(u => `<option value="${escHtml(u.name).toLowerCase()}">${escHtml(u.name)}</option>`).join('');
    }
}

function setupBackgroundSync() {
    if (window.isLocalStorageMode) return;
    if (syncIntervalId) return;
    
    syncIntervalId = setInterval(async () => {
        const modalOpen = document.querySelector('.modal-overlay.open');
        const isFocusInput = ['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase());
        
        if (!modalOpen && !isFocusInput && (typeof dragId === 'undefined' || !dragId)) {
            try {
                const [newCards, newEpics, newSprints, newLabels, newNotifications] = await Promise.all([
                    API.getCards(),
                    API.getEpics(),
                    API.getSprints(),
                    API.getLabels(),
                    API.getNotifications()
                ]);
                
                // Compare and notify if new unread notifications are received
                const currentUnreadIds = new Set(notifications.filter(n => !n.read).map(n => n.id));
                const newUnread = newNotifications.filter(n => !n.read && !currentUnreadIds.has(n.id));
                if (newUnread.length > 0) {
                    newUnread.forEach(n => {
                        showToast(`🔔 ${n.text}`);
                    });
                }
                
                let changed = false;
                if (JSON.stringify(newCards) !== JSON.stringify(cards) ||
                    JSON.stringify(newEpics) !== JSON.stringify(epics) ||
                    JSON.stringify(newSprints) !== JSON.stringify(sprints) ||
                    JSON.stringify(newLabels) !== JSON.stringify(labels) ||
                    JSON.stringify(newNotifications) !== JSON.stringify(notifications)) {
                    changed = true;
                }
                
                if (changed) {
                    cards = newCards;
                    epics = newEpics;
                    sprints = newSprints;
                    labels = newLabels;
                    notifications = newNotifications;
                    window.LABELS = labels;
                    window.LABEL_MAP = Object.fromEntries(labels.map(l => [l.id, l]));
                    
                    renderNotifications();
                    renderAll();
                }
            } catch (e) {
                console.debug('Background collaborative sync check skipped:', e);
            }
        }
    }, 5000);
}

// ── Auth Tab Switch ──────────────────────────────────────
document.getElementById('tabLogin').addEventListener('click', () => {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
});

document.getElementById('tabRegister').addEventListener('click', () => {
    document.getElementById('tabRegister').classList.add('active');
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
});

// ── Auth Submission Actions ──────────────────────────────
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userVal = document.getElementById('loginUser').value.trim();
    const passVal = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = '';
    
    try {
        const res = await API.login(userVal, passVal);
        currentUser = res.user;
        window.currentUser = currentUser;
        updateUserHeader();
        await boot();
        showToast(`Hoş geldiniz, ${currentUser.name}!`);
    } catch (err) {
        errorDiv.textContent = err.message || 'Kullanıcı adı veya şifre hatalı';
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('regName').value.trim();
    const userVal = document.getElementById('regUser').value.trim();
    const passVal = document.getElementById('regPassword').value;
    const errorDiv = document.getElementById('registerError');
    errorDiv.textContent = '';
    
    try {
        const res = await API.register(userVal, passVal, nameVal);
        currentUser = res.user;
        window.currentUser = currentUser;
        updateUserHeader();
        await boot();
        showToast('Kayıt başarılı! Hoş geldiniz.');
    } catch (err) {
        errorDiv.textContent = err.message || 'Kayıt sırasında bir hata oluştu';
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await API.logout();
    currentUser = null;
    window.currentUser = null;
    showAuthScreen();
    showToast('Oturum kapatıldı');
});

// ── Custom Labels Management UI ───────────────────────────
document.getElementById('manageLabelsBtn').addEventListener('click', () => {
    renderLabelsList();
    openModal('labelModal');
});

function renderLabelsList() {
    const list = document.getElementById('labelList');
    if (!list) return;
    list.innerHTML = labels.map(l => `
        <div class="manager-item" style="border-left: 4px solid ${l.color}">
            <span>${escHtml(l.name)}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteLabel('${l.id}')">✕</button>
        </div>`).join('') || '<div class="manager-empty">Etiket bulunmamaktadır.</div>';
}
window.renderLabelsList = renderLabelsList;

async function deleteLabel(id) {
    const approved = await showConfirm('Bu etiketi silmek istediğinize emin misiniz?', 'Etiketi Sil');
    if (!approved) return;
    try {
        await API.deleteLabel(id);
        labels = labels.filter(l => l.id !== id);
        window.LABELS = labels;
        window.LABEL_MAP = Object.fromEntries(labels.map(l => [l.id, l]));
        renderLabelsList();
        renderAll();
        showToast('Etiket silindi');
    } catch {
        showToast('Etiket silinemedi', 'error');
    }
}
window.deleteLabel = deleteLabel;

document.getElementById('addLabelBtn').addEventListener('click', async () => {
    const nameInp = document.getElementById('newLabelName');
    const colorInp = document.getElementById('newLabelColor');
    const name = nameInp.value.trim();
    const color = colorInp.value;
    if (!name) { showToast('Etiket adı boş bırakılamaz', 'warn'); return; }
    try {
        const l = await API.addLabel({ name, color });
        labels.push(l);
        window.LABELS = labels;
        window.LABEL_MAP = Object.fromEntries(labels.map(lbl => [lbl.id, lbl]));
        renderLabelsList();
        renderAll();
        showToast('Etiket eklendi ✓');
        nameInp.value = '';
    } catch (err) {
        showToast(err.message || 'Etiket eklenemedi', 'error');
    }
});

// ── Notifications Management UI ───────────────────────────
document.getElementById('notifBellBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.toggle('open');
});

document.addEventListener('click', () => {
    const dd = document.getElementById('notifDropdown');
    if (dd) dd.classList.remove('open');
});

document.getElementById('notifDropdown').addEventListener('click', (e) => {
    e.stopPropagation();
});

function renderNotifications() {
    const badge = document.getElementById('notifBadge');
    const list = document.getElementById('notifList');
    if (!badge || !list) return;
    
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) {
        badge.textContent = unread.length;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
    
    if (notifications.length === 0) {
        list.innerHTML = '<div class="notif-empty">Yeni bildirim yok</div>';
        return;
    }
    
    list.innerHTML = notifications.map(n => {
        let actionHtml = '';
        if (n.type === 'demo-request' && n.demoStatus === 'pending') {
            actionHtml = `
                <div class="notif-actions" style="margin-top: 8px;">
                    <button class="btn btn-primary" style="padding: 4px 10px; font-size: 11px; font-weight: 600; line-height: 1;" onclick="approveDemoRequest(event, '${n.id}')">Onayla</button>
                </div>
            `;
        }
        return `
            <div class="notif-item${n.read ? '' : ' unread'}" onclick="clickNotification(event, '${n.id}', '${n.cardId}')">
                <div class="notif-item-text">${escHtml(n.text)}</div>
                ${actionHtml}
                <div class="notif-item-time" style="margin-top: 4px;">${new Date(n.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
    }).join('');
}
window.renderNotifications = renderNotifications;

async function approveDemoRequest(event, notificationId) {
    event.stopPropagation();
    try {
        const res = await fetch('/api/auth/approve-demo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tiny_kanban_token')}`
            },
            body: JSON.stringify({ notificationId })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Onaylanamadı');
        }
        
        await showAlert(`Kullanıcı Onaylandı!\n\nGiriş Bilgileri:\nKullanıcı Adı: ${data.username}\nŞifre: ${data.password}\n\nBu hesap 30 gün geçerlidir.`, 'Talep Onaylandı');
        
        // Refresh notifications
        notifications = await API.getNotifications();
        renderNotifications();
    } catch (e) {
        showToast(e.message, 'error');
    }
}
window.approveDemoRequest = approveDemoRequest;

async function clickNotification(event, id, cardId) {
    if (event.target.tagName === 'BUTTON') return;
    document.getElementById('notifDropdown').classList.remove('open');
    try {
        await API.readNotification(id);
        const n = notifications.find(x => x.id === id);
        if (n) n.read = true;
        renderNotifications();
        
        if (cardId) {
            // Open card details modal
            const card = cards.find(c => c.id === cardId);
            if (card) {
                openCardDetail(cardId);
            } else {
                showToast('Görev bulunamadı (silinmiş olabilir)');
            }
        }
    } catch (e) {
        console.error(e);
    }
}
window.clickNotification = clickNotification;

document.getElementById('notifReadAllBtn').addEventListener('click', async () => {
    try {
        await API.readAllNotifications();
        notifications.forEach(n => n.read = true);
        renderNotifications();
        showToast('Tüm bildirimler okundu');
    } catch (e) {
        showToast('İşlem başarısız', 'error');
    }
});

// Expose click listener to view-tabs for my-tasks
document.querySelectorAll('.view-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.view === 'my-tasks') renderMyTasksView(cards, epics);
    });
});

// ── Boot Application ──────────────────────────────────────
boot();
