// ============================================================
//  board.js – shared board logic (all views)
// ============================================================

// ── Label definitions ────────────────────────────────────
const LABELS = [
    { id: 'bug', name: 'Bug', color: '#ef4444', bg: '#fef2f2' },
    { id: 'feature', name: 'Özellik', color: '#6366f1', bg: '#eef2ff' },
    { id: 'task', name: 'Görev', color: '#3b82f6', bg: '#eff6ff' },
    { id: 'design', name: 'Tasarım', color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 'devops', name: 'DevOps', color: '#0891b2', bg: '#ecfeff' },
    { id: 'test', name: 'Test', color: '#16a34a', bg: '#f0fdf4' },
    { id: 'docs', name: 'Belge', color: '#ca8a04', bg: '#fefce8' },
    { id: 'urgent', name: 'Acil', color: '#dc2626', bg: '#fff1f2' },
];
const LABEL_MAP = Object.fromEntries(LABELS.map(l => [l.id, l]));

// ── Utilities ────────────────────────────────────────────
function initials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function escHtml(s) {
    return String(s || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function showToast(msg, type = '') {
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = msg;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3100);
}

// ── Due date helpers ─────────────────────────────────────
function dueBadge(dueDate) {
    if (!dueDate) return '';
    const diff = Math.floor((new Date(dueDate) - new Date()) / 86400000);
    let cls, icon, label;
    if (diff < 0) { cls = 'due-over'; icon = '⚠️'; label = `${Math.abs(diff)}g gecikti`; }
    else if (diff <= 2) { cls = 'due-soon'; icon = '⏰'; label = diff === 0 ? 'Bugün' : `${diff}g kaldı`; }
    else { cls = 'due-ok'; icon = '📅'; label = new Date(dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }); }
    return `<span class="due-badge ${cls}">${icon} ${escHtml(label)}</span>`;
}

// ── Card HTML ────────────────────────────────────────────
function cardHTML(card, epics = [], readonly = false) {
    const epic = epics.find(e => e.id === card.epicId);
    const subtasks = card.subtasks || [];
    const done = subtasks.filter(s => s.done).length;
    const pct = subtasks.length ? Math.round((done / subtasks.length) * 100) : 0;
    const priLabel = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };
    const labels = (card.labels || []).map(id => LABEL_MAP[id]).filter(Boolean);

    const actionsHTML = readonly ? '' : `
    <div class="card-actions">
      <button class="card-btn del" title="Sil" onclick="event.stopPropagation();doDelete('${card.id}')">✕</button>
    </div>`;

    return `
  <div class="card pri-${card.priority}${readonly ? ' readonly' : ''}"
       id="card-${card.id}" data-id="${card.id}"
       ${readonly ? '' : `draggable="true" ondragstart="onDragStart(event)" ondragend="onDragEnd(event)"`}
       onclick="openCardDetail('${card.id}')">
    <div class="card-priority-bar"></div>
    ${epic ? `<div class="card-epic"><span class="epic-pill" style="background:${epic.color}20;color:${epic.color}">${escHtml(epic.name)}</span></div>` : ''}
    <div class="card-top">
      <p class="card-title">${escHtml(card.title)}</p>
      ${actionsHTML}
    </div>
    ${card.desc ? `<p class="card-desc">${escHtml(card.desc)}</p>` : ''}
    ${labels.length ? `<div class="card-labels">${labels.map(l => `<span class="label-tag" style="background:${l.bg};color:${l.color}">${escHtml(l.name)}</span>`).join('')}</div>` : ''}
    ${subtasks.length ? `
    <div class="subtask-bar">
      <div class="subtask-bar-label"><span>${done}/${subtasks.length} alt görev</span><span>${pct}%</span></div>
      <div class="subtask-bar-track"><div class="subtask-bar-fill${pct === 100 ? ' done' : ''}" style="width:${pct}%"></div></div>
    </div>` : ''}
    <div class="card-footer">
      <div class="card-footer-left">
        ${card.assignee ? `<span class="card-assignee"><span class="assignee-avatar">${escHtml(initials(card.assignee))}</span>${escHtml(card.assignee)}</span>` : '<span></span>'}
        ${dueBadge(card.dueDate)}
      </div>
      <div class="card-footer-right">
        ${card.storyPoints != null ? `<span class="sp-badge">${card.storyPoints}</span>` : ''}
        <span class="card-priority-tag">${priLabel[card.priority] || card.priority}</span>
      </div>
    </div>
  </div>`;
}

// ── Board render ─────────────────────────────────────────
function renderBoard(cards, epics = [], readonly = false) {
    const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const fa = (document.getElementById('filterAssignee')?.value || '').toLowerCase();
    const fp = document.getElementById('filterPriority')?.value || '';

    ['todo', 'doing', 'done'].forEach(col => {
        const body = document.getElementById('col-' + col);
        if (!body) return;
        body.querySelectorAll('.card').forEach(el => el.remove());
        const emptyState = body.querySelector('.empty-state');
        const colCards = cards.filter(c => c.col === col);
        const frag = document.createDocumentFragment();
        const tmp = document.createElement('div');
        colCards.forEach(card => {
            const hidden = (
                (q && !card.title.toLowerCase().includes(q) && !(card.desc || '').toLowerCase().includes(q) && !(card.assignee || '').toLowerCase().includes(q)) ||
                (fa && (card.assignee || '').toLowerCase() !== fa) ||
                (fp && card.priority !== fp)
            );
            tmp.innerHTML = cardHTML(card, epics, readonly);
            const el = tmp.firstElementChild;
            if (hidden) el.classList.add('hidden');
            frag.appendChild(el);
        });
        body.appendChild(frag);
        if (emptyState) emptyState.style.display = colCards.length === 0 ? 'flex' : 'none';
        const cnt = document.querySelector(`[data-count="${col}"]`);
        if (cnt) cnt.textContent = colCards.length;
    });
    refreshAssigneeFilter(cards);
}

// ── List view render ─────────────────────────────────────
function renderListView(cards, epics = []) {
    const container = document.getElementById('listView');
    if (!container) return;
    const colLabel = { todo: 'Yapılacak', doing: 'Yapılıyor', done: 'Tamamlandı' };
    const colBadge = { todo: 'col-badge-todo', doing: 'col-badge-doing', done: 'col-badge-done' };
    const rows = cards.map(c => {
        const epic = epics.find(e => e.id === c.epicId);
        const labels = (c.labels || []).map(id => LABEL_MAP[id]).filter(Boolean);
        const subtasks = c.subtasks || [];
        const done = subtasks.filter(s => s.done).length;
        return `<tr onclick="openCardDetail('${c.id}')">
      <td class="list-title-cell">
        ${epic ? `<div><span class="epic-pill" style="background:${epic.color}20;color:${epic.color};font-size:10px;padding:1px 6px;border-radius:20px;font-weight:600">${escHtml(epic.name)}</span></div>` : ''}
        ${escHtml(c.title)}
        ${labels.length ? `<div style="margin-top:4px;display:flex;gap:3px;flex-wrap:wrap">${labels.map(l => `<span class="label-tag" style="background:${l.bg};color:${l.color}">${escHtml(l.name)}</span>`).join('')}</div>` : ''}
      </td>
      <td><span class="col-badge ${colBadge[c.col]}">${colLabel[c.col]}</span></td>
      <td>${c.assignee ? `<span class="card-assignee"><span class="assignee-avatar">${escHtml(initials(c.assignee))}</span>${escHtml(c.assignee)}</span>` : '—'}</td>
      <td><span class="card-priority-tag pri-${c.priority}" style="display:inline-block;background:${c.priority === 'high' ? 'var(--pri-high-bg)' : c.priority === 'low' ? 'var(--pri-low-bg)' : 'var(--pri-med-bg)'};color:${c.priority === 'high' ? 'var(--pri-high)' : c.priority === 'low' ? 'var(--pri-low)' : 'var(--pri-med)'}">${c.priority === 'high' ? 'Yüksek' : c.priority === 'low' ? 'Düşük' : 'Orta'}</span></td>
      <td>${c.dueDate ? dueBadge(c.dueDate) : '—'}</td>
      <td>${c.storyPoints != null ? `<span class="sp-badge">${c.storyPoints}</span>` : '—'}</td>
      <td>${subtasks.length ? `${done}/${subtasks.length}` : '—'}</td>
    </tr>`;
    }).join('');
    container.innerHTML = `<div class="list-view">
    <table class="list-table">
      <thead><tr>
        <th>Başlık</th><th>Durum</th><th>Kişi</th><th>Öncelik</th><th>Bitiş</th><th>SP</th><th>Alt Görev</th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-muted)">Görev yok</td></tr>'}</tbody>
    </table>
  </div>`;
}

// ── Backlog view render ──────────────────────────────────
function renderBacklogView(cards, sprints, epics = []) {
    const container = document.getElementById('backlogView');
    if (!container) return;
    const activeSprint = sprints.find(s => s.active) || null;

    function sprintGroup(sprint, sprintCards) {
        const isActive = sprint && sprint.active;
        const rowsHTML = sprintCards.map(c => {
            const epic = epics.find(e => e.id === c.epicId);
            return `<div class="backlog-row" onclick="openCardDetail('${c.id}')">
        <span class="card-priority-bar" style="position:relative;width:3px;height:16px;border-radius:3px;background:${c.priority === 'high' ? 'var(--pri-high)' : c.priority === 'low' ? 'var(--pri-low)' : 'var(--pri-med)'}"></span>
        <div class="backlog-row-title">${escHtml(c.title)}</div>
        <div class="backlog-row-meta">
          ${epic ? `<span class="epic-pill" style="background:${epic.color}20;color:${epic.color}">${escHtml(epic.name)}</span>` : ''}
          ${c.storyPoints != null ? `<span class="sp-badge">${c.storyPoints}</span>` : ''}
          ${dueBadge(c.dueDate)}
          ${c.assignee ? `<span class="card-assignee"><span class="assignee-avatar" style="width:18px;height:18px;font-size:9px">${escHtml(initials(c.assignee))}</span></span>` : ''}
        </div>
      </div>`;
        }).join('') || `<div class="backlog-empty">Bu sprint'te görev yok</div>`;

        const name = sprint ? sprint.name : 'Backlog (Sprint\'siz)';
        const dates = sprint?.startDate && sprint?.endDate ? `${sprint.startDate} → ${sprint.endDate}` : '';
        return `<div class="backlog-sprint-group">
      <div class="backlog-sprint-header">
        <div class="backlog-sprint-info">
          <span class="backlog-sprint-name">${escHtml(name)}</span>
          ${isActive ? `<span class="sprint-active-badge">🟢 Aktif Sprint</span>` : ''}
          ${dates ? `<span class="sprint-dates">${dates}</span>` : ''}
        </div>
        <div class="backlog-sprint-actions">
          ${sprint && !isActive ? `<button class="btn btn-sm btn-secondary" onclick="activateSprint('${sprint.id}')">Aktif Yap</button>` : ''}
          <span style="font-size:12px;color:var(--text-muted)">${sprintCards.length} görev</span>
        </div>
      </div>
      <div class="backlog-list">${rowsHTML}</div>
    </div>`;
    }

    let html = '';
    sprints.forEach(s => {
        const sc = cards.filter(c => c.sprintId === s.id);
        html += sprintGroup(s, sc);
    });
    const unassigned = cards.filter(c => !c.sprintId);
    html += sprintGroup(null, unassigned);

    container.innerHTML = `<div class="backlog-view">${html}</div>`;
}

// ── Dashboard view render ────────────────────────────────
function renderDashboard(cards, epics = [], sprints = []) {
    const container = document.getElementById('dashboardView');
    if (!container) return;
    const total = cards.length;
    const todo = cards.filter(c => c.col === 'todo').length;
    const doing = cards.filter(c => c.col === 'doing').length;
    const done = cards.filter(c => c.col === 'done').length;
    const high = cards.filter(c => c.priority === 'high').length;
    const med = cards.filter(c => c.priority === 'medium').length;
    const low = cards.filter(c => c.priority === 'low').length;
    const now = new Date();
    const overdue = cards.filter(c => c.dueDate && new Date(c.dueDate) < now && c.col !== 'done');
    const totalSP = cards.reduce((s, c) => (c.storyPoints || 0) + s, 0);
    const donePct = total ? Math.round((done / total) * 100) : 0;

    // overdue rows
    const overdueRows = overdue.slice(0, 6).map(c => {
        const diff = Math.abs(Math.floor((new Date(c.dueDate) - now) / 86400000));
        return `<div class="overdue-item" onclick="openCardDetail('${c.id}')">
      <span class="overdue-title">${escHtml(c.title)}</span>
      <span class="overdue-days">-${diff}g</span>
    </div>`;
    }).join('') || '<p style="color:var(--text-muted);font-size:13px">Geciken görev yok 🎉</p>';

    // epic stats
    const epicRows = epics.map(e => {
        const ec = cards.filter(c => c.epicId === e.id).length;
        return `<div class="epic-bar-row">
      <span class="epic-dot" style="background:${e.color}"></span>
      <span class="epic-bar-label">${escHtml(e.name)}</span>
      <span class="epic-bar-count">${ec}</span>
    </div>`;
    }).join('') || '<p style="color:var(--text-muted);font-size:13px">Epic yok</p>';

    // sprint progress
    const activeSprint = sprints.find(s => s.active);
    const sprintHTML = activeSprint ? (() => {
        const sc = cards.filter(c => c.sprintId === activeSprint.id);
        const sdone = sc.filter(c => c.col === 'done').length;
        const spct = sc.length ? Math.round((sdone / sc.length) * 100) : 0;
        return `<div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600">${escHtml(activeSprint.name)}</span>
        <span style="font-size:12px;color:var(--text-muted)">${sdone}/${sc.length} tamamlandı</span>
      </div>
      <div class="subtask-bar-track" style="height:8px">
        <div class="subtask-bar-fill${spct === 100 ? ' done' : ''}" style="width:${spct}%"></div>
      </div>
      <div style="margin-top:8px;font-size:12px;color:var(--text-muted)">${activeSprint.endDate ? `Bitiş: ${activeSprint.endDate}` : 'Bitiş tarihi belirlenmemiş'}</div>
    </div>`;
    })() : '<p style="color:var(--text-muted);font-size:13px">Aktif sprint yok</p>';

    container.innerHTML = `<div class="dashboard-view">
    <div class="dash-stats">
      <div class="stat-card accent">
        <div class="stat-label">Toplam Görev</div>
        <div class="stat-value">${total}</div>
        <div class="stat-sub">%${donePct} tamamlandı</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-label">Yapılıyor</div>
        <div class="stat-value">${doing}</div>
        <div class="stat-sub">Aktif görevler</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">Geciken</div>
        <div class="stat-value">${overdue.length}</div>
        <div class="stat-sub">Vadesi geçmiş</div>
      </div>
      <div class="stat-card success">
        <div class="stat-label">Story Points</div>
        <div class="stat-value">${totalSP}</div>
        <div class="stat-sub">Toplam tahmin</div>
      </div>
    </div>
    <div class="dash-row">
      <div class="dash-panel">
        <div class="dash-panel-title">🔥 Öncelik Dağılımı</div>
        <div class="pri-bar-row"><div class="pri-bar-label" style="color:var(--pri-high)">Yüksek</div><div class="pri-bar-track"><div class="pri-bar-fill" style="width:${total ? Math.round(high / total * 100) : 0}%;background:var(--pri-high)"></div></div><div class="pri-bar-count">${high}</div></div>
        <div class="pri-bar-row"><div class="pri-bar-label" style="color:var(--pri-med)">Orta</div><div class="pri-bar-track"><div class="pri-bar-fill" style="width:${total ? Math.round(med / total * 100) : 0}%;background:var(--pri-med)"></div></div><div class="pri-bar-count">${med}</div></div>
        <div class="pri-bar-row"><div class="pri-bar-label" style="color:var(--pri-low)">Düşük</div><div class="pri-bar-track"><div class="pri-bar-fill" style="width:${total ? Math.round(low / total * 100) : 0}%;background:var(--pri-low)"></div></div><div class="pri-bar-count">${low}</div></div>
      </div>
      <div class="dash-panel">
        <div class="dash-panel-title">⚠️ Geciken Görevler</div>
        ${overdueRows}
      </div>
    </div>
    <div class="dash-row">
      <div class="dash-panel">
        <div class="dash-panel-title">🚀 Aktif Sprint</div>
        ${sprintHTML}
      </div>
      <div class="dash-panel">
        <div class="dash-panel-title">📌 Epic Özeti</div>
        ${epicRows}
      </div>
    </div>
  </div>`;
}

// ── Gantt view render ────────────────────────────────────
function renderGantt(cards) {
    const container = document.getElementById('ganttView');
    if (!container) return;

    const withDates = cards.filter(c => c.dueDate);
    if (!withDates.length) {
        container.innerHTML = `<div class="gantt-view"><div style="text-align:center;padding:48px;color:var(--text-muted)">Bitiş tarihi olan görev yok. Gantt için görevlere tarih ekleyin.</div></div>`;
        return;
    }

    // Date range: today ± 30 days or min/max of card dates
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const allDates = withDates.map(c => new Date(c.dueDate));
    let minD = new Date(Math.min(...allDates, today));
    let maxD = new Date(Math.max(...allDates, today));
    minD.setDate(minD.getDate() - 2);
    maxD.setDate(maxD.getDate() + 4);

    const days = [];
    for (let d = new Date(minD); d <= maxD; d.setDate(d.getDate() + 1)) days.push(new Date(d));
    const totalDays = days.length;
    const pct = d => (Math.max(0, (new Date(d) - minD)) / ((maxD - minD) || 1)) * 100;
    const todayPct = pct(today);

    const dayHeaders = days.map(d => {
        const isToday = d.toDateString() === today.toDateString();
        return `<div class="gantt-day${isToday ? ' today' : ''}">${d.getDate()}<br><span style="font-size:9px">${d.toLocaleDateString('tr-TR', { month: 'short' })}</span></div>`;
    }).join('');

    const priColor = { high: 'var(--pri-high)', medium: 'var(--pri-med)', low: 'var(--pri-low)' };

    const rows = cards.map(c => {
        if (!c.dueDate) return `<div class="gantt-row">
      <div class="gantt-row-label" onclick="openCardDetail('${c.id}')">${escHtml(c.title.slice(0, 30))}${c.title.length > 30 ? '…' : ''}</div>
      <div class="gantt-row-timeline"><div class="gantt-no-date">Tarih belirlenmemiş</div></div>
    </div>`;

        const barEnd = pct(c.dueDate);
        const barStart = Math.max(0, barEnd - 3);
        const barW = Math.max(1, barEnd - barStart);
        return `<div class="gantt-row">
      <div class="gantt-row-label" onclick="openCardDetail('${c.id}')">${escHtml(c.title.slice(0, 30))}${c.title.length > 30 ? '…' : ''}</div>
      <div class="gantt-row-timeline" style="position:relative">
        <div style="position:absolute;top:0;bottom:0;left:${todayPct.toFixed(1)}%;width:1px;background:var(--accent);opacity:.5;z-index:1"></div>
        <div class="gantt-bar" style="left:${barStart.toFixed(1)}%;width:${barW.toFixed(1)}%;background:${priColor[c.priority]};z-index:2"
             onclick="openCardDetail('${c.id}')" title="${c.title} — ${c.dueDate}">
          ${escHtml(c.title.slice(0, 18))}
        </div>
      </div>
    </div>`;
    }).join('');

    container.innerHTML = `<div class="gantt-view"><div class="gantt-wrap">
    <div class="gantt-header">
      <div class="gantt-label-col">Görev</div>
      <div class="gantt-timeline-header">${dayHeaders}</div>
    </div>
    ${rows}
  </div></div>`;
}

// ── Filter assignee refresh ──────────────────────────────
function refreshAssigneeFilter(cards) {
    const sel = document.getElementById('filterAssignee');
    if (!sel) return;
    const cur = sel.value;
    const names = [...new Set(cards.map(c => c.assignee).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Tüm kişiler</option>' +
        names.map(n => `<option value="${n.toLowerCase()}" ${cur.toLowerCase() === n.toLowerCase() ? 'selected' : ''}>${escHtml(n)}</option>`).join('');
}

// ── Drag & Drop ──────────────────────────────────────────
let dragId = null;

function onDragStart(e) {
    dragId = e.currentTarget.dataset.id;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragId);
    const ghost = e.currentTarget.cloneNode(true);
    ghost.style.cssText = `position:fixed;top:-1000px;left:-1000px;width:${e.currentTarget.offsetWidth}px;opacity:1;box-shadow:0 10px 30px rgba(0,0,0,.2);transform:rotate(1.5deg)`;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, e.offsetX, e.offsetY);
    setTimeout(() => ghost.remove(), 0);
}
function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.col-body').forEach(b => b.classList.remove('drag-over'));
    removePlaceholders();
}
function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
    removePlaceholders();
    const ph = document.createElement('div');
    ph.className = 'drop-placeholder';
    const target = getCardBelow(e.currentTarget, e.clientY);
    target ? e.currentTarget.insertBefore(ph, target) : e.currentTarget.appendChild(ph);
}
function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
    removePlaceholders();
}
function removePlaceholders() {
    document.querySelectorAll('.drop-placeholder').forEach(el => el.remove());
}
function getCardBelow(container, y) {
    return [...container.querySelectorAll('.card:not(.dragging)')]
        .find(c => { const b = c.getBoundingClientRect(); return y < b.top + b.height / 2; }) || null;
}
