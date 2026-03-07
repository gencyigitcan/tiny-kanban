// ============================================================
//  Tiny Kanban – Express Server (Jira-extended)
// ============================================================
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// ── Ensure data directory & file exist ─────────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ cards: [], epics: [], sprints: [] }, null, 2));
}

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Helpers ─────────────────────────────────────────────────
function readData() {
  try {
    const d = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!d.cards) d.cards = [];
    if (!d.epics) d.epics = [];
    if (!d.sprints) d.sprints = [];
    return d;
  } catch { return { cards: [], epics: [], sprints: [] }; }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── CARDS ────────────────────────────────────────────────────
app.get('/api/cards', (req, res) => res.json(readData().cards));

app.post('/api/cards', (req, res) => {
  const { title, desc, assignee, priority, col,
    startDate, dueDate, labels, storyPoints, subtasks, epicId, sprintId } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
  const data = readData();
  const card = {
    id: uid(),
    title: title.trim(),
    desc: (desc || '').trim(),
    assignee: (assignee || '').trim(),
    priority: priority || 'medium',
    col: col || 'todo',
    startDate: startDate || null,
    dueDate: dueDate || null,
    labels: Array.isArray(labels) ? labels : [],
    storyPoints: storyPoints ? Number(storyPoints) : null,
    subtasks: Array.isArray(subtasks) ? subtasks : [],
    comments: [],
    epicId: epicId || null,
    sprintId: sprintId || null,
    createdAt: Date.now()
  };
  data.cards.push(card);
  writeData(data);
  res.status(201).json(card);
});

app.put('/api/cards/:id', (req, res) => {
  const data = readData();
  const idx = data.cards.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Card not found' });
  const allowed = ['title', 'desc', 'assignee', 'priority', 'col',
    'startDate', 'dueDate', 'labels', 'storyPoints', 'subtasks', 'comments', 'epicId', 'sprintId'];
  allowed.forEach(k => { if (req.body[k] !== undefined) data.cards[idx][k] = req.body[k]; });
  writeData(data);
  res.json(data.cards[idx]);
});

app.delete('/api/cards/:id', (req, res) => {
  const data = readData();
  const before = data.cards.length;
  data.cards = data.cards.filter(c => c.id !== req.params.id);
  if (data.cards.length === before) return res.status(404).json({ error: 'Not found' });
  writeData(data);
  res.json({ ok: true });
});

// ── EPICS ────────────────────────────────────────────────────
app.get('/api/epics', (req, res) => res.json(readData().epics));

app.post('/api/epics', (req, res) => {
  const { name, color } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
  const data = readData();
  const epic = { id: uid(), name: name.trim(), color: color || '#6366f1', createdAt: Date.now() };
  data.epics.push(epic);
  writeData(data);
  res.status(201).json(epic);
});

app.put('/api/epics/:id', (req, res) => {
  const data = readData();
  const idx = data.epics.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Epic not found' });
  ['name', 'color'].forEach(k => { if (req.body[k] !== undefined) data.epics[idx][k] = req.body[k]; });
  writeData(data);
  res.json(data.epics[idx]);
});

app.delete('/api/epics/:id', (req, res) => {
  const data = readData();
  data.epics = data.epics.filter(e => e.id !== req.params.id);
  data.cards.forEach(c => { if (c.epicId === req.params.id) c.epicId = null; });
  writeData(data);
  res.json({ ok: true });
});

// ── SPRINTS ──────────────────────────────────────────────────
app.get('/api/sprints', (req, res) => res.json(readData().sprints));

app.post('/api/sprints', (req, res) => {
  const { name, startDate, endDate } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
  const data = readData();
  const sprint = { id: uid(), name: name.trim(), startDate: startDate || null, endDate: endDate || null, active: false, createdAt: Date.now() };
  data.sprints.push(sprint);
  writeData(data);
  res.status(201).json(sprint);
});

app.put('/api/sprints/:id', (req, res) => {
  const data = readData();
  const idx = data.sprints.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Sprint not found' });
  // Only one active sprint at a time
  if (req.body.active === true) data.sprints.forEach(s => { s.active = false; });
  ['name', 'startDate', 'endDate', 'active'].forEach(k => {
    if (req.body[k] !== undefined) data.sprints[idx][k] = req.body[k];
  });
  writeData(data);
  res.json(data.sprints[idx]);
});

app.delete('/api/sprints/:id', (req, res) => {
  const data = readData();
  data.sprints = data.sprints.filter(s => s.id !== req.params.id);
  data.cards.forEach(c => { if (c.sprintId === req.params.id) c.sprintId = null; });
  writeData(data);
  res.json({ ok: true });
});

// ── Root redirect ────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/board.html'));

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🟣 Tiny Kanban running at http://localhost:${PORT}\n`);
  console.log(`     My Board  → http://localhost:${PORT}/board.html`);
  console.log(`     Demo      → http://localhost:${PORT}/demo.html\n`);
});
