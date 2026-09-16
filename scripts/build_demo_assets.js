const fs = require('fs');
const path = require('path');
const { DEMO_TEAM_USERS, DEMO_EPICS, generateSprints, generateCards } = require('./generate_demo_data');

const sprints = generateSprints();
const cards = generateCards();

// 1. Build data/demo_db.json
const demoDb = {
    cards,
    epics: DEMO_EPICS,
    sprints,
    users: DEMO_TEAM_USERS,
    sessions: [
        {
            token: "4add03f5578b8a7b2443264bd5893215843da39ca9da2379",
            userId: "usr-2",
            expiresAt: 1893456000000
        }
    ],
    labels: [
        { id: "bug", name: "Bug", color: "#ef4444", bg: "#fef2f2", createdAt: 1767571200000 },
        { id: "feature", name: "Özellik", color: "#6366f1", bg: "#eef2ff", createdAt: 1767571200000 },
        { id: "task", name: "Görev", color: "#3b82f6", bg: "#eff6ff", createdAt: 1767571200000 },
        { id: "devops", name: "DevOps", color: "#0891b2", bg: "#ecfeff", createdAt: 1767571200000 },
        { id: "security", name: "Güvenlik", color: "#f97316", bg: "#fff7ed", createdAt: 1767571200000 },
        { id: "backend", name: "Backend", color: "#10b981", bg: "#ecfdf5", createdAt: 1767571200000 },
        { id: "frontend", name: "Frontend", color: "#0ea5e9", bg: "#f0f9ff", createdAt: 1767571200000 },
        { id: "mobile", name: "Mobil", color: "#22c55e", bg: "#f0fdf4", createdAt: 1767571200000 },
        { id: "qa", name: "Test & QA", color: "#ec4899", bg: "#fdf2f8", createdAt: 1767571200000 },
        { id: "analytics", name: "Analitik", color: "#14b8a6", bg: "#f0fdfa", createdAt: 1767571200000 },
        { id: "ai", name: "Yapay Zeka", color: "#a855f7", bg: "#faf5ff", createdAt: 1767571200000 },
        { id: "design", name: "Tasarım", color: "#8b5cf6", bg: "#f5f3ff", createdAt: 1767571200000 },
        { id: "docs", name: "Dokümantasyon", color: "#64748b", bg: "#f8fafc", createdAt: 1767571200000 }
    ],
    notifications: [],
    taskCounter: cards.length,
    workspaces: [
        {
            id: "demo",
            name: "Demo Panosu (Nova Takımı)",
            type: "team",
            ownerId: "usr-1",
            createdAt: 1767571200000
        }
    ]
};

const demoDbPath = path.join(__dirname, '..', 'data', 'demo_db.json');
fs.writeFileSync(demoDbPath, JSON.stringify(demoDb, null, 2), 'utf8');
console.log(`Updated ${demoDbPath} with ${cards.length} cards, ${sprints.length} sprints, ${DEMO_EPICS.length} epics, and ${DEMO_TEAM_USERS.length} team members.`);

// 2. Update data/tenants_index.json
const tenantsIndexPath = path.join(__dirname, '..', 'data', 'tenants_index.json');
if (fs.existsSync(tenantsIndexPath)) {
    const tenantsIndex = JSON.parse(fs.readFileSync(tenantsIndexPath, 'utf8'));
    DEMO_TEAM_USERS.forEach(u => {
        tenantsIndex.userToTenants[u.username] = Array.from(new Set([...(tenantsIndex.userToTenants[u.username] || []), 'demo']));
    });
    fs.writeFileSync(tenantsIndexPath, JSON.stringify(tenantsIndex, null, 2), 'utf8');
    console.log(`Updated ${tenantsIndexPath} userToTenants for all 10 demo team members.`);
}

// 3. Generate public/js/seeder.js
const seederContent = `// ============================================================
//  seeder.js – 2026-2027 Calendar Years Dummy Data Seeder
//  Nova Takımı: 10 Kişilik Çapraz Fonksiyonel Ekip & 52 Sprint
// ============================================================

const SEED_VERSION = '2026-2027-v2';

const DEMO_TEAM_USERS = ${JSON.stringify(DEMO_TEAM_USERS.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    avatarColor: u.avatarColor
})), null, 4)};

const DEMO_EPICS = ${JSON.stringify(DEMO_EPICS, null, 4)};

const DEMO_SPRINTS = ${JSON.stringify(sprints, null, 4)};

const DEMO_CARDS = ${JSON.stringify(cards, null, 4)};

const DEMO_LABELS = ${JSON.stringify(demoDb.labels, null, 4)};

function seed2026Data(force = false) {
    const IS_DEMO = window.location.pathname.includes('demo.html');
    const LS_KEY = IS_DEMO ? 'tiny_kanban_demo_db' : 'tiny_kanban_db';

    // Only seed if localStorage is empty or version mismatch or force is true
    if (!force) {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.version === SEED_VERSION && parsed.cards && parsed.cards.length >= 30 && parsed.sprints && parsed.sprints.length >= 52) {
                    return; // Up to date
                }
            }
        } catch (e) {
            console.error('Error checking localStorage database existence', e);
        }
    }

    console.log(\`Seeding database "\${LS_KEY}" with 2026-2027 Nova Team project data (52 sprints, 10 users)...\`);

    const data = {
        version: SEED_VERSION,
        cards: DEMO_CARDS,
        epics: DEMO_EPICS,
        sprints: DEMO_SPRINTS,
        users: DEMO_TEAM_USERS,
        labels: DEMO_LABELS
    };

    localStorage.setItem(LS_KEY, JSON.stringify(data));
    console.log('Database successfully seeded for 2026-2027 with 10-person Nova Team!');
}

// Auto seed demo if we're on demo.html
if (window.location.pathname.includes('demo.html')) {
    seed2026Data(false);
}
`;

const seederPath = path.join(__dirname, '..', 'public', 'js', 'seeder.js');
fs.writeFileSync(seederPath, seederContent, 'utf8');
console.log(`Updated ${seederPath}`);
