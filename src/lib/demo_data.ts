// ============================================================
//  demo_data.ts – 2026-2027 Calendar Years Demo Dataset
//  Nova Mühendislik Takımı: 10 Kişilik Ekip & 52 Haftalık Sprint (520 Görev)
// ============================================================

import { Card, Epic, Sprint, User, Label, DbSchema } from '../types';

export const DEMO_TEAM_USERS: User[] = [
    { id: 'usr-1', username: 'admin', name: 'Ali Yılmaz', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#4f46e5', role: 'admin', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-2', username: 'zeynep', name: 'Zeynep Kaya', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#0ea5e9', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-3', username: 'mehmet', name: 'Mehmet Demir', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#10b981', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-4', username: 'selin', name: 'Selin Yıldız', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#f59e0b', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-5', username: 'caner', name: 'Caner Öztürk', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#8b5cf6', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-6', username: 'burcu', name: 'Burcu Çelik', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#ec4899', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-7', username: 'emre', name: 'Emre Aydın', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#06b6d4', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-8', username: 'gamze', name: 'Gamze Şahin', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#14b8a6', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-9', username: 'tolga', name: 'Tolga Kurt', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#f97316', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 },
    { id: 'usr-10', username: 'derya', name: 'Derya Arslan', passwordHash: 'de12bb28840c728fe69392f5d555dc59:463735cd8d5cff5ed924000ef71d6e4211dd3f574a518c06c5bb2de7321a5fad4f97b4df75771607e83152abff97fb50a3c9d5fe5ad5b219e3a560bf19f320dd', avatarColor: '#64748b', role: 'user', tenantId: 'demo', workspaces: ['demo'], createdAt: 1767571200000 }
];

export const DEMO_EPICS: Epic[] = [
    { id: 'e1', name: 'Kullanıcı & Takım Yönetimi (2026)', color: '#6366f1', createdAt: 1767571200000 },
    { id: 'e2', name: 'Ödeme & Faturalandırma Altyapısı (2026)', color: '#f59e0b', createdAt: 1767571200000 },
    { id: 'e3', name: 'Mobil Uygulama v1 & v2 (2026)', color: '#22c55e', createdAt: 1767571200000 },
    { id: 'e4', name: 'Dashboard & Analitik Raporlama (2026-2027)', color: '#ef4444', createdAt: 1767571200000 },
    { id: 'e5', name: 'Cloud, CI/CD & Kubernetes DevOps (2026)', color: '#0891b2', createdAt: 1767571200000 },
    { id: 'e6', name: 'Design System & Erişilebilirlik (2026)', color: '#8b5cf6', createdAt: 1767571200000 },
    { id: 'e7', name: 'Yapay Zeka Destekli Görev & Risk Tahmini (2027)', color: '#ec4899', createdAt: 1767571200000 },
    { id: 'e8', name: 'Global Multi-Region Dağıtık Veri Ağı (2027)', color: '#3b82f6', createdAt: 1767571200000 },
    { id: 'e9', name: 'Kurumsal SSO, SCIM & DevSecOps Güvenlik (2027)', color: '#f97316', createdAt: 1767571200000 },
    { id: 'e10', name: 'Gerçek Zamanlı Çift Yönlü Webhook & SDK v3 (2027)', color: '#14b8a6', createdAt: 1767571200000 }
];

export const DEMO_LABELS: Label[] = [
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
];

const GENERATED_SPRINTS: Sprint[] = [
    {
        "id": "s1",
        "name": "Sprint 1",
        "startDate": "2026-01-05",
        "endDate": "2026-01-11",
        "active": false,
        "createdAt": 1767301200000
    },
    {
        "id": "s2",
        "name": "Sprint 2",
        "startDate": "2026-01-12",
        "endDate": "2026-01-18",
        "active": false,
        "createdAt": 1767906000000
    },
    {
        "id": "s3",
        "name": "Sprint 3",
        "startDate": "2026-01-19",
        "endDate": "2026-01-25",
        "active": false,
        "createdAt": 1768510800000
    },
    {
        "id": "s4",
        "name": "Sprint 4",
        "startDate": "2026-01-26",
        "endDate": "2026-02-01",
        "active": false,
        "createdAt": 1769115600000
    },
    {
        "id": "s5",
        "name": "Sprint 5",
        "startDate": "2026-02-02",
        "endDate": "2026-02-08",
        "active": false,
        "createdAt": 1769720400000
    },
    {
        "id": "s6",
        "name": "Sprint 6",
        "startDate": "2026-02-09",
        "endDate": "2026-02-15",
        "active": false,
        "createdAt": 1770325200000
    },
    {
        "id": "s7",
        "name": "Sprint 7",
        "startDate": "2026-02-16",
        "endDate": "2026-02-22",
        "active": false,
        "createdAt": 1770930000000
    },
    {
        "id": "s8",
        "name": "Sprint 8",
        "startDate": "2026-02-23",
        "endDate": "2026-03-01",
        "active": false,
        "createdAt": 1771534800000
    },
    {
        "id": "s9",
        "name": "Sprint 9",
        "startDate": "2026-03-02",
        "endDate": "2026-03-08",
        "active": false,
        "createdAt": 1772139600000
    },
    {
        "id": "s10",
        "name": "Sprint 10",
        "startDate": "2026-03-09",
        "endDate": "2026-03-15",
        "active": false,
        "createdAt": 1772744400000
    },
    {
        "id": "s11",
        "name": "Sprint 11",
        "startDate": "2026-03-16",
        "endDate": "2026-03-22",
        "active": false,
        "createdAt": 1773349200000
    },
    {
        "id": "s12",
        "name": "Sprint 12",
        "startDate": "2026-03-23",
        "endDate": "2026-03-29",
        "active": false,
        "createdAt": 1773954000000
    },
    {
        "id": "s13",
        "name": "Sprint 13",
        "startDate": "2026-03-30",
        "endDate": "2026-04-05",
        "active": false,
        "createdAt": 1774558800000
    },
    {
        "id": "s14",
        "name": "Sprint 14",
        "startDate": "2026-04-06",
        "endDate": "2026-04-12",
        "active": false,
        "createdAt": 1775163600000
    },
    {
        "id": "s15",
        "name": "Sprint 15",
        "startDate": "2026-04-13",
        "endDate": "2026-04-19",
        "active": false,
        "createdAt": 1775768400000
    },
    {
        "id": "s16",
        "name": "Sprint 16",
        "startDate": "2026-04-20",
        "endDate": "2026-04-26",
        "active": false,
        "createdAt": 1776373200000
    },
    {
        "id": "s17",
        "name": "Sprint 17",
        "startDate": "2026-04-27",
        "endDate": "2026-05-03",
        "active": false,
        "createdAt": 1776978000000
    },
    {
        "id": "s18",
        "name": "Sprint 18",
        "startDate": "2026-05-04",
        "endDate": "2026-05-10",
        "active": false,
        "createdAt": 1777582800000
    },
    {
        "id": "s19",
        "name": "Sprint 19",
        "startDate": "2026-05-11",
        "endDate": "2026-05-17",
        "active": false,
        "createdAt": 1778187600000
    },
    {
        "id": "s20",
        "name": "Sprint 20",
        "startDate": "2026-05-18",
        "endDate": "2026-05-24",
        "active": false,
        "createdAt": 1778792400000
    },
    {
        "id": "s21",
        "name": "Sprint 21",
        "startDate": "2026-05-25",
        "endDate": "2026-05-31",
        "active": false,
        "createdAt": 1779397200000
    },
    {
        "id": "s22",
        "name": "Sprint 22",
        "startDate": "2026-06-01",
        "endDate": "2026-06-07",
        "active": false,
        "createdAt": 1780002000000
    },
    {
        "id": "s23",
        "name": "Sprint 23",
        "startDate": "2026-06-08",
        "endDate": "2026-06-14",
        "active": false,
        "createdAt": 1780606800000
    },
    {
        "id": "s24",
        "name": "Sprint 24",
        "startDate": "2026-06-15",
        "endDate": "2026-06-21",
        "active": false,
        "createdAt": 1781211600000
    },
    {
        "id": "s25",
        "name": "Sprint 25",
        "startDate": "2026-06-22",
        "endDate": "2026-06-28",
        "active": false,
        "createdAt": 1781816400000
    },
    {
        "id": "s26",
        "name": "Sprint 26",
        "startDate": "2026-06-29",
        "endDate": "2026-07-05",
        "active": false,
        "createdAt": 1782421200000
    },
    {
        "id": "s27",
        "name": "Sprint 27",
        "startDate": "2026-07-06",
        "endDate": "2026-07-12",
        "active": false,
        "createdAt": 1783026000000
    },
    {
        "id": "s28",
        "name": "Sprint 28",
        "startDate": "2026-07-13",
        "endDate": "2026-07-19",
        "active": false,
        "createdAt": 1783630800000
    },
    {
        "id": "s29",
        "name": "Sprint 29",
        "startDate": "2026-07-20",
        "endDate": "2026-07-26",
        "active": false,
        "createdAt": 1784235600000
    },
    {
        "id": "s30",
        "name": "Sprint 30",
        "startDate": "2026-07-27",
        "endDate": "2026-08-02",
        "active": false,
        "createdAt": 1784840400000
    },
    {
        "id": "s31",
        "name": "Sprint 31",
        "startDate": "2026-08-03",
        "endDate": "2026-08-09",
        "active": false,
        "createdAt": 1785445200000
    },
    {
        "id": "s32",
        "name": "Sprint 32",
        "startDate": "2026-08-10",
        "endDate": "2026-08-16",
        "active": false,
        "createdAt": 1786050000000
    },
    {
        "id": "s33",
        "name": "Sprint 33",
        "startDate": "2026-08-17",
        "endDate": "2026-08-23",
        "active": false,
        "createdAt": 1786654800000
    },
    {
        "id": "s34",
        "name": "Sprint 34",
        "startDate": "2026-08-24",
        "endDate": "2026-08-30",
        "active": false,
        "createdAt": 1787259600000
    },
    {
        "id": "s35",
        "name": "Sprint 35",
        "startDate": "2026-08-31",
        "endDate": "2026-09-06",
        "active": false,
        "createdAt": 1787864400000
    },
    {
        "id": "s36",
        "name": "Sprint 36",
        "startDate": "2026-09-07",
        "endDate": "2026-09-13",
        "active": false,
        "createdAt": 1788469200000
    },
    {
        "id": "s37",
        "name": "Sprint 37",
        "startDate": "2026-09-14",
        "endDate": "2026-09-20",
        "active": true,
        "createdAt": 1789074000000
    },
    {
        "id": "s38",
        "name": "Sprint 38",
        "startDate": "2026-09-21",
        "endDate": "2026-09-27",
        "active": false,
        "createdAt": 1789678800000
    },
    {
        "id": "s39",
        "name": "Sprint 39",
        "startDate": "2026-09-28",
        "endDate": "2026-10-04",
        "active": false,
        "createdAt": 1790283600000
    },
    {
        "id": "s40",
        "name": "Sprint 40",
        "startDate": "2026-10-05",
        "endDate": "2026-10-11",
        "active": false,
        "createdAt": 1790888400000
    },
    {
        "id": "s41",
        "name": "Sprint 41",
        "startDate": "2026-10-12",
        "endDate": "2026-10-18",
        "active": false,
        "createdAt": 1791493200000
    },
    {
        "id": "s42",
        "name": "Sprint 42",
        "startDate": "2026-10-19",
        "endDate": "2026-10-25",
        "active": false,
        "createdAt": 1792098000000
    },
    {
        "id": "s43",
        "name": "Sprint 43",
        "startDate": "2026-10-26",
        "endDate": "2026-11-01",
        "active": false,
        "createdAt": 1792702800000
    },
    {
        "id": "s44",
        "name": "Sprint 44",
        "startDate": "2026-11-02",
        "endDate": "2026-11-08",
        "active": false,
        "createdAt": 1793307600000
    },
    {
        "id": "s45",
        "name": "Sprint 45",
        "startDate": "2026-11-09",
        "endDate": "2026-11-15",
        "active": false,
        "createdAt": 1793912400000
    },
    {
        "id": "s46",
        "name": "Sprint 46",
        "startDate": "2026-11-16",
        "endDate": "2026-11-22",
        "active": false,
        "createdAt": 1794517200000
    },
    {
        "id": "s47",
        "name": "Sprint 47",
        "startDate": "2026-11-23",
        "endDate": "2026-11-29",
        "active": false,
        "createdAt": 1795122000000
    },
    {
        "id": "s48",
        "name": "Sprint 48",
        "startDate": "2026-11-30",
        "endDate": "2026-12-06",
        "active": false,
        "createdAt": 1795726800000
    },
    {
        "id": "s49",
        "name": "Sprint 49",
        "startDate": "2026-12-07",
        "endDate": "2026-12-13",
        "active": false,
        "createdAt": 1796331600000
    },
    {
        "id": "s50",
        "name": "Sprint 50",
        "startDate": "2026-12-14",
        "endDate": "2026-12-20",
        "active": false,
        "createdAt": 1796936400000
    },
    {
        "id": "s51",
        "name": "Sprint 51",
        "startDate": "2026-12-21",
        "endDate": "2026-12-27",
        "active": false,
        "createdAt": 1797541200000
    },
    {
        "id": "s52",
        "name": "Sprint 52",
        "startDate": "2026-12-28",
        "endDate": "2027-01-03",
        "active": false,
        "createdAt": 1798146000000
    }
];
const GENERATED_CARDS: Card[] = [
    {
        "id": "c101",
        "key": "TK-101",
        "title": "TypeScript ve Monorepo Altyapısının Kurulması",
        "desc": "Ali Yılmaz tarafından üstlenilen TypeScript ve Monorepo Altyapısının Kurulması çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-05",
        "dueDate": "2026-01-09",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st1-1",
                "text": "TypeScript ve Monorepo Altyapısının Kurulması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st1-2",
                "text": "TypeScript ve Monorepo Altyapısının Kurulması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c102",
        "key": "TK-102",
        "title": "Design System Tasarım Tokenları ve CSS Değişkenleri",
        "desc": "Zeynep Kaya tarafından üstlenilen Design System Tasarım Tokenları ve CSS Değişkenleri çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-06",
        "dueDate": "2026-01-10",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st2-1",
                "text": "Design System Tasarım Tokenları ve CSS Değişkenleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st2-2",
                "text": "Design System Tasarım Tokenları ve CSS Değişkenleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c103",
        "key": "TK-103",
        "title": "PostgreSQL Veritabanı Şeması ve Tablo İlişkileri",
        "desc": "Mehmet Demir tarafından üstlenilen PostgreSQL Veritabanı Şeması ve Tablo İlişkileri çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-05",
        "dueDate": "2026-01-11",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st3-1",
                "text": "PostgreSQL Veritabanı Şeması ve Tablo İlişkileri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st3-2",
                "text": "PostgreSQL Veritabanı Şeması ve Tablo İlişkileri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c104",
        "key": "TK-104",
        "title": "Kullanıcı Karşılama ve İlk Katılım (Onboarding)",
        "desc": "Selin Yıldız tarafından üstlenilen Kullanıcı Karşılama ve İlk Katılım (Onboarding) çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-06",
        "dueDate": "2026-01-09",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st4-1",
                "text": "Kullanıcı Karşılama ve İlk Katılım (Onboarding) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st4-2",
                "text": "Kullanıcı Karşılama ve İlk Katılım (Onboarding) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c105",
        "key": "TK-105",
        "title": "Dockerfile ve Multi-Stage Build Konfigürasyonu",
        "desc": "Caner Öztürk tarafından üstlenilen Dockerfile ve Multi-Stage Build Konfigürasyonu çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-05",
        "dueDate": "2026-01-10",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st5-1",
                "text": "Dockerfile ve Multi-Stage Build Konfigürasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st5-2",
                "text": "Dockerfile ve Multi-Stage Build Konfigürasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c106",
        "key": "TK-106",
        "title": "Jest ve Supertest ile REST API Birim Test Altyapısı",
        "desc": "Burcu Çelik tarafından üstlenilen Jest ve Supertest ile REST API Birim Test Altyapısı çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-06",
        "dueDate": "2026-01-11",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st6-1",
                "text": "Jest ve Supertest ile REST API Birim Test Altyapısı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st6-2",
                "text": "Jest ve Supertest ile REST API Birim Test Altyapısı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c107",
        "key": "TK-107",
        "title": "React Native Çekirdek Proje Kurulumu ve Mimarisi",
        "desc": "Emre Aydın tarafından üstlenilen React Native Çekirdek Proje Kurulumu ve Mimarisi çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-05",
        "dueDate": "2026-01-09",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st7-1",
                "text": "React Native Çekirdek Proje Kurulumu ve Mimarisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st7-2",
                "text": "React Native Çekirdek Proje Kurulumu ve Mimarisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm7-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Emre Aydın",
                "createdAt": 1767895200000
            }
        ],
        "epicId": "e7",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c108",
        "key": "TK-108",
        "title": "Pano Efor ve Süreç Metrikleri Veri Modeli",
        "desc": "Gamze Şahin tarafından üstlenilen Pano Efor ve Süreç Metrikleri Veri Modeli çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-06",
        "dueDate": "2026-01-10",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st8-1",
                "text": "Pano Efor ve Süreç Metrikleri Veri Modeli - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st8-2",
                "text": "Pano Efor ve Süreç Metrikleri Veri Modeli - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c109",
        "key": "TK-109",
        "title": "OWASP Top 10 Web Uygulama Güvenlik Risk Analizi",
        "desc": "Tolga Kurt tarafından üstlenilen OWASP Top 10 Web Uygulama Güvenlik Risk Analizi çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-05",
        "dueDate": "2026-01-11",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st9-1",
                "text": "OWASP Top 10 Web Uygulama Güvenlik Risk Analizi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st9-2",
                "text": "OWASP Top 10 Web Uygulama Güvenlik Risk Analizi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c110",
        "key": "TK-110",
        "title": "Dağıtık Sistem Mimarisi ve Servis Topolojisi",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Sistem Mimarisi ve Servis Topolojisi çalışması. Sprint 1 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-06",
        "dueDate": "2026-01-09",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st10-1",
                "text": "Dağıtık Sistem Mimarisi ve Servis Topolojisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st10-2",
                "text": "Dağıtık Sistem Mimarisi ve Servis Topolojisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s1",
        "createdAt": 1767387600000
    },
    {
        "id": "c111",
        "key": "TK-111",
        "title": "Domain-Driven Design Modül Sınırlarının Belirlenmesi",
        "desc": "Ali Yılmaz tarafından üstlenilen Domain-Driven Design Modül Sınırlarının Belirlenmesi çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-12",
        "dueDate": "2026-01-16",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st11-1",
                "text": "Domain-Driven Design Modül Sınırlarının Belirlenmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st11-2",
                "text": "Domain-Driven Design Modül Sınırlarının Belirlenmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c112",
        "key": "TK-112",
        "title": "WCAG 2.1 AA Renk Kontrastı ve Tipografi",
        "desc": "Zeynep Kaya tarafından üstlenilen WCAG 2.1 AA Renk Kontrastı ve Tipografi çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-13",
        "dueDate": "2026-01-17",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st12-1",
                "text": "WCAG 2.1 AA Renk Kontrastı ve Tipografi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st12-2",
                "text": "WCAG 2.1 AA Renk Kontrastı ve Tipografi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c113",
        "key": "TK-113",
        "title": "Kartlar ve Kolonlar Tablosu İndeksleme",
        "desc": "Mehmet Demir tarafından üstlenilen Kartlar ve Kolonlar Tablosu İndeksleme çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-12",
        "dueDate": "2026-01-18",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st13-1",
                "text": "Kartlar ve Kolonlar Tablosu İndeksleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st13-2",
                "text": "Kartlar ve Kolonlar Tablosu İndeksleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c114",
        "key": "TK-114",
        "title": "Takım Çalışma Alanı Davet Linkleri",
        "desc": "Selin Yıldız tarafından üstlenilen Takım Çalışma Alanı Davet Linkleri çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-13",
        "dueDate": "2026-01-16",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st14-1",
                "text": "Takım Çalışma Alanı Davet Linkleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st14-2",
                "text": "Takım Çalışma Alanı Davet Linkleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm14-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Selin Yıldız",
                "createdAt": 1768500000000
            }
        ],
        "epicId": "e5",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c115",
        "key": "TK-115",
        "title": "GitHub Actions CI/CD Pipeline Kurulumu",
        "desc": "Caner Öztürk tarafından üstlenilen GitHub Actions CI/CD Pipeline Kurulumu çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-12",
        "dueDate": "2026-01-17",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st15-1",
                "text": "GitHub Actions CI/CD Pipeline Kurulumu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st15-2",
                "text": "GitHub Actions CI/CD Pipeline Kurulumu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c116",
        "key": "TK-116",
        "title": "Kullanıcı Giriş ve Kayıt Senaryoları Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Kullanıcı Giriş ve Kayıt Senaryoları Testleri çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-13",
        "dueDate": "2026-01-18",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st16-1",
                "text": "Kullanıcı Giriş ve Kayıt Senaryoları Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st16-2",
                "text": "Kullanıcı Giriş ve Kayıt Senaryoları Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c117",
        "key": "TK-117",
        "title": "TypeScript, ESLint ve Mobil Yapılandırma",
        "desc": "Emre Aydın tarafından üstlenilen TypeScript, ESLint ve Mobil Yapılandırma çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-12",
        "dueDate": "2026-01-16",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st17-1",
                "text": "TypeScript, ESLint ve Mobil Yapılandırma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st17-2",
                "text": "TypeScript, ESLint ve Mobil Yapılandırma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c118",
        "key": "TK-118",
        "title": "Görev Tamamlama Süresi (Cycle Time) Formülü",
        "desc": "Gamze Şahin tarafından üstlenilen Görev Tamamlama Süresi (Cycle Time) Formülü çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-13",
        "dueDate": "2026-01-17",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st18-1",
                "text": "Görev Tamamlama Süresi (Cycle Time) Formülü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st18-2",
                "text": "Görev Tamamlama Süresi (Cycle Time) Formülü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c119",
        "key": "TK-119",
        "title": "Parola Şifreleme: PBKDF2-SHA512 ve Salt",
        "desc": "Tolga Kurt tarafından üstlenilen Parola Şifreleme: PBKDF2-SHA512 ve Salt çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-12",
        "dueDate": "2026-01-18",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st19-1",
                "text": "Parola Şifreleme: PBKDF2-SHA512 ve Salt - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st19-2",
                "text": "Parola Şifreleme: PBKDF2-SHA512 ve Salt - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c120",
        "key": "TK-120",
        "title": "Apache Kafka Mesaj Kuyruğu Kümesi Kurulumu",
        "desc": "Derya Arslan tarafından üstlenilen Apache Kafka Mesaj Kuyruğu Kümesi Kurulumu çalışması. Sprint 2 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-13",
        "dueDate": "2026-01-16",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st20-1",
                "text": "Apache Kafka Mesaj Kuyruğu Kümesi Kurulumu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st20-2",
                "text": "Apache Kafka Mesaj Kuyruğu Kümesi Kurulumu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s2",
        "createdAt": 1767992400000
    },
    {
        "id": "c121",
        "key": "TK-121",
        "title": "JWT Tabanlı Oturum ve RBAC Yetkilendirme Servisi",
        "desc": "Ali Yılmaz tarafından üstlenilen JWT Tabanlı Oturum ve RBAC Yetkilendirme Servisi çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-19",
        "dueDate": "2026-01-23",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st21-1",
                "text": "JWT Tabanlı Oturum ve RBAC Yetkilendirme Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st21-2",
                "text": "JWT Tabanlı Oturum ve RBAC Yetkilendirme Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm21-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Ali Yılmaz",
                "createdAt": 1769104800000
            }
        ],
        "epicId": "e3",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c122",
        "key": "TK-122",
        "title": "Modern Karanlık ve Aydınlık Tema Geçiş Sistemi",
        "desc": "Zeynep Kaya tarafından üstlenilen Modern Karanlık ve Aydınlık Tema Geçiş Sistemi çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-20",
        "dueDate": "2026-01-24",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st22-1",
                "text": "Modern Karanlık ve Aydınlık Tema Geçiş Sistemi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st22-2",
                "text": "Modern Karanlık ve Aydınlık Tema Geçiş Sistemi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c123",
        "key": "TK-123",
        "title": "Kullanıcı ve Çalışma Alanı Migrasyonları",
        "desc": "Mehmet Demir tarafından üstlenilen Kullanıcı ve Çalışma Alanı Migrasyonları çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-19",
        "dueDate": "2026-01-25",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st23-1",
                "text": "Kullanıcı ve Çalışma Alanı Migrasyonları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st23-2",
                "text": "Kullanıcı ve Çalışma Alanı Migrasyonları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c124",
        "key": "TK-124",
        "title": "Şablon Pano Kütüphanesi Oluşturma",
        "desc": "Selin Yıldız tarafından üstlenilen Şablon Pano Kütüphanesi Oluşturma çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-20",
        "dueDate": "2026-01-23",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st24-1",
                "text": "Şablon Pano Kütüphanesi Oluşturma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st24-2",
                "text": "Şablon Pano Kütüphanesi Oluşturma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c125",
        "key": "TK-125",
        "title": "Cloudflare Pages ve Edge Workers Entegrasyonu",
        "desc": "Caner Öztürk tarafından üstlenilen Cloudflare Pages ve Edge Workers Entegrasyonu çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-19",
        "dueDate": "2026-01-24",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st25-1",
                "text": "Cloudflare Pages ve Edge Workers Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st25-2",
                "text": "Cloudflare Pages ve Edge Workers Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c126",
        "key": "TK-126",
        "title": "Kart Oluşturma ve Silme Entegrasyon Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Kart Oluşturma ve Silme Entegrasyon Testleri çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-20",
        "dueDate": "2026-01-25",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st26-1",
                "text": "Kart Oluşturma ve Silme Entegrasyon Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st26-2",
                "text": "Kart Oluşturma ve Silme Entegrasyon Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c127",
        "key": "TK-127",
        "title": "iOS CocoaPods ve Android Gradle Yönetimi",
        "desc": "Emre Aydın tarafından üstlenilen iOS CocoaPods ve Android Gradle Yönetimi çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-19",
        "dueDate": "2026-01-23",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st27-1",
                "text": "iOS CocoaPods ve Android Gradle Yönetimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st27-2",
                "text": "iOS CocoaPods ve Android Gradle Yönetimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c128",
        "key": "TK-128",
        "title": "Haftalık Sprint Hız (Velocity) Eğrisi Algoritması",
        "desc": "Gamze Şahin tarafından üstlenilen Haftalık Sprint Hız (Velocity) Eğrisi Algoritması çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-20",
        "dueDate": "2026-01-24",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st28-1",
                "text": "Haftalık Sprint Hız (Velocity) Eğrisi Algoritması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st28-2",
                "text": "Haftalık Sprint Hız (Velocity) Eğrisi Algoritması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm28-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Gamze Şahin",
                "createdAt": 1769191200000
            }
        ],
        "epicId": "e10",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c129",
        "key": "TK-129",
        "title": "Güvenli HTTP Başlıkları (CSP, HSTS, X-Frame)",
        "desc": "Tolga Kurt tarafından üstlenilen Güvenli HTTP Başlıkları (CSP, HSTS, X-Frame) çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-19",
        "dueDate": "2026-01-25",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st29-1",
                "text": "Güvenli HTTP Başlıkları (CSP, HSTS, X-Frame) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st29-2",
                "text": "Güvenli HTTP Başlıkları (CSP, HSTS, X-Frame) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c130",
        "key": "TK-130",
        "title": "Olay Güdümlü (Event-Driven) Pano Değişiklikleri Akışı",
        "desc": "Derya Arslan tarafından üstlenilen Olay Güdümlü (Event-Driven) Pano Değişiklikleri Akışı çalışması. Sprint 3 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-20",
        "dueDate": "2026-01-23",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st30-1",
                "text": "Olay Güdümlü (Event-Driven) Pano Değişiklikleri Akışı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st30-2",
                "text": "Olay Güdümlü (Event-Driven) Pano Değişiklikleri Akışı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s3",
        "createdAt": 1768597200000
    },
    {
        "id": "c131",
        "key": "TK-131",
        "title": "REST API Standartları ve OpenAPI 3.0 Dokümantasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen REST API Standartları ve OpenAPI 3.0 Dokümantasyonu çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-26",
        "dueDate": "2026-01-30",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st31-1",
                "text": "REST API Standartları ve OpenAPI 3.0 Dokümantasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st31-2",
                "text": "REST API Standartları ve OpenAPI 3.0 Dokümantasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c132",
        "key": "TK-132",
        "title": "Erişilebilir Modal ve Dialog Bileşeni",
        "desc": "Zeynep Kaya tarafından üstlenilen Erişilebilir Modal ve Dialog Bileşeni çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-27",
        "dueDate": "2026-01-31",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st32-1",
                "text": "Erişilebilir Modal ve Dialog Bileşeni - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st32-2",
                "text": "Erişilebilir Modal ve Dialog Bileşeni - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c133",
        "key": "TK-133",
        "title": "D1 SQLite ve PostgreSQL Uyumluluk Katmanı",
        "desc": "Mehmet Demir tarafından üstlenilen D1 SQLite ve PostgreSQL Uyumluluk Katmanı çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-26",
        "dueDate": "2026-02-01",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st33-1",
                "text": "D1 SQLite ve PostgreSQL Uyumluluk Katmanı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st33-2",
                "text": "D1 SQLite ve PostgreSQL Uyumluluk Katmanı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c134",
        "key": "TK-134",
        "title": "Kart Oluşturma Sihirbazı Geliştirme",
        "desc": "Selin Yıldız tarafından üstlenilen Kart Oluşturma Sihirbazı Geliştirme çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-27",
        "dueDate": "2026-01-30",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st34-1",
                "text": "Kart Oluşturma Sihirbazı Geliştirme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st34-2",
                "text": "Kart Oluşturma Sihirbazı Geliştirme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c135",
        "key": "TK-135",
        "title": "Cloudflare D1 Veritabanı Migrasyon Adımları",
        "desc": "Caner Öztürk tarafından üstlenilen Cloudflare D1 Veritabanı Migrasyon Adımları çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-01-26",
        "dueDate": "2026-01-31",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st35-1",
                "text": "Cloudflare D1 Veritabanı Migrasyon Adımları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st35-2",
                "text": "Cloudflare D1 Veritabanı Migrasyon Adımları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm35-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Caner Öztürk",
                "createdAt": 1769796000000
            }
        ],
        "epicId": "e8",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c136",
        "key": "TK-136",
        "title": "Cypress ile Web Arayüzü E2E Temel Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Cypress ile Web Arayüzü E2E Temel Testleri çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-27",
        "dueDate": "2026-02-01",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st36-1",
                "text": "Cypress ile Web Arayüzü E2E Temel Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st36-2",
                "text": "Cypress ile Web Arayüzü E2E Temel Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c137",
        "key": "TK-137",
        "title": "React Navigation 7 Sekme ve Yığın Yönlendirmesi",
        "desc": "Emre Aydın tarafından üstlenilen React Navigation 7 Sekme ve Yığın Yönlendirmesi çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-26",
        "dueDate": "2026-01-30",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st37-1",
                "text": "React Navigation 7 Sekme ve Yığın Yönlendirmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st37-2",
                "text": "React Navigation 7 Sekme ve Yığın Yönlendirmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c138",
        "key": "TK-138",
        "title": "Kümülatif Akış Diyagramı Veri Pipelineı",
        "desc": "Gamze Şahin tarafından üstlenilen Kümülatif Akış Diyagramı Veri Pipelineı çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-27",
        "dueDate": "2026-01-31",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st38-1",
                "text": "Kümülatif Akış Diyagramı Veri Pipelineı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st38-2",
                "text": "Kümülatif Akış Diyagramı Veri Pipelineı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c139",
        "key": "TK-139",
        "title": "Cross-Site Scripting (XSS) Girdi Temizleme",
        "desc": "Tolga Kurt tarafından üstlenilen Cross-Site Scripting (XSS) Girdi Temizleme çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-01-26",
        "dueDate": "2026-02-01",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st39-1",
                "text": "Cross-Site Scripting (XSS) Girdi Temizleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st39-2",
                "text": "Cross-Site Scripting (XSS) Girdi Temizleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c140",
        "key": "TK-140",
        "title": "Dağıtık Sistemlerde Veri Tutarlılığı",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Sistemlerde Veri Tutarlılığı çalışması. Sprint 4 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-01-27",
        "dueDate": "2026-01-30",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st40-1",
                "text": "Dağıtık Sistemlerde Veri Tutarlılığı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st40-2",
                "text": "Dağıtık Sistemlerde Veri Tutarlılığı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s4",
        "createdAt": 1769202000000
    },
    {
        "id": "c141",
        "key": "TK-141",
        "title": "Stripe & İyzico Ödeme Ağ Geçidi Entegrasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen Stripe & İyzico Ödeme Ağ Geçidi Entegrasyonu çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-02",
        "dueDate": "2026-02-06",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st41-1",
                "text": "Stripe & İyzico Ödeme Ağ Geçidi Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st41-2",
                "text": "Stripe & İyzico Ödeme Ağ Geçidi Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c142",
        "key": "TK-142",
        "title": "Klavye Kısayolları (N, Esc, ?) Altyapısı",
        "desc": "Zeynep Kaya tarafından üstlenilen Klavye Kısayolları (N, Esc, ?) Altyapısı çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-03",
        "dueDate": "2026-02-07",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st42-1",
                "text": "Klavye Kısayolları (N, Esc, ?) Altyapısı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st42-2",
                "text": "Klavye Kısayolları (N, Esc, ?) Altyapısı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm42-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Zeynep Kaya",
                "createdAt": 1770400800000
            }
        ],
        "epicId": "e6",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c143",
        "key": "TK-143",
        "title": "Geciken Görevler İçin Otomatik Uyarı Sorguları",
        "desc": "Mehmet Demir tarafından üstlenilen Geciken Görevler İçin Otomatik Uyarı Sorguları çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-02",
        "dueDate": "2026-02-08",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st43-1",
                "text": "Geciken Görevler İçin Otomatik Uyarı Sorguları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st43-2",
                "text": "Geciken Görevler İçin Otomatik Uyarı Sorguları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c144",
        "key": "TK-144",
        "title": "Efor ve Süreç İlerleme Göstergeleri Entegrasyonu",
        "desc": "Selin Yıldız tarafından üstlenilen Efor ve Süreç İlerleme Göstergeleri Entegrasyonu çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-03",
        "dueDate": "2026-02-06",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st44-1",
                "text": "Efor ve Süreç İlerleme Göstergeleri Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st44-2",
                "text": "Efor ve Süreç İlerleme Göstergeleri Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c145",
        "key": "TK-145",
        "title": "Kubernetes Deployment ve Service Manifestleri",
        "desc": "Caner Öztürk tarafından üstlenilen Kubernetes Deployment ve Service Manifestleri çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-02",
        "dueDate": "2026-02-07",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st45-1",
                "text": "Kubernetes Deployment ve Service Manifestleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st45-2",
                "text": "Kubernetes Deployment ve Service Manifestleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c146",
        "key": "TK-146",
        "title": "Pano Kart Sürükle-Bırak Jestleri E2E Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Pano Kart Sürükle-Bırak Jestleri E2E Testi çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-03",
        "dueDate": "2026-02-08",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st46-1",
                "text": "Pano Kart Sürükle-Bırak Jestleri E2E Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st46-2",
                "text": "Pano Kart Sürükle-Bırak Jestleri E2E Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c147",
        "key": "TK-147",
        "title": "Zustand ile Hafif Mobil Durum Yönetimi",
        "desc": "Emre Aydın tarafından üstlenilen Zustand ile Hafif Mobil Durum Yönetimi çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-02",
        "dueDate": "2026-02-06",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st47-1",
                "text": "Zustand ile Hafif Mobil Durum Yönetimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st47-2",
                "text": "Zustand ile Hafif Mobil Durum Yönetimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c148",
        "key": "TK-148",
        "title": "Ekip Üyesi Başına Efor Dağılımı ve İş Yükü Dengesi",
        "desc": "Gamze Şahin tarafından üstlenilen Ekip Üyesi Başına Efor Dağılımı ve İş Yükü Dengesi çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-03",
        "dueDate": "2026-02-07",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st48-1",
                "text": "Ekip Üyesi Başına Efor Dağılımı ve İş Yükü Dengesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st48-2",
                "text": "Ekip Üyesi Başına Efor Dağılımı ve İş Yükü Dengesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c149",
        "key": "TK-149",
        "title": "SQL Injection Karşıtı Parametrik Sorgu Denetimi",
        "desc": "Tolga Kurt tarafından üstlenilen SQL Injection Karşıtı Parametrik Sorgu Denetimi çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-02",
        "dueDate": "2026-02-08",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st49-1",
                "text": "SQL Injection Karşıtı Parametrik Sorgu Denetimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st49-2",
                "text": "SQL Injection Karşıtı Parametrik Sorgu Denetimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm49-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Tolga Kurt",
                "createdAt": 1770487200000
            }
        ],
        "epicId": "e3",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c150",
        "key": "TK-150",
        "title": "gRPC Servis Tanımları ve Protobuf Serileştirme",
        "desc": "Derya Arslan tarafından üstlenilen gRPC Servis Tanımları ve Protobuf Serileştirme çalışması. Sprint 5 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-03",
        "dueDate": "2026-02-06",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st50-1",
                "text": "gRPC Servis Tanımları ve Protobuf Serileştirme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st50-2",
                "text": "gRPC Servis Tanımları ve Protobuf Serileştirme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s5",
        "createdAt": 1769806800000
    },
    {
        "id": "c151",
        "key": "TK-151",
        "title": "Webhook Dağıtım Motoru ve Yeniden Deneme Mantığı",
        "desc": "Ali Yılmaz tarafından üstlenilen Webhook Dağıtım Motoru ve Yeniden Deneme Mantığı çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-09",
        "dueDate": "2026-02-13",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st51-1",
                "text": "Webhook Dağıtım Motoru ve Yeniden Deneme Mantığı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st51-2",
                "text": "Webhook Dağıtım Motoru ve Yeniden Deneme Mantığı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c152",
        "key": "TK-152",
        "title": "Kart Sürükle-Bırak Mikro Animasyonları",
        "desc": "Zeynep Kaya tarafından üstlenilen Kart Sürükle-Bırak Mikro Animasyonları çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-10",
        "dueDate": "2026-02-14",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st52-1",
                "text": "Kart Sürükle-Bırak Mikro Animasyonları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st52-2",
                "text": "Kart Sürükle-Bırak Mikro Animasyonları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c153",
        "key": "TK-153",
        "title": "Görev Arama İçin Trigram İndeksleri",
        "desc": "Mehmet Demir tarafından üstlenilen Görev Arama İçin Trigram İndeksleri çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-09",
        "dueDate": "2026-02-15",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st53-1",
                "text": "Görev Arama İçin Trigram İndeksleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st53-2",
                "text": "Görev Arama İçin Trigram İndeksleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c154",
        "key": "TK-154",
        "title": "Sprint Planlama Modalı ve Hızlı Kart Atama",
        "desc": "Selin Yıldız tarafından üstlenilen Sprint Planlama Modalı ve Hızlı Kart Atama çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-10",
        "dueDate": "2026-02-13",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st54-1",
                "text": "Sprint Planlama Modalı ve Hızlı Kart Atama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st54-2",
                "text": "Sprint Planlama Modalı ve Hızlı Kart Atama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c155",
        "key": "TK-155",
        "title": "Ingress Controller ve Let's Encrypt SSL",
        "desc": "Caner Öztürk tarafından üstlenilen Ingress Controller ve Let's Encrypt SSL çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-09",
        "dueDate": "2026-02-14",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st55-1",
                "text": "Ingress Controller ve Let's Encrypt SSL - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st55-2",
                "text": "Ingress Controller ve Let's Encrypt SSL - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c156",
        "key": "TK-156",
        "title": "Alt Görev Tamamlama ve Yüzde Güncelleme Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Alt Görev Tamamlama ve Yüzde Güncelleme Testi çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-10",
        "dueDate": "2026-02-15",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st56-1",
                "text": "Alt Görev Tamamlama ve Yüzde Güncelleme Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st56-2",
                "text": "Alt Görev Tamamlama ve Yüzde Güncelleme Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm56-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Burcu Çelik",
                "createdAt": 1771092000000
            }
        ],
        "epicId": "e1",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c157",
        "key": "TK-157",
        "title": "MMKV ile Hızlı Yerel Şifreli Depolama",
        "desc": "Emre Aydın tarafından üstlenilen MMKV ile Hızlı Yerel Şifreli Depolama çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-09",
        "dueDate": "2026-02-13",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st57-1",
                "text": "MMKV ile Hızlı Yerel Şifreli Depolama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st57-2",
                "text": "MMKV ile Hızlı Yerel Şifreli Depolama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c158",
        "key": "TK-158",
        "title": "Tahmini Efor vs Gerçekleşen Efor Sapma İstatistiği",
        "desc": "Gamze Şahin tarafından üstlenilen Tahmini Efor vs Gerçekleşen Efor Sapma İstatistiği çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-10",
        "dueDate": "2026-02-14",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st58-1",
                "text": "Tahmini Efor vs Gerçekleşen Efor Sapma İstatistiği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st58-2",
                "text": "Tahmini Efor vs Gerçekleşen Efor Sapma İstatistiği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c159",
        "key": "TK-159",
        "title": "CSRF Token ve SameSite Çerez Politikaları",
        "desc": "Tolga Kurt tarafından üstlenilen CSRF Token ve SameSite Çerez Politikaları çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-09",
        "dueDate": "2026-02-15",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st59-1",
                "text": "CSRF Token ve SameSite Çerez Politikaları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st59-2",
                "text": "CSRF Token ve SameSite Çerez Politikaları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c160",
        "key": "TK-160",
        "title": "OpenTelemetry ile Servisler Arası Dağıtık İzleme",
        "desc": "Derya Arslan tarafından üstlenilen OpenTelemetry ile Servisler Arası Dağıtık İzleme çalışması. Sprint 6 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-10",
        "dueDate": "2026-02-13",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st60-1",
                "text": "OpenTelemetry ile Servisler Arası Dağıtık İzleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st60-2",
                "text": "OpenTelemetry ile Servisler Arası Dağıtık İzleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s6",
        "createdAt": 1770411600000
    },
    {
        "id": "c161",
        "key": "TK-161",
        "title": "API Gateway Yönlendirme ve Hız Sınırlama",
        "desc": "Ali Yılmaz tarafından üstlenilen API Gateway Yönlendirme ve Hız Sınırlama çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-16",
        "dueDate": "2026-02-20",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st61-1",
                "text": "API Gateway Yönlendirme ve Hız Sınırlama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st61-2",
                "text": "API Gateway Yönlendirme ve Hız Sınırlama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c162",
        "key": "TK-162",
        "title": "Toast ve Bildirim Bileşenleri Animasyon Paketi",
        "desc": "Zeynep Kaya tarafından üstlenilen Toast ve Bildirim Bileşenleri Animasyon Paketi çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-17",
        "dueDate": "2026-02-21",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st62-1",
                "text": "Toast ve Bildirim Bileşenleri Animasyon Paketi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st62-2",
                "text": "Toast ve Bildirim Bileşenleri Animasyon Paketi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c163",
        "key": "TK-163",
        "title": "Efor Hesaplama SQL View ve Saklı Yordamları",
        "desc": "Mehmet Demir tarafından üstlenilen Efor Hesaplama SQL View ve Saklı Yordamları çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-16",
        "dueDate": "2026-02-22",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st63-1",
                "text": "Efor Hesaplama SQL View ve Saklı Yordamları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st63-2",
                "text": "Efor Hesaplama SQL View ve Saklı Yordamları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm63-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Mehmet Demir",
                "createdAt": 1771696800000
            }
        ],
        "epicId": "e9",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c164",
        "key": "TK-164",
        "title": "Kart Detay Popoverı ve Hızlı Düzenleme",
        "desc": "Selin Yıldız tarafından üstlenilen Kart Detay Popoverı ve Hızlı Düzenleme çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-17",
        "dueDate": "2026-02-20",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st64-1",
                "text": "Kart Detay Popoverı ve Hızlı Düzenleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st64-2",
                "text": "Kart Detay Popoverı ve Hızlı Düzenleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c165",
        "key": "TK-165",
        "title": "Prometheus Metrik Toplayıcı ve Node Exporter",
        "desc": "Caner Öztürk tarafından üstlenilen Prometheus Metrik Toplayıcı ve Node Exporter çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-16",
        "dueDate": "2026-02-21",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st65-1",
                "text": "Prometheus Metrik Toplayıcı ve Node Exporter - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st65-2",
                "text": "Prometheus Metrik Toplayıcı ve Node Exporter - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c166",
        "key": "TK-166",
        "title": "Öncelik ve Atanan Kişi Filtreleme Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Öncelik ve Atanan Kişi Filtreleme Testleri çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-17",
        "dueDate": "2026-02-22",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st66-1",
                "text": "Öncelik ve Atanan Kişi Filtreleme Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st66-2",
                "text": "Öncelik ve Atanan Kişi Filtreleme Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c167",
        "key": "TK-167",
        "title": "Mobil Giriş ve Biyometrik (FaceID) Doğrulama",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Giriş ve Biyometrik (FaceID) Doğrulama çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-16",
        "dueDate": "2026-02-20",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st67-1",
                "text": "Mobil Giriş ve Biyometrik (FaceID) Doğrulama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st67-2",
                "text": "Mobil Giriş ve Biyometrik (FaceID) Doğrulama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c168",
        "key": "TK-168",
        "title": "Geciken Görev Oranı ve Darboğaz Tespiti",
        "desc": "Gamze Şahin tarafından üstlenilen Geciken Görev Oranı ve Darboğaz Tespiti çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-17",
        "dueDate": "2026-02-21",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st68-1",
                "text": "Geciken Görev Oranı ve Darboğaz Tespiti - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st68-2",
                "text": "Geciken Görev Oranı ve Darboğaz Tespiti - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c169",
        "key": "TK-169",
        "title": "Brute-Force Giriş Denemelerine Karşı Hesap Kilitleme",
        "desc": "Tolga Kurt tarafından üstlenilen Brute-Force Giriş Denemelerine Karşı Hesap Kilitleme çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-16",
        "dueDate": "2026-02-22",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st69-1",
                "text": "Brute-Force Giriş Denemelerine Karşı Hesap Kilitleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st69-2",
                "text": "Brute-Force Giriş Denemelerine Karşı Hesap Kilitleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c170",
        "key": "TK-170",
        "title": "Dağıtık Önbellek Kümesi ve Veri Bölümleme (Sharding)",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Önbellek Kümesi ve Veri Bölümleme (Sharding) çalışması. Sprint 7 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-17",
        "dueDate": "2026-02-20",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st70-1",
                "text": "Dağıtık Önbellek Kümesi ve Veri Bölümleme (Sharding) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st70-2",
                "text": "Dağıtık Önbellek Kümesi ve Veri Bölümleme (Sharding) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm70-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Derya Arslan",
                "createdAt": 1771524000000
            }
        ],
        "epicId": "e6",
        "sprintId": "s7",
        "createdAt": 1771016400000
    },
    {
        "id": "c171",
        "key": "TK-171",
        "title": "GraphQL Şema Tasarımı ve Apollo Server Entegrasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen GraphQL Şema Tasarımı ve Apollo Server Entegrasyonu çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-23",
        "dueDate": "2026-02-27",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st71-1",
                "text": "GraphQL Şema Tasarımı ve Apollo Server Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st71-2",
                "text": "GraphQL Şema Tasarımı ve Apollo Server Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c172",
        "key": "TK-172",
        "title": "Responsive Mobil Uyumlu Navigasyon Çubuğu",
        "desc": "Zeynep Kaya tarafından üstlenilen Responsive Mobil Uyumlu Navigasyon Çubuğu çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-24",
        "dueDate": "2026-02-28",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st72-1",
                "text": "Responsive Mobil Uyumlu Navigasyon Çubuğu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st72-2",
                "text": "Responsive Mobil Uyumlu Navigasyon Çubuğu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c173",
        "key": "TK-173",
        "title": "Silinen Kartlar İçin Soft Delete Mekanizması",
        "desc": "Mehmet Demir tarafından üstlenilen Silinen Kartlar İçin Soft Delete Mekanizması çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-23",
        "dueDate": "2026-03-01",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st73-1",
                "text": "Silinen Kartlar İçin Soft Delete Mekanizması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st73-2",
                "text": "Silinen Kartlar İçin Soft Delete Mekanizması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c174",
        "key": "TK-174",
        "title": "Görev Bağımlılığı (Dependencies) Önkoşul Mantığı",
        "desc": "Selin Yıldız tarafından üstlenilen Görev Bağımlılığı (Dependencies) Önkoşul Mantığı çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-24",
        "dueDate": "2026-02-27",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st74-1",
                "text": "Görev Bağımlılığı (Dependencies) Önkoşul Mantığı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st74-2",
                "text": "Görev Bağımlılığı (Dependencies) Önkoşul Mantığı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c175",
        "key": "TK-175",
        "title": "Grafana Pano Tasarımı ve CPU/Bellek Alarmları",
        "desc": "Caner Öztürk tarafından üstlenilen Grafana Pano Tasarımı ve CPU/Bellek Alarmları çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-02-23",
        "dueDate": "2026-02-28",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st75-1",
                "text": "Grafana Pano Tasarımı ve CPU/Bellek Alarmları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st75-2",
                "text": "Grafana Pano Tasarımı ve CPU/Bellek Alarmları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c176",
        "key": "TK-176",
        "title": "Rol Bazlı Yetkilendirme Erişim İhlali Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Rol Bazlı Yetkilendirme Erişim İhlali Testleri çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-24",
        "dueDate": "2026-03-01",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st76-1",
                "text": "Rol Bazlı Yetkilendirme Erişim İhlali Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st76-2",
                "text": "Rol Bazlı Yetkilendirme Erişim İhlali Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c177",
        "key": "TK-177",
        "title": "Mobil Pano Görünümü: Yatay Sütun Kaydırma",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Pano Görünümü: Yatay Sütun Kaydırma çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-23",
        "dueDate": "2026-02-27",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st77-1",
                "text": "Mobil Pano Görünümü: Yatay Sütun Kaydırma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st77-2",
                "text": "Mobil Pano Görünümü: Yatay Sütun Kaydırma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm77-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Emre Aydın",
                "createdAt": 1772128800000
            }
        ],
        "epicId": "e4",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c178",
        "key": "TK-178",
        "title": "Dashboard KPI Kartları Veri Besleme Servisi",
        "desc": "Gamze Şahin tarafından üstlenilen Dashboard KPI Kartları Veri Besleme Servisi çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-24",
        "dueDate": "2026-02-28",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st78-1",
                "text": "Dashboard KPI Kartları Veri Besleme Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st78-2",
                "text": "Dashboard KPI Kartları Veri Besleme Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c179",
        "key": "TK-179",
        "title": "API Anahtarları ve Hassas Verilerin Git Denetimi",
        "desc": "Tolga Kurt tarafından üstlenilen API Anahtarları ve Hassas Verilerin Git Denetimi çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-02-23",
        "dueDate": "2026-03-01",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st79-1",
                "text": "API Anahtarları ve Hassas Verilerin Git Denetimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st79-2",
                "text": "API Anahtarları ve Hassas Verilerin Git Denetimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c180",
        "key": "TK-180",
        "title": "Çok Bölgeli Veri Eşitleme ve Senkronizasyon",
        "desc": "Derya Arslan tarafından üstlenilen Çok Bölgeli Veri Eşitleme ve Senkronizasyon çalışması. Sprint 8 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-02-24",
        "dueDate": "2026-02-27",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st80-1",
                "text": "Çok Bölgeli Veri Eşitleme ve Senkronizasyon - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st80-2",
                "text": "Çok Bölgeli Veri Eşitleme ve Senkronizasyon - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s8",
        "createdAt": 1771621200000
    },
    {
        "id": "c181",
        "key": "TK-181",
        "title": "Veritabanı Transaction Yönetimi ve Unit of Work",
        "desc": "Ali Yılmaz tarafından üstlenilen Veritabanı Transaction Yönetimi ve Unit of Work çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-02",
        "dueDate": "2026-03-06",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st81-1",
                "text": "Veritabanı Transaction Yönetimi ve Unit of Work - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st81-2",
                "text": "Veritabanı Transaction Yönetimi ve Unit of Work - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c182",
        "key": "TK-182",
        "title": "Filtreleme ve Arama Giriş Alanı Debounce",
        "desc": "Zeynep Kaya tarafından üstlenilen Filtreleme ve Arama Giriş Alanı Debounce çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-03",
        "dueDate": "2026-03-07",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st82-1",
                "text": "Filtreleme ve Arama Giriş Alanı Debounce - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st82-2",
                "text": "Filtreleme ve Arama Giriş Alanı Debounce - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c183",
        "key": "TK-183",
        "title": "Kart Taşıma Sıralaması İçin Lexorank Uygulaması",
        "desc": "Mehmet Demir tarafından üstlenilen Kart Taşıma Sıralaması İçin Lexorank Uygulaması çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-02",
        "dueDate": "2026-03-08",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st83-1",
                "text": "Kart Taşıma Sıralaması İçin Lexorank Uygulaması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st83-2",
                "text": "Kart Taşıma Sıralaması İçin Lexorank Uygulaması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c184",
        "key": "TK-184",
        "title": "Yinelenen Görevler (Recurring Tasks) Servisi",
        "desc": "Selin Yıldız tarafından üstlenilen Yinelenen Görevler (Recurring Tasks) Servisi çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-03",
        "dueDate": "2026-03-06",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st84-1",
                "text": "Yinelenen Görevler (Recurring Tasks) Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st84-2",
                "text": "Yinelenen Görevler (Recurring Tasks) Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm84-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Selin Yıldız",
                "createdAt": 1772733600000
            }
        ],
        "epicId": "e2",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c185",
        "key": "TK-185",
        "title": "Helm Chart Paketlemesi ve values.yaml Ayrımı",
        "desc": "Caner Öztürk tarafından üstlenilen Helm Chart Paketlemesi ve values.yaml Ayrımı çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-02",
        "dueDate": "2026-03-07",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st85-1",
                "text": "Helm Chart Paketlemesi ve values.yaml Ayrımı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st85-2",
                "text": "Helm Chart Paketlemesi ve values.yaml Ayrımı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c186",
        "key": "TK-186",
        "title": "API Hata Yanıtları ve Durum Kodları Doğrulaması",
        "desc": "Burcu Çelik tarafından üstlenilen API Hata Yanıtları ve Durum Kodları Doğrulaması çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-03",
        "dueDate": "2026-03-08",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st86-1",
                "text": "API Hata Yanıtları ve Durum Kodları Doğrulaması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st86-2",
                "text": "API Hata Yanıtları ve Durum Kodları Doğrulaması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c187",
        "key": "TK-187",
        "title": "Reanimated 3 ile 60 FPS Kart Taşıma",
        "desc": "Emre Aydın tarafından üstlenilen Reanimated 3 ile 60 FPS Kart Taşıma çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-02",
        "dueDate": "2026-03-06",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st87-1",
                "text": "Reanimated 3 ile 60 FPS Kart Taşıma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st87-2",
                "text": "Reanimated 3 ile 60 FPS Kart Taşıma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c188",
        "key": "TK-188",
        "title": "Sprint Burn-Down Grafiği Günlük Veri Noktaları",
        "desc": "Gamze Şahin tarafından üstlenilen Sprint Burn-Down Grafiği Günlük Veri Noktaları çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-03",
        "dueDate": "2026-03-07",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st88-1",
                "text": "Sprint Burn-Down Grafiği Günlük Veri Noktaları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st88-2",
                "text": "Sprint Burn-Down Grafiği Günlük Veri Noktaları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c189",
        "key": "TK-189",
        "title": "Bağımlılık Güvenlik Taraması (npm audit & Snyk)",
        "desc": "Tolga Kurt tarafından üstlenilen Bağımlılık Güvenlik Taraması (npm audit & Snyk) çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-02",
        "dueDate": "2026-03-08",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st89-1",
                "text": "Bağımlılık Güvenlik Taraması (npm audit & Snyk) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st89-2",
                "text": "Bağımlılık Güvenlik Taraması (npm audit & Snyk) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c190",
        "key": "TK-190",
        "title": "Dağıtık Sayaç ve Görev Numaratörü Servisi",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Sayaç ve Görev Numaratörü Servisi çalışması. Sprint 9 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-03",
        "dueDate": "2026-03-06",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st90-1",
                "text": "Dağıtık Sayaç ve Görev Numaratörü Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st90-2",
                "text": "Dağıtık Sayaç ve Görev Numaratörü Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s9",
        "createdAt": 1772226000000
    },
    {
        "id": "c191",
        "key": "TK-191",
        "title": "Redis Cache-Aside ve Write-Through Önbellekleme",
        "desc": "Ali Yılmaz tarafından üstlenilen Redis Cache-Aside ve Write-Through Önbellekleme çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-09",
        "dueDate": "2026-03-13",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st91-1",
                "text": "Redis Cache-Aside ve Write-Through Önbellekleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st91-2",
                "text": "Redis Cache-Aside ve Write-Through Önbellekleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm91-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Ali Yılmaz",
                "createdAt": 1773338400000
            }
        ],
        "epicId": "e10",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c192",
        "key": "TK-192",
        "title": "Dinamik Etiket Renk Paleti Sistemi",
        "desc": "Zeynep Kaya tarafından üstlenilen Dinamik Etiket Renk Paleti Sistemi çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-10",
        "dueDate": "2026-03-14",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st92-1",
                "text": "Dinamik Etiket Renk Paleti Sistemi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st92-2",
                "text": "Dinamik Etiket Renk Paleti Sistemi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c193",
        "key": "TK-193",
        "title": "Veritabanı Bağlantı Havuzu (PgBouncer)",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Bağlantı Havuzu (PgBouncer) çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-09",
        "dueDate": "2026-03-15",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st93-1",
                "text": "Veritabanı Bağlantı Havuzu (PgBouncer) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st93-2",
                "text": "Veritabanı Bağlantı Havuzu (PgBouncer) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c194",
        "key": "TK-194",
        "title": "Kart Etiket Filtresi ve Çoklu Seçim",
        "desc": "Selin Yıldız tarafından üstlenilen Kart Etiket Filtresi ve Çoklu Seçim çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-10",
        "dueDate": "2026-03-13",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st94-1",
                "text": "Kart Etiket Filtresi ve Çoklu Seçim - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st94-2",
                "text": "Kart Etiket Filtresi ve Çoklu Seçim - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c195",
        "key": "TK-195",
        "title": "staging ve production Ortamları İzolasyonu",
        "desc": "Caner Öztürk tarafından üstlenilen staging ve production Ortamları İzolasyonu çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-09",
        "dueDate": "2026-03-14",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st95-1",
                "text": "staging ve production Ortamları İzolasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st95-2",
                "text": "staging ve production Ortamları İzolasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c196",
        "key": "TK-196",
        "title": "Pano Boş Durum Görsel Test Senaryoları",
        "desc": "Burcu Çelik tarafından üstlenilen Pano Boş Durum Görsel Test Senaryoları çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-10",
        "dueDate": "2026-03-15",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st96-1",
                "text": "Pano Boş Durum Görsel Test Senaryoları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st96-2",
                "text": "Pano Boş Durum Görsel Test Senaryoları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c197",
        "key": "TK-197",
        "title": "Dokunmatik Titreşim (Haptic Feedback) Entegrasyonu",
        "desc": "Emre Aydın tarafından üstlenilen Dokunmatik Titreşim (Haptic Feedback) Entegrasyonu çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-09",
        "dueDate": "2026-03-13",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st97-1",
                "text": "Dokunmatik Titreşim (Haptic Feedback) Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st97-2",
                "text": "Dokunmatik Titreşim (Haptic Feedback) Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c198",
        "key": "TK-198",
        "title": "Sütun Geçiş Süreleri ve Bekleme Zamanı Analizi",
        "desc": "Gamze Şahin tarafından üstlenilen Sütun Geçiş Süreleri ve Bekleme Zamanı Analizi çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-10",
        "dueDate": "2026-03-14",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st98-1",
                "text": "Sütun Geçiş Süreleri ve Bekleme Zamanı Analizi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st98-2",
                "text": "Sütun Geçiş Süreleri ve Bekleme Zamanı Analizi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm98-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Gamze Şahin",
                "createdAt": 1773424800000
            }
        ],
        "epicId": "e7",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c199",
        "key": "TK-199",
        "title": "Güvenli Rastgele Sayı ve Token Üreteci",
        "desc": "Tolga Kurt tarafından üstlenilen Güvenli Rastgele Sayı ve Token Üreteci çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-09",
        "dueDate": "2026-03-15",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st99-1",
                "text": "Güvenli Rastgele Sayı ve Token Üreteci - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st99-2",
                "text": "Güvenli Rastgele Sayı ve Token Üreteci - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c200",
        "key": "TK-200",
        "title": "Olay Tüketici (Consumer Group) Yük Dengeleme",
        "desc": "Derya Arslan tarafından üstlenilen Olay Tüketici (Consumer Group) Yük Dengeleme çalışması. Sprint 10 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-10",
        "dueDate": "2026-03-13",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st100-1",
                "text": "Olay Tüketici (Consumer Group) Yük Dengeleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st100-2",
                "text": "Olay Tüketici (Consumer Group) Yük Dengeleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s10",
        "createdAt": 1772830800000
    },
    {
        "id": "c201",
        "key": "TK-201",
        "title": "Microservice Servisler Arası İletişim (gRPC)",
        "desc": "Ali Yılmaz tarafından üstlenilen Microservice Servisler Arası İletişim (gRPC) çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-16",
        "dueDate": "2026-03-20",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st101-1",
                "text": "Microservice Servisler Arası İletişim (gRPC) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st101-2",
                "text": "Microservice Servisler Arası İletişim (gRPC) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c202",
        "key": "TK-202",
        "title": "Pano Sütun Genişlikleri ve Esnek Grid Düzeni",
        "desc": "Zeynep Kaya tarafından üstlenilen Pano Sütun Genişlikleri ve Esnek Grid Düzeni çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-17",
        "dueDate": "2026-03-21",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st102-1",
                "text": "Pano Sütun Genişlikleri ve Esnek Grid Düzeni - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st102-2",
                "text": "Pano Sütun Genişlikleri ve Esnek Grid Düzeni - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c203",
        "key": "TK-203",
        "title": "İlişkisel Veri Bütünlüğü ve Foreign Key Kuralları",
        "desc": "Mehmet Demir tarafından üstlenilen İlişkisel Veri Bütünlüğü ve Foreign Key Kuralları çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-16",
        "dueDate": "2026-03-22",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st103-1",
                "text": "İlişkisel Veri Bütünlüğü ve Foreign Key Kuralları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st103-2",
                "text": "İlişkisel Veri Bütünlüğü ve Foreign Key Kuralları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c204",
        "key": "TK-204",
        "title": "Kullanıcı Bildirim Tercihleri ve E-posta Ayarları",
        "desc": "Selin Yıldız tarafından üstlenilen Kullanıcı Bildirim Tercihleri ve E-posta Ayarları çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-17",
        "dueDate": "2026-03-20",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st104-1",
                "text": "Kullanıcı Bildirim Tercihleri ve E-posta Ayarları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st104-2",
                "text": "Kullanıcı Bildirim Tercihleri ve E-posta Ayarları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c205",
        "key": "TK-205",
        "title": "Nginx Reverse Proxy ve Önbellek Yapılandırması",
        "desc": "Caner Öztürk tarafından üstlenilen Nginx Reverse Proxy ve Önbellek Yapılandırması çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-16",
        "dueDate": "2026-03-21",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st105-1",
                "text": "Nginx Reverse Proxy ve Önbellek Yapılandırması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st105-2",
                "text": "Nginx Reverse Proxy ve Önbellek Yapılandırması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm105-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Caner Öztürk",
                "createdAt": 1774029600000
            }
        ],
        "epicId": "e5",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c206",
        "key": "TK-206",
        "title": "k6 ile API Eşzamanlı İstek ve Yük Testi",
        "desc": "Burcu Çelik tarafından üstlenilen k6 ile API Eşzamanlı İstek ve Yük Testi çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-17",
        "dueDate": "2026-03-22",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st106-1",
                "text": "k6 ile API Eşzamanlı İstek ve Yük Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st106-2",
                "text": "k6 ile API Eşzamanlı İstek ve Yük Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c207",
        "key": "TK-207",
        "title": "Kart Detay Ekranı ve Mobil Form Girdileri",
        "desc": "Emre Aydın tarafından üstlenilen Kart Detay Ekranı ve Mobil Form Girdileri çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-16",
        "dueDate": "2026-03-20",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st107-1",
                "text": "Kart Detay Ekranı ve Mobil Form Girdileri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st107-2",
                "text": "Kart Detay Ekranı ve Mobil Form Girdileri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c208",
        "key": "TK-208",
        "title": "Etiket Bazlı Görev Dağılımı Pasta Grafiği",
        "desc": "Gamze Şahin tarafından üstlenilen Etiket Bazlı Görev Dağılımı Pasta Grafiği çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-17",
        "dueDate": "2026-03-21",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st108-1",
                "text": "Etiket Bazlı Görev Dağılımı Pasta Grafiği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st108-2",
                "text": "Etiket Bazlı Görev Dağılımı Pasta Grafiği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c209",
        "key": "TK-209",
        "title": "SSL/TLS Sertifika Yapılandırması ve A+ Notu",
        "desc": "Tolga Kurt tarafından üstlenilen SSL/TLS Sertifika Yapılandırması ve A+ Notu çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-16",
        "dueDate": "2026-03-22",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st109-1",
                "text": "SSL/TLS Sertifika Yapılandırması ve A+ Notu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st109-2",
                "text": "SSL/TLS Sertifika Yapılandırması ve A+ Notu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c210",
        "key": "TK-210",
        "title": "Hata Toleransı: Dead Letter Topic ve Yeniden İşleme",
        "desc": "Derya Arslan tarafından üstlenilen Hata Toleransı: Dead Letter Topic ve Yeniden İşleme çalışması. Sprint 11 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-17",
        "dueDate": "2026-03-20",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st110-1",
                "text": "Hata Toleransı: Dead Letter Topic ve Yeniden İşleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st110-2",
                "text": "Hata Toleransı: Dead Letter Topic ve Yeniden İşleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s11",
        "createdAt": 1773435600000
    },
    {
        "id": "c211",
        "key": "TK-211",
        "title": "Dağıtık Kilit Mekanizması (Redlock)",
        "desc": "Ali Yılmaz tarafından üstlenilen Dağıtık Kilit Mekanizması (Redlock) çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-23",
        "dueDate": "2026-03-27",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st111-1",
                "text": "Dağıtık Kilit Mekanizması (Redlock) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st111-2",
                "text": "Dağıtık Kilit Mekanizması (Redlock) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c212",
        "key": "TK-212",
        "title": "Kolon Kart Sayacı ve WIP Limiti Uyarısı",
        "desc": "Zeynep Kaya tarafından üstlenilen Kolon Kart Sayacı ve WIP Limiti Uyarısı çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-24",
        "dueDate": "2026-03-28",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st112-1",
                "text": "Kolon Kart Sayacı ve WIP Limiti Uyarısı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st112-2",
                "text": "Kolon Kart Sayacı ve WIP Limiti Uyarısı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm112-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Zeynep Kaya",
                "createdAt": 1774634400000
            }
        ],
        "epicId": "e3",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c213",
        "key": "TK-213",
        "title": "Kart Etiketleri Çoktan-Çoğa İlişki Optimizasyonu",
        "desc": "Mehmet Demir tarafından üstlenilen Kart Etiketleri Çoktan-Çoğa İlişki Optimizasyonu çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-23",
        "dueDate": "2026-03-29",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st113-1",
                "text": "Kart Etiketleri Çoktan-Çoğa İlişki Optimizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st113-2",
                "text": "Kart Etiketleri Çoktan-Çoğa İlişki Optimizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c214",
        "key": "TK-214",
        "title": "Görev Tamamlama Kutlama Konfetisi",
        "desc": "Selin Yıldız tarafından üstlenilen Görev Tamamlama Kutlama Konfetisi çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-24",
        "dueDate": "2026-03-27",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st114-1",
                "text": "Görev Tamamlama Kutlama Konfetisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st114-2",
                "text": "Görev Tamamlama Kutlama Konfetisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c215",
        "key": "TK-215",
        "title": "Sıfır Kesinti (Rolling Update) Dağıtım Stratejisi",
        "desc": "Caner Öztürk tarafından üstlenilen Sıfır Kesinti (Rolling Update) Dağıtım Stratejisi çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-23",
        "dueDate": "2026-03-28",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st115-1",
                "text": "Sıfır Kesinti (Rolling Update) Dağıtım Stratejisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st115-2",
                "text": "Sıfır Kesinti (Rolling Update) Dağıtım Stratejisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c216",
        "key": "TK-216",
        "title": "Çapraz Tarayıcı (Chrome, Firefox, Safari) Test Matrisi",
        "desc": "Burcu Çelik tarafından üstlenilen Çapraz Tarayıcı (Chrome, Firefox, Safari) Test Matrisi çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-24",
        "dueDate": "2026-03-29",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st116-1",
                "text": "Çapraz Tarayıcı (Chrome, Firefox, Safari) Test Matrisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st116-2",
                "text": "Çapraz Tarayıcı (Chrome, Firefox, Safari) Test Matrisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c217",
        "key": "TK-217",
        "title": "Hızlı Kart Ekleme İçin Mobil Alt Sayfa",
        "desc": "Emre Aydın tarafından üstlenilen Hızlı Kart Ekleme İçin Mobil Alt Sayfa çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-23",
        "dueDate": "2026-03-27",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st117-1",
                "text": "Hızlı Kart Ekleme İçin Mobil Alt Sayfa - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st117-2",
                "text": "Hızlı Kart Ekleme İçin Mobil Alt Sayfa - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c218",
        "key": "TK-218",
        "title": "Öncelik Seviyelerine Göre Tamamlanma Analizi",
        "desc": "Gamze Şahin tarafından üstlenilen Öncelik Seviyelerine Göre Tamamlanma Analizi çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-24",
        "dueDate": "2026-03-28",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st118-1",
                "text": "Öncelik Seviyelerine Göre Tamamlanma Analizi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st118-2",
                "text": "Öncelik Seviyelerine Göre Tamamlanma Analizi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c219",
        "key": "TK-219",
        "title": "Kullanıcı Giriş Logları ve Başarısız Giriş Bildirimi",
        "desc": "Tolga Kurt tarafından üstlenilen Kullanıcı Giriş Logları ve Başarısız Giriş Bildirimi çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-23",
        "dueDate": "2026-03-29",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st119-1",
                "text": "Kullanıcı Giriş Logları ve Başarısız Giriş Bildirimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st119-2",
                "text": "Kullanıcı Giriş Logları ve Başarısız Giriş Bildirimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm119-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Tolga Kurt",
                "createdAt": 1774720800000
            }
        ],
        "epicId": "e10",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c220",
        "key": "TK-220",
        "title": "Dağıtık Kilit Yöneticisi ve Kilitleme Protokolü",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Kilit Yöneticisi ve Kilitleme Protokolü çalışması. Sprint 12 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-24",
        "dueDate": "2026-03-27",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st120-1",
                "text": "Dağıtık Kilit Yöneticisi ve Kilitleme Protokolü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st120-2",
                "text": "Dağıtık Kilit Yöneticisi ve Kilitleme Protokolü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s12",
        "createdAt": 1774040400000
    },
    {
        "id": "c221",
        "key": "TK-221",
        "title": "Kullanıcı Token Yenileme Rotasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen Kullanıcı Token Yenileme Rotasyonu çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-30",
        "dueDate": "2026-04-03",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st121-1",
                "text": "Kullanıcı Token Yenileme Rotasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st121-2",
                "text": "Kullanıcı Token Yenileme Rotasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c222",
        "key": "TK-222",
        "title": "Zengin Metin (Markdown) Önizleme Alanı",
        "desc": "Zeynep Kaya tarafından üstlenilen Zengin Metin (Markdown) Önizleme Alanı çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-31",
        "dueDate": "2026-04-04",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st122-1",
                "text": "Zengin Metin (Markdown) Önizleme Alanı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st122-2",
                "text": "Zengin Metin (Markdown) Önizleme Alanı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c223",
        "key": "TK-223",
        "title": "Kullanıcı Oturum Geçmişi Tablosu",
        "desc": "Mehmet Demir tarafından üstlenilen Kullanıcı Oturum Geçmişi Tablosu çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-30",
        "dueDate": "2026-04-05",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st123-1",
                "text": "Kullanıcı Oturum Geçmişi Tablosu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st123-2",
                "text": "Kullanıcı Oturum Geçmişi Tablosu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c224",
        "key": "TK-224",
        "title": "Çöp Kutusu ve Geri Alma Mekanizması",
        "desc": "Selin Yıldız tarafından üstlenilen Çöp Kutusu ve Geri Alma Mekanizması çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-31",
        "dueDate": "2026-04-03",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st124-1",
                "text": "Çöp Kutusu ve Geri Alma Mekanizması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st124-2",
                "text": "Çöp Kutusu ve Geri Alma Mekanizması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c225",
        "key": "TK-225",
        "title": "S3 Uyumlu Depolama İçin MinIO Yerel Kümesi",
        "desc": "Caner Öztürk tarafından üstlenilen S3 Uyumlu Depolama İçin MinIO Yerel Kümesi çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-03-30",
        "dueDate": "2026-04-04",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st125-1",
                "text": "S3 Uyumlu Depolama İçin MinIO Yerel Kümesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st125-2",
                "text": "S3 Uyumlu Depolama İçin MinIO Yerel Kümesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c226",
        "key": "TK-226",
        "title": "Mobil Tarayıcı Dokunmatik Jestler ve UI Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Mobil Tarayıcı Dokunmatik Jestler ve UI Testi çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-31",
        "dueDate": "2026-04-05",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st126-1",
                "text": "Mobil Tarayıcı Dokunmatik Jestler ve UI Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st126-2",
                "text": "Mobil Tarayıcı Dokunmatik Jestler ve UI Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm126-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Burcu Çelik",
                "createdAt": 1775325600000
            }
        ],
        "epicId": "e8",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c227",
        "key": "TK-227",
        "title": "Mobil Çevrimdışı (Offline) Mod ve Değişiklik Kuyruğu",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Çevrimdışı (Offline) Mod ve Değişiklik Kuyruğu çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-30",
        "dueDate": "2026-04-03",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st127-1",
                "text": "Mobil Çevrimdışı (Offline) Mod ve Değişiklik Kuyruğu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st127-2",
                "text": "Mobil Çevrimdışı (Offline) Mod ve Değişiklik Kuyruğu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c228",
        "key": "TK-228",
        "title": "Haftalık Otomatik Yönetici Efor Özeti E-postası",
        "desc": "Gamze Şahin tarafından üstlenilen Haftalık Otomatik Yönetici Efor Özeti E-postası çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-31",
        "dueDate": "2026-04-04",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st128-1",
                "text": "Haftalık Otomatik Yönetici Efor Özeti E-postası - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st128-2",
                "text": "Haftalık Otomatik Yönetici Efor Özeti E-postası - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c229",
        "key": "TK-229",
        "title": "Yetkisiz Doğrudan Nesne Erişimi (IDOR) Testleri",
        "desc": "Tolga Kurt tarafından üstlenilen Yetkisiz Doğrudan Nesne Erişimi (IDOR) Testleri çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-03-30",
        "dueDate": "2026-04-05",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st129-1",
                "text": "Yetkisiz Doğrudan Nesne Erişimi (IDOR) Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st129-2",
                "text": "Yetkisiz Doğrudan Nesne Erişimi (IDOR) Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c230",
        "key": "TK-230",
        "title": "Dağıtık Çöp Toplayıcı ve Yetim Veri Temizliği",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Çöp Toplayıcı ve Yetim Veri Temizliği çalışması. Sprint 13 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-03-31",
        "dueDate": "2026-04-03",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st130-1",
                "text": "Dağıtık Çöp Toplayıcı ve Yetim Veri Temizliği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st130-2",
                "text": "Dağıtık Çöp Toplayıcı ve Yetim Veri Temizliği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s13",
        "createdAt": 1774645200000
    },
    {
        "id": "c231",
        "key": "TK-231",
        "title": "Çok Kiracılı Veri Ayrımı ve Şifreleme",
        "desc": "Ali Yılmaz tarafından üstlenilen Çok Kiracılı Veri Ayrımı ve Şifreleme çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-06",
        "dueDate": "2026-04-10",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st131-1",
                "text": "Çok Kiracılı Veri Ayrımı ve Şifreleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st131-2",
                "text": "Çok Kiracılı Veri Ayrımı ve Şifreleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c232",
        "key": "TK-232",
        "title": "Alt Görev İlerleme Çubuğu ve Yüzde Göstergesi",
        "desc": "Zeynep Kaya tarafından üstlenilen Alt Görev İlerleme Çubuğu ve Yüzde Göstergesi çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-07",
        "dueDate": "2026-04-11",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st132-1",
                "text": "Alt Görev İlerleme Çubuğu ve Yüzde Göstergesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st132-2",
                "text": "Alt Görev İlerleme Çubuğu ve Yüzde Göstergesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c233",
        "key": "TK-233",
        "title": "Veritabanı Otomatik Yedekleme Politikası",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Otomatik Yedekleme Politikası çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-06",
        "dueDate": "2026-04-12",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st133-1",
                "text": "Veritabanı Otomatik Yedekleme Politikası - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st133-2",
                "text": "Veritabanı Otomatik Yedekleme Politikası - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm133-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Mehmet Demir",
                "createdAt": 1775930400000
            }
        ],
        "epicId": "e6",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c234",
        "key": "TK-234",
        "title": "Kart Dışa Aktarımı (PDF, CSV, JSON)",
        "desc": "Selin Yıldız tarafından üstlenilen Kart Dışa Aktarımı (PDF, CSV, JSON) çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-07",
        "dueDate": "2026-04-10",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st134-1",
                "text": "Kart Dışa Aktarımı (PDF, CSV, JSON) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st134-2",
                "text": "Kart Dışa Aktarımı (PDF, CSV, JSON) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c235",
        "key": "TK-235",
        "title": "Log Toplama FluentBit ve Elastic Entegrasyonu",
        "desc": "Caner Öztürk tarafından üstlenilen Log Toplama FluentBit ve Elastic Entegrasyonu çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-06",
        "dueDate": "2026-04-11",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st135-1",
                "text": "Log Toplama FluentBit ve Elastic Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st135-2",
                "text": "Log Toplama FluentBit ve Elastic Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c236",
        "key": "TK-236",
        "title": "Çoklu Oturum ve Eşzamanlı Düzenleme Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Çoklu Oturum ve Eşzamanlı Düzenleme Testi çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-07",
        "dueDate": "2026-04-12",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st136-1",
                "text": "Çoklu Oturum ve Eşzamanlı Düzenleme Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st136-2",
                "text": "Çoklu Oturum ve Eşzamanlı Düzenleme Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c237",
        "key": "TK-237",
        "title": "Ağ Geldiğinde Arka Plan Senkronizasyonu",
        "desc": "Emre Aydın tarafından üstlenilen Ağ Geldiğinde Arka Plan Senkronizasyonu çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-06",
        "dueDate": "2026-04-10",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st137-1",
                "text": "Ağ Geldiğinde Arka Plan Senkronizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st137-2",
                "text": "Ağ Geldiğinde Arka Plan Senkronizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c238",
        "key": "TK-238",
        "title": "CSV ve Excel Metrik Dışa Aktarım Motoru",
        "desc": "Gamze Şahin tarafından üstlenilen CSV ve Excel Metrik Dışa Aktarım Motoru çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-07",
        "dueDate": "2026-04-11",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st138-1",
                "text": "CSV ve Excel Metrik Dışa Aktarım Motoru - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st138-2",
                "text": "CSV ve Excel Metrik Dışa Aktarım Motoru - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c239",
        "key": "TK-239",
        "title": "Hassas Alanların AES-GCM ile Şifrelenmesi",
        "desc": "Tolga Kurt tarafından üstlenilen Hassas Alanların AES-GCM ile Şifrelenmesi çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-06",
        "dueDate": "2026-04-12",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st139-1",
                "text": "Hassas Alanların AES-GCM ile Şifrelenmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st139-2",
                "text": "Hassas Alanların AES-GCM ile Şifrelenmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c240",
        "key": "TK-240",
        "title": "Pano Olaylarının Sıkıştırılarak Saklanması",
        "desc": "Derya Arslan tarafından üstlenilen Pano Olaylarının Sıkıştırılarak Saklanması çalışması. Sprint 14 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-07",
        "dueDate": "2026-04-10",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st140-1",
                "text": "Pano Olaylarının Sıkıştırılarak Saklanması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st140-2",
                "text": "Pano Olaylarının Sıkıştırılarak Saklanması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm140-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Derya Arslan",
                "createdAt": 1775757600000
            }
        ],
        "epicId": "e3",
        "sprintId": "s14",
        "createdAt": 1775250000000
    },
    {
        "id": "c241",
        "key": "TK-241",
        "title": "Dosya Yükleme ve S3 Presigned URL Servisi",
        "desc": "Ali Yılmaz tarafından üstlenilen Dosya Yükleme ve S3 Presigned URL Servisi çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-13",
        "dueDate": "2026-04-17",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st141-1",
                "text": "Dosya Yükleme ve S3 Presigned URL Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st141-2",
                "text": "Dosya Yükleme ve S3 Presigned URL Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c242",
        "key": "TK-242",
        "title": "Efor ve Süre Rozetleri Görsel Durumu",
        "desc": "Zeynep Kaya tarafından üstlenilen Efor ve Süre Rozetleri Görsel Durumu çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-14",
        "dueDate": "2026-04-18",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st142-1",
                "text": "Efor ve Süre Rozetleri Görsel Durumu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st142-2",
                "text": "Efor ve Süre Rozetleri Görsel Durumu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c243",
        "key": "TK-243",
        "title": "Büyük Tablolar İçin Tarih Bazlı Bölümleme",
        "desc": "Mehmet Demir tarafından üstlenilen Büyük Tablolar İçin Tarih Bazlı Bölümleme çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-13",
        "dueDate": "2026-04-19",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st143-1",
                "text": "Büyük Tablolar İçin Tarih Bazlı Bölümleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st143-2",
                "text": "Büyük Tablolar İçin Tarih Bazlı Bölümleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c244",
        "key": "TK-244",
        "title": "Kart Şablonları ve Önceden Tanımlı Alt Görevler",
        "desc": "Selin Yıldız tarafından üstlenilen Kart Şablonları ve Önceden Tanımlı Alt Görevler çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-14",
        "dueDate": "2026-04-17",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st144-1",
                "text": "Kart Şablonları ve Önceden Tanımlı Alt Görevler - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st144-2",
                "text": "Kart Şablonları ve Önceden Tanımlı Alt Görevler - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c245",
        "key": "TK-245",
        "title": "Docker İmaj Boyutlarının Alpine ile Küçültülmesi",
        "desc": "Caner Öztürk tarafından üstlenilen Docker İmaj Boyutlarının Alpine ile Küçültülmesi çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-13",
        "dueDate": "2026-04-18",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st145-1",
                "text": "Docker İmaj Boyutlarının Alpine ile Küçültülmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st145-2",
                "text": "Docker İmaj Boyutlarının Alpine ile Küçültülmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c246",
        "key": "TK-246",
        "title": "E-posta Bildirim Tetikleyicileri Testi",
        "desc": "Burcu Çelik tarafından üstlenilen E-posta Bildirim Tetikleyicileri Testi çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-14",
        "dueDate": "2026-04-19",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st146-1",
                "text": "E-posta Bildirim Tetikleyicileri Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st146-2",
                "text": "E-posta Bildirim Tetikleyicileri Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c247",
        "key": "TK-247",
        "title": "Kamera ile Kart Ekine Fotoğraf Yükleme",
        "desc": "Emre Aydın tarafından üstlenilen Kamera ile Kart Ekine Fotoğraf Yükleme çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-13",
        "dueDate": "2026-04-17",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st147-1",
                "text": "Kamera ile Kart Ekine Fotoğraf Yükleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st147-2",
                "text": "Kamera ile Kart Ekine Fotoğraf Yükleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm147-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Emre Aydın",
                "createdAt": 1776362400000
            }
        ],
        "epicId": "e1",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c248",
        "key": "TK-248",
        "title": "Büyük Panolarda Hızlı Raporlama İçin Özetleme",
        "desc": "Gamze Şahin tarafından üstlenilen Büyük Panolarda Hızlı Raporlama İçin Özetleme çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-14",
        "dueDate": "2026-04-18",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st148-1",
                "text": "Büyük Panolarda Hızlı Raporlama İçin Özetleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st148-2",
                "text": "Büyük Panolarda Hızlı Raporlama İçin Özetleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c249",
        "key": "TK-249",
        "title": "Dosya Yükleme Güvenliği: MIME Type ve Zararlı Yazılım",
        "desc": "Tolga Kurt tarafından üstlenilen Dosya Yükleme Güvenliği: MIME Type ve Zararlı Yazılım çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-13",
        "dueDate": "2026-04-19",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st149-1",
                "text": "Dosya Yükleme Güvenliği: MIME Type ve Zararlı Yazılım - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st149-2",
                "text": "Dosya Yükleme Güvenliği: MIME Type ve Zararlı Yazılım - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c250",
        "key": "TK-250",
        "title": "Yüksek Hacimli Olay Akışlarında Lag İzleme",
        "desc": "Derya Arslan tarafından üstlenilen Yüksek Hacimli Olay Akışlarında Lag İzleme çalışması. Sprint 15 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-14",
        "dueDate": "2026-04-17",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st150-1",
                "text": "Yüksek Hacimli Olay Akışlarında Lag İzleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st150-2",
                "text": "Yüksek Hacimli Olay Akışlarında Lag İzleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s15",
        "createdAt": 1775854800000
    },
    {
        "id": "c251",
        "key": "TK-251",
        "title": "Async Worker Kuyruğu ve Arka Plan Görev İşleyici",
        "desc": "Ali Yılmaz tarafından üstlenilen Async Worker Kuyruğu ve Arka Plan Görev İşleyici çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-20",
        "dueDate": "2026-04-24",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st151-1",
                "text": "Async Worker Kuyruğu ve Arka Plan Görev İşleyici - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st151-2",
                "text": "Async Worker Kuyruğu ve Arka Plan Görev İşleyici - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c252",
        "key": "TK-252",
        "title": "Hızlı Kart Ekleme Giriş Alanı İyileştirmesi",
        "desc": "Zeynep Kaya tarafından üstlenilen Hızlı Kart Ekleme Giriş Alanı İyileştirmesi çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-21",
        "dueDate": "2026-04-25",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st152-1",
                "text": "Hızlı Kart Ekleme Giriş Alanı İyileştirmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st152-2",
                "text": "Hızlı Kart Ekleme Giriş Alanı İyileştirmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c253",
        "key": "TK-253",
        "title": "Yorumlar ve Alt Görevler İçin JSONB Desteği",
        "desc": "Mehmet Demir tarafından üstlenilen Yorumlar ve Alt Görevler İçin JSONB Desteği çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-20",
        "dueDate": "2026-04-26",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st153-1",
                "text": "Yorumlar ve Alt Görevler İçin JSONB Desteği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st153-2",
                "text": "Yorumlar ve Alt Görevler İçin JSONB Desteği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c254",
        "key": "TK-254",
        "title": "Takım Yönetimi ve Rol Bazlı Kullanıcı Arayüzü",
        "desc": "Selin Yıldız tarafından üstlenilen Takım Yönetimi ve Rol Bazlı Kullanıcı Arayüzü çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-21",
        "dueDate": "2026-04-24",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st154-1",
                "text": "Takım Yönetimi ve Rol Bazlı Kullanıcı Arayüzü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st154-2",
                "text": "Takım Yönetimi ve Rol Bazlı Kullanıcı Arayüzü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm154-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Selin Yıldız",
                "createdAt": 1776967200000
            }
        ],
        "epicId": "e9",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c255",
        "key": "TK-255",
        "title": "Cloudflare WAF Güvenlik Kuralları",
        "desc": "Caner Öztürk tarafından üstlenilen Cloudflare WAF Güvenlik Kuralları çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-20",
        "dueDate": "2026-04-25",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st155-1",
                "text": "Cloudflare WAF Güvenlik Kuralları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st155-2",
                "text": "Cloudflare WAF Güvenlik Kuralları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c256",
        "key": "TK-256",
        "title": "Büyük Veri Yükleme (1000+ Kart) Donma Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Büyük Veri Yükleme (1000+ Kart) Donma Testi çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-21",
        "dueDate": "2026-04-26",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st156-1",
                "text": "Büyük Veri Yükleme (1000+ Kart) Donma Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st156-2",
                "text": "Büyük Veri Yükleme (1000+ Kart) Donma Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c257",
        "key": "TK-257",
        "title": "Galeriden Belge Ekleme İzinleri ve Arayüzü",
        "desc": "Emre Aydın tarafından üstlenilen Galeriden Belge Ekleme İzinleri ve Arayüzü çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-20",
        "dueDate": "2026-04-24",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st157-1",
                "text": "Galeriden Belge Ekleme İzinleri ve Arayüzü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st157-2",
                "text": "Galeriden Belge Ekleme İzinleri ve Arayüzü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c258",
        "key": "TK-258",
        "title": "Gelişmiş Pano Filtrelerine Göre Raporlama",
        "desc": "Gamze Şahin tarafından üstlenilen Gelişmiş Pano Filtrelerine Göre Raporlama çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-21",
        "dueDate": "2026-04-25",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st158-1",
                "text": "Gelişmiş Pano Filtrelerine Göre Raporlama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st158-2",
                "text": "Gelişmiş Pano Filtrelerine Göre Raporlama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c259",
        "key": "TK-259",
        "title": "Hata Yanıtlarında Stack Trace Gizleme",
        "desc": "Tolga Kurt tarafından üstlenilen Hata Yanıtlarında Stack Trace Gizleme çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-20",
        "dueDate": "2026-04-26",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st159-1",
                "text": "Hata Yanıtlarında Stack Trace Gizleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st159-2",
                "text": "Hata Yanıtlarında Stack Trace Gizleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c260",
        "key": "TK-260",
        "title": "Servis Keşfi (Service Discovery) ve Dinamik DNS",
        "desc": "Derya Arslan tarafından üstlenilen Servis Keşfi (Service Discovery) ve Dinamik DNS çalışması. Sprint 16 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-21",
        "dueDate": "2026-04-24",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st160-1",
                "text": "Servis Keşfi (Service Discovery) ve Dinamik DNS - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st160-2",
                "text": "Servis Keşfi (Service Discovery) ve Dinamik DNS - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s16",
        "createdAt": 1776459600000
    },
    {
        "id": "c261",
        "key": "TK-261",
        "title": "Event Sourcing ve CQRS Mimarisi Analizi",
        "desc": "Ali Yılmaz tarafından üstlenilen Event Sourcing ve CQRS Mimarisi Analizi çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-27",
        "dueDate": "2026-05-01",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st161-1",
                "text": "Event Sourcing ve CQRS Mimarisi Analizi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st161-2",
                "text": "Event Sourcing ve CQRS Mimarisi Analizi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm161-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Ali Yılmaz",
                "createdAt": 1777572000000
            }
        ],
        "epicId": "e7",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c262",
        "key": "TK-262",
        "title": "Kullanıcı Avatarı ve İsim Baş Harfi Renk Üreteci",
        "desc": "Zeynep Kaya tarafından üstlenilen Kullanıcı Avatarı ve İsim Baş Harfi Renk Üreteci çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-28",
        "dueDate": "2026-05-02",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st162-1",
                "text": "Kullanıcı Avatarı ve İsim Baş Harfi Renk Üreteci - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st162-2",
                "text": "Kullanıcı Avatarı ve İsim Baş Harfi Renk Üreteci - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c263",
        "key": "TK-263",
        "title": "Veritabanı Replikasyon Gecikmesi Metrikleri",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Replikasyon Gecikmesi Metrikleri çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-27",
        "dueDate": "2026-05-03",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st163-1",
                "text": "Veritabanı Replikasyon Gecikmesi Metrikleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st163-2",
                "text": "Veritabanı Replikasyon Gecikmesi Metrikleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c264",
        "key": "TK-264",
        "title": "Bireysel Performans ve Haftalık Görev Özeti",
        "desc": "Selin Yıldız tarafından üstlenilen Bireysel Performans ve Haftalık Görev Özeti çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-28",
        "dueDate": "2026-05-01",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st164-1",
                "text": "Bireysel Performans ve Haftalık Görev Özeti - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st164-2",
                "text": "Bireysel Performans ve Haftalık Görev Özeti - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c265",
        "key": "TK-265",
        "title": "DDoS Koruması ve Hız Sınırlama Yapılandırması",
        "desc": "Caner Öztürk tarafından üstlenilen DDoS Koruması ve Hız Sınırlama Yapılandırması çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-04-27",
        "dueDate": "2026-05-02",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st165-1",
                "text": "DDoS Koruması ve Hız Sınırlama Yapılandırması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st165-2",
                "text": "DDoS Koruması ve Hız Sınırlama Yapılandırması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c266",
        "key": "TK-266",
        "title": "XSS ve SQL Enjeksiyon Girdi Zafiyet Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen XSS ve SQL Enjeksiyon Girdi Zafiyet Testleri çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-28",
        "dueDate": "2026-05-03",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st166-1",
                "text": "XSS ve SQL Enjeksiyon Girdi Zafiyet Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st166-2",
                "text": "XSS ve SQL Enjeksiyon Girdi Zafiyet Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c267",
        "key": "TK-267",
        "title": "Firebase Cloud Messaging (FCM) Push Bildirimleri",
        "desc": "Emre Aydın tarafından üstlenilen Firebase Cloud Messaging (FCM) Push Bildirimleri çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-27",
        "dueDate": "2026-05-01",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st167-1",
                "text": "Firebase Cloud Messaging (FCM) Push Bildirimleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st167-2",
                "text": "Firebase Cloud Messaging (FCM) Push Bildirimleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c268",
        "key": "TK-268",
        "title": "Kullanıcı Katılımı (DAU) ve Oturum Analitiği",
        "desc": "Gamze Şahin tarafından üstlenilen Kullanıcı Katılımı (DAU) ve Oturum Analitiği çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-28",
        "dueDate": "2026-05-02",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st168-1",
                "text": "Kullanıcı Katılımı (DAU) ve Oturum Analitiği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st168-2",
                "text": "Kullanıcı Katılımı (DAU) ve Oturum Analitiği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm168-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Gamze Şahin",
                "createdAt": 1777658400000
            }
        ],
        "epicId": "e4",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c269",
        "key": "TK-269",
        "title": "Güvenli API Token İptali ve Oturum Geçersiz Kılma",
        "desc": "Tolga Kurt tarafından üstlenilen Güvenli API Token İptali ve Oturum Geçersiz Kılma çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-04-27",
        "dueDate": "2026-05-03",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st169-1",
                "text": "Güvenli API Token İptali ve Oturum Geçersiz Kılma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st169-2",
                "text": "Güvenli API Token İptali ve Oturum Geçersiz Kılma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c270",
        "key": "TK-270",
        "title": "Dağıtık Konfigürasyon Yönetimi (Consul / etcd)",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Konfigürasyon Yönetimi (Consul / etcd) çalışması. Sprint 17 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-04-28",
        "dueDate": "2026-05-01",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st170-1",
                "text": "Dağıtık Konfigürasyon Yönetimi (Consul / etcd) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st170-2",
                "text": "Dağıtık Konfigürasyon Yönetimi (Consul / etcd) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s17",
        "createdAt": 1777064400000
    },
    {
        "id": "c271",
        "key": "TK-271",
        "title": "E-Posta Bildirim Şablonları ve SMTP Havuzu",
        "desc": "Ali Yılmaz tarafından üstlenilen E-Posta Bildirim Şablonları ve SMTP Havuzu çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-04",
        "dueDate": "2026-05-08",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st171-1",
                "text": "E-Posta Bildirim Şablonları ve SMTP Havuzu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st171-2",
                "text": "E-Posta Bildirim Şablonları ve SMTP Havuzu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c272",
        "key": "TK-272",
        "title": "Ekip Üyesi Seçici (Assignee Dropdown) Arayüzü",
        "desc": "Zeynep Kaya tarafından üstlenilen Ekip Üyesi Seçici (Assignee Dropdown) Arayüzü çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-05",
        "dueDate": "2026-05-09",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st172-1",
                "text": "Ekip Üyesi Seçici (Assignee Dropdown) Arayüzü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st172-2",
                "text": "Ekip Üyesi Seçici (Assignee Dropdown) Arayüzü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c273",
        "key": "TK-273",
        "title": "Efor Tahmini ve Gerçekleşen Karşılaştırma",
        "desc": "Mehmet Demir tarafından üstlenilen Efor Tahmini ve Gerçekleşen Karşılaştırma çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-04",
        "dueDate": "2026-05-10",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st173-1",
                "text": "Efor Tahmini ve Gerçekleşen Karşılaştırma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st173-2",
                "text": "Efor Tahmini ve Gerçekleşen Karşılaştırma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c274",
        "key": "TK-274",
        "title": "E-Posta ile Görev Oluşturma (Inbound Parsing)",
        "desc": "Selin Yıldız tarafından üstlenilen E-Posta ile Görev Oluşturma (Inbound Parsing) çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-05",
        "dueDate": "2026-05-08",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st174-1",
                "text": "E-Posta ile Görev Oluşturma (Inbound Parsing) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st174-2",
                "text": "E-Posta ile Görev Oluşturma (Inbound Parsing) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c275",
        "key": "TK-275",
        "title": "Kubernetes Pod Otomatik Ölçekleme (HPA)",
        "desc": "Caner Öztürk tarafından üstlenilen Kubernetes Pod Otomatik Ölçekleme (HPA) çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-04",
        "dueDate": "2026-05-09",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st175-1",
                "text": "Kubernetes Pod Otomatik Ölçekleme (HPA) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st175-2",
                "text": "Kubernetes Pod Otomatik Ölçekleme (HPA) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm175-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Caner Öztürk",
                "createdAt": 1778263200000
            }
        ],
        "epicId": "e2",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c276",
        "key": "TK-276",
        "title": "Kart Detay Modalı Form Doğrulama Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Kart Detay Modalı Form Doğrulama Testleri çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-05",
        "dueDate": "2026-05-10",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st176-1",
                "text": "Kart Detay Modalı Form Doğrulama Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st176-2",
                "text": "Kart Detay Modalı Form Doğrulama Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c277",
        "key": "TK-277",
        "title": "Bildirime Tıklayınca Doğrudan Karta Gitme (Deep Link)",
        "desc": "Emre Aydın tarafından üstlenilen Bildirime Tıklayınca Doğrudan Karta Gitme (Deep Link) çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-04",
        "dueDate": "2026-05-08",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st177-1",
                "text": "Bildirime Tıklayınca Doğrudan Karta Gitme (Deep Link) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st177-2",
                "text": "Bildirime Tıklayınca Doğrudan Karta Gitme (Deep Link) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c278",
        "key": "TK-278",
        "title": "Görev Başına Ortalama Yorum Yoğunluğu",
        "desc": "Gamze Şahin tarafından üstlenilen Görev Başına Ortalama Yorum Yoğunluğu çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-05",
        "dueDate": "2026-05-09",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st178-1",
                "text": "Görev Başına Ortalama Yorum Yoğunluğu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st178-2",
                "text": "Görev Başına Ortalama Yorum Yoğunluğu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c279",
        "key": "TK-279",
        "title": "Penetrasyon Testi: Burp Suite ve ZAP Taraması",
        "desc": "Tolga Kurt tarafından üstlenilen Penetrasyon Testi: Burp Suite ve ZAP Taraması çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-04",
        "dueDate": "2026-05-10",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st179-1",
                "text": "Penetrasyon Testi: Burp Suite ve ZAP Taraması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st179-2",
                "text": "Penetrasyon Testi: Burp Suite ve ZAP Taraması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c280",
        "key": "TK-280",
        "title": "Ağ Bölünmesi ve Split-Brain Koruması",
        "desc": "Derya Arslan tarafından üstlenilen Ağ Bölünmesi ve Split-Brain Koruması çalışması. Sprint 18 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-05",
        "dueDate": "2026-05-08",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st180-1",
                "text": "Ağ Bölünmesi ve Split-Brain Koruması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st180-2",
                "text": "Ağ Bölünmesi ve Split-Brain Koruması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s18",
        "createdAt": 1777669200000
    },
    {
        "id": "c281",
        "key": "TK-281",
        "title": "Kullanıcı Denetim İzi (Audit Log) Servisi",
        "desc": "Ali Yılmaz tarafından üstlenilen Kullanıcı Denetim İzi (Audit Log) Servisi çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-11",
        "dueDate": "2026-05-15",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st181-1",
                "text": "Kullanıcı Denetim İzi (Audit Log) Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st181-2",
                "text": "Kullanıcı Denetim İzi (Audit Log) Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c282",
        "key": "TK-282",
        "title": "Kart Öncelik Bayrakları ve Renk Kodlaması",
        "desc": "Zeynep Kaya tarafından üstlenilen Kart Öncelik Bayrakları ve Renk Kodlaması çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-12",
        "dueDate": "2026-05-16",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st182-1",
                "text": "Kart Öncelik Bayrakları ve Renk Kodlaması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st182-2",
                "text": "Kart Öncelik Bayrakları ve Renk Kodlaması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm182-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Zeynep Kaya",
                "createdAt": 1778868000000
            }
        ],
        "epicId": "e10",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c283",
        "key": "TK-283",
        "title": "Kart Sıralama Performansı İçin B-Tree İndeks",
        "desc": "Mehmet Demir tarafından üstlenilen Kart Sıralama Performansı İçin B-Tree İndeks çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-11",
        "dueDate": "2026-05-17",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st183-1",
                "text": "Kart Sıralama Performansı İçin B-Tree İndeks - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st183-2",
                "text": "Kart Sıralama Performansı İçin B-Tree İndeks - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c284",
        "key": "TK-284",
        "title": "Kart Yorumlarında @Bahsetme (@Mention)",
        "desc": "Selin Yıldız tarafından üstlenilen Kart Yorumlarında @Bahsetme (@Mention) çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-12",
        "dueDate": "2026-05-15",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st184-1",
                "text": "Kart Yorumlarında @Bahsetme (@Mention) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st184-2",
                "text": "Kart Yorumlarında @Bahsetme (@Mention) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c285",
        "key": "TK-285",
        "title": "Veritabanı Otomatik Yedekleme ve S3 Arşivleme",
        "desc": "Caner Öztürk tarafından üstlenilen Veritabanı Otomatik Yedekleme ve S3 Arşivleme çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-11",
        "dueDate": "2026-05-16",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st185-1",
                "text": "Veritabanı Otomatik Yedekleme ve S3 Arşivleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st185-2",
                "text": "Veritabanı Otomatik Yedekleme ve S3 Arşivleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c286",
        "key": "TK-286",
        "title": "Geri Alma (Undo) ve Yanlışlıkla Silme Kurtarma Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Geri Alma (Undo) ve Yanlışlıkla Silme Kurtarma Testi çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-12",
        "dueDate": "2026-05-17",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st186-1",
                "text": "Geri Alma (Undo) ve Yanlışlıkla Silme Kurtarma Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st186-2",
                "text": "Geri Alma (Undo) ve Yanlışlıkla Silme Kurtarma Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c287",
        "key": "TK-287",
        "title": "Mobil Karanlık Tema Desteği",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Karanlık Tema Desteği çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-11",
        "dueDate": "2026-05-15",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st187-1",
                "text": "Mobil Karanlık Tema Desteği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st187-2",
                "text": "Mobil Karanlık Tema Desteği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c288",
        "key": "TK-288",
        "title": "Kart Akış Hızı ve Verimlilik Zaman Çizelgesi",
        "desc": "Gamze Şahin tarafından üstlenilen Kart Akış Hızı ve Verimlilik Zaman Çizelgesi çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-12",
        "dueDate": "2026-05-16",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st188-1",
                "text": "Kart Akış Hızı ve Verimlilik Zaman Çizelgesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st188-2",
                "text": "Kart Akış Hızı ve Verimlilik Zaman Çizelgesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c289",
        "key": "TK-289",
        "title": "Geliştirici Ortamı Çevre Değişkenleri Güvenlik Rehberi",
        "desc": "Tolga Kurt tarafından üstlenilen Geliştirici Ortamı Çevre Değişkenleri Güvenlik Rehberi çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-11",
        "dueDate": "2026-05-17",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st189-1",
                "text": "Geliştirici Ortamı Çevre Değişkenleri Güvenlik Rehberi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st189-2",
                "text": "Geliştirici Ortamı Çevre Değişkenleri Güvenlik Rehberi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm189-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Tolga Kurt",
                "createdAt": 1778954400000
            }
        ],
        "epicId": "e7",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c290",
        "key": "TK-290",
        "title": "Geri Basınç (Backpressure) Mekanizması ile Akış",
        "desc": "Derya Arslan tarafından üstlenilen Geri Basınç (Backpressure) Mekanizması ile Akış çalışması. Sprint 19 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-12",
        "dueDate": "2026-05-15",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st190-1",
                "text": "Geri Basınç (Backpressure) Mekanizması ile Akış - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st190-2",
                "text": "Geri Basınç (Backpressure) Mekanizması ile Akış - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s19",
        "createdAt": 1778274000000
    },
    {
        "id": "c291",
        "key": "TK-291",
        "title": "Sistem Sağlık Kontrolü Probes",
        "desc": "Ali Yılmaz tarafından üstlenilen Sistem Sağlık Kontrolü Probes çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-18",
        "dueDate": "2026-05-22",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st191-1",
                "text": "Sistem Sağlık Kontrolü Probes - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st191-2",
                "text": "Sistem Sağlık Kontrolü Probes - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c292",
        "key": "TK-292",
        "title": "Dosya ve Resim Eki Sürükle-Bırak Yükleme",
        "desc": "Zeynep Kaya tarafından üstlenilen Dosya ve Resim Eki Sürükle-Bırak Yükleme çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-19",
        "dueDate": "2026-05-23",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st192-1",
                "text": "Dosya ve Resim Eki Sürükle-Bırak Yükleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st192-2",
                "text": "Dosya ve Resim Eki Sürükle-Bırak Yükleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c293",
        "key": "TK-293",
        "title": "Sprint İlerleme Yüzdesi SQL Fonksiyonları",
        "desc": "Mehmet Demir tarafından üstlenilen Sprint İlerleme Yüzdesi SQL Fonksiyonları çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-18",
        "dueDate": "2026-05-24",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st193-1",
                "text": "Sprint İlerleme Yüzdesi SQL Fonksiyonları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st193-2",
                "text": "Sprint İlerleme Yüzdesi SQL Fonksiyonları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c294",
        "key": "TK-294",
        "title": "Dosya Önizleme Işık Kutusu (Lightbox) Modalı",
        "desc": "Selin Yıldız tarafından üstlenilen Dosya Önizleme Işık Kutusu (Lightbox) Modalı çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-19",
        "dueDate": "2026-05-22",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st194-1",
                "text": "Dosya Önizleme Işık Kutusu (Lightbox) Modalı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st194-2",
                "text": "Dosya Önizleme Işık Kutusu (Lightbox) Modalı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c295",
        "key": "TK-295",
        "title": "Terraform ile Altyapı Kod Olarak (IaC)",
        "desc": "Caner Öztürk tarafından üstlenilen Terraform ile Altyapı Kod Olarak (IaC) çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-18",
        "dueDate": "2026-05-23",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st195-1",
                "text": "Terraform ile Altyapı Kod Olarak (IaC) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st195-2",
                "text": "Terraform ile Altyapı Kod Olarak (IaC) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c296",
        "key": "TK-296",
        "title": "Karanlık ve Aydınlık Tema Kontrast Taraması",
        "desc": "Burcu Çelik tarafından üstlenilen Karanlık ve Aydınlık Tema Kontrast Taraması çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-19",
        "dueDate": "2026-05-24",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st196-1",
                "text": "Karanlık ve Aydınlık Tema Kontrast Taraması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st196-2",
                "text": "Karanlık ve Aydınlık Tema Kontrast Taraması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm196-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Burcu Çelik",
                "createdAt": 1779559200000
            }
        ],
        "epicId": "e5",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c297",
        "key": "TK-297",
        "title": "Tablet ve iPad Bölünmüş Ekran (Split View)",
        "desc": "Emre Aydın tarafından üstlenilen Tablet ve iPad Bölünmüş Ekran (Split View) çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-18",
        "dueDate": "2026-05-22",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st197-1",
                "text": "Tablet ve iPad Bölünmüş Ekran (Split View) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st197-2",
                "text": "Tablet ve iPad Bölünmüş Ekran (Split View) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c298",
        "key": "TK-298",
        "title": "Hatalı Tahmin Oranını Azaltıcı Geçmiş Veri Modeli",
        "desc": "Gamze Şahin tarafından üstlenilen Hatalı Tahmin Oranını Azaltıcı Geçmiş Veri Modeli çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-19",
        "dueDate": "2026-05-23",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st198-1",
                "text": "Hatalı Tahmin Oranını Azaltıcı Geçmiş Veri Modeli - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st198-2",
                "text": "Hatalı Tahmin Oranını Azaltıcı Geçmiş Veri Modeli - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c299",
        "key": "TK-299",
        "title": "Güvenli E-posta Doğrulama ve Parola Sıfırlama",
        "desc": "Tolga Kurt tarafından üstlenilen Güvenli E-posta Doğrulama ve Parola Sıfırlama çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-18",
        "dueDate": "2026-05-24",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st199-1",
                "text": "Güvenli E-posta Doğrulama ve Parola Sıfırlama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st199-2",
                "text": "Güvenli E-posta Doğrulama ve Parola Sıfırlama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c300",
        "key": "TK-300",
        "title": "Asenkron İletişimde İstek Korelasyon ID Takibi",
        "desc": "Derya Arslan tarafından üstlenilen Asenkron İletişimde İstek Korelasyon ID Takibi çalışması. Sprint 20 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-19",
        "dueDate": "2026-05-22",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st200-1",
                "text": "Asenkron İletişimde İstek Korelasyon ID Takibi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st200-2",
                "text": "Asenkron İletişimde İstek Korelasyon ID Takibi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s20",
        "createdAt": 1778878800000
    },
    {
        "id": "c301",
        "key": "TK-301",
        "title": "Serverless Fonksiyon Soğuk Başlangıç Optimizasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen Serverless Fonksiyon Soğuk Başlangıç Optimizasyonu çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-25",
        "dueDate": "2026-05-29",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st201-1",
                "text": "Serverless Fonksiyon Soğuk Başlangıç Optimizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st201-2",
                "text": "Serverless Fonksiyon Soğuk Başlangıç Optimizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c302",
        "key": "TK-302",
        "title": "Yorum Akışı ve Gönderim Kutusu Arayüzü",
        "desc": "Zeynep Kaya tarafından üstlenilen Yorum Akışı ve Gönderim Kutusu Arayüzü çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-26",
        "dueDate": "2026-05-30",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st202-1",
                "text": "Yorum Akışı ve Gönderim Kutusu Arayüzü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st202-2",
                "text": "Yorum Akışı ve Gönderim Kutusu Arayüzü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c303",
        "key": "TK-303",
        "title": "Çok Kiracılı Veritabanı RLS Kuralları",
        "desc": "Mehmet Demir tarafından üstlenilen Çok Kiracılı Veritabanı RLS Kuralları çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-25",
        "dueDate": "2026-05-31",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st203-1",
                "text": "Çok Kiracılı Veritabanı RLS Kuralları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st203-2",
                "text": "Çok Kiracılı Veritabanı RLS Kuralları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm203-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Mehmet Demir",
                "createdAt": 1780164000000
            }
        ],
        "epicId": "e3",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c304",
        "key": "TK-304",
        "title": "Mobil Web Tarayıcı Pano Görünümü İyileştirmesi",
        "desc": "Selin Yıldız tarafından üstlenilen Mobil Web Tarayıcı Pano Görünümü İyileştirmesi çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-26",
        "dueDate": "2026-05-29",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st204-1",
                "text": "Mobil Web Tarayıcı Pano Görünümü İyileştirmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st204-2",
                "text": "Mobil Web Tarayıcı Pano Görünümü İyileştirmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c305",
        "key": "TK-305",
        "title": "ArgoCD GitOps Sürekli Dağıtım Pipeline",
        "desc": "Caner Öztürk tarafından üstlenilen ArgoCD GitOps Sürekli Dağıtım Pipeline çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-05-25",
        "dueDate": "2026-05-30",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st205-1",
                "text": "ArgoCD GitOps Sürekli Dağıtım Pipeline - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st205-2",
                "text": "ArgoCD GitOps Sürekli Dağıtım Pipeline - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c306",
        "key": "TK-306",
        "title": "Dosya Yükleme Boyut ve Format Güvenlik Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Dosya Yükleme Boyut ve Format Güvenlik Testleri çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-26",
        "dueDate": "2026-05-31",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st206-1",
                "text": "Dosya Yükleme Boyut ve Format Güvenlik Testleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st206-2",
                "text": "Dosya Yükleme Boyut ve Format Güvenlik Testleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c307",
        "key": "TK-307",
        "title": "Mobil Arama Çubuğu ve Sonuç Filtreleme",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Arama Çubuğu ve Sonuç Filtreleme çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-25",
        "dueDate": "2026-05-29",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st207-1",
                "text": "Mobil Arama Çubuğu ve Sonuç Filtreleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st207-2",
                "text": "Mobil Arama Çubuğu ve Sonuç Filtreleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c308",
        "key": "TK-308",
        "title": "Pano Sağlık Skoru (Board Health Score) Hesaplama",
        "desc": "Gamze Şahin tarafından üstlenilen Pano Sağlık Skoru (Board Health Score) Hesaplama çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-26",
        "dueDate": "2026-05-30",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st208-1",
                "text": "Pano Sağlık Skoru (Board Health Score) Hesaplama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st208-2",
                "text": "Pano Sağlık Skoru (Board Health Score) Hesaplama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c309",
        "key": "TK-309",
        "title": "Adli Bilişim İçin Değiştirilemez Denetim Kütüğü",
        "desc": "Tolga Kurt tarafından üstlenilen Adli Bilişim İçin Değiştirilemez Denetim Kütüğü çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-05-25",
        "dueDate": "2026-05-31",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st209-1",
                "text": "Adli Bilişim İçin Değiştirilemez Denetim Kütüğü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st209-2",
                "text": "Adli Bilişim İçin Değiştirilemez Denetim Kütüğü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c310",
        "key": "TK-310",
        "title": "Dağıtık Sistem Sağlık Ağı ve Gossip Protokolü",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Sistem Sağlık Ağı ve Gossip Protokolü çalışması. Sprint 21 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-05-26",
        "dueDate": "2026-05-29",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st210-1",
                "text": "Dağıtık Sistem Sağlık Ağı ve Gossip Protokolü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st210-2",
                "text": "Dağıtık Sistem Sağlık Ağı ve Gossip Protokolü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm210-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Derya Arslan",
                "createdAt": 1779991200000
            }
        ],
        "epicId": "e10",
        "sprintId": "s21",
        "createdAt": 1779483600000
    },
    {
        "id": "c311",
        "key": "TK-311",
        "title": "GraphQL N+1 ve DataLoader Entegrasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen GraphQL N+1 ve DataLoader Entegrasyonu çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-01",
        "dueDate": "2026-06-05",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st211-1",
                "text": "GraphQL N+1 ve DataLoader Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st211-2",
                "text": "GraphQL N+1 ve DataLoader Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c312",
        "key": "TK-312",
        "title": "Liste Görünümü Tablo Sıralama ve Sayfalama",
        "desc": "Zeynep Kaya tarafından üstlenilen Liste Görünümü Tablo Sıralama ve Sayfalama çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-02",
        "dueDate": "2026-06-06",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st212-1",
                "text": "Liste Görünümü Tablo Sıralama ve Sayfalama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st212-2",
                "text": "Liste Görünümü Tablo Sıralama ve Sayfalama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c313",
        "key": "TK-313",
        "title": "Ağır Analitik Sorgular İçin Read-Only Havuz",
        "desc": "Mehmet Demir tarafından üstlenilen Ağır Analitik Sorgular İçin Read-Only Havuz çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-01",
        "dueDate": "2026-06-07",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st213-1",
                "text": "Ağır Analitik Sorgular İçin Read-Only Havuz - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st213-2",
                "text": "Ağır Analitik Sorgular İçin Read-Only Havuz - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c314",
        "key": "TK-314",
        "title": "Görev Son Tarihi Yaklaşanlar Hatırlatıcısı",
        "desc": "Selin Yıldız tarafından üstlenilen Görev Son Tarihi Yaklaşanlar Hatırlatıcısı çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-02",
        "dueDate": "2026-06-05",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st214-1",
                "text": "Görev Son Tarihi Yaklaşanlar Hatırlatıcısı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st214-2",
                "text": "Görev Son Tarihi Yaklaşanlar Hatırlatıcısı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c315",
        "key": "TK-315",
        "title": "Kubernetes Ağ Güvenlik Politikaları (NetworkPolicies)",
        "desc": "Caner Öztürk tarafından üstlenilen Kubernetes Ağ Güvenlik Politikaları (NetworkPolicies) çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-01",
        "dueDate": "2026-06-06",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st215-1",
                "text": "Kubernetes Ağ Güvenlik Politikaları (NetworkPolicies) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st215-2",
                "text": "Kubernetes Ağ Güvenlik Politikaları (NetworkPolicies) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c316",
        "key": "TK-316",
        "title": "Ağ Kesintisi ve Çevrimdışı Çalışma Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Ağ Kesintisi ve Çevrimdışı Çalışma Testi çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-02",
        "dueDate": "2026-06-07",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st216-1",
                "text": "Ağ Kesintisi ve Çevrimdışı Çalışma Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st216-2",
                "text": "Ağ Kesintisi ve Çevrimdışı Çalışma Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c317",
        "key": "TK-317",
        "title": "Alt Görev Listesi ve Dokunmatik Tamamlama",
        "desc": "Emre Aydın tarafından üstlenilen Alt Görev Listesi ve Dokunmatik Tamamlama çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-01",
        "dueDate": "2026-06-05",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st217-1",
                "text": "Alt Görev Listesi ve Dokunmatik Tamamlama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st217-2",
                "text": "Alt Görev Listesi ve Dokunmatik Tamamlama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm217-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Emre Aydın",
                "createdAt": 1780596000000
            }
        ],
        "epicId": "e8",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c318",
        "key": "TK-318",
        "title": "Çoklu Pano Karşılaştırmalı Benchmark Raporu",
        "desc": "Gamze Şahin tarafından üstlenilen Çoklu Pano Karşılaştırmalı Benchmark Raporu çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-02",
        "dueDate": "2026-06-06",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st218-1",
                "text": "Çoklu Pano Karşılaştırmalı Benchmark Raporu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st218-2",
                "text": "Çoklu Pano Karşılaştırmalı Benchmark Raporu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c319",
        "key": "TK-319",
        "title": "Güvenlik Olayı Müdahale Planı (Incident Response)",
        "desc": "Tolga Kurt tarafından üstlenilen Güvenlik Olayı Müdahale Planı (Incident Response) çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-01",
        "dueDate": "2026-06-07",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st219-1",
                "text": "Güvenlik Olayı Müdahale Planı (Incident Response) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st219-2",
                "text": "Güvenlik Olayı Müdahale Planı (Incident Response) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c320",
        "key": "TK-320",
        "title": "Olay Sıralama Garantisi (FIFO) Dağıtımı",
        "desc": "Derya Arslan tarafından üstlenilen Olay Sıralama Garantisi (FIFO) Dağıtımı çalışması. Sprint 22 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-02",
        "dueDate": "2026-06-05",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st220-1",
                "text": "Olay Sıralama Garantisi (FIFO) Dağıtımı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st220-2",
                "text": "Olay Sıralama Garantisi (FIFO) Dağıtımı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s22",
        "createdAt": 1780088400000
    },
    {
        "id": "c321",
        "key": "TK-321",
        "title": "Toplu Veri İçe Aktarımı (Batch Engine)",
        "desc": "Ali Yılmaz tarafından üstlenilen Toplu Veri İçe Aktarımı (Batch Engine) çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-08",
        "dueDate": "2026-06-12",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st221-1",
                "text": "Toplu Veri İçe Aktarımı (Batch Engine) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st221-2",
                "text": "Toplu Veri İçe Aktarımı (Batch Engine) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c322",
        "key": "TK-322",
        "title": "Backlog Görünümü Sprint Gruplama ve Akordeon",
        "desc": "Zeynep Kaya tarafından üstlenilen Backlog Görünümü Sprint Gruplama ve Akordeon çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-09",
        "dueDate": "2026-06-13",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st222-1",
                "text": "Backlog Görünümü Sprint Gruplama ve Akordeon - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st222-2",
                "text": "Backlog Görünümü Sprint Gruplama ve Akordeon - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c323",
        "key": "TK-323",
        "title": "Deadlock Tespit ve Otomatik Yeniden Çalıştırma",
        "desc": "Mehmet Demir tarafından üstlenilen Deadlock Tespit ve Otomatik Yeniden Çalıştırma çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-08",
        "dueDate": "2026-06-14",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st223-1",
                "text": "Deadlock Tespit ve Otomatik Yeniden Çalıştırma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st223-2",
                "text": "Deadlock Tespit ve Otomatik Yeniden Çalıştırma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c324",
        "key": "TK-324",
        "title": "Pano İçinde Kart Çoğaltma (Duplicate)",
        "desc": "Selin Yıldız tarafından üstlenilen Pano İçinde Kart Çoğaltma (Duplicate) çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-09",
        "dueDate": "2026-06-12",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st224-1",
                "text": "Pano İçinde Kart Çoğaltma (Duplicate) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st224-2",
                "text": "Pano İçinde Kart Çoğaltma (Duplicate) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm224-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Selin Yıldız",
                "createdAt": 1781200800000
            }
        ],
        "epicId": "e6",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c325",
        "key": "TK-325",
        "title": "Redis Sentinel Yüksek Erişilebilirlik Kümesi",
        "desc": "Caner Öztürk tarafından üstlenilen Redis Sentinel Yüksek Erişilebilirlik Kümesi çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-08",
        "dueDate": "2026-06-13",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st225-1",
                "text": "Redis Sentinel Yüksek Erişilebilirlik Kümesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st225-2",
                "text": "Redis Sentinel Yüksek Erişilebilirlik Kümesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c326",
        "key": "TK-326",
        "title": "Webhook İletim ve Retry Doğrulama Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Webhook İletim ve Retry Doğrulama Testi çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-09",
        "dueDate": "2026-06-14",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st226-1",
                "text": "Webhook İletim ve Retry Doğrulama Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st226-2",
                "text": "Webhook İletim ve Retry Doğrulama Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c327",
        "key": "TK-327",
        "title": "Mobil Pano Ayarları ve Çıkış Menüsü",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Pano Ayarları ve Çıkış Menüsü çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-08",
        "dueDate": "2026-06-12",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st227-1",
                "text": "Mobil Pano Ayarları ve Çıkış Menüsü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st227-2",
                "text": "Mobil Pano Ayarları ve Çıkış Menüsü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c328",
        "key": "TK-328",
        "title": "Veri Görselleştirme İçin Chart.js Optimizasyonu",
        "desc": "Gamze Şahin tarafından üstlenilen Veri Görselleştirme İçin Chart.js Optimizasyonu çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-09",
        "dueDate": "2026-06-13",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st228-1",
                "text": "Veri Görselleştirme İçin Chart.js Optimizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st228-2",
                "text": "Veri Görselleştirme İçin Chart.js Optimizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c329",
        "key": "TK-329",
        "title": "API İstek Boyutu Sınırı (128KB) ve DoS Savunması",
        "desc": "Tolga Kurt tarafından üstlenilen API İstek Boyutu Sınırı (128KB) ve DoS Savunması çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-08",
        "dueDate": "2026-06-14",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st229-1",
                "text": "API İstek Boyutu Sınırı (128KB) ve DoS Savunması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st229-2",
                "text": "API İstek Boyutu Sınırı (128KB) ve DoS Savunması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c330",
        "key": "TK-330",
        "title": "Çoklu Veri Merkezleri Arası Gecikme Ölçümü",
        "desc": "Derya Arslan tarafından üstlenilen Çoklu Veri Merkezleri Arası Gecikme Ölçümü çalışması. Sprint 23 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-09",
        "dueDate": "2026-06-12",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st230-1",
                "text": "Çoklu Veri Merkezleri Arası Gecikme Ölçümü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st230-2",
                "text": "Çoklu Veri Merkezleri Arası Gecikme Ölçümü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s23",
        "createdAt": 1780693200000
    },
    {
        "id": "c331",
        "key": "TK-331",
        "title": "WebSocket Çift Yönlü Gerçek Zamanlı Olay İletimi",
        "desc": "Ali Yılmaz tarafından üstlenilen WebSocket Çift Yönlü Gerçek Zamanlı Olay İletimi çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-15",
        "dueDate": "2026-06-19",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st231-1",
                "text": "WebSocket Çift Yönlü Gerçek Zamanlı Olay İletimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st231-2",
                "text": "WebSocket Çift Yönlü Gerçek Zamanlı Olay İletimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm231-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Ali Yılmaz",
                "createdAt": 1781805600000
            }
        ],
        "epicId": "e4",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c332",
        "key": "TK-332",
        "title": "Dashboard Hızlı İstatistik Kartları Grid",
        "desc": "Zeynep Kaya tarafından üstlenilen Dashboard Hızlı İstatistik Kartları Grid çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-16",
        "dueDate": "2026-06-20",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st232-1",
                "text": "Dashboard Hızlı İstatistik Kartları Grid - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st232-2",
                "text": "Dashboard Hızlı İstatistik Kartları Grid - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c333",
        "key": "TK-333",
        "title": "Kart Eşzamanlı Düzenleme Kilitleme",
        "desc": "Mehmet Demir tarafından üstlenilen Kart Eşzamanlı Düzenleme Kilitleme çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-15",
        "dueDate": "2026-06-21",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st233-1",
                "text": "Kart Eşzamanlı Düzenleme Kilitleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st233-2",
                "text": "Kart Eşzamanlı Düzenleme Kilitleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c334",
        "key": "TK-334",
        "title": "Hızlı Pano Değiştirici (Workspace Switcher)",
        "desc": "Selin Yıldız tarafından üstlenilen Hızlı Pano Değiştirici (Workspace Switcher) çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-16",
        "dueDate": "2026-06-19",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st234-1",
                "text": "Hızlı Pano Değiştirici (Workspace Switcher) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st234-2",
                "text": "Hızlı Pano Değiştirici (Workspace Switcher) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c335",
        "key": "TK-335",
        "title": "Canary Deployment ve Aşamalı Trafik Testi",
        "desc": "Caner Öztürk tarafından üstlenilen Canary Deployment ve Aşamalı Trafik Testi çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-15",
        "dueDate": "2026-06-20",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st235-1",
                "text": "Canary Deployment ve Aşamalı Trafik Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st235-2",
                "text": "Canary Deployment ve Aşamalı Trafik Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c336",
        "key": "TK-336",
        "title": "Playwright Paralel E2E Test Koşumu",
        "desc": "Burcu Çelik tarafından üstlenilen Playwright Paralel E2E Test Koşumu çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-16",
        "dueDate": "2026-06-21",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st236-1",
                "text": "Playwright Paralel E2E Test Koşumu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st236-2",
                "text": "Playwright Paralel E2E Test Koşumu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c337",
        "key": "TK-337",
        "title": "Pil Tüketimi ve Arka Plan Görev Optimizasyonu",
        "desc": "Emre Aydın tarafından üstlenilen Pil Tüketimi ve Arka Plan Görev Optimizasyonu çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-15",
        "dueDate": "2026-06-19",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st237-1",
                "text": "Pil Tüketimi ve Arka Plan Görev Optimizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st237-2",
                "text": "Pil Tüketimi ve Arka Plan Görev Optimizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c338",
        "key": "TK-338",
        "title": "Çevrimdışı Rapor Üretimi ve PDF Servisi",
        "desc": "Gamze Şahin tarafından üstlenilen Çevrimdışı Rapor Üretimi ve PDF Servisi çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-16",
        "dueDate": "2026-06-20",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st238-1",
                "text": "Çevrimdışı Rapor Üretimi ve PDF Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st238-2",
                "text": "Çevrimdışı Rapor Üretimi ve PDF Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm238-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Gamze Şahin",
                "createdAt": 1781892000000
            }
        ],
        "epicId": "e1",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c339",
        "key": "TK-339",
        "title": "Çok Kiracılı Ortamda Yetki Aşımı Testi",
        "desc": "Tolga Kurt tarafından üstlenilen Çok Kiracılı Ortamda Yetki Aşımı Testi çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-15",
        "dueDate": "2026-06-21",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st239-1",
                "text": "Çok Kiracılı Ortamda Yetki Aşımı Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st239-2",
                "text": "Çok Kiracılı Ortamda Yetki Aşımı Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c340",
        "key": "TK-340",
        "title": "Dinamik Kaynak Tahsisi ve Otomatik Genişleme",
        "desc": "Derya Arslan tarafından üstlenilen Dinamik Kaynak Tahsisi ve Otomatik Genişleme çalışması. Sprint 24 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-16",
        "dueDate": "2026-06-19",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st240-1",
                "text": "Dinamik Kaynak Tahsisi ve Otomatik Genişleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st240-2",
                "text": "Dinamik Kaynak Tahsisi ve Otomatik Genişleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s24",
        "createdAt": 1781298000000
    },
    {
        "id": "c341",
        "key": "TK-341",
        "title": "Güvenli API Anahtarı Yönetim Modülü",
        "desc": "Ali Yılmaz tarafından üstlenilen Güvenli API Anahtarı Yönetim Modülü çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-22",
        "dueDate": "2026-06-26",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st241-1",
                "text": "Güvenli API Anahtarı Yönetim Modülü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st241-2",
                "text": "Güvenli API Anahtarı Yönetim Modülü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c342",
        "key": "TK-342",
        "title": "Gantt Çizelgesi SVG Zaman Çubuğu Çizim Modülü",
        "desc": "Zeynep Kaya tarafından üstlenilen Gantt Çizelgesi SVG Zaman Çubuğu Çizim Modülü çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-23",
        "dueDate": "2026-06-27",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st242-1",
                "text": "Gantt Çizelgesi SVG Zaman Çubuğu Çizim Modülü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st242-2",
                "text": "Gantt Çizelgesi SVG Zaman Çubuğu Çizim Modülü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c343",
        "key": "TK-343",
        "title": "Veritabanı Bellek Ayarları Optimizasyonu",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Bellek Ayarları Optimizasyonu çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-22",
        "dueDate": "2026-06-28",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st243-1",
                "text": "Veritabanı Bellek Ayarları Optimizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st243-2",
                "text": "Veritabanı Bellek Ayarları Optimizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c344",
        "key": "TK-344",
        "title": "Kullanıcı Profil Bilgileri ve Şifre Yenileme",
        "desc": "Selin Yıldız tarafından üstlenilen Kullanıcı Profil Bilgileri ve Şifre Yenileme çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-23",
        "dueDate": "2026-06-26",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st244-1",
                "text": "Kullanıcı Profil Bilgileri ve Şifre Yenileme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st244-2",
                "text": "Kullanıcı Profil Bilgileri ve Şifre Yenileme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c345",
        "key": "TK-345",
        "title": "Secret Yönetimi İçin HashiCorp Vault",
        "desc": "Caner Öztürk tarafından üstlenilen Secret Yönetimi İçin HashiCorp Vault çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-22",
        "dueDate": "2026-06-27",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st245-1",
                "text": "Secret Yönetimi İçin HashiCorp Vault - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st245-2",
                "text": "Secret Yönetimi İçin HashiCorp Vault - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm245-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Caner Öztürk",
                "createdAt": 1782496800000
            }
        ],
        "epicId": "e9",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c346",
        "key": "TK-346",
        "title": "Görsel Regresyon (Visual Regression) Piksel Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Görsel Regresyon (Visual Regression) Piksel Testi çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-23",
        "dueDate": "2026-06-28",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st246-1",
                "text": "Görsel Regresyon (Visual Regression) Piksel Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st246-2",
                "text": "Görsel Regresyon (Visual Regression) Piksel Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c347",
        "key": "TK-347",
        "title": "Android Geri Tuşu Davranışı ve Modal Kapatma",
        "desc": "Emre Aydın tarafından üstlenilen Android Geri Tuşu Davranışı ve Modal Kapatma çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-22",
        "dueDate": "2026-06-26",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st247-1",
                "text": "Android Geri Tuşu Davranışı ve Modal Kapatma - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st247-2",
                "text": "Android Geri Tuşu Davranışı ve Modal Kapatma - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c348",
        "key": "TK-348",
        "title": "Haftalık Sprint Retrospektif Veri Seti",
        "desc": "Gamze Şahin tarafından üstlenilen Haftalık Sprint Retrospektif Veri Seti çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-23",
        "dueDate": "2026-06-27",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st248-1",
                "text": "Haftalık Sprint Retrospektif Veri Seti - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st248-2",
                "text": "Haftalık Sprint Retrospektif Veri Seti - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c349",
        "key": "TK-349",
        "title": "Webhook Sahteciliğini Önlemek İçin HMAC Doğrulama",
        "desc": "Tolga Kurt tarafından üstlenilen Webhook Sahteciliğini Önlemek İçin HMAC Doğrulama çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-22",
        "dueDate": "2026-06-28",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st249-1",
                "text": "Webhook Sahteciliğini Önlemek İçin HMAC Doğrulama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st249-2",
                "text": "Webhook Sahteciliğini Önlemek İçin HMAC Doğrulama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c350",
        "key": "TK-350",
        "title": "Dağıtık Veri Saklama İçin Sıkıştırma (Zstandard)",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Veri Saklama İçin Sıkıştırma (Zstandard) çalışması. Sprint 25 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-23",
        "dueDate": "2026-06-26",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st250-1",
                "text": "Dağıtık Veri Saklama İçin Sıkıştırma (Zstandard) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st250-2",
                "text": "Dağıtık Veri Saklama İçin Sıkıştırma (Zstandard) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s25",
        "createdAt": 1781902800000
    },
    {
        "id": "c351",
        "key": "TK-351",
        "title": "Multi-Region Okuma Kopyası Yönlendirmesi",
        "desc": "Ali Yılmaz tarafından üstlenilen Multi-Region Okuma Kopyası Yönlendirmesi çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-29",
        "dueDate": "2026-07-03",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st251-1",
                "text": "Multi-Region Okuma Kopyası Yönlendirmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st251-2",
                "text": "Multi-Region Okuma Kopyası Yönlendirmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c352",
        "key": "TK-352",
        "title": "Raporlar Sayfası Efor Sapma Grafikleri",
        "desc": "Zeynep Kaya tarafından üstlenilen Raporlar Sayfası Efor Sapma Grafikleri çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-30",
        "dueDate": "2026-07-04",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st252-1",
                "text": "Raporlar Sayfası Efor Sapma Grafikleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st252-2",
                "text": "Raporlar Sayfası Efor Sapma Grafikleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm252-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Zeynep Kaya",
                "createdAt": 1783101600000
            }
        ],
        "epicId": "e7",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c353",
        "key": "TK-353",
        "title": "CSV Dışa Aktarımı İçin Akış Tabanlı Cursor",
        "desc": "Mehmet Demir tarafından üstlenilen CSV Dışa Aktarımı İçin Akış Tabanlı Cursor çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-29",
        "dueDate": "2026-07-05",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st253-1",
                "text": "CSV Dışa Aktarımı İçin Akış Tabanlı Cursor - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st253-2",
                "text": "CSV Dışa Aktarımı İçin Akış Tabanlı Cursor - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c354",
        "key": "TK-354",
        "title": "Pano Faaliyet Günlüğü Zaman Çizelgesi",
        "desc": "Selin Yıldız tarafından üstlenilen Pano Faaliyet Günlüğü Zaman Çizelgesi çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-30",
        "dueDate": "2026-07-03",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st254-1",
                "text": "Pano Faaliyet Günlüğü Zaman Çizelgesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st254-2",
                "text": "Pano Faaliyet Günlüğü Zaman Çizelgesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c355",
        "key": "TK-355",
        "title": "Multi-Zone Kubernetes Düğümleri Yedekliliği",
        "desc": "Caner Öztürk tarafından üstlenilen Multi-Zone Kubernetes Düğümleri Yedekliliği çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-06-29",
        "dueDate": "2026-07-04",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st255-1",
                "text": "Multi-Zone Kubernetes Düğümleri Yedekliliği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st255-2",
                "text": "Multi-Zone Kubernetes Düğümleri Yedekliliği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c356",
        "key": "TK-356",
        "title": "Kod Kapsama (Code Coverage) %85 Üzerine Çıkarılması",
        "desc": "Burcu Çelik tarafından üstlenilen Kod Kapsama (Code Coverage) %85 Üzerine Çıkarılması çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-30",
        "dueDate": "2026-07-05",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st256-1",
                "text": "Kod Kapsama (Code Coverage) %85 Üzerine Çıkarılması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st256-2",
                "text": "Kod Kapsama (Code Coverage) %85 Üzerine Çıkarılması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c357",
        "key": "TK-357",
        "title": "Mobil Ağ İstekleri İçin SSL Pinning",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Ağ İstekleri İçin SSL Pinning çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-29",
        "dueDate": "2026-07-03",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st257-1",
                "text": "Mobil Ağ İstekleri İçin SSL Pinning - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st257-2",
                "text": "Mobil Ağ İstekleri İçin SSL Pinning - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c358",
        "key": "TK-358",
        "title": "Anomalili Görev Tespiti: Beklenmedik Uzun Görevler",
        "desc": "Gamze Şahin tarafından üstlenilen Anomalili Görev Tespiti: Beklenmedik Uzun Görevler çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-30",
        "dueDate": "2026-07-04",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st258-1",
                "text": "Anomalili Görev Tespiti: Beklenmedik Uzun Görevler - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st258-2",
                "text": "Anomalili Görev Tespiti: Beklenmedik Uzun Görevler - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c359",
        "key": "TK-359",
        "title": "Sunucu Banner Bilgisi (X-Powered-By) Gizleme",
        "desc": "Tolga Kurt tarafından üstlenilen Sunucu Banner Bilgisi (X-Powered-By) Gizleme çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-06-29",
        "dueDate": "2026-07-05",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st259-1",
                "text": "Sunucu Banner Bilgisi (X-Powered-By) Gizleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st259-2",
                "text": "Sunucu Banner Bilgisi (X-Powered-By) Gizleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm259-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Tolga Kurt",
                "createdAt": 1783188000000
            }
        ],
        "epicId": "e4",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c360",
        "key": "TK-360",
        "title": "Servisler Arası mTLS ile Şifreli İletişim",
        "desc": "Derya Arslan tarafından üstlenilen Servisler Arası mTLS ile Şifreli İletişim çalışması. Sprint 26 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-06-30",
        "dueDate": "2026-07-03",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st260-1",
                "text": "Servisler Arası mTLS ile Şifreli İletişim - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st260-2",
                "text": "Servisler Arası mTLS ile Şifreli İletişim - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s26",
        "createdAt": 1782507600000
    },
    {
        "id": "c361",
        "key": "TK-361",
        "title": "JSON-Schema Doğrulama ve İstek Sanitizasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen JSON-Schema Doğrulama ve İstek Sanitizasyonu çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-06",
        "dueDate": "2026-07-10",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st261-1",
                "text": "JSON-Schema Doğrulama ve İstek Sanitizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st261-2",
                "text": "JSON-Schema Doğrulama ve İstek Sanitizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c362",
        "key": "TK-362",
        "title": "Boş Durum (Empty State) İllüstrasyonları",
        "desc": "Zeynep Kaya tarafından üstlenilen Boş Durum (Empty State) İllüstrasyonları çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-07",
        "dueDate": "2026-07-11",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st262-1",
                "text": "Boş Durum (Empty State) İllüstrasyonları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st262-2",
                "text": "Boş Durum (Empty State) İllüstrasyonları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c363",
        "key": "TK-363",
        "title": "Zaman Damgalı Veriler İçin TimescaleDB Analizi",
        "desc": "Mehmet Demir tarafından üstlenilen Zaman Damgalı Veriler İçin TimescaleDB Analizi çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-06",
        "dueDate": "2026-07-12",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st263-1",
                "text": "Zaman Damgalı Veriler İçin TimescaleDB Analizi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st263-2",
                "text": "Zaman Damgalı Veriler İçin TimescaleDB Analizi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c364",
        "key": "TK-364",
        "title": "Görev Süresi Sayacı ve Canlı Efor Girişi",
        "desc": "Selin Yıldız tarafından üstlenilen Görev Süresi Sayacı ve Canlı Efor Girişi çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-07",
        "dueDate": "2026-07-10",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st264-1",
                "text": "Görev Süresi Sayacı ve Canlı Efor Girişi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st264-2",
                "text": "Görev Süresi Sayacı ve Canlı Efor Girişi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c365",
        "key": "TK-365",
        "title": "Altyapı Maliyet Analizi ve Kaynak Temizliği",
        "desc": "Caner Öztürk tarafından üstlenilen Altyapı Maliyet Analizi ve Kaynak Temizliği çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-06",
        "dueDate": "2026-07-11",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st265-1",
                "text": "Altyapı Maliyet Analizi ve Kaynak Temizliği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st265-2",
                "text": "Altyapı Maliyet Analizi ve Kaynak Temizliği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c366",
        "key": "TK-366",
        "title": "Zaman Dilimi ve Tarih Formatları Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Zaman Dilimi ve Tarih Formatları Testi çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-07",
        "dueDate": "2026-07-12",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st266-1",
                "text": "Zaman Dilimi ve Tarih Formatları Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st266-2",
                "text": "Zaman Dilimi ve Tarih Formatları Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm266-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Burcu Çelik",
                "createdAt": 1783792800000
            }
        ],
        "epicId": "e2",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c367",
        "key": "TK-367",
        "title": "Sentry Mobil Hata ve Çökme Takip Entegrasyonu",
        "desc": "Emre Aydın tarafından üstlenilen Sentry Mobil Hata ve Çökme Takip Entegrasyonu çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-06",
        "dueDate": "2026-07-10",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st267-1",
                "text": "Sentry Mobil Hata ve Çökme Takip Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st267-2",
                "text": "Sentry Mobil Hata ve Çökme Takip Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c368",
        "key": "TK-368",
        "title": "Kullanıcı İş Yükü (Burnout Risk) Erken Uyarı Algoritması",
        "desc": "Gamze Şahin tarafından üstlenilen Kullanıcı İş Yükü (Burnout Risk) Erken Uyarı Algoritması çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-07",
        "dueDate": "2026-07-11",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st268-1",
                "text": "Kullanıcı İş Yükü (Burnout Risk) Erken Uyarı Algoritması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st268-2",
                "text": "Kullanıcı İş Yükü (Burnout Risk) Erken Uyarı Algoritması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c369",
        "key": "TK-369",
        "title": "Açık Kaynak Lisans Uyumluluğu Güvenlik Taraması",
        "desc": "Tolga Kurt tarafından üstlenilen Açık Kaynak Lisans Uyumluluğu Güvenlik Taraması çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-06",
        "dueDate": "2026-07-12",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st269-1",
                "text": "Açık Kaynak Lisans Uyumluluğu Güvenlik Taraması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st269-2",
                "text": "Açık Kaynak Lisans Uyumluluğu Güvenlik Taraması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c370",
        "key": "TK-370",
        "title": "Zaman Serisi Olay Deposu ve Oynatma (Replay)",
        "desc": "Derya Arslan tarafından üstlenilen Zaman Serisi Olay Deposu ve Oynatma (Replay) çalışması. Sprint 27 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-07",
        "dueDate": "2026-07-10",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st270-1",
                "text": "Zaman Serisi Olay Deposu ve Oynatma (Replay) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st270-2",
                "text": "Zaman Serisi Olay Deposu ve Oynatma (Replay) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s27",
        "createdAt": 1783112400000
    },
    {
        "id": "c371",
        "key": "TK-371",
        "title": "Dağıtık Zaman Aşımı ve Devre Kesici (Circuit Breaker)",
        "desc": "Ali Yılmaz tarafından üstlenilen Dağıtık Zaman Aşımı ve Devre Kesici (Circuit Breaker) çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-13",
        "dueDate": "2026-07-17",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st271-1",
                "text": "Dağıtık Zaman Aşımı ve Devre Kesici (Circuit Breaker) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st271-2",
                "text": "Dağıtık Zaman Aşımı ve Devre Kesici (Circuit Breaker) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c372",
        "key": "TK-372",
        "title": "Hata Sayfaları (404, 403, 500) Kullanıcı Dostu Görselleri",
        "desc": "Zeynep Kaya tarafından üstlenilen Hata Sayfaları (404, 403, 500) Kullanıcı Dostu Görselleri çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-14",
        "dueDate": "2026-07-18",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st272-1",
                "text": "Hata Sayfaları (404, 403, 500) Kullanıcı Dostu Görselleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st272-2",
                "text": "Hata Sayfaları (404, 403, 500) Kullanıcı Dostu Görselleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c373",
        "key": "TK-373",
        "title": "Kart Kopyalama İçin Derin Kopyalama SQL Prosedürü",
        "desc": "Mehmet Demir tarafından üstlenilen Kart Kopyalama İçin Derin Kopyalama SQL Prosedürü çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-13",
        "dueDate": "2026-07-19",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st273-1",
                "text": "Kart Kopyalama İçin Derin Kopyalama SQL Prosedürü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st273-2",
                "text": "Kart Kopyalama İçin Derin Kopyalama SQL Prosedürü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm273-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Mehmet Demir",
                "createdAt": 1784397600000
            }
        ],
        "epicId": "e10",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c374",
        "key": "TK-374",
        "title": "Şirket Logosu ve Özel Markalama (White-Label)",
        "desc": "Selin Yıldız tarafından üstlenilen Şirket Logosu ve Özel Markalama (White-Label) çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-14",
        "dueDate": "2026-07-17",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st274-1",
                "text": "Şirket Logosu ve Özel Markalama (White-Label) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st274-2",
                "text": "Şirket Logosu ve Özel Markalama (White-Label) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c375",
        "key": "TK-375",
        "title": "CI/CD Pipeline Sürelerinin Hızlandırılması",
        "desc": "Caner Öztürk tarafından üstlenilen CI/CD Pipeline Sürelerinin Hızlandırılması çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-13",
        "dueDate": "2026-07-18",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st275-1",
                "text": "CI/CD Pipeline Sürelerinin Hızlandırılması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st275-2",
                "text": "CI/CD Pipeline Sürelerinin Hızlandırılması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c376",
        "key": "TK-376",
        "title": "Bozuk JSON ve Kötü Niyetli İstek Fuzzing Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Bozuk JSON ve Kötü Niyetli İstek Fuzzing Testi çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-14",
        "dueDate": "2026-07-19",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st276-1",
                "text": "Bozuk JSON ve Kötü Niyetli İstek Fuzzing Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st276-2",
                "text": "Bozuk JSON ve Kötü Niyetli İstek Fuzzing Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c377",
        "key": "TK-377",
        "title": "App Store ve Google Play Ekran Görüntüleri",
        "desc": "Emre Aydın tarafından üstlenilen App Store ve Google Play Ekran Görüntüleri çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-13",
        "dueDate": "2026-07-17",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st277-1",
                "text": "App Store ve Google Play Ekran Görüntüleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st277-2",
                "text": "App Store ve Google Play Ekran Görüntüleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c378",
        "key": "TK-378",
        "title": "Pano Aktivite Isı Haritası (Heatmap)",
        "desc": "Gamze Şahin tarafından üstlenilen Pano Aktivite Isı Haritası (Heatmap) çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-14",
        "dueDate": "2026-07-18",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st278-1",
                "text": "Pano Aktivite Isı Haritası (Heatmap) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st278-2",
                "text": "Pano Aktivite Isı Haritası (Heatmap) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c379",
        "key": "TK-379",
        "title": "Üçüncü Taraf Kütüphanelerin Güvenli Sürüm Sabitlemesi",
        "desc": "Tolga Kurt tarafından üstlenilen Üçüncü Taraf Kütüphanelerin Güvenli Sürüm Sabitlemesi çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-13",
        "dueDate": "2026-07-19",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st279-1",
                "text": "Üçüncü Taraf Kütüphanelerin Güvenli Sürüm Sabitlemesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st279-2",
                "text": "Üçüncü Taraf Kütüphanelerin Güvenli Sürüm Sabitlemesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c380",
        "key": "TK-380",
        "title": "Dağıtık İşlem Takibi İçin Jaeger UI Dashboardu",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık İşlem Takibi İçin Jaeger UI Dashboardu çalışması. Sprint 28 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-14",
        "dueDate": "2026-07-17",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st280-1",
                "text": "Dağıtık İşlem Takibi İçin Jaeger UI Dashboardu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st280-2",
                "text": "Dağıtık İşlem Takibi İçin Jaeger UI Dashboardu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm280-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Derya Arslan",
                "createdAt": 1784224800000
            }
        ],
        "epicId": "e7",
        "sprintId": "s28",
        "createdAt": 1783717200000
    },
    {
        "id": "c381",
        "key": "TK-381",
        "title": "Elasticsearch İndeks Tasarımı ve Arama",
        "desc": "Ali Yılmaz tarafından üstlenilen Elasticsearch İndeks Tasarımı ve Arama çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-20",
        "dueDate": "2026-07-24",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st281-1",
                "text": "Elasticsearch İndeks Tasarımı ve Arama - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st281-2",
                "text": "Elasticsearch İndeks Tasarımı ve Arama - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c382",
        "key": "TK-382",
        "title": "Yükleme İskeletleri (Skeleton Loading UI)",
        "desc": "Zeynep Kaya tarafından üstlenilen Yükleme İskeletleri (Skeleton Loading UI) çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-21",
        "dueDate": "2026-07-25",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st282-1",
                "text": "Yükleme İskeletleri (Skeleton Loading UI) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st282-2",
                "text": "Yükleme İskeletleri (Skeleton Loading UI) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c383",
        "key": "TK-383",
        "title": "Pano İçi Toplu Kart Güncelleme Transactionı",
        "desc": "Mehmet Demir tarafından üstlenilen Pano İçi Toplu Kart Güncelleme Transactionı çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-20",
        "dueDate": "2026-07-26",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st283-1",
                "text": "Pano İçi Toplu Kart Güncelleme Transactionı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st283-2",
                "text": "Pano İçi Toplu Kart Güncelleme Transactionı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c384",
        "key": "TK-384",
        "title": "Takım Takvimi Görünümü ve Google Calendar",
        "desc": "Selin Yıldız tarafından üstlenilen Takım Takvimi Görünümü ve Google Calendar çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-21",
        "dueDate": "2026-07-24",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st284-1",
                "text": "Takım Takvimi Görünümü ve Google Calendar - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st284-2",
                "text": "Takım Takvimi Görünümü ve Google Calendar - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c385",
        "key": "TK-385",
        "title": "Chaos Engineering ve Pod Çökme Dayanıklılık Testi",
        "desc": "Caner Öztürk tarafından üstlenilen Chaos Engineering ve Pod Çökme Dayanıklılık Testi çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-20",
        "dueDate": "2026-07-25",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st285-1",
                "text": "Chaos Engineering ve Pod Çökme Dayanıklılık Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st285-2",
                "text": "Chaos Engineering ve Pod Çökme Dayanıklılık Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c386",
        "key": "TK-386",
        "title": "Çok Kiracılı Veri İzolasyonu ve Sızıntı Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Çok Kiracılı Veri İzolasyonu ve Sızıntı Testi çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-21",
        "dueDate": "2026-07-26",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st286-1",
                "text": "Çok Kiracılı Veri İzolasyonu ve Sızıntı Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st286-2",
                "text": "Çok Kiracılı Veri İzolasyonu ve Sızıntı Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c387",
        "key": "TK-387",
        "title": "TestFlight ve Google Internal Test Dağıtımı",
        "desc": "Emre Aydın tarafından üstlenilen TestFlight ve Google Internal Test Dağıtımı çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-20",
        "dueDate": "2026-07-24",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st287-1",
                "text": "TestFlight ve Google Internal Test Dağıtımı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st287-2",
                "text": "TestFlight ve Google Internal Test Dağıtımı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm287-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Emre Aydın",
                "createdAt": 1784829600000
            }
        ],
        "epicId": "e5",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c388",
        "key": "TK-388",
        "title": "Tarihsel Pano Verilerini Sıkıştırma İstatistiği",
        "desc": "Gamze Şahin tarafından üstlenilen Tarihsel Pano Verilerini Sıkıştırma İstatistiği çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-21",
        "dueDate": "2026-07-25",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st288-1",
                "text": "Tarihsel Pano Verilerini Sıkıştırma İstatistiği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st288-2",
                "text": "Tarihsel Pano Verilerini Sıkıştırma İstatistiği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c389",
        "key": "TK-389",
        "title": "DNS Rebinding ve SSRF Savunması",
        "desc": "Tolga Kurt tarafından üstlenilen DNS Rebinding ve SSRF Savunması çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-20",
        "dueDate": "2026-07-26",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st289-1",
                "text": "DNS Rebinding ve SSRF Savunması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st289-2",
                "text": "DNS Rebinding ve SSRF Savunması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c390",
        "key": "TK-390",
        "title": "Büyük Boyutlu Mesajlar İçin Parçalama Servisi",
        "desc": "Derya Arslan tarafından üstlenilen Büyük Boyutlu Mesajlar İçin Parçalama Servisi çalışması. Sprint 29 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-21",
        "dueDate": "2026-07-24",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st290-1",
                "text": "Büyük Boyutlu Mesajlar İçin Parçalama Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st290-2",
                "text": "Büyük Boyutlu Mesajlar İçin Parçalama Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s29",
        "createdAt": 1784322000000
    },
    {
        "id": "c391",
        "key": "TK-391",
        "title": "Düşük Gecikmeli Önbellek Isınma Servisi",
        "desc": "Ali Yılmaz tarafından üstlenilen Düşük Gecikmeli Önbellek Isınma Servisi çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-27",
        "dueDate": "2026-07-31",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st291-1",
                "text": "Düşük Gecikmeli Önbellek Isınma Servisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st291-2",
                "text": "Düşük Gecikmeli Önbellek Isınma Servisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c392",
        "key": "TK-392",
        "title": "Bildirim Açılır Menüsü ve Okundu Durumu",
        "desc": "Zeynep Kaya tarafından üstlenilen Bildirim Açılır Menüsü ve Okundu Durumu çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-28",
        "dueDate": "2026-08-01",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st292-1",
                "text": "Bildirim Açılır Menüsü ve Okundu Durumu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st292-2",
                "text": "Bildirim Açılır Menüsü ve Okundu Durumu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c393",
        "key": "TK-393",
        "title": "Veritabanı İstatistikleri (VACUUM ANALYZE)",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı İstatistikleri (VACUUM ANALYZE) çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-27",
        "dueDate": "2026-08-02",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st293-1",
                "text": "Veritabanı İstatistikleri (VACUUM ANALYZE) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st293-2",
                "text": "Veritabanı İstatistikleri (VACUUM ANALYZE) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c394",
        "key": "TK-394",
        "title": "Görev Kilitleme ve Eşzamanlı Düzenleme Uyarısı",
        "desc": "Selin Yıldız tarafından üstlenilen Görev Kilitleme ve Eşzamanlı Düzenleme Uyarısı çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-28",
        "dueDate": "2026-07-31",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st294-1",
                "text": "Görev Kilitleme ve Eşzamanlı Düzenleme Uyarısı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st294-2",
                "text": "Görev Kilitleme ve Eşzamanlı Düzenleme Uyarısı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm294-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Selin Yıldız",
                "createdAt": 1785434400000
            }
        ],
        "epicId": "e3",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c395",
        "key": "TK-395",
        "title": "Cloudflare CDN Önbellek Temizleme API Entegrasyonu",
        "desc": "Caner Öztürk tarafından üstlenilen Cloudflare CDN Önbellek Temizleme API Entegrasyonu çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-07-27",
        "dueDate": "2026-08-01",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st295-1",
                "text": "Cloudflare CDN Önbellek Temizleme API Entegrasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st295-2",
                "text": "Cloudflare CDN Önbellek Temizleme API Entegrasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c396",
        "key": "TK-396",
        "title": "Yüksek Bellek Tüketimi ve DOM Sızıntısı Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Yüksek Bellek Tüketimi ve DOM Sızıntısı Testi çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-28",
        "dueDate": "2026-08-02",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st296-1",
                "text": "Yüksek Bellek Tüketimi ve DOM Sızıntısı Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st296-2",
                "text": "Yüksek Bellek Tüketimi ve DOM Sızıntısı Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c397",
        "key": "TK-397",
        "title": "Mobil Uygulama Açılış Süresinin İyileştirilmesi",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Uygulama Açılış Süresinin İyileştirilmesi çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-27",
        "dueDate": "2026-07-31",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st297-1",
                "text": "Mobil Uygulama Açılış Süresinin İyileştirilmesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st297-2",
                "text": "Mobil Uygulama Açılış Süresinin İyileştirilmesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c398",
        "key": "TK-398",
        "title": "Clickstream Olayları ile Kullanıcı Tıklama Analitiği",
        "desc": "Gamze Şahin tarafından üstlenilen Clickstream Olayları ile Kullanıcı Tıklama Analitiği çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-28",
        "dueDate": "2026-08-01",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st298-1",
                "text": "Clickstream Olayları ile Kullanıcı Tıklama Analitiği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st298-2",
                "text": "Clickstream Olayları ile Kullanıcı Tıklama Analitiği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c399",
        "key": "TK-399",
        "title": "Clickjacking Koruması ve iframe Kısıtı",
        "desc": "Tolga Kurt tarafından üstlenilen Clickjacking Koruması ve iframe Kısıtı çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-07-27",
        "dueDate": "2026-08-02",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st299-1",
                "text": "Clickjacking Koruması ve iframe Kısıtı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st299-2",
                "text": "Clickjacking Koruması ve iframe Kısıtı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c400",
        "key": "TK-400",
        "title": "Servis Yeniden Başlatma Dayanıklılığı (Graceful Shutdown)",
        "desc": "Derya Arslan tarafından üstlenilen Servis Yeniden Başlatma Dayanıklılığı (Graceful Shutdown) çalışması. Sprint 30 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-07-28",
        "dueDate": "2026-07-31",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st300-1",
                "text": "Servis Yeniden Başlatma Dayanıklılığı (Graceful Shutdown) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st300-2",
                "text": "Servis Yeniden Başlatma Dayanıklılığı (Graceful Shutdown) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s30",
        "createdAt": 1784926800000
    },
    {
        "id": "c401",
        "key": "TK-401",
        "title": "Çöp Toplayıcı ve Bellek Sızıntısı Analizi",
        "desc": "Ali Yılmaz tarafından üstlenilen Çöp Toplayıcı ve Bellek Sızıntısı Analizi çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-03",
        "dueDate": "2026-08-07",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st301-1",
                "text": "Çöp Toplayıcı ve Bellek Sızıntısı Analizi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st301-2",
                "text": "Çöp Toplayıcı ve Bellek Sızıntısı Analizi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm301-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Ali Yılmaz",
                "createdAt": 1786039200000
            }
        ],
        "epicId": "e1",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c402",
        "key": "TK-402",
        "title": "Pano Ayarları ve Kolon Başlığı Düzenleme Modalı",
        "desc": "Zeynep Kaya tarafından üstlenilen Pano Ayarları ve Kolon Başlığı Düzenleme Modalı çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-04",
        "dueDate": "2026-08-08",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st302-1",
                "text": "Pano Ayarları ve Kolon Başlığı Düzenleme Modalı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st302-2",
                "text": "Pano Ayarları ve Kolon Başlığı Düzenleme Modalı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c403",
        "key": "TK-403",
        "title": "Yetkisiz Veri Girişini Önleyen Check Constraint",
        "desc": "Mehmet Demir tarafından üstlenilen Yetkisiz Veri Girişini Önleyen Check Constraint çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-03",
        "dueDate": "2026-08-09",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st303-1",
                "text": "Yetkisiz Veri Girişini Önleyen Check Constraint - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st303-2",
                "text": "Yetkisiz Veri Girişini Önleyen Check Constraint - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c404",
        "key": "TK-404",
        "title": "Slack ve Microsoft Teams Pano Bildirim Botu",
        "desc": "Selin Yıldız tarafından üstlenilen Slack ve Microsoft Teams Pano Bildirim Botu çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-04",
        "dueDate": "2026-08-07",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st304-1",
                "text": "Slack ve Microsoft Teams Pano Bildirim Botu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st304-2",
                "text": "Slack ve Microsoft Teams Pano Bildirim Botu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c405",
        "key": "TK-405",
        "title": "Kubernetes Küme Sağlığı Uyarıları",
        "desc": "Caner Öztürk tarafından üstlenilen Kubernetes Küme Sağlığı Uyarıları çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-03",
        "dueDate": "2026-08-08",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st305-1",
                "text": "Kubernetes Küme Sağlığı Uyarıları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st305-2",
                "text": "Kubernetes Küme Sağlığı Uyarıları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c406",
        "key": "TK-406",
        "title": "Klavye Kısayolları Odak Gezinme Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Klavye Kısayolları Odak Gezinme Testi çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-04",
        "dueDate": "2026-08-09",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st306-1",
                "text": "Klavye Kısayolları Odak Gezinme Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st306-2",
                "text": "Klavye Kısayolları Odak Gezinme Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c407",
        "key": "TK-407",
        "title": "Dinamik Yazı Tipi Boyutu Erişilebilirliği",
        "desc": "Emre Aydın tarafından üstlenilen Dinamik Yazı Tipi Boyutu Erişilebilirliği çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-03",
        "dueDate": "2026-08-07",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st307-1",
                "text": "Dinamik Yazı Tipi Boyutu Erişilebilirliği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st307-2",
                "text": "Dinamik Yazı Tipi Boyutu Erişilebilirliği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c408",
        "key": "TK-408",
        "title": "Pano Şablonu Başarı Oranı ve Popülerlik Raporu",
        "desc": "Gamze Şahin tarafından üstlenilen Pano Şablonu Başarı Oranı ve Popülerlik Raporu çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-04",
        "dueDate": "2026-08-08",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st308-1",
                "text": "Pano Şablonu Başarı Oranı ve Popülerlik Raporu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st308-2",
                "text": "Pano Şablonu Başarı Oranı ve Popülerlik Raporu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm308-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Gamze Şahin",
                "createdAt": 1786125600000
            }
        ],
        "epicId": "e8",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c409",
        "key": "TK-409",
        "title": "Çift Aşamalı Doğrulama (2FA) SMS ve TOTP Mimarisi",
        "desc": "Tolga Kurt tarafından üstlenilen Çift Aşamalı Doğrulama (2FA) SMS ve TOTP Mimarisi çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-03",
        "dueDate": "2026-08-09",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st309-1",
                "text": "Çift Aşamalı Doğrulama (2FA) SMS ve TOTP Mimarisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st309-2",
                "text": "Çift Aşamalı Doğrulama (2FA) SMS ve TOTP Mimarisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c410",
        "key": "TK-410",
        "title": "Coğrafi Dağıtık Kullanıcılar İçin Anycast Routing",
        "desc": "Derya Arslan tarafından üstlenilen Coğrafi Dağıtık Kullanıcılar İçin Anycast Routing çalışması. Sprint 31 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-04",
        "dueDate": "2026-08-07",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st310-1",
                "text": "Coğrafi Dağıtık Kullanıcılar İçin Anycast Routing - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st310-2",
                "text": "Coğrafi Dağıtık Kullanıcılar İçin Anycast Routing - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s31",
        "createdAt": 1785531600000
    },
    {
        "id": "c411",
        "key": "TK-411",
        "title": "Yüksek Trafik Dayanıklılığı Simülasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen Yüksek Trafik Dayanıklılığı Simülasyonu çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-10",
        "dueDate": "2026-08-14",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st311-1",
                "text": "Yüksek Trafik Dayanıklılığı Simülasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st311-2",
                "text": "Yüksek Trafik Dayanıklılığı Simülasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c412",
        "key": "TK-412",
        "title": "Çoklu Kart Seçimi ve Toplu Taşıma/Silme",
        "desc": "Zeynep Kaya tarafından üstlenilen Çoklu Kart Seçimi ve Toplu Taşıma/Silme çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-11",
        "dueDate": "2026-08-15",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st312-1",
                "text": "Çoklu Kart Seçimi ve Toplu Taşıma/Silme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st312-2",
                "text": "Çoklu Kart Seçimi ve Toplu Taşıma/Silme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c413",
        "key": "TK-413",
        "title": "Veri Şifreleme (pgcrypto) ile Alan Koruması",
        "desc": "Mehmet Demir tarafından üstlenilen Veri Şifreleme (pgcrypto) ile Alan Koruması çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-10",
        "dueDate": "2026-08-16",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st313-1",
                "text": "Veri Şifreleme (pgcrypto) ile Alan Koruması - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st313-2",
                "text": "Veri Şifreleme (pgcrypto) ile Alan Koruması - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c414",
        "key": "TK-414",
        "title": "Görev Değerlendirme Puanı ve Memnuniyet Anketi",
        "desc": "Selin Yıldız tarafından üstlenilen Görev Değerlendirme Puanı ve Memnuniyet Anketi çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-11",
        "dueDate": "2026-08-14",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st314-1",
                "text": "Görev Değerlendirme Puanı ve Memnuniyet Anketi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st314-2",
                "text": "Görev Değerlendirme Puanı ve Memnuniyet Anketi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c415",
        "key": "TK-415",
        "title": "Felaket Kurtarma Otomatik Yük Devretme",
        "desc": "Caner Öztürk tarafından üstlenilen Felaket Kurtarma Otomatik Yük Devretme çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-10",
        "dueDate": "2026-08-15",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st315-1",
                "text": "Felaket Kurtarma Otomatik Yük Devretme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st315-2",
                "text": "Felaket Kurtarma Otomatik Yük Devretme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm315-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Caner Öztürk",
                "createdAt": 1786730400000
            }
        ],
        "epicId": "e6",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c416",
        "key": "TK-416",
        "title": "Çerez ve Oturum Zaman Aşımı Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Çerez ve Oturum Zaman Aşımı Testi çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-11",
        "dueDate": "2026-08-16",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st316-1",
                "text": "Çerez ve Oturum Zaman Aşımı Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st316-2",
                "text": "Çerez ve Oturum Zaman Aşımı Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c417",
        "key": "TK-417",
        "title": "Mobil Kullanıcı Yorum Yazma ve Ses Kaydı",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Kullanıcı Yorum Yazma ve Ses Kaydı çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-10",
        "dueDate": "2026-08-14",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st317-1",
                "text": "Mobil Kullanıcı Yorum Yazma ve Ses Kaydı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st317-2",
                "text": "Mobil Kullanıcı Yorum Yazma ve Ses Kaydı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c418",
        "key": "TK-418",
        "title": "Görev Boyutlarına (Story Points) Göre Başarı",
        "desc": "Gamze Şahin tarafından üstlenilen Görev Boyutlarına (Story Points) Göre Başarı çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-11",
        "dueDate": "2026-08-15",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st318-1",
                "text": "Görev Boyutlarına (Story Points) Göre Başarı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st318-2",
                "text": "Görev Boyutlarına (Story Points) Göre Başarı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c419",
        "key": "TK-419",
        "title": "API Hız Aşımında IP Otomatik Ban ve Güvenlik Duvarı",
        "desc": "Tolga Kurt tarafından üstlenilen API Hız Aşımında IP Otomatik Ban ve Güvenlik Duvarı çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-10",
        "dueDate": "2026-08-16",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st319-1",
                "text": "API Hız Aşımında IP Otomatik Ban ve Güvenlik Duvarı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st319-2",
                "text": "API Hız Aşımında IP Otomatik Ban ve Güvenlik Duvarı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c420",
        "key": "TK-420",
        "title": "Olay Şeması Evrimi (Schema Registry)",
        "desc": "Derya Arslan tarafından üstlenilen Olay Şeması Evrimi (Schema Registry) çalışması. Sprint 32 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-11",
        "dueDate": "2026-08-14",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st320-1",
                "text": "Olay Şeması Evrimi (Schema Registry) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st320-2",
                "text": "Olay Şeması Evrimi (Schema Registry) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s32",
        "createdAt": 1786136400000
    },
    {
        "id": "c421",
        "key": "TK-421",
        "title": "Zero-Downtime Şema Migrasyon Stratejisi",
        "desc": "Ali Yılmaz tarafından üstlenilen Zero-Downtime Şema Migrasyon Stratejisi çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-17",
        "dueDate": "2026-08-21",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st321-1",
                "text": "Zero-Downtime Şema Migrasyon Stratejisi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st321-2",
                "text": "Zero-Downtime Şema Migrasyon Stratejisi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c422",
        "key": "TK-422",
        "title": "Kart Geçmişi Zaman Çizelgesi Tasarımı",
        "desc": "Zeynep Kaya tarafından üstlenilen Kart Geçmişi Zaman Çizelgesi Tasarımı çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-18",
        "dueDate": "2026-08-22",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st322-1",
                "text": "Kart Geçmişi Zaman Çizelgesi Tasarımı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st322-2",
                "text": "Kart Geçmişi Zaman Çizelgesi Tasarımı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm322-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Zeynep Kaya",
                "createdAt": 1787335200000
            }
        ],
        "epicId": "e4",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c423",
        "key": "TK-423",
        "title": "API İstek Günlükleri Tablosu TTL Temizliği",
        "desc": "Mehmet Demir tarafından üstlenilen API İstek Günlükleri Tablosu TTL Temizliği çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-17",
        "dueDate": "2026-08-23",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st323-1",
                "text": "API İstek Günlükleri Tablosu TTL Temizliği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st323-2",
                "text": "API İstek Günlükleri Tablosu TTL Temizliği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c424",
        "key": "TK-424",
        "title": "Kart İçi Kontrol Listesi Şablonları",
        "desc": "Selin Yıldız tarafından üstlenilen Kart İçi Kontrol Listesi Şablonları çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-18",
        "dueDate": "2026-08-21",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st324-1",
                "text": "Kart İçi Kontrol Listesi Şablonları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st324-2",
                "text": "Kart İçi Kontrol Listesi Şablonları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c425",
        "key": "TK-425",
        "title": "Linux Çekirdek Parametreleri Ağ Optimizasyonu",
        "desc": "Caner Öztürk tarafından üstlenilen Linux Çekirdek Parametreleri Ağ Optimizasyonu çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-17",
        "dueDate": "2026-08-22",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st325-1",
                "text": "Linux Çekirdek Parametreleri Ağ Optimizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st325-2",
                "text": "Linux Çekirdek Parametreleri Ağ Optimizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c426",
        "key": "TK-426",
        "title": "API Yanıt Süresi Regresyon Dedektörü",
        "desc": "Burcu Çelik tarafından üstlenilen API Yanıt Süresi Regresyon Dedektörü çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-18",
        "dueDate": "2026-08-23",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st326-1",
                "text": "API Yanıt Süresi Regresyon Dedektörü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st326-2",
                "text": "API Yanıt Süresi Regresyon Dedektörü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c427",
        "key": "TK-427",
        "title": "Kart Önceliği Seçmek İçin Mobil Tekerlek",
        "desc": "Emre Aydın tarafından üstlenilen Kart Önceliği Seçmek İçin Mobil Tekerlek çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-17",
        "dueDate": "2026-08-21",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st327-1",
                "text": "Kart Önceliği Seçmek İçin Mobil Tekerlek - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st327-2",
                "text": "Kart Önceliği Seçmek İçin Mobil Tekerlek - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c428",
        "key": "TK-428",
        "title": "Dış Servis Webhook İstek Başarı Metrikleri",
        "desc": "Gamze Şahin tarafından üstlenilen Dış Servis Webhook İstek Başarı Metrikleri çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-18",
        "dueDate": "2026-08-22",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st328-1",
                "text": "Dış Servis Webhook İstek Başarı Metrikleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st328-2",
                "text": "Dış Servis Webhook İstek Başarı Metrikleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c429",
        "key": "TK-429",
        "title": "Veri Tabanı Kullanıcı Yetkilerinin En Az İzin Kuralı",
        "desc": "Tolga Kurt tarafından üstlenilen Veri Tabanı Kullanıcı Yetkilerinin En Az İzin Kuralı çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-17",
        "dueDate": "2026-08-23",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st329-1",
                "text": "Veri Tabanı Kullanıcı Yetkilerinin En Az İzin Kuralı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st329-2",
                "text": "Veri Tabanı Kullanıcı Yetkilerinin En Az İzin Kuralı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm329-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Tolga Kurt",
                "createdAt": 1787421600000
            }
        ],
        "epicId": "e1",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c430",
        "key": "TK-430",
        "title": "Dağıtık Durum Makinesi (Raft Consensus) Denemesi",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Durum Makinesi (Raft Consensus) Denemesi çalışması. Sprint 33 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-18",
        "dueDate": "2026-08-21",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st330-1",
                "text": "Dağıtık Durum Makinesi (Raft Consensus) Denemesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st330-2",
                "text": "Dağıtık Durum Makinesi (Raft Consensus) Denemesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s33",
        "createdAt": 1786741200000
    },
    {
        "id": "c431",
        "key": "TK-431",
        "title": "API Yanıt Sıkıştırma (Brotli/Gzip)",
        "desc": "Ali Yılmaz tarafından üstlenilen API Yanıt Sıkıştırma (Brotli/Gzip) çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-24",
        "dueDate": "2026-08-28",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 15,
        "subtasks": [
            {
                "id": "st331-1",
                "text": "API Yanıt Sıkıştırma (Brotli/Gzip) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st331-2",
                "text": "API Yanıt Sıkıştırma (Brotli/Gzip) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c432",
        "key": "TK-432",
        "title": "Dokunmatik Cihazlar İçin Swipe Jestleri",
        "desc": "Zeynep Kaya tarafından üstlenilen Dokunmatik Cihazlar İçin Swipe Jestleri çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-25",
        "dueDate": "2026-08-29",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st332-1",
                "text": "Dokunmatik Cihazlar İçin Swipe Jestleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st332-2",
                "text": "Dokunmatik Cihazlar İçin Swipe Jestleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c433",
        "key": "TK-433",
        "title": "Dashboard İçin Materialized View Kurulumu",
        "desc": "Mehmet Demir tarafından üstlenilen Dashboard İçin Materialized View Kurulumu çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-24",
        "dueDate": "2026-08-30",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st333-1",
                "text": "Dashboard İçin Materialized View Kurulumu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st333-2",
                "text": "Dashboard İçin Materialized View Kurulumu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c434",
        "key": "TK-434",
        "title": "Pano Düzeyi İstatistik Özeti",
        "desc": "Selin Yıldız tarafından üstlenilen Pano Düzeyi İstatistik Özeti çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-25",
        "dueDate": "2026-08-28",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st334-1",
                "text": "Pano Düzeyi İstatistik Özeti - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st334-2",
                "text": "Pano Düzeyi İstatistik Özeti - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c435",
        "key": "TK-435",
        "title": "Docker Compose Geliştirici Ortamı Kurulumu",
        "desc": "Caner Öztürk tarafından üstlenilen Docker Compose Geliştirici Ortamı Kurulumu çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-24",
        "dueDate": "2026-08-29",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st335-1",
                "text": "Docker Compose Geliştirici Ortamı Kurulumu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st335-2",
                "text": "Docker Compose Geliştirici Ortamı Kurulumu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c436",
        "key": "TK-436",
        "title": "Canlı Veritabanı Şema Güncellemesi Kesintisiz Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Canlı Veritabanı Şema Güncellemesi Kesintisiz Testi çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-25",
        "dueDate": "2026-08-30",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st336-1",
                "text": "Canlı Veritabanı Şema Güncellemesi Kesintisiz Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st336-2",
                "text": "Canlı Veritabanı Şema Güncellemesi Kesintisiz Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm336-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Burcu Çelik",
                "createdAt": 1788026400000
            }
        ],
        "epicId": "e9",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c437",
        "key": "TK-437",
        "title": "Mobil Çevrimdışı Çakışma Çözümü",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Çevrimdışı Çakışma Çözümü çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-24",
        "dueDate": "2026-08-28",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 21,
        "subtasks": [
            {
                "id": "st337-1",
                "text": "Mobil Çevrimdışı Çakışma Çözümü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st337-2",
                "text": "Mobil Çevrimdışı Çakışma Çözümü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c438",
        "key": "TK-438",
        "title": "Müşteri Destek Talepleri ve Çözüm Analitiği",
        "desc": "Gamze Şahin tarafından üstlenilen Müşteri Destek Talepleri ve Çözüm Analitiği çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-25",
        "dueDate": "2026-08-29",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st338-1",
                "text": "Müşteri Destek Talepleri ve Çözüm Analitiği - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st338-2",
                "text": "Müşteri Destek Talepleri ve Çözüm Analitiği - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c439",
        "key": "TK-439",
        "title": "Şifreli İletişim İçin Dahili mTLS Altyapısı",
        "desc": "Tolga Kurt tarafından üstlenilen Şifreli İletişim İçin Dahili mTLS Altyapısı çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-24",
        "dueDate": "2026-08-30",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st339-1",
                "text": "Şifreli İletişim İçin Dahili mTLS Altyapısı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st339-2",
                "text": "Şifreli İletişim İçin Dahili mTLS Altyapısı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c440",
        "key": "TK-440",
        "title": "Aşırı Yük Koruması: İstek Düşürme (Load Shedding)",
        "desc": "Derya Arslan tarafından üstlenilen Aşırı Yük Koruması: İstek Düşürme (Load Shedding) çalışması. Sprint 34 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-25",
        "dueDate": "2026-08-28",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st340-1",
                "text": "Aşırı Yük Koruması: İstek Düşürme (Load Shedding) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st340-2",
                "text": "Aşırı Yük Koruması: İstek Düşürme (Load Shedding) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s34",
        "createdAt": 1787346000000
    },
    {
        "id": "c441",
        "key": "TK-441",
        "title": "IP İtibar Kontrolü ve Şüpheli Giriş Engelleme",
        "desc": "Ali Yılmaz tarafından üstlenilen IP İtibar Kontrolü ve Şüpheli Giriş Engelleme çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-31",
        "dueDate": "2026-09-04",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st341-1",
                "text": "IP İtibar Kontrolü ve Şüpheli Giriş Engelleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st341-2",
                "text": "IP İtibar Kontrolü ve Şüpheli Giriş Engelleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c442",
        "key": "TK-442",
        "title": "Yazdırma Stilleri (Print CSS) ve PDF Düzeni",
        "desc": "Zeynep Kaya tarafından üstlenilen Yazdırma Stilleri (Print CSS) ve PDF Düzeni çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-01",
        "dueDate": "2026-09-05",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st342-1",
                "text": "Yazdırma Stilleri (Print CSS) ve PDF Düzeni - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st342-2",
                "text": "Yazdırma Stilleri (Print CSS) ve PDF Düzeni - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c443",
        "key": "TK-443",
        "title": "Materialized View Otomatik Yenileme Triggerları",
        "desc": "Mehmet Demir tarafından üstlenilen Materialized View Otomatik Yenileme Triggerları çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-31",
        "dueDate": "2026-09-06",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st343-1",
                "text": "Materialized View Otomatik Yenileme Triggerları - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st343-2",
                "text": "Materialized View Otomatik Yenileme Triggerları - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm343-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Mehmet Demir",
                "createdAt": 1788631200000
            }
        ],
        "epicId": "e7",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c444",
        "key": "TK-444",
        "title": "Kullanıcı Geri Bildirim ve Destek Formu",
        "desc": "Selin Yıldız tarafından üstlenilen Kullanıcı Geri Bildirim ve Destek Formu çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-01",
        "dueDate": "2026-09-04",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st344-1",
                "text": "Kullanıcı Geri Bildirim ve Destek Formu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st344-2",
                "text": "Kullanıcı Geri Bildirim ve Destek Formu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c445",
        "key": "TK-445",
        "title": "OpenTelemetry Dağıtık İzleme ve Jaeger",
        "desc": "Caner Öztürk tarafından üstlenilen OpenTelemetry Dağıtık İzleme ve Jaeger çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-08-31",
        "dueDate": "2026-09-05",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st345-1",
                "text": "OpenTelemetry Dağıtık İzleme ve Jaeger - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st345-2",
                "text": "OpenTelemetry Dağıtık İzleme ve Jaeger - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c446",
        "key": "TK-446",
        "title": "Ekran Okuyucu Erişilebilirlik Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Ekran Okuyucu Erişilebilirlik Testi çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-01",
        "dueDate": "2026-09-06",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 23,
        "subtasks": [
            {
                "id": "st346-1",
                "text": "Ekran Okuyucu Erişilebilirlik Testi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st346-2",
                "text": "Ekran Okuyucu Erişilebilirlik Testi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c447",
        "key": "TK-447",
        "title": "Uygulama İçi Bildirim Rozetleri Yönetimi",
        "desc": "Emre Aydın tarafından üstlenilen Uygulama İçi Bildirim Rozetleri Yönetimi çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-08-31",
        "dueDate": "2026-09-04",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st347-1",
                "text": "Uygulama İçi Bildirim Rozetleri Yönetimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st347-2",
                "text": "Uygulama İçi Bildirim Rozetleri Yönetimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c448",
        "key": "TK-448",
        "title": "Yönetim Kurulu İçin Çeyreklik Performans Özeti",
        "desc": "Gamze Şahin tarafından üstlenilen Yönetim Kurulu İçin Çeyreklik Performans Özeti çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-01",
        "dueDate": "2026-09-05",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st348-1",
                "text": "Yönetim Kurulu İçin Çeyreklik Performans Özeti - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st348-2",
                "text": "Yönetim Kurulu İçin Çeyreklik Performans Özeti - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c449",
        "key": "TK-449",
        "title": "Güvenli Yazılım Geliştirme Yaşam Döngüsü (SSDLC)",
        "desc": "Tolga Kurt tarafından üstlenilen Güvenli Yazılım Geliştirme Yaşam Döngüsü (SSDLC) çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-08-31",
        "dueDate": "2026-09-06",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 25,
        "subtasks": [
            {
                "id": "st349-1",
                "text": "Güvenli Yazılım Geliştirme Yaşam Döngüsü (SSDLC) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st349-2",
                "text": "Güvenli Yazılım Geliştirme Yaşam Döngüsü (SSDLC) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c450",
        "key": "TK-450",
        "title": "Dağıtık Log İndeksleme ve Eşzamanlı Arama Motoru",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Log İndeksleme ve Eşzamanlı Arama Motoru çalışması. Sprint 35 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-01",
        "dueDate": "2026-09-04",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st350-1",
                "text": "Dağıtık Log İndeksleme ve Eşzamanlı Arama Motoru - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st350-2",
                "text": "Dağıtık Log İndeksleme ve Eşzamanlı Arama Motoru - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm350-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Derya Arslan",
                "createdAt": 1788458400000
            }
        ],
        "epicId": "e4",
        "sprintId": "s35",
        "createdAt": 1787950800000
    },
    {
        "id": "c451",
        "key": "TK-451",
        "title": "Oturum Sonlandırma ve Dağıtık Token Kara Listesi",
        "desc": "Ali Yılmaz tarafından üstlenilen Oturum Sonlandırma ve Dağıtık Token Kara Listesi çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "done",
        "startDate": "2026-09-07",
        "dueDate": "2026-09-11",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 14,
        "subtasks": [
            {
                "id": "st351-1",
                "text": "Oturum Sonlandırma ve Dağıtık Token Kara Listesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st351-2",
                "text": "Oturum Sonlandırma ve Dağıtık Token Kara Listesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c452",
        "key": "TK-452",
        "title": "Ekran Okuyucu (Screen Reader) ARIA Denetimi",
        "desc": "Zeynep Kaya tarafından üstlenilen Ekran Okuyucu (Screen Reader) ARIA Denetimi çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-08",
        "dueDate": "2026-09-12",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st352-1",
                "text": "Ekran Okuyucu (Screen Reader) ARIA Denetimi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st352-2",
                "text": "Ekran Okuyucu (Screen Reader) ARIA Denetimi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c453",
        "key": "TK-453",
        "title": "Veritabanı Disk I/O ve IOPS Optimizasyonu",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Disk I/O ve IOPS Optimizasyonu çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-07",
        "dueDate": "2026-09-13",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st353-1",
                "text": "Veritabanı Disk I/O ve IOPS Optimizasyonu - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st353-2",
                "text": "Veritabanı Disk I/O ve IOPS Optimizasyonu - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c454",
        "key": "TK-454",
        "title": "Kurumsal Fatura ve Abonelik Yönetimi Ekranı",
        "desc": "Selin Yıldız tarafından üstlenilen Kurumsal Fatura ve Abonelik Yönetimi Ekranı çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-08",
        "dueDate": "2026-09-11",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st354-1",
                "text": "Kurumsal Fatura ve Abonelik Yönetimi Ekranı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st354-2",
                "text": "Kurumsal Fatura ve Abonelik Yönetimi Ekranı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c455",
        "key": "TK-455",
        "title": "Container Güvenlik Taraması (Trivy)",
        "desc": "Caner Öztürk tarafından üstlenilen Container Güvenlik Taraması (Trivy) çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "done",
        "startDate": "2026-09-07",
        "dueDate": "2026-09-12",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 19,
        "subtasks": [
            {
                "id": "st355-1",
                "text": "Container Güvenlik Taraması (Trivy) - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st355-2",
                "text": "Container Güvenlik Taraması (Trivy) - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c456",
        "key": "TK-456",
        "title": "Test Verisi Tohumlama ve Temizlik Betikleri",
        "desc": "Burcu Çelik tarafından üstlenilen Test Verisi Tohumlama ve Temizlik Betikleri çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-08",
        "dueDate": "2026-09-13",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st356-1",
                "text": "Test Verisi Tohumlama ve Temizlik Betikleri - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st356-2",
                "text": "Test Verisi Tohumlama ve Temizlik Betikleri - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c457",
        "key": "TK-457",
        "title": "Mobil Bellek Kullanımı ve İmaj Önbellekleme",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Bellek Kullanımı ve İmaj Önbellekleme çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-07",
        "dueDate": "2026-09-11",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st357-1",
                "text": "Mobil Bellek Kullanımı ve İmaj Önbellekleme - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st357-2",
                "text": "Mobil Bellek Kullanımı ve İmaj Önbellekleme - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm357-1",
                "text": "Görev planlanan süre içerisinde başarıyla tamamlandı. İnceleme onaylandı.",
                "author": "Emre Aydın",
                "createdAt": 1789063200000
            }
        ],
        "epicId": "e2",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c458",
        "key": "TK-458",
        "title": "Veri Ambarı (BigQuery) ETL Pipeline Fizibilitesi",
        "desc": "Gamze Şahin tarafından üstlenilen Veri Ambarı (BigQuery) ETL Pipeline Fizibilitesi çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-08",
        "dueDate": "2026-09-12",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 17,
        "subtasks": [
            {
                "id": "st358-1",
                "text": "Veri Ambarı (BigQuery) ETL Pipeline Fizibilitesi - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st358-2",
                "text": "Veri Ambarı (BigQuery) ETL Pipeline Fizibilitesi - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c459",
        "key": "TK-459",
        "title": "Kriptografik Anahtarların Yıllık Rotasyon Planı",
        "desc": "Tolga Kurt tarafından üstlenilen Kriptografik Anahtarların Yıllık Rotasyon Planı çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-07",
        "dueDate": "2026-09-13",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 26,
        "subtasks": [
            {
                "id": "st359-1",
                "text": "Kriptografik Anahtarların Yıllık Rotasyon Planı - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st359-2",
                "text": "Kriptografik Anahtarların Yıllık Rotasyon Planı - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c460",
        "key": "TK-460",
        "title": "Küresel CDN Kenar Düğümleri ile Servis Köprüsü",
        "desc": "Derya Arslan tarafından üstlenilen Küresel CDN Kenar Düğümleri ile Servis Köprüsü çalışması. Sprint 36 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "done",
        "startDate": "2026-09-08",
        "dueDate": "2026-09-11",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 22,
        "subtasks": [
            {
                "id": "st360-1",
                "text": "Küresel CDN Kenar Düğümleri ile Servis Köprüsü - Teknik analiz ve planlama tamamlandı",
                "done": true
            },
            {
                "id": "st360-2",
                "text": "Küresel CDN Kenar Düğümleri ile Servis Köprüsü - Uygulama ve testler tamamlandı",
                "done": true
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s36",
        "createdAt": 1788555600000
    },
    {
        "id": "c461",
        "key": "TK-461",
        "title": "Çekirdek API v2 Refactoring ve Mikro-Optimizasyonlar",
        "desc": "Ali Yılmaz tarafından üstlenilen Çekirdek API v2 Refactoring ve Mikro-Optimizasyonlar çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-18",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 16,
        "subtasks": [
            {
                "id": "st361-1",
                "text": "Çekirdek geliştirmeler tamamlandı",
                "done": true
            },
            {
                "id": "st361-2",
                "text": "Kod incelemesi ve doğrulama tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm361-1",
                "text": "Sprint 37 başında tamamlandı ve canlıya hazır.",
                "author": "Ali Yılmaz",
                "createdAt": 1789471800000
            }
        ],
        "epicId": "e7",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c462",
        "key": "TK-462",
        "title": "Aktif Sprint Kartvizitleri ve Mikro Etkileşimler",
        "desc": "Zeynep Kaya tarafından üstlenilen Aktif Sprint Kartvizitleri ve Mikro Etkileşimler çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-19",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 20,
        "subtasks": [
            {
                "id": "st362-1",
                "text": "Çekirdek geliştirmeler tamamlandı",
                "done": true
            },
            {
                "id": "st362-2",
                "text": "Kod incelemesi ve doğrulama tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm362-1",
                "text": "Sprint 37 başında tamamlandı ve canlıya hazır.",
                "author": "Zeynep Kaya",
                "createdAt": 1789471800000
            }
        ],
        "epicId": "e8",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c463",
        "key": "TK-463",
        "title": "Çekirdek Kart ve Kolon Sorguları İndeks Profillemesi",
        "desc": "Mehmet Demir tarafından üstlenilen Çekirdek Kart ve Kolon Sorguları İndeks Profillemesi çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-20",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 24,
        "subtasks": [
            {
                "id": "st363-1",
                "text": "Çekirdek geliştirmeler tamamlandı",
                "done": true
            },
            {
                "id": "st363-2",
                "text": "Kod incelemesi ve doğrulama tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm363-1",
                "text": "Sprint 37 başında tamamlandı ve canlıya hazır.",
                "author": "Mehmet Demir",
                "createdAt": 1789471800000
            }
        ],
        "epicId": "e9",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c464",
        "key": "TK-464",
        "title": "Haftalık Pano Deneyimi ve Efor Dağılımı İyileştirmesi",
        "desc": "Selin Yıldız tarafından üstlenilen Haftalık Pano Deneyimi ve Efor Dağılımı İyileştirmesi çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "high",
        "col": "done",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-18",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 18,
        "subtasks": [
            {
                "id": "st364-1",
                "text": "Çekirdek geliştirmeler tamamlandı",
                "done": true
            },
            {
                "id": "st364-2",
                "text": "Kod incelemesi ve doğrulama tamamlandı",
                "done": true
            }
        ],
        "comments": [
            {
                "id": "cm364-1",
                "text": "Sprint 37 başında tamamlandı ve canlıya hazır.",
                "author": "Selin Yıldız",
                "createdAt": 1789471800000
            }
        ],
        "epicId": "e10",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c465",
        "key": "TK-465",
        "title": "Cloudflare D1 Canlı Küme ve Edge Önbellek Sağlığı",
        "desc": "Caner Öztürk tarafından üstlenilen Cloudflare D1 Canlı Küme ve Edge Önbellek Sağlığı çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "high",
        "col": "doing",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-19",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 10,
        "subtasks": [
            {
                "id": "st365-1",
                "text": "İlk aşama test ve geliştirmeler tamamlandı",
                "done": true
            },
            {
                "id": "st365-2",
                "text": "İkinci aşama devam ediyor",
                "done": false
            }
        ],
        "comments": [
            {
                "id": "cm365-1",
                "text": "Sprint 37 kapsamında üzerinde çalışılıyor, %50 tamamlandı.",
                "author": "Caner Öztürk",
                "createdAt": 1789545600000
            }
        ],
        "epicId": "e1",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c466",
        "key": "TK-466",
        "title": "100 Aşamalı Güvenlik ve Doğrulama Regresyon Paketi",
        "desc": "Burcu Çelik tarafından üstlenilen 100 Aşamalı Güvenlik ve Doğrulama Regresyon Paketi çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "doing",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-20",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 12,
        "subtasks": [
            {
                "id": "st366-1",
                "text": "İlk aşama test ve geliştirmeler tamamlandı",
                "done": true
            },
            {
                "id": "st366-2",
                "text": "İkinci aşama devam ediyor",
                "done": false
            }
        ],
        "comments": [
            {
                "id": "cm366-1",
                "text": "Sprint 37 kapsamında üzerinde çalışılıyor, %50 tamamlandı.",
                "author": "Burcu Çelik",
                "createdAt": 1789545600000
            }
        ],
        "epicId": "e2",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c467",
        "key": "TK-467",
        "title": "React Native v0.76 Yeni Mimari (Fabric) Geçişi",
        "desc": "Emre Aydın tarafından üstlenilen React Native v0.76 Yeni Mimari (Fabric) Geçişi çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "high",
        "col": "doing",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-18",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 11,
        "subtasks": [
            {
                "id": "st367-1",
                "text": "İlk aşama test ve geliştirmeler tamamlandı",
                "done": true
            },
            {
                "id": "st367-2",
                "text": "İkinci aşama devam ediyor",
                "done": false
            }
        ],
        "comments": [
            {
                "id": "cm367-1",
                "text": "Sprint 37 kapsamında üzerinde çalışılıyor, %50 tamamlandı.",
                "author": "Emre Aydın",
                "createdAt": 1789545600000
            }
        ],
        "epicId": "e3",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c468",
        "key": "TK-468",
        "title": "52 Haftalık Hız ve Efor Gerçekleşme Analitiği",
        "desc": "Gamze Şahin tarafından üstlenilen 52 Haftalık Hız ve Efor Gerçekleşme Analitiği çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-19",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st368-1",
                "text": "Gereksinimler belirlenecek",
                "done": false
            },
            {
                "id": "st368-2",
                "text": "Uygulamaya başlanacak",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c469",
        "key": "TK-469",
        "title": "100 Aşamalı DevSecOps ve Güvenlik Doğrulama Testi",
        "desc": "Tolga Kurt tarafından üstlenilen 100 Aşamalı DevSecOps ve Güvenlik Doğrulama Testi çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-14",
        "dueDate": "2026-09-20",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st369-1",
                "text": "Gereksinimler belirlenecek",
                "done": false
            },
            {
                "id": "st369-2",
                "text": "Uygulamaya başlanacak",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c470",
        "key": "TK-470",
        "title": "Multi-Region Veri Senkronizasyonu ve Akış Doğrulaması",
        "desc": "Derya Arslan tarafından üstlenilen Multi-Region Veri Senkronizasyonu ve Akış Doğrulaması çalışması. Sprint 37 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-15",
        "dueDate": "2026-09-18",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st370-1",
                "text": "Gereksinimler belirlenecek",
                "done": false
            },
            {
                "id": "st370-2",
                "text": "Uygulamaya başlanacak",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s37",
        "createdAt": 1789160400000
    },
    {
        "id": "c471",
        "key": "TK-471",
        "title": "AI Destekli Kod İnceleme Entegrasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen AI Destekli Kod İnceleme Entegrasyonu çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-09-21",
        "dueDate": "2026-09-25",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st371-1",
                "text": "AI Destekli Kod İnceleme Entegrasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st371-2",
                "text": "AI Destekli Kod İnceleme Entegrasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c472",
        "key": "TK-472",
        "title": "AI Görev Özeti Görsel Popoverı",
        "desc": "Zeynep Kaya tarafından üstlenilen AI Görev Özeti Görsel Popoverı çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-22",
        "dueDate": "2026-09-26",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st372-1",
                "text": "AI Görev Özeti Görsel Popoverı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st372-2",
                "text": "AI Görev Özeti Görsel Popoverı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c473",
        "key": "TK-473",
        "title": "Vektör Veritabanı (pgvector) Semantik Arama",
        "desc": "Mehmet Demir tarafından üstlenilen Vektör Veritabanı (pgvector) Semantik Arama çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-09-21",
        "dueDate": "2026-09-27",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st373-1",
                "text": "Vektör Veritabanı (pgvector) Semantik Arama - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st373-2",
                "text": "Vektör Veritabanı (pgvector) Semantik Arama - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c474",
        "key": "TK-474",
        "title": "AI Destekli Görev Başlığı ve Açıklama Önerisi",
        "desc": "Selin Yıldız tarafından üstlenilen AI Destekli Görev Başlığı ve Açıklama Önerisi çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-22",
        "dueDate": "2026-09-25",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st374-1",
                "text": "AI Destekli Görev Başlığı ve Açıklama Önerisi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st374-2",
                "text": "AI Destekli Görev Başlığı ve Açıklama Önerisi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c475",
        "key": "TK-475",
        "title": "Kubernetes v1.31 Versiyon Yükseltme Testi",
        "desc": "Caner Öztürk tarafından üstlenilen Kubernetes v1.31 Versiyon Yükseltme Testi çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-09-21",
        "dueDate": "2026-09-26",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st375-1",
                "text": "Kubernetes v1.31 Versiyon Yükseltme Testi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st375-2",
                "text": "Kubernetes v1.31 Versiyon Yükseltme Testi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c476",
        "key": "TK-476",
        "title": "AI Destekli Otomatik Test Senaryosu Üretimi",
        "desc": "Burcu Çelik tarafından üstlenilen AI Destekli Otomatik Test Senaryosu Üretimi çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-09-22",
        "dueDate": "2026-09-27",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st376-1",
                "text": "AI Destekli Otomatik Test Senaryosu Üretimi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st376-2",
                "text": "AI Destekli Otomatik Test Senaryosu Üretimi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c477",
        "key": "TK-477",
        "title": "Mobil Widget Desteği: Kilit Ekranı ve Ana Ekran",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Widget Desteği: Kilit Ekranı ve Ana Ekran çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-21",
        "dueDate": "2026-09-25",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st377-1",
                "text": "Mobil Widget Desteği: Kilit Ekranı ve Ana Ekran - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st377-2",
                "text": "Mobil Widget Desteği: Kilit Ekranı ve Ana Ekran - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c478",
        "key": "TK-478",
        "title": "AI Destekli Sprint Tamamlanma Tarihi Tahmin Modeli",
        "desc": "Gamze Şahin tarafından üstlenilen AI Destekli Sprint Tamamlanma Tarihi Tahmin Modeli çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-22",
        "dueDate": "2026-09-26",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st378-1",
                "text": "AI Destekli Sprint Tamamlanma Tarihi Tahmin Modeli - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st378-2",
                "text": "AI Destekli Sprint Tamamlanma Tarihi Tahmin Modeli - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c479",
        "key": "TK-479",
        "title": "Kurumsal SSO: SAML 2.0 ve Okta / Azure AD",
        "desc": "Tolga Kurt tarafından üstlenilen Kurumsal SSO: SAML 2.0 ve Okta / Azure AD çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-09-21",
        "dueDate": "2026-09-27",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st379-1",
                "text": "Kurumsal SSO: SAML 2.0 ve Okta / Azure AD - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st379-2",
                "text": "Kurumsal SSO: SAML 2.0 ve Okta / Azure AD - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c480",
        "key": "TK-480",
        "title": "Dağıtık Bellek İçi Veri Izgarası (Redis Cluster)",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Bellek İçi Veri Izgarası (Redis Cluster) çalışması. Sprint 38 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-22",
        "dueDate": "2026-09-25",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st380-1",
                "text": "Dağıtık Bellek İçi Veri Izgarası (Redis Cluster) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st380-2",
                "text": "Dağıtık Bellek İçi Veri Izgarası (Redis Cluster) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s38",
        "createdAt": 1789765200000
    },
    {
        "id": "c481",
        "key": "TK-481",
        "title": "Dinamik Tenant Veritabanı Yönlendirme",
        "desc": "Ali Yılmaz tarafından üstlenilen Dinamik Tenant Veritabanı Yönlendirme çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-09-28",
        "dueDate": "2026-10-02",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st381-1",
                "text": "Dinamik Tenant Veritabanı Yönlendirme - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st381-2",
                "text": "Dinamik Tenant Veritabanı Yönlendirme - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c482",
        "key": "TK-482",
        "title": "Özel Alanlar Dinamik Form Oluşturucu",
        "desc": "Zeynep Kaya tarafından üstlenilen Özel Alanlar Dinamik Form Oluşturucu çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-29",
        "dueDate": "2026-10-03",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st382-1",
                "text": "Özel Alanlar Dinamik Form Oluşturucu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st382-2",
                "text": "Özel Alanlar Dinamik Form Oluşturucu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c483",
        "key": "TK-483",
        "title": "Çoklu Veri Merkezi Master-Replica Testi",
        "desc": "Mehmet Demir tarafından üstlenilen Çoklu Veri Merkezi Master-Replica Testi çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-09-28",
        "dueDate": "2026-10-04",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st383-1",
                "text": "Çoklu Veri Merkezi Master-Replica Testi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st383-2",
                "text": "Çoklu Veri Merkezi Master-Replica Testi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c484",
        "key": "TK-484",
        "title": "Gelişmiş Pano Filtre Kombinasyonlarını Kaydetme",
        "desc": "Selin Yıldız tarafından üstlenilen Gelişmiş Pano Filtre Kombinasyonlarını Kaydetme çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-29",
        "dueDate": "2026-10-02",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st384-1",
                "text": "Gelişmiş Pano Filtre Kombinasyonlarını Kaydetme - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st384-2",
                "text": "Gelişmiş Pano Filtre Kombinasyonlarını Kaydetme - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c485",
        "key": "TK-485",
        "title": "Multi-Cloud Hibrit Dağıtım Mimarisi",
        "desc": "Caner Öztürk tarafından üstlenilen Multi-Cloud Hibrit Dağıtım Mimarisi çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-09-28",
        "dueDate": "2026-10-03",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st385-1",
                "text": "Multi-Cloud Hibrit Dağıtım Mimarisi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st385-2",
                "text": "Multi-Cloud Hibrit Dağıtım Mimarisi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c486",
        "key": "TK-486",
        "title": "Mikroservis Bağımlılıkları İçin Mock Sunucu Altyapısı",
        "desc": "Burcu Çelik tarafından üstlenilen Mikroservis Bağımlılıkları İçin Mock Sunucu Altyapısı çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-09-29",
        "dueDate": "2026-10-04",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st386-1",
                "text": "Mikroservis Bağımlılıkları İçin Mock Sunucu Altyapısı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st386-2",
                "text": "Mikroservis Bağımlılıkları İçin Mock Sunucu Altyapısı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c487",
        "key": "TK-487",
        "title": "Mobil Uygulama İçi Satın Alma Hazırlığı",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Uygulama İçi Satın Alma Hazırlığı çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-28",
        "dueDate": "2026-10-02",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st387-1",
                "text": "Mobil Uygulama İçi Satın Alma Hazırlığı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st387-2",
                "text": "Mobil Uygulama İçi Satın Alma Hazırlığı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c488",
        "key": "TK-488",
        "title": "Pano İçi Özel Metrik Tanımlama Formülü",
        "desc": "Gamze Şahin tarafından üstlenilen Pano İçi Özel Metrik Tanımlama Formülü çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-29",
        "dueDate": "2026-10-03",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st388-1",
                "text": "Pano İçi Özel Metrik Tanımlama Formülü - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st388-2",
                "text": "Pano İçi Özel Metrik Tanımlama Formülü - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c489",
        "key": "TK-489",
        "title": "SCIM Protokolü ile Otomatik Kullanıcı Sağlama",
        "desc": "Tolga Kurt tarafından üstlenilen SCIM Protokolü ile Otomatik Kullanıcı Sağlama çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-09-28",
        "dueDate": "2026-10-04",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st389-1",
                "text": "SCIM Protokolü ile Otomatik Kullanıcı Sağlama - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st389-2",
                "text": "SCIM Protokolü ile Otomatik Kullanıcı Sağlama - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c490",
        "key": "TK-490",
        "title": "Olay Akışında Çift Mesaj Önleme (Idempotency Key)",
        "desc": "Derya Arslan tarafından üstlenilen Olay Akışında Çift Mesaj Önleme (Idempotency Key) çalışması. Sprint 39 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-09-29",
        "dueDate": "2026-10-02",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st390-1",
                "text": "Olay Akışında Çift Mesaj Önleme (Idempotency Key) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st390-2",
                "text": "Olay Akışında Çift Mesaj Önleme (Idempotency Key) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s39",
        "createdAt": 1790370000000
    },
    {
        "id": "c491",
        "key": "TK-491",
        "title": "Dağıtık İşlem İptali ve Saga Deseni",
        "desc": "Ali Yılmaz tarafından üstlenilen Dağıtık İşlem İptali ve Saga Deseni çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-05",
        "dueDate": "2026-10-09",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st391-1",
                "text": "Dağıtık İşlem İptali ve Saga Deseni - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st391-2",
                "text": "Dağıtık İşlem İptali ve Saga Deseni - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c492",
        "key": "TK-492",
        "title": "Zamanlayıcı ve Canlı Efor Takip Widgetı",
        "desc": "Zeynep Kaya tarafından üstlenilen Zamanlayıcı ve Canlı Efor Takip Widgetı çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-06",
        "dueDate": "2026-10-10",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st392-1",
                "text": "Zamanlayıcı ve Canlı Efor Takip Widgetı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st392-2",
                "text": "Zamanlayıcı ve Canlı Efor Takip Widgetı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c493",
        "key": "TK-493",
        "title": "Kart Durum Geçişleri State-Machine Triggerları",
        "desc": "Mehmet Demir tarafından üstlenilen Kart Durum Geçişleri State-Machine Triggerları çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-05",
        "dueDate": "2026-10-11",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st393-1",
                "text": "Kart Durum Geçişleri State-Machine Triggerları - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st393-2",
                "text": "Kart Durum Geçişleri State-Machine Triggerları - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c494",
        "key": "TK-494",
        "title": "Görev İçi Özel Alanlar (Sayı, Metin, Tarih)",
        "desc": "Selin Yıldız tarafından üstlenilen Görev İçi Özel Alanlar (Sayı, Metin, Tarih) çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-06",
        "dueDate": "2026-10-09",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st394-1",
                "text": "Görev İçi Özel Alanlar (Sayı, Metin, Tarih) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st394-2",
                "text": "Görev İçi Özel Alanlar (Sayı, Metin, Tarih) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c495",
        "key": "TK-495",
        "title": "CI/CD Otomatik Rollback ve Arıza Dedektörü",
        "desc": "Caner Öztürk tarafından üstlenilen CI/CD Otomatik Rollback ve Arıza Dedektörü çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-05",
        "dueDate": "2026-10-10",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st395-1",
                "text": "CI/CD Otomatik Rollback ve Arıza Dedektörü - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st395-2",
                "text": "CI/CD Otomatik Rollback ve Arıza Dedektörü - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c496",
        "key": "TK-496",
        "title": "Uluslararası Karakterler (UTF-8) Uyumluluk Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Uluslararası Karakterler (UTF-8) Uyumluluk Testi çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-06",
        "dueDate": "2026-10-11",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st396-1",
                "text": "Uluslararası Karakterler (UTF-8) Uyumluluk Testi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st396-2",
                "text": "Uluslararası Karakterler (UTF-8) Uyumluluk Testi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c497",
        "key": "TK-497",
        "title": "Akıllı Saat (Apple Watch / Wear OS) Entegrasyonu",
        "desc": "Emre Aydın tarafından üstlenilen Akıllı Saat (Apple Watch / Wear OS) Entegrasyonu çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-05",
        "dueDate": "2026-10-09",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st397-1",
                "text": "Akıllı Saat (Apple Watch / Wear OS) Entegrasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st397-2",
                "text": "Akıllı Saat (Apple Watch / Wear OS) Entegrasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c498",
        "key": "TK-498",
        "title": "Ekip Verimliliği Korelasyon Analizi",
        "desc": "Gamze Şahin tarafından üstlenilen Ekip Verimliliği Korelasyon Analizi çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-06",
        "dueDate": "2026-10-10",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st398-1",
                "text": "Ekip Verimliliği Korelasyon Analizi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st398-2",
                "text": "Ekip Verimliliği Korelasyon Analizi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c499",
        "key": "TK-499",
        "title": "API Fuzzing Testi ile Sıfırıncı Gün Taraması",
        "desc": "Tolga Kurt tarafından üstlenilen API Fuzzing Testi ile Sıfırıncı Gün Taraması çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-05",
        "dueDate": "2026-10-11",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st399-1",
                "text": "API Fuzzing Testi ile Sıfırıncı Gün Taraması - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st399-2",
                "text": "API Fuzzing Testi ile Sıfırıncı Gün Taraması - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c500",
        "key": "TK-500",
        "title": "Ağ Kesintilerinde Çevrimdışı Mesaj Tamponu",
        "desc": "Derya Arslan tarafından üstlenilen Ağ Kesintilerinde Çevrimdışı Mesaj Tamponu çalışması. Sprint 40 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-06",
        "dueDate": "2026-10-09",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st400-1",
                "text": "Ağ Kesintilerinde Çevrimdışı Mesaj Tamponu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st400-2",
                "text": "Ağ Kesintilerinde Çevrimdışı Mesaj Tamponu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s40",
        "createdAt": 1790974800000
    },
    {
        "id": "c501",
        "key": "TK-501",
        "title": "Server-Sent Events (SSE) Gerçek Zamanlı Akış",
        "desc": "Ali Yılmaz tarafından üstlenilen Server-Sent Events (SSE) Gerçek Zamanlı Akış çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-12",
        "dueDate": "2026-10-16",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st401-1",
                "text": "Server-Sent Events (SSE) Gerçek Zamanlı Akış - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st401-2",
                "text": "Server-Sent Events (SSE) Gerçek Zamanlı Akış - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c502",
        "key": "TK-502",
        "title": "Sütun İçi Kart Sıralama (Reorder) Tutarlılığı",
        "desc": "Zeynep Kaya tarafından üstlenilen Sütun İçi Kart Sıralama (Reorder) Tutarlılığı çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-13",
        "dueDate": "2026-10-17",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st402-1",
                "text": "Sütun İçi Kart Sıralama (Reorder) Tutarlılığı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st402-2",
                "text": "Sütun İçi Kart Sıralama (Reorder) Tutarlılığı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c503",
        "key": "TK-503",
        "title": "Veritabanı Şema Sürümleme Otomasyonu",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Şema Sürümleme Otomasyonu çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-12",
        "dueDate": "2026-10-18",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st403-1",
                "text": "Veritabanı Şema Sürümleme Otomasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st403-2",
                "text": "Veritabanı Şema Sürümleme Otomasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c504",
        "key": "TK-504",
        "title": "Pano İçin Rol Bazlı Salt Okunur Paylaşım",
        "desc": "Selin Yıldız tarafından üstlenilen Pano İçin Rol Bazlı Salt Okunur Paylaşım çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-13",
        "dueDate": "2026-10-16",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st404-1",
                "text": "Pano İçin Rol Bazlı Salt Okunur Paylaşım - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st404-2",
                "text": "Pano İçin Rol Bazlı Salt Okunur Paylaşım - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c505",
        "key": "TK-505",
        "title": "Veritabanı Yük Devretme Küme Doğrulaması",
        "desc": "Caner Öztürk tarafından üstlenilen Veritabanı Yük Devretme Küme Doğrulaması çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-12",
        "dueDate": "2026-10-17",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st405-1",
                "text": "Veritabanı Yük Devretme Küme Doğrulaması - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st405-2",
                "text": "Veritabanı Yük Devretme Küme Doğrulaması - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c506",
        "key": "TK-506",
        "title": "Dağıtık Önbellek Tutarlılık Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Dağıtık Önbellek Tutarlılık Testi çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-13",
        "dueDate": "2026-10-18",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st406-1",
                "text": "Dağıtık Önbellek Tutarlılık Testi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st406-2",
                "text": "Dağıtık Önbellek Tutarlılık Testi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c507",
        "key": "TK-507",
        "title": "Mobil Paylaşım Sayfası (Share Extension) ile Kart Açma",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Paylaşım Sayfası (Share Extension) ile Kart Açma çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-12",
        "dueDate": "2026-10-16",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st407-1",
                "text": "Mobil Paylaşım Sayfası (Share Extension) ile Kart Açma - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st407-2",
                "text": "Mobil Paylaşım Sayfası (Share Extension) ile Kart Açma - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c508",
        "key": "TK-508",
        "title": "Dönüşüm Hunisi: Görevin Tamamlanma Olasılığı",
        "desc": "Gamze Şahin tarafından üstlenilen Dönüşüm Hunisi: Görevin Tamamlanma Olasılığı çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-13",
        "dueDate": "2026-10-17",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st408-1",
                "text": "Dönüşüm Hunisi: Görevin Tamamlanma Olasılığı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st408-2",
                "text": "Dönüşüm Hunisi: Görevin Tamamlanma Olasılığı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c509",
        "key": "TK-509",
        "title": "Veri İhlali Bildirim Protokolü ve KVKK Süreci",
        "desc": "Tolga Kurt tarafından üstlenilen Veri İhlali Bildirim Protokolü ve KVKK Süreci çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-12",
        "dueDate": "2026-10-18",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st409-1",
                "text": "Veri İhlali Bildirim Protokolü ve KVKK Süreci - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st409-2",
                "text": "Veri İhlali Bildirim Protokolü ve KVKK Süreci - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c510",
        "key": "TK-510",
        "title": "Dağıtık Görev Çalıştırma: MapReduce Dağıtımı",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Görev Çalıştırma: MapReduce Dağıtımı çalışması. Sprint 41 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-13",
        "dueDate": "2026-10-16",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st410-1",
                "text": "Dağıtık Görev Çalıştırma: MapReduce Dağıtımı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st410-2",
                "text": "Dağıtık Görev Çalıştırma: MapReduce Dağıtımı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s41",
        "createdAt": 1791579600000
    },
    {
        "id": "c511",
        "key": "TK-511",
        "title": "Kullanıcı Verisi Anonimleştirme ve KVKK",
        "desc": "Ali Yılmaz tarafından üstlenilen Kullanıcı Verisi Anonimleştirme ve KVKK çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-19",
        "dueDate": "2026-10-23",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st411-1",
                "text": "Kullanıcı Verisi Anonimleştirme ve KVKK - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st411-2",
                "text": "Kullanıcı Verisi Anonimleştirme ve KVKK - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c512",
        "key": "TK-512",
        "title": "Harici Paylaşılabilir Pano Bağlantısı Arayüzü",
        "desc": "Zeynep Kaya tarafından üstlenilen Harici Paylaşılabilir Pano Bağlantısı Arayüzü çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-20",
        "dueDate": "2026-10-24",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st412-1",
                "text": "Harici Paylaşılabilir Pano Bağlantısı Arayüzü - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st412-2",
                "text": "Harici Paylaşılabilir Pano Bağlantısı Arayüzü - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c513",
        "key": "TK-513",
        "title": "Eski Görevleri Arşivleme ve Cold-Storage Taşıma",
        "desc": "Mehmet Demir tarafından üstlenilen Eski Görevleri Arşivleme ve Cold-Storage Taşıma çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-19",
        "dueDate": "2026-10-25",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st413-1",
                "text": "Eski Görevleri Arşivleme ve Cold-Storage Taşıma - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st413-2",
                "text": "Eski Görevleri Arşivleme ve Cold-Storage Taşıma - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c514",
        "key": "TK-514",
        "title": "Kullanıcı Giriş Geçmişi ve Oturum Sonlandırma",
        "desc": "Selin Yıldız tarafından üstlenilen Kullanıcı Giriş Geçmişi ve Oturum Sonlandırma çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-20",
        "dueDate": "2026-10-23",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st414-1",
                "text": "Kullanıcı Giriş Geçmişi ve Oturum Sonlandırma - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st414-2",
                "text": "Kullanıcı Giriş Geçmişi ve Oturum Sonlandırma - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c515",
        "key": "TK-515",
        "title": "Edge Compute Worker Yanıt Süreleri İyileştirmesi",
        "desc": "Caner Öztürk tarafından üstlenilen Edge Compute Worker Yanıt Süreleri İyileştirmesi çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-19",
        "dueDate": "2026-10-24",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st415-1",
                "text": "Edge Compute Worker Yanıt Süreleri İyileştirmesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st415-2",
                "text": "Edge Compute Worker Yanıt Süreleri İyileştirmesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c516",
        "key": "TK-516",
        "title": "Pano Dışa Aktarım Dosyaları Hash Doğrulaması",
        "desc": "Burcu Çelik tarafından üstlenilen Pano Dışa Aktarım Dosyaları Hash Doğrulaması çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-20",
        "dueDate": "2026-10-25",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st416-1",
                "text": "Pano Dışa Aktarım Dosyaları Hash Doğrulaması - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st416-2",
                "text": "Pano Dışa Aktarım Dosyaları Hash Doğrulaması - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c517",
        "key": "TK-517",
        "title": "Arka Plan Çalışma Alanı Giriş Hatırlatıcısı",
        "desc": "Emre Aydın tarafından üstlenilen Arka Plan Çalışma Alanı Giriş Hatırlatıcısı çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-19",
        "dueDate": "2026-10-23",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st417-1",
                "text": "Arka Plan Çalışma Alanı Giriş Hatırlatıcısı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st417-2",
                "text": "Arka Plan Çalışma Alanı Giriş Hatırlatıcısı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c518",
        "key": "TK-518",
        "title": "Otomatik Performans İyileştirme Tavsiye Raporu",
        "desc": "Gamze Şahin tarafından üstlenilen Otomatik Performans İyileştirme Tavsiye Raporu çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-20",
        "dueDate": "2026-10-24",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st418-1",
                "text": "Otomatik Performans İyileştirme Tavsiye Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st418-2",
                "text": "Otomatik Performans İyileştirme Tavsiye Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c519",
        "key": "TK-519",
        "title": "Güvenli Docker İmaj İmzalaması (Cosign)",
        "desc": "Tolga Kurt tarafından üstlenilen Güvenli Docker İmaj İmzalaması (Cosign) çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-19",
        "dueDate": "2026-10-25",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st419-1",
                "text": "Güvenli Docker İmaj İmzalaması (Cosign) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st419-2",
                "text": "Güvenli Docker İmaj İmzalaması (Cosign) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c520",
        "key": "TK-520",
        "title": "Coğrafi Yük Devretme Sırasında Sıfır Veri Kaybı (RPO=0)",
        "desc": "Derya Arslan tarafından üstlenilen Coğrafi Yük Devretme Sırasında Sıfır Veri Kaybı (RPO=0) çalışması. Sprint 42 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-20",
        "dueDate": "2026-10-23",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st420-1",
                "text": "Coğrafi Yük Devretme Sırasında Sıfır Veri Kaybı (RPO=0) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st420-2",
                "text": "Coğrafi Yük Devretme Sırasında Sıfır Veri Kaybı (RPO=0) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s42",
        "createdAt": 1792184400000
    },
    {
        "id": "c521",
        "key": "TK-521",
        "title": "Streaming JSON Parser ve Bellek Koruma",
        "desc": "Ali Yılmaz tarafından üstlenilen Streaming JSON Parser ve Bellek Koruma çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-26",
        "dueDate": "2026-10-30",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st421-1",
                "text": "Streaming JSON Parser ve Bellek Koruma - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st421-2",
                "text": "Streaming JSON Parser ve Bellek Koruma - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c522",
        "key": "TK-522",
        "title": "Çok Dilli Arayüz (i18n Türkçe / İngilizce)",
        "desc": "Zeynep Kaya tarafından üstlenilen Çok Dilli Arayüz (i18n Türkçe / İngilizce) çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-27",
        "dueDate": "2026-10-31",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st422-1",
                "text": "Çok Dilli Arayüz (i18n Türkçe / İngilizce) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st422-2",
                "text": "Çok Dilli Arayüz (i18n Türkçe / İngilizce) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c523",
        "key": "TK-523",
        "title": "Veritabanı Bağlantı Sızıntısı Dedektörü",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Bağlantı Sızıntısı Dedektörü çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-26",
        "dueDate": "2026-11-01",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st423-1",
                "text": "Veritabanı Bağlantı Sızıntısı Dedektörü - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st423-2",
                "text": "Veritabanı Bağlantı Sızıntısı Dedektörü - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c524",
        "key": "TK-524",
        "title": "Kart Taşırken Otomatik Durum Değişikliği Kuralları",
        "desc": "Selin Yıldız tarafından üstlenilen Kart Taşırken Otomatik Durum Değişikliği Kuralları çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-27",
        "dueDate": "2026-10-30",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st424-1",
                "text": "Kart Taşırken Otomatik Durum Değişikliği Kuralları - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st424-2",
                "text": "Kart Taşırken Otomatik Durum Değişikliği Kuralları - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c525",
        "key": "TK-525",
        "title": "Güvenli VPN ve Bastion Host Erişim Politikaları",
        "desc": "Caner Öztürk tarafından üstlenilen Güvenli VPN ve Bastion Host Erişim Politikaları çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-10-26",
        "dueDate": "2026-10-31",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st425-1",
                "text": "Güvenli VPN ve Bastion Host Erişim Politikaları - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st425-2",
                "text": "Güvenli VPN ve Bastion Host Erişim Politikaları - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c526",
        "key": "TK-526",
        "title": "Rate Limiting Engelleme ve 429 Testleri",
        "desc": "Burcu Çelik tarafından üstlenilen Rate Limiting Engelleme ve 429 Testleri çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-27",
        "dueDate": "2026-11-01",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st426-1",
                "text": "Rate Limiting Engelleme ve 429 Testleri - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st426-2",
                "text": "Rate Limiting Engelleme ve 429 Testleri - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c527",
        "key": "TK-527",
        "title": "Mobil Çoklu Dokunma (Pinch-to-Zoom) Pano Bakışı",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Çoklu Dokunma (Pinch-to-Zoom) Pano Bakışı çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-26",
        "dueDate": "2026-10-30",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st427-1",
                "text": "Mobil Çoklu Dokunma (Pinch-to-Zoom) Pano Bakışı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st427-2",
                "text": "Mobil Çoklu Dokunma (Pinch-to-Zoom) Pano Bakışı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c528",
        "key": "TK-528",
        "title": "Dinamik Zaman Aralığı Karşılaştırması",
        "desc": "Gamze Şahin tarafından üstlenilen Dinamik Zaman Aralığı Karşılaştırması çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-27",
        "dueDate": "2026-10-31",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st428-1",
                "text": "Dinamik Zaman Aralığı Karşılaştırması - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st428-2",
                "text": "Dinamik Zaman Aralığı Karşılaştırması - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c529",
        "key": "TK-529",
        "title": "Cloudflare Zero Trust ve Güvenli Erişim Geçidi",
        "desc": "Tolga Kurt tarafından üstlenilen Cloudflare Zero Trust ve Güvenli Erişim Geçidi çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-10-26",
        "dueDate": "2026-11-01",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st429-1",
                "text": "Cloudflare Zero Trust ve Güvenli Erişim Geçidi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st429-2",
                "text": "Cloudflare Zero Trust ve Güvenli Erişim Geçidi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c530",
        "key": "TK-530",
        "title": "Servis Yanıt Süreleri P99 ve P99.9 Kuyruk Gecikmesi",
        "desc": "Derya Arslan tarafından üstlenilen Servis Yanıt Süreleri P99 ve P99.9 Kuyruk Gecikmesi çalışması. Sprint 43 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-10-27",
        "dueDate": "2026-10-30",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st430-1",
                "text": "Servis Yanıt Süreleri P99 ve P99.9 Kuyruk Gecikmesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st430-2",
                "text": "Servis Yanıt Süreleri P99 ve P99.9 Kuyruk Gecikmesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s43",
        "createdAt": 1792789200000
    },
    {
        "id": "c531",
        "key": "TK-531",
        "title": "Harici Webhook İmza Doğrulama (HMAC-SHA256)",
        "desc": "Ali Yılmaz tarafından üstlenilen Harici Webhook İmza Doğrulama (HMAC-SHA256) çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-02",
        "dueDate": "2026-11-06",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st431-1",
                "text": "Harici Webhook İmza Doğrulama (HMAC-SHA256) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st431-2",
                "text": "Harici Webhook İmza Doğrulama (HMAC-SHA256) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c532",
        "key": "TK-532",
        "title": "Pano Arka Plan Desenleri ve Temalar",
        "desc": "Zeynep Kaya tarafından üstlenilen Pano Arka Plan Desenleri ve Temalar çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-03",
        "dueDate": "2026-11-07",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st432-1",
                "text": "Pano Arka Plan Desenleri ve Temalar - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st432-2",
                "text": "Pano Arka Plan Desenleri ve Temalar - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c533",
        "key": "TK-533",
        "title": "Geçici Tablo Kullanımı ve Bellek Temizliği",
        "desc": "Mehmet Demir tarafından üstlenilen Geçici Tablo Kullanımı ve Bellek Temizliği çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-02",
        "dueDate": "2026-11-08",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st433-1",
                "text": "Geçici Tablo Kullanımı ve Bellek Temizliği - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st433-2",
                "text": "Geçici Tablo Kullanımı ve Bellek Temizliği - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c534",
        "key": "TK-534",
        "title": "Hafta Sonu ve Tatilleri Efor Planından Çıkarma",
        "desc": "Selin Yıldız tarafından üstlenilen Hafta Sonu ve Tatilleri Efor Planından Çıkarma çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-03",
        "dueDate": "2026-11-06",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st434-1",
                "text": "Hafta Sonu ve Tatilleri Efor Planından Çıkarma - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st434-2",
                "text": "Hafta Sonu ve Tatilleri Efor Planından Çıkarma - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c535",
        "key": "TK-535",
        "title": "Altyapı Günlükleri Şifreleme Politikası",
        "desc": "Caner Öztürk tarafından üstlenilen Altyapı Günlükleri Şifreleme Politikası çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-02",
        "dueDate": "2026-11-07",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st435-1",
                "text": "Altyapı Günlükleri Şifreleme Politikası - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st435-2",
                "text": "Altyapı Günlükleri Şifreleme Politikası - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c536",
        "key": "TK-536",
        "title": "Sayfa Yenileme ve Geri Tuşu Geçmişi Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Sayfa Yenileme ve Geri Tuşu Geçmişi Testi çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-03",
        "dueDate": "2026-11-08",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st436-1",
                "text": "Sayfa Yenileme ve Geri Tuşu Geçmişi Testi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st436-2",
                "text": "Sayfa Yenileme ve Geri Tuşu Geçmişi Testi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c537",
        "key": "TK-537",
        "title": "Bluetooth Klavye Kısayolları ile Pano Yönetimi",
        "desc": "Emre Aydın tarafından üstlenilen Bluetooth Klavye Kısayolları ile Pano Yönetimi çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-02",
        "dueDate": "2026-11-06",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st437-1",
                "text": "Bluetooth Klavye Kısayolları ile Pano Yönetimi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st437-2",
                "text": "Bluetooth Klavye Kısayolları ile Pano Yönetimi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c538",
        "key": "TK-538",
        "title": "Gerçek Zamanlı Analitik Sayacı Veri Akışı",
        "desc": "Gamze Şahin tarafından üstlenilen Gerçek Zamanlı Analitik Sayacı Veri Akışı çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-03",
        "dueDate": "2026-11-07",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st438-1",
                "text": "Gerçek Zamanlı Analitik Sayacı Veri Akışı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st438-2",
                "text": "Gerçek Zamanlı Analitik Sayacı Veri Akışı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c539",
        "key": "TK-539",
        "title": "Gizli Bilgilerin Bellekte Tutulma Süresinin Azaltılması",
        "desc": "Tolga Kurt tarafından üstlenilen Gizli Bilgilerin Bellekte Tutulma Süresinin Azaltılması çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-02",
        "dueDate": "2026-11-08",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st439-1",
                "text": "Gizli Bilgilerin Bellekte Tutulma Süresinin Azaltılması - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st439-2",
                "text": "Gizli Bilgilerin Bellekte Tutulma Süresinin Azaltılması - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c540",
        "key": "TK-540",
        "title": "Küresel Pano Kilitleri İçin Heartbeat Mekanizması",
        "desc": "Derya Arslan tarafından üstlenilen Küresel Pano Kilitleri İçin Heartbeat Mekanizması çalışması. Sprint 44 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-03",
        "dueDate": "2026-11-06",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st440-1",
                "text": "Küresel Pano Kilitleri İçin Heartbeat Mekanizması - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st440-2",
                "text": "Küresel Pano Kilitleri İçin Heartbeat Mekanizması - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s44",
        "createdAt": 1793394000000
    },
    {
        "id": "c541",
        "key": "TK-541",
        "title": "Dağıtık Görev Zamanlayıcı (Cron Scheduler)",
        "desc": "Ali Yılmaz tarafından üstlenilen Dağıtık Görev Zamanlayıcı (Cron Scheduler) çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-09",
        "dueDate": "2026-11-13",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st441-1",
                "text": "Dağıtık Görev Zamanlayıcı (Cron Scheduler) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st441-2",
                "text": "Dağıtık Görev Zamanlayıcı (Cron Scheduler) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c542",
        "key": "TK-542",
        "title": "Sanallaştırılmış Liste ile 1000+ Kart Desteği",
        "desc": "Zeynep Kaya tarafından üstlenilen Sanallaştırılmış Liste ile 1000+ Kart Desteği çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-10",
        "dueDate": "2026-11-14",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st442-1",
                "text": "Sanallaştırılmış Liste ile 1000+ Kart Desteği - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st442-2",
                "text": "Sanallaştırılmış Liste ile 1000+ Kart Desteği - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c543",
        "key": "TK-543",
        "title": "Özel Raporlama Sorguları İçin Dinamik SQL Filtresi",
        "desc": "Mehmet Demir tarafından üstlenilen Özel Raporlama Sorguları İçin Dinamik SQL Filtresi çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-09",
        "dueDate": "2026-11-15",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st443-1",
                "text": "Özel Raporlama Sorguları İçin Dinamik SQL Filtresi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st443-2",
                "text": "Özel Raporlama Sorguları İçin Dinamik SQL Filtresi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c544",
        "key": "TK-544",
        "title": "Kurumsal SLA Takip Uyarıları",
        "desc": "Selin Yıldız tarafından üstlenilen Kurumsal SLA Takip Uyarıları çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-10",
        "dueDate": "2026-11-13",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st444-1",
                "text": "Kurumsal SLA Takip Uyarıları - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st444-2",
                "text": "Kurumsal SLA Takip Uyarıları - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c545",
        "key": "TK-545",
        "title": "Kubernetes Pod Disruption Budget Yapılandırması",
        "desc": "Caner Öztürk tarafından üstlenilen Kubernetes Pod Disruption Budget Yapılandırması çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-09",
        "dueDate": "2026-11-14",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st445-1",
                "text": "Kubernetes Pod Disruption Budget Yapılandırması - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st445-2",
                "text": "Kubernetes Pod Disruption Budget Yapılandırması - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c546",
        "key": "TK-546",
        "title": "Mobil Push Bildirim E2E Simülasyonu",
        "desc": "Burcu Çelik tarafından üstlenilen Mobil Push Bildirim E2E Simülasyonu çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-10",
        "dueDate": "2026-11-15",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st446-1",
                "text": "Mobil Push Bildirim E2E Simülasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st446-2",
                "text": "Mobil Push Bildirim E2E Simülasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c547",
        "key": "TK-547",
        "title": "Mobil Uygulama İçi Hata Bildirimi (Shake to Report)",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Uygulama İçi Hata Bildirimi (Shake to Report) çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-09",
        "dueDate": "2026-11-13",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st447-1",
                "text": "Mobil Uygulama İçi Hata Bildirimi (Shake to Report) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st447-2",
                "text": "Mobil Uygulama İçi Hata Bildirimi (Shake to Report) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c548",
        "key": "TK-548",
        "title": "Veri Gizliliği: Raporlarda Kimlik Maskeleme",
        "desc": "Gamze Şahin tarafından üstlenilen Veri Gizliliği: Raporlarda Kimlik Maskeleme çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-10",
        "dueDate": "2026-11-14",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st448-1",
                "text": "Veri Gizliliği: Raporlarda Kimlik Maskeleme - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st448-2",
                "text": "Veri Gizliliği: Raporlarda Kimlik Maskeleme - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c549",
        "key": "TK-549",
        "title": "API Yanıtlarında Hassas Veri Maskeleme (PII Redaction)",
        "desc": "Tolga Kurt tarafından üstlenilen API Yanıtlarında Hassas Veri Maskeleme (PII Redaction) çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-09",
        "dueDate": "2026-11-15",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st449-1",
                "text": "API Yanıtlarında Hassas Veri Maskeleme (PII Redaction) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st449-2",
                "text": "API Yanıtlarında Hassas Veri Maskeleme (PII Redaction) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c550",
        "key": "TK-550",
        "title": "Dağıtık Sistemler İçin Simüle Edilmiş Ağ Gecikmesi",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Sistemler İçin Simüle Edilmiş Ağ Gecikmesi çalışması. Sprint 45 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-10",
        "dueDate": "2026-11-13",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st450-1",
                "text": "Dağıtık Sistemler İçin Simüle Edilmiş Ağ Gecikmesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st450-2",
                "text": "Dağıtık Sistemler İçin Simüle Edilmiş Ağ Gecikmesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s45",
        "createdAt": 1793998800000
    },
    {
        "id": "c551",
        "key": "TK-551",
        "title": "Global RFC 7807 Hata Yakalama",
        "desc": "Ali Yılmaz tarafından üstlenilen Global RFC 7807 Hata Yakalama çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-16",
        "dueDate": "2026-11-20",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st451-1",
                "text": "Global RFC 7807 Hata Yakalama - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st451-2",
                "text": "Global RFC 7807 Hata Yakalama - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c552",
        "key": "TK-552",
        "title": "Kart Bağımlılıkları Çizgi Arayüzü",
        "desc": "Zeynep Kaya tarafından üstlenilen Kart Bağımlılıkları Çizgi Arayüzü çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-17",
        "dueDate": "2026-11-21",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st452-1",
                "text": "Kart Bağımlılıkları Çizgi Arayüzü - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st452-2",
                "text": "Kart Bağımlılıkları Çizgi Arayüzü - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c553",
        "key": "TK-553",
        "title": "Kullanıcı İzinleri İçin Bitmask Yetkilendirme",
        "desc": "Mehmet Demir tarafından üstlenilen Kullanıcı İzinleri İçin Bitmask Yetkilendirme çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-16",
        "dueDate": "2026-11-22",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st453-1",
                "text": "Kullanıcı İzinleri İçin Bitmask Yetkilendirme - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st453-2",
                "text": "Kullanıcı İzinleri İçin Bitmask Yetkilendirme - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c554",
        "key": "TK-554",
        "title": "Görev Tamamlanma Süresi İyileştirmesi",
        "desc": "Selin Yıldız tarafından üstlenilen Görev Tamamlanma Süresi İyileştirmesi çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-17",
        "dueDate": "2026-11-20",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st454-1",
                "text": "Görev Tamamlanma Süresi İyileştirmesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st454-2",
                "text": "Görev Tamamlanma Süresi İyileştirmesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c555",
        "key": "TK-555",
        "title": "Canlı Trafik Altında Düğüm Drenajı Tatbikatı",
        "desc": "Caner Öztürk tarafından üstlenilen Canlı Trafik Altında Düğüm Drenajı Tatbikatı çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-16",
        "dueDate": "2026-11-21",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st455-1",
                "text": "Canlı Trafik Altında Düğüm Drenajı Tatbikatı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st455-2",
                "text": "Canlı Trafik Altında Düğüm Drenajı Tatbikatı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c556",
        "key": "TK-556",
        "title": "Canlıya Çıkış Öncesi Smoke Test Süiti",
        "desc": "Burcu Çelik tarafından üstlenilen Canlıya Çıkış Öncesi Smoke Test Süiti çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-17",
        "dueDate": "2026-11-22",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st456-1",
                "text": "Canlıya Çıkış Öncesi Smoke Test Süiti - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st456-2",
                "text": "Canlıya Çıkış Öncesi Smoke Test Süiti - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c557",
        "key": "TK-557",
        "title": "Dinamik İkon Değiştirme (App Icon Picker)",
        "desc": "Emre Aydın tarafından üstlenilen Dinamik İkon Değiştirme (App Icon Picker) çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-16",
        "dueDate": "2026-11-20",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st457-1",
                "text": "Dinamik İkon Değiştirme (App Icon Picker) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st457-2",
                "text": "Dinamik İkon Değiştirme (App Icon Picker) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c558",
        "key": "TK-558",
        "title": "Rapor Sayfası Yükleme Süresi Optimizasyonu",
        "desc": "Gamze Şahin tarafından üstlenilen Rapor Sayfası Yükleme Süresi Optimizasyonu çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-17",
        "dueDate": "2026-11-21",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st458-1",
                "text": "Rapor Sayfası Yükleme Süresi Optimizasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st458-2",
                "text": "Rapor Sayfası Yükleme Süresi Optimizasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c559",
        "key": "TK-559",
        "title": "Şüpheli Davranış Analizi ve Otomatik Askıya Alma",
        "desc": "Tolga Kurt tarafından üstlenilen Şüpheli Davranış Analizi ve Otomatik Askıya Alma çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-16",
        "dueDate": "2026-11-22",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st459-1",
                "text": "Şüpheli Davranış Analizi ve Otomatik Askıya Alma - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st459-2",
                "text": "Şüpheli Davranış Analizi ve Otomatik Askıya Alma - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c560",
        "key": "TK-560",
        "title": "Canlı Sistemde Olay Yeniden Oynatma Tatbikatı",
        "desc": "Derya Arslan tarafından üstlenilen Canlı Sistemde Olay Yeniden Oynatma Tatbikatı çalışması. Sprint 46 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-17",
        "dueDate": "2026-11-20",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st460-1",
                "text": "Canlı Sistemde Olay Yeniden Oynatma Tatbikatı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st460-2",
                "text": "Canlı Sistemde Olay Yeniden Oynatma Tatbikatı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s46",
        "createdAt": 1794603600000
    },
    {
        "id": "c561",
        "key": "TK-561",
        "title": "Çift Faktörlü Doğrulama (TOTP & WebAuthn)",
        "desc": "Ali Yılmaz tarafından üstlenilen Çift Faktörlü Doğrulama (TOTP & WebAuthn) çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-23",
        "dueDate": "2026-11-27",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st461-1",
                "text": "Çift Faktörlü Doğrulama (TOTP & WebAuthn) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st461-2",
                "text": "Çift Faktörlü Doğrulama (TOTP & WebAuthn) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c562",
        "key": "TK-562",
        "title": "Kullanıcı Tercihleri ve Profil Güncelleme Ekranı",
        "desc": "Zeynep Kaya tarafından üstlenilen Kullanıcı Tercihleri ve Profil Güncelleme Ekranı çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-24",
        "dueDate": "2026-11-28",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st462-1",
                "text": "Kullanıcı Tercihleri ve Profil Güncelleme Ekranı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st462-2",
                "text": "Kullanıcı Tercihleri ve Profil Güncelleme Ekranı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c563",
        "key": "TK-563",
        "title": "Veritabanı Failover Felaket Kurtarma Tatbikatı",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Failover Felaket Kurtarma Tatbikatı çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-23",
        "dueDate": "2026-11-29",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st463-1",
                "text": "Veritabanı Failover Felaket Kurtarma Tatbikatı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st463-2",
                "text": "Veritabanı Failover Felaket Kurtarma Tatbikatı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c564",
        "key": "TK-564",
        "title": "Kullanıcı Eğitimi Rehber Baloncukları",
        "desc": "Selin Yıldız tarafından üstlenilen Kullanıcı Eğitimi Rehber Baloncukları çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-24",
        "dueDate": "2026-11-27",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st464-1",
                "text": "Kullanıcı Eğitimi Rehber Baloncukları - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st464-2",
                "text": "Kullanıcı Eğitimi Rehber Baloncukları - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c565",
        "key": "TK-565",
        "title": "DNS Yük Dengeleme ve Coğrafi Yönlendirme",
        "desc": "Caner Öztürk tarafından üstlenilen DNS Yük Dengeleme ve Coğrafi Yönlendirme çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-23",
        "dueDate": "2026-11-28",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st465-1",
                "text": "DNS Yük Dengeleme ve Coğrafi Yönlendirme - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st465-2",
                "text": "DNS Yük Dengeleme ve Coğrafi Yönlendirme - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c566",
        "key": "TK-566",
        "title": "Kritik Kullanıcı Yolculukları Sağlamlık Testi",
        "desc": "Burcu Çelik tarafından üstlenilen Kritik Kullanıcı Yolculukları Sağlamlık Testi çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-24",
        "dueDate": "2026-11-29",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st466-1",
                "text": "Kritik Kullanıcı Yolculukları Sağlamlık Testi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st466-2",
                "text": "Kritik Kullanıcı Yolculukları Sağlamlık Testi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c567",
        "key": "TK-567",
        "title": "Çevrimdışı İndirilen Ekleri Temizleme Yöneticisi",
        "desc": "Emre Aydın tarafından üstlenilen Çevrimdışı İndirilen Ekleri Temizleme Yöneticisi çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-23",
        "dueDate": "2026-11-27",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st467-1",
                "text": "Çevrimdışı İndirilen Ekleri Temizleme Yöneticisi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st467-2",
                "text": "Çevrimdışı İndirilen Ekleri Temizleme Yöneticisi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c568",
        "key": "TK-568",
        "title": "Departman Bazlı Kaynak Tüketim Raporu",
        "desc": "Gamze Şahin tarafından üstlenilen Departman Bazlı Kaynak Tüketim Raporu çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-24",
        "dueDate": "2026-11-28",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st468-1",
                "text": "Departman Bazlı Kaynak Tüketim Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st468-2",
                "text": "Departman Bazlı Kaynak Tüketim Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c569",
        "key": "TK-569",
        "title": "Donanım Tabanlı Güvenlik Anahtarı (YubiKey) Desteği",
        "desc": "Tolga Kurt tarafından üstlenilen Donanım Tabanlı Güvenlik Anahtarı (YubiKey) Desteği çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-23",
        "dueDate": "2026-11-29",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st469-1",
                "text": "Donanım Tabanlı Güvenlik Anahtarı (YubiKey) Desteği - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st469-2",
                "text": "Donanım Tabanlı Güvenlik Anahtarı (YubiKey) Desteği - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c570",
        "key": "TK-570",
        "title": "Çapraz Bölge Veri Aktarım Maliyeti Optimizasyonu",
        "desc": "Derya Arslan tarafından üstlenilen Çapraz Bölge Veri Aktarım Maliyeti Optimizasyonu çalışması. Sprint 47 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-24",
        "dueDate": "2026-11-27",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st470-1",
                "text": "Çapraz Bölge Veri Aktarım Maliyeti Optimizasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st470-2",
                "text": "Çapraz Bölge Veri Aktarım Maliyeti Optimizasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s47",
        "createdAt": 1795208400000
    },
    {
        "id": "c571",
        "key": "TK-571",
        "title": "Çoklu Para Birimi ve Kur Senkronizasyonu",
        "desc": "Ali Yılmaz tarafından üstlenilen Çoklu Para Birimi ve Kur Senkronizasyonu çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-30",
        "dueDate": "2026-12-04",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st471-1",
                "text": "Çoklu Para Birimi ve Kur Senkronizasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st471-2",
                "text": "Çoklu Para Birimi ve Kur Senkronizasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c572",
        "key": "TK-572",
        "title": "Canlı İmleç (Presence) Kullanıcı Göstergeleri",
        "desc": "Zeynep Kaya tarafından üstlenilen Canlı İmleç (Presence) Kullanıcı Göstergeleri çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-01",
        "dueDate": "2026-12-05",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st472-1",
                "text": "Canlı İmleç (Presence) Kullanıcı Göstergeleri - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st472-2",
                "text": "Canlı İmleç (Presence) Kullanıcı Göstergeleri - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c573",
        "key": "TK-573",
        "title": "JSON Veri Sıkıştırma ve Storage Verimliliği",
        "desc": "Mehmet Demir tarafından üstlenilen JSON Veri Sıkıştırma ve Storage Verimliliği çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-30",
        "dueDate": "2026-12-06",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st473-1",
                "text": "JSON Veri Sıkıştırma ve Storage Verimliliği - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st473-2",
                "text": "JSON Veri Sıkıştırma ve Storage Verimliliği - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c574",
        "key": "TK-574",
        "title": "Çoklu Pano Genel Bakış ve Portfolyo Görünümü",
        "desc": "Selin Yıldız tarafından üstlenilen Çoklu Pano Genel Bakış ve Portfolyo Görünümü çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-01",
        "dueDate": "2026-12-04",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st474-1",
                "text": "Çoklu Pano Genel Bakış ve Portfolyo Görünümü - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st474-2",
                "text": "Çoklu Pano Genel Bakış ve Portfolyo Görünümü - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c575",
        "key": "TK-575",
        "title": "DevSecOps Otomasyonu Bağımlılık Kapısı",
        "desc": "Caner Öztürk tarafından üstlenilen DevSecOps Otomasyonu Bağımlılık Kapısı çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-11-30",
        "dueDate": "2026-12-05",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st475-1",
                "text": "DevSecOps Otomasyonu Bağımlılık Kapısı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st475-2",
                "text": "DevSecOps Otomasyonu Bağımlılık Kapısı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c576",
        "key": "TK-576",
        "title": "Hata Günlüğü Sessiz Başarısızlık Tarayıcısı",
        "desc": "Burcu Çelik tarafından üstlenilen Hata Günlüğü Sessiz Başarısızlık Tarayıcısı çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-01",
        "dueDate": "2026-12-06",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st476-1",
                "text": "Hata Günlüğü Sessiz Başarısızlık Tarayıcısı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st476-2",
                "text": "Hata Günlüğü Sessiz Başarısızlık Tarayıcısı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c577",
        "key": "TK-577",
        "title": "Android 15 ve iOS 18 Yeni API Uyumluluğu",
        "desc": "Emre Aydın tarafından üstlenilen Android 15 ve iOS 18 Yeni API Uyumluluğu çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-11-30",
        "dueDate": "2026-12-04",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st477-1",
                "text": "Android 15 ve iOS 18 Yeni API Uyumluluğu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st477-2",
                "text": "Android 15 ve iOS 18 Yeni API Uyumluluğu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c578",
        "key": "TK-578",
        "title": "Pano Enflasyon Oranı: Eklenen vs Biten Görev",
        "desc": "Gamze Şahin tarafından üstlenilen Pano Enflasyon Oranı: Eklenen vs Biten Görev çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-01",
        "dueDate": "2026-12-05",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st478-1",
                "text": "Pano Enflasyon Oranı: Eklenen vs Biten Görev - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st478-2",
                "text": "Pano Enflasyon Oranı: Eklenen vs Biten Görev - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c579",
        "key": "TK-579",
        "title": "Dış Güvenlik Denetimi (Third-Party Pentest)",
        "desc": "Tolga Kurt tarafından üstlenilen Dış Güvenlik Denetimi (Third-Party Pentest) çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-11-30",
        "dueDate": "2026-12-06",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st479-1",
                "text": "Dış Güvenlik Denetimi (Third-Party Pentest) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st479-2",
                "text": "Dış Güvenlik Denetimi (Third-Party Pentest) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c580",
        "key": "TK-580",
        "title": "Dağıtık Hata Yalıtımı ve Fault Domain Sınırları",
        "desc": "Derya Arslan tarafından üstlenilen Dağıtık Hata Yalıtımı ve Fault Domain Sınırları çalışması. Sprint 48 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-01",
        "dueDate": "2026-12-04",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st480-1",
                "text": "Dağıtık Hata Yalıtımı ve Fault Domain Sınırları - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st480-2",
                "text": "Dağıtık Hata Yalıtımı ve Fault Domain Sınırları - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s48",
        "createdAt": 1795813200000
    },
    {
        "id": "c581",
        "key": "TK-581",
        "title": "Merkezi OpenSearch Log Toplama Pipeline",
        "desc": "Ali Yılmaz tarafından üstlenilen Merkezi OpenSearch Log Toplama Pipeline çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-07",
        "dueDate": "2026-12-11",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st481-1",
                "text": "Merkezi OpenSearch Log Toplama Pipeline - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st481-2",
                "text": "Merkezi OpenSearch Log Toplama Pipeline - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c582",
        "key": "TK-582",
        "title": "Webhook Log Arayüzü ve Geliştirici Konsolu",
        "desc": "Zeynep Kaya tarafından üstlenilen Webhook Log Arayüzü ve Geliştirici Konsolu çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-08",
        "dueDate": "2026-12-12",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st482-1",
                "text": "Webhook Log Arayüzü ve Geliştirici Konsolu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st482-2",
                "text": "Webhook Log Arayüzü ve Geliştirici Konsolu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c583",
        "key": "TK-583",
        "title": "Veritabanı Sorgu Günlükleri Pgbadger Raporu",
        "desc": "Mehmet Demir tarafından üstlenilen Veritabanı Sorgu Günlükleri Pgbadger Raporu çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-07",
        "dueDate": "2026-12-13",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st483-1",
                "text": "Veritabanı Sorgu Günlükleri Pgbadger Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st483-2",
                "text": "Veritabanı Sorgu Günlükleri Pgbadger Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c584",
        "key": "TK-584",
        "title": "Otomatik Görev Atama (Round-Robin Dağılımı)",
        "desc": "Selin Yıldız tarafından üstlenilen Otomatik Görev Atama (Round-Robin Dağılımı) çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-08",
        "dueDate": "2026-12-11",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st484-1",
                "text": "Otomatik Görev Atama (Round-Robin Dağılımı) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st484-2",
                "text": "Otomatik Görev Atama (Round-Robin Dağılımı) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c585",
        "key": "TK-585",
        "title": "Yıllık Bulut Fatura İncelemesi ve Tasarruf Planı",
        "desc": "Caner Öztürk tarafından üstlenilen Yıllık Bulut Fatura İncelemesi ve Tasarruf Planı çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-07",
        "dueDate": "2026-12-12",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st485-1",
                "text": "Yıllık Bulut Fatura İncelemesi ve Tasarruf Planı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st485-2",
                "text": "Yıllık Bulut Fatura İncelemesi ve Tasarruf Planı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c586",
        "key": "TK-586",
        "title": "Test Raporlama Dashboardu (Allure Report)",
        "desc": "Burcu Çelik tarafından üstlenilen Test Raporlama Dashboardu (Allure Report) çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-08",
        "dueDate": "2026-12-13",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st486-1",
                "text": "Test Raporlama Dashboardu (Allure Report) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st486-2",
                "text": "Test Raporlama Dashboardu (Allure Report) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c587",
        "key": "TK-587",
        "title": "Mobil Kullanıcı Oturumu Güvenlik Zaman Aşımı",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Kullanıcı Oturumu Güvenlik Zaman Aşımı çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-07",
        "dueDate": "2026-12-11",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st487-1",
                "text": "Mobil Kullanıcı Oturumu Güvenlik Zaman Aşımı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st487-2",
                "text": "Mobil Kullanıcı Oturumu Güvenlik Zaman Aşımı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c588",
        "key": "TK-588",
        "title": "Yıllık Takım Üretkenlik Trendleri ve Hız Eğrisi",
        "desc": "Gamze Şahin tarafından üstlenilen Yıllık Takım Üretkenlik Trendleri ve Hız Eğrisi çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-08",
        "dueDate": "2026-12-12",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st488-1",
                "text": "Yıllık Takım Üretkenlik Trendleri ve Hız Eğrisi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st488-2",
                "text": "Yıllık Takım Üretkenlik Trendleri ve Hız Eğrisi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c589",
        "key": "TK-589",
        "title": "ISO 27001 ve SOC 2 Uyumluluk Kontrol Listesi",
        "desc": "Tolga Kurt tarafından üstlenilen ISO 27001 ve SOC 2 Uyumluluk Kontrol Listesi çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-07",
        "dueDate": "2026-12-13",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st489-1",
                "text": "ISO 27001 ve SOC 2 Uyumluluk Kontrol Listesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st489-2",
                "text": "ISO 27001 ve SOC 2 Uyumluluk Kontrol Listesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c590",
        "key": "TK-590",
        "title": "Yüksek Verimli Toplu Olay Yazımı (Bulk Writer)",
        "desc": "Derya Arslan tarafından üstlenilen Yüksek Verimli Toplu Olay Yazımı (Bulk Writer) çalışması. Sprint 49 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-08",
        "dueDate": "2026-12-11",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st490-1",
                "text": "Yüksek Verimli Toplu Olay Yazımı (Bulk Writer) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st490-2",
                "text": "Yüksek Verimli Toplu Olay Yazımı (Bulk Writer) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s49",
        "createdAt": 1796418000000
    },
    {
        "id": "c591",
        "key": "TK-591",
        "title": "Dinamik Özellik Bayrakları (Feature Flags)",
        "desc": "Ali Yılmaz tarafından üstlenilen Dinamik Özellik Bayrakları (Feature Flags) çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-14",
        "dueDate": "2026-12-18",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st491-1",
                "text": "Dinamik Özellik Bayrakları (Feature Flags) - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st491-2",
                "text": "Dinamik Özellik Bayrakları (Feature Flags) - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c592",
        "key": "TK-592",
        "title": "Yıllık Pano Analitiği Isı Haritası Bileşeni",
        "desc": "Zeynep Kaya tarafından üstlenilen Yıllık Pano Analitiği Isı Haritası Bileşeni çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-15",
        "dueDate": "2026-12-19",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st492-1",
                "text": "Yıllık Pano Analitiği Isı Haritası Bileşeni - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st492-2",
                "text": "Yıllık Pano Analitiği Isı Haritası Bileşeni - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c593",
        "key": "TK-593",
        "title": "Dinamik Şema Doğrulama ve Eksik İndeks Uyarı Motoru",
        "desc": "Mehmet Demir tarafından üstlenilen Dinamik Şema Doğrulama ve Eksik İndeks Uyarı Motoru çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-14",
        "dueDate": "2026-12-20",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st493-1",
                "text": "Dinamik Şema Doğrulama ve Eksik İndeks Uyarı Motoru - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st493-2",
                "text": "Dinamik Şema Doğrulama ve Eksik İndeks Uyarı Motoru - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c594",
        "key": "TK-594",
        "title": "Yıl Sonu Kullanıcı Memnuniyeti Anketi Metrikleri",
        "desc": "Selin Yıldız tarafından üstlenilen Yıl Sonu Kullanıcı Memnuniyeti Anketi Metrikleri çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-15",
        "dueDate": "2026-12-18",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st494-1",
                "text": "Yıl Sonu Kullanıcı Memnuniyeti Anketi Metrikleri - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st494-2",
                "text": "Yıl Sonu Kullanıcı Memnuniyeti Anketi Metrikleri - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c595",
        "key": "TK-595",
        "title": "Dağıtık Sistem Saat Senkronizasyonu Denetimi",
        "desc": "Caner Öztürk tarafından üstlenilen Dağıtık Sistem Saat Senkronizasyonu Denetimi çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-14",
        "dueDate": "2026-12-19",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st495-1",
                "text": "Dağıtık Sistem Saat Senkronizasyonu Denetimi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st495-2",
                "text": "Dağıtık Sistem Saat Senkronizasyonu Denetimi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c596",
        "key": "TK-596",
        "title": "Sürekli Güvenlik ve Zafiyet Regresyonu",
        "desc": "Burcu Çelik tarafından üstlenilen Sürekli Güvenlik ve Zafiyet Regresyonu çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-15",
        "dueDate": "2026-12-20",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st496-1",
                "text": "Sürekli Güvenlik ve Zafiyet Regresyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st496-2",
                "text": "Sürekli Güvenlik ve Zafiyet Regresyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c597",
        "key": "TK-597",
        "title": "Mobil Uygulama Paket Boyutunun Küçültülmesi",
        "desc": "Emre Aydın tarafından üstlenilen Mobil Uygulama Paket Boyutunun Küçültülmesi çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-14",
        "dueDate": "2026-12-18",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st497-1",
                "text": "Mobil Uygulama Paket Boyutunun Küçültülmesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st497-2",
                "text": "Mobil Uygulama Paket Boyutunun Küçültülmesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c598",
        "key": "TK-598",
        "title": "Çok Kiracılı Veri Ambarı Güvenlik Denetimi",
        "desc": "Gamze Şahin tarafından üstlenilen Çok Kiracılı Veri Ambarı Güvenlik Denetimi çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-15",
        "dueDate": "2026-12-19",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st498-1",
                "text": "Çok Kiracılı Veri Ambarı Güvenlik Denetimi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st498-2",
                "text": "Çok Kiracılı Veri Ambarı Güvenlik Denetimi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c599",
        "key": "TK-599",
        "title": "Yıllık Güvenlik Açığı Ödül Programı İncelemesi",
        "desc": "Tolga Kurt tarafından üstlenilen Yıllık Güvenlik Açığı Ödül Programı İncelemesi çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-14",
        "dueDate": "2026-12-20",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st499-1",
                "text": "Yıllık Güvenlik Açığı Ödül Programı İncelemesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st499-2",
                "text": "Yıllık Güvenlik Açığı Ödül Programı İncelemesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c600",
        "key": "TK-600",
        "title": "Platform Otomasyonu: Kendi Kendini İyileştiren Ağ",
        "desc": "Derya Arslan tarafından üstlenilen Platform Otomasyonu: Kendi Kendini İyileştiren Ağ çalışması. Sprint 50 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-15",
        "dueDate": "2026-12-18",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st500-1",
                "text": "Platform Otomasyonu: Kendi Kendini İyileştiren Ağ - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st500-2",
                "text": "Platform Otomasyonu: Kendi Kendini İyileştiren Ağ - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s50",
        "createdAt": 1797022800000
    },
    {
        "id": "c601",
        "key": "TK-601",
        "title": "Yıllık Altyapı Kapasite Planlaması ve Maliyet",
        "desc": "Ali Yılmaz tarafından üstlenilen Yıllık Altyapı Kapasite Planlaması ve Maliyet çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-21",
        "dueDate": "2026-12-25",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st501-1",
                "text": "Yıllık Altyapı Kapasite Planlaması ve Maliyet - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st501-2",
                "text": "Yıllık Altyapı Kapasite Planlaması ve Maliyet - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c602",
        "key": "TK-602",
        "title": "Tasarım Sistemi v2 Token Dokümantasyonu",
        "desc": "Zeynep Kaya tarafından üstlenilen Tasarım Sistemi v2 Token Dokümantasyonu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-22",
        "dueDate": "2026-12-26",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st502-1",
                "text": "Tasarım Sistemi v2 Token Dokümantasyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st502-2",
                "text": "Tasarım Sistemi v2 Token Dokümantasyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c603",
        "key": "TK-603",
        "title": "Yıllık Veritabanı Depolama Büyüme Raporu",
        "desc": "Mehmet Demir tarafından üstlenilen Yıllık Veritabanı Depolama Büyüme Raporu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-21",
        "dueDate": "2026-12-27",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st503-1",
                "text": "Yıllık Veritabanı Depolama Büyüme Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st503-2",
                "text": "Yıllık Veritabanı Depolama Büyüme Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c604",
        "key": "TK-604",
        "title": "2027 Ürün Yol Haritası ve Özellik Önceliklendirmesi",
        "desc": "Selin Yıldız tarafından üstlenilen 2027 Ürün Yol Haritası ve Özellik Önceliklendirmesi çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-22",
        "dueDate": "2026-12-25",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st504-1",
                "text": "2027 Ürün Yol Haritası ve Özellik Önceliklendirmesi - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st504-2",
                "text": "2027 Ürün Yol Haritası ve Özellik Önceliklendirmesi - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c605",
        "key": "TK-605",
        "title": "2026 Altyapı 99.99% Uptime Raporu",
        "desc": "Caner Öztürk tarafından üstlenilen 2026 Altyapı 99.99% Uptime Raporu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-21",
        "dueDate": "2026-12-26",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st505-1",
                "text": "2026 Altyapı 99.99% Uptime Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st505-2",
                "text": "2026 Altyapı 99.99% Uptime Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c606",
        "key": "TK-606",
        "title": "Yıllık Test Kalite Metrikleri Raporu",
        "desc": "Burcu Çelik tarafından üstlenilen Yıllık Test Kalite Metrikleri Raporu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-22",
        "dueDate": "2026-12-27",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st506-1",
                "text": "Yıllık Test Kalite Metrikleri Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st506-2",
                "text": "Yıllık Test Kalite Metrikleri Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c607",
        "key": "TK-607",
        "title": "2026 Mobil Mağaza Değerlendirmeleri Raporu",
        "desc": "Emre Aydın tarafından üstlenilen 2026 Mobil Mağaza Değerlendirmeleri Raporu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-21",
        "dueDate": "2026-12-25",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st507-1",
                "text": "2026 Mobil Mağaza Değerlendirmeleri Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st507-2",
                "text": "2026 Mobil Mağaza Değerlendirmeleri Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c608",
        "key": "TK-608",
        "title": "2026 Yılı Nova Mühendislik Veri Raporu",
        "desc": "Gamze Şahin tarafından üstlenilen 2026 Yılı Nova Mühendislik Veri Raporu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-22",
        "dueDate": "2026-12-26",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st508-1",
                "text": "2026 Yılı Nova Mühendislik Veri Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st508-2",
                "text": "2026 Yılı Nova Mühendislik Veri Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c609",
        "key": "TK-609",
        "title": "2026 DevSecOps Güvenlik Karnesi ve Raporu",
        "desc": "Tolga Kurt tarafından üstlenilen 2026 DevSecOps Güvenlik Karnesi ve Raporu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-21",
        "dueDate": "2026-12-27",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st509-1",
                "text": "2026 DevSecOps Güvenlik Karnesi ve Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st509-2",
                "text": "2026 DevSecOps Güvenlik Karnesi ve Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c610",
        "key": "TK-610",
        "title": "2026 Dağıtık Sistem Güvenilirlik ve SLA Raporu",
        "desc": "Derya Arslan tarafından üstlenilen 2026 Dağıtık Sistem Güvenilirlik ve SLA Raporu çalışması. Sprint 51 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-22",
        "dueDate": "2026-12-25",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st510-1",
                "text": "2026 Dağıtık Sistem Güvenilirlik ve SLA Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st510-2",
                "text": "2026 Dağıtık Sistem Güvenilirlik ve SLA Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s51",
        "createdAt": 1797627600000
    },
    {
        "id": "c611",
        "key": "TK-611",
        "title": "2027 Nova Kurumsal Mimari Kapanış Raporu",
        "desc": "Ali Yılmaz tarafından üstlenilen 2027 Nova Kurumsal Mimari Kapanış Raporu çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Ali Yılmaz",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-28",
        "dueDate": "2027-01-01",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 3,
        "estimatedEffort": 16,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st511-1",
                "text": "2027 Nova Kurumsal Mimari Kapanış Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st511-2",
                "text": "2027 Nova Kurumsal Mimari Kapanış Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e2",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c612",
        "key": "TK-612",
        "title": "Yıl Sonu UI/UX Erişilebilirlik ve Performans Raporu",
        "desc": "Zeynep Kaya tarafından üstlenilen Yıl Sonu UI/UX Erişilebilirlik ve Performans Raporu çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Zeynep Kaya",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-29",
        "dueDate": "2027-01-02",
        "labels": [
            "frontend",
            "design"
        ],
        "storyPoints": 5,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st512-1",
                "text": "Yıl Sonu UI/UX Erişilebilirlik ve Performans Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st512-2",
                "text": "Yıl Sonu UI/UX Erişilebilirlik ve Performans Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e3",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c613",
        "key": "TK-613",
        "title": "2027 Veritabanı Mimarisi Yol Haritası",
        "desc": "Mehmet Demir tarafından üstlenilen 2027 Veritabanı Mimarisi Yol Haritası çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Mehmet Demir",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-28",
        "dueDate": "2027-01-03",
        "labels": [
            "backend",
            "feature"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st513-1",
                "text": "2027 Veritabanı Mimarisi Yol Haritası - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st513-2",
                "text": "2027 Veritabanı Mimarisi Yol Haritası - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e4",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c614",
        "key": "TK-614",
        "title": "Nova Ürün Başarısı Yıllık İnceleme Raporu",
        "desc": "Selin Yıldız tarafından üstlenilen Nova Ürün Başarısı Yıllık İnceleme Raporu çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Selin Yıldız",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-29",
        "dueDate": "2027-01-01",
        "labels": [
            "feature",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st514-1",
                "text": "Nova Ürün Başarısı Yıllık İnceleme Raporu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st514-2",
                "text": "Nova Ürün Başarısı Yıllık İnceleme Raporu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e5",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c615",
        "key": "TK-615",
        "title": "2027 Bulut Mimarisi ve Küresel Ağ Genişleme Planı",
        "desc": "Caner Öztürk tarafından üstlenilen 2027 Bulut Mimarisi ve Küresel Ağ Genişleme Planı çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Caner Öztürk",
        "priority": "low",
        "col": "todo",
        "startDate": "2026-12-28",
        "dueDate": "2027-01-02",
        "labels": [
            "devops",
            "backend"
        ],
        "storyPoints": 3,
        "estimatedEffort": 20,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st515-1",
                "text": "2027 Bulut Mimarisi ve Küresel Ağ Genişleme Planı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st515-2",
                "text": "2027 Bulut Mimarisi ve Küresel Ağ Genişleme Planı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e6",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c616",
        "key": "TK-616",
        "title": "2027 QA ve Test Otomasyonu Stratejik Planı",
        "desc": "Burcu Çelik tarafından üstlenilen 2027 QA ve Test Otomasyonu Stratejik Planı çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Burcu Çelik",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-29",
        "dueDate": "2027-01-03",
        "labels": [
            "qa",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st516-1",
                "text": "2027 QA ve Test Otomasyonu Stratejik Planı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st516-2",
                "text": "2027 QA ve Test Otomasyonu Stratejik Planı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e7",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c617",
        "key": "TK-617",
        "title": "2027 Mobil Yol Haritası ve Vizyon Planı",
        "desc": "Emre Aydın tarafından üstlenilen 2027 Mobil Yol Haritası ve Vizyon Planı çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Emre Aydın",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-28",
        "dueDate": "2027-01-01",
        "labels": [
            "mobile",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 22,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st517-1",
                "text": "2027 Mobil Yol Haritası ve Vizyon Planı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st517-2",
                "text": "2027 Mobil Yol Haritası ve Vizyon Planı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e8",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c618",
        "key": "TK-618",
        "title": "2027 Tahmine Dayalı Analitik ve BI Planı",
        "desc": "Gamze Şahin tarafından üstlenilen 2027 Tahmine Dayalı Analitik ve BI Planı çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Gamze Şahin",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-29",
        "dueDate": "2027-01-02",
        "labels": [
            "analytics",
            "frontend"
        ],
        "storyPoints": 5,
        "estimatedEffort": 18,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st518-1",
                "text": "2027 Tahmine Dayalı Analitik ve BI Planı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st518-2",
                "text": "2027 Tahmine Dayalı Analitik ve BI Planı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e9",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c619",
        "key": "TK-619",
        "title": "2027 Siber Güvenlik Tehdit Modeli ve Savunma Planı",
        "desc": "Tolga Kurt tarafından üstlenilen 2027 Siber Güvenlik Tehdit Modeli ve Savunma Planı çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Tolga Kurt",
        "priority": "high",
        "col": "todo",
        "startDate": "2026-12-28",
        "dueDate": "2027-01-03",
        "labels": [
            "security",
            "backend"
        ],
        "storyPoints": 8,
        "estimatedEffort": 26,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st519-1",
                "text": "2027 Siber Güvenlik Tehdit Modeli ve Savunma Planı - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st519-2",
                "text": "2027 Siber Güvenlik Tehdit Modeli ve Savunma Planı - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e10",
        "sprintId": "s52",
        "createdAt": 1798232400000
    },
    {
        "id": "c620",
        "key": "TK-620",
        "title": "2027 Nova Dağıtık Platform Mimarisi Vizyonu",
        "desc": "Derya Arslan tarafından üstlenilen 2027 Nova Dağıtık Platform Mimarisi Vizyonu çalışması. Sprint 52 haftalık planı dahilinde yürütülmektedir.",
        "assignee": "Derya Arslan",
        "priority": "medium",
        "col": "todo",
        "startDate": "2026-12-29",
        "dueDate": "2027-01-01",
        "labels": [
            "backend",
            "devops"
        ],
        "storyPoints": 5,
        "estimatedEffort": 24,
        "spentEffort": 0,
        "subtasks": [
            {
                "id": "st520-1",
                "text": "2027 Nova Dağıtık Platform Mimarisi Vizyonu - Ön analiz ve hazırlık yapılacak",
                "done": false
            },
            {
                "id": "st520-2",
                "text": "2027 Nova Dağıtık Platform Mimarisi Vizyonu - Geliştirme ve doğrulama adımı",
                "done": false
            }
        ],
        "comments": [],
        "epicId": "e1",
        "sprintId": "s52",
        "createdAt": 1798232400000
    }
];

export function generateDemoSprints(): Sprint[] {
    return structuredClone(GENERATED_SPRINTS);
}

export function generateDemoCards(): Card[] {
    return structuredClone(GENERATED_CARDS);
}

export function createDefaultDemoDb(): DbSchema {
    const cards = generateDemoCards();
    const sprints = generateDemoSprints();
    return {
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
        labels: DEMO_LABELS,
        notifications: [],
        taskCounter: cards.length + 100,
        workspaces: [
            {
                id: "demo",
                name: "Demo Panosu (Nova Takımı)",
                type: "team",
                ownerId: "usr-1",
                createdAt: 1767571200000
            }
        ],
        logs: []
    };
}

export const YIGITCAN_USER_CARDS: Card[] = [
    {
        id: "card-user-avukat",
        key: "TK-11",
        title: "Avukat ile Görüş",
        desc: "",
        assignee: "Yiğitcan Genç",
        priority: "medium",
        col: "todo",
        startDate: null,
        dueDate: "2026-09-21",
        labels: [],
        storyPoints: null,
        estimatedEffort: null,
        spentEffort: null,
        subtasks: [],
        comments: [],
        epicId: null,
        sprintId: null,
        createdAt: 1789555200000
    },
    {
        id: "card-user-kanbanduzelt",
        key: "TK-12",
        title: "Kanban'ı düzelt",
        desc: "",
        assignee: "Yiğitcan Genç",
        priority: "medium",
        col: "doing",
        startDate: null,
        dueDate: "2026-09-30",
        labels: ["lbl-websiteleri"],
        storyPoints: null,
        estimatedEffort: null,
        spentEffort: null,
        subtasks: [],
        comments: [],
        epicId: null,
        sprintId: null,
        createdAt: 1789555200000
    },
    {
        id: "card-user-kanbanmail",
        key: "TK-13",
        title: "Kanban'a mail bağla",
        desc: "",
        assignee: "Yiğitcan Genç",
        priority: "medium",
        col: "doing",
        startDate: null,
        dueDate: "2026-09-30",
        labels: ["lbl-websiteleri"],
        storyPoints: null,
        estimatedEffort: null,
        spentEffort: null,
        subtasks: [],
        comments: [],
        epicId: null,
        sprintId: null,
        createdAt: 1789555200000
    },
    {
        id: "card-user-auzef",
        key: "TK-14",
        title: "AUZEF Kayıt",
        desc: "",
        assignee: "Yiğitcan Genç",
        priority: "medium",
        col: "doing",
        startDate: null,
        dueDate: "2026-09-20",
        labels: [],
        storyPoints: null,
        estimatedEffort: null,
        spentEffort: null,
        subtasks: [],
        comments: [],
        epicId: null,
        sprintId: null,
        createdAt: 1789555200000
    },
    {
        id: "card-user-corepos",
        key: "TK-15",
        title: "Corepos yayınla",
        desc: "",
        assignee: "Yiğitcan Genç",
        priority: "medium",
        col: "done",
        startDate: null,
        dueDate: "2026-09-17",
        labels: [],
        storyPoints: null,
        estimatedEffort: null,
        spentEffort: null,
        subtasks: [],
        comments: [],
        epicId: null,
        sprintId: null,
        createdAt: 1789555200000
    }
];
