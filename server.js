// ============================================================
//  Tiny Kanban – Express Server
// ============================================================
const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'cards.json');

// ── Ensure data directory & file exist ─────────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ cards: [] }, null, 2));

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Helpers ─────────────────────────────────────────────────
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch { return { cards: [] }; }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── REST API ─────────────────────────────────────────────────

// GET all cards
app.get('/api/cards', (req, res) => {
  const { cards } = readData();
  res.json(cards);
});

// POST – create card
app.post('/api/cards', (req, res) => {
  const { title, desc, assignee, priority, col } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' });
  const data = readData();
  const card = {
    id:        Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title:     title.trim(),
    desc:      (desc || '').trim(),
    assignee:  (assignee || '').trim(),
    priority:  priority || 'medium',
    col:       col || 'todo',
    createdAt: Date.now()
  };
  data.cards.push(card);
  writeData(data);
  res.status(201).json(card);
});

// PUT – update card (title, desc, assignee, priority, col)
app.put('/api/cards/:id', (req, res) => {
  const data = readData();
  const idx  = data.cards.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Card not found' });
  const allowed = ['title','desc','assignee','priority','col'];
  allowed.forEach(k => {
    if (req.body[k] !== undefined) data.cards[idx][k] = req.body[k];
  });
  writeData(data);
  res.json(data.cards[idx]);
});

// DELETE – remove card
app.delete('/api/cards/:id', (req, res) => {
  const data = readData();
  const before = data.cards.length;
  data.cards = data.cards.filter(c => c.id !== req.params.id);
  if (data.cards.length === before) return res.status(404).json({ error: 'Card not found' });
  writeData(data);
  res.json({ ok: true });
});

// ── Serve page routes ────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/board.html'));

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🟣 Tiny Kanban running at http://localhost:${PORT}\n`);
  console.log(`     My Board  → http://localhost:${PORT}/board.html`);
  console.log(`     Demo      → http://localhost:${PORT}/demo.html\n`);
});
