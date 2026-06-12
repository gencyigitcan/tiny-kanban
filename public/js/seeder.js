// ============================================================
//  seeder.js – Dynamic 2026 Calendar Year Dummy Data Seeder (Sprints 1-26)
// ============================================================

function seed2026Data(force = false) {
    const LS_KEY = window.location.pathname.includes('demo.html') ? 'tiny_kanban_demo_db' : 'tiny_kanban_db';

    // Only seed if localStorage is empty or force is true
    if (!force) {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.cards && parsed.cards.length > 0) {
                    return; // Already has data, don't overwrite
                }
            }
        } catch (e) {
            console.error('Error checking localStorage database existence', e);
        }
    }

    console.log(`Seeding database "${LS_KEY}" with 12-month 2026 Kanban project data...`);

    // Sprints defined dynamically to span the full calendar year 2026
    const sprints = [];
    let sprintStartDate = new Date('2026-01-05'); // Monday, Jan 5, 2026
    const today = new Date('2026-06-12'); // Target local date (June 12, 2026)

    for (let i = 1; i <= 26; i++) {
        const startStr = sprintStartDate.toISOString().slice(0, 10);
        const endDate = new Date(sprintStartDate);
        endDate.setDate(endDate.getDate() + 13);
        const endStr = endDate.toISOString().slice(0, 10);
        
        // Active sprint is Sprint 12 (June 8 - June 21, 2026)
        const active = today >= sprintStartDate && today <= endDate;
        
        sprints.push({
            id: `s${i}`,
            name: `Sprint ${i}`,
            startDate: startStr,
            endDate: endStr,
            active: active,
            createdAt: new Date(sprintStartDate).getTime() - 2 * 24 * 3600 * 1000 // 2 days before
        });
        
        sprintStartDate.setDate(sprintStartDate.getDate() + 14); // 2-week sprints
    }

    const epics = [
        { id: 'e1', name: 'Kullanıcı Yönetimi', color: '#6366f1', createdAt: Date.now() },
        { id: 'e2', name: 'Ödeme Entegrasyonu', color: '#f59e0b', createdAt: Date.now() },
        { id: 'e3', name: 'Mobil Uygulama', color: '#22c55e', createdAt: Date.now() },
        { id: 'e4', name: 'Dashboard & Raporlar', color: '#ef4444', createdAt: Date.now() },
        { id: 'e5', name: 'Altyapı & DevOps', color: '#0891b2', createdAt: Date.now() },
        { id: 'e6', name: 'Tasarım Sistemi', color: '#8b5cf6', createdAt: Date.now() }
    ];

    // Card details scattered over Sprints 1 to 26
    const cards = [
        // ── SPRINT 1 (Completed) ─────────────────────────
        {
            id: 'c101',
            title: 'Proje iskeletinin oluşturulması',
            desc: 'React + TypeScript ve temel dosya dizin yapısı oluşturuldu.',
            assignee: 'Mert',
            priority: 'high',
            col: 'done',
            startDate: '2026-01-05',
            dueDate: '2026-01-12',
            labels: ['devops'],
            storyPoints: 5,
            estimatedEffort: 16,
            spentEffort: 14,
            subtasks: [{ id: 'st1', text: 'Repo setup', done: true }, { id: 'st2', text: 'tsconfig ayarla', done: true }],
            comments: [],
            epicId: 'e5',
            sprintId: 's1',
            createdAt: new Date('2026-01-05').getTime()
        },
        {
            id: 'c102',
            title: 'CI/CD temel pipeline kurulumu',
            desc: 'GitHub Actions üzerinden linting ve test otomasyonu kuruldu.',
            assignee: 'Kerem',
            priority: 'medium',
            col: 'done',
            startDate: '2026-01-08',
            dueDate: '2026-01-18',
            labels: ['devops'],
            storyPoints: 3,
            estimatedEffort: 8,
            spentEffort: 10,
            subtasks: [],
            comments: [],
            epicId: 'e5',
            sprintId: 's1',
            createdAt: new Date('2026-01-08').getTime()
        },

        // ── SPRINT 2 (Completed) ─────────────────────────
        {
            id: 'c201',
            title: 'Tasarım token\'larının tanımlanması',
            desc: 'CSS custom properties ve renk paleti standartları belirlendi.',
            assignee: 'Selin',
            priority: 'medium',
            col: 'done',
            startDate: '2026-01-19',
            dueDate: '2026-01-26',
            labels: ['design'],
            storyPoints: 5,
            estimatedEffort: 16,
            spentEffort: 16,
            subtasks: [],
            comments: [],
            epicId: 'e6',
            sprintId: 's2',
            createdAt: new Date('2026-01-19').getTime()
        },
        {
            id: 'c202',
            title: 'Veritabanı ilişkisel ER tasarımı',
            desc: 'Kullanıcı, rol, fatura ve ödeme tablolarının şeması çizildi.',
            assignee: 'Ayşe',
            priority: 'high',
            col: 'done',
            startDate: '2026-01-20',
            dueDate: '2026-02-01',
            labels: ['task'],
            storyPoints: 8,
            estimatedEffort: 24,
            spentEffort: 28,
            subtasks: [{ id: 'st3', text: 'ER şeması', done: true }, { id: 'st4', text: 'Tablo migration scriptleri', done: true }],
            comments: [],
            epicId: 'e1',
            sprintId: 's2',
            createdAt: new Date('2026-01-20').getTime()
        },

        // ── SPRINT 3 (Completed) ─────────────────────────
        {
            id: 'c301',
            title: 'Kullanıcı giriş & kayıt API\'si',
            desc: 'JWT korumalı authentication sistemi ve endpoint testleri yazıldı.',
            assignee: 'Mert',
            priority: 'high',
            col: 'done',
            startDate: '2026-02-02',
            dueDate: '2026-02-12',
            labels: ['feature'],
            storyPoints: 13,
            estimatedEffort: 40,
            spentEffort: 36,
            subtasks: [{ id: 'st5', text: 'Giriş formu validasyonu', done: true }, { id: 'st6', text: 'JWT koruma middleware', done: true }],
            comments: [],
            epicId: 'e1',
            sprintId: 's3',
            createdAt: new Date('2026-02-02').getTime()
        },
        {
            id: 'c302',
            title: 'Şifre kurtarma akışının kodlanması',
            desc: 'Mail gönderim entegrasyonu ve şifre sıfırlama token sistemi.',
            assignee: 'Ayşe',
            priority: 'medium',
            col: 'done',
            startDate: '2026-02-05',
            dueDate: '2026-02-15',
            labels: ['feature'],
            storyPoints: 5,
            estimatedEffort: 16,
            spentEffort: 12,
            subtasks: [],
            comments: [],
            epicId: 'e1',
            sprintId: 's3',
            createdAt: new Date('2026-02-05').getTime()
        },

        // ── SPRINT 4 (Completed) ─────────────────────────
        {
            id: 'c401',
            title: 'Ödeme entegrasyonu (Stripe)',
            desc: 'Kredi kartı ile ödeme alma formları ve Stripe checkout API.',
            assignee: 'Ayşe',
            priority: 'high',
            col: 'done',
            startDate: '2026-02-16',
            dueDate: '2026-03-01',
            labels: ['feature'],
            storyPoints: 21,
            estimatedEffort: 60,
            spentEffort: 68, // Over-effort
            subtasks: [{ id: 'st7', text: 'Stripe API call', done: true }, { id: 'st8', text: 'Ödeme webhook dinleyici', done: true }],
            comments: [],
            epicId: 'e2',
            sprintId: 's4',
            createdAt: new Date('2026-02-16').getTime()
        },

        // ── SPRINT 5 (Completed) ─────────────────────────
        {
            id: 'c501',
            title: 'Mobil uygulama iskeleti (Expo)',
            desc: 'React Native + Expo boilerplate projesi ayağa kaldırıldı.',
            assignee: 'Mert',
            priority: 'high',
            col: 'done',
            startDate: '2026-03-02',
            dueDate: '2026-03-12',
            labels: ['feature'],
            storyPoints: 8,
            estimatedEffort: 24,
            spentEffort: 20,
            subtasks: [],
            comments: [],
            epicId: 'e3',
            sprintId: 's5',
            createdAt: new Date('2026-03-02').getTime()
        },

        // ── SPRINT 6 (Completed) ─────────────────────────
        {
            id: 'c601',
            title: 'FCM push bildirim sistemi',
            desc: 'Mobil push notification altyapısı ve bildirim izin ekranları.',
            assignee: 'Kerem',
            priority: 'high',
            col: 'done',
            startDate: '2026-03-16',
            dueDate: '2026-03-27',
            labels: ['feature'],
            storyPoints: 13,
            estimatedEffort: 32,
            spentEffort: 36, // Over-effort
            subtasks: [],
            comments: [],
            epicId: 'e3',
            sprintId: 's6',
            createdAt: new Date('2026-03-16').getTime()
        },

        // ── SPRINT 7 (Completed) ─────────────────────────
        {
            id: 'c701',
            title: 'Analitik Dashboard Tasarımı',
            desc: 'Yönetim paneli için temel gelir ve satış istatistik grafikleri.',
            assignee: 'Ayşe',
            priority: 'high',
            col: 'done',
            startDate: '2026-03-30',
            dueDate: '2026-04-10',
            labels: ['feature'],
            storyPoints: 13,
            estimatedEffort: 40,
            spentEffort: 40,
            subtasks: [],
            comments: [],
            epicId: 'e4',
            sprintId: 's7',
            createdAt: new Date('2026-03-30').getTime()
        },

        // ── SPRINT 8 (Completed) ─────────────────────────
        {
            id: 'c801',
            title: 'GDPR ve veri politikası uyumu',
            desc: 'Kullanıcı çerez onay pencereleri ve veri koruma sayfaları eklendi.',
            assignee: 'Selin',
            priority: 'low',
            col: 'done',
            startDate: '2026-04-13',
            dueDate: '2026-04-20',
            labels: ['docs'],
            storyPoints: 3,
            estimatedEffort: 8,
            spentEffort: 8,
            subtasks: [],
            comments: [],
            epicId: 'e1',
            sprintId: 's8',
            createdAt: new Date('2026-04-13').getTime()
        },

        // ── SPRINT 9 (Completed) ─────────────────────────
        {
            id: 'c901',
            title: 'Lighthouse performans iyileştirmeleri',
            desc: 'Asset sıkıştırma, lazy loading ve script optimizasyonları yapıldı.',
            assignee: 'Mert',
            priority: 'medium',
            col: 'done',
            startDate: '2026-04-27',
            dueDate: '2026-05-08',
            labels: ['devops'],
            storyPoints: 8,
            estimatedEffort: 24,
            spentEffort: 22,
            subtasks: [],
            comments: [],
            epicId: 'e5',
            sprintId: 's9',
            createdAt: new Date('2026-04-27').getTime()
        },

        // ── SPRINT 10 (Completed) ────────────────────────
        {
            id: 'c1001',
            title: 'E2E Test otomasyon kurulumu',
            desc: 'Playwright ile kritik giriş/ödeme akışlarının test suite entegrasyonu.',
            assignee: 'Kerem',
            priority: 'medium',
            col: 'done',
            startDate: '2026-05-11',
            dueDate: '2026-05-22',
            labels: ['test'],
            storyPoints: 8,
            estimatedEffort: 24,
            spentEffort: 26,
            subtasks: [],
            comments: [],
            epicId: 'e5',
            sprintId: 's10',
            createdAt: new Date('2026-05-11').getTime()
        },

        // ── SPRINT 11 (Completed) ────────────────────────
        {
            id: 'c1101',
            title: 'Karanlık tema (Dark Mode) entegrasyonu',
            desc: 'CSS custom properties üzerinden tema seçici düğme eklendi.',
            assignee: 'Selin',
            priority: 'low',
            col: 'done',
            startDate: '2026-05-25',
            dueDate: '2026-06-05',
            labels: ['design', 'feature'],
            storyPoints: 5,
            estimatedEffort: 16,
            spentEffort: 14,
            subtasks: [],
            comments: [],
            epicId: 'e6',
            sprintId: 's11',
            createdAt: new Date('2026-05-25').getTime()
        },

        // ── SPRINT 12 (ACTIVE SPRINT - June 8 to June 21, 2026) ─────
        {
            id: 'c1201',
            title: 'Gelişmiş Raporlama Modülü ve İstatistikler',
            desc: 'Efor takibi, sapma grafikleri ve sprint hız tabloları eklendi.',
            assignee: 'Ayşe',
            priority: 'high',
            col: 'doing',
            startDate: '2026-06-08',
            dueDate: '2026-06-18',
            labels: ['feature'],
            storyPoints: 13,
            estimatedEffort: 40,
            spentEffort: 38,
            subtasks: [
                { id: 'st19', text: 'Efor özet tabloları', done: true },
                { id: 'st20', text: 'CSV ihracı', done: true },
                { id: 'st21', text: 'Yazdırılabilir PDF optimizasyonu', done: false }
            ],
            comments: [{ id: 'cm1', text: 'Yazdırılabilir tasarım A4 dikey boyutuna göre uyarlandı.', createdAt: Date.now() }],
            epicId: 'e4',
            sprintId: 's12',
            createdAt: new Date('2026-06-08').getTime()
        },
        {
            id: 'c1202',
            title: 'Mobil - Çevrimdışı (Offline) Modu geliştirme',
            desc: 'Kullanıcının interneti koptuğunda verilerin lokal SQLite tablosuna yazılması.',
            assignee: 'Mert',
            priority: 'high',
            col: 'doing',
            startDate: '2026-06-08',
            dueDate: '2026-06-20',
            labels: ['feature'],
            storyPoints: 21,
            estimatedEffort: 60,
            spentEffort: 55,
            subtasks: [
                { id: 'st22', text: 'Lokal AsyncStorage önbelleği', done: true },
                { id: 'st23', text: 'Sunucu senkronizasyon servisi', done: false }
            ],
            comments: [],
            epicId: 'e3',
            sprintId: 's12',
            createdAt: new Date('2026-06-08').getTime()
        },
        {
            id: 'c1203',
            title: 'Takım davet sistemi ve rol yetkileri',
            desc: 'Rol bazlı erişim denetimi (RBAC) admin ekranı geliştirilmesi.',
            assignee: 'Kerem',
            priority: 'high',
            col: 'doing',
            startDate: '2026-06-09',
            dueDate: '2026-06-19',
            labels: ['feature'],
            storyPoints: 13,
            estimatedEffort: 32,
            spentEffort: 36, // Over-effort!
            subtasks: [
                { id: 'st25', text: 'E-posta davetiye altyapısı', done: true },
                { id: 'st26', text: 'Arayüz yetki kontrolü', done: true }
            ],
            comments: [],
            epicId: 'e1',
            sprintId: 's12',
            createdAt: new Date('2026-06-09').getTime()
        },
        {
            id: 'c1204',
            title: 'Storybook bileşen dökümantasyonu',
            desc: 'Ortak UI buton ve form alanlarının Storybook dökümantasyonu.',
            assignee: 'Selin',
            priority: 'medium',
            col: 'doing',
            startDate: '2026-06-08',
            dueDate: '2026-06-15',
            labels: ['docs', 'design'],
            storyPoints: 8,
            estimatedEffort: 24,
            spentEffort: 18,
            subtasks: [],
            comments: [],
            epicId: 'e6',
            sprintId: 's12',
            createdAt: new Date('2026-06-08').getTime()
        },
        {
            id: 'c1205',
            title: 'Abonelik plan yönetim arayüzü',
            desc: 'Plan seçimi, fatura geçmişi ve Stripe abonelik yenileme UI.',
            assignee: 'Ayşe',
            priority: 'high',
            col: 'todo',
            startDate: '2026-06-12',
            dueDate: '2026-06-21',
            labels: ['feature'],
            storyPoints: 13,
            estimatedEffort: 32,
            spentEffort: 0,
            subtasks: [],
            comments: [],
            epicId: 'e2',
            sprintId: 's12',
            createdAt: new Date('2026-06-12').getTime()
        },
        {
            id: 'c1206',
            title: 'Üretim bug: Fatura indirme hatası #324',
            desc: 'Ödeme sonrasında faturanın indirilmesinde tarayıcı bazlı duraksama çözülecek.',
            assignee: 'Kerem',
            priority: 'high',
            col: 'todo',
            startDate: '2026-06-12',
            dueDate: '2026-06-16',
            labels: ['bug'],
            storyPoints: 3,
            estimatedEffort: 8,
            spentEffort: 0,
            subtasks: [],
            comments: [],
            epicId: 'e2',
            sprintId: 's12',
            createdAt: new Date('2026-06-12').getTime()
        },
        {
            id: 'c1207',
            title: 'Mobil yük testleri ve k6 raporlaması',
            desc: 'k6 test scriptleri ile anlık 5k kullanıcı yük testi yapıldı.',
            assignee: 'Mert',
            priority: 'medium',
            col: 'done',
            startDate: '2026-06-09',
            dueDate: '2026-06-11',
            labels: ['test', 'devops'],
            storyPoints: 5,
            estimatedEffort: 16,
            spentEffort: 16,
            subtasks: [],
            comments: [],
            epicId: 'e5',
            sprintId: 's12',
            createdAt: new Date('2026-06-09').getTime()
        },

        // ── SPRINT 13 (Future / Backlog) ───────────────────
        {
            id: 'c1301',
            title: 'Çoklu dil desteği (i18n) v2 eklemeleri',
            desc: ' TR/EN yanına İspanyolca dil desteği eklenecek.',
            assignee: 'Selin',
            priority: 'low',
            col: 'todo',
            startDate: '2026-06-23',
            dueDate: '2026-07-02',
            labels: ['feature'],
            storyPoints: 5,
            estimatedEffort: 16,
            spentEffort: 0,
            subtasks: [],
            comments: [],
            epicId: 'e1',
            sprintId: 's13',
            createdAt: new Date('2026-06-12').getTime()
        },
        {
            id: 'c1302',
            title: 'Slack webhook bildirim kanalı entegrasyonu',
            desc: 'Durum değişimlerinde ilgili takıma Slack üzerinden bildirim düşmesi.',
            assignee: 'Kerem',
            priority: 'medium',
            col: 'todo',
            startDate: '2026-06-25',
            dueDate: '2026-07-05',
            labels: ['feature'],
            storyPoints: 8,
            estimatedEffort: 24,
            spentEffort: 0,
            subtasks: [],
            comments: [],
            epicId: 'e5',
            sprintId: 's13',
            createdAt: new Date('2026-06-12').getTime()
        },

        // ── SPRINT 26 (Future / Backlog - end of 2026) ──────
        {
            id: 'c2601',
            title: 'Yıl sonu performans değerlendirmesi',
            desc: 'Tüm projelerin, sprintlerin ve eforların istatistiksel çıktısı.',
            assignee: 'Ayşe',
            priority: 'low',
            col: 'todo',
            startDate: '2026-12-21',
            dueDate: '2026-12-30',
            labels: ['docs'],
            storyPoints: 5,
            estimatedEffort: 16,
            spentEffort: 0,
            subtasks: [],
            comments: [],
            epicId: 'e4',
            sprintId: 's26',
            createdAt: new Date('2026-06-12').getTime()
        }
    ];

    const data = { cards, epics, sprints };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    console.log('Database seeded covering Sprints 1-26!');
}

// Auto seed demo if we're in the demo and it's empty
if (window.location.pathname.includes('demo.html')) {
    seed2026Data(false);
}
