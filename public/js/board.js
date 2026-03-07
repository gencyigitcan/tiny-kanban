// ============================================================
//  board.js – shared board logic (render, drag&drop, modal)
//  Used by board.html (server mode) and demo.html (static mode)
// ============================================================

/* ------ Utilities ----------------------------------------- */
function initials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function escHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function showToast(msg, type = '') {
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = msg;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3100);
}

/* ------ Card HTML ----------------------------------------- */
function cardHTML(card, readonly = false) {
    const priLabel = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };
    const actions = readonly ? '' : `
    <div class="card-actions">
      <button class="card-btn edit" title="Düzenle" onclick="openEdit('${card.id}')">✏️</button>
      <button class="card-btn del"  title="Sil"     onclick="doDelete('${card.id}')">✕</button>
    </div>`;
    return `
  <div class="card pri-${card.priority}${readonly ? ' readonly' : ''}"
       id="card-${card.id}" data-id="${card.id}"
       ${readonly ? '' : `draggable="true" ondragstart="onDragStart(event)" ondragend="onDragEnd(event)"`}>
    <div class="card-priority-bar"></div>
    <div class="card-top">
      <p class="card-title">${escHtml(card.title)}</p>
      ${actions}
    </div>
    ${card.desc ? `<p class="card-desc">${escHtml(card.desc)}</p>` : ''}
    <div class="card-footer">
      ${card.assignee
            ? `<span class="card-assignee">
             <span class="assignee-avatar">${escHtml(initials(card.assignee))}</span>
             ${escHtml(card.assignee)}
           </span>`
            : '<span></span>'}
      <span class="card-priority-tag">${priLabel[card.priority] || card.priority}</span>
    </div>
  </div>`;
}

/* ------ Render -------------------------------------------- */
function renderBoard(cards, readonly = false) {
    const cols = ['todo', 'doing', 'done'];
    const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const fa = (document.getElementById('filterAssignee')?.value || '').toLowerCase();
    const fp = document.getElementById('filterPriority')?.value || '';

    cols.forEach(col => {
        const body = document.getElementById('col-' + col);
        if (!body) return;

        // Remove existing cards
        body.querySelectorAll('.card').forEach(el => el.remove());
        const emptyState = body.querySelector('.empty-state');

        const colCards = cards.filter(c => c.col === col);
        const frag = document.createDocumentFragment();
        const tmp = document.createElement('div');

        colCards.forEach(card => {
            const hidden = (
                (q && !card.title.toLowerCase().includes(q)
                    && !(card.desc || '').toLowerCase().includes(q)
                    && !(card.assignee || '').toLowerCase().includes(q)) ||
                (fa && (card.assignee || '').toLowerCase() !== fa) ||
                (fp && card.priority !== fp)
            );
            tmp.innerHTML = cardHTML(card, readonly);
            const el = tmp.firstElementChild;
            if (hidden) el.classList.add('hidden');
            frag.appendChild(el);
        });
        body.appendChild(frag);

        if (emptyState) emptyState.style.display = colCards.length === 0 ? 'flex' : 'none';
        const countEl = document.querySelector(`[data-count="${col}"]`);
        if (countEl) countEl.textContent = colCards.length;
    });

    refreshAssigneeFilter(cards);
}

function refreshAssigneeFilter(cards) {
    const sel = document.getElementById('filterAssignee');
    if (!sel) return;
    const cur = sel.value;
    const names = [...new Set(cards.map(c => c.assignee).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Tüm kişiler</option>' +
        names.map(n => `<option value="${n.toLowerCase()}" ${cur.toLowerCase() === n.toLowerCase() ? 'selected' : ''}>${escHtml(n)}</option>`).join('');
}

/* ------ Drag & Drop --------------------------------------- */
let dragId = null;
let _cards = [];   // reference set by each page

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
    if (target) e.currentTarget.insertBefore(ph, target);
    else e.currentTarget.appendChild(ph);
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
