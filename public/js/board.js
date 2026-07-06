// ============================================================
//  board.js – shared board rendering and views logic (v1.3.0)
// ============================================================

// ── Label definitions (loaded dynamically) ────────────────
window.LABELS = [];
window.LABEL_MAP = {};

// ── Utilities ────────────────────────────────────────────
function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAssigneeColor(name) {
  if (!name) return '';
  const u = (window.users || []).find(x => x.name === name);
  if (u && u.avatarColor) return u.avatarColor;
  const hue = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg, type = '') {
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  const container = document.getElementById('toastContainer');
  if (container) {
    container.appendChild(el);
    setTimeout(() => el.remove(), 3100);
  } else {
    console.log(`[Toast]: ${msg}`);
  }
}
window.showToast = showToast; // Expose for API errors

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
  const doneSubtasks = subtasks.filter(s => s.done).length;
  const subtaskPct = subtasks.length ? Math.round((doneSubtasks / subtasks.length) * 100) : 0;
  const priLabel = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };
  const labels = (card.labels || []).map(id => window.LABEL_MAP[id]).filter(Boolean);

  const actionsHTML = readonly ? '' : `
    <div class="card-actions">
      <button class="card-btn del" title="Sil" onclick="event.stopPropagation();doDelete('${card.id}')">✕</button>
    </div>`;

  // Effort logic
  const est = card.estimatedEffort;
  const spt = card.spentEffort;
  let effortBadge = '';
  let effortBar = '';

  if (est != null || spt != null) {
    const eVal = est || 0;
    const sVal = spt || 0;
    const over = sVal > eVal && eVal > 0;
    const effortClass = over ? 'effort-over' : 'effort-ok';
    effortBadge = `<span class="effort-badge ${effortClass}" title="Efor: Harcanan / Tahmini">⏱️ ${sVal}/${eVal} sa</span>`;

    if (eVal > 0) {
      const pct = Math.round((sVal / eVal) * 100);
      const barClass = over ? 'over' : (pct === 100 ? 'done' : '');
      effortBar = `
        <div class="effort-progress-bar" title="Efor Tüketimi: %${pct}">
          <div class="effort-progress-track">
            <div class="effort-progress-fill ${barClass}" style="width:${Math.min(100, pct)}%"></div>
          </div>
        </div>`;
    }
  }

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
      <div class="subtask-bar-label"><span>${doneSubtasks}/${subtasks.length} alt görev</span><span>${subtaskPct}%</span></div>
      <div class="subtask-bar-track"><div class="subtask-bar-fill${subtaskPct === 100 ? ' done' : ''}" style="width:${subtaskPct}%"></div></div>
    </div>` : ''}
    
    ${effortBar}

    <div class="card-footer">
      <div class="card-footer-left">
        ${card.key ? `<span class="card-key-badge">${card.key}</span>` : ''}
        ${card.assignee ? `<span class="card-assignee"><span class="assignee-avatar" style="background:${getAssigneeColor(card.assignee)}">${escHtml(initials(card.assignee))}</span>${escHtml(card.assignee)}</span>` : '<span></span>'}
        ${dueBadge(card.dueDate)}
      </div>
      <div class="card-footer-right">
        ${effortBadge}
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
        (q && !card.title.toLowerCase().includes(q) && !(card.desc || '').toLowerCase().includes(q) && !(card.assignee || '').toLowerCase().includes(q) && !(card.key || '').toLowerCase().includes(q)) ||
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
    const labels = (c.labels || []).map(id => window.LABEL_MAP[id]).filter(Boolean);
    const subtasks = c.subtasks || [];
    const done = subtasks.filter(s => s.done).length;
    return `<tr onclick="openCardDetail('${c.id}')" style="cursor:pointer">
      <td><span class="card-key-badge">${c.key || ''}</span></td>
      <td class="list-title-cell">
        ${epic ? `<div><span class="epic-pill" style="background:${epic.color}20;color:${epic.color};font-size:10px;padding:1px 6px;border-radius:20px;font-weight:600">${escHtml(epic.name)}</span></div>` : ''}
        ${escHtml(c.title)}
        ${labels.length ? `<div style="margin-top:4px;display:flex;gap:3px;flex-wrap:wrap">${labels.map(l => `<span class="label-tag" style="background:${l.bg};color:${l.color}">${escHtml(l.name)}</span>`).join('')}</div>` : ''}
      </td>
      <td><span class="col-badge ${colBadge[c.col]}">${colLabel[c.col]}</span></td>
      <td>${c.assignee ? `<span class="card-assignee"><span class="assignee-avatar" style="background:${getAssigneeColor(c.assignee)}">${escHtml(initials(c.assignee))}</span>${escHtml(c.assignee)}</span>` : '—'}</td>
      <td><span class="card-priority-tag pri-${c.priority}" style="display:inline-block;background:${c.priority === 'high' ? 'var(--pri-high-bg)' : c.priority === 'low' ? 'var(--pri-low-bg)' : 'var(--pri-med-bg)'};color:${c.priority === 'high' ? 'var(--pri-high)' : c.priority === 'low' ? 'var(--pri-low)' : 'var(--pri-med)'}">${c.priority === 'high' ? 'Yüksek' : c.priority === 'low' ? 'Düşük' : 'Orta'}</span></td>
      <td>${c.dueDate ? dueBadge(c.dueDate) : '—'}</td>
      <td>${c.storyPoints != null ? `<span class="sp-badge">${c.storyPoints}</span>` : '—'}</td>
      <td>${c.spentEffort != null || c.estimatedEffort != null ? `<span class="effort-badge ${c.spentEffort > c.estimatedEffort ? 'effort-over' : 'effort-ok'}">${c.spentEffort || 0}/${c.estimatedEffort || 0} sa</span>` : '—'}</td>
      <td>${subtasks.length ? `${done}/${subtasks.length}` : '—'}</td>
    </tr>`;
  }).join('');
  container.innerHTML = `<div class="list-view">
    <table class="list-table">
      <thead><tr>
        <th>Anahtar</th><th>Başlık</th><th>Durum</th><th>Kişi</th><th>Öncelik</th><th>Bitiş</th><th>SP</th><th>Efor (H/T)</th><th>Alt Görev</th>
      </tr></thead>
      <tbody>${rows || '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted)">Görev yok</td></tr>'}</tbody>
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
      const over = (c.spentEffort || 0) > (c.estimatedEffort || 0) && (c.estimatedEffort || 0) > 0;
      return `<div class="backlog-row" draggable="true" ondragstart="onBacklogDragStart(event)" ondragend="onBacklogDragEnd(event)" data-id="${c.id}" onclick="openCardDetail('${c.id}')">
        <span class="card-priority-bar" style="position:relative;width:3px;height:16px;border-radius:3px;background:${c.priority === 'high' ? 'var(--pri-high)' : c.priority === 'low' ? 'var(--pri-low)' : 'var(--pri-med)'}"></span>
        <div class="backlog-row-title"><span class="backlog-key">${c.key || ''}</span> ${escHtml(c.title)}</div>
        <div class="backlog-row-meta">
          ${epic ? `<span class="epic-pill" style="background:${epic.color}20;color:${epic.color}">${escHtml(epic.name)}</span>` : ''}
          ${c.spentEffort != null || c.estimatedEffort != null ? `<span class="effort-badge ${over ? 'effort-over' : 'effort-ok'}">⏱️ ${c.spentEffort || 0}/${c.estimatedEffort || 0} sa</span>` : ''}
          ${c.storyPoints != null ? `<span class="sp-badge">${c.storyPoints}</span>` : ''}
          ${dueBadge(c.dueDate)}
          ${c.assignee ? `<span class="card-assignee"><span class="assignee-avatar" style="width:18px;height:18px;font-size:9px;background:${getAssigneeColor(c.assignee)}">${escHtml(initials(c.assignee))}</span></span>` : ''}
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
      <div class="backlog-list" data-sprint-id="${sprint ? sprint.id : ''}" ondragover="onBacklogDragOver(event)" ondragleave="onBacklogDragLeave(event)" ondrop="onBacklogDrop(event)">${rowsHTML}</div>
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
  const doing = cards.filter(c => c.col === 'doing').length;
  const done = cards.filter(c => c.col === 'done').length;
  const high = cards.filter(c => c.priority === 'high').length;
  const med = cards.filter(c => c.priority === 'medium').length;
  const low = cards.filter(c => c.priority === 'low').length;
  const now = new Date();
  const overdue = cards.filter(c => c.dueDate && new Date(c.dueDate) < now && c.col !== 'done');
  const totalSP = cards.reduce((s, c) => (c.storyPoints || 0) + s, 0);
  const donePct = total ? Math.round((done / total) * 100) : 0;

  // Effort totals
  const totalEst = cards.reduce((sum, c) => sum + (c.estimatedEffort || 0), 0);
  const totalSpent = cards.reduce((sum, c) => sum + (c.spentEffort || 0), 0);
  const effortPct = totalEst ? Math.round((totalSpent / totalEst) * 100) : 0;

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
        <div class="stat-label">Story Points</div>
        <div class="stat-value">${totalSP}</div>
        <div class="stat-sub">Toplam tahmin</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-label">Tahmini Efor</div>
        <div class="stat-value">${totalEst} <span style="font-size:14px;color:var(--text-secondary)">sa</span></div>
        <div class="stat-sub">Planlanan efor</div>
      </div>
      <div class="stat-card success">
        <div class="stat-label">Harcanan Efor</div>
        <div class="stat-value">${totalSpent} <span style="font-size:14px;color:var(--text-secondary)">sa</span></div>
        <div class="stat-sub">%${effortPct} tüketildi</div>
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

    // Başlangıç: startDate varsa kullan, yoksa createdAt (oluşturma tarihi)
    const rawStart = c.startDate
      ? new Date(c.startDate)
      : new Date(c.createdAt || Date.now());
    rawStart.setHours(0, 0, 0, 0);

    const clampedStart = new Date(Math.max(rawStart, minD));
    const barStart = pct(clampedStart);
    const barEnd = pct(c.dueDate);
    const barW = Math.max(0.5, barEnd - barStart);

    return `<div class="gantt-row">
      <div class="gantt-row-label" onclick="openCardDetail('${c.id}')">${escHtml(c.title.slice(0, 30))}${c.title.length > 30 ? '…' : ''}</div>
      <div class="gantt-row-timeline" style="position:relative">
        <div style="position:absolute;top:0;bottom:0;left:${todayPct.toFixed(1)}%;width:1px;background:var(--accent);opacity:.5;z-index:1"></div>
        <div class="gantt-bar" style="left:${barStart.toFixed(1)}%;width:${barW.toFixed(1)}%;background:${priColor[c.priority]};z-index:2"
             onclick="openCardDetail('${c.id}')" title="${c.title} &#10;Başlangıç: ${rawStart.toLocaleDateString('tr-TR')} &#10;Bitiş: ${c.dueDate}">
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

// ── Reports view render ──────────────────────────────────
function renderReports(cards, epics = [], sprints = []) {
  const container = document.getElementById('reportsView');
  if (!container) return;

  // 1. Assignee effort allocation calculation
  const assignees = [...new Set(cards.map(c => c.assignee).filter(Boolean))].sort();
  // Include unassigned as "Atanmamış" if there are unassigned cards
  if (cards.some(c => !c.assignee)) {
    assignees.push('');
  }

  const assigneeRows = assignees.map(name => {
    const ac = cards.filter(c => c.assignee === name);
    const doneCount = ac.filter(c => c.col === 'done').length;
    const sp = ac.reduce((sum, c) => sum + (c.storyPoints || 0), 0);
    const est = ac.reduce((sum, c) => sum + (c.estimatedEffort || 0), 0);
    const spent = ac.reduce((sum, c) => sum + (c.spentEffort || 0), 0);
    const dev = spent - est;
    const devClass = dev > 0 ? 'deviation-negative' : (dev < 0 ? 'deviation-positive' : 'deviation-zero');
    const pct = est ? Math.round((spent / est) * 100) : 0;
    const barClass = pct > 100 ? 'over' : (pct === 100 ? 'done' : '');

    return `<tr>
      <td><strong>${escHtml(name || 'Atanmamış')}</strong></td>
      <td>${ac.length} (${doneCount} tamamlandı)</td>
      <td><span class="sp-badge">${sp}</span></td>
      <td>${est} sa</td>
      <td>${spent} sa</td>
      <td><span class="dev-tag ${devClass}">${dev > 0 ? '+' : ''}${dev} sa</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="subtask-bar-track" style="width:60px;height:6px">
            <div class="subtask-bar-fill ${barClass}" style="width:${Math.min(100, pct)}%"></div>
          </div>
          <span style="font-size:11px;font-weight:600">%${pct}</span>
        </div>
      </td>
    </tr>`;
  }).join('');

  // 2. Epic progress and effort calculation
  const epicRows = epics.map(e => {
    const ec = cards.filter(c => c.epicId === e.id);
    const doneCount = ec.filter(c => c.col === 'done').length;
    const pct = ec.length ? Math.round((doneCount / ec.length) * 100) : 0;
    const est = ec.reduce((sum, c) => sum + (c.estimatedEffort || 0), 0);
    const spent = ec.reduce((sum, c) => sum + (c.spentEffort || 0), 0);

    return `<tr>
      <td><span class="epic-pill" style="background:${e.color}20;color:${e.color}">${escHtml(e.name)}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="subtask-bar-track" style="width:80px;height:6px">
            <div class="subtask-bar-fill ${pct === 100 ? 'done' : ''}" style="width:${pct}%"></div>
          </div>
          <span style="font-size:11px;font-weight:600">%${pct} (${doneCount}/${ec.length})</span>
        </div>
      </td>
      <td>${est} sa</td>
      <td>${spent} sa</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Epic yok</td></tr>';

  // 3. Sprint performance and velocity
  const sprintRows = sprints.map(s => {
    const sc = cards.filter(c => c.sprintId === s.id);
    const doneCards = sc.filter(c => c.col === 'done');
    const completedSP = doneCards.reduce((sum, c) => sum + (c.storyPoints || 0), 0);
    const totalSP = sc.reduce((sum, c) => sum + (c.storyPoints || 0), 0);
    const est = sc.reduce((sum, c) => sum + (c.estimatedEffort || 0), 0);
    const spent = sc.reduce((sum, c) => sum + (c.spentEffort || 0), 0);
    
    let statusBadge = s.active 
      ? '<span class="sprint-active-badge">Aktif</span>' 
      : (new Date(s.endDate) < new Date() ? '<span class="status-done-badge">Tamamlandı</span>' : '<span class="status-planned-badge">Planlandı</span>');

    return `<tr>
      <td><strong>${escHtml(s.name)}</strong></td>
      <td>${statusBadge}</td>
      <td>${s.startDate || '?'} / ${s.endDate || '?'}</td>
      <td><strong>${completedSP}</strong> / ${totalSP} SP</td>
      <td>${est} sa</td>
      <td>${spent} sa</td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">Sprint yok</td></tr>';

  // Render HTML structure
  container.innerHTML = `
    <div class="reports-dashboard">
      <!-- Report Header -->
      <div class="reports-header-row no-print">
        <div>
          <h2>📊 Efor ve Proje İlerleme Raporu</h2>
          <p class="reports-subtitle">2026 Çalışma Yılı Efor Dağılımları, Hedef Sapmaları ve Performans Analizi</p>
        </div>
        <div class="reports-actions">
          <button class="btn btn-secondary" onclick="exportToCSV(cards, epics, sprints)">📥 CSV Dışa Aktar</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ PDF / Raporu Yazdır</button>
        </div>
      </div>

      <!-- Printable Only Header -->
      <div class="print-only-header">
        <h1>Tiny Kanban Proje Raporu</h1>
        <p>Tarih: ${new Date().toLocaleDateString('tr-TR')} · Çalışma Dönemi: 2026 Takvim Yılı</p>
        <hr style="margin:16px 0; border:0; border-top:1px solid #ddd">
      </div>

      <!-- Section 1: User Efforts -->
      <div class="reports-card">
        <h3 class="reports-card-title">👥 Kullanıcı Efor ve İş Yükü Dağılımı</h3>
        <table class="reports-table">
          <thead>
            <tr>
              <th>Takım Üyesi</th>
              <th>Görev Sayısı</th>
              <th>Öngörülen Story Points</th>
              <th>Planlanan Efor (Saat)</th>
              <th>Harcanan Efor (Saat)</th>
              <th>Sapma Değeri</th>
              <th>Efor Tüketim Oranı</th>
            </tr>
          </thead>
          <tbody>
            ${assigneeRows}
          </tbody>
        </table>
      </div>

      <div class="reports-row-grid">
        <!-- Section 2: Epics Progress -->
        <div class="reports-card">
          <h3 class="reports-card-title">🏷️ Epic Durumu ve Harcanan Süreler</h3>
          <table class="reports-table">
            <thead>
              <tr>
                <th>Epic Modülü</th>
                <th>İlerleme Durumu</th>
                <th>Tahmini Efor</th>
                <th>Harcanan Efor</th>
              </tr>
            </thead>
            <tbody>
              ${epicRows}
            </tbody>
          </table>
        </div>

        <!-- Section 3: Sprint Performance -->
        <div class="reports-card">
          <h3 class="reports-card-title">⚡ Sprint Hızı (Velocity) ve Efor Takibi</h3>
          <table class="reports-table">
            <thead>
              <tr>
                <th>Sprint Adı</th>
                <th>Durum</th>
                <th>Tarih Aralığı</th>
                <th>Tamamlanan Hız</th>
                <th>Planlanan Efor</th>
                <th>Harcanan Efor</th>
              </tr>
            </thead>
            <tbody>
              ${sprintRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ── CSV Exporter ──────────────────────────────────────────
function exportToCSV(cardsList, epicsList, sprintsList) {
  const headers = ['ID', 'Başlık', 'Durum', 'Kişi', 'Öncelik', 'Story Points', 'Tahmini Efor (Saat)', 'Harcanan Efor (Saat)', 'Başlangıç Tarihi', 'Bitiş Tarihi', 'Epic', 'Sprint'];
  const rows = cardsList.map(c => {
    const epic = epicsList.find(e => e.id === c.epicId)?.name || '—';
    const sprint = sprintsList.find(s => s.id === c.sprintId)?.name || '—';
    const colLabel = { todo: 'Yapılacak', doing: 'Yapılıyor', done: 'Tamamlandı' }[c.col] || c.col;
    const priLabel = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' }[c.priority] || c.priority;
    return [
      c.id,
      c.title,
      colLabel,
      c.assignee || '—',
      priLabel,
      c.storyPoints ?? '0',
      c.estimatedEffort ?? '0',
      c.spentEffort ?? '0',
      c.startDate || '—',
      c.dueDate || '—',
      epic,
      sprint
    ].map(val => `"${String(val).replace(/"/g, '""')}"`);
  });

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
    + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `tiny-kanban-rapor-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.exportToCSV = exportToCSV;

// ── Filter assignee refresh ──────────────────────────────
function refreshAssigneeFilter(cards) {
  const sel = document.getElementById('filterAssignee');
  if (!sel) return;
  const cur = sel.value;
  const names = window.users && window.users.length ? 
    window.users.map(u => u.name) : 
    [...new Set(cards.map(c => c.assignee).filter(Boolean))].sort();
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
window.onDragStart = onDragStart;

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.col-body').forEach(b => b.classList.remove('drag-over'));
  removePlaceholders();
}
window.onDragEnd = onDragEnd;

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
window.onDragOver = onDragOver;

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
  removePlaceholders();
}
window.onDragLeave = onDragLeave;

function removePlaceholders() {
  document.querySelectorAll('.drop-placeholder').forEach(el => el.remove());
}
window.removePlaceholders = removePlaceholders;

function getCardBelow(container, y) {
  return [...container.querySelectorAll('.card:not(.dragging)')]
    .find(c => { const b = c.getBoundingClientRect(); return y < b.top + b.height / 2; }) || null;
}

// Global modal/delete proxies to bind with window actions
async function doDelete(id) {
  const card = cards.find(c => c.id === id);
  if (!card) return;
  if (!confirm(`"${card.title}" silinsin mi?`)) return;
  try {
    await API.deleteCard(id);
    cards = cards.filter(c => c.id !== id);
    renderAll();
    showToast('Silindi');
  } catch {
    showToast('Silinemedi', 'error');
  }
}
window.doDelete = doDelete;

// ── Personal Tasks (Görevlerim) Rendering ────────────────
function renderMyTasksView(cards, epics = []) {
  const myName = (window.currentUser || {}).name || '';
  const myCards = cards.filter(c => c.assignee && c.assignee.toLowerCase() === myName.toLowerCase());
  
  const todoCards = myCards.filter(c => c.col === 'todo');
  const doingCards = myCards.filter(c => c.col === 'doing');
  const doneCards = myCards.filter(c => c.col === 'done');
  
  const total = myCards.length;
  const done = doneCards.length;
  const remaining = total - done;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  
  const totalEl = document.getElementById('myTasksTotal');
  const doneEl = document.getElementById('myTasksDone');
  const remainingEl = document.getElementById('myTasksRemaining');
  const pctEl = document.getElementById('myTasksPct');
  const barEl = document.getElementById('myTasksBarFill');
  
  if (totalEl) totalEl.textContent = `${total} Görev`;
  if (doneEl) doneEl.textContent = `${done} Tamamlandı`;
  if (remainingEl) remainingEl.textContent = `${remaining} Kaldı`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) barEl.style.width = `${pct}%`;
  
  const todoCnt = document.getElementById('myTasksTodoCount');
  const doingCnt = document.getElementById('myTasksDoingCount');
  const doneCnt = document.getElementById('myTasksDoneCount');
  
  if (todoCnt) todoCnt.textContent = todoCards.length;
  if (doingCnt) doingCnt.textContent = doingCards.length;
  if (doneCnt) doneCnt.textContent = doneCards.length;
  
  const renderCol = (elId, list) => {
    const el = document.getElementById(elId);
    if (!el) return;
    if (list.length === 0) {
      el.innerHTML = `
        <div class="empty-state" style="padding:16px;font-size:12px;color:var(--text-muted);text-align:center">
          Görev yok
        </div>`;
    } else {
      el.innerHTML = list.map(c => cardHTML(c, epics, true)).join('');
    }
  };
  
  renderCol('my-tasks-todo', todoCards);
  renderCol('my-tasks-doing', doingCards);
  renderCol('my-tasks-done', doneCards);
}
window.renderMyTasksView = renderMyTasksView;

// ── Backlog Drag & Drop Handlers ──────────────────────────
let backlogDragId = null;

function onBacklogDragStart(e) {
  backlogDragId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('backlog-dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', backlogDragId);
}
window.onBacklogDragStart = onBacklogDragStart;

function onBacklogDragEnd(e) {
  e.currentTarget.classList.remove('backlog-dragging');
  document.querySelectorAll('.backlog-list').forEach(l => l.classList.remove('drag-over'));
}
window.onBacklogDragEnd = onBacklogDragEnd;

function onBacklogDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}
window.onBacklogDragOver = onBacklogDragOver;

function onBacklogDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}
window.onBacklogDragLeave = onBacklogDragLeave;

async function onBacklogDrop(e) {
  e.preventDefault();
  const list = e.currentTarget;
  list.classList.remove('drag-over');
  
  if (!backlogDragId) return;
  const cardId = backlogDragId;
  backlogDragId = null;
  
  const targetSprintId = list.dataset.sprintId || null;
  
  const allCards = typeof cards !== 'undefined' ? cards : (window.cards || []);
  const allSprints = typeof sprints !== 'undefined' ? sprints : (window.sprints || []);
  
  const card = allCards.find(c => c.id === cardId);
  if (!card) return;
  if (card.sprintId === targetSprintId) return;
  
  let sprintName = "Backlog (Sprint'siz)";
  if (targetSprintId) {
    const sprint = allSprints.find(s => s.id === targetSprintId);
    if (sprint) sprintName = sprint.name;
  }
  
  const approved = confirm(`"${card.title}" adlı görevi "${sprintName}" sprintine taşımak istiyor musunuz?`);
  if (!approved) return;
  
  try {
    const upd = await API.updateCard(cardId, { sprintId: targetSprintId });
    Object.assign(card, upd);
    
    if (typeof renderAll === 'function') {
      renderAll();
    } else if (typeof window.renderAll === 'function') {
      window.renderAll();
    }
    showToast('Görev sprinti güncellendi ✓');
  } catch (err) {
    console.error(err);
    showToast('Taşıma işlemi başarısız', 'error');
  }
}
window.onBacklogDrop = onBacklogDrop;
