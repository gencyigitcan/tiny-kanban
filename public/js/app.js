// ============================================================
//  app.js – Unified interactive controller for Kanban Board
// ============================================================

// ── App state ──────────────────────────────────────────────
function safeAddListener(id, event, callback) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, callback);
}

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
async function boot() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedMode = urlParams.get('mode') || (urlParams.get('demo') === '1' ? 'demo' : null);
    let token = localStorage.getItem('tiny_kanban_token') || localStorage.getItem('kanban_token');
    
    // If no token exists:
    if (!token) {
        if (requestedMode === 'demo') {
            try {
                const res = await API.demoLogin('admin');
                token = res.token;
            } catch (e) {
                showAuthScreen();
                document.getElementById('btnModeDemo')?.click();
                return;
            }
        } else {
            showAuthScreen();
            return;
        }
    }

    try {
        try {
            currentUser = await API.getMe();
            window.currentUser = currentUser;
            updateUserHeader();
        } catch (e) {
            console.warn('Session verify failed, clearing stale token:', e);
            localStorage.removeItem('tiny_kanban_token');
            localStorage.removeItem('kanban_token');
            showAuthScreen();
            return;
        }

        // Fetch core data directly from Server DB
        let columns = [];
        [cards, epics, sprints, users, labels, notifications, columns] = await Promise.all([
            API.getCards(),
            API.getEpics(),
            API.getSprints(),
            API.getUsers(),
            API.getLabels(),
            API.getNotifications(),
            API.getColumns().catch(() => [])
        ]);
        window.cards = cards;
        window.epics = epics;
        window.sprints = sprints;
        window.users = users;
        window.labels = labels;
        window.LABELS = labels;
        window.LABEL_MAP = Object.fromEntries(labels.map(l => [l.id, l]));
        window.boardColumns = Array.isArray(columns) && columns.length > 0 ? columns : (window.DEFAULT_COLUMNS || []);
        
        // Setup dropdown elements with registered users, epics, and sprints list
        populateAssigneeSelects();
        populateSprintFilter();
        populateEpicFilter();

        // Render notifications in header
        renderNotifications();
        
        hideAuthScreen();
        renderAll();
        
        // Initialize background sync poll
        setupBackgroundSync();
    } catch (err) {
        console.error('Boot error:', err);
        if (err.message?.includes('yetkisiz') || err.message === 'Unauthorized' || err.message?.includes('Oturum')) {
            localStorage.removeItem('tiny_kanban_token');
            localStorage.removeItem('kanban_token');
            if (!isDemo) showAuthScreen();
            return;
        }
        showToast('Veriler sunucudan alınamadı: ' + (err.message || 'Bilinmeyen hata'), 'error');
    }
}

function switchView(viewName) {
    const canManage = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
    const adminViews = ['workspaces', 'epics', 'sprints', 'labels', 'team', 'audit'];
    if (adminViews.includes(viewName) && !canManage) {
        if (typeof showToast === 'function') showToast('Bu yönetim ekranına erişim yetkiniz bulunmamaktadır', 'warn');
        viewName = 'board';
    }

    currentView = viewName;
    document.querySelectorAll('.view-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.view === viewName);
    });
    document.querySelectorAll('.view-container').forEach(c => {
        c.classList.toggle('active', c.id === 'view-' + viewName);
    });

    const viewLabels = {
        'board': 'Kanban Panosu',
        'list': 'Liste',
        'backlog': 'Backlog & Planlama',
        'gantt': 'Zaman Çizelgesi & Gantt',
        'dashboard': 'Dashboard & Metrikler',
        'reports': 'Çevik Raporlar',
        'my-tasks': 'Görevlerim',
        'workspaces': 'Çalışma Alanları & Takım Yönetimi',
        'epics': 'Epics Yönetimi',
        'sprints': 'Sprint Yönetimi',
        'labels': 'Etiket Yönetimi',
        'team': 'Takım & Yetkiler',
        'audit': 'Aktivite Takibi'
    };
    const bc = document.getElementById('bcViewName');
    if (bc) bc.textContent = viewLabels[viewName] || viewName;

    // Close top navigation dropdowns on selection
    ['workspaceDropdown', 'topNavViewsDropdown', 'topNavManageDropdown', 'jiraUserDropdown'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    renderAll();
}
window.switchView = switchView;

function toggleOnlyMineFilter() {
    window._quickFilterOnlyMine = !window._quickFilterOnlyMine;
    const btn = document.getElementById('filterOnlyMineBtn');
    if (btn) btn.classList.toggle('active', window._quickFilterOnlyMine);
    renderAll();
}
window.toggleOnlyMineFilter = toggleOnlyMineFilter;

function toggleRecentFilter() {
    window._quickFilterRecent = !window._quickFilterRecent;
    const btn = document.getElementById('filterRecentBtn');
    if (btn) btn.classList.toggle('active', window._quickFilterRecent);
    renderAll();
}
window.toggleRecentFilter = toggleRecentFilter;

function renderAll() {
    renderBoard(cards, epics);
    if (currentView === 'list') renderListView(cards, epics);
    if (currentView === 'backlog') renderBacklogView(cards, sprints, epics);
    if (currentView === 'dashboard') renderDashboard(cards, epics, sprints);
    if (currentView === 'gantt') renderGantt(cards);
    if (currentView === 'reports') renderReports(cards, epics, sprints);
    if (currentView === 'my-tasks') renderMyTasksView(cards, epics);
    if (currentView === 'workspaces') renderWorkspacesView();
    if (currentView === 'epics') renderEpicsView(cards, epics);
    if (currentView === 'sprints') renderSprintsView(cards, sprints);
    if (currentView === 'labels') renderLabelsView(cards, labels);
    if (currentView === 'team') renderTeamView(window.users || [], cards);
    if (currentView === 'audit') renderAuditView();
    updateSprintBadge();
    if (typeof renderQuickFilterBar === 'function') renderQuickFilterBar(cards, epics);
}

function updateSprintBadge() {
    const active = sprints.find(s => s.active);
    const el = document.getElementById('sprintBadge');
    if (el) {
        if (active) {
            const dateStr = active.startDate && active.endDate ? ` · ${active.startDate} → ${active.endDate}` : '';
            el.textContent = `🟢 ${active.name}${dateStr}`;
        } else {
            el.textContent = 'Sprint yok';
        }
    }
}

// ── View switcher ─────────────────────────────────────────
document.querySelectorAll('.view-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        switchView(btn.dataset.view);
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
    const targetId = dragId;
    dragId = null;

    if (!card || card.col === toCol) return;

    const oldCol = card.col;
    // Optimistic UI update: instantly move card in UI
    card.col = toCol;
    renderAll();

    try {
        const upd = await API.updateCard(targetId, { col: toCol });
        Object.assign(card, upd);
    } catch (err) {
        // Rollback on server error
        card.col = oldCol;
        renderAll();
        showToast('Taşıma başarısız', 'error');
    }
}

// ── Card Detail Modal ─────────────────────────────────────
let _editSubtasks = [];
let _editComments = [];
let _editActivity = [];

function openCardDetail(id, defaultCol) {
    const isNew = !id;
    const card = isNew ? null : cards.find(c => c.id === id);
    document.getElementById('cardModalTitle').textContent = isNew ? '➕ Yeni Ticket / Görev Oluştur' : `${card?.key || ''}: Görevi Düzenle`;
    document.getElementById('editCardId').value = id || '';
    document.getElementById('cardTitle').value = card?.title || '';
    document.getElementById('cardDesc').value = card?.desc || '';
    document.getElementById('cardAssignee').value = card?.assignee || '';
    document.getElementById('cardPriority').value = card?.priority || 'medium';

    // Populate dynamic columns dropdown
    const colSel = document.getElementById('cardColumn');
    const cols = (window.boardColumns && window.boardColumns.length > 0) ? window.boardColumns : (window.DEFAULT_COLUMNS || []);
    const targetCol = card?.col || defaultCol || (cols[0]?.id || 'todo');
    if (colSel) {
        colSel.innerHTML = cols.map(c => `<option value="${c.id}" ${targetCol === c.id ? 'selected' : ''}>${escHtml(c.name)}${c.isDone ? ' (Tamamlandı)' : ''}</option>`).join('');
    }

    document.getElementById('cardSP').value = card?.storyPoints ?? '';
    document.getElementById('cardEstimatedEffort').value = card?.estimatedEffort ?? '';
    document.getElementById('cardSpentEffort').value = card?.spentEffort ?? '';
    document.getElementById('cardStart').value = card?.startDate || '';
    document.getElementById('cardDue').value = card?.dueDate || '';

    // Epics dropdown
    const epicSel = document.getElementById('cardEpic');
    epicSel.innerHTML = '<option value="">— Epic seç —</option>' +
        epics.map(e => `<option value="${e.id}" ${card?.epicId === e.id ? 'selected' : ''}>${escHtml(e.name)}</option>`).join('');

    // Sprints dropdown with active sprint pre-selected
    const activeSprint = (window.sprints || sprints || []).find(s => s.active);
    const currentFilterSprint = document.getElementById('filterSprint')?.value;
    let defaultSprintId = '';
    if (card?.sprintId) {
        defaultSprintId = card.sprintId;
    } else if (isNew) {
        if (currentFilterSprint && currentFilterSprint !== 'all' && currentFilterSprint !== 'active') {
            defaultSprintId = currentFilterSprint;
        } else if (activeSprint) {
            defaultSprintId = activeSprint.id;
        }
    }

    const sprintSel = document.getElementById('cardSprint');
    sprintSel.innerHTML = '<option value="">📁 Sprint\'siz (Backlog)</option>' +
        sprints.map(s => {
            const isSel = (card ? card.sprintId === s.id : s.id === defaultSprintId);
            const activeMark = s.active ? '🟢 ' : '';
            const activeText = s.active ? ' (Aktif Sprint)' : '';
            const dateText = s.startDate && s.endDate ? ` · ${s.startDate} → ${s.endDate}` : '';
            return `<option value="${s.id}" ${isSel ? 'selected' : ''}>${activeMark}${escHtml(s.name)}${activeText}${dateText}</option>`;
        }).join('');

    // Dependencies (Blocked By other cards)
    const depContainer = document.getElementById('cardBlockedByContainer');
    if (depContainer) {
        const otherCards = (cards || []).filter(c => c.id !== id);
        if (otherCards.length === 0) {
            depContainer.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:4px;">Bağımlılık seçilebilecek başka kart bulunmuyor.</div>';
        } else {
            const blockedBySet = new Set(card?.blockedBy || []);
            depContainer.innerHTML = otherCards.map(oc => {
                const checked = blockedBySet.has(oc.id) ? 'checked' : '';
                const done = typeof isCardDone === 'function' ? isCardDone(oc) : oc.col === 'done';
                const statusTag = done ? '✅' : '⏳';
                return `
                    <label style="display:flex;align-items:center;gap:8px;font-size:12px;padding:4px 0;cursor:pointer;border-bottom:1px solid rgba(0,0,0,0.03);">
                        <input type="checkbox" name="cardBlockedBy" value="${oc.id}" ${checked}>
                        <span style="font-weight:600;color:var(--accent);">${escHtml(oc.key || '')}</span>
                        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(oc.title)}</span>
                        <span style="font-size:11px;color:var(--text-muted);">${statusTag}</span>
                    </label>
                `;
            }).join('');
        }
    }

    // Labels
    const selectedLabels = new Set(card?.labels || []);
    document.getElementById('labelsGrid').innerHTML = labels.map(l =>
        `<div class="label-chip${selectedLabels.has(l.id) ? ' selected' : ''}" style="background:${l.bg};color:${l.color}" data-lid="${l.id}" onclick="toggleLabel(this)">${escHtml(l.name)}</div>`
    ).join('');

    // Subtasks, Comments & Activity
    _editSubtasks = JSON.parse(JSON.stringify(card?.subtasks || []));
    _editComments = JSON.parse(JSON.stringify(card?.comments || []));
    _editActivity = JSON.parse(JSON.stringify(card?.activity || []));
    renderSubtasksList();
    renderCommentsList();
    renderCardActivityList(_editActivity);

    const commentsSec = document.getElementById('commentsSection');
    if (commentsSec) commentsSec.style.display = id ? 'block' : 'none';

    const cardCommentsCount = document.getElementById('cardCommentsCount');
    if (cardCommentsCount) cardCommentsCount.textContent = _editComments.length;

    const cardActivityCount = document.getElementById('cardActivityCount');
    if (cardActivityCount) cardActivityCount.textContent = _editActivity.length;

    switchCardSubTab('comments');

    document.getElementById('deleteCardBtn').style.display = id ? 'inline-flex' : 'none';
    document.getElementById('newSubtask').value = '';
    document.getElementById('newComment').value = '';
    openModal('cardModal');
    document.getElementById('cardTitle').focus();

    // Trigger card inspection log and update activity timeline asynchronously
    if (id) {
        API.recordCardView(id).then(() => {
            return API.getCardActivity(id);
        }).then(res => {
            if (res && res.activity) {
                _editActivity = res.activity;
                if (card) card.activity = res.activity;
                const actCount = document.getElementById('cardActivityCount');
                if (actCount) actCount.textContent = res.activity.length;
                renderCardActivityList(res.activity);
            }
        }).catch(() => {});
    }
}
window.openCardDetail = openCardDetail;

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
    const list = document.getElementById('commentsList');
    if (!list) return;
    if (_editComments.length === 0) {
        list.innerHTML = `<div style="padding: 14px 10px; text-align: center; color: var(--text-muted); font-size: 12px;">Henüz yorum yapılmadı. İlk yorumu aşağıdan ekleyebilirsiniz.</div>`;
        return;
    }
    list.innerHTML = _editComments.map(c => {
        const authorName = c.author || 'Misafir';
        const init = initials(authorName);
        const hue = [...authorName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
        const avatarBg = `hsl(${hue}, 60%, 50%)`;
        
        const rawEscaped = escHtml(c.text);
        const withMentions = rawEscaped.replace(/@([a-zA-Z0-9_.@+-]+)/g, '<span class="mention-tag">@$1</span>');

        return `
            <div class="comment-row">
                <div class="comment-avatar" style="background:${avatarBg}">${escHtml(init)}</div>
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="comment-author">${escHtml(authorName)}</span>
                        <span class="comment-time">${new Date(c.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                    <div class="comment-body">${withMentions}</div>
                </div>
            </div>`;
    }).join('');
}

function switchCardSubTab(tab) {
    const commentsBtn = document.getElementById('tabCardCommentsBtn');
    const activityBtn = document.getElementById('tabCardActivityBtn');
    const commentsContent = document.getElementById('cardSubTabComments');
    const activityContent = document.getElementById('cardSubTabActivity');
    const refreshBtn = document.getElementById('btnRefreshCardActivity');

    if (tab === 'activity') {
        if (commentsBtn) commentsBtn.classList.remove('active');
        if (activityBtn) activityBtn.classList.add('active');
        if (commentsContent) commentsContent.style.display = 'none';
        if (activityContent) activityContent.style.display = 'block';
        if (refreshBtn) refreshBtn.style.display = 'inline-flex';
        refreshCardActivity();
    } else {
        if (commentsBtn) commentsBtn.classList.add('active');
        if (activityBtn) activityBtn.classList.remove('active');
        if (commentsContent) commentsContent.style.display = 'block';
        if (activityContent) activityContent.style.display = 'none';
        if (refreshBtn) refreshBtn.style.display = 'none';
    }
}
window.switchCardSubTab = switchCardSubTab;

async function refreshCardActivity() {
    const id = document.getElementById('editCardId')?.value;
    if (!id) return;
    try {
        const res = await API.getCardActivity(id);
        if (res && res.activity) {
            _editActivity = res.activity;
            const card = cards.find(c => c.id === id);
            if (card) card.activity = res.activity;
            const actCount = document.getElementById('cardActivityCount');
            if (actCount) actCount.textContent = res.activity.length;
            renderCardActivityList(res.activity);
        }
    } catch (e) {
        console.warn('Could not refresh card activity:', e);
    }
}
window.refreshCardActivity = refreshCardActivity;

function renderCardActivityList(activities) {
    const container = document.getElementById('cardActivityList');
    if (!container) return;

    if (!activities || activities.length === 0) {
        container.innerHTML = `
            <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 12px; background: var(--bg-secondary); border-radius: 8px; border: 1px dashed var(--border);">
                🔍 Bu görev üzerinde henüz aktivite kaydedilmedi.
            </div>`;
        return;
    }

    const actionMeta = {
        'CARD_VIEW': { label: 'İnceledi (Okudu)', icon: '👁️', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)' },
        'CARD_COMMENT': { label: 'Yorum Yaptı', icon: '💬', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
        'CARD_MOVE': { label: 'Durum Değiştirdi', icon: '🔄', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
        'CARD_UPDATE': { label: 'Güncelledi', icon: '✏️', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
        'CARD_EFFORT': { label: 'Efor Girdi', icon: '⏱️', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
        'CARD_CREATE': { label: 'Oluşturdu', icon: '➕', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
        'SUBTASK_TOGGLE': { label: 'Alt Görev', icon: '☑️', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)' },
        'SUBTASK_ADD': { label: 'Alt Görev Eklendi', icon: '📝', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' }
    };

    const sorted = [...activities].sort((a, b) => b.createdAt - a.createdAt);

    container.innerHTML = sorted.map(act => {
        const meta = actionMeta[act.action] || { label: act.action, icon: '📌', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' };
        const authorName = act.name || act.username || 'Kullanıcı';
        const init = initials(authorName);
        const hue = [...authorName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
        const avatarBg = `hsl(${hue}, 60%, 45%)`;
        const timeStr = new Date(act.createdAt).toLocaleString('tr-TR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return `
            <div class="card-activity-item">
                <div class="card-activity-dot" style="background: ${meta.color};"></div>
                <div class="card-activity-avatar" style="background: ${avatarBg};">
                    ${escHtml(init)}
                </div>
                <div class="card-activity-body">
                    <div class="card-activity-header">
                        <span class="card-activity-user">
                            ${escHtml(authorName)}
                            <span style="font-weight: normal; font-size: 11px; color: var(--text-muted);">(@${escHtml(act.username)})</span>
                        </span>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="card-activity-badge" style="color: ${meta.color}; background: ${meta.bg}; border: 1px solid ${meta.color}40;">
                                ${meta.icon} ${meta.label}
                            </span>
                            <span class="card-activity-time">${timeStr}</span>
                        </div>
                    </div>
                    <div class="card-activity-details">${escHtml(act.details)}</div>
                </div>
            </div>`;
    }).join('');
}

safeAddListener('addSubtaskBtn', 'click', () => {
    const inp = document.getElementById('newSubtask');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;
    _editSubtasks.push({ id: Date.now().toString(36), text, done: false });
    renderSubtasksList();
    inp.value = '';
});

safeAddListener('newSubtask', 'keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); const btn = document.getElementById('addSubtaskBtn'); if (btn) btn.click(); }
});

safeAddListener('addCommentBtn', 'click', async () => {
    const inp = document.getElementById('newComment');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;
    const id = document.getElementById('editCardId')?.value;

    const newCmt = {
        id: Date.now().toString(36),
        text,
        createdAt: Date.now(),
        author: currentUser ? currentUser.name : 'Misafir',
        authorId: currentUser ? currentUser.id : ''
    };
    _editComments.push(newCmt);
    renderCommentsList();
    const cmtCount = document.getElementById('cardCommentsCount');
    if (cmtCount) cmtCount.textContent = _editComments.length;
    inp.value = '';

    if (id) {
        try {
            await API.addCardComment(id, text);
            // Refresh activity timeline and badge
            const res = await API.getCardActivity(id);
            if (res && res.activity) {
                _editActivity = res.activity;
                const card = cards.find(c => c.id === id);
                if (card) card.activity = res.activity;
                const actCount = document.getElementById('cardActivityCount');
                if (actCount) actCount.textContent = res.activity.length;
                renderCardActivityList(res.activity);
            }
        } catch (e) {
            console.warn('Failed to post comment to server:', e);
        }
    }
});

safeAddListener('newComment', 'keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const btn = document.getElementById('addCommentBtn');
        if (btn) btn.click();
    }
});

safeAddListener('cardSaveBtn', 'click', async () => {
    const id = document.getElementById('editCardId').value;
    const title = document.getElementById('cardTitle').value.trim();
    if (!title) { showToast('Başlık boş olamaz', 'warn'); return; }
    const selectedLabels = [...document.querySelectorAll('#labelsGrid .label-chip.selected')].map(el => el.dataset.lid);
    const blockedBy = Array.from(document.querySelectorAll('#cardBlockedByContainer input[name="cardBlockedBy"]:checked')).map(cb => cb.value);
    
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
        blockedBy,
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

safeAddListener('deleteCardBtn', 'click', async () => {
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

safeAddListener('cardCancelBtn', 'click', () => closeModal('cardModal'));
safeAddListener('cardModalClose', 'click', () => closeModal('cardModal'));

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
            const activeSprint = (window.sprints || sprints || []).find(s => s.active);
            const currentFilterSprint = document.getElementById('filterSprint')?.value;
            let sprintId = null;
            if (currentFilterSprint && currentFilterSprint !== 'all' && currentFilterSprint !== 'active') {
                sprintId = currentFilterSprint;
            } else if (activeSprint) {
                sprintId = activeSprint.id;
            }
            const card = await API.addCard({ title, col, sprintId });
            cards.push(card);
            input.value = '';
            renderAll();
            showToast('Ticket başarıyla eklendi ✓');
        } catch { showToast('Eklenemedi', 'error'); }
    });
});

// ── Search & Filter ───────────────────────────────────────
safeAddListener('searchInput', 'input', () => renderAll());
safeAddListener('filterSprint', 'change', () => renderAll());
safeAddListener('filterEpic', 'change', () => renderAll());
safeAddListener('filterAssignee', 'change', () => renderAll());
safeAddListener('filterPriority', 'change', () => renderAll());

// ── Header buttons ────────────────────────────────────────
safeAddListener('addTaskBtn', 'click', () => openCardDetail(null));
safeAddListener('clearBtn', 'click', async () => {
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
    manageEpicsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('epics');
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
    manageSprintsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('sprints');
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
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
}
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
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
    const isDemo = window.IS_DEMO_PAGE === true || window.location.pathname.includes('demo');
    if (!isDemo) showAuthScreen();
});

function showAuthScreen() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.classList.add('open');
    const headerUser = document.getElementById('headerUser');
    if (headerUser) headerUser.style.display = 'none';
    if (syncIntervalId) {
        clearInterval(syncIntervalId);
        syncIntervalId = null;
    }
    initDemoPersonas();
}

function hideAuthScreen() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.classList.remove('open');
    const headerUser = document.getElementById('headerUser');
    if (headerUser && currentUser) {
        headerUser.style.display = 'flex';
    }
}

function updateUserHeader() {
    if (!currentUser) return;
    const nameEl = document.getElementById('userProfileName');
    if (nameEl) {
        const roleBadge = currentUser.role === 'superadmin' ? ' 👑 (Süper Admin)' : (currentUser.role === 'admin' ? ' 🛡️ (Admin)' : '');
        nameEl.textContent = currentUser.name + roleBadge;
    }
    const roleEl = document.getElementById('userProfileRole');
    if (roleEl) {
        roleEl.textContent = currentUser.role === 'superadmin' ? '👑 Süper Admin' : (currentUser.role === 'admin' ? '🛡️ Admin' : '👤 Takım Üyesi');
    }
    const badge = document.getElementById('userProfileBadge');
    if (badge) {
        badge.textContent = initials(currentUser.name);
        badge.style.backgroundColor = currentUser.avatarColor || '#0052cc';
    }

    const canManage = currentUser.role === 'superadmin' || currentUser.role === 'admin';

    // ── RBAC: Top Navigation "Yönetim" Menu ────────────────────
    const wrapManageMenu = document.getElementById('wrapManageMenu');
    if (wrapManageMenu) {
        wrapManageMenu.style.display = canManage ? 'block' : 'none';
    }

    const manageWorkspacesBtn = document.getElementById('manageWorkspacesBtn');
    if (manageWorkspacesBtn) manageWorkspacesBtn.style.display = canManage ? 'inline-flex' : 'none';

    const manageUsersBtn = document.getElementById('manageUsersBtn');
    if (manageUsersBtn) manageUsersBtn.style.display = canManage ? 'inline-flex' : 'none';

    const tabNavAudit = document.getElementById('tabNavAudit');
    if (tabNavAudit) tabNavAudit.style.display = canManage ? 'inline-block' : 'none';

    // ── RBAC: Sidebar "PROJE AYARLARI" Section ─────────────────
    const sidebarProjectSettingsTitle = document.getElementById('sidebarProjectSettingsTitle');
    if (sidebarProjectSettingsTitle) {
        sidebarProjectSettingsTitle.style.display = canManage ? 'block' : 'none';
    }

    const sidebarWorkspacesBtn = document.getElementById('sidebarWorkspacesBtn');
    if (sidebarWorkspacesBtn) sidebarWorkspacesBtn.style.display = canManage ? 'inline-flex' : 'none';

    const sidebarEpicsBtn = document.getElementById('sidebarEpicsBtn');
    if (sidebarEpicsBtn) sidebarEpicsBtn.style.display = canManage ? 'inline-flex' : 'none';

    const sidebarSprintsBtn = document.getElementById('sidebarSprintsBtn');
    if (sidebarSprintsBtn) sidebarSprintsBtn.style.display = canManage ? 'inline-flex' : 'none';

    const sidebarLabelsBtn = document.getElementById('sidebarLabelsBtn');
    if (sidebarLabelsBtn) sidebarLabelsBtn.style.display = canManage ? 'inline-flex' : 'none';

    const sidebarTeamBtn = document.getElementById('sidebarTeamBtn');
    if (sidebarTeamBtn) sidebarTeamBtn.style.display = canManage ? 'inline-flex' : 'none';

    const sidebarAuditBtn = document.getElementById('sidebarAuditBtn');
    if (sidebarAuditBtn) sidebarAuditBtn.style.display = canManage ? 'inline-flex' : 'none';

    // ── RBAC: Workspace Switcher Prompt ───────────────────────
    const createWorkspacePromptBtn = document.getElementById('createWorkspacePromptBtn');
    if (createWorkspacePromptBtn) {
        createWorkspacePromptBtn.style.display = canManage ? 'block' : 'none';
    }

    const isDemo = currentUser.tenantId === 'demo';
    const demoBadgePill = document.getElementById('demoBadgePill');
    if (demoBadgePill) demoBadgePill.style.display = isDemo ? 'inline-block' : 'none';

    const demoPersonaSection = document.getElementById('demoPersonaSwitchSection');
    if (demoPersonaSection) demoPersonaSection.style.display = isDemo ? 'block' : 'none';

    renderWorkspaceSwitcher();
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
        const cur = (filter.value || '').trim().toLowerCase();
        const allCards = cards || window.cards || [];
        const allUsers = users && users.length ? users.map(u => u.name) : [...new Set(allCards.map(c => c.assignee).filter(Boolean))].sort();
        
        let html = '<option value="">👤 Tüm Kişiler</option>';
        allUsers.forEach(name => {
            const count = allCards.filter(c => (c.assignee || '').trim().toLowerCase() === name.trim().toLowerCase()).length;
            const val = name.trim().toLowerCase();
            const isSelected = cur === val;
            html += `<option value="${escHtml(val)}" ${isSelected ? 'selected' : ''}>👤 ${escHtml(name)} (${count})</option>`;
        });
        const unassignedCount = allCards.filter(c => !c.assignee).length;
        if (unassignedCount > 0) {
            html += `<option value="__unassigned__" ${cur === '__unassigned__' ? 'selected' : ''}>👤 Atanmamış Görevler (${unassignedCount})</option>`;
        }
        filter.innerHTML = html;
    }
}
window.populateAssigneeSelects = populateAssigneeSelects;

function populateEpicFilter() {
    const sel = document.getElementById('filterEpic');
    if (!sel) return;
    const currentVal = sel.value || '';
    const allEpics = epics || window.epics || [];
    const allCards = cards || window.cards || [];
    
    let html = '<option value="">📁 Tüm Projeler / Epics</option>';
    allEpics.forEach(e => {
        const count = allCards.filter(c => c.epicId === e.id).length;
        const isSelected = currentVal === e.id;
        html += `<option value="${e.id}" ${isSelected ? 'selected' : ''}>🏷️ ${escHtml(e.name)} (${count} görev)</option>`;
    });
    const unassignedCount = allCards.filter(c => !c.epicId).length;
    if (unassignedCount > 0) {
        html += `<option value="__none__" ${currentVal === '__none__' ? 'selected' : ''}>📁 Projesiz / Epicsiz (${unassignedCount})</option>`;
    }
    sel.innerHTML = html;
}
window.populateEpicFilter = populateEpicFilter;

function clearAllFilters() {
    window._quickFilterOnlyMine = false;
    window._quickFilterRecent = false;
    const mineBtn = document.getElementById('filterOnlyMineBtn');
    if (mineBtn) mineBtn.classList.remove('active');
    const recBtn = document.getElementById('filterRecentBtn');
    if (recBtn) recBtn.classList.remove('active');

    const fa = document.getElementById('filterAssignee');
    if (fa) fa.value = '';
    const fe = document.getElementById('filterEpic');
    if (fe) fe.value = '';
    const fp = document.getElementById('filterPriority');
    if (fp) fp.value = '';
    const sq = document.getElementById('searchInput');
    if (sq) sq.value = '';
    renderAll();
}
window.clearAllFilters = clearAllFilters;

function setPersonFilter(name) {
    const sel = document.getElementById('filterAssignee');
    if (!sel) return;
    const current = (sel.value || '').trim().toLowerCase();
    const target = (name || '').trim().toLowerCase();
    sel.value = (current === target) ? '' : target;
    renderAll();
}
window.setPersonFilter = setPersonFilter;

function setProjectFilter(epicId) {
    const sel = document.getElementById('filterEpic');
    if (!sel) return;
    const current = sel.value || '';
    const target = epicId || '';
    sel.value = (current === target) ? '' : target;
    renderAll();
}
window.setProjectFilter = setProjectFilter;

function populateSprintFilter() {
    const sel = document.getElementById('filterSprint');
    if (!sel) return;
    const currentVal = sel.value || 'active';
    const active = sprints.find(s => s.active);
    
    let html = `<option value="active" ${currentVal === 'active' ? 'selected' : ''}>⚡ Aktif Sprint ${active ? `(${active.name})` : ''}</option>`;
    html += `<option value="all" ${currentVal === 'all' ? 'selected' : ''}>🌐 Tüm Sprintler (52 Hafta)</option>`;
    
    sprints.forEach(s => {
        const isSelected = currentVal === s.id;
        const dates = s.startDate && s.endDate ? ` (${s.startDate} ~ ${s.endDate})` : '';
        html += `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${escHtml(s.name)}${dates}${s.active ? ' ⚡' : ''}</option>`;
    });
    sel.innerHTML = html;
}

function setupBackgroundSync() {
    if (syncIntervalId) return;
    
    syncIntervalId = setInterval(async () => {
        const modalOpen = document.querySelector('.modal-overlay.open');
        const isFocusInput = ['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase());
        
        if (!modalOpen && !isFocusInput && (typeof dragId === 'undefined' || !dragId)) {
            try {
                const [newCards, newEpics, newSprints, newLabels, newNotifications, newColumns] = await Promise.all([
                    API.getCards(),
                    API.getEpics(),
                    API.getSprints(),
                    API.getLabels(),
                    API.getNotifications(),
                    API.getColumns().catch(() => window.boardColumns || [])
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
                    JSON.stringify(newNotifications) !== JSON.stringify(notifications) ||
                    JSON.stringify(newColumns) !== JSON.stringify(window.boardColumns)) {
                    changed = true;
                }
                
                if (changed) {
                    cards = newCards;
                    epics = newEpics;
                    sprints = newSprints;
                    window.sprints = sprints;
                    labels = newLabels;
                    notifications = newNotifications;
                    window.LABELS = labels;
                    window.LABEL_MAP = Object.fromEntries(labels.map(l => [l.id, l]));
                    window.boardColumns = Array.isArray(newColumns) && newColumns.length > 0 ? newColumns : window.boardColumns;
                    
                    populateSprintFilter();
                    renderNotifications();
                    renderAll();
                }
            } catch (e) {
                console.debug('Background collaborative sync check skipped:', e);
            }
        }
    }, 5000);
}

// ── Multi-Environment Mode Selector (Live vs Demo) ───────
safeAddListener('btnModeLive', 'click', () => {
    const btnLive = document.getElementById('btnModeLive');
    const btnDemo = document.getElementById('btnModeDemo');
    const liveSec = document.getElementById('authLiveSection');
    const demoSec = document.getElementById('authDemoSection');
    if (btnLive) btnLive.classList.add('active');
    if (btnDemo) btnDemo.classList.remove('active');
    if (liveSec) liveSec.style.display = 'block';
    if (demoSec) demoSec.style.display = 'none';
});

safeAddListener('btnModeDemo', 'click', () => {
    const btnLive = document.getElementById('btnModeLive');
    const btnDemo = document.getElementById('btnModeDemo');
    const liveSec = document.getElementById('authLiveSection');
    const demoSec = document.getElementById('authDemoSection');
    if (btnDemo) btnDemo.classList.add('active');
    if (btnLive) btnLive.classList.remove('active');
    if (liveSec) liveSec.style.display = 'none';
    if (demoSec) demoSec.style.display = 'block';
    updateDemoPersonaPreview();
});

function updateDemoPersonaPreview() {
    const sel = document.getElementById('demoUserSelect');
    if (!sel) return;
    const opt = sel.options[sel.selectedIndex];
    if (!opt) return;

    const name = opt.getAttribute('data-name') || opt.textContent.split('(')[0].replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, '').trim();
    const color = opt.getAttribute('data-color') || '#4f46e5';
    const title = opt.getAttribute('data-title') || 'Nova Ekip Üyesi';
    const username = opt.value;

    const previewAvatar = document.getElementById('demoPreviewAvatar');
    if (previewAvatar) {
        previewAvatar.textContent = initials(name);
        previewAvatar.style.backgroundColor = color;
    }
    const previewName = document.getElementById('demoPreviewName');
    if (previewName) previewName.textContent = name;
    const previewUser = document.getElementById('demoPreviewUsername');
    if (previewUser) previewUser.textContent = '@' + username;
    const previewTitle = document.getElementById('demoPreviewTitle');
    if (previewTitle) previewTitle.textContent = title;

    const btnText = document.getElementById('btnSubmitDemoLoginText');
    if (btnText) {
        btnText.textContent = `🚀 ${name} Olarak Demo Panoya Giriş Yap ➔`;
    }
}

function selectDemoUser(username) {
    const sel = document.getElementById('demoUserSelect');
    if (sel) {
        sel.value = username;
        updateDemoPersonaPreview();
    }
}
window.selectDemoUser = selectDemoUser;

window.quickSwitchDemoPersona = async function(username) {
    try {
        closeAllJiraDropdowns();
        showToast('Demo rolü değiştiriliyor…', 'info');
        const res = await API.demoLogin(username);
        currentUser = res.user;
        window.currentUser = currentUser;
        updateUserHeader();
        await boot();
        showToast(`Rol değiştirildi: ${currentUser.name}`);
    } catch (err) {
        showToast(err.message || 'Rol değiştirilemedi', 'error');
    }
};

async function initDemoPersonas() {
    try {
        const res = await API.getDemoUsers().catch(() => null);
        if (res && res.users && res.users.length > 0) {
            const sel = document.getElementById('demoUserSelect');
            if (sel) {
                const currentVal = sel.value || 'admin';
                sel.innerHTML = res.users.map(u => {
                    const icon = u.role === 'admin' ? '👑' : (u.username === 'zeynep' ? '🎨' : (u.username === 'mehmet' ? '💻' : (u.username === 'selin' ? '📱' : (u.username === 'caner' ? '⚙️' : (u.username === 'burcu' ? '🧪' : '👤')))));
                    return `<option value="${escHtml(u.username)}" data-name="${escHtml(u.name)}" data-color="${escHtml(u.avatarColor || '#4f46e5')}" data-title="${escHtml(u.title || 'Ekip Üyesi')}" ${u.username === currentVal ? 'selected' : ''}>${icon} ${escHtml(u.name)} (${escHtml(u.username)}) — ${escHtml(u.title || 'Ekip Üyesi')}</option>`;
                }).join('');
            }
        }
    } catch (e) {
        console.debug('Demo personas load skipped:', e);
    }
    updateDemoPersonaPreview();
}

safeAddListener('demoUserSelect', 'change', updateDemoPersonaPreview);

// ── Demo Login Submission Action ──────────────────────────
safeAddListener('btnSubmitDemoLogin', 'click', async () => {
    const sel = document.getElementById('demoUserSelect');
    const username = sel ? sel.value : 'admin';
    const errorDiv = document.getElementById('demoLoginError');
    if (errorDiv) { errorDiv.textContent = ''; errorDiv.style.display = 'none'; }

    try {
        const res = await API.demoLogin(username);
        currentUser = res.user;
        window.currentUser = currentUser;
        updateUserHeader();
        await boot();
        showToast(`🚀 Nova Demo Panosuna ${currentUser.name} olarak giriş yapıldı!`);
    } catch (err) {
        if (errorDiv) {
            errorDiv.textContent = err.message || 'Demo girişi yapılamadı';
            errorDiv.style.display = 'block';
        }
    }
});

// ── Auth Tab Switch ──────────────────────────────────────
safeAddListener('tabLogin', 'click', () => {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (tabLogin) tabLogin.classList.add('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (loginForm) loginForm.classList.add('active');
    if (registerForm) registerForm.classList.remove('active');
});

safeAddListener('tabRegister', 'click', () => {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (tabRegister) tabRegister.classList.add('active');
    if (tabLogin) tabLogin.classList.remove('active');
    if (registerForm) registerForm.classList.add('active');
    if (loginForm) loginForm.classList.remove('active');
});

// ── Auth Submission Actions ──────────────────────────────
safeAddListener('loginForm', 'submit', async (e) => {
    e.preventDefault();
    const userVal = document.getElementById('loginUser').value.trim();
    const passVal = document.getElementById('loginPassword').value;
    const compVal = document.getElementById('loginCompany') ? document.getElementById('loginCompany').value.trim() : '';
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) errorDiv.textContent = '';
    
    try {
        const res = await API.login(userVal, passVal, compVal);
        currentUser = res.user;
        window.currentUser = currentUser;
        updateUserHeader();
        await boot();
        showToast(`Hoş geldiniz, ${currentUser.name}!`);
    } catch (err) {
        if (errorDiv) errorDiv.textContent = err.message || 'Kullanıcı adı veya şifre hatalı';
    }
});

safeAddListener('registerForm', 'submit', async (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('regName').value.trim();
    const userVal = document.getElementById('regUser').value.trim();
    const passVal = document.getElementById('regPassword').value;
    const compVal = document.getElementById('regCompany') ? document.getElementById('regCompany').value.trim() : '';
    const errorDiv = document.getElementById('registerError');
    const successBox = document.getElementById('regSuccessBox');
    if (errorDiv) { errorDiv.textContent = ''; errorDiv.style.display = 'none'; }
    if (successBox) { successBox.textContent = ''; successBox.style.display = 'none'; }
    
    try {
        const res = await API.register(userVal, passVal, nameVal, compVal);
        if (res.pending) {
            if (successBox) {
                successBox.innerHTML = `
                    <div style="font-weight: 700; margin-bottom: 4px;">🎉 Kayıt Talebiniz Alındı!</div>
                    <div>${escHtml(res.message || 'Kayıt talebiniz Super Admin onayına iletildi. Onaylandıktan sonra giriş yapabilirsiniz.')}</div>
                `;
                successBox.style.display = 'block';
            }
            document.getElementById('registerForm').reset();
            showToast('Kayıt talebiniz Super Admin onayına iletildi', 'info');
            return;
        }

        currentUser = res.user;
        window.currentUser = currentUser;
        updateUserHeader();
        await boot();
        showToast('Kayıt başarılı! Hoş geldiniz.');
    } catch (err) {
        if (errorDiv) {
            errorDiv.textContent = err.message || 'Kayıt sırasında bir hata oluştu';
            errorDiv.style.display = 'block';
        }
    }
});

safeAddListener('logoutBtn', 'click', async () => {
    await API.logout();
    currentUser = null;
    window.currentUser = null;
    showAuthScreen();
    showToast('Oturum kapatıldı');
});

// ── Workspace Switcher Controller ─────────────────────────
async function renderWorkspaceSwitcher() {
    const wsBtn = document.getElementById('workspaceSwitcherBtn');
    const wsName = document.getElementById('wsName');
    const wsIcon = document.getElementById('wsIcon');
    const wsList = document.getElementById('wsList');
    if (!wsBtn || !wsName || !wsList) return;

    let res;
    try {
        res = await API.getWorkspaces();
    } catch {
        res = { workspaces: [{ id: 'personal', name: 'Kişisel Pano' }], activeWorkspaceId: 'personal' };
    }

    const workspaces = res.workspaces || [];
    const activeId = res.activeWorkspaceId || (currentUser?.tenantId) || 'personal';

    const currentWs = workspaces.find(w => w.id === activeId);
    if (currentWs) {
        wsName.textContent = currentWs.name;
        wsIcon.textContent = currentWs.type === 'personal' ? '🛡️' : (currentWs.type === 'user' ? '👤' : '🏢');
    } else {
        wsName.textContent = activeId === 'personal' ? 'Kişisel Pano' : (activeId === 'demo' ? 'Demo Panosu' : activeId);
        wsIcon.textContent = '📋';
    }

    const bcProj = document.getElementById('bcProjectName');
    if (bcProj) bcProj.textContent = wsName.textContent;

    wsList.innerHTML = workspaces.map(w => {
        const isActive = w.id === activeId;
        const icon = w.type === 'personal' ? '🛡️' : (w.type === 'user' ? '👤' : '🏢');
        const badge = w.type === 'personal' ? 'Kişisel' : (w.type === 'user' ? 'Bireysel' : 'Takım');
        return `
            <div class="ws-item ${isActive ? 'active' : ''}" data-ws-id="${escHtml(w.id)}">
                <div class="ws-item-left">
                    <span>${icon}</span>
                    <span class="ws-item-title">${escHtml(w.name)}</span>
                </div>
                <span class="ws-item-badge">${badge}</span>
            </div>
        `;
    }).join('');

    wsList.querySelectorAll('.ws-item').forEach(el => {
        el.addEventListener('click', async () => {
            const targetId = el.getAttribute('data-ws-id');
            if (targetId === activeId) {
                document.getElementById('workspaceDropdown').style.display = 'none';
                return;
            }
            try {
                showToast('Çalışma alanı değiştiriliyor…', 'info');
                await API.switchWorkspace(targetId);
                document.getElementById('workspaceDropdown').style.display = 'none';
                await boot();
                showToast('Çalışma alanı güncellendi');
            } catch (err) {
                showToast(err.message || 'Çalışma alanı değiştirilemedi', 'error');
            }
        });
    });
}

function closeAllJiraDropdowns() {
    ['workspaceDropdown', 'topNavViewsDropdown', 'topNavManageDropdown', 'jiraUserDropdown', 'appSwitcherDropdown', 'notifDropdown'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.classList.remove('open');
        }
    });
}
window.closeAllJiraDropdowns = closeAllJiraDropdowns;

// Toggle Jira topnav dropdowns
safeAddListener('jiraAppSwitcher', 'click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('appSwitcherDropdown');
    if (!dropdown) return;
    const isHidden = dropdown.style.display === 'none';
    closeAllJiraDropdowns();
    if (isHidden) dropdown.style.display = 'flex';
});

safeAddListener('workspaceSwitcherBtn', 'click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('workspaceDropdown');
    const isHidden = !dropdown || dropdown.style.display === 'none';
    closeAllJiraDropdowns();
    if (dropdown && isHidden) dropdown.style.display = 'flex';
});

safeAddListener('topNavViewsBtn', 'click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('topNavViewsDropdown');
    const isHidden = !dropdown || dropdown.style.display === 'none';
    closeAllJiraDropdowns();
    if (dropdown && isHidden) dropdown.style.display = 'flex';
});

safeAddListener('topNavManageBtn', 'click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('topNavManageDropdown');
    const isHidden = !dropdown || dropdown.style.display === 'none';
    closeAllJiraDropdowns();
    if (dropdown && isHidden) dropdown.style.display = 'flex';
});

safeAddListener('userProfileBadge', 'click', (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('jiraUserDropdown');
    const isHidden = !dropdown || dropdown.style.display === 'none';
    closeAllJiraDropdowns();
    if (dropdown && isHidden) dropdown.style.display = 'flex';
});

safeAddListener('notifBellBtn', 'click', (e) => {
    e.stopPropagation();
    const dd = document.getElementById('notifDropdown');
    if (!dd) return;
    const isHidden = dd.style.display === 'none' && !dd.classList.contains('open');
    closeAllJiraDropdowns();
    if (isHidden) {
        dd.classList.add('open');
        dd.style.display = 'flex';
    }
});

document.addEventListener('click', (e) => {
    const ids = ['workspaceDropdown', 'topNavViewsDropdown', 'topNavManageDropdown', 'jiraUserDropdown', 'notifDropdown', 'appSwitcherDropdown'];
    const triggers = ['workspaceSwitcherBtn', 'topNavViewsBtn', 'topNavManageBtn', 'userProfileBadge', 'notifBellBtn', 'jiraAppSwitcher'];
    
    const clickedTrigger = triggers.some(tId => {
        const t = document.getElementById(tId);
        return t && t.contains(e.target);
    });
    if (clickedTrigger) return;

    const clickedInside = ids.some(dId => {
        const d = document.getElementById(dId);
        return d && d.contains(e.target);
    });
    if (!clickedInside) {
        closeAllJiraDropdowns();
    }
});

// Prompt to create team from switcher footer
safeAddListener('createWorkspacePromptBtn', 'click', () => {
    document.getElementById('workspaceDropdown').style.display = 'none';
    switchView('workspaces');
    if (typeof window.openCreateWorkspaceModal === 'function') {
        window.openCreateWorkspaceModal();
    }
});

// ── Workspaces & Project Management Controller ─────────────
async function renderWorkspacesView() {
    const grid = document.getElementById('workspacesGrid');
    if (!grid) return;

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-muted);">Çalışma alanları yükleniyor…</div>';

    try {
        const [wsData, usersData] = await Promise.all([
            API.getWorkspaces().catch(() => ({ workspaces: [] })),
            API.getDetailedUsers().catch(() => ({ users: [] }))
        ]);

        const workspaces = wsData.workspaces || [];
        const activeId = wsData.activeWorkspaceId || currentUser?.tenantId || 'personal';

        // Update KPI Counters
        const kpiTotal = document.getElementById('kpiTotalWorkspaces');
        if (kpiTotal) kpiTotal.textContent = workspaces.length;

        const kpiTeam = document.getElementById('kpiTeamWorkspaces');
        if (kpiTeam) kpiTeam.textContent = workspaces.filter(w => w.type === 'team').length;

        const kpiPersonal = document.getElementById('kpiPersonalWorkspaces');
        if (kpiPersonal) kpiPersonal.textContent = workspaces.filter(w => w.type !== 'team').length;

        const kpiActive = document.getElementById('kpiActiveWsName');
        const activeWsObj = workspaces.find(w => w.id === activeId);
        if (kpiActive) kpiActive.textContent = activeWsObj ? activeWsObj.name : activeId;

        if (workspaces.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-muted);">Henüz çalışma alanı bulunmuyor.</div>';
            return;
        }

        grid.innerHTML = workspaces.map(w => {
            const isActive = w.id === activeId;
            const icon = w.type === 'personal' ? '🛡️' : (w.type === 'user' ? '👤' : '🏢');
            const typeLabel = w.type === 'personal' ? 'Kişisel Pano' : (w.type === 'user' ? 'Bireysel Pano' : 'Takım Çalışma Alanı');
            const typeClass = w.type === 'team' ? 'status-doing' : 'status-todo';
            const canDelete = w.id !== 'personal' && w.id !== 'demo';
            const members = w.members || [];
            const desc = w.description || 'Bu çalışma alanı için henüz açıklama girilmemiş.';

            const avatarStackHtml = members.slice(0, 5).map(m => `
                <div class="ws-avatar-stack-item" style="background:${m.avatarColor || '#0052cc'}" title="${escHtml(m.name)} (@${escHtml(m.username)})">
                    ${initials(m.name || m.username)}
                </div>
            `).join('') + (members.length > 5 ? `<div class="ws-avatar-stack-item" style="background:#64748b">+${members.length - 5}</div>` : '');

            return `
                <div class="workspace-card ${isActive ? 'active-workspace' : ''}">
                    <div class="ws-card-header">
                        <div class="ws-card-title-group">
                            <span class="ws-card-icon">${icon}</span>
                            <div>
                                <div class="ws-card-name">${escHtml(w.name)}</div>
                                <span class="status-pill ${typeClass}" style="margin-top: 4px;">${typeLabel}</span>
                            </div>
                        </div>
                        ${isActive ? '<span class="status-pill text-success" style="background: rgba(16, 185, 129, 0.12); font-weight: 700;">🟢 Aktif Pano</span>' : ''}
                    </div>

                    <div class="ws-card-desc">${escHtml(desc)}</div>

                    <div class="ws-card-members-section">
                        <div>
                            <strong>${members.length}</strong> Takım Üyesi
                        </div>
                        <div class="ws-avatar-stack">
                            ${avatarStackHtml || '<span style="color:var(--text-muted); font-size:11px;">Üye atanmamış</span>'}
                        </div>
                    </div>

                    <div class="ws-card-actions">
                        ${!isActive ? `<button class="btn btn-primary btn-sm" onclick="window.switchToWorkspaceDirect('${escHtml(w.id)}')">🔀 Panoya Geç</button>` : `<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.7;">Şu Anki Pano</button>`}
                        <button class="btn btn-secondary btn-sm" onclick="window.openEditWorkspaceModal('${escHtml(w.id)}')">✏️ Düzenle</button>
                        <button class="btn btn-secondary btn-sm" onclick="window.openWorkspaceMembersModal('${escHtml(w.id)}')">👥 Üyeleri Ata</button>
                        ${canDelete ? `<button class="btn btn-danger btn-sm" onclick="window.deleteWorkspaceAction('${escHtml(w.id)}')">🗑 Sil</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error('Workspaces load error:', e);
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--danger);">Çalışma alanları yüklenirken hata oluştu: ${escHtml(e.message)}</div>`;
    }
}
window.renderWorkspacesView = renderWorkspacesView;

window.openCreateWorkspaceModal = async function() {
    document.getElementById('editWorkspaceId').value = '';
    document.getElementById('workspaceModalTitle').textContent = '🏢 Yeni Çalışma Alanı Oluştur';
    document.getElementById('wsInputName').value = '';
    document.getElementById('wsInputDesc').value = '';
    const err = document.getElementById('workspaceModalError');
    if (err) err.style.display = 'none';

    const initialList = document.getElementById('wsInitialMembersList');
    const group = document.getElementById('wsInitialMembersGroup');
    if (group) group.style.display = 'block';

    const templateGroup = document.getElementById('wsColumnTemplateGroup');
    if (templateGroup) templateGroup.style.display = 'block';

    if (initialList) {
        try {
            const res = await API.getDetailedUsers();
            const allUsers = res.users || [];
            initialList.innerHTML = allUsers.map(u => `
                <label style="display:flex; align-items:center; gap:8px; padding:6px 4px; font-size:12px; cursor:pointer; border-bottom: 1px solid rgba(0,0,0,0.03);">
                    <input type="checkbox" name="wsInitialMember" value="${escHtml(u.id)}">
                    <span style="display:inline-block; width:22px; height:22px; border-radius:50%; background:${u.avatarColor || '#0052cc'}; color:#fff; text-align:center; line-height:22px; font-size:10px; font-weight:700;">${initials(u.name)}</span>
                    <span style="font-weight: 500;">${escHtml(u.name)}</span>
                    <span style="color:var(--text-muted); font-size:11px;">(@${escHtml(u.username)})</span>
                </label>
            `).join('') || '<div style="color:var(--text-muted); font-size:12px;">Kullanıcı bulunamadı.</div>';
        } catch {
            initialList.innerHTML = '';
        }
    }

    openModal('workspaceModal');
};

window.openEditWorkspaceModal = async function(wsId) {
    const err = document.getElementById('workspaceModalError');
    if (err) err.style.display = 'none';

    try {
        const res = await API.getWorkspaces();
        const ws = (res.workspaces || []).find(w => w.id === wsId);
        if (!ws) {
            showToast('Çalışma alanı bulunamadı', 'error');
            return;
        }
        document.getElementById('editWorkspaceId').value = wsId;
        document.getElementById('workspaceModalTitle').textContent = `✏️ '${ws.name}' Düzenle`;
        document.getElementById('wsInputName').value = ws.name;
        document.getElementById('wsInputDesc').value = ws.description || '';

        const group = document.getElementById('wsInitialMembersGroup');
        if (group) group.style.display = 'none';

        const templateGroup = document.getElementById('wsColumnTemplateGroup');
        if (templateGroup) templateGroup.style.display = 'none';

        openModal('workspaceModal');
    } catch (e) {
        showToast(e.message, 'error');
    }
};

window.saveWorkspaceSubmit = async function() {
    const id = document.getElementById('editWorkspaceId').value;
    const name = document.getElementById('wsInputName').value.trim();
    const description = document.getElementById('wsInputDesc').value.trim();
    const err = document.getElementById('workspaceModalError');

    if (!name) {
        if (err) {
            err.textContent = 'Lütfen çalışma alanı adını giriniz.';
            err.style.display = 'block';
        }
        return;
    }

    try {
        if (id) {
            await API.updateWorkspace(id, { name, description });
            showToast('Çalışma alanı başarıyla güncellendi');
        } else {
            const selectedMemberIds = Array.from(document.querySelectorAll('input[name="wsInitialMember"]:checked')).map(cb => cb.value);
            const template = document.getElementById('wsTemplateSelect')?.value || 'standard';
            await API.createWorkspace(name, description, selectedMemberIds, template);
            showToast('Yeni çalışma alanı başarıyla oluşturuldu');
        }
        closeModal('workspaceModal');
        await renderWorkspacesView();
        await renderWorkspaceSwitcher();
    } catch (e) {
        if (err) {
            err.textContent = e.message || 'Kayıt başarısız oldu';
            err.style.display = 'block';
        }
    }
};

window.deleteWorkspaceAction = async function(wsId) {
    if (!confirm('Bu çalışma alanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
    try {
        await API.deleteWorkspace(wsId);
        showToast('Çalışma alanı silindi');
        await renderWorkspacesView();
        await renderWorkspaceSwitcher();
    } catch (e) {
        showToast(e.message || 'Silme işlemi başarısız', 'error');
    }
};

window.switchToWorkspaceDirect = async function(targetId) {
    try {
        showToast('Çalışma alanı değiştiriliyor…', 'info');
        await API.switchWorkspace(targetId);
        await boot();
        showToast('Çalışma alanına geçildi');
    } catch (e) {
        showToast(e.message || 'Geçiş başarısız', 'error');
    }
};

let _currentWsMembersData = null;

window.openWorkspaceMembersModal = async function(wsId) {
    document.getElementById('manageMembersWsId').value = wsId;
    const listEl = document.getElementById('wsMembersAssignmentList');
    listEl.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted);">Üye bilgileri getiriliyor…</div>';
    document.getElementById('searchWsMembersInput').value = '';

    openModal('workspaceMembersModal');

    try {
        const res = await API.getWorkspaceMembers(wsId);
        _currentWsMembersData = res;
        document.getElementById('wsMembersModalSubtitle').textContent = `Çalışma Alanı: ${res.workspaceName || wsId}`;
        renderWorkspaceMembersList();
    } catch (e) {
        listEl.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--danger);">Yükleme hatası: ${escHtml(e.message)}</div>`;
    }
};

function renderWorkspaceMembersList() {
    if (!_currentWsMembersData) return;
    const listEl = document.getElementById('wsMembersAssignmentList');
    const searchVal = (document.getElementById('searchWsMembersInput')?.value || '').toLowerCase().trim();
    const countBadge = document.getElementById('wsMembersCountBadge');

    const assignedMap = new Map((_currentWsMembersData.members || []).map(m => [m.id || m.userId, m]));
    const allUsers = _currentWsMembersData.allUsers || [];

    const filtered = allUsers.filter(u =>
        u.name.toLowerCase().includes(searchVal) ||
        u.username.toLowerCase().includes(searchVal)
    );

    if (countBadge) {
        countBadge.textContent = `${assignedMap.size} üye seçili`;
    }

    if (filtered.length === 0) {
        listEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Aramanıza uygun kullanıcı bulunamadı.</div>';
        return;
    }

    listEl.innerHTML = filtered.map(u => {
        const isAssigned = assignedMap.has(u.id);
        const memberRole = assignedMap.get(u.id)?.role || 'member';

        return `
            <div class="ws-member-item ${isAssigned ? 'selected' : ''}" data-uid="${escHtml(u.id)}">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <input type="checkbox" class="ws-member-check" ${isAssigned ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: ${escHtml(u.avatarColor || '#0052cc')}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">
                        ${initials(u.name)}
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${escHtml(u.name)}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">@${escHtml(u.username)}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <select class="form-select ws-member-role-select" style="font-size: 11px; padding: 4px 8px; height: 28px;" ${!isAssigned ? 'disabled' : ''}>
                        <option value="member" ${memberRole === 'member' ? 'selected' : ''}>Üye</option>
                        <option value="admin" ${memberRole === 'admin' ? 'selected' : ''}>Yönetici</option>
                    </select>
                </div>
            </div>
        `;
    }).join('');

    listEl.querySelectorAll('.ws-member-item').forEach(row => {
        const uid = row.dataset.uid;
        const check = row.querySelector('.ws-member-check');
        const roleSel = row.querySelector('.ws-member-role-select');

        check.addEventListener('change', (e) => {
            e.stopPropagation();
            if (check.checked) {
                row.classList.add('selected');
                roleSel.disabled = false;
                const uObj = allUsers.find(x => x.id === uid);
                assignedMap.set(uid, { id: uid, userId: uid, username: uObj?.username || '', name: uObj?.name || '', role: roleSel.value });
            } else {
                row.classList.remove('selected');
                roleSel.disabled = true;
                assignedMap.delete(uid);
            }
            _currentWsMembersData.members = Array.from(assignedMap.values());
            if (countBadge) countBadge.textContent = `${assignedMap.size} üye seçili`;
        });

        roleSel.addEventListener('change', () => {
            if (assignedMap.has(uid)) {
                assignedMap.get(uid).role = roleSel.value;
            }
        });
    });
}

safeAddListener('searchWsMembersInput', 'input', () => {
    renderWorkspaceMembersList();
});

safeAddListener('btnSaveWorkspaceMembers', 'click', async () => {
    const wsId = document.getElementById('manageMembersWsId').value;
    if (!wsId || !_currentWsMembersData) return;

    const payload = (_currentWsMembersData.members || []).map(m => ({
        userId: m.id || m.userId,
        role: m.role || 'member'
    }));

    try {
        await API.updateWorkspaceMembers(wsId, payload);
        showToast('Takım üyeleri başarıyla güncellendi');
        closeModal('workspaceMembersModal');
        await renderWorkspacesView();
        await renderWorkspaceSwitcher();
    } catch (e) {
        showToast(e.message || 'Üyeler kaydedilemedi', 'error');
    }
});

safeAddListener('btnOpenCreateWorkspaceModal', 'click', () => window.openCreateWorkspaceModal());
safeAddListener('btnRefreshWorkspaces', 'click', () => renderWorkspacesView());
safeAddListener('btnSaveWorkspace', 'click', () => window.saveWorkspaceSubmit());
safeAddListener('manageWorkspacesBtn', 'click', () => switchView('workspaces'));
safeAddListener('sidebarWorkspacesBtn', 'click', () => switchView('workspaces'));

// ── Comment Mention Autocomplete Controller ───────────────
function setupCommentMentionAutocomplete() {
    const textarea = document.getElementById('newComment');
    const suggestionsBox = document.getElementById('mentionSuggestions');
    if (!textarea || !suggestionsBox) return;

    let activeMentionIndex = -1;
    let filteredUsers = [];

    function hideSuggestions() {
        suggestionsBox.style.display = 'none';
        suggestionsBox.innerHTML = '';
        activeMentionIndex = -1;
        filteredUsers = [];
    }

    textarea.addEventListener('input', () => {
        const cursor = textarea.selectionStart;
        const textBeforeCursor = textarea.value.slice(0, cursor);
        const match = textBeforeCursor.match(/@([a-zA-Z0-9_.]*)$/);

        if (!match) {
            hideSuggestions();
            return;
        }

        const query = match[1].toLowerCase();
        const candidateUsers = (users && users.length > 0) ? users : (window.users || []);
        filteredUsers = candidateUsers.filter(u =>
            (u.username && u.username.toLowerCase().includes(query)) ||
            (u.name && u.name.toLowerCase().includes(query))
        );

        if (filteredUsers.length === 0) {
            hideSuggestions();
            return;
        }

        activeMentionIndex = 0;
        renderSuggestions();
    });

    function renderSuggestions() {
        suggestionsBox.style.display = 'flex';
        suggestionsBox.innerHTML = filteredUsers.map((u, idx) => {
            const isAct = idx === activeMentionIndex ? 'active' : '';
            return `
                <div class="mention-item ${isAct}" data-idx="${idx}">
                    <div class="mention-item-avatar" style="background:${u.avatarColor || '#0052cc'}">
                        ${initials(u.name || u.username)}
                    </div>
                    <div>
                        <div class="mention-item-name">${escHtml(u.name)}</div>
                        <div class="mention-item-handle">@${escHtml(u.username)}</div>
                    </div>
                </div>
            `;
        }).join('');

        suggestionsBox.querySelectorAll('.mention-item').forEach(item => {
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const idx = Number(item.dataset.idx);
                selectMentionUser(filteredUsers[idx]);
            });
        });
    }

    function selectMentionUser(user) {
        if (!user) return;
        const cursor = textarea.selectionStart;
        const textBeforeCursor = textarea.value.slice(0, cursor);
        const textAfterCursor = textarea.value.slice(cursor);
        const match = textBeforeCursor.match(/@([a-zA-Z0-9_.]*)$/);
        if (!match) return;

        const beforeMatch = textBeforeCursor.slice(0, match.index);
        const handle = user.username || user.name.replace(/\s+/g, '_');
        const inserted = `@${handle} `;
        textarea.value = beforeMatch + inserted + textAfterCursor;
        const newCursorPos = beforeMatch.length + inserted.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
        hideSuggestions();
    }

    textarea.addEventListener('keydown', (e) => {
        if (suggestionsBox.style.display !== 'none' && filteredUsers.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeMentionIndex = (activeMentionIndex + 1) % filteredUsers.length;
                renderSuggestions();
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeMentionIndex = (activeMentionIndex - 1 + filteredUsers.length) % filteredUsers.length;
                renderSuggestions();
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                selectMentionUser(filteredUsers[activeMentionIndex]);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                hideSuggestions();
                return;
            }
        }
    });

    textarea.addEventListener('blur', () => {
        setTimeout(hideSuggestions, 200);
    });
}
setupCommentMentionAutocomplete();

// ── User & Team Management Controller ─────────────────────
async function loadAdminData() {
    try {
        const canViewLogs = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
        const tabLogs = document.getElementById('tabLogs');
        if (tabLogs) {
            tabLogs.style.display = canViewLogs ? 'inline-block' : 'none';
        }
        const tabNavAudit = document.getElementById('tabNavAudit');
        if (tabNavAudit) {
            tabNavAudit.style.display = canViewLogs ? 'inline-block' : 'none';
        }

        const [adminUsersRes, wsData, pendingUsers] = await Promise.all([
            API.getDetailedUsers().catch(() => ({ users: [] })),
            API.getWorkspaces().catch(() => ({ workspaces: [] })),
            API.getPendingUsers().catch(() => [])
        ]);

        const adminUsers = adminUsersRes.users || [];
        const workspaces = wsData.workspaces || [];

        // Update Pending Users Badge
        const pendingBadge = document.getElementById('pendingUsersBadge');
        if (pendingBadge) {
            if (pendingUsers.length > 0) {
                pendingBadge.textContent = pendingUsers.length;
                pendingBadge.style.display = 'inline-block';
            } else {
                pendingBadge.style.display = 'none';
            }
        }

        // Target workspace select
        const wsSelect = document.getElementById('newUserTargetWorkspace');
        if (wsSelect) {
            wsSelect.innerHTML = workspaces.map(w =>
                `<option value="${escHtml(w.id)}">${escHtml(w.name)} (${w.type === 'personal' ? 'Kişisel' : (w.type === 'user' ? 'Bireysel' : 'Takım')})</option>`
            ).join('');
        }

        // Render Users List (Tab 1)
        const usersListEl = document.getElementById('adminUsersList');
        if (usersListEl) {
            if (adminUsers.length === 0) {
                usersListEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">Kullanıcı bulunamadı.</div>';
            } else {
                usersListEl.innerHTML = adminUsers.map(u => {
                    const roleClass = u.role === 'superadmin' ? 'superadmin' : (u.role === 'admin' ? 'admin' : 'user');
                    const roleLabel = u.role === 'superadmin' ? 'Süper Admin' : (u.role === 'admin' ? 'Yönetici' : 'Üye');
                    const wsNames = (u.workspaces || []).map(w => w.name || w.id).join(', ') || 'Kişisel';
                    const canDelete = currentUser?.role === 'superadmin' && u.id !== currentUser.id && u.role !== 'superadmin';
                    
                    let statusBadge = '<span style="color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">Onaylı</span>';
                    if (u.status === 'pending') {
                        statusBadge = '<span style="color: #d97706; background: #fef3c7; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">Onay Bekliyor</span>';
                    } else if (u.status === 'rejected') {
                        statusBadge = '<span style="color: #dc2626; background: #fee2e2; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">Reddedildi</span>';
                    }

                    const lastLogin = u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('tr-TR') : 'Hiç giriş yapmadı';

                    return `
                        <div class="admin-user-row" style="padding: 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                            <div class="admin-user-meta" style="display: flex; align-items: center; gap: 12px;">
                                <div class="user-profile-badge" style="background: ${escHtml(u.avatarColor || '#6366f1')}; width: 36px; height: 36px; font-size: 13px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700;">
                                    ${initials(u.name)}
                                </div>
                                <div>
                                    <div style="font-weight: 600; font-size: 13px; color: var(--text-primary);">
                                        ${escHtml(u.name)} <span style="font-size: 11px; color: var(--text-muted);">(@${escHtml(u.username)})</span>
                                    </div>
                                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">
                                        Panolar: <span style="color: var(--accent); font-weight: 500;">${escHtml(wsNames)}</span> · Son Giriş: <span>${escHtml(lastLogin)}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                ${statusBadge}
                                <span class="admin-user-tag ${roleClass}">${roleLabel}</span>
                                ${canDelete ? `<button class="btn btn-danger btn-sm" onclick="window.deleteAdminUser('${escHtml(u.id)}')">Sil</button>` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Render Pending Users List (Tab 2)
        const pendingListEl = document.getElementById('adminPendingUsersList');
        if (pendingListEl) {
            if (pendingUsers.length === 0) {
                pendingListEl.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">✓ Bekleyen kullanıcı onay talebi bulunmuyor.</div>';
            } else {
                pendingListEl.innerHTML = pendingUsers.map(u => {
                    const createdDate = new Date(u.createdAt).toLocaleString('tr-TR');
                    return `
                        <div class="admin-user-row" style="padding: 14px; border: 1px solid #fef3c7; background: #fffbeb; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                            <div class="admin-user-meta" style="display: flex; align-items: center; gap: 12px;">
                                <div class="user-profile-badge" style="background: ${escHtml(u.avatarColor || '#d97706')}; width: 36px; height: 36px; font-size: 13px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700;">
                                    ${initials(u.name)}
                                </div>
                                <div>
                                    <div style="font-weight: 600; font-size: 14px; color: #92400e;">
                                        ${escHtml(u.name)} <span style="font-size: 12px; color: #b45309;">(@${escHtml(u.username)})</span>
                                    </div>
                                    <div style="font-size: 11px; color: #78350f; margin-top: 3px;">
                                        Kayıt Tarihi: ${escHtml(createdDate)} ${u.company ? `· Şirket/Takım: <strong>${escHtml(u.company)}</strong>` : ''}
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <button class="btn btn-primary btn-sm" style="padding: 6px 14px; font-weight: 600;" onclick="window.approvePendingUser('${escHtml(u.id)}')">✓ Kabul Et</button>
                                <button class="btn btn-danger btn-sm" style="padding: 6px 14px; font-weight: 600;" onclick="window.rejectPendingUser('${escHtml(u.id)}')">✕ Reddet</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Render Teams List (Tab 4)
        const teamsListEl = document.getElementById('adminTeamsList');
        if (teamsListEl) {
            teamsListEl.innerHTML = workspaces.map(w => {
                const badge = w.type === 'personal' ? 'Kişisel' : (w.type === 'user' ? 'Bireysel' : 'Takım');
                return `
                    <div class="admin-user-row" style="padding: 12px; border-bottom: 1px solid var(--border);">
                        <div class="admin-user-meta" style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 20px;">${w.type === 'personal' ? '🛡️' : (w.type === 'user' ? '👤' : '🏢')}</span>
                            <div>
                                <div style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${escHtml(w.name)}</div>
                                <div style="font-size: 11px; color: var(--text-muted);">Tip: ${badge} · ID: <code>${escHtml(w.id)}</code></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render Audit Logs (Tab 3) - Super Admin only
        if (isSuperAdmin) {
            await renderAuditLogs();
        }
    } catch (e) {
        console.error('Admin data load failed:', e);
    }
}

let _auditLogFilterDebounce = null;

async function fetchAndRenderLogs(containerId, countBadgeId, searchId, userSelectId, actionSelectId, envSelectId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const searchInput = searchId ? document.getElementById(searchId) : null;
    const userSelect = userSelectId ? document.getElementById(userSelectId) : null;
    const actionSelect = actionSelectId ? document.getElementById(actionSelectId) : null;
    const envSelect = envSelectId ? document.getElementById(envSelectId) : null;
    const countBadge = countBadgeId ? document.getElementById(countBadgeId) : null;

    const searchVal = searchInput ? searchInput.value.trim() : '';
    const userVal = userSelect ? userSelect.value : '';
    const actionVal = actionSelect ? actionSelect.value : '';
    const envVal = envSelect ? envSelect.value : 'all';

    container.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">Aktivite kayıtları getiriliyor…</div>';
    if (countBadge) countBadge.textContent = 'Filtreleniyor…';

    try {
        // Populate user select dropdown if it only has the default option
        if (userSelect && userSelect.options.length <= 1) {
            try {
                const uRes = await API.getDetailedUsers().catch(() => ({ users: [] }));
                const allUsers = uRes.users || [];
                if (allUsers.length > 0) {
                    userSelect.innerHTML = '<option value="">Tüm Kullanıcılar</option>' + allUsers.map(u =>
                        `<option value="${escHtml(u.username)}">${escHtml(u.name)} (@${escHtml(u.username)})</option>`
                    ).join('');
                    if (userVal) userSelect.value = userVal;
                }
            } catch {}
        }

        const res = await API.getAuditLogs({
            user: userVal,
            action: actionVal,
            q: searchVal,
            workspace: envVal
        });
        const logs = res.logs || [];

        if (countBadge) {
            countBadge.textContent = `Toplam ${logs.length} aktivite kaydı listeleniyor`;
        }

        if (logs.length === 0) {
            container.innerHTML = '<div style="padding: 32px 16px; text-align: center; color: var(--text-muted); font-size: 13px; background: var(--bg-secondary); border-radius: 8px; border: 1px dashed var(--border);">🔍 Seçilen kriterlere uygun aktivite kaydı bulunamadı.</div>';
            return;
        }

        const actionMeta = {
            'LOGIN': { label: 'Giriş Yapıldı', color: '#3b82f6', icon: '🔑', bg: 'rgba(59, 130, 246, 0.12)' },
            'LOGOUT': { label: 'Çıkış Yapıldı', color: '#6b7280', icon: '🚪', bg: 'rgba(107, 114, 128, 0.12)' },
            'REGISTER_REQUEST': { label: 'Kayıt Talebi', color: '#eab308', icon: '⏳', bg: 'rgba(234, 179, 8, 0.12)' },
            'USER_APPROVED': { label: 'Kullanıcı Onaylandı', color: '#10b981', icon: '✅', bg: 'rgba(16, 185, 129, 0.12)' },
            'USER_REJECTED': { label: 'Kullanıcı Reddedildi', color: '#ef4444', icon: '❌', bg: 'rgba(239, 68, 68, 0.12)' },
            'USER_CREATED': { label: 'Kullanıcı Oluşturuldu', color: '#6366f1', icon: '👤', bg: 'rgba(99, 102, 241, 0.12)' },
            'USER_DELETED': { label: 'Kullanıcı Silindi', color: '#dc2626', icon: '🗑️', bg: 'rgba(220, 38, 38, 0.12)' },
            'CARD_CREATE': { label: 'Kart Oluşturuldu', color: '#10b981', icon: '➕', bg: 'rgba(16, 185, 129, 0.12)' },
            'CARD_VIEW': { label: 'Kart İnceleme (Okuma)', color: '#0ea5e9', icon: '👁️', bg: 'rgba(14, 165, 233, 0.12)' },
            'CARD_COMMENT': { label: 'Yorum Eklendi', color: '#8b5cf6', icon: '💬', bg: 'rgba(139, 92, 246, 0.12)' },
            'CARD_MOVE': { label: 'Durum / Kolon Değişimi', color: '#6366f1', icon: '🔄', bg: 'rgba(99, 102, 241, 0.12)' },
            'CARD_UPDATE': { label: 'Kart Güncelleme', color: '#3b82f6', icon: '✏️', bg: 'rgba(59, 130, 246, 0.12)' },
            'CARD_EFFORT': { label: 'Efor Girişi', color: '#f59e0b', icon: '⏱️', bg: 'rgba(245, 158, 11, 0.12)' },
            'CARD_DELETE': { label: 'Kart Silindi', color: '#ef4444', icon: '🗑️', bg: 'rgba(239, 68, 68, 0.12)' },
            'WORKSPACE_CREATE': { label: 'Pano/Takım Oluşturuldu', color: '#ec4899', icon: '📁', bg: 'rgba(236, 72, 153, 0.12)' },
            'WORKSPACE_SWITCH': { label: 'Pano Değişimi', color: '#64748b', icon: '🔀', bg: 'rgba(100, 116, 139, 0.12)' }
        };

        container.innerHTML = logs.map(l => {
            const timeStr = new Date(l.createdAt).toLocaleString('tr-TR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            const meta = actionMeta[l.action] || { label: l.action, color: '#6366f1', icon: '📌', bg: 'rgba(99, 102, 241, 0.12)' };
            const authorName = l.name || l.username || 'Kullanıcı';
            const init = initials(authorName);
            const hue = [...authorName].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
            const avatarBg = `hsl(${hue}, 60%, 45%)`;

            const envBadge = l.workspaceId === 'demo'
                ? `<span style="font-size: 10px; background: rgba(99, 102, 241, 0.12); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.25); padding: 1px 6px; border-radius: 4px; font-weight: 700;">🚀 Demo</span>`
                : `<span style="font-size: 10px; background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); padding: 1px 6px; border-radius: 4px; font-weight: 700;">🌐 Canlı</span>`;

            return `
                <div style="display: flex; gap: 14px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); font-size: 13px; align-items: flex-start; transition: var(--transition); box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
                    <div style="width: 34px; height: 34px; border-radius: 50%; background: ${avatarBg}; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 12px; flex-shrink: 0; margin-top: 1px;">
                        ${escHtml(init)}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
                            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                <span style="font-weight: 600; color: var(--text-primary); font-size: 13px;">${escHtml(authorName)}</span>
                                <span style="font-size: 12px; color: var(--text-muted);">(@${escHtml(l.username || '')})</span>
                                <span style="font-size: 10px; background: rgba(99, 102, 241, 0.1); color: var(--accent); padding: 1px 6px; border-radius: 4px; font-weight: 600;">${escHtml(l.userRole || 'user')}</span>
                                ${envBadge}
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="color: ${meta.color}; background: ${meta.bg}; border: 1px solid ${meta.color}40; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; white-space: nowrap;">
                                    ${meta.icon} ${meta.label}
                                </span>
                                <span style="font-size: 11px; color: var(--text-muted); white-space: nowrap;">${escHtml(timeStr)}</span>
                            </div>
                        </div>
                        <div style="color: var(--text-secondary); font-size: 13px; line-height: 1.45; word-break: break-word;">
                            ${escHtml(l.details || '')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = `<div style="padding: 16px; color: var(--danger); font-size: 13px;">${escHtml(err.message || 'Loglar yüklenemedi')}</div>`;
    }
}

async function renderAuditLogs() {
    await fetchAndRenderLogs('adminLogsList', 'logResultsCount', 'logFilterSearch', 'logFilterUser', 'logFilterAction', 'logFilterEnv');
}

async function renderAuditView() {
    await fetchAndRenderLogs('viewAuditLogsList', 'viewAuditResultsCount', 'viewAuditFilterSearch', 'viewAuditFilterUser', 'viewAuditFilterAction', 'viewAuditFilterEnv');
}
window.renderAuditView = renderAuditView;

window.approvePendingUser = async function(userId) {
    try {
        const res = await API.approveUser(userId);
        showToast(res.message || 'Kullanıcı onaylandı!');
        await loadAdminData();
        await loadNotifications();
    } catch (e) {
        showToast(e.message || 'Kullanıcı onaylanamadı', 'error');
    }
};

window.rejectPendingUser = async function(userId) {
    if (!confirm('Bu kullanıcının başvurusunu reddetmek istediğinize emin misiniz?')) return;
    try {
        const res = await API.rejectUser(userId);
        showToast(res.message || 'Kullanıcı başvurusu reddedildi', 'info');
        await loadAdminData();
        await loadNotifications();
    } catch (e) {
        showToast(e.message || 'İşlem başarısız', 'error');
    }
};

window.deleteAdminUser = async function(userId) {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
        await API.deleteAdminUser(userId);
        showToast('Kullanıcı silindi');
        await loadAdminData();
    } catch (e) {
        showToast(e.message || 'Kullanıcı silinemedi', 'error');
    }
};

safeAddListener('manageUsersBtn', 'click', (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof loadAdminData === 'function') loadAdminData();
    switchView('team');
});

// Admin Modal Tabs Helper
function switchAdminTab(activeTabId, activePanelId) {
    ['tabUsersList', 'tabPendingUsers', 'tabLogs', 'tabTeamsList', 'tabAddUser'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', id === activeTabId);
    });
    ['panelUsersList', 'panelPendingUsers', 'panelLogs', 'panelTeamsList', 'panelAddUser'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === activePanelId) ? 'block' : 'none';
    });
}

safeAddListener('tabUsersList', 'click', () => {
    switchAdminTab('tabUsersList', 'panelUsersList');
    loadAdminData();
});

safeAddListener('tabPendingUsers', 'click', () => {
    switchAdminTab('tabPendingUsers', 'panelPendingUsers');
    loadAdminData();
});

safeAddListener('tabLogs', 'click', () => {
    switchAdminTab('tabLogs', 'panelLogs');
    renderAuditLogs();
});

safeAddListener('btnRefreshLogs', 'click', () => {
    renderAuditLogs();
});

safeAddListener('logFilterUser', 'change', () => {
    renderAuditLogs();
});

safeAddListener('logFilterAction', 'change', () => {
    renderAuditLogs();
});

safeAddListener('logFilterSearch', 'input', () => {
    clearTimeout(_auditLogFilterDebounce);
    _auditLogFilterDebounce = setTimeout(() => { renderAuditLogs(); }, 300);
});

safeAddListener('logFilterEnv', 'change', () => {
    renderAuditLogs();
});

safeAddListener('btnClearLogFilters', 'click', () => {
    const s = document.getElementById('logFilterSearch'); if (s) s.value = '';
    const u = document.getElementById('logFilterUser'); if (u) u.value = '';
    const a = document.getElementById('logFilterAction'); if (a) a.value = '';
    const e = document.getElementById('logFilterEnv'); if (e) e.value = 'all';
    renderAuditLogs();
});

// Full-screen View-Audit Listeners
safeAddListener('btnRefreshAuditView', 'click', () => {
    renderAuditView();
});

safeAddListener('viewAuditFilterEnv', 'change', () => {
    renderAuditView();
});

safeAddListener('viewAuditFilterUser', 'change', () => {
    renderAuditView();
});

safeAddListener('viewAuditFilterAction', 'change', () => {
    renderAuditView();
});

safeAddListener('viewAuditFilterSearch', 'input', () => {
    clearTimeout(_auditLogFilterDebounce);
    _auditLogFilterDebounce = setTimeout(() => { renderAuditView(); }, 300);
});

safeAddListener('btnClearAuditViewFilters', 'click', () => {
    const s = document.getElementById('viewAuditFilterSearch'); if (s) s.value = '';
    const u = document.getElementById('viewAuditFilterUser'); if (u) u.value = '';
    const a = document.getElementById('viewAuditFilterAction'); if (a) a.value = '';
    const e = document.getElementById('viewAuditFilterEnv'); if (e) e.value = 'all';
    renderAuditView();
});

safeAddListener('tabTeamsList', 'click', () => {
    switchAdminTab('tabTeamsList', 'panelTeamsList');
    loadAdminData();
});

safeAddListener('tabAddUser', 'click', () => {
    switchAdminTab('tabAddUser', 'panelAddUser');
});

// Radio change for user workspace mode
document.querySelectorAll('input[name="newUserWorkspaceMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const group = document.getElementById('targetWorkspaceGroup');
        if (group) {
            group.style.display = e.target.value === 'team' ? 'block' : 'none';
        }
    });
});

// Submit Add User Form
safeAddListener('adminAddUserForm', 'submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('newUserName').value.trim();
    const username = document.getElementById('newUserUsername').value.trim();
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const workspaceMode = document.querySelector('input[name="newUserWorkspaceMode"]:checked')?.value || 'team';
    const targetWorkspaceId = document.getElementById('newUserTargetWorkspace')?.value;
    const errDiv = document.getElementById('addUserError');
    if (errDiv) { errDiv.style.display = 'none'; errDiv.textContent = ''; }

    try {
        await API.createAdminUser({
            name,
            username,
            password,
            role,
            workspaceMode,
            targetWorkspaceId: workspaceMode === 'team' ? targetWorkspaceId : undefined
        });
        showToast('Kullanıcı başarıyla oluşturuldu!');
        document.getElementById('adminAddUserForm').reset();
        document.getElementById('tabUsersList').click();
    } catch (err) {
        if (errDiv) {
            errDiv.textContent = err.message || 'Kullanıcı oluşturulamadı';
            errDiv.style.display = 'block';
        }
    }
});

// Create Team Button
safeAddListener('btnCreateTeamSubmit', 'click', async () => {
    const input = document.getElementById('newTeamName');
    const name = input?.value.trim();
    if (!name) {
        showToast('Lütfen takım adı giriniz', 'warn');
        return;
    }
    try {
        await API.createWorkspace(name);
        showToast(`'${name}' takımı oluşturuldu!`);
        input.value = '';
        await loadAdminData();
        await renderWorkspaceSwitcher();
    } catch (err) {
        showToast(err.message || 'Takım oluşturulamadı', 'error');
    }
});

// ── Custom Labels Management UI ───────────────────────────
safeAddListener('manageLabelsBtn', 'click', (e) => {
    if (e && e.preventDefault) e.preventDefault();
    switchView('labels');
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

safeAddListener('addLabelBtn', 'click', async () => {
    const nameInp = document.getElementById('newLabelName');
    const colorInp = document.getElementById('newLabelColor');
    if (!nameInp || !colorInp) return;
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
safeAddListener('notifDropdown', 'click', (e) => {
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
        } else if (n.type === 'user-signup-request') {
            if (n.requestStatus === 'pending') {
                const targetUid = n.pendingUserId || n.senderId;
                actionHtml = `
                    <div class="notif-actions" style="margin-top: 8px; display: flex; gap: 6px;">
                        <button class="btn btn-primary" style="padding: 4px 10px; font-size: 11px; font-weight: 600; line-height: 1;" onclick="handleNotifApprove(event, '${targetUid}')">✓ Kabul Et</button>
                        <button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px; font-weight: 600; line-height: 1;" onclick="handleNotifReject(event, '${targetUid}')">✕ Reddet</button>
                    </div>
                `;
            } else if (n.requestStatus === 'approved') {
                actionHtml = `<div style="margin-top: 6px; font-size: 11px; color: #16a34a; font-weight: 600;">✓ Super Admin tarafından onaylandı</div>`;
            } else if (n.requestStatus === 'rejected') {
                actionHtml = `<div style="margin-top: 6px; font-size: 11px; color: #dc2626; font-weight: 600;">✕ Reddedildi</div>`;
            }
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

async function handleNotifApprove(event, userId) {
    event.stopPropagation();
    try {
        const res = await API.approveUser(userId);
        showToast(res.message || 'Kullanıcı onaylandı!');
        await loadNotifications();
        await loadAdminData();
    } catch (e) {
        showToast(e.message || 'Onaylanamadı', 'error');
    }
}
window.handleNotifApprove = handleNotifApprove;

async function handleNotifReject(event, userId) {
    event.stopPropagation();
    if (!confirm('Bu kullanıcının kaydını reddetmek istediğinize emin misiniz?')) return;
    try {
        const res = await API.rejectUser(userId);
        showToast(res.message || 'Kullanıcı reddedildi', 'info');
        await loadNotifications();
        await loadAdminData();
    } catch (e) {
        showToast(e.message || 'İşlem başarısız', 'error');
    }
}
window.handleNotifReject = handleNotifReject;

async function approveDemoRequest(event, notificationId) {
    event.stopPropagation();
    try {
        const res = await fetch('/api/auth/approve-demo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('tiny_kanban_token') || localStorage.getItem('kanban_token')}`
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
    const notifDropdown = document.getElementById('notifDropdown');
    if (notifDropdown) notifDropdown.classList.remove('open');
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

safeAddListener('notifReadAllBtn', 'click', async () => {
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

// Sidebar Toggle Handler
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const appSidebar = document.getElementById('appSidebar');
if (sidebarToggleBtn && appSidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
        appSidebar.classList.toggle('collapsed');
        try {
            localStorage.setItem('sidebar_collapsed', appSidebar.classList.contains('collapsed'));
        } catch (_) {}
    });
    try {
        if (localStorage.getItem('sidebar_collapsed') === 'true') {
            appSidebar.classList.add('collapsed');
        }
    } catch (_) {}
}

// ── Boot Application ──────────────────────────────────────
boot();
