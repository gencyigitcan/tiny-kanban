// ============================================================
//  board.js – shared board rendering and views logic (v1.3.0)
// ============================================================

// ── Label definitions (loaded dynamically) ────────────────
window.LABELS = [];
window.LABEL_MAP = {};

// ── Default Columns & Workflow Helpers ─────────────────────
const DEFAULT_COLUMNS = [
  { id: 'todo', name: 'Yapılacak', color: '#6b7280', order: 0, isDone: false, wipLimit: 0 },
  { id: 'doing', name: 'Yapılıyor', color: '#f59e0b', order: 1, isDone: false, wipLimit: 0 },
  { id: 'done', name: 'Tamamlandı', color: '#10b981', order: 2, isDone: true, wipLimit: 0 }
];
window.DEFAULT_COLUMNS = DEFAULT_COLUMNS;
window.boardColumns = window.boardColumns || DEFAULT_COLUMNS;

function getColumnInfo(colId) {
  const cols = (window.boardColumns && window.boardColumns.length > 0) ? window.boardColumns : DEFAULT_COLUMNS;
  const found = cols.find(c => c.id === colId);
  if (found) return found;
  const fallbackMap = {
    todo: { id: 'todo', name: 'Yapılacak', color: '#6b7280', isDone: false },
    doing: { id: 'doing', name: 'Yapılıyor', color: '#f59e0b', isDone: false },
    done: { id: 'done', name: 'Tamamlandı', color: '#10b981', isDone: true }
  };
  return fallbackMap[colId] || { id: colId, name: colId, color: '#6366f1', isDone: false };
}
window.getColumnInfo = getColumnInfo;

function isCardDone(card) {
  if (!card) return false;
  const cInfo = getColumnInfo(card.col);
  return !!cInfo.isDone;
}
window.isCardDone = isCardDone;

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

function getIssueTypeInfo(type) {
  const map = {
    task: { id: 'task', name: 'Görev', icon: '📝', color: '#0284c7', bg: 'rgba(2,132,199,0.12)' },
    bug: { id: 'bug', name: 'Hata (Bug)', icon: '🐛', color: '#dc2626', bg: 'rgba(220,38,38,0.12)' },
    story: { id: 'story', name: 'Hikaye (Story)', icon: '📖', color: '#059669', bg: 'rgba(5,150,105,0.12)' },
    incident: { id: 'incident', name: 'Acil (Incident)', icon: '🚨', color: '#b91c1c', bg: 'rgba(185,28,28,0.18)' },
    improvement: { id: 'improvement', name: 'İyileştirme', icon: '💡', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' }
  };
  return map[type] || map.task;
}
window.getIssueTypeInfo = getIssueTypeInfo;

// ── Card HTML ────────────────────────────────────────────
function cardHTML(card, epics = [], readonly = false) {
  const epic = epics.find(e => e.id === card.epicId);
  const subtasks = card.subtasks || [];
  const doneSubtasks = subtasks.filter(s => s.done).length;
  const subtaskPct = subtasks.length ? Math.round((doneSubtasks / subtasks.length) * 100) : 0;
  const labels = (card.labels || []).map(id => window.LABEL_MAP[id]).filter(Boolean);

  // Jira Issue Type Info
  const itInfo = getIssueTypeInfo(card.issueType || 'task');
  const issueTypeIcon = itInfo.icon;
  const issueTypeTitle = itInfo.name;

  // Priority icon & label
  const priIcons = {
    high: '<span class="jira-priority-icon" style="color:#e11d48;font-weight:700;" title="Yüksek Öncelik">▲</span>',
    medium: '<span class="jira-priority-icon" style="color:#d97706;font-weight:700;" title="Orta Öncelik">━</span>',
    low: '<span class="jira-priority-icon" style="color:#059669;font-weight:700;" title="Düşük Öncelik">▼</span>'
  };

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

  // Dependencies badge
  let depBadge = '';
  const allCards = window.cards || [];
  if (card.blockedBy && card.blockedBy.length > 0) {
    const unresolved = card.blockedBy.filter(bId => {
      const bCard = allCards.find(c => c.id === bId);
      return bCard && !isCardDone(bCard);
    });
    if (unresolved.length > 0) {
      depBadge = `<span class="badge-blocked" title="${unresolved.length} bağımlı bilet henüz tamamlanmadı!">⛔ ${unresolved.length} engel</span>`;
    } else {
      depBadge = `<span class="badge-unblocked" title="Tüm bağımlılıklar tamamlandı">✓ Hazır</span>`;
    }
  } else if (card.blocks && card.blocks.length > 0) {
    depBadge = `<span class="badge-blocks" title="${card.blocks.length} bileti engelliyor">⚡ ${card.blocks.length} bekletiyor</span>`;
  }

  return `
  <div class="card pri-${card.priority}${readonly ? ' readonly' : ''}"
       id="card-${card.id}" data-id="${card.id}"
       ${readonly ? '' : `draggable="true" ondragstart="onDragStart(event)" ondragend="onDragEnd(event)"`}
       onclick="openCardDetail('${card.id}')">
    <div class="card-priority-bar"></div>
    ${epic ? `<div class="card-epic"><span class="epic-pill" style="background:${epic.color}20;color:${epic.color};border:1px solid ${epic.color}40;">${escHtml(epic.name)}</span></div>` : ''}
    <div class="card-top">
      <p class="card-title">${escHtml(card.title)}</p>
      ${actionsHTML}
    </div>
    ${card.desc ? `<p class="card-desc">${escHtml(card.desc)}</p>` : ''}
    ${labels.length ? `<div class="card-labels">${labels.map(l => `<span class="label-tag" style="background:${l.bg};color:${l.color}">${escHtml(l.name)}</span>`).join('')}</div>` : ''}
    ${(() => {
      if (!card.customFields || typeof card.customFields !== 'object') return '';
      const allCfs = window.customFields || [];
      const badges = [];
      for (const [cfId, val] of Object.entries(card.customFields)) {
        if (val === null || val === undefined || val === '' || val === false) continue;
        const def = allCfs.find(f => f.id === cfId);
        const name = def ? def.name : cfId;
        let displayVal = val;
        if (def?.type === 'currency') displayVal = `${def.unit || '₺'}${val}`;
        else if (def?.type === 'checkbox') displayVal = '✓';
        else if (def?.unit) displayVal = `${val} ${def.unit}`;
        badges.push(`<span class="card-cf-badge" title="${escHtml(name)}: ${escHtml(String(displayVal))}">${escHtml(name)}: <strong>${escHtml(String(displayVal))}</strong></span>`);
      }
      return badges.length > 0 ? `<div class="card-cf-row">${badges.join('')}</div>` : '';
    })()}
    
    ${subtasks.length ? `
    <div class="subtask-bar">
      <div class="subtask-bar-label"><span>${doneSubtasks}/${subtasks.length} alt görev</span><span>${subtaskPct}%</span></div>
      <div class="subtask-bar-track"><div class="subtask-bar-fill${subtaskPct === 100 ? ' done' : ''}" style="width:${subtaskPct}%"></div></div>
    </div>` : ''}
    
    ${effortBar}

    <div class="card-footer">
      <div class="card-footer-left">
        <span class="jira-type-icon" title="${issueTypeTitle}">${issueTypeIcon}</span>
        ${card.key ? `<span class="jira-card-key">${card.key}</span>` : ''}
        ${card.assignee ? `<span class="card-assignee"><span class="assignee-avatar" style="background:${getAssigneeColor(card.assignee)}" title="${escHtml(card.assignee)}">${escHtml(initials(card.assignee))}</span>${escHtml(card.assignee)}</span>` : '<span class="card-assignee unassigned" style="color:var(--text-muted);font-size:11px;">👤 Atanmamış</span>'}
        ${dueBadge(card.dueDate)}
        ${depBadge}
      </div>
      <div class="card-footer-right">
        ${effortBadge}
        ${card.storyPoints != null ? `<span class="sp-badge" title="Story Points">${card.storyPoints}</span>` : ''}
        ${priIcons[card.priority] || ''}
      </div>
    </div>
  </div>`;
}

// ── Card Filter Helper ────────────────────────────────────
window._quickFilterOnlyMine = false;
window._quickFilterRecent = false;

function cardMatchesGlobalFilters(c, options = { checkSprint: true }) {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const fa = (document.getElementById('filterAssignee')?.value || '').toLowerCase().trim();
  const fe = (document.getElementById('filterEpic')?.value || '').trim();
  const fp = (document.getElementById('filterPriority')?.value || '').trim();
  const fs = (document.getElementById('filterSprint')?.value || 'active').trim();
  const allSprints = window.sprints || [];
  const activeSprint = allSprints.find(s => s.active);

  // 0. Quick filter toggles (Jira standard)
  if (window._quickFilterOnlyMine) {
    const meName = (window.currentUser?.name || '').toLowerCase().trim();
    const meUser = (window.currentUser?.username || '').toLowerCase().trim();
    const cAss = (c.assignee || '').toLowerCase().trim();
    if (!cAss || (cAss !== meName && cAss !== meUser)) return false;
  }

  if (window._quickFilterRecent) {
    const twoDaysAgo = Date.now() - (48 * 3600 * 1000);
    const cTime = c.updatedAt || c.createdAt || 0;
    if (cTime < twoDaysAgo) return false;
  }

  // 1. Sprint check (for board)
  if (options.checkSprint && fs && fs !== 'all') {
    if (fs === 'active') {
      if (activeSprint && c.sprintId !== activeSprint.id) return false;
    } else if (c.sprintId !== fs) {
      return false;
    }
  }

  // 2. Assignee / Kişi check
  if (fa) {
    if (fa === '__unassigned__') {
      if (c.assignee) return false;
    } else {
      const cardAssignee = (c.assignee || '').trim().toLowerCase();
      if (cardAssignee !== fa) return false;
    }
  }

  // 3. Epic / Proje check
  if (fe) {
    if (fe === '__none__') {
      if (c.epicId) return false;
    } else {
      if (c.epicId !== fe) return false;
    }
  }

  // 4. Priority check
  if (fp && c.priority !== fp) return false;

  // 4b. Issue Type check
  const fit = (document.getElementById('filterIssueType')?.value || '').trim();
  if (fit && (c.issueType || 'task') !== fit) return false;

  // 5. Search query
  if (q) {
    const t = (c.title || '').toLowerCase();
    const d = (c.desc || '').toLowerCase();
    const a = (c.assignee || '').toLowerCase();
    const k = (c.key || '').toLowerCase();
    if (!t.includes(q) && !d.includes(q) && !a.includes(q) && !k.includes(q)) return false;
  }

  return true;
}
window.cardMatchesGlobalFilters = cardMatchesGlobalFilters;

// ── Board render ─────────────────────────────────────────
function toggleColumnMenu(e, colId) {
  e.stopPropagation();
  const menu = document.getElementById('colMenu-' + colId);
  const isOpen = menu?.classList.contains('show');
  document.querySelectorAll('.col-dropdown-menu').forEach(m => m.classList.remove('show'));
  if (!isOpen && menu) {
    menu.classList.add('show');
  }
}
window.toggleColumnMenu = toggleColumnMenu;

document.addEventListener('click', () => {
  document.querySelectorAll('.col-dropdown-menu').forEach(m => m.classList.remove('show'));
});

function openCreateColumnModal() {
  const canManage = window.currentUser?.role === 'superadmin' || window.currentUser?.role === 'admin';
  if (!canManage) {
    showToast('Kolon yönetimi için yönetici yetkisi gereklidir', 'warn');
    return;
  }
  document.getElementById('columnModalTitle').textContent = '➕ Yeni Kolon Ekle';
  document.getElementById('columnEditId').value = '';
  document.getElementById('columnName').value = '';
  document.getElementById('columnColor').value = '#6366f1';
  document.getElementById('columnWipLimit').value = '0';
  document.getElementById('columnIsDone').checked = false;
  openModal('columnModal');
  document.getElementById('columnName').focus();
}
window.openCreateColumnModal = openCreateColumnModal;

function openEditColumnModal(colId) {
  const canManage = window.currentUser?.role === 'superadmin' || window.currentUser?.role === 'admin';
  if (!canManage) {
    showToast('Kolon yönetimi için yönetici yetkisi gereklidir', 'warn');
    return;
  }
  const cols = window.boardColumns || DEFAULT_COLUMNS;
  const col = cols.find(c => c.id === colId);
  if (!col) return;
  document.getElementById('columnModalTitle').textContent = `✏️ '${col.name}' Kolonunu Düzenle`;
  document.getElementById('columnEditId').value = col.id;
  document.getElementById('columnName').value = col.name;
  document.getElementById('columnColor').value = col.color || '#6366f1';
  document.getElementById('columnWipLimit').value = col.wipLimit || 0;
  document.getElementById('columnIsDone').checked = !!col.isDone;
  openModal('columnModal');
  document.getElementById('columnName').focus();
}
window.openEditColumnModal = openEditColumnModal;

async function saveColumnSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const id = document.getElementById('columnEditId').value;
  const name = document.getElementById('columnName').value.trim();
  const color = document.getElementById('columnColor').value;
  const wipLimit = parseInt(document.getElementById('columnWipLimit').value, 10) || 0;
  const isDone = document.getElementById('columnIsDone').checked;

  if (!name) {
    showToast('Kolon adı boş olamaz', 'warn');
    return;
  }

  try {
    if (id) {
      await API.updateColumn(id, { name, color, wipLimit, isDone });
      showToast('Kolon güncellendi ✓');
    } else {
      await API.createColumn({ name, color, wipLimit, isDone });
      showToast('Yeni kolon eklendi ✓');
    }
    window.boardColumns = await API.getColumns();
    closeModal('columnModal');
    if (typeof renderAll === 'function') renderAll();
  } catch (err) {
    showToast(err.message || 'Kolon kaydedilemedi', 'error');
  }
}
window.saveColumnSubmit = saveColumnSubmit;

async function moveColumnAction(colId, direction) {
  const cols = [...(window.boardColumns || DEFAULT_COLUMNS)];
  const idx = cols.findIndex(c => c.id === colId);
  if (idx === -1) return;
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= cols.length) return;

  const temp = cols[idx];
  cols[idx] = cols[targetIdx];
  cols[targetIdx] = temp;

  const columnIds = cols.map(c => c.id);
  try {
    await API.reorderColumns(columnIds);
    window.boardColumns = await API.getColumns();
    if (typeof renderAll === 'function') renderAll();
  } catch (err) {
    showToast(err.message || 'Kolon sıralanamadı', 'error');
  }
}
window.moveColumnAction = moveColumnAction;

async function deleteColumnAction(colId) {
  const cols = window.boardColumns || DEFAULT_COLUMNS;
  if (cols.length <= 1) {
    showToast('Panoda en az 1 kolon bulunmalıdır. Tek kolon silinemez.', 'warn');
    return;
  }
  const col = cols.find(c => c.id === colId);
  if (!col) return;

  const colCards = (window.cards || []).filter(c => c.col === colId);
  const otherCols = cols.filter(c => c.id !== colId);
  const fallbackCol = otherCols[0];

  const confirmMsg = colCards.length > 0 
    ? `"${col.name}" kolonu silinsin mi?\n\nBu kolondaki ${colCards.length} görev "${fallbackCol.name}" kolonuna aktarılacaktır.`
    : `"${col.name}" kolonunu silmek istediğinize emin misiniz?`;

  const approved = await showConfirm(confirmMsg, 'Kolonu Sil');
  if (!approved) return;

  try {
    await API.deleteColumn(colId, fallbackCol.id);
    window.boardColumns = await API.getColumns();
    window.cards = await API.getCards();
    if (typeof cards !== 'undefined') cards = window.cards;
    if (typeof renderAll === 'function') renderAll();
    showToast(`"${col.name}" kolonu silindi`);
  } catch (err) {
    showToast(err.message || 'Kolon silinemedi', 'error');
  }
}
window.deleteColumnAction = deleteColumnAction;

// ── Custom Fields Management (Monday & Jira) ──────────────
async function openCustomFieldsModal() {
  const canManage = window.currentUser?.role === 'superadmin' || window.currentUser?.role === 'admin';
  if (!canManage) {
    showToast('Özel alanları yönetmek için yönetici yetkisi gereklidir', 'warn');
    return;
  }
  await refreshCustomFieldsList();
  openModal('customFieldsModal');
}
window.openCustomFieldsModal = openCustomFieldsModal;

async function refreshCustomFieldsList() {
  try {
    const fields = await API.getCustomFields();
    window.customFields = Array.isArray(fields) ? fields : [];
    renderCustomFieldsList();
  } catch (err) {
    console.error('Failed to load custom fields:', err);
  }
}
window.refreshCustomFieldsList = refreshCustomFieldsList;

function renderCustomFieldsList() {
  const container = document.getElementById('customFieldsList');
  if (!container) return;
  const fields = window.customFields || [];
  if (fields.length === 0) {
    container.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px;text-align:center;">Henüz tanımlanmış özel alan bulunmuyor.</div>';
    return;
  }
  const typeIcons = {
    text: '📝 Metin',
    number: '🔢 Sayı',
    currency: '💰 Para',
    select: '📋 Liste',
    checkbox: '☑️ Onay'
  };
  container.innerHTML = fields.map(f => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;border-bottom:1px solid var(--border);gap:8px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-weight:600;font-size:13px;">${escHtml(f.name)}</span>
        <span style="font-size:11px;color:var(--text-muted);background:var(--surface-2);padding:2px 6px;border-radius:4px;">${typeIcons[f.type] || f.type}${f.unit ? ` (${escHtml(f.unit)})` : ''}</span>
      </div>
      <button type="button" class="btn btn-danger btn-xs" onclick="deleteCustomField('${f.id}')" title="Alanı Sil">Sil</button>
    </div>
  `).join('');
}
window.renderCustomFieldsList = renderCustomFieldsList;

function onCustomFieldTypeChange() {
  const type = document.getElementById('newCfType')?.value;
  const unitRow = document.getElementById('newCfUnitRow');
  const optsRow = document.getElementById('newCfOptionsRow');
  if (unitRow) unitRow.style.display = (type === 'currency' || type === 'number') ? 'flex' : 'none';
  if (optsRow) optsRow.style.display = (type === 'select') ? 'flex' : 'none';
}
window.onCustomFieldTypeChange = onCustomFieldTypeChange;

async function addCustomFieldSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('newCfName')?.value.trim();
  const type = document.getElementById('newCfType')?.value;
  const unit = document.getElementById('newCfUnit')?.value.trim();
  const rawOpts = document.getElementById('newCfOptions')?.value.trim();
  const options = rawOpts ? rawOpts.split(',').map(s => s.trim()).filter(Boolean) : [];

  if (!name) {
    showToast('Alan adı boş olamaz', 'warn');
    return;
  }

  try {
    await API.createCustomField({ name, type, unit, options });
    showToast('Özel alan eklendi ✓');
    document.getElementById('newCfName').value = '';
    document.getElementById('newCfUnit').value = '';
    document.getElementById('newCfOptions').value = '';
    await refreshCustomFieldsList();
    if (typeof renderAll === 'function') renderAll();
  } catch (err) {
    showToast('Alan eklenemedi: ' + (err.message || 'Hata'), 'error');
  }
}
window.addCustomFieldSubmit = addCustomFieldSubmit;

async function deleteCustomField(id) {
  if (!confirm('Bu özel alanı silmek istediğinize emin misiniz? Biletlerdeki bu alana ait veriler temizlenecektir.')) return;
  try {
    await API.deleteCustomField(id);
    showToast('Özel alan silindi');
    await refreshCustomFieldsList();
    if (typeof renderAll === 'function') renderAll();
  } catch (err) {
    showToast('Silinemedi: ' + (err.message || 'Hata'), 'error');
  }
}
window.deleteCustomField = deleteCustomField;

function renderBoard(cards, epics = [], readonly = false) {
  const container = document.getElementById('boardColumnsContainer');
  if (!container) return;

  const cols = (window.boardColumns && window.boardColumns.length > 0) ? window.boardColumns : DEFAULT_COLUMNS;
  const canManage = window.currentUser?.role === 'superadmin' || window.currentUser?.role === 'admin';

  // Responsive columns fit: 1-4 columns stretch to fit screen, >4 columns allow horizontal scroll without squashing
  container.classList.toggle('cols-fit', cols.length <= 4);
  container.setAttribute('data-col-count', cols.length);

  // Update count badge & toolbar button visibility
  const countBadge = document.getElementById('boardColCountBadge');
  if (countBadge) countBadge.textContent = `${cols.length} Kolon`;

  const btnAddCol = document.getElementById('btnAddNewColumn');
  if (btnAddCol) btnAddCol.style.display = canManage ? 'inline-flex' : 'none';
  const btnManageCf = document.getElementById('btnManageCustomFields');
  if (btnManageCf) btnManageCf.style.display = canManage ? 'inline-flex' : 'none';

  // Check if container structure matches current columns
  const existingColIds = Array.from(container.querySelectorAll('.column')).map(el => el.dataset.col);
  const targetColIds = cols.map(c => c.id);
  const needsRebuild = existingColIds.length !== targetColIds.length || !existingColIds.every((id, idx) => id === targetColIds[idx]);

  if (needsRebuild) {
    container.innerHTML = cols.map((col, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === cols.length - 1;
      const menuHTML = canManage ? `
        <div class="col-header-menu-wrap" style="position:relative;">
          <button type="button" class="col-menu-btn" onclick="toggleColumnMenu(event, '${col.id}')" title="Kolon Seçenekleri">⋮</button>
          <div class="col-dropdown-menu" id="colMenu-${col.id}">
            <button type="button" class="col-dropdown-item" onclick="openEditColumnModal('${col.id}')">✏️ Düzenle</button>
            ${!isFirst ? `<button type="button" class="col-dropdown-item" onclick="moveColumnAction('${col.id}', -1)">⬅️ Sola Taşı</button>` : ''}
            ${!isLast ? `<button type="button" class="col-dropdown-item" onclick="moveColumnAction('${col.id}', 1)">➡️ Sağa Taşı</button>` : ''}
            <button type="button" class="col-dropdown-item danger" onclick="deleteColumnAction('${col.id}')">🗑️ Sil</button>
          </div>
        </div>
      ` : '';

      return `
        <section class="column" data-col="${col.id}">
          <div class="col-header">
            <div class="col-header-top">
              <div class="col-title-wrap">
                <span class="col-dot" style="background:${col.color || '#6366f1'}"></span>
                <span class="col-title">${escHtml(col.name).toUpperCase()}</span>
                ${readonly ? '' : `<button type="button" class="col-quick-plus-btn" onclick="openCardDetail(null, '${col.id}')" title="Yeni ticket ekle">✚</button>`}
              </div>
              <div class="col-header-right">
                <span class="col-count" data-count="${col.id}">0</span>
                ${menuHTML}
              </div>
            </div>
          </div>
          <div class="col-body" id="col-${col.id}" data-col="${col.id}" ondragover="onDragOver(event)" ondrop="onDrop(event)" ondragleave="onDragLeave(event)">
            <div class="empty-state">
              <div class="empty-icon">${col.isDone ? '✅' : '📋'}</div>
              <div>${col.isDone ? 'Tamamlanan görevler burada' : 'Görev yok'}</div>
            </div>
          </div>
          ${readonly ? '' : `
          <div class="col-footer-actions">
            <button type="button" class="col-add-ticket-btn" onclick="openCardDetail(null, '${col.id}')">
              ✚ Yeni Ticket Ekle
            </button>
          </div>`}
        </section>
      `;
    }).join('');
  }

  const fa = (document.getElementById('filterAssignee')?.value || '').toLowerCase().trim();
  const fe = (document.getElementById('filterEpic')?.value || '').trim();
  const fp = (document.getElementById('filterPriority')?.value || '').trim();
  const fit = (document.getElementById('filterIssueType')?.value || '').trim();
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const fs = document.getElementById('filterSprint')?.value || 'active';
  const allSprints = window.sprints || [];
  const activeSprint = allSprints.find(s => s.active);

  const hasFilter = !!(fa || fe || fp || fit || q);

  cols.forEach(col => {
    const body = document.getElementById('col-' + col.id);
    if (!body) return;
    body.querySelectorAll('.card').forEach(el => el.remove());
    const emptyState = body.querySelector('.empty-state');
    
    // Total cards in this sprint & column
    const sprintColCards = cards.filter(c => {
      if (c.col !== col.id) return false;
      if (!fs || fs === 'all') return true;
      if (fs === 'active') {
        if (activeSprint) return c.sprintId === activeSprint.id;
        return true;
      }
      return c.sprintId === fs;
    });

    // Cards matching all filters (person, project, priority, search)
    const visibleCards = sprintColCards.filter(c => cardMatchesGlobalFilters(c, { checkSprint: false }));

    const frag = document.createDocumentFragment();
    const tmp = document.createElement('div');
    visibleCards.forEach(card => {
      tmp.innerHTML = cardHTML(card, epics, readonly);
      const el = tmp.firstElementChild;
      if (el) frag.appendChild(el);
    });
    body.appendChild(frag);

    if (emptyState) {
      emptyState.style.display = visibleCards.length === 0 ? 'flex' : 'none';
      const txt = emptyState.querySelector('div:not(.empty-icon)');
      if (txt) {
        if (visibleCards.length === 0 && hasFilter) {
          txt.textContent = 'Filtreye uygun görev yok';
        } else {
          txt.textContent = col.isDone ? 'Tamamlanan görevler burada' : 'Görev yok';
        }
      }
    }

    const cnt = document.querySelector(`[data-count="${col.id}"]`);
    if (cnt) {
      const wipLimit = col.wipLimit || 0;
      const isExceeded = wipLimit > 0 && sprintColCards.length > wipLimit;
      if (wipLimit > 0) {
        cnt.className = `col-wip-badge ${isExceeded ? 'wip-exceeded' : ''}`;
        cnt.title = isExceeded ? `WIP Limiti aşıldı! (${sprintColCards.length}/${wipLimit})` : `WIP Limiti: ${sprintColCards.length}/${wipLimit}`;
        if (hasFilter && visibleCards.length !== sprintColCards.length) {
          cnt.innerHTML = `${visibleCards.length} <span style="font-size:10px;font-weight:400;opacity:0.75">/ ${sprintColCards.length} (Max ${wipLimit})</span>`;
        } else {
          cnt.textContent = `${sprintColCards.length} / ${wipLimit}`;
        }
      } else {
        cnt.className = 'col-count';
        cnt.removeAttribute('title');
        if (hasFilter && visibleCards.length !== sprintColCards.length) {
          cnt.innerHTML = `${visibleCards.length} <span style="font-size:11px;font-weight:400;opacity:0.65">/ ${sprintColCards.length}</span>`;
        } else {
          cnt.textContent = visibleCards.length;
        }
      }
    }
  });

  renderQuickFilterBar(cards, epics);
}

// ── List view render ─────────────────────────────────────
window._listFilter = window._listFilter || 'current';
function setListFilter(filter) {
  window._listFilter = filter;
  if (typeof renderAll === 'function') renderAll();
}
window.setListFilter = setListFilter;

function renderListView(cards, epics = []) {
  const container = document.getElementById('listView');
  if (!container) return;
  
  const allSprints = window.sprints || [];
  const activeSprintIdx = allSprints.findIndex(s => s.active);
  const pastSprintIds = new Set(allSprints.slice(0, activeSprintIdx > 0 ? activeSprintIdx : 0).map(s => s.id));
  const futureSprintIds = new Set(allSprints.slice(activeSprintIdx >= 0 ? activeSprintIdx : 0).map(s => s.id));
  const activeSprint = allSprints.find(s => s.active);

  let baseCards = cards;
  if (window._listFilter === 'current') {
    baseCards = cards.filter(c => !c.sprintId || futureSprintIds.has(c.sprintId));
  } else if (window._listFilter === 'active') {
    baseCards = cards.filter(c => activeSprint && c.sprintId === activeSprint.id);
  } else if (window._listFilter === 'past') {
    baseCards = cards.filter(c => pastSprintIds.has(c.sprintId));
  } else if (window._listFilter === 'backlog') {
    baseCards = cards.filter(c => !c.sprintId);
  }

  // Filter by person, project, priority, and search!
  const filteredCards = baseCards.filter(c => cardMatchesGlobalFilters(c, { checkSprint: false }));

  const fa = (document.getElementById('filterAssignee')?.value || '').trim();
  const fe = (document.getElementById('filterEpic')?.value || '').trim();
  const fp = (document.getElementById('filterPriority')?.value || '').trim();
  const q = (document.getElementById('searchInput')?.value || '').trim();
  const hasFilter = !!(fa || fe || fp || q);

  const controlsHTML = `
    <div class="list-view-controls">
      <div class="list-filter-group">
        <button type="button" class="list-filter-btn ${window._listFilter === 'current' ? 'active' : ''}" onclick="setListFilter('current')">🎯 Aktif & Gelecek (Eylül 2026+)</button>
        <button type="button" class="list-filter-btn ${window._listFilter === 'active' ? 'active' : ''}" onclick="setListFilter('active')">⚡ Aktif Sprint (Sprint 37)</button>
        <button type="button" class="list-filter-btn ${window._listFilter === 'past' ? 'active' : ''}" onclick="setListFilter('past')">🕒 Geçmiş / Tamamlananlar</button>
        <button type="button" class="list-filter-btn ${window._listFilter === 'backlog' ? 'active' : ''}" onclick="setListFilter('backlog')">📁 Sprintsiz Backlog</button>
        <button type="button" class="list-filter-btn ${window._listFilter === 'all' ? 'active' : ''}" onclick="setListFilter('all')">🌐 Tüm Görevler (${cards.length})</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${hasFilter ? `<span style="font-size:12px;font-weight:600;color:var(--accent);">🎯 Filtrelendi: ${filteredCards.length} / ${baseCards.length}</span>` : `<span style="font-size:12px;color:var(--text-muted);">${filteredCards.length} görev</span>`}
        <button type="button" class="btn btn-sm btn-primary" onclick="openCardDetail(null)" style="font-size:12px;">✚ Yeni Ticket Ekle</button>
      </div>
    </div>
  `;

  const rows = filteredCards.map(c => {
    const epic = epics.find(e => e.id === c.epicId);
    const sprintObj = allSprints.find(s => s.id === c.sprintId);
    const labels = (c.labels || []).map(id => window.LABEL_MAP[id]).filter(Boolean);
    const subtasks = c.subtasks || [];
    const done = subtasks.filter(s => s.done).length;
    const colInfo = getColumnInfo(c.col);

    let depTag = '';
    if (c.blockedBy && c.blockedBy.length > 0) {
      const unresolved = c.blockedBy.filter(bId => {
        const bCard = cards.find(x => x.id === bId);
        return bCard && !isCardDone(bCard);
      });
      if (unresolved.length > 0) {
        depTag = `<span class="badge-blocked" style="font-size:9px;" title="${unresolved.length} bilet bekliyor!">⛔ ${unresolved.length} engel</span>`;
      }
    }

    return `<tr onclick="openCardDetail('${c.id}')" style="cursor:pointer">
      <td><span class="card-key-badge">${c.key || ''}</span></td>
      <td class="list-title-cell">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px;">
          ${epic ? `<span class="epic-pill" style="background:${epic.color}20;color:${epic.color};font-size:10px;padding:1px 6px;border-radius:20px;font-weight:600">${escHtml(epic.name)}</span>` : ''}
          ${sprintObj ? `<span class="sprint-tag" style="background:rgba(99,102,241,0.1);color:var(--accent);font-size:10px;padding:1px 6px;border-radius:12px;">${sprintObj.active ? '🟢 ' : ''}${escHtml(sprintObj.name)}</span>` : '<span style="font-size:10px;color:var(--text-muted)">Backlog</span>'}
          ${depTag}
        </div>
        ${escHtml(c.title)}
        ${labels.length ? `<div style="margin-top:4px;display:flex;gap:3px;flex-wrap:wrap">${labels.map(l => `<span class="label-tag" style="background:${l.bg};color:${l.color}">${escHtml(l.name)}</span>`).join('')}</div>` : ''}
      </td>
      <td><span class="col-badge" style="background:${colInfo.color}22;color:${colInfo.color};border:1px solid ${colInfo.color}55;font-weight:600;padding:2px 8px;border-radius:12px;font-size:11px;">${escHtml(colInfo.name)}</span></td>
      <td>${c.assignee ? `<span class="card-assignee"><span class="assignee-avatar" style="background:${getAssigneeColor(c.assignee)}">${escHtml(initials(c.assignee))}</span>${escHtml(c.assignee)}</span>` : '—'}</td>
      <td><span class="card-priority-tag pri-${c.priority}" style="display:inline-block;background:${c.priority === 'high' ? 'var(--pri-high-bg)' : c.priority === 'low' ? 'var(--pri-low-bg)' : 'var(--pri-med-bg)'};color:${c.priority === 'high' ? 'var(--pri-high)' : c.priority === 'low' ? 'var(--pri-low)' : 'var(--pri-med)'}">${c.priority === 'high' ? 'Yüksek' : c.priority === 'low' ? 'Düşük' : 'Orta'}</span></td>
      <td>${c.dueDate ? dueBadge(c.dueDate) : '—'}</td>
      <td>${c.storyPoints != null ? `<span class="sp-badge">${c.storyPoints}</span>` : '—'}</td>
      <td>${c.spentEffort != null || c.estimatedEffort != null ? `<span class="effort-badge ${c.spentEffort > c.estimatedEffort ? 'effort-over' : 'effort-ok'}">${c.spentEffort || 0}/${c.estimatedEffort || 0} sa</span>` : '—'}</td>
      <td>${subtasks.length ? `${done}/${subtasks.length}` : '—'}</td>
    </tr>`;
  }).join('');

  container.innerHTML = `<div class="list-view">
    ${controlsHTML}
    <table class="list-table">
      <thead><tr>
        <th>Anahtar</th><th>Başlık & Sprint</th><th>Durum</th><th>Kişi</th><th>Öncelik</th><th>Bitiş</th><th>SP</th><th>Efor (H/T)</th><th>Alt Görev</th>
      </tr></thead>
      <tbody>${rows || `<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted)">${hasFilter ? 'Seçili filtreye uygun görev bulunamadı' : 'Görev yok'}</td></tr>`}</tbody>
    </table>
  </div>`;
}

// ── Backlog view render ──────────────────────────────────
window._showPastSprints = window._showPastSprints || false;

function togglePastSprints() {
  window._showPastSprints = !window._showPastSprints;
  if (typeof renderAll === 'function') renderAll();
}
window.togglePastSprints = togglePastSprints;

function scrollToActiveSprint() {
  const el = document.getElementById('backlog-active-sprint');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('pulse-highlight');
    setTimeout(() => el.classList.remove('pulse-highlight'), 1200);
  }
}
window.scrollToActiveSprint = scrollToActiveSprint;

function renderBacklogView(cards, sprints, epics = []) {
  const container = document.getElementById('backlogView');
  if (!container) return;

  const fa = (document.getElementById('filterAssignee')?.value || '').trim();
  const fe = (document.getElementById('filterEpic')?.value || '').trim();
  const fp = (document.getElementById('filterPriority')?.value || '').trim();
  const q = (document.getElementById('searchInput')?.value || '').trim();
  const hasFilter = !!(fa || fe || fp || q);

  const filteredCards = cards.filter(c => cardMatchesGlobalFilters(c, { checkSprint: false }));

  function sprintGroup(sprint, sprintCards, isExtraActiveHighlight = false) {
    const isActive = sprint && sprint.active;
    const totalSP = sprintCards.reduce((acc, c) => acc + (c.storyPoints || 0), 0);
    const rowsHTML = sprintCards.map(c => {
      const epic = epics.find(e => e.id === c.epicId);
      const over = (c.spentEffort || 0) > (c.estimatedEffort || 0) && (c.estimatedEffort || 0) > 0;
      return `<div class="backlog-row" draggable="true" ondragstart="onBacklogDragStart(event)" ondragend="onBacklogDragEnd(event)" data-id="${c.id}" onclick="openCardDetail('${c.id}')">
        <span class="card-priority-bar" style="position:relative;width:3px;height:16px;border-radius:3px;background:${c.priority === 'high' ? 'var(--pri-high)' : c.priority === 'low' ? 'var(--pri-low)' : 'var(--pri-med)'}"></span>
        <div class="backlog-row-title"><span class="backlog-key">${c.key || ''}</span> ${escHtml(c.title)}</div>
        <div class="backlog-row-meta">
          ${epic ? `<span class="epic-pill" style="background:${epic.color}20;color:${epic.color}">${escHtml(epic.name)}</span>` : ''}
          ${c.spentEffort != null || c.estimatedEffort != null ? `<span class="effort-badge ${over ? 'effort-over' : 'effort-ok'}">⏱️ ${c.spentEffort || 0}/${c.estimatedEffort || 0} sa</span>` : ''}
          ${c.storyPoints != null ? `<span class="sp-badge">${c.storyPoints} SP</span>` : ''}
          ${dueBadge(c.dueDate)}
          ${c.assignee ? `<span class="card-assignee"><span class="assignee-avatar" style="width:18px;height:18px;font-size:9px;background:${getAssigneeColor(c.assignee)}">${escHtml(initials(c.assignee))}</span></span>` : ''}
        </div>
      </div>`;
    }).join('') || `<div class="backlog-empty">${hasFilter ? 'Seçili filtreye uygun görev yok' : 'Bu sprint\'te görev yok'}</div>`;

    const name = sprint ? sprint.name : 'Backlog (Sprint\'siz)';
    const dates = sprint?.startDate && sprint?.endDate ? `${sprint.startDate} → ${sprint.endDate}` : '';
    const groupCls = isExtraActiveHighlight ? 'backlog-sprint-group backlog-sprint-active-card' : 'backlog-sprint-group';
    const groupId = isActive ? 'id="backlog-active-sprint"' : (sprint ? `id="backlog-sprint-${sprint.id}"` : 'id="backlog-unassigned"');

    return `<div class="${groupCls}" ${groupId}>
      <div class="backlog-sprint-header">
        <div class="backlog-sprint-info">
          <span class="backlog-sprint-name">${escHtml(name)}</span>
          ${isActive ? `<span class="sprint-active-badge">🟢 Aktif Sprint (Eylül 2026)</span>` : ''}
          ${dates ? `<span class="sprint-dates">📅 ${dates}</span>` : ''}
          ${totalSP > 0 ? `<span class="sprint-total-sp" style="font-size:11px;font-weight:600;color:var(--accent);background:rgba(99,102,241,0.1);padding:2px 8px;border-radius:10px;">⚡ Toplam: ${totalSP} SP</span>` : ''}
        </div>
        <div class="backlog-sprint-actions">
          ${sprint && !isActive ? `<button class="btn btn-sm btn-secondary" onclick="activateSprint('${sprint.id}')">Aktif Yap</button>` : ''}
          <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();openCardDetail(null)" style="padding:4px 8px;font-size:11px;" title="Bu sprinte yeni ticket ekle">✚ Ticket Ekle</button>
          <span style="font-size:12px;color:var(--text-muted);font-weight:600">${sprintCards.length} görev</span>
        </div>
      </div>
      <div class="backlog-list" data-sprint-id="${sprint ? sprint.id : ''}" ondragover="onBacklogDragOver(event)" ondragleave="onBacklogDragLeave(event)" ondrop="onBacklogDrop(event)">${rowsHTML}</div>
    </div>`;
  }

  // Find active sprint
  let activeSprintIdx = sprints.findIndex(s => s.active);
  if (activeSprintIdx === -1 && sprints.length) {
    activeSprintIdx = 0;
  }

  let pastSprints = [];
  let activeSprint = null;
  let futureSprints = [];

  if (activeSprintIdx !== -1) {
    pastSprints = sprints.slice(0, activeSprintIdx);
    activeSprint = sprints[activeSprintIdx];
    futureSprints = sprints.slice(activeSprintIdx + 1);
  } else {
    futureSprints = sprints;
  }

  const unassigned = filteredCards.filter(c => !c.sprintId);
  const pastCardsCount = pastSprints.reduce((acc, s) => acc + filteredCards.filter(c => c.sprintId === s.id).length, 0);

  // Build Past Sprints Collapsible Bar
  let pastHTML = '';
  if (pastSprints.length > 0) {
    let pastListHTML = '';
    pastSprints.forEach(s => {
      const sc = filteredCards.filter(c => c.sprintId === s.id);
      pastListHTML += sprintGroup(s, sc);
    });

    pastHTML = `
      <div class="backlog-past-wrapper" style="margin-bottom: 20px;">
        <div class="backlog-past-toggle-bar">
          <button type="button" class="btn btn-secondary btn-sm" onclick="togglePastSprints()" style="display:flex;align-items:center;gap:8px;font-weight:600;background:rgba(255,255,255,0.03);border:1px solid var(--border-color);padding:8px 16px;border-radius:8px;cursor:pointer;">
            <span>${window._showPastSprints ? '▼' : '▶'}</span>
            <span>🕒 Tamamlanan / Geçmiş Sprintleri ${window._showPastSprints ? 'Gizle' : 'Göster'}</span>
            <span style="background:rgba(100,116,139,0.2);color:var(--text-secondary);font-size:11px;padding:2px 8px;border-radius:12px;">${pastSprints.length} Hafta · ${pastCardsCount} Görev</span>
          </button>
          <div style="display:flex;align-items:center;gap:8px;">
            ${hasFilter ? `<span style="background:rgba(99,102,241,0.15);color:var(--accent);font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;">🎯 Filtrelendi: ${filteredCards.length} / ${cards.length} Görev</span>` : ''}
            <span style="font-size:12px;color:var(--text-secondary);">📍 Şu anki Dönem: <strong>Eylül 2026</strong></span>
            <button type="button" class="btn btn-primary btn-sm" onclick="openCardDetail(null)" style="font-size:12px;padding:6px 12px;">✚ Yeni Ticket</button>
          </div>
        </div>
        <div id="pastSprintsContainer" style="display: ${window._showPastSprints ? 'block' : 'none'}; margin-top: 14px; border-left: 2px dashed rgba(255,255,255,0.1); padding-left: 12px;">
          ${pastListHTML}
        </div>
      </div>
    `;
  }

  // Active Sprint
  let activeHTML = '';
  if (activeSprint) {
    const activeCards = filteredCards.filter(c => c.sprintId === activeSprint.id);
    activeHTML = sprintGroup(activeSprint, activeCards, true);
  }

  // Unassigned Backlog
  const unassignedHTML = sprintGroup(null, unassigned);

  // Future Sprints
  let futureHTML = '';
  futureSprints.forEach(s => {
    const sc = filteredCards.filter(c => c.sprintId === s.id);
    futureHTML += sprintGroup(s, sc);
  });

  container.innerHTML = `
    <div class="backlog-view">
      ${pastHTML}
      <div class="backlog-active-section">
        ${activeHTML}
      </div>
      <div class="backlog-unassigned-section" style="margin-top: 20px;">
        ${unassignedHTML}
      </div>
      <div class="backlog-future-section" style="margin-top: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--text-secondary); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
          <span>🗓️ Gelecek Sprintler (${futureSprints.length} Hafta)</span>
        </div>
        ${futureHTML}
      </div>
    </div>
  `;
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
window._ganttRange = window._ganttRange || 'current';

function setGanttRange(range) {
  window._ganttRange = range;
  if (typeof renderAll === 'function') renderAll();
}
window.setGanttRange = setGanttRange;

function scrollGanttToToday() {
  const line = document.getElementById('ganttTodayLine');
  const view = document.querySelector('.gantt-view') || document.querySelector('.gantt-wrap')?.parentElement;
  if (line && view) {
    const scrollPos = line.offsetLeft - (view.clientWidth / 2);
    view.scrollTo({ left: Math.max(0, scrollPos), behavior: 'smooth' });
  }
}
window.scrollGanttToToday = scrollGanttToToday;

function renderGantt(cards) {
  const container = document.getElementById('ganttView');
  if (!container) return;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayLabel = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

  const fa = (document.getElementById('filterAssignee')?.value || '').trim();
  const fe = (document.getElementById('filterEpic')?.value || '').trim();
  const fp = (document.getElementById('filterPriority')?.value || '').trim();
  const q = (document.getElementById('searchInput')?.value || '').trim();
  const hasFilter = !!(fa || fe || fp || q);

  const filterMatchedCards = cards.filter(c => cardMatchesGlobalFilters(c, { checkSprint: false }));

  // Range determination
  let minD, maxD;
  let rangeFilteredCards = filterMatchedCards;

  if (window._ganttRange === 'current') {
    // Current Period: 1 month before to ~2.5 months after (centered around today)
    minD = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    maxD = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    minD.setHours(0, 0, 0, 0);
    maxD.setHours(23, 59, 59, 999);
    rangeFilteredCards = filterMatchedCards.filter(c => {
      if (!c.dueDate && !c.startDate) return false;
      const dStart = c.startDate ? new Date(c.startDate) : new Date(c.createdAt || today);
      const dEnd = c.dueDate ? new Date(c.dueDate) : dStart;
      return dEnd >= minD && dStart <= maxD;
    });
  } else if (window._ganttRange === '2026') {
    minD = new Date(2026, 0, 1, 0, 0, 0, 0);
    maxD = new Date(2026, 11, 31, 23, 59, 59, 999);
    rangeFilteredCards = filterMatchedCards.filter(c => {
      if (!c.dueDate && !c.startDate) return false;
      const d = new Date(c.dueDate || c.startDate);
      return d.getFullYear() === 2026;
    });
  } else if (window._ganttRange === '2027') {
    minD = new Date(2027, 0, 1, 0, 0, 0, 0);
    maxD = new Date(2027, 11, 31, 23, 59, 59, 999);
    rangeFilteredCards = filterMatchedCards.filter(c => {
      if (!c.dueDate && !c.startDate) return false;
      const d = new Date(c.dueDate || c.startDate);
      return d.getFullYear() === 2027;
    });
  } else {
    // All
    const withDates = filterMatchedCards.filter(c => c.dueDate);
    const allDates = withDates.map(c => new Date(c.dueDate));
    minD = new Date(Math.min(...allDates, today));
    maxD = new Date(Math.max(...allDates, today));
    minD.setDate(minD.getDate() - 3);
    maxD.setDate(maxD.getDate() + 7);
    minD.setHours(0, 0, 0, 0);
    maxD.setHours(23, 59, 59, 999);
    rangeFilteredCards = filterMatchedCards;
  }

  // Timeline slots & percentage function
  let timelineHeaders = '';
  let pct;
  let todayPct;

  if (window._ganttRange === 'all' || window._ganttRange === '2026' || window._ganttRange === '2027') {
    // Month-based columns for long ranges
    const startYear = minD.getFullYear();
    const totalMonths = (maxD.getFullYear() - minD.getFullYear()) * 12 + (maxD.getMonth() - minD.getMonth()) + 1;
    const widthPct = 100 / Math.max(1, totalMonths);
    for (let i = 0; i < totalMonths; i++) {
      const monthDate = new Date(startYear, minD.getMonth() + i, 1);
      const isCurMonth = monthDate.getFullYear() === today.getFullYear() && monthDate.getMonth() === today.getMonth();
      timelineHeaders += `
        <div class="gantt-day${isCurMonth ? ' today' : ''}" style="flex: 0 0 ${widthPct.toFixed(2)}%; min-width: 65px; text-align: center; padding: 10px 2px;">
          <strong>${monthDate.toLocaleDateString('tr-TR', { month: 'short' })}</strong><br>
          <span style="font-size:10px; opacity:0.75">${monthDate.getFullYear()}</span>
        </div>
      `;
    }
    const totalSpan = Math.max(1, maxD - minD);
    pct = d => {
      const target = new Date(d);
      return Math.max(0, Math.min(100, ((target - minD) / totalSpan) * 100));
    };
    todayPct = pct(today);
  } else {
    // 3-day steps for the ~4 month range
    const slotStepDays = 3;
    const slots = [];
    let curD = new Date(minD);
    while (curD <= maxD) {
      slots.push(new Date(curD));
      curD.setDate(curD.getDate() + slotStepDays);
    }
    const totalSlots = Math.max(1, slots.length);
    const timelineTotalMs = totalSlots * slotStepDays * 86400000;
    const slotWidthPct = (100 / totalSlots).toFixed(3);

    slots.forEach(slotStart => {
      const slotEnd = new Date(slotStart.getTime() + slotStepDays * 86400000);
      const isSlotToday = today >= slotStart && today < slotEnd;
      timelineHeaders += `
        <div class="gantt-day${isSlotToday ? ' today' : ''}" style="flex: 0 0 ${slotWidthPct}%; min-width: 36px; text-align:center;">
          <strong>${slotStart.getDate()}</strong><br>
          <span style="font-size:9px">${slotStart.toLocaleDateString('tr-TR', { month: 'short' })}</span>
        </div>
      `;
    });

    pct = d => {
      const target = new Date(d);
      target.setHours(0, 0, 0, 0);
      const diff = target - minD;
      return Math.max(0, Math.min(100, (diff / timelineTotalMs) * 100));
    };
    todayPct = pct(today);
  }

  const priColor = { high: 'var(--pri-high)', medium: 'var(--pri-med)', low: 'var(--pri-low)' };

  const rows = rangeFilteredCards.map(c => {
    const colInfo = getColumnInfo(c.col);
    const isDone = isCardDone(c);
    const isTodo = !isDone && (
      c.col === 'todo' ||
      (colInfo.name && colInfo.name.toLowerCase().includes('yapılacak')) ||
      (colInfo.name && colInfo.name.toLowerCase().includes('backlog')) ||
      colInfo.order === 0
    );
    const isDoing = !isDone && !isTodo;

    let rowStatusClass = 'gantt-row-doing';
    let statusIcon = '⚡';
    if (isDone) {
      rowStatusClass = 'gantt-row-done';
      statusIcon = '✅';
    } else if (isTodo) {
      rowStatusClass = 'gantt-row-todo';
      statusIcon = '📋';
    }

    let depBadges = '';
    if (c.blockedBy && c.blockedBy.length > 0) {
      depBadges += `<span class="gantt-dep-badge" style="background:#fee2e2;color:#dc2626;" title="${c.blockedBy.length} kartın bitmesi bekleniyor">⛔ ${c.blockedBy.length}</span>`;
    }
    if (c.blocks && c.blocks.length > 0) {
      depBadges += `<span class="gantt-dep-badge" style="background:#fef3c7;color:#d97706;" title="${c.blocks.length} kartı bekletiyor">⚡ ${c.blocks.length}</span>`;
    }

    if (!c.dueDate) return `<div class="gantt-row ${rowStatusClass}">
      <div class="gantt-row-label" onclick="openCardDetail('${c.id}')" title="${escHtml(c.title)}">
        <span class="gantt-status-icon" title="${isDone ? 'Tamamlandı' : (isTodo ? 'Yapılacak' : 'Yapılıyor')}">${statusIcon}</span>
        <span class="gantt-col-pill" style="background:${colInfo.color}22;color:${colInfo.color};">${escHtml(colInfo.name)}</span>
        <span class="card-key-badge">${c.key || ''}</span>
        ${c.assignee ? `<span class="assignee-avatar" style="width:16px;height:16px;font-size:8px;background:${getAssigneeColor(c.assignee)}">${escHtml(initials(c.assignee))}</span>` : ''}
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${isDone ? '✓ ' : ''}${escHtml(c.title.slice(0, 22))}${c.title.length > 22 ? '…' : ''}</span>
        ${depBadges}
      </div>
      <div class="gantt-row-timeline"><div class="gantt-no-date">Tarih belirlenmemiş</div></div>
    </div>`;

    const dStart = c.startDate ? new Date(c.startDate) : new Date(c.createdAt || today);
    const dEnd = new Date(c.dueDate);
    const barStart = Math.max(0, Math.min(96, pct(dStart)));
    const barEnd = Math.max(barStart + 3, Math.min(100, pct(dEnd)));
    const barW = Math.max(3, barEnd - barStart);

    const barBg = isDone ? '#10b981' : (isTodo ? '#64748b' : (priColor[c.priority] || '#3b82f6'));

    return `<div class="gantt-row ${rowStatusClass}">
      <div class="gantt-row-label" onclick="openCardDetail('${c.id}')" title="${escHtml(c.title)}">
        <span class="gantt-status-icon" title="${isDone ? 'Tamamlandı' : (isTodo ? 'Yapılacak' : 'Yapılıyor')}">${statusIcon}</span>
        <span class="gantt-col-pill" style="background:${colInfo.color}22;color:${colInfo.color};">${escHtml(colInfo.name)}</span>
        <span class="card-key-badge">${c.key || ''}</span>
        ${c.assignee ? `<span class="assignee-avatar" style="width:16px;height:16px;font-size:8px;background:${getAssigneeColor(c.assignee)}">${escHtml(initials(c.assignee))}</span>` : ''}
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${isDone ? '✓ ' : ''}${escHtml(c.title.slice(0, 22))}${c.title.length > 22 ? '…' : ''}</span>
        ${depBadges}
      </div>
      <div class="gantt-row-timeline" style="position:relative">
        <div class="gantt-bar${isDone ? ' done' : ''}${isTodo ? ' todo' : ''}" style="left:${barStart.toFixed(1)}%;width:${barW.toFixed(1)}%;background:${barBg};z-index:2;${isDone ? 'opacity:0.95;border:1px solid #059669;box-shadow:0 1px 3px rgba(16,185,129,0.3);' : ''}"
             title="${escHtml(c.title)} (${c.startDate || ''} → ${c.dueDate}) [Durum: ${escHtml(colInfo.name)}]${c.blockedBy?.length ? ` [⛔ ${c.blockedBy.length} bağımlılık]` : ''}">
          <span>${isDone ? '✓ ' : ''}${escHtml(c.title.slice(0, 18))}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  const controlsHTML = `
    <div class="gantt-controls-bar">
      <div class="gantt-range-group">
        <button type="button" class="gantt-btn ${window._ganttRange === 'current' ? 'active' : ''}" onclick="setGanttRange('current')">🎯 Aktif Dönem (Eylül 2026 ± 2 Ay)</button>
        <button type="button" class="gantt-btn ${window._ganttRange === '2026' ? 'active' : ''}" onclick="setGanttRange('2026')">📅 2026 Yılı</button>
        <button type="button" class="gantt-btn ${window._ganttRange === '2027' ? 'active' : ''}" onclick="setGanttRange('2027')">📅 2027 Yılı</button>
        <button type="button" class="gantt-btn ${window._ganttRange === 'all' ? 'active' : ''}" onclick="setGanttRange('all')">🌐 Tüm 2 Yıl (104 Hafta)</button>
      </div>
      <div class="gantt-legend" style="display:flex;align-items:center;gap:12px;font-size:11px;font-weight:600;color:var(--text-secondary);flex-wrap:wrap;">
        <span style="display:inline-flex;align-items:center;gap:4px;"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#f0fdf4;border:2px solid #10b981;"></span> Tamamlandı (Yeşil)</span>
        <span style="display:inline-flex;align-items:center;gap:4px;"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#ffffff;border:2px solid #3b82f6;"></span> Yapılıyor</span>
        <span style="display:inline-flex;align-items:center;gap:4px;"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#f8fafc;border:2px solid #94a3b8;"></span> Yapılacak (Gri)</span>
        <span style="display:inline-flex;align-items:center;gap:4px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;"></span> Bugün Çizgisi</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${hasFilter ? `<span style="font-size:12px;font-weight:600;color:var(--accent);">🎯 Filtrelendi: ${rangeFilteredCards.length} / ${cards.length}</span>` : ''}
        <button type="button" class="btn btn-sm btn-secondary" onclick="scrollGanttToToday()" style="font-size:12px;">📍 Bugüne Git (${todayLabel})</button>
        <button type="button" class="btn btn-sm btn-primary" onclick="openCardDetail(null)" style="font-size:12px;">✚ Yeni Ticket Ekle</button>
      </div>
    </div>
  `;

  container.innerHTML = `<div class="gantt-view">
    ${controlsHTML}
    <div class="gantt-wrap" style="position:relative;">
      ${(todayPct >= 0 && todayPct <= 100) ? `
        <div id="ganttTodayLine" style="position:absolute;top:0;bottom:0;left:calc(240px + (100% - 240px) * ${todayPct / 100});width:2px;background:#ef4444;box-shadow:0 0 10px rgba(239,68,68,0.8);z-index:5;pointer-events:none;">
          <span class="gantt-today-badge">📍 Bugün (${todayLabel})</span>
        </div>` : ''}
      <div class="gantt-header">
        <div class="gantt-label-col">Görev</div>
        <div class="gantt-timeline-header">${timelineHeaders}</div>
      </div>
      ${rows || '<div style="text-align:center;padding:48px;color:var(--text-muted)">Seçili zaman aralığında görev bulunamadı.</div>'}
    </div>
  </div>`;

  setTimeout(() => {
    scrollGanttToToday();
  }, 120);
}

// ── Sprint Completion & Retrospective Report Handlers ──────
window._completingSprintId = null;

function openCompleteSprintModal(sprintId) {
  const currentSprints = window.sprints || [];
  const currentCards = window.cards || [];
  const sprint = currentSprints.find(s => s.id === sprintId) || currentSprints.find(s => s.active);
  if (!sprint) {
    showToast('Aktif sprint bulunamadı', 'error');
    return;
  }

  window._completingSprintId = sprint.id;
  const sCards = currentCards.filter(c => c.sprintId === sprint.id);
  const doneCards = sCards.filter(c => isCardDone(c));
  const incompleteCards = sCards.filter(c => !isCardDone(c));

  const titleEl = document.getElementById('completeSprintModalTitle');
  if (titleEl) titleEl.textContent = `🏁 ${sprint.name} Sprintini Tamamla`;

  const descEl = document.getElementById('completeSprintDesc');
  if (descEl) {
    descEl.innerHTML = `<strong>${escHtml(sprint.name)}</strong> sprintini kapatmak ve retrospektif raporunu üretmek üzeresiniz.`;
  }

  const doneCountEl = document.getElementById('csDoneCount');
  if (doneCountEl) doneCountEl.textContent = doneCards.length;

  const incCountEl = document.getElementById('csIncompleteCount');
  if (incCountEl) incCountEl.textContent = incompleteCards.length;

  const incGroup = document.getElementById('csIncompleteActionsGroup');
  const nextSelect = document.getElementById('csNextSprintSelect');
  const radioNext = document.getElementById('csRadioNextSprint');

  if (incompleteCards.length > 0) {
    if (incGroup) incGroup.style.display = 'block';
    if (radioNext) radioNext.checked = true;

    // Populate future sprints dropdown
    const futureSprints = currentSprints.filter(s => s.id !== sprint.id && !s.active && s.status !== 'closed');
    if (nextSelect) {
      nextSelect.disabled = false;
      let opts = futureSprints.map(fs => `<option value="${fs.id}">${escHtml(fs.name)} (${fs.startDate || '?'} → ${fs.endDate || '?'})</option>`).join('');
      opts += `<option value="create_new">✚ Yeni Sprint Oluştur ve Oraya Aktar</option>`;
      nextSelect.innerHTML = opts;
    }
  } else {
    if (incGroup) incGroup.style.display = 'none';
  }

  openModal('completeSprintModal');
}
window.openCompleteSprintModal = openCompleteSprintModal;

function toggleCsSprintSelect() {
  const isNext = document.getElementById('csRadioNextSprint')?.checked;
  const nextSelect = document.getElementById('csNextSprintSelect');
  if (nextSelect) {
    nextSelect.disabled = !isNext;
  }
}
window.toggleCsSprintSelect = toggleCsSprintSelect;

async function doCompleteSprint() {
  const sprintId = window._completingSprintId;
  if (!sprintId) return;

  const btn = document.getElementById('btnConfirmCompleteSprint');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Kapatılıyor…';
  }

  try {
    const isBacklog = document.getElementById('csRadioBacklog')?.checked;
    const nextSelect = document.getElementById('csNextSprintSelect');
    let action = isBacklog ? 'backlog' : 'next_sprint';
    let targetSprintId = undefined;

    if (action === 'next_sprint' && nextSelect) {
      if (nextSelect.value === 'create_new') {
        const currentSprints = window.sprints || [];
        const sprint = currentSprints.find(s => s.id === sprintId);
        const newSprintNum = currentSprints.length + 1;
        const newSprint = await API.addSprint({
          name: `Sprint ${newSprintNum}`,
          startDate: sprint?.endDate || new Date().toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
        });
        targetSprintId = newSprint.id;
      } else if (nextSelect.value) {
        targetSprintId = nextSelect.value;
      }
    }

    const payload = {
      incompleteAction: action,
      targetSprintId: targetSprintId || undefined
    };

    const res = await API.completeSprint(sprintId, payload);
    closeModal('completeSprintModal');
    showToast(`🏁 "${res.sprint?.name || 'Sprint'}" başarıyla tamamlandı!`, 'success');

    if (typeof window.reloadAppData === 'function') {
      await window.reloadAppData();
    }

    // Automatically open the Sprint Close / Retrospective Report Modal!
    openSprintReportModal(sprintId);
  } catch (err) {
    console.error('Sprint complete failed:', err);
    showToast(err.message || 'Sprint tamamlanamadı', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🏁 Tamamla ve Kapat';
    }
  }
}
window.doCompleteSprint = doCompleteSprint;

async function openSprintReportModal(sprintId) {
  const modalBody = document.getElementById('sprintReportModalBody');
  const modalTitle = document.getElementById('sprintReportModalTitle');
  const modalSubtitle = document.getElementById('sprintReportModalSubtitle');
  const modalTime = document.getElementById('sprintReportFooterTime');

  if (modalTitle) modalTitle.textContent = '📊 Sprint Retrospektif & Kapanış Raporu';
  if (modalSubtitle) modalSubtitle.textContent = 'Yükleniyor…';
  if (modalBody) modalBody.innerHTML = '<div style="text-align:center;padding:50px;color:var(--text-secondary);"><div class="spinner" style="margin:0 auto 12px auto;"></div> Rapor hesaplanıyor ve yükleniyor…</div>';

  openModal('sprintReportModal');

  try {
    const report = await API.getSprintReport(sprintId);
    if (!report) throw new Error('Rapor verisi bulunamadı');

    if (modalTitle) modalTitle.textContent = `📊 ${report.sprintName} — Retrospektif & Kapanış Raporu`;
    const closedDateStr = report.closedAt ? new Date(report.closedAt).toLocaleString('tr-TR') : 'Tamamlandı';
    const closedByStr = report.closedBy?.name ? ` · Kapatan: ${report.closedBy.name}` : '';
    if (modalSubtitle) {
      modalSubtitle.textContent = `Dönem: ${report.startDate || '—'} → ${report.endDate || '—'} · Kapanış: ${closedDateStr}${closedByStr}`;
    }
    if (modalTime) {
      modalTime.textContent = `Oluşturulma: ${new Date(report.generatedAt).toLocaleString('tr-TR')}`;
    }

    // Member Contribution Rows
    const memberRows = (report.memberMetrics || []).map(m => {
      const dev = m.spentEffort - m.estimatedEffort;
      const devTag = dev > 0 
        ? `<span class="dev-tag deviation-negative">+${dev} sa</span>` 
        : (dev < 0 ? `<span class="dev-tag deviation-positive">${dev} sa</span>` : '<span class="dev-tag deviation-zero">0 sa</span>');
      const avatarColor = getAssigneeColor(m.userName);

      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="user-avatar" style="background:${avatarColor};width:26px;height:26px;font-size:11px;font-weight:700;color:#fff;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;">${initials(m.userName)}</span>
              <strong>${escHtml(m.userName)}</strong>
            </div>
          </td>
          <td><strong>${m.completedCards}</strong> / ${m.assignedCards} bilet</td>
          <td><span class="sp-badge" style="font-weight:700;background:rgba(99,102,241,0.12);color:var(--primary);">${m.completedSP} SP</span></td>
          <td>${m.estimatedEffort} sa</td>
          <td>${m.spentEffort} sa</td>
          <td>${devTag}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px;">
              <div class="subtask-bar-track" style="width:60px;height:6px;">
                <div class="subtask-bar-fill ${m.accuracyPct >= 90 ? 'done' : ''}" style="width:${Math.min(100, m.accuracyPct)}%"></div>
              </div>
              <span style="font-size:11px;font-weight:600;">%${m.accuracyPct}</span>
            </div>
          </td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">Üye metrik verisi bulunamadı</td></tr>';

    // Completed Cards list
    const completedCardsRows = (report.completedCards || []).map(c => `
      <tr>
        <td style="white-space:nowrap;"><span class="ticket-key-badge" style="background:rgba(16,185,129,0.1);color:#10b981;font-weight:700;padding:2px 6px;border-radius:4px;font-size:11px;">${escHtml(c.key || c.id)}</span></td>
        <td><strong>${escHtml(c.title)}</strong></td>
        <td>${escHtml(c.assignee || 'Atanmamış')}</td>
        <td><span class="sp-badge">${c.storyPoints ?? 0} SP</span></td>
        <td>${c.spentEffort ?? 0} sa / ${c.estimatedEffort ?? 0} sa</td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:14px;">Tamamlanan bilet yok</td></tr>';

    // Incomplete Cards list
    const incompleteCardsRows = (report.incompleteCards || []).map(c => `
      <tr>
        <td style="white-space:nowrap;"><span class="ticket-key-badge" style="background:rgba(245,158,11,0.1);color:#f59e0b;font-weight:700;padding:2px 6px;border-radius:4px;font-size:11px;">${escHtml(c.key || c.id)}</span></td>
        <td><strong>${escHtml(c.title)}</strong></td>
        <td>${escHtml(c.assignee || 'Atanmamış')}</td>
        <td><span class="sp-badge">${c.storyPoints ?? 0} SP</span></td>
        <td><span class="status-pill status-todo">${escHtml(c.status || 'Yapılacak')}</span></td>
      </tr>
    `).join('');

    const incompleteSection = report.incompleteCardsCount > 0 ? `
      <div class="retro-section-title">
        <span>📦 Tamamlanamayan / Aktarılan Biletler (${report.incompleteCardsCount})</span>
      </div>
      <div class="retro-table-wrap">
        <table class="retro-table">
          <thead>
            <tr>
              <th>Bilet</th>
              <th>Başlık</th>
              <th>Kişi</th>
              <th>Story Points</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            ${incompleteCardsRows}
          </tbody>
        </table>
      </div>
    ` : '';

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="retro-modal-content">
          <!-- KPI Cards Grid -->
          <div class="retro-kpi-grid">
            <div class="retro-kpi-card">
              <div class="retro-kpi-label">Hız (Velocity) / SP</div>
              <div class="retro-kpi-val text-primary">${report.completedSP} <span style="font-size:14px;color:var(--text-secondary);font-weight:500;">/ ${report.committedSP} SP</span></div>
              <div class="retro-kpi-sub">%${report.velocityPct} Başarı Oranı</div>
            </div>

            <div class="retro-kpi-card">
              <div class="retro-kpi-label">Tamamlanan Bilet</div>
              <div class="retro-kpi-val text-success">${report.completedCardsCount} <span style="font-size:14px;color:var(--text-secondary);font-weight:500;">/ ${report.totalCardsCount}</span></div>
              <div class="retro-kpi-sub">${report.incompleteCardsCount} bilet aktarıldı</div>
            </div>

            <div class="retro-kpi-card">
              <div class="retro-kpi-label">Efor Tüketimi</div>
              <div class="retro-kpi-val">${report.totalSpentEffort} sa</div>
              <div class="retro-kpi-sub">Öngörü: ${report.totalEstimatedEffort} sa</div>
            </div>

            <div class="retro-kpi-card">
              <div class="retro-kpi-label">Efor Sapması</div>
              <div class="retro-kpi-val ${report.effortVariance > 0 ? 'text-danger' : 'text-success'}">
                ${report.effortVariance > 0 ? '+' : ''}${report.effortVariance} sa
              </div>
              <div class="retro-kpi-sub">${report.effortVariance > 0 ? 'Öngörülenden fazla harcandı' : 'Hedef zaman dahilinde'}</div>
            </div>
          </div>

          <!-- Section 1: Member Contribution ("Kimin Ne Yaptığı") -->
          <div class="retro-section-title">
            <span>👥 Takım Üyelerinin Katkıları ("Kimin Ne Yaptığı")</span>
          </div>
          <div class="retro-table-wrap">
            <table class="retro-table">
              <thead>
                <tr>
                  <th>Takım Üyesi</th>
                  <th>Tamamlanan Görev</th>
                  <th>Teslim Edilen SP</th>
                  <th>Planlanan Efor</th>
                  <th>Harcanan Efor</th>
                  <th>Sapma</th>
                  <th>Efor Doğruluğu</th>
                </tr>
              </thead>
              <tbody>
                ${memberRows}
              </tbody>
            </table>
          </div>

          <!-- Section 2: Completed Tickets List -->
          <div class="retro-section-title">
            <span>✅ Tamamlanan Biletler (${report.completedCardsCount})</span>
          </div>
          <div class="retro-table-wrap">
            <table class="retro-table">
              <thead>
                <tr>
                  <th>Bilet</th>
                  <th>Başlık</th>
                  <th>Kişi</th>
                  <th>Story Points</th>
                  <th>Harcanan Efor</th>
                </tr>
              </thead>
              <tbody>
                ${completedCardsRows}
              </tbody>
            </table>
          </div>

          <!-- Section 3: Incomplete Tickets -->
          ${incompleteSection}
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to open sprint report:', err);
    if (modalBody) {
      modalBody.innerHTML = `<div class="auth-error" style="display:block;margin:20px;">Rapor alınırken hata oluştu: ${escHtml(err.message)}</div>`;
    }
  }
}
window.openSprintReportModal = openSprintReportModal;

function printSprintReportModal() {
  window.print();
}
window.printSprintReportModal = printSprintReportModal;

// ── Global Filter State for Reports View ──────────────────
window._reportsFilter = window._reportsFilter || {
  timeRange: 'all',
  startDate: '',
  endDate: '',
  sprintId: '',
  assignee: ''
};

// ── Reports View Render (Performance & Progress Center) ───
function renderReports(cards = [], epics = [], sprints = []) {
  const container = document.getElementById('reportsView');
  if (!container) return;

  const currentFilter = window._reportsFilter;

  // Render Skeleton Structure
  container.innerHTML = `
    <div class="reports-dashboard">
      <!-- Report Header -->
      <div class="reports-header-row no-print">
        <div>
          <h2>📊 Performans, Sprint &amp; Proje Analiz Merkezi</h2>
          <p class="reports-subtitle">Zaman bazlı çalışan çıktısı, efor sapmaları, sprint retrospektifleri ve proje hız (velocity) takibi.</p>
        </div>
        <div class="reports-actions">
          <button class="btn btn-secondary" onclick="exportToCSV(window.cards || [], window.epics || [], window.sprints || [])">📥 CSV Dışa Aktar</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ PDF / Raporu Yazdır</button>
        </div>
      </div>

      <!-- Printable Only Header -->
      <div class="print-only-header">
        <h1>Kanban Proje &amp; Performans Raporu</h1>
        <p>Tarih: ${new Date().toLocaleDateString('tr-TR')} · Çalışma Alanı: ${(window.currentUser && window.currentUser.company) || 'Kişisel / Proje'}</p>
        <hr style="margin:16px 0; border:0; border-top:1px solid #ddd">
      </div>

      <!-- Time & Criteria Filter Bar -->
      <div class="perf-filter-bar no-print">
        <div style="min-width: 170px;">
          <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 4px;">📅 Zaman Aralığı</label>
          <select class="form-select" id="repFilterTimeRange" style="font-size: 13px; padding: 7px 12px; width: 100%; font-weight: 500;">
            <option value="all" ${currentFilter.timeRange === 'all' ? 'selected' : ''}>Tüm Zamanlar</option>
            <option value="30d" ${currentFilter.timeRange === '30d' ? 'selected' : ''}>Son 30 Gün</option>
            <option value="90d" ${currentFilter.timeRange === '90d' ? 'selected' : ''}>Son 3 Ay (90 Gün)</option>
            <option value="180d" ${currentFilter.timeRange === '180d' ? 'selected' : ''}>Son 6 Ay (180 Gün)</option>
            <option value="2026" ${currentFilter.timeRange === '2026' ? 'selected' : ''}>2026 Yılı</option>
            <option value="2027" ${currentFilter.timeRange === '2027' ? 'selected' : ''}>2027 Yılı</option>
            <option value="custom" ${currentFilter.timeRange === 'custom' ? 'selected' : ''}>Özel Tarih Aralığı…</option>
          </select>
        </div>

        <div id="repCustomDateWrap" style="display: ${currentFilter.timeRange === 'custom' ? 'flex' : 'none'}; gap: 8px;">
          <div>
            <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 4px;">Başlangıç</label>
            <input type="date" class="form-input" id="repFilterStartDate" value="${currentFilter.startDate || ''}" style="font-size: 13px; padding: 6px 10px;">
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 4px;">Bitiş</label>
            <input type="date" class="form-input" id="repFilterEndDate" value="${currentFilter.endDate || ''}" style="font-size: 13px; padding: 6px 10px;">
          </div>
        </div>

        <div style="min-width: 170px;">
          <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 4px;">⚡ Sprint Filtresi</label>
          <select class="form-select" id="repFilterSprint" style="font-size: 13px; padding: 7px 12px; width: 100%;">
            <option value="">Tüm Sprintler</option>
            ${sprints.map(s => `<option value="${s.id}" ${currentFilter.sprintId === s.id ? 'selected' : ''}>${escHtml(s.name)}</option>`).join('')}
          </select>
        </div>

        <div style="min-width: 170px;">
          <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 4px;">👤 Takım Üyesi</label>
          <select class="form-select" id="repFilterAssignee" style="font-size: 13px; padding: 7px 12px; width: 100%;">
            <option value="">Tüm Takım</option>
            ${[...new Set(cards.map(c => c.assignee).filter(Boolean))].sort().map(name => `
              <option value="${escHtml(name)}" ${currentFilter.assignee === name ? 'selected' : ''}>${escHtml(name)}</option>
            `).join('')}
          </select>
        </div>

        <div>
          <button class="btn btn-secondary btn-sm" id="btnResetReportsFilter" style="height: 38px; padding: 0 14px;">Temizle</button>
        </div>
      </div>

      <!-- Live Project KPI Metrics Container -->
      <div id="reportsKpiContainer">
        <div style="text-align:center;padding:24px;color:var(--text-secondary);"><div class="spinner" style="margin:0 auto 8px auto;"></div> Performans metrikleri yükleniyor…</div>
      </div>

      <!-- Section 1: Employee Performance & Contribution ("Kimin Ne Yaptığı") -->
      <div class="reports-card" id="reportsEmployeeCard">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 class="reports-card-title" style="margin: 0;">👥 Zaman Bazlı Çalışan Performans Takibi ("Kimin Ne Yaptığı")</h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 4px 0 0 0;">Seçilen zaman penceresinde çalışanların bitirdiği biletler, teslim ettiği SP ve harcanan efor doğruluğu.</p>
          </div>
          <span id="repMembersCountBadge" style="font-size: 12px; color: var(--text-secondary); font-weight: 600;"></span>
        </div>
        <div id="reportsEmployeeTableWrap">
          <div style="text-align:center;padding:20px;color:var(--text-secondary);">Veriler hesaplanıyor…</div>
        </div>
      </div>

      <!-- Section 2: Closed Sprints Archive & Retrospectives -->
      <div class="reports-card" id="reportsClosedSprintsCard">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 class="reports-card-title" style="margin: 0;">🏁 Kapatılan Sprintler Arşivi &amp; Retrospektif Kayıtları</h3>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 4px 0 0 0;">Kapatılan geçmiş sprintlerin özet performansları, teslim edilen SP ve detaylı retrospektif raporları.</p>
          </div>
        </div>
        <div id="reportsClosedSprintsWrap">
          <div style="text-align:center;padding:20px;color:var(--text-secondary);">Kapatılan sprintler yükleniyor…</div>
        </div>
      </div>

      <div class="reports-row-grid">
        <!-- Section 3: Epics Progress -->
        <div class="reports-card">
          <h3 class="reports-card-title">🏷️ Epic Durumu ve Harcanan Süreler</h3>
          <div id="reportsEpicTableWrap"></div>
        </div>

        <!-- Section 4: Sprint Velocity -->
        <div class="reports-card">
          <h3 class="reports-card-title">⚡ Tüm Sprintler ve Hız (Velocity)</h3>
          <div id="reportsSprintTableWrap"></div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners to Filter Controls
  const timeRangeSelect = document.getElementById('repFilterTimeRange');
  const customDateWrap = document.getElementById('repCustomDateWrap');
  const startDateInput = document.getElementById('repFilterStartDate');
  const endDateInput = document.getElementById('repFilterEndDate');
  const sprintSelect = document.getElementById('repFilterSprint');
  const assigneeSelect = document.getElementById('repFilterAssignee');
  const resetBtn = document.getElementById('btnResetReportsFilter');

  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', (e) => {
      window._reportsFilter.timeRange = e.target.value;
      if (customDateWrap) {
        customDateWrap.style.display = e.target.value === 'custom' ? 'flex' : 'none';
      }
      loadPerformanceData();
    });
  }

  if (startDateInput) {
    startDateInput.addEventListener('change', (e) => {
      window._reportsFilter.startDate = e.target.value;
      loadPerformanceData();
    });
  }

  if (endDateInput) {
    endDateInput.addEventListener('change', (e) => {
      window._reportsFilter.endDate = e.target.value;
      loadPerformanceData();
    });
  }

  if (sprintSelect) {
    sprintSelect.addEventListener('change', (e) => {
      window._reportsFilter.sprintId = e.target.value;
      loadPerformanceData();
    });
  }

  if (assigneeSelect) {
    assigneeSelect.addEventListener('change', (e) => {
      window._reportsFilter.assignee = e.target.value;
      loadPerformanceData();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      window._reportsFilter = { timeRange: 'all', startDate: '', endDate: '', sprintId: '', assignee: '' };
      renderReports(cards, epics, sprints);
    });
  }

  // Render Epics & Sprints static parts
  renderEpicsAndSprintsTables(cards, epics, sprints);

  // Trigger Dynamic Performance Data Fetch
  loadPerformanceData();
}
window.renderReports = renderReports;

async function loadPerformanceData() {
  const kpiContainer = document.getElementById('reportsKpiContainer');
  const empTableWrap = document.getElementById('reportsEmployeeTableWrap');
  const closedWrap = document.getElementById('reportsClosedSprintsWrap');
  const membersBadge = document.getElementById('repMembersCountBadge');

  try {
    const [perfData, closedSprintsData] = await Promise.all([
      API.getEmployeePerformance(window._reportsFilter),
      API.getClosedSprints().catch(() => ({ closedSprints: [] }))
    ]);

    const pm = perfData.projectMetrics || {};
    const members = perfData.members || [];
    const closedList = closedSprintsData.closedSprints || [];

    // Render KPI Cards
    if (kpiContainer) {
      kpiContainer.innerHTML = `
        <div class="manager-kpi-grid" style="margin-bottom: 0;">
          <div class="kpi-card">
            <div class="kpi-label">Atanan Bilet</div>
            <div class="kpi-value">${pm.totalAssignedCards || 0}</div>
            <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">Filtrelenen Görevler</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Tamamlanan Bilet</div>
            <div class="kpi-value text-success">${pm.totalCompletedCards || 0} <span style="font-size:13px;font-weight:600;color:var(--text-secondary);">(%${pm.overallCompletionRatePct || 0})</span></div>
            <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">Başarı Oranı</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Teslim Edilen SP</div>
            <div class="kpi-value text-primary">${pm.totalDeliveredSP || 0} <span style="font-size:13px;font-weight:600;color:var(--text-secondary);">SP</span></div>
            <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">Story Points</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Harcanan Efor &amp; Sapma</div>
            <div class="kpi-value">${pm.totalSpentEffort || 0} <span style="font-size:13px;font-weight:500;color:var(--text-secondary);">/ ${pm.totalEstimatedEffort || 0} sa</span></div>
            <div style="font-size:11px;font-weight:600;color:${pm.effortVariance > 0 ? '#ef4444' : '#10b981'};margin-top:2px;">
              ${pm.effortVariance > 0 ? '+' : ''}${pm.effortVariance || 0} sa sapma
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Ortalama Velocity</div>
            <div class="kpi-value text-primary">${pm.averageVelocity || 0} <span style="font-size:13px;font-weight:500;color:var(--text-secondary);">SP/Sprint</span></div>
            <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">Kapatılan: ${pm.closedSprintsCount || 0} Sprint</div>
          </div>
        </div>
      `;
    }

    if (membersBadge) {
      membersBadge.textContent = `${members.length} Takım Üyesi`;
    }

    // Render Employee Performance Table ("Kimin Ne Yaptığı")
    if (empTableWrap) {
      if (members.length === 0) {
        empTableWrap.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-secondary);">Filtre kriterlerine uygun çalışan çıktısı bulunamadı.</div>';
      } else {
        const rows = members.map((m, idx) => {
          const avatarColor = getAssigneeColor(m.userName);
          const dev = m.spentEffort - m.estimatedEffort;
          const devTag = dev > 0 
            ? `<span class="dev-tag deviation-negative">+${dev} sa</span>` 
            : (dev < 0 ? `<span class="dev-tag deviation-positive">${dev} sa</span>` : '<span class="dev-tag deviation-zero">0 sa</span>');
          const rowId = `emp-details-${idx}`;

          const ticketsListHtml = (m.completedTickets && m.completedTickets.length > 0)
            ? m.completedTickets.map(t => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px dashed var(--border);">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span class="ticket-key-badge" style="background:rgba(16,185,129,0.12);color:#10b981;font-weight:700;padding:2px 6px;border-radius:4px;font-size:10px;">${escHtml(t.key || t.id)}</span>
                    <span style="font-weight:600;color:var(--text-primary);">${escHtml(t.title)}</span>
                    ${t.sprintName ? `<span style="font-size:11px;color:var(--text-secondary);background:var(--surface);padding:1px 6px;border-radius:4px;border:1px solid var(--border);">${escHtml(t.sprintName)}</span>` : ''}
                  </div>
                  <div style="display:flex;gap:12px;align-items:center;font-size:11px;">
                    <span style="color:var(--text-secondary);">Efor: <strong>${t.spentEffort ?? 0} sa</strong></span>
                    <span class="sp-badge">${t.storyPoints ?? 0} SP</span>
                  </div>
                </div>
              `).join('')
            : '<div style="color:var(--text-secondary);font-size:12px;padding:6px 0;">Bu dönemde tamamlanan bilet bulunmuyor.</div>';

          return `
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  <span class="user-avatar" style="background:${avatarColor};width:30px;height:30px;font-size:12px;font-weight:700;color:#fff;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;">${initials(m.userName)}</span>
                  <div>
                    <strong style="color:var(--text-primary);display:block;">${escHtml(m.userName)}</strong>
                    ${m.username ? `<span style="font-size:11px;color:var(--text-secondary);">@${escHtml(m.username)}</span>` : ''}
                  </div>
                </div>
              </td>
              <td><strong>${m.completedCount}</strong> / ${m.assignedCount} bilet</td>
              <td>
                <div style="display:flex;align-items:center;gap:6px;">
                  <div class="subtask-bar-track" style="width:60px;height:6px;">
                    <div class="subtask-bar-fill ${m.completionRatePct === 100 ? 'done' : ''}" style="width:${Math.min(100, m.completionRatePct)}%"></div>
                  </div>
                  <span style="font-size:11px;font-weight:600;">%${m.completionRatePct}</span>
                </div>
              </td>
              <td><span class="sp-badge" style="font-size:12px;padding:2px 8px;font-weight:700;background:rgba(99,102,241,0.12);color:var(--primary);">${m.totalSP} SP</span></td>
              <td>${m.estimatedEffort} sa</td>
              <td>${m.spentEffort} sa</td>
              <td>${devTag}</td>
              <td>
                <span style="font-weight:600;color:${m.effortAccuracyPct >= 85 ? '#10b981' : '#f59e0b'};">%${m.effortAccuracyPct}</span>
              </td>
              <td>
                <button type="button" class="perf-details-toggle" onclick="toggleEmpTickets('${rowId}', this)">
                  🔍 Biletler (${m.completedCount})
                </button>
              </td>
            </tr>
            <tr id="${rowId}" style="display:none;background:var(--surface-2, rgba(0,0,0,0.02));">
              <td colspan="9" style="padding:12px 16px;">
                <div class="perf-tickets-drawer">
                  <div style="font-weight:700;margin-bottom:8px;color:var(--text-primary);font-size:12px;">
                    📋 ${escHtml(m.userName)} — Bu Dönemde Tamamladığı Biletler (${m.completedCount})
                  </div>
                  ${ticketsListHtml}
                </div>
              </td>
            </tr>
          `;
        }).join('');

        empTableWrap.innerHTML = `
          <div style="overflow-x: auto;">
            <table class="reports-table">
              <thead>
                <tr>
                  <th>Takım Üyesi</th>
                  <th>Görev Durumu</th>
                  <th>Tamamlanma %</th>
                  <th>Teslim Edilen SP</th>
                  <th>Planlanan Efor</th>
                  <th>Harcanan Efor</th>
                  <th>Efor Sapması</th>
                  <th>Doğruluk %</th>
                  <th>Aksiyon</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        `;
      }
    }

    // Render Closed Sprints Archive
    if (closedWrap) {
      if (closedList.length === 0) {
        closedWrap.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text-secondary);">Henüz kapatılmış sprint kaydı bulunmamaktadır. Aktif sprint tamamlandığında burada arşivlenecektir.</div>';
      } else {
        const cRows = closedList.map(cs => {
          const closedDate = cs.closedAt ? new Date(cs.closedAt).toLocaleDateString('tr-TR') : 'Tamamlandı';
          return `
            <tr>
              <td>
                <strong style="color:var(--text-primary);">${escHtml(cs.name)}</strong>
              </td>
              <td>
                <span class="status-pill status-done" style="font-weight:700;">🏁 Kapatıldı</span>
              </td>
              <td style="color:var(--text-secondary);font-size:12px;">
                ${cs.startDate || '—'} → ${cs.endDate || '—'}
              </td>
              <td>
                <span style="font-size:12px;color:var(--text-secondary);">${closedDate}</span>
                ${cs.closedBy?.name ? `<span style="font-size:11px;color:var(--text-secondary);display:block;">(${escHtml(cs.closedBy.name)})</span>` : ''}
              </td>
              <td><strong>${cs.report?.completedCardsCount ?? 0} bilet</strong></td>
              <td><span class="sp-badge" style="font-weight:700;">${cs.report?.completedSP ?? 0} SP</span></td>
              <td style="text-align:right;">
                <button class="btn btn-sm btn-primary" onclick="openSprintReportModal('${cs.id}')" style="font-size:12px;padding:4px 12px;gap:4px;">
                  📊 Retrospektif Raporunu İncele
                </button>
              </td>
            </tr>
          `;
        }).join('');

        closedWrap.innerHTML = `
          <div style="overflow-x: auto;">
            <table class="reports-table">
              <thead>
                <tr>
                  <th>Sprint Adı</th>
                  <th>Durum</th>
                  <th>Tarih Aralığı</th>
                  <th>Kapanış Tarihi</th>
                  <th>Tamamlanan Görev</th>
                  <th>Teslim Edilen Hız</th>
                  <th style="text-align:right;">Rapor</th>
                </tr>
              </thead>
              <tbody>
                ${cRows}
              </tbody>
            </table>
          </div>
        `;
      }
    }
  } catch (err) {
    console.error('Failed to load performance data:', err);
    if (kpiContainer) kpiContainer.innerHTML = `<div class="auth-error" style="display:block;margin:12px;">Veriler yüklenemedi: ${escHtml(err.message)}</div>`;
  }
}
window.loadPerformanceData = loadPerformanceData;

function toggleEmpTickets(rowId, btn) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const isHidden = row.style.display === 'none';
  row.style.display = isHidden ? 'table-row' : 'none';
  if (btn) {
    btn.textContent = isHidden ? '▲ Gizle' : '🔍 Biletler';
  }
}
window.toggleEmpTickets = toggleEmpTickets;

function renderEpicsAndSprintsTables(cards, epics, sprints) {
  const epicWrap = document.getElementById('reportsEpicTableWrap');
  const sprintWrap = document.getElementById('reportsSprintTableWrap');

  if (epicWrap) {
    const epicRows = epics.map(e => {
      const ec = cards.filter(c => c.epicId === e.id);
      const doneCount = ec.filter(c => isCardDone(c)).length;
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

    epicWrap.innerHTML = `
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
    `;
  }

  if (sprintWrap) {
    const sprintRows = sprints.map(s => {
      const sc = cards.filter(c => c.sprintId === s.id);
      const doneCards = sc.filter(c => isCardDone(c));
      const completedSP = doneCards.reduce((sum, c) => sum + (c.storyPoints || 0), 0);
      const totalSP = sc.reduce((sum, c) => sum + (c.storyPoints || 0), 0);
      const est = sc.reduce((sum, c) => sum + (c.estimatedEffort || 0), 0);
      const spent = sc.reduce((sum, c) => sum + (c.spentEffort || 0), 0);
      
      let statusBadge = s.active 
        ? '<span class="sprint-active-badge">Aktif</span>' 
        : (s.status === 'closed' ? '<span class="status-done-badge">Kapatıldı</span>' : '<span class="status-planned-badge">Planlandı</span>');

      return `<tr>
        <td><strong>${escHtml(s.name)}</strong></td>
        <td>${statusBadge}</td>
        <td>${s.startDate || '?'} / ${s.endDate || '?'}</td>
        <td><strong>${completedSP}</strong> / ${totalSP} SP</td>
        <td>${est} sa</td>
        <td>${spent} sa</td>
      </tr>`;
    }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">Sprint yok</td></tr>';

    sprintWrap.innerHTML = `
      <table class="reports-table">
        <thead>
          <tr>
            <th>Sprint Adı</th>
            <th>Durum</th>
            <th>Tarih Aralığı</th>
            <th>Hız (SP)</th>
            <th>Planlanan</th>
            <th>Harcanan</th>
          </tr>
        </thead>
        <tbody>
          ${sprintRows}
        </tbody>
      </table>
    `;
  }
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
  link.setAttribute("download", `kanban-rapor-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.exportToCSV = exportToCSV;

// ── Filter assignee refresh ──────────────────────────────
function refreshAssigneeFilter(cards) {
  if (typeof populateAssigneeSelects === 'function') {
    populateAssigneeSelects();
  }
  if (typeof populateEpicFilter === 'function') {
    populateEpicFilter();
  }
}
window.refreshAssigneeFilter = refreshAssigneeFilter;

// ── Quick Filters Bar render ──────────────────────────────
function renderQuickFilterBar(cards = window.cards || [], epics = window.epics || []) {
  const memberChipsEl = document.getElementById('memberFilterChips');
  const projectChipsEl = document.getElementById('projectFilterChips');
  const resetWrapEl = document.getElementById('filterResetWrap');
  const activeBadgeEl = document.getElementById('activeFilterBadge');
  if (!memberChipsEl && !projectChipsEl) return;

  const fa = (document.getElementById('filterAssignee')?.value || '').trim().toLowerCase();
  const fe = (document.getElementById('filterEpic')?.value || '').trim();
  const fp = (document.getElementById('filterPriority')?.value || '').trim();
  const q = (document.getElementById('searchInput')?.value || '').trim();

  // Active filter state (including Jira quick filters)
  const hasFilter = !!(fa || fe || fp || q || window._quickFilterOnlyMine || window._quickFilterRecent);
  if (resetWrapEl) {
    resetWrapEl.style.display = hasFilter ? 'flex' : 'none';
    if (activeBadgeEl && hasFilter) {
      const parts = [];
      if (window._quickFilterOnlyMine) parts.push('👤 Yalnızca benim işlerim');
      if (window._quickFilterRecent) parts.push('🕒 Son güncellenenler');
      if (fa) {
        if (fa === '__unassigned__') parts.push('👤 Atanmamış');
        else {
          const userObj = (window.users || []).find(u => (u.name || '').toLowerCase() === fa);
          parts.push(`👤 ${userObj ? userObj.name : fa}`);
        }
      }
      if (fe) {
        if (fe === '__none__') parts.push('📁 Projesiz');
        else {
          const epicObj = epics.find(e => e.id === fe);
          parts.push(`🏷️ ${epicObj ? epicObj.name : 'Proje'}`);
        }
      }
      if (fp) {
        const priLabels = { high: '🔴 Yüksek', medium: '🟠 Orta', low: '🟢 Düşük' };
        parts.push(`🎯 ${priLabels[fp] || fp}`);
      }
      if (q) parts.push(`🔍 "${q}"`);
      activeBadgeEl.textContent = `🎯 ${parts.join(' · ')}`;
    }
  }

  // 1. Render Member Avatar Chips (Jira standard circular avatars)
  if (memberChipsEl) {
    const rawUsers = (window.users && window.users.length) ? 
      window.users.map(u => u.name) : 
      [...new Set(cards.map(c => c.assignee).filter(Boolean))].sort();
    
    let chipsHTML = `<button type="button" class="filter-chip ${!fa ? 'active' : ''}" onclick="setPersonFilter('')" title="Tüm kişiler">
      👥 Herkes
    </button>`;

    rawUsers.forEach(name => {
      const count = cards.filter(c => (c.assignee || '').trim().toLowerCase() === name.trim().toLowerCase()).length;
      const isSelected = fa === name.trim().toLowerCase();
      const color = getAssigneeColor(name);
      const init = initials(name);
      chipsHTML += `<button type="button" class="jira-avatar-chip ${isSelected ? 'active' : ''}" style="background:${color}" onclick="setPersonFilter('${escHtml(name)}')" title="${escHtml(name)} (${count} görev)">
        ${escHtml(init)}
      </button>`;
    });

    const unassignedCount = cards.filter(c => !c.assignee).length;
    if (unassignedCount > 0) {
      const isSelected = fa === '__unassigned__';
      chipsHTML += `<button type="button" class="filter-chip ${isSelected ? 'active' : ''}" onclick="setPersonFilter('__unassigned__')" title="Atanmamış görevler">
        <span>Atanmamış</span>
        <span class="chip-count">${unassignedCount}</span>
      </button>`;
    }
    memberChipsEl.innerHTML = chipsHTML;
  }

  // 2. Render Project (Epic) Chips
  if (projectChipsEl) {
    let projHTML = `<button type="button" class="filter-chip ${!fe ? 'active' : ''}" onclick="setProjectFilter('')">
      📁 Tümü
    </button>`;

    epics.forEach(e => {
      const count = cards.filter(c => c.epicId === e.id).length;
      const isSelected = fe === e.id;
      projHTML += `<button type="button" class="filter-chip ${isSelected ? 'active' : ''}" onclick="setProjectFilter('${e.id}')" title="${escHtml(e.name)} projesinin işlerini filtrele">
        <span class="chip-dot" style="background:${e.color || 'var(--accent)'}"></span>
        <span>${escHtml(e.name)}</span>
        <span class="chip-count">${count}</span>
      </button>`;
    });

    const unassignedEpicsCount = cards.filter(c => !c.epicId).length;
    if (unassignedEpicsCount > 0) {
      const isSelected = fe === '__none__';
      projHTML += `<button type="button" class="filter-chip ${isSelected ? 'active' : ''}" onclick="setProjectFilter('__none__')">
        <span>Projesiz</span>
        <span class="chip-count">${unassignedEpicsCount}</span>
      </button>`;
    }
    projectChipsEl.innerHTML = projHTML;
  }
}
window.renderQuickFilterBar = renderQuickFilterBar;

function setPersonFilter(name) {
  const el = document.getElementById('filterAssignee');
  if (el) {
    if (el.value.toLowerCase() === name.toLowerCase()) {
      el.value = '';
    } else {
      el.value = name;
    }
  }
  if (typeof renderAll === 'function') renderAll();
}
window.setPersonFilter = setPersonFilter;

// ── Drag & Drop ──────────────────────────────────────────
let dragId = null;

function onDragStart(e) {
  dragId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragId);
  }
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
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
  const container = e.currentTarget;
  container.classList.add('drag-over');

  const afterElement = getCardBelow(container, e.clientY);
  let ph = container.querySelector('.drop-placeholder');

  if (!ph) {
    ph = document.createElement('div');
    ph.className = 'drop-placeholder';
    if (afterElement) {
      container.insertBefore(ph, afterElement);
    } else {
      container.appendChild(ph);
    }
  } else {
    if (afterElement && ph.nextElementSibling !== afterElement) {
      container.insertBefore(ph, afterElement);
    } else if (!afterElement && container.lastElementChild !== ph) {
      container.appendChild(ph);
    }
  }
}
window.onDragOver = onDragOver;

function onDragLeave(e) {
  if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
    return;
  }
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
  const approved = await showConfirm(`"${card.title}" silinsin mi?`, 'Görevi Sil');
  if (!approved) return;
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
  const myCards = cards.filter(c => c.assignee && c.assignee.trim().toLowerCase() === myName.trim().toLowerCase());
  
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
  
  const approved = await showConfirm(`"${card.title}" adlı görevi "${sprintName}" sprintine taşımak istiyor musunuz?`, 'Sprint Güncelleme');
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

// ── Epics View Render (Menu-driven) ────────────────────────
function renderEpicsView(cards = [], epics = []) {
  const container = document.getElementById('epicsView');
  if (!container) return;

  const totalEpics = epics.length;
  const cardsWithEpic = cards.filter(c => c.epicId);
  const doneWithEpic = cardsWithEpic.filter(c => c.col === 'done');
  const overallEpicPct = cardsWithEpic.length ? Math.round((doneWithEpic.length / cardsWithEpic.length) * 100) : 0;

  const epicsHtml = epics.map(epic => {
    const epicCards = cards.filter(c => c.epicId === epic.id);
    const todoCards = epicCards.filter(c => c.col === 'todo');
    const doingCards = epicCards.filter(c => c.col === 'doing');
    const doneCards = epicCards.filter(c => c.col === 'done');
    const pct = epicCards.length ? Math.round((doneCards.length / epicCards.length) * 100) : 0;
    const totalSP = epicCards.reduce((acc, c) => acc + (Number(c.storyPoints) || 0), 0);
    const totalEst = epicCards.reduce((acc, c) => acc + (Number(c.estimatedEffort) || 0), 0);
    const totalSpt = epicCards.reduce((acc, c) => acc + (Number(c.spentEffort) || 0), 0);

    const taskCardsList = epicCards.map(c => `
      <div class="epic-task-row" onclick="openCardDetail('${c.id}')">
        <span class="epic-task-key">${escHtml(c.key || 'TK')}</span>
        <span class="epic-task-title">${escHtml(c.title)}</span>
        <span class="status-pill status-${c.col}">${c.col === 'done' ? 'Tamamlandı' : c.col === 'doing' ? 'Yapılıyor' : 'Yapılacak'}</span>
        ${c.assignee ? `<span class="assignee-avatar" style="width:20px;height:20px;font-size:10px;background:${getAssigneeColor(c.assignee)}">${escHtml(initials(c.assignee))}</span>` : ''}
      </div>
    `).join('') || '<div class="text-muted" style="font-size:12px;padding:8px 0;">Bu epic altında henüz görev bulunmuyor.</div>';

    return `
      <div class="epic-manage-card">
        <div class="epic-card-header">
          <div class="epic-card-title-wrap">
            <span class="epic-color-bar" style="background:${epic.color || 'var(--primary)'}"></span>
            <div>
              <h3 class="epic-card-title">${escHtml(epic.name)}</h3>
              <div class="epic-card-meta">${epicCards.length} Görev · ${totalSP} SP · ${totalSpt}/${totalEst} sa</div>
            </div>
          </div>
          <div class="epic-card-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteEpic('${epic.id}')">Sil</button>
          </div>
        </div>
        <div class="epic-progress-section">
          <div class="progress-bar-label">
            <span>İlerleme: %${pct}</span>
            <span class="text-muted">${doneCards.length}/${epicCards.length} Tamamlandı</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${pct}%;background:${epic.color || 'var(--primary)'}"></div>
          </div>
        </div>
        <div class="epic-tasks-container">
          <div class="epic-tasks-header">Görevler (${epicCards.length})</div>
          <div class="epic-tasks-list">${taskCardsList}</div>
        </div>
      </div>
    `;
  }).join('') || '<div class="empty-state"><div class="empty-icon">🏷️</div><div>Henüz bir Epic oluşturulmamış.</div></div>';

  container.innerHTML = `
    <div class="manager-view-wrap">
      <div class="manager-view-header">
        <div>
          <h2 class="manager-view-title">🏷️ Epics Yönetimi</h2>
          <p class="manager-view-subtitle">Büyük hedefleri ve proje aşamalarını oluşturun, ilerlemelerini anlık takip edin.</p>
        </div>
        <div class="manager-quick-add">
          <input class="form-input" type="text" id="viewNewEpicName" placeholder="Yeni Epic adı…">
          <input class="form-input" type="color" id="viewNewEpicColor" value="#6366f1" style="width:44px;padding:2px 4px;cursor:pointer;height:36px;">
          <button class="btn btn-primary btn-sm" id="viewAddEpicBtn">✚ Epic Ekle</button>
        </div>
      </div>

      <div class="manager-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Toplam Epic</div>
          <div class="kpi-value">${totalEpics}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Epic Görevleri</div>
          <div class="kpi-value">${cardsWithEpic.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Tamamlanan Görevler</div>
          <div class="kpi-value text-success">${doneWithEpic.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Genel İlerleme</div>
          <div class="kpi-value">${overallEpicPct}%</div>
        </div>
      </div>

      <div class="epics-grid">${epicsHtml}</div>
    </div>
  `;

  const btn = document.getElementById('viewAddEpicBtn');
  if (btn) {
    btn.onclick = async () => {
      const name = (document.getElementById('viewNewEpicName')?.value || '').trim();
      const color = document.getElementById('viewNewEpicColor')?.value || '#6366f1';
      if (!name) return;
      try {
        const epic = await API.addEpic({ name, color });
        epics.push(epic);
        renderEpicsView(cards, epics);
        if (typeof renderAll === 'function') renderAll();
        showToast('Epic eklendi');
      } catch {
        showToast('Epic eklenemedi', 'error');
      }
    };
  }
}
window.renderEpicsView = renderEpicsView;

// ── Sprints View Render (Menu-driven, 104 Weeks for 2026-2027) ──
window._sprintFilter = window._sprintFilter || 'all';
window._sprintSearch = window._sprintSearch || '';

function renderSprintsView(cards = [], sprints = []) {
  const container = document.getElementById('sprintsView');
  if (!container) return;

  const activeSprint = sprints.find(s => s.active);
  const completedSprints = sprints.filter(s => {
    if (s.active) return false;
    const sc = cards.filter(c => c.sprintId === s.id);
    return sc.length > 0 && sc.every(c => c.col === 'done');
  });
  const futureSprints = sprints.filter(s => !s.active && !completedSprints.includes(s));

  // Filtered sprint list
  let filtered = sprints;
  if (window._sprintFilter === 'active') {
    filtered = sprints.filter(s => s.active);
  } else if (window._sprintFilter === 'completed') {
    filtered = completedSprints;
  } else if (window._sprintFilter === 'future') {
    filtered = futureSprints;
  }

  if (window._sprintSearch.trim()) {
    const q = window._sprintSearch.toLowerCase().trim();
    filtered = filtered.filter(s => 
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.startDate && s.startDate.includes(q)) ||
      (s.endDate && s.endDate.includes(q))
    );
  }

  // Active Hero HTML
  let heroHtml = '';
  if (activeSprint) {
    const aCards = cards.filter(c => c.sprintId === activeSprint.id);
    const aDone = aCards.filter(c => c.col === 'done');
    const aDoing = aCards.filter(c => c.col === 'doing');
    const aTodo = aCards.filter(c => c.col === 'todo');
    const aPct = aCards.length ? Math.round((aDone.length / aCards.length) * 100) : 0;
    const aSP = aCards.reduce((acc, c) => acc + (Number(c.storyPoints) || 0), 0);

    heroHtml = `
      <div class="active-sprint-hero">
        <div class="active-sprint-hero-header">
          <div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="sprint-active-badge" style="font-size:12px;padding:3px 10px;">🟢 Aktif Sprint</span>
              <h3 style="font-size:18px;font-weight:800;margin:0;">${escHtml(activeSprint.name)}</h3>
            </div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px;">
              📅 ${activeSprint.startDate || '—'} → ${activeSprint.endDate || '—'} &nbsp;·&nbsp; 
              <strong>${aCards.length} Görev</strong> &nbsp;·&nbsp; ${aSP} Story Points
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-success btn-sm" onclick="openCompleteSprintModal('${activeSprint.id}')" style="font-weight:600;">🏁 Sprinti Tamamla</button>
            <button class="btn btn-secondary btn-sm" onclick="switchView('board')">📋 Board'a Git</button>
            <button class="btn btn-secondary btn-sm" onclick="switchView('backlog')">📦 Backlog'a Git</button>
          </div>
        </div>
        <div>
          <div class="progress-bar-label">
            <span>Tamamlanma Oranı: %${aPct}</span>
            <span>${aDone.length} Tamamlandı · ${aDoing.length} Yapılıyor · ${aTodo.length} Yapılacak</span>
          </div>
          <div class="progress-bar-track" style="height:10px;">
            <div class="progress-bar-fill" style="width:${aPct}%;background:linear-gradient(90deg, #4f46e5, #10b981)"></div>
          </div>
        </div>
      </div>
    `;
  }

  // Table rows
  const rowsHtml = filtered.map(s => {
    const sCards = cards.filter(c => c.sprintId === s.id);
    const sDone = sCards.filter(c => c.col === 'done');
    const sPct = sCards.length ? Math.round((sDone.length / sCards.length) * 100) : 0;
    const sSP = sCards.reduce((acc, c) => acc + (Number(c.storyPoints) || 0), 0);
    const isCompleted = s.status === 'closed' || completedSprints.includes(s);

    let statusPill = '';
    if (s.active) {
      statusPill = '<span class="status-pill status-doing" style="font-weight:700;">🟢 Aktif</span>';
    } else if (s.status === 'closed') {
      statusPill = '<span class="status-pill status-done">🏁 Kapatıldı</span>';
    } else if (isCompleted) {
      statusPill = '<span class="status-pill status-done">✅ Tamamlandı</span>';
    } else {
      statusPill = '<span class="status-pill status-todo">📅 Planlandı</span>';
    }

    return `
      <tr>
        <td style="font-weight:700;">
          ${escHtml(s.name)}
        </td>
        <td>${statusPill}</td>
        <td style="color:var(--text-secondary);font-size:12px;">
          ${s.startDate || '—'} → ${s.endDate || '—'}
        </td>
        <td><strong>${sCards.length}</strong> <span style="color:var(--text-muted);font-size:11px;">(${sSP} SP)</span></td>
        <td style="min-width:140px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="progress-bar-track" style="height:6px;flex:1;">
              <div class="progress-bar-fill" style="width:${sPct}%;background:${s.active ? 'var(--primary)' : isCompleted ? 'var(--success)' : '#94a3b8'}"></div>
            </div>
            <span style="font-size:11px;font-weight:600;min-width:32px;">%${sPct}</span>
          </div>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex;gap:6px;">
            ${s.active ? `<button class="btn btn-sm btn-success" onclick="openCompleteSprintModal('${s.id}')">🏁 Tamamla</button>` : ''}
            ${(!s.active && !isCompleted) ? `<button class="btn btn-sm btn-secondary" onclick="activateSprint('${s.id}')">Aktif Yap</button>` : ''}
            ${(isCompleted || s.report) ? `<button class="btn btn-sm btn-outline-primary" onclick="openSprintReportModal('${s.id}')" title="Retrospektif Kapanış Raporunu İncele">📊 Rapor</button>` : ''}
            <button class="btn btn-sm btn-danger" onclick="deleteSprint('${s.id}')">Sil</button>
          </div>
        </td>
      </tr>
    `;
  }).join('') || `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted);">Eşleşen sprint bulunamadı</td></tr>`;

  container.innerHTML = `
    <div class="manager-view-wrap">
      <div class="manager-view-header">
        <div>
          <h2 class="manager-view-title">⚡ Sprint Yönetimi (2026 - 2027)</h2>
          <p class="manager-view-subtitle">104 haftalık sprint döngüsü (31 Aralık 2027 sonuna kadar) ve takım hedefleri.</p>
        </div>
        <div class="manager-quick-add">
          <input class="form-input" type="text" id="viewNewSprintName" placeholder="Sprint adı (ör. Sprint 105)" style="min-width:170px;">
          <input class="form-input" type="date" id="viewNewSprintStart" title="Başlangıç">
          <input class="form-input" type="date" id="viewNewSprintEnd" title="Bitiş">
          <button class="btn btn-primary btn-sm" id="viewAddSprintBtn">✚ Sprint Ekle</button>
        </div>
      </div>

      <div class="manager-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Toplam Sprint</div>
          <div class="kpi-value">${sprints.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Aktif Sprint</div>
          <div class="kpi-value text-primary">${activeSprint ? activeSprint.name : 'Yok'}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Tamamlanan Sprintler</div>
          <div class="kpi-value text-success">${completedSprints.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Planlanan Sprintler</div>
          <div class="kpi-value">${futureSprints.length}</div>
        </div>
      </div>

      ${heroHtml}

      <div class="sprints-toolbar">
        <div class="sprint-filters-wrap">
          <button class="sprint-filter-pill ${window._sprintFilter === 'all' ? 'active' : ''}" data-filter="all">Tümü (${sprints.length})</button>
          <button class="sprint-filter-pill ${window._sprintFilter === 'active' ? 'active' : ''}" data-filter="active">🟢 Aktif (${activeSprint ? 1 : 0})</button>
          <button class="sprint-filter-pill ${window._sprintFilter === 'completed' ? 'active' : ''}" data-filter="completed">✅ Tamamlanan (${completedSprints.length})</button>
          <button class="sprint-filter-pill ${window._sprintFilter === 'future' ? 'active' : ''}" data-filter="future">📅 Planlanan (${futureSprints.length})</button>
        </div>
        <div style="flex:1;max-width:320px;">
          <input class="form-input" type="text" id="sprintSearchInput" value="${escHtml(window._sprintSearch)}" placeholder="🔍 Sprint veya tarih ara…">
        </div>
      </div>

      <div class="sprints-table-container">
        <table class="sprints-table">
          <thead>
            <tr>
              <th>Sprint</th>
              <th>Durum</th>
              <th>Tarih Aralığı</th>
              <th>Görev Sayısı</th>
              <th>İlerleme</th>
              <th style="text-align:right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>
  `;

  // Attach filter pill listeners
  container.querySelectorAll('.sprint-filter-pill').forEach(btn => {
    btn.onclick = () => {
      window._sprintFilter = btn.dataset.filter;
      renderSprintsView(cards, sprints);
    };
  });

  // Attach search listener
  const sInput = document.getElementById('sprintSearchInput');
  if (sInput) {
    sInput.oninput = (e) => {
      window._sprintSearch = e.target.value;
      renderSprintsView(cards, sprints);
      const newInput = document.getElementById('sprintSearchInput');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    };
  }

  // Attach add sprint listener
  const addBtn = document.getElementById('viewAddSprintBtn');
  if (addBtn) {
    addBtn.onclick = async () => {
      const name = (document.getElementById('viewNewSprintName')?.value || '').trim();
      const startDate = document.getElementById('viewNewSprintStart')?.value || '';
      const endDate = document.getElementById('viewNewSprintEnd')?.value || '';
      if (!name) return;
      try {
        const sp = await API.addSprint({ name, startDate, endDate });
        sprints.push(sp);
        renderSprintsView(cards, sprints);
        if (typeof renderAll === 'function') renderAll();
        showToast('Sprint eklendi');
      } catch {
        showToast('Sprint eklenemedi', 'error');
      }
    };
  }
}
window.renderSprintsView = renderSprintsView;

// ── Labels View Render (Menu-driven) ───────────────────────
function renderLabelsView(cards = [], labels = []) {
  const container = document.getElementById('labelsView');
  if (!container) return;

  const totalLabels = labels.length;
  const cardsWithLabels = cards.filter(c => c.labels && c.labels.length > 0);

  const labelsHtml = labels.map(label => {
    const labelCards = cards.filter(c => (c.labels || []).includes(label.id));
    return `
      <div class="label-manage-card">
        <div class="label-card-left">
          <span class="label-color-indicator" style="background:${label.color || '#6366f1'}"></span>
          <div>
            <div class="label-card-name">${escHtml(label.name)}</div>
            <div class="label-card-sub">${labelCards.length} görevde kullanılıyor</div>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-danger" onclick="deleteLabel('${label.id}')">✕ Sil</button>
        </div>
      </div>
    `;
  }).join('') || '<div class="empty-state"><div class="empty-icon">🎨</div><div>Henüz etiket bulunmuyor.</div></div>';

  container.innerHTML = `
    <div class="manager-view-wrap">
      <div class="manager-view-header">
        <div>
          <h2 class="manager-view-title">🎨 Etiket Yönetimi</h2>
          <p class="manager-view-subtitle">Görevleri kategorilere ayırmak ve filtrelemek için etiketleri yönetin.</p>
        </div>
        <div class="manager-quick-add">
          <input class="form-input" type="text" id="viewNewLabelName" placeholder="Etiket adı (ör. Finans, API)…">
          <input class="form-input" type="color" id="viewNewLabelColor" value="#6366f1" style="width:44px;padding:2px 4px;cursor:pointer;height:36px;">
          <button class="btn btn-primary btn-sm" id="viewAddLabelBtn">✚ Etiket Ekle</button>
        </div>
      </div>

      <div class="manager-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Toplam Etiket</div>
          <div class="kpi-value">${totalLabels}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Etiketli Görevler</div>
          <div class="kpi-value">${cardsWithLabels.length}</div>
        </div>
      </div>

      <div class="labels-grid-view">${labelsHtml}</div>
    </div>
  `;

  const btn = document.getElementById('viewAddLabelBtn');
  if (btn) {
    btn.onclick = async () => {
      const name = (document.getElementById('viewNewLabelName')?.value || '').trim();
      const color = document.getElementById('viewNewLabelColor')?.value || '#6366f1';
      if (!name) return;
      try {
        const l = await API.addLabel({ name, color });
        labels.push(l);
        window.LABELS = labels;
        window.LABEL_MAP = Object.fromEntries(labels.map(x => [x.id, x]));
        renderLabelsView(cards, labels);
        if (typeof renderAll === 'function') renderAll();
        showToast('Etiket eklendi');
      } catch {
        showToast('Etiket eklenemedi', 'error');
      }
    };
  }
}
window.renderLabelsView = renderLabelsView;

// ── Team View Render (Menu-driven) ─────────────────────────
function renderTeamView(users = [], cards = []) {
  const container = document.getElementById('teamView');
  if (!container) return;

  const teamUsers = (users && users.length > 0) ? users : (window.users || []);
  const totalCards = cards.length;
  const doneCards = cards.filter(c => c.col === 'done').length;
  const overallPct = totalCards ? Math.round((doneCards / totalCards) * 100) : 0;

  const membersHtml = teamUsers.map(u => {
    const uCards = cards.filter(c => {
      const a = (c.assignee || '').toLowerCase().trim();
      return a === (u.name || '').toLowerCase().trim() || a === (u.username || '').toLowerCase().trim();
    });
    const uDone = uCards.filter(c => c.col === 'done');
    const uDoing = uCards.filter(c => c.col === 'doing');
    const uTodo = uCards.filter(c => c.col === 'todo');
    const uPct = uCards.length ? Math.round((uDone.length / uCards.length) * 100) : 0;
    const uSP = uCards.reduce((acc, c) => acc + (Number(c.storyPoints) || 0), 0);

    let roleBadge = '<span class="status-pill status-todo">Üye</span>';
    if (u.role === 'superadmin') roleBadge = '<span class="status-pill" style="background:rgba(234,179,8,0.15);color:#d97706;font-weight:700;">Super Admin</span>';
    else if (u.role === 'admin') roleBadge = '<span class="status-pill status-doing" style="font-weight:700;">Admin</span>';

    return `
      <div class="team-member-card">
        <div class="team-member-header">
          <div class="team-avatar-lg" style="background:${u.avatarColor || getAssigneeColor(u.name)}">
            ${escHtml(initials(u.name || u.username))}
          </div>
          <div class="team-member-info">
            <div class="team-member-name">${escHtml(u.name || u.username)}</div>
            <div class="team-member-role">${escHtml(u.username || '')} · ${roleBadge}</div>
          </div>
        </div>

        <div class="team-stats-breakdown">
          <span><strong>${uCards.length}</strong> Görev (${uSP} SP)</span>
          <span><strong class="text-success">${uDone.length}</strong> Bitti · <strong class="text-warning">${uDoing.length}</strong> Sürüyor</span>
        </div>

        <div>
          <div class="progress-bar-label">
            <span>Tamamlanma Oranı: %${uPct}</span>
          </div>
          <div class="progress-bar-track" style="height:6px;">
            <div class="progress-bar-fill" style="width:${uPct}%;background:${u.avatarColor || 'var(--primary)'}"></div>
          </div>
        </div>
      </div>
    `;
  }).join('') || '<div class="empty-state"><div class="empty-icon">👥</div><div>Takım üyesi bulunmuyor.</div></div>';

  container.innerHTML = `
    <div class="manager-view-wrap">
      <div class="manager-view-header">
        <div>
          <h2 class="manager-view-title">👥 Takım & Kullanıcı Yönetimi</h2>
          <p class="manager-view-subtitle">Takım üyeleri, görev dağılımları ve sprint performansları.</p>
        </div>
      </div>

      <div class="manager-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Toplam Takım Üyesi</div>
          <div class="kpi-value">${teamUsers.length}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Toplam Görev Dağılımı</div>
          <div class="kpi-value">${totalCards}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Kişi Başı Ortalama</div>
          <div class="kpi-value">${Math.round(totalCards / (teamUsers.length || 1))} Görev</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Takım Tamamlama Oranı</div>
          <div class="kpi-value text-success">${overallPct}%</div>
        </div>
      </div>

      <div class="team-grid-view">${membersHtml}</div>
    </div>
  `;
}
window.renderTeamView = renderTeamView;

// ── Custom Application Confirm Dialog ──────────────────────
function showConfirm(message, title = 'Onay Gerekli') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    const box = document.createElement('div');
    box.className = 'confirm-box';
    
    box.innerHTML = `
      <div class="confirm-header">
        <h3 class="confirm-title">${escHtml(title)}</h3>
        <button class="confirm-close" type="button">✕</button>
      </div>
      <div class="confirm-body">
        <p>${escHtml(message)}</p>
      </div>
      <div class="confirm-actions">
        <button class="btn btn-secondary confirm-cancel-btn" type="button">İptal</button>
        <button class="btn btn-danger confirm-ok-btn" type="button">Onayla</button>
      </div>
    `;
    
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.classList.add('open');
      box.classList.add('open');
    }, 10);
    
    const close = (approved) => {
      overlay.classList.remove('open');
      box.classList.remove('open');
      setTimeout(() => {
        overlay.remove();
        resolve(approved);
      }, 200);
    };
    
    box.querySelector('.confirm-close').onclick = () => close(false);
    box.querySelector('.confirm-cancel-btn').onclick = () => close(false);
    box.querySelector('.confirm-ok-btn').onclick = () => close(true);
    
    overlay.onclick = (e) => {
      if (e.target === overlay) close(false);
    };
  });
}
window.showConfirm = showConfirm;

// ── Custom Application Alert Dialog ────────────────────────
function showAlert(message, title = 'Bilgi') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    const box = document.createElement('div');
    box.className = 'confirm-box';
    
    const lines = message.split('\n');
    const formattedMessage = lines.map(line => escHtml(line)).join('<br>');
    
    box.innerHTML = `
      <div class="confirm-header">
        <h3 class="confirm-title">${escHtml(title)}</h3>
        <button class="confirm-close" type="button">✕</button>
      </div>
      <div class="confirm-body">
        <p>${formattedMessage}</p>
      </div>
      <div class="confirm-actions">
        <button class="btn btn-primary confirm-ok-btn" type="button" style="padding: 6px 16px;">Kapat</button>
      </div>
    `;
    
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.classList.add('open');
      box.classList.add('open');
    }, 10);
    
    const close = () => {
      overlay.classList.remove('open');
      box.classList.remove('open');
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 200);
    };
    
    box.querySelector('.confirm-close').onclick = close;
    box.querySelector('.confirm-ok-btn').onclick = close;
    
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };
  });
}
window.showAlert = showAlert;

