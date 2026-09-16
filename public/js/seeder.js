// ============================================================
//  seeder.js – 2026-2027 Calendar Years Dummy Data Seeder
//  Nova Takımı: 10 Kişilik Çapraz Fonksiyonel Ekip & 52 Sprint
// ============================================================

const SEED_VERSION = '2026-2027-v2';

const DEMO_TEAM_USERS = [
    {
        "id": "usr-1",
        "username": "admin",
        "name": "Ali Yılmaz",
        "role": "admin",
        "avatarColor": "#4f46e5"
    },
    {
        "id": "usr-2",
        "username": "zeynep",
        "name": "Zeynep Kaya",
        "role": "user",
        "avatarColor": "#0ea5e9"
    },
    {
        "id": "usr-3",
        "username": "mehmet",
        "name": "Mehmet Demir",
        "role": "user",
        "avatarColor": "#10b981"
    },
    {
        "id": "usr-4",
        "username": "selin",
        "name": "Selin Yıldız",
        "role": "user",
        "avatarColor": "#f59e0b"
    },
    {
        "id": "usr-5",
        "username": "caner",
        "name": "Caner Öztürk",
        "role": "user",
        "avatarColor": "#8b5cf6"
    },
    {
        "id": "usr-6",
        "username": "burcu",
        "name": "Burcu Çelik",
        "role": "user",
        "avatarColor": "#ec4899"
    },
    {
        "id": "usr-7",
        "username": "emre",
        "name": "Emre Aydın",
        "role": "user",
        "avatarColor": "#06b6d4"
    },
    {
        "id": "usr-8",
        "username": "gamze",
        "name": "Gamze Şahin",
        "role": "user",
        "avatarColor": "#14b8a6"
    },
    {
        "id": "usr-9",
        "username": "tolga",
        "name": "Tolga Kurt",
        "role": "user",
        "avatarColor": "#f97316"
    },
    {
        "id": "usr-10",
        "username": "derya",
        "name": "Derya Arslan",
        "role": "user",
        "avatarColor": "#64748b"
    }
];

const DEMO_EPICS = [
    {
        "id": "e1",
        "name": "Kullanıcı & Takım Yönetimi (2026)",
        "color": "#6366f1",
        "createdAt": 1767571200000
    },
    {
        "id": "e2",
        "name": "Ödeme & Faturalandırma Altyapısı (2026)",
        "color": "#f59e0b",
        "createdAt": 1767571200000
    },
    {
        "id": "e3",
        "name": "Mobil Uygulama v1 & v2 (2026)",
        "color": "#22c55e",
        "createdAt": 1767571200000
    },
    {
        "id": "e4",
        "name": "Dashboard & Analitik Raporlama (2026-2027)",
        "color": "#ef4444",
        "createdAt": 1767571200000
    },
    {
        "id": "e5",
        "name": "Cloud, CI/CD & Kubernetes DevOps (2026)",
        "color": "#0891b2",
        "createdAt": 1767571200000
    },
    {
        "id": "e6",
        "name": "Design System & Erişilebilirlik (2026)",
        "color": "#8b5cf6",
        "createdAt": 1767571200000
    },
    {
        "id": "e7",
        "name": "Yapay Zeka Destekli Görev & Risk Tahmini (2027)",
        "color": "#ec4899",
        "createdAt": 1767571200000
    },
    {
        "id": "e8",
        "name": "Global Multi-Region Dağıtık Veri Ağı (2027)",
        "color": "#3b82f6",
        "createdAt": 1767571200000
    },
    {
        "id": "e9",
        "name": "Kurumsal SSO, SCIM & DevSecOps Güvenlik (2027)",
        "color": "#f97316",
        "createdAt": 1767571200000
    },
    {
        "id": "e10",
        "name": "Gerçek Zamanlı Çift Yönlü Webhook & SDK v3 (2027)",
        "color": "#14b8a6",
        "createdAt": 1767571200000
    }
];

const DEMO_SPRINTS = [
    {
        "id": "s1",
        "name": "Sprint 1",
        "startDate": "2026-01-05",
        "endDate": "2026-01-18",
        "active": false,
        "createdAt": 1767312000000
    },
    {
        "id": "s2",
        "name": "Sprint 2",
        "startDate": "2026-01-19",
        "endDate": "2026-02-01",
        "active": false,
        "createdAt": 1768521600000
    },
    {
        "id": "s3",
        "name": "Sprint 3",
        "startDate": "2026-02-02",
        "endDate": "2026-02-15",
        "active": false,
        "createdAt": 1769731200000
    },
    {
        "id": "s4",
        "name": "Sprint 4",
        "startDate": "2026-02-16",
        "endDate": "2026-03-01",
        "active": false,
        "createdAt": 1770940800000
    },
    {
        "id": "s5",
        "name": "Sprint 5",
        "startDate": "2026-03-02",
        "endDate": "2026-03-15",
        "active": false,
        "createdAt": 1772150400000
    },
    {
        "id": "s6",
        "name": "Sprint 6",
        "startDate": "2026-03-16",
        "endDate": "2026-03-29",
        "active": false,
        "createdAt": 1773360000000
    },
    {
        "id": "s7",
        "name": "Sprint 7",
        "startDate": "2026-03-30",
        "endDate": "2026-04-12",
        "active": false,
        "createdAt": 1774569600000
    },
    {
        "id": "s8",
        "name": "Sprint 8",
        "startDate": "2026-04-13",
        "endDate": "2026-04-26",
        "active": false,
        "createdAt": 1775779200000
    },
    {
        "id": "s9",
        "name": "Sprint 9",
        "startDate": "2026-04-27",
        "endDate": "2026-05-10",
        "active": false,
        "createdAt": 1776988800000
    },
    {
        "id": "s10",
        "name": "Sprint 10",
        "startDate": "2026-05-11",
        "endDate": "2026-05-24",
        "active": false,
        "createdAt": 1778198400000
    },
    {
        "id": "s11",
        "name": "Sprint 11",
        "startDate": "2026-05-25",
        "endDate": "2026-06-07",
        "active": false,
        "createdAt": 1779408000000
    },
    {
        "id": "s12",
        "name": "Sprint 12",
        "startDate": "2026-06-08",
        "endDate": "2026-06-21",
        "active": false,
        "createdAt": 1780617600000
    },
    {
        "id": "s13",
        "name": "Sprint 13",
        "startDate": "2026-06-22",
        "endDate": "2026-07-05",
        "active": false,
        "createdAt": 1781827200000
    },
    {
        "id": "s14",
        "name": "Sprint 14",
        "startDate": "2026-07-06",
        "endDate": "2026-07-19",
        "active": false,
        "createdAt": 1783036800000
    },
    {
        "id": "s15",
        "name": "Sprint 15",
        "startDate": "2026-07-20",
        "endDate": "2026-08-02",
        "active": false,
        "createdAt": 1784246400000
    },
    {
        "id": "s16",
        "name": "Sprint 16",
        "startDate": "2026-08-03",
        "endDate": "2026-08-16",
        "active": false,
        "createdAt": 1785456000000
    },
    {
        "id": "s17",
        "name": "Sprint 17",
        "startDate": "2026-08-17",
        "endDate": "2026-08-30",
        "active": false,
        "createdAt": 1786665600000
    },
    {
        "id": "s18",
        "name": "Sprint 18",
        "startDate": "2026-08-31",
        "endDate": "2026-09-13",
        "active": false,
        "createdAt": 1787875200000
    },
    {
        "id": "s19",
        "name": "Sprint 19",
        "startDate": "2026-09-14",
        "endDate": "2026-09-27",
        "active": true,
        "createdAt": 1789084800000
    },
    {
        "id": "s20",
        "name": "Sprint 20",
        "startDate": "2026-09-28",
        "endDate": "2026-10-11",
        "active": false,
        "createdAt": 1790294400000
    },
    {
        "id": "s21",
        "name": "Sprint 21",
        "startDate": "2026-10-12",
        "endDate": "2026-10-25",
        "active": false,
        "createdAt": 1791504000000
    },
    {
        "id": "s22",
        "name": "Sprint 22",
        "startDate": "2026-10-26",
        "endDate": "2026-11-08",
        "active": false,
        "createdAt": 1792713600000
    },
    {
        "id": "s23",
        "name": "Sprint 23",
        "startDate": "2026-11-09",
        "endDate": "2026-11-22",
        "active": false,
        "createdAt": 1793923200000
    },
    {
        "id": "s24",
        "name": "Sprint 24",
        "startDate": "2026-11-23",
        "endDate": "2026-12-06",
        "active": false,
        "createdAt": 1795132800000
    },
    {
        "id": "s25",
        "name": "Sprint 25",
        "startDate": "2026-12-07",
        "endDate": "2026-12-20",
        "active": false,
        "createdAt": 1796342400000
    },
    {
        "id": "s26",
        "name": "Sprint 26",
        "startDate": "2026-12-21",
        "endDate": "2027-01-03",
        "active": false,
        "createdAt": 1797552000000
    },
    {
        "id": "s27",
        "name": "Sprint 27",
        "startDate": "2027-01-04",
        "endDate": "2027-01-17",
        "active": false,
        "createdAt": 1798761600000
    },
    {
        "id": "s28",
        "name": "Sprint 28",
        "startDate": "2027-01-18",
        "endDate": "2027-01-31",
        "active": false,
        "createdAt": 1799971200000
    },
    {
        "id": "s29",
        "name": "Sprint 29",
        "startDate": "2027-02-01",
        "endDate": "2027-02-14",
        "active": false,
        "createdAt": 1801180800000
    },
    {
        "id": "s30",
        "name": "Sprint 30",
        "startDate": "2027-02-15",
        "endDate": "2027-02-28",
        "active": false,
        "createdAt": 1802390400000
    },
    {
        "id": "s31",
        "name": "Sprint 31",
        "startDate": "2027-03-01",
        "endDate": "2027-03-14",
        "active": false,
        "createdAt": 1803600000000
    },
    {
        "id": "s32",
        "name": "Sprint 32",
        "startDate": "2027-03-15",
        "endDate": "2027-03-28",
        "active": false,
        "createdAt": 1804809600000
    },
    {
        "id": "s33",
        "name": "Sprint 33",
        "startDate": "2027-03-29",
        "endDate": "2027-04-11",
        "active": false,
        "createdAt": 1806019200000
    },
    {
        "id": "s34",
        "name": "Sprint 34",
        "startDate": "2027-04-12",
        "endDate": "2027-04-25",
        "active": false,
        "createdAt": 1807228800000
    },
    {
        "id": "s35",
        "name": "Sprint 35",
        "startDate": "2027-04-26",
        "endDate": "2027-05-09",
        "active": false,
        "createdAt": 1808438400000
    },
    {
        "id": "s36",
        "name": "Sprint 36",
        "startDate": "2027-05-10",
        "endDate": "2027-05-23",
        "active": false,
        "createdAt": 1809648000000
    },
    {
        "id": "s37",
        "name": "Sprint 37",
        "startDate": "2027-05-24",
        "endDate": "2027-06-06",
        "active": false,
        "createdAt": 1810857600000
    },
    {
        "id": "s38",
        "name": "Sprint 38",
        "startDate": "2027-06-07",
        "endDate": "2027-06-20",
        "active": false,
        "createdAt": 1812067200000
    },
    {
        "id": "s39",
        "name": "Sprint 39",
        "startDate": "2027-06-21",
        "endDate": "2027-07-04",
        "active": false,
        "createdAt": 1813276800000
    },
    {
        "id": "s40",
        "name": "Sprint 40",
        "startDate": "2027-07-05",
        "endDate": "2027-07-18",
        "active": false,
        "createdAt": 1814486400000
    },
    {
        "id": "s41",
        "name": "Sprint 41",
        "startDate": "2027-07-19",
        "endDate": "2027-08-01",
        "active": false,
        "createdAt": 1815696000000
    },
    {
        "id": "s42",
        "name": "Sprint 42",
        "startDate": "2027-08-02",
        "endDate": "2027-08-15",
        "active": false,
        "createdAt": 1816905600000
    },
    {
        "id": "s43",
        "name": "Sprint 43",
        "startDate": "2027-08-16",
        "endDate": "2027-08-29",
        "active": false,
        "createdAt": 1818115200000
    },
    {
        "id": "s44",
        "name": "Sprint 44",
        "startDate": "2027-08-30",
        "endDate": "2027-09-12",
        "active": false,
        "createdAt": 1819324800000
    },
    {
        "id": "s45",
        "name": "Sprint 45",
        "startDate": "2027-09-13",
        "endDate": "2027-09-26",
        "active": false,
        "createdAt": 1820534400000
    },
    {
        "id": "s46",
        "name": "Sprint 46",
        "startDate": "2027-09-27",
        "endDate": "2027-10-10",
        "active": false,
        "createdAt": 1821744000000
    },
    {
        "id": "s47",
        "name": "Sprint 47",
        "startDate": "2027-10-11",
        "endDate": "2027-10-24",
        "active": false,
        "createdAt": 1822953600000
    },
    {
        "id": "s48",
        "name": "Sprint 48",
        "startDate": "2027-10-25",
        "endDate": "2027-11-07",
        "active": false,
        "createdAt": 1824163200000
    },
    {
        "id": "s49",
        "name": "Sprint 49",
        "startDate": "2027-11-08",
        "endDate": "2027-11-21",
        "active": false,
        "createdAt": 1825372800000
    },
    {
        "id": "s50",
        "name": "Sprint 50",
        "startDate": "2027-11-22",
        "endDate": "2027-12-05",
        "active": false,
        "createdAt": 1826582400000
    },
    {
        "id": "s51",
        "name": "Sprint 51",
        "startDate": "2027-12-06",
        "endDate": "2027-12-19",
        "active": false,
        "createdAt": 1827792000000
    },
    {
        "id": "s52",
        "name": "Sprint 52",
        "startDate": "2027-12-20",
        "endDate": "2028-01-02",
        "active": false,
        "createdAt": 1829001600000
    }
];

const DEMO_CARDS = [
    {
        "id": "c101",
        "key": "TK-101",
        "title": "TypeScript ve Monorepo Altyapısının Kurulması",
        "desc": "ESLint, Prettier kuralları ve strict TypeScript derleme konfigürasyonu tamamlandı.",
        "assignee": "Ali Yılmaz",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-05",
        "dueDate": "2026-01-12",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st101-1",
                "text": "TurboRepo yapısı kuruldu",
                "done": true
            },
            {
                "id": "st101-2",
                "text": "Ortak tsconfig ayarlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm101-1",
                "text": "Tüm monorepo paketleri sorunsuz derleniyor.",
                "createdAt": 1767744000000,
                "author": "Ali Yılmaz"
            }
        ],
        "epicId": "e5",
        "sprintId": "s1",
        "createdAt": 1767571200000
    },
    {
        "id": "c102",
        "key": "TK-102",
        "title": "GitHub Actions CI/CD Pipeline & Otomasyon",
        "desc": "Otomatik test, lint ve Cloudflare Workers test dağıtım pipeline entegrasyonu.",
        "assignee": "Caner Öztürk",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-08",
        "dueDate": "2026-01-17",
        "labels": [
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 10,
        "spentEffort": 12,
        "subtasks": [
            {
                "id": "st102-1",
                "text": "Lint & Test workflow",
                "done": true
            },
            {
                "id": "st102-2",
                "text": "Cloudflare Pages token tanımlaması",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s1",
        "createdAt": 1767830400000
    },
    {
        "id": "c103",
        "key": "TK-103",
        "title": "Tasarım Sistemi Tokenları ve UI Bileşen Kitaplığı",
        "desc": "Renk paleti, tipografi, butonlar, modallar ve modern karanlık tema bileşenleri.",
        "assignee": "Zeynep Kaya",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-19",
        "dueDate": "2026-01-28",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st103-1",
                "text": "Figma tokenları CSS değişkenlerine aktarıldı",
                "done": true
            },
            {
                "id": "st103-2",
                "text": "Modal & Toast bileşenleri kodlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm103-1",
                "text": "Renk kontrast oranları WCAG AA standardını geçti.",
                "createdAt": 1769040000000,
                "author": "Zeynep Kaya"
            }
        ],
        "epicId": "e6",
        "sprintId": "s2",
        "createdAt": 1768780800000
    },
    {
        "id": "c104",
        "key": "TK-104",
        "title": "JWT Tabanlı Oturum ve RBAC Yetkilendirme Servisi",
        "desc": "Superadmin, admin ve user rolleri için yetki kontrol mekanizması ve HTTP-only cookie desteği.",
        "assignee": "Derya Arslan",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-20",
        "dueDate": "2026-01-30",
        "labels": [
            "backend",
            "security"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st104-1",
                "text": "Token üretimi ve doğrulama",
                "done": true
            },
            {
                "id": "st104-2",
                "text": "Middleware yetki katmanı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s2",
        "createdAt": 1768867200000
    },
    {
        "id": "c105",
        "key": "TK-105",
        "title": "Kullanıcı Profil ve Çoklu Çalışma Alanı Yönetimi",
        "desc": "Kullanıcıların kendi çalışma alanları arasında geçiş yapabilmesi ve takımlara üye olabilmesi.",
        "assignee": "Mehmet Demir",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-02",
        "dueDate": "2026-02-12",
        "labels": [
            "feature",
            "backend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st105-1",
                "text": "Workspace switcher arayüzü",
                "done": true
            },
            {
                "id": "st105-2",
                "text": "Takım üyesi ekleme API",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s3",
        "createdAt": 1769990400000
    },
    {
        "id": "c106",
        "key": "TK-106",
        "title": "WCAG 2.1 AA Erişilebilirlik ve Klavye Kısayolları (N, Esc)",
        "desc": "Klavye ile kart açma, hızlı oluşturma, ekran okuyucu aria etiketleri.",
        "assignee": "Zeynep Kaya",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-16",
        "dueDate": "2026-02-25",
        "labels": [
            "frontend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 12,
        "spentEffort": 10,
        "subtasks": [],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s4",
        "createdAt": 1771200000000
    },
    {
        "id": "c107",
        "key": "TK-107",
        "title": "Stripe & İyzico Ödeme Ağ Geçidi Entegrasyonu",
        "desc": "Kredi kartı ve 3D Secure ödeme altyapısı, webhook dinleyicileri.",
        "assignee": "Ali Yılmaz",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-02",
        "dueDate": "2026-03-14",
        "labels": [
            "feature",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 30,
        "spentEffort": 32,
        "subtasks": [
            {
                "id": "st107-1",
                "text": "Stripe Checkout API",
                "done": true
            },
            {
                "id": "st107-2",
                "text": "İyzico 3DS callback",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s5",
        "createdAt": 1772409600000
    },
    {
        "id": "c108",
        "key": "TK-108",
        "title": "Abonelik ve Yinelenen Fatura Servisi",
        "desc": "Pro plan üyelik döngüleri, fatura PDF üretimi ve e-posta bildirimi.",
        "assignee": "Mehmet Demir",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-04",
        "dueDate": "2026-03-13",
        "labels": [
            "feature"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s5",
        "createdAt": 1772582400000
    },
    {
        "id": "c109",
        "key": "TK-109",
        "title": "React Native iOS & Android Çekirdek Uygulama Kurulumu",
        "desc": "Mobil mimari, React Navigation 7, Zustand durum yönetimi ve splash ekranı.",
        "assignee": "Emre Aydın",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-16",
        "dueDate": "2026-03-27",
        "labels": [
            "mobile"
        ],
        "storyPoints": 8,
        "estimatedEffort": 32,
        "spentEffort": 35,
        "subtasks": [
            {
                "id": "st109-1",
                "text": "iOS Cocoapods ve Android Gradle yapılandırması",
                "done": true
            },
            {
                "id": "st109-2",
                "text": "Offline MMKV depolama",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm109-1",
                "text": "TestFlight ve Google Internal Test dağıtımı yapıldı.",
                "createdAt": 1774396800000,
                "author": "Emre Aydın"
            }
        ],
        "epicId": "e3",
        "sprintId": "s6",
        "createdAt": 1773619200000
    },
    {
        "id": "c110",
        "key": "TK-110",
        "title": "Mobil Kanban Panosu Sürükle-Bırak & Dokunmatik Jestler",
        "desc": "Reanimated 3 ve Gesture Handler ile 60 FPS akıcı kart taşıma deneyimi.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-30",
        "dueDate": "2026-04-10",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s7",
        "createdAt": 1774828800000
    },
    {
        "id": "c111",
        "key": "TK-111",
        "title": "Kubernetes Helm Chart & Cluster Autoscaling",
        "desc": "HPA (Horizontal Pod Autoscaler), Ingress Controller ve SSL sertifika otomasyonu.",
        "assignee": "Caner Öztürk",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-13",
        "dueDate": "2026-04-24",
        "labels": [
            "devops"
        ],
        "storyPoints": 8,
        "estimatedEffort": 28,
        "spentEffort": 30,
        "subtasks": [],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s8",
        "createdAt": 1776038400000
    },
    {
        "id": "c112",
        "key": "TK-112",
        "title": "OWASP Top 10 Güvenlik Taraması & Zafiyet Yamaları",
        "desc": "SQL injection, XSS, CSRF testleri, CSP ve HSTS güvenlik başlıklarının güçlendirilmesi.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-27",
        "dueDate": "2026-05-08",
        "labels": [
            "security"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st112-1",
                "text": "ZAP ve Burp Suite taraması",
                "done": true
            },
            {
                "id": "st112-2",
                "text": "Helmet güvenlik başlıkları konfigürasyonu",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm112-1",
                "text": "A+ SSL ve güvenlik puanı alındı.",
                "createdAt": 1778025600000,
                "author": "Tolga Kurt"
            }
        ],
        "epicId": "e9",
        "sprintId": "s9",
        "createdAt": 1777248000000
    },
    {
        "id": "c113",
        "key": "TK-113",
        "title": "Efor ve Performans Analitik Veri Modeli Tasarımı",
        "desc": "Kullanıcı bazlı saatlik efor, sapma hesaplama ve sprint burn-down veri yapıları.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-11",
        "dueDate": "2026-05-22",
        "labels": [
            "backend",
            "analytics"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 24,
        "subtasks": [],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s10",
        "createdAt": 1778457600000
    },
    {
        "id": "c114",
        "key": "TK-114",
        "title": "Dashboard Hızlı Metrik Kartları ve Gerçek Zamanlı Grafikler",
        "desc": "Toplam görev, story points, tamamlanma yüzdesi ve geciken görevler paneli.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-25",
        "dueDate": "2026-06-04",
        "labels": [
            "frontend",
            "analytics"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 20,
        "subtasks": [],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s11",
        "createdAt": 1779667200000
    },
    {
        "id": "c115",
        "key": "TK-115",
        "title": "Gantt Çizelgesi Zaman Çizelgesi ve Bağımlılık Çizgileri",
        "desc": "Tarih aralığına göre otomatik ölçeklenen interaktif Gantt grafiği.",
        "assignee": "Zeynep Kaya",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-08",
        "dueDate": "2026-06-19",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 8,
        "estimatedEffort": 30,
        "spentEffort": 28,
        "subtasks": [
            {
                "id": "st115-1",
                "text": "Zaman çizgisi başlıkları",
                "done": true
            },
            {
                "id": "st115-2",
                "text": "Kart detay popover entegrasyonu",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s12",
        "createdAt": 1780876800000
    },
    {
        "id": "c116",
        "key": "TK-116",
        "title": "Kullanıcı Onay Mekanizması & Super Admin Bildirimleri",
        "desc": "Yeni kayıt olan kullanıcıların onay kuyruğuna düşmesi ve yönetici onayıyla aktifleşmesi.",
        "assignee": "Selin Yıldız",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-22",
        "dueDate": "2026-07-03",
        "labels": [
            "feature"
        ],
        "storyPoints": 5,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s13",
        "createdAt": 1782086400000
    },
    {
        "id": "c117",
        "key": "TK-117",
        "title": "Otomatik E2E Test Suite (Cypress & Playwright)",
        "desc": "Giriş, kart oluşturma, sürükle-bırak, filtreleme ve raporlama E2E senaryoları.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-06",
        "dueDate": "2026-07-17",
        "labels": [
            "qa"
        ],
        "storyPoints": 8,
        "estimatedEffort": 32,
        "spentEffort": 30,
        "subtasks": [
            {
                "id": "st117-1",
                "text": "Auth & Board E2E testleri",
                "done": true
            },
            {
                "id": "st117-2",
                "text": "Gantt & Report test senaryoları",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm117-1",
                "text": "142 test senaryosu CI ortamında yeşil.",
                "createdAt": 1784332800000,
                "author": "Burcu Çelik"
            }
        ],
        "epicId": "e6",
        "sprintId": "s14",
        "createdAt": 1783296000000
    },
    {
        "id": "c118",
        "key": "TK-118",
        "title": "Cloudflare Workers Edge Önbellekleme & Global CDN",
        "desc": "Statik varlıklar ve API sorguları için akıllı önbellek politikası.",
        "assignee": "Caner Öztürk",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-20",
        "dueDate": "2026-07-30",
        "labels": [
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s15",
        "createdAt": 1784505600000
    },
    {
        "id": "c119",
        "key": "TK-119",
        "title": "Audit Log (Aktivite Günlüğü) ve IP Filtreleme Modülü",
        "desc": "Kart ve kullanıcı işlemlerinin detaylı loglanması, Super Admin log izleme ekranı.",
        "assignee": "Tolga Kurt",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-03",
        "dueDate": "2026-08-14",
        "labels": [
            "security"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 22,
        "subtasks": [],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s16",
        "createdAt": 1785715200000
    },
    {
        "id": "c120",
        "key": "TK-120",
        "title": "Çok Kiracılı (Multi-Tenant) D1 Veritabanı Ayrımı",
        "desc": "Takımlar ve kişisel panolar için bağımsız D1 anahtarları ve veri izolasyonu.",
        "assignee": "Derya Arslan",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-17",
        "dueDate": "2026-08-28",
        "labels": [
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 28,
        "spentEffort": 27,
        "subtasks": [],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s17",
        "createdAt": 1786924800000
    },
    {
        "id": "c121",
        "key": "TK-121",
        "title": "Regresyon Testleri ve v1.3 Sürüm Doğrulaması",
        "desc": "Tüm modüllerin çapraz doğrulaması, performans profil çıkarması.",
        "assignee": "Burcu Çelik",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-31",
        "dueDate": "2026-09-11",
        "labels": [
            "qa"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [],
        "comments": [
            {
                "id": "cm121-1",
                "text": "v1.3.0 sürüm adayında engelleyici hata kalmadı.",
                "createdAt": 1789123200000,
                "author": "Burcu Çelik"
            }
        ],
        "epicId": "e6",
        "sprintId": "s18",
        "createdAt": 1788134400000
    },
    {
        "id": "c122",
        "key": "TK-122",
        "title": "CSV / PDF Gelişmiş Rapor Dışa Aktarma Motoru",
        "desc": "Efor ve proje ilerleme raporunun filtrelenmiş şekilde CSV ve vektörel PDF çıktısının alınması.",
        "assignee": "Zeynep Kaya",
        "priority": "high",
        "col": "doing",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-22",
        "labels": [
            "frontend",
            "analytics"
        ],
        "storyPoints": 5,
        "estimatedEffort": 16,
        "spentEffort": 12,
        "subtasks": [
            {
                "id": "st122-1",
                "text": "CSV BOM karakter kodlama desteği",
                "done": true
            },
            {
                "id": "st122-2",
                "text": "Yazıcı / PDF stil şablonu",
                "done": true
            },
            {
                "id": "st122-3",
                "text": "Kişi bazlı filtreli dışa aktarma",
                "done": false
            }
        ],
        "comments": [
            {
                "id": "cm122-1",
                "text": "Excel Türkçe karakter sorunu UTF-8 BOM ile çözüldü.",
                "createdAt": 1789555200000,
                "author": "Zeynep Kaya"
            }
        ],
        "epicId": "e4",
        "sprintId": "s19",
        "createdAt": 1789344000000
    },
    {
        "id": "c123",
        "key": "TK-123",
        "title": "Çift Yönlü Webhook Dağıtım Servisi ve Retry Mekanizması",
        "desc": "Kart güncellemelerinde harici servislere HMAC imzalı webhook fırlatma ve exponential backoff.",
        "assignee": "Ali Yılmaz",
        "priority": "high",
        "col": "doing",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-24",
        "labels": [
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st123-1",
                "text": "Webhook payload şablonları",
                "done": true
            },
            {
                "id": "st123-2",
                "text": "HMAC SHA256 imzalama",
                "done": true
            },
            {
                "id": "st123-3",
                "text": "Kuyruk ve 3x tekrar deneme (retry)",
                "done": false
            }
        ],
        "comments": [
            {
                "id": "cm123-1",
                "text": "Test endpointlerine teslimat gecikmesi < 15ms.",
                "createdAt": 1789560000000,
                "author": "Ali Yılmaz"
            }
        ],
        "epicId": "e10",
        "sprintId": "s19",
        "createdAt": 1789344000000
    },
    {
        "id": "c124",
        "key": "TK-124",
        "title": "Mobil Bildirim Servisi (APNs & FCM Entegrasyonu)",
        "desc": "Görevin kullanıcıya atanması veya son teslim tarihine 24 saat kala anlık push bildirim gönderimi.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "doing",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-23",
        "labels": [
            "mobile"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st124-1",
                "text": "Apple Push Notification key konfigürasyonu",
                "done": true
            },
            {
                "id": "st124-2",
                "text": "Firebase Cloud Messaging Android kurulumu",
                "done": true
            },
            {
                "id": "st124-3",
                "text": "Kullanıcı bildirim izin istemi",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s19",
        "createdAt": 1789430400000
    },
    {
        "id": "c125",
        "key": "TK-125",
        "title": "İki Aşamalı Doğrulama (2FA / TOTP) Modülü",
        "desc": "Google Authenticator uyumlu QR kod ile 2 faktörlü kimlik doğrulama.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "doing",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-25",
        "labels": [
            "security"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 10,
        "subtasks": [
            {
                "id": "st125-1",
                "text": "TOTP gizli anahtar üretimi",
                "done": true
            },
            {
                "id": "st125-2",
                "text": "Yedek kurtarma kodları",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s19",
        "createdAt": 1789430400000
    },
    {
        "id": "c126",
        "key": "TK-126",
        "title": "Dinamik Takım Davet Linkleri ve E-posta Doğrulaması",
        "desc": "Belirli bir süre geçerli güvenli davet tokenları oluşturma ve tek tıkla takıma dahil olma.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-18",
        "labels": [
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 12,
        "spentEffort": 12,
        "subtasks": [
            {
                "id": "st126-1",
                "text": "Davet token modeli",
                "done": true
            },
            {
                "id": "st126-2",
                "text": "E-posta şablonu tasarımı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm126-1",
                "text": "Canlı test ortamında davet akışı onaylandı.",
                "createdAt": 1789600000000,
                "author": "Derya Arslan"
            }
        ],
        "epicId": "e1",
        "sprintId": "s19",
        "createdAt": 1789344000000
    },
    {
        "id": "c127",
        "key": "TK-127",
        "title": "Gerçek Zamanlı Sprint Velocity ve Burn-Down Hesaplayıcı",
        "desc": "Sprint içerisindeki tamamlanan story point hızını geçmiş sprint ortalamalarıyla kıyaslayan motor.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-19",
        "labels": [
            "analytics"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st127-1",
                "text": "Velocity algoritması",
                "done": true
            },
            {
                "id": "st127-2",
                "text": "Rapor ekranına görsel entegrasyon",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s19",
        "createdAt": 1789344000000
    },
    {
        "id": "c128",
        "key": "TK-128",
        "title": "Sprint 19 Çapraz Tarayıcı ve Yük Testleri",
        "desc": "Safari, Chrome, Firefox ve Edge üzerinde 100 eşzamanlı kullanıcıyla stres testi.",
        "assignee": "Burcu Çelik",
        "priority": "medium",
        "col": "doing",
        "startDate": "2026-09-16",
        "dueDate": "2026-09-26",
        "labels": [
            "qa"
        ],
        "storyPoints": 5,
        "estimatedEffort": 16,
        "spentEffort": 10,
        "subtasks": [
            {
                "id": "st128-1",
                "text": "k6 yük testi senaryosu",
                "done": true
            },
            {
                "id": "st128-2",
                "text": "Mobil tarayıcı uyumluluğu",
                "done": false
            }
        ],
        "comments": [
            {
                "id": "cm128-1",
                "text": "Ortalama API yanıt süresi 42ms olarak ölçüldü.",
                "createdAt": 1789640000000,
                "author": "Burcu Çelik"
            }
        ],
        "epicId": "e6",
        "sprintId": "s19",
        "createdAt": 1789516800000
    },
    {
        "id": "c129",
        "key": "TK-129",
        "title": "Prometheus & Grafana AlertManager Bildirim Kuralları",
        "desc": "CPU %80 ve bellek %85 sınırında Discord ve Slack kanalına otomatik alarm tetikleme.",
        "assignee": "Caner Öztürk",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-17",
        "labels": [
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 10,
        "spentEffort": 10,
        "subtasks": [],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s19",
        "createdAt": 1789344000000
    },
    {
        "id": "c130",
        "key": "TK-130",
        "title": "Q4 2026 Sprint Hedefleri ve Backlog Arındırma (Refinement)",
        "desc": "Son çeyrek hedefleri, kurumsal müşteri talepleri ve teknik borç temizliği planlaması.",
        "assignee": "Selin Yıldız",
        "priority": "low",
        "col": "doing",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-21",
        "labels": [
            "feature"
        ],
        "storyPoints": 3,
        "estimatedEffort": 8,
        "spentEffort": 6,
        "subtasks": [],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s19",
        "createdAt": 1789430400000
    },
    {
        "id": "c131",
        "key": "TK-131",
        "title": "Developer API Dokümantasyonu (Swagger / OpenAPI v3)",
        "desc": "Tüm REST endpointlerinin parametre, yanıt ve kimlik doğrulama şemalarıyla dokümante edilmesi.",
        "assignee": "Mehmet Demir",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-18",
        "dueDate": "2026-09-27",
        "labels": [
            "docs"
        ],
        "storyPoints": 5,
        "estimatedEffort": 14,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s19",
        "createdAt": 1789516800000
    },
    {
        "id": "c132",
        "key": "TK-132",
        "title": "Mobil Çevrimdışı Çalışma (Offline Queue & Sync)",
        "desc": "İnternet bağlantısı kesildiğinde yerel SQLite veritabanında çalışıp bağlanınca otomatik eşitleme.",
        "assignee": "Emre Aydın",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-09-28",
        "dueDate": "2026-10-08",
        "labels": [
            "mobile"
        ],
        "storyPoints": 8,
        "estimatedEffort": 30,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s20",
        "createdAt": 1789603200000
    },
    {
        "id": "c133",
        "key": "TK-133",
        "title": "Kurumsal SAML 2.0 & Okta SSO Desteği",
        "desc": "Büyük ölçekli kurumsal müşteriler için Active Directory ve Okta tekil oturum açma entegrasyonu.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-12",
        "dueDate": "2026-10-22",
        "labels": [
            "security"
        ],
        "storyPoints": 8,
        "estimatedEffort": 32,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s21",
        "createdAt": 1789603200000
    },
    {
        "id": "c134",
        "key": "TK-134",
        "title": "Özel Dashboard Widget Oluşturucu (Custom Widgets)",
        "desc": "Kullanıcıların panoya özel metrik kartları ve sürükle-bırak grafikler ekleyebilmesi.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-26",
        "dueDate": "2026-11-05",
        "labels": [
            "frontend",
            "analytics"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s22",
        "createdAt": 1789603200000
    },
    {
        "id": "c135",
        "key": "TK-135",
        "title": "Multi-Region Veritabanı Yük Dengeleme ve Okuma Replikaları",
        "desc": "Avrupa, Asya ve Amerika sunucularında < 20ms okuma gecikmesi sağlayan replikasyon ağı.",
        "assignee": "Caner Öztürk",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-09",
        "dueDate": "2026-11-19",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 34,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s23",
        "createdAt": 1789603200000
    },
    {
        "id": "c136",
        "key": "TK-136",
        "title": "Zapier & Make.com Entegrasyon Eklentisi",
        "desc": "Kod yazmadan 5000+ popüler uygulamayla iki yönlü tetikleyici ve aksiyon köprüsü.",
        "assignee": "Mehmet Demir",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-23",
        "dueDate": "2026-12-03",
        "labels": [
            "feature"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s24",
        "createdAt": 1789603200000
    },
    {
        "id": "c137",
        "key": "TK-137",
        "title": "Kullanıcı Deneyimi (UX) ve Mobil Arayüz Yenilemesi",
        "desc": "Mikro etkileşimler, akıcı sayfa geçişleri ve cam efekti (glassmorphism) tasarım revizyonu.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-07",
        "dueDate": "2026-12-17",
        "labels": [
            "design",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s25",
        "createdAt": 1789603200000
    },
    {
        "id": "c138",
        "key": "TK-138",
        "title": "2026 Yıl Sonu Sürüm Kapanışı & v2.0 Geçiş Hazırlığı",
        "desc": "Yıllık performans çıktısı, teknik borç envanteri ve 2027 v2.0 geçiş planlaması.",
        "assignee": "Selin Yıldız",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-21",
        "dueDate": "2026-12-30",
        "labels": [
            "docs"
        ],
        "storyPoints": 5,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s26",
        "createdAt": 1789603200000
    },
    {
        "id": "c139",
        "key": "TK-139",
        "title": "Yapay Zeka Destekli Görev Özeti ve Efor Tahmin Modeli",
        "desc": "Görev başlığı ve açıklamasına göre otomatik story points ve tahmini saat öneren LLM motoru.",
        "assignee": "Ali Yılmaz",
        "priority": "high",
        "col": "todo",
        "startDate": "2027-01-04",
        "dueDate": "2027-01-15",
        "labels": [
            "backend",
            "ai"
        ],
        "storyPoints": 8,
        "estimatedEffort": 36,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st139-1",
                "text": "Geçmiş 1 yıllık sprint verileriyle model eğitimi",
                "done": false
            },
            {
                "id": "st139-2",
                "text": "Tek tıkla kart özetleme arayüzü",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s27",
        "createdAt": 1798934400000
    },
    {
        "id": "c140",
        "key": "TK-140",
        "title": "Otomatik Risk Tespiti ve Sprint Gecikme Erken Uyarı Motoru",
        "desc": "Gecikme eğilimi gösteren görevleri harcanan efor sapmasına göre tespit edip lideri uyaran sistem.",
        "assignee": "Gamze Şahin",
        "priority": "high",
        "col": "todo",
        "startDate": "2027-01-18",
        "dueDate": "2027-01-29",
        "labels": [
            "analytics",
            "ai"
        ],
        "storyPoints": 8,
        "estimatedEffort": 32,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s28",
        "createdAt": 1800144000000
    },
    {
        "id": "c141",
        "key": "TK-141",
        "title": "Global Edge Computing & Dağıtık Event Bus Mimarisi",
        "desc": "Tüm dünyada 300+ edge lokasyonunda çalışan sunucusuz olay yönlendirme altyapısı.",
        "assignee": "Caner Öztürk",
        "priority": "high",
        "col": "todo",
        "startDate": "2027-02-15",
        "dueDate": "2027-02-26",
        "labels": [
            "devops"
        ],
        "storyPoints": 13,
        "estimatedEffort": 44,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s30",
        "createdAt": 1802563200000
    },
    {
        "id": "c142",
        "key": "TK-142",
        "title": "Mikroservis Mimarisine Geçiş & gRPC Servisler Arası İletişim",
        "desc": "Yüksek hacimli veri akışlarında JSON yerine ikili Protocol Buffers ve gRPC standardı.",
        "assignee": "Derya Arslan",
        "priority": "high",
        "col": "todo",
        "startDate": "2027-03-15",
        "dueDate": "2027-03-26",
        "labels": [
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 36,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s32",
        "createdAt": 1804982400000
    },
    {
        "id": "c143",
        "key": "TK-143",
        "title": "Mobil Tablet ve iPad Çoklu Pencere & Kalem Desteği",
        "desc": "Apple Pencil ve Samsung S-Pen ile kartlara serbest çizim notları ve diyagram ekleme.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2027-04-12",
        "dueDate": "2027-04-23",
        "labels": [
            "mobile"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s34",
        "createdAt": 1807401600000
    },
    {
        "id": "c144",
        "key": "TK-144",
        "title": "LLM Destekli Doğal Dil ile Kart ve Sprint Filtreleme",
        "desc": "\"Bu sprintte Zeynep'in yaptığı acil işleri göster\" gibi doğal Türkçe komutlarla anlık filtreleme.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2027-05-10",
        "dueDate": "2027-05-21",
        "labels": [
            "frontend",
            "ai"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s36",
        "createdAt": 1809820800000
    },
    {
        "id": "c145",
        "key": "TK-145",
        "title": "SOC2 Type II ve ISO 27001 Uyumluluk Denetim Hazırlığı",
        "desc": "Şifreleme standartları, veri saklama politikaları ve bağımsız üçüncü taraf denetim raporu.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2027-06-07",
        "dueDate": "2027-06-18",
        "labels": [
            "security"
        ],
        "storyPoints": 8,
        "estimatedEffort": 40,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s38",
        "createdAt": 1812240000000
    },
    {
        "id": "c146",
        "key": "TK-146",
        "title": "Kaos Mühendisliği (Chaos Engineering) ve Otomatik Dayanıklılık Testleri",
        "desc": "Rastgele pod ve ağ kesintilerinde sistemin 0 kesintiyle (zero-downtime) kendini toparlaması testi.",
        "assignee": "Burcu Çelik",
        "priority": "medium",
        "col": "todo",
        "startDate": "2027-07-05",
        "dueDate": "2027-07-16",
        "labels": [
            "qa",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s40",
        "createdAt": 1814659200000
    },
    {
        "id": "c147",
        "key": "TK-147",
        "title": "Kanban Public SDK v3 (Python, Go, Node.js Paketleri)",
        "desc": "Müşteri geliştiricilerinin sistemle doğrudan entegre olabilmesi için resmi SDK kütüphaneleri.",
        "assignee": "Mehmet Demir",
        "priority": "medium",
        "col": "todo",
        "startDate": "2027-08-02",
        "dueDate": "2027-08-13",
        "labels": [
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 34,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s42",
        "createdAt": 1817078400000
    },
    {
        "id": "c148",
        "key": "TK-148",
        "title": "AI Akıllı Görev Atama (Yetkinlik ve İş Yüküne Göre Öneri)",
        "desc": "Ekip üyelerinin geçmiş uzmanlık alanları ve anlık haftalık saat yüküne göre en uygun kişiyi önerme.",
        "assignee": "Ali Yılmaz",
        "priority": "high",
        "col": "todo",
        "startDate": "2027-09-13",
        "dueDate": "2027-09-24",
        "labels": [
            "ai"
        ],
        "storyPoints": 8,
        "estimatedEffort": 32,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s45",
        "createdAt": 1820707200000
    },
    {
        "id": "c149",
        "key": "TK-149",
        "title": "Çoklu Bulut (Multi-Cloud AWS + GCP + Cloudflare) Yedeklilik Testleri",
        "desc": "Tek bir sağlayıcıya bağımlı kalmadan otomatik yük devretme (failover) mimarisinin doğrulanması.",
        "assignee": "Caner Öztürk",
        "priority": "high",
        "col": "todo",
        "startDate": "2027-10-25",
        "dueDate": "2027-11-05",
        "labels": [
            "devops"
        ],
        "storyPoints": 8,
        "estimatedEffort": 36,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s48",
        "createdAt": 1824336000000
    },
    {
        "id": "c150",
        "key": "TK-150",
        "title": "Yıllık Yönetici Özeti ve Tahmine Dayalı İş Yükü Raporlama",
        "desc": "2027 yılı boyunca gerçekleşen eforların, hız eğrilerinin ve 2028 bütçe tahminlerinin çıktısı.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2027-11-22",
        "dueDate": "2027-12-03",
        "labels": [
            "analytics"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s50",
        "createdAt": 1826755200000
    },
    {
        "id": "c151",
        "key": "TK-151",
        "title": "2027 Yıl Sonu Kapanışı ve 2028 Stratejik Ürün Vizyonu",
        "desc": "Nova takımı ile birlikte 2 yıllık hedeflerin tamamlanması ve kurumsal v3 lansman hazırlığı.",
        "assignee": "Selin Yıldız",
        "priority": "low",
        "col": "todo",
        "startDate": "2027-12-20",
        "dueDate": "2027-12-31",
        "labels": [
            "docs"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [],
        "comments": [
            {
                "id": "cm151-1",
                "text": "Tüm ekip harika bir 2 yıl geçirdi! 2028 hedefleri belirlendi.",
                "createdAt": 1829692800000,
                "author": "Selin Yıldız"
            }
        ],
        "epicId": "e1",
        "sprintId": "s52",
        "createdAt": 1829174400000
    }
];

const DEMO_LABELS = [
    {
        "id": "bug",
        "name": "Bug",
        "color": "#ef4444",
        "bg": "#fef2f2",
        "createdAt": 1767571200000
    },
    {
        "id": "feature",
        "name": "Özellik",
        "color": "#6366f1",
        "bg": "#eef2ff",
        "createdAt": 1767571200000
    },
    {
        "id": "task",
        "name": "Görev",
        "color": "#3b82f6",
        "bg": "#eff6ff",
        "createdAt": 1767571200000
    },
    {
        "id": "devops",
        "name": "DevOps",
        "color": "#0891b2",
        "bg": "#ecfeff",
        "createdAt": 1767571200000
    },
    {
        "id": "security",
        "name": "Güvenlik",
        "color": "#f97316",
        "bg": "#fff7ed",
        "createdAt": 1767571200000
    },
    {
        "id": "backend",
        "name": "Backend",
        "color": "#10b981",
        "bg": "#ecfdf5",
        "createdAt": 1767571200000
    },
    {
        "id": "frontend",
        "name": "Frontend",
        "color": "#0ea5e9",
        "bg": "#f0f9ff",
        "createdAt": 1767571200000
    },
    {
        "id": "mobile",
        "name": "Mobil",
        "color": "#22c55e",
        "bg": "#f0fdf4",
        "createdAt": 1767571200000
    },
    {
        "id": "qa",
        "name": "Test & QA",
        "color": "#ec4899",
        "bg": "#fdf2f8",
        "createdAt": 1767571200000
    },
    {
        "id": "analytics",
        "name": "Analitik",
        "color": "#14b8a6",
        "bg": "#f0fdfa",
        "createdAt": 1767571200000
    },
    {
        "id": "ai",
        "name": "Yapay Zeka",
        "color": "#a855f7",
        "bg": "#faf5ff",
        "createdAt": 1767571200000
    },
    {
        "id": "design",
        "name": "Tasarım",
        "color": "#8b5cf6",
        "bg": "#f5f3ff",
        "createdAt": 1767571200000
    },
    {
        "id": "docs",
        "name": "Dokümantasyon",
        "color": "#64748b",
        "bg": "#f8fafc",
        "createdAt": 1767571200000
    }
];

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

    console.log(`Seeding database "${LS_KEY}" with 2026-2027 Nova Team project data (52 sprints, 10 users)...`);

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
