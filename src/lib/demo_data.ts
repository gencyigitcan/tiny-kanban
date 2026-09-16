// ============================================================
//  demo_data.ts – 2026-2027 Calendar Years Demo Dataset
//  Nova Mühendislik Takımı: 10 Kişilik Ekip & 52 Sprint
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

export function generateDemoSprints(): Sprint[] {
    const sprints: Sprint[] = [];
    let start = new Date('2026-01-05');
    const today = new Date('2026-09-16');

    for (let i = 1; i <= 52; i++) {
        const startStr = start.toISOString().slice(0, 10);
        const end = new Date(start);
        end.setDate(end.getDate() + 13);
        const endStr = end.toISOString().slice(0, 10);
        const active = (today >= start && today <= end) || i === 19;

        sprints.push({
            id: `s${i}`,
            name: `Sprint ${i}`,
            startDate: startStr,
            endDate: endStr,
            active: active,
            createdAt: start.getTime() - 86400000 * 3
        });

        start.setDate(start.getDate() + 14);
    }
    return sprints;
}

export function generateDemoCards(): Card[] {
    return [
        {
            id: 'c101', key: 'TK-101',
            title: 'TypeScript ve Monorepo Altyapısının Kurulması',
            desc: 'ESLint, Prettier kuralları ve strict TypeScript derleme konfigürasyonu tamamlandı.',
            assignee: 'Ali Yılmaz', priority: 'high', col: 'done',
            startDate: '2026-01-05', dueDate: '2026-01-12', labels: ['devops', 'backend'],
            storyPoints: 5, estimatedEffort: 16, spentEffort: 14,
            subtasks: [{ id: 'st101-1', text: 'TurboRepo yapısı kuruldu', done: true }, { id: 'st101-2', text: 'Ortak tsconfig ayarlandı', done: true }],
            comments: [{ id: 'cm101-1', text: 'Tüm monorepo paketleri sorunsuz derleniyor.', createdAt: 1767744000000, author: 'Ali Yılmaz' }],
            epicId: 'e5', sprintId: 's1', createdAt: 1767571200000
        },
        {
            id: 'c102', key: 'TK-102',
            title: 'GitHub Actions CI/CD Pipeline & Otomasyon',
            desc: 'Otomatik test, lint ve Cloudflare Workers test dağıtım pipeline entegrasyonu.',
            assignee: 'Caner Öztürk', priority: 'medium', col: 'done',
            startDate: '2026-01-08', dueDate: '2026-01-17', labels: ['devops'],
            storyPoints: 3, estimatedEffort: 10, spentEffort: 12,
            subtasks: [{ id: 'st102-1', text: 'Lint & Test workflow', done: true }, { id: 'st102-2', text: 'Cloudflare Pages token tanımlaması', done: true }],
            comments: [], epicId: 'e5', sprintId: 's1', createdAt: 1767830400000
        },
        {
            id: 'c103', key: 'TK-103',
            title: 'Tasarım Sistemi Tokenları ve UI Bileşen Kitaplığı',
            desc: 'Renk paleti, tipografi, butonlar, modallar ve modern karanlık tema bileşenleri.',
            assignee: 'Zeynep Kaya', priority: 'high', col: 'done',
            startDate: '2026-01-19', dueDate: '2026-01-28', labels: ['frontend', 'design'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 18,
            subtasks: [{ id: 'st103-1', text: 'Figma tokenları CSS değişkenlerine aktarıldı', done: true }, { id: 'st103-2', text: 'Modal & Toast bileşenleri kodlandı', done: true }],
            comments: [{ id: 'cm103-1', text: 'Renk kontrast oranları WCAG AA standardını geçti.', createdAt: 1769040000000, author: 'Zeynep Kaya' }],
            epicId: 'e6', sprintId: 's2', createdAt: 1768780800000
        },
        {
            id: 'c104', key: 'TK-104',
            title: 'JWT Tabanlı Oturum ve RBAC Yetkilendirme Servisi',
            desc: 'Superadmin, admin ve user rolleri için yetki kontrol mekanizması ve HTTP-only cookie desteği.',
            assignee: 'Derya Arslan', priority: 'high', col: 'done',
            startDate: '2026-01-20', dueDate: '2026-01-30', labels: ['backend', 'security'],
            storyPoints: 8, estimatedEffort: 24, spentEffort: 26,
            subtasks: [{ id: 'st104-1', text: 'Token üretimi ve doğrulama', done: true }, { id: 'st104-2', text: 'Middleware yetki katmanı', done: true }],
            comments: [], epicId: 'e1', sprintId: 's2', createdAt: 1768867200000
        },
        {
            id: 'c105', key: 'TK-105',
            title: 'Kullanıcı Profil ve Çoklu Çalışma Alanı Yönetimi',
            desc: 'Kullanıcıların kendi çalışma alanları arasında geçiş yapabilmesi ve takımlara üye olabilmesi.',
            assignee: 'Mehmet Demir', priority: 'medium', col: 'done',
            startDate: '2026-02-02', dueDate: '2026-02-12', labels: ['feature', 'backend'],
            storyPoints: 5, estimatedEffort: 16, spentEffort: 15,
            subtasks: [{ id: 'st105-1', text: 'Workspace switcher arayüzü', done: true }, { id: 'st105-2', text: 'Takım üyesi ekleme API', done: true }],
            comments: [], epicId: 'e1', sprintId: 's3', createdAt: 1769990400000
        },
        {
            id: 'c106', key: 'TK-106',
            title: 'WCAG 2.1 AA Erişilebilirlik ve Klavye Kısayolları (N, Esc)',
            desc: 'Klavye ile kart açma, hızlı oluşturma, ekran okuyucu aria etiketleri.',
            assignee: 'Zeynep Kaya', priority: 'low', col: 'done',
            startDate: '2026-02-16', dueDate: '2026-02-25', labels: ['frontend'],
            storyPoints: 3, estimatedEffort: 12, spentEffort: 10,
            subtasks: [], comments: [], epicId: 'e6', sprintId: 's4', createdAt: 1771200000000
        },
        {
            id: 'c107', key: 'TK-107',
            title: 'Stripe & İyzico Ödeme Ağ Geçidi Entegrasyonu',
            desc: 'Kredi kartı ve 3D Secure ödeme altyapısı, webhook dinleyicileri.',
            assignee: 'Ali Yılmaz', priority: 'high', col: 'done',
            startDate: '2026-03-02', dueDate: '2026-03-14', labels: ['feature', 'backend'],
            storyPoints: 8, estimatedEffort: 30, spentEffort: 32,
            subtasks: [{ id: 'st107-1', text: 'Stripe Checkout API', done: true }, { id: 'st107-2', text: 'İyzico 3DS callback', done: true }],
            comments: [], epicId: 'e2', sprintId: 's5', createdAt: 1772409600000
        },
        {
            id: 'c108', key: 'TK-108',
            title: 'Abonelik ve Yinelenen Fatura Servisi',
            desc: 'Pro plan üyelik döngüleri, fatura PDF üretimi ve e-posta bildirimi.',
            assignee: 'Mehmet Demir', priority: 'medium', col: 'done',
            startDate: '2026-03-04', dueDate: '2026-03-13', labels: ['feature'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 19,
            subtasks: [], comments: [], epicId: 'e2', sprintId: 's5', createdAt: 1772582400000
        },
        {
            id: 'c109', key: 'TK-109',
            title: 'React Native iOS & Android Çekirdek Uygulama Kurulumu',
            desc: 'Mobil mimari, React Navigation 7, Zustand durum yönetimi ve splash ekranı.',
            assignee: 'Emre Aydın', priority: 'high', col: 'done',
            startDate: '2026-03-16', dueDate: '2026-03-27', labels: ['mobile'],
            storyPoints: 8, estimatedEffort: 32, spentEffort: 35,
            subtasks: [{ id: 'st109-1', text: 'iOS Cocoapods ve Android Gradle yapılandırması', done: true }, { id: 'st109-2', text: 'Offline MMKV depolama', done: true }],
            comments: [{ id: 'cm109-1', text: 'TestFlight ve Google Internal Test dağıtımı yapıldı.', createdAt: 1774396800000, author: 'Emre Aydın' }],
            epicId: 'e3', sprintId: 's6', createdAt: 1773619200000
        },
        {
            id: 'c110', key: 'TK-110',
            title: 'Mobil Kanban Panosu Sürükle-Bırak & Dokunmatik Jestler',
            desc: 'Reanimated 3 ve Gesture Handler ile 60 FPS akıcı kart taşıma deneyimi.',
            assignee: 'Emre Aydın', priority: 'medium', col: 'done',
            startDate: '2026-03-30', dueDate: '2026-04-10', labels: ['mobile', 'frontend'],
            storyPoints: 5, estimatedEffort: 24, spentEffort: 22,
            subtasks: [], comments: [], epicId: 'e3', sprintId: 's7', createdAt: 1774828800000
        },
        {
            id: 'c111', key: 'TK-111',
            title: 'Kubernetes Helm Chart & Cluster Autoscaling',
            desc: 'HPA (Horizontal Pod Autoscaler), Ingress Controller ve SSL sertifika otomasyonu.',
            assignee: 'Caner Öztürk', priority: 'high', col: 'done',
            startDate: '2026-04-13', dueDate: '2026-04-24', labels: ['devops'],
            storyPoints: 8, estimatedEffort: 28, spentEffort: 30,
            subtasks: [], comments: [], epicId: 'e5', sprintId: 's8', createdAt: 1776038400000
        },
        {
            id: 'c112', key: 'TK-112',
            title: 'OWASP Top 10 Güvenlik Taraması & Zafiyet Yamaları',
            desc: 'SQL injection, XSS, CSRF testleri, CSP ve HSTS güvenlik başlıklarının güçlendirilmesi.',
            assignee: 'Tolga Kurt', priority: 'high', col: 'done',
            startDate: '2026-04-27', dueDate: '2026-05-08', labels: ['security'],
            storyPoints: 5, estimatedEffort: 18, spentEffort: 16,
            subtasks: [{ id: 'st112-1', text: 'ZAP ve Burp Suite taraması', done: true }, { id: 'st112-2', text: 'Helmet güvenlik başlıkları konfigürasyonu', done: true }],
            comments: [{ id: 'cm112-1', text: 'A+ SSL ve güvenlik puanı alındı.', createdAt: 1778025600000, author: 'Tolga Kurt' }],
            epicId: 'e9', sprintId: 's9', createdAt: 1777248000000
        },
        {
            id: 'c113', key: 'TK-113',
            title: 'Efor ve Performans Analitik Veri Modeli Tasarımı',
            desc: 'Kullanıcı bazlı saatlik efor, sapma hesaplama ve sprint burn-down veri yapıları.',
            assignee: 'Gamze Şahin', priority: 'medium', col: 'done',
            startDate: '2026-05-11', dueDate: '2026-05-22', labels: ['backend', 'analytics'],
            storyPoints: 8, estimatedEffort: 26, spentEffort: 24,
            subtasks: [], comments: [], epicId: 'e4', sprintId: 's10', createdAt: 1778457600000
        },
        {
            id: 'c114', key: 'TK-114',
            title: 'Dashboard Hızlı Metrik Kartları ve Gerçek Zamanlı Grafikler',
            desc: 'Toplam görev, story points, tamamlanma yüzdesi ve geciken görevler paneli.',
            assignee: 'Gamze Şahin', priority: 'medium', col: 'done',
            startDate: '2026-05-25', dueDate: '2026-06-04', labels: ['frontend', 'analytics'],
            storyPoints: 5, estimatedEffort: 18, spentEffort: 20,
            subtasks: [], comments: [], epicId: 'e4', sprintId: 's11', createdAt: 1779667200000
        },
        {
            id: 'c115', key: 'TK-115',
            title: 'Gantt Çizelgesi Zaman Çizelgesi ve Bağımlılık Çizgileri',
            desc: 'Tarih aralığına göre otomatik ölçeklenen interaktif Gantt grafiği.',
            assignee: 'Zeynep Kaya', priority: 'high', col: 'done',
            startDate: '2026-06-08', dueDate: '2026-06-19', labels: ['frontend', 'design'],
            storyPoints: 8, estimatedEffort: 30, spentEffort: 28,
            subtasks: [{ id: 'st115-1', text: 'Zaman çizgisi başlıkları', done: true }, { id: 'st115-2', text: 'Kart detay popover entegrasyonu', done: true }],
            comments: [], epicId: 'e6', sprintId: 's12', createdAt: 1780876800000
        },
        {
            id: 'c116', key: 'TK-116',
            title: 'Kullanıcı Onay Mekanizması & Super Admin Bildirimleri',
            desc: 'Yeni kayıt olan kullanıcıların onay kuyruğuna düşmesi ve yönetici onayıyla aktifleşmesi.',
            assignee: 'Selin Yıldız', priority: 'high', col: 'done',
            startDate: '2026-06-22', dueDate: '2026-07-03', labels: ['feature'],
            storyPoints: 5, estimatedEffort: 16, spentEffort: 14,
            subtasks: [], comments: [], epicId: 'e1', sprintId: 's13', createdAt: 1782086400000
        },
        {
            id: 'c117', key: 'TK-117',
            title: 'Otomatik E2E Test Suite (Cypress & Playwright)',
            desc: 'Giriş, kart oluşturma, sürükle-bırak, filtreleme ve raporlama E2E senaryoları.',
            assignee: 'Burcu Çelik', priority: 'high', col: 'done',
            startDate: '2026-07-06', dueDate: '2026-07-17', labels: ['qa'],
            storyPoints: 8, estimatedEffort: 32, spentEffort: 30,
            subtasks: [{ id: 'st117-1', text: 'Auth & Board E2E testleri', done: true }, { id: 'st117-2', text: 'Gantt & Report test senaryoları', done: true }],
            comments: [{ id: 'cm117-1', text: '142 test senaryosu CI ortamında yeşil.', createdAt: 1784332800000, author: 'Burcu Çelik' }],
            epicId: 'e6', sprintId: 's14', createdAt: 1783296000000
        },
        {
            id: 'c118', key: 'TK-118',
            title: 'Cloudflare Workers Edge Önbellekleme & Global CDN',
            desc: 'Statik varlıklar ve API sorguları için akıllı önbellek politikası.',
            assignee: 'Caner Öztürk', priority: 'medium', col: 'done',
            startDate: '2026-07-20', dueDate: '2026-07-30', labels: ['devops'],
            storyPoints: 5, estimatedEffort: 18, spentEffort: 16,
            subtasks: [], comments: [], epicId: 'e5', sprintId: 's15', createdAt: 1784505600000
        },
        {
            id: 'c119', key: 'TK-119',
            title: 'Audit Log (Aktivite Günlüğü) ve IP Filtreleme Modülü',
            desc: 'Kart ve kullanıcı işlemlerinin detaylı loglanması, Super Admin log izleme ekranı.',
            assignee: 'Tolga Kurt', priority: 'medium', col: 'done',
            startDate: '2026-08-03', dueDate: '2026-08-14', labels: ['security'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 22,
            subtasks: [], comments: [], epicId: 'e9', sprintId: 's16', createdAt: 1785715200000
        },
        {
            id: 'c120', key: 'TK-120',
            title: 'Çok Kiracılı (Multi-Tenant) D1 Veritabanı Ayrımı',
            desc: 'Takımlar ve kişisel panolar için bağımsız D1 anahtarları ve veri izolasyonu.',
            assignee: 'Derya Arslan', priority: 'high', col: 'done',
            startDate: '2026-08-17', dueDate: '2026-08-28', labels: ['backend'],
            storyPoints: 8, estimatedEffort: 28, spentEffort: 27,
            subtasks: [], comments: [], epicId: 'e1', sprintId: 's17', createdAt: 1786924800000
        },
        {
            id: 'c121', key: 'TK-121',
            title: 'Regresyon Testleri ve v1.3 Sürüm Doğrulaması',
            desc: 'Tüm modüllerin çapraz doğrulaması, performans profil çıkarması.',
            assignee: 'Burcu Çelik', priority: 'medium', col: 'done',
            startDate: '2026-08-31', dueDate: '2026-09-11', labels: ['qa'],
            storyPoints: 5, estimatedEffort: 18, spentEffort: 17,
            subtasks: [], comments: [{ id: 'cm121-1', text: 'v1.3.0 sürüm adayında engelleyici hata kalmadı.', createdAt: 1789123200000, author: 'Burcu Çelik' }],
            epicId: 'e6', sprintId: 's18', createdAt: 1788134400000
        },

        // SPRINT 19 (AKTİF SPRINT)
        {
            id: 'c122', key: 'TK-122',
            title: 'CSV / PDF Gelişmiş Rapor Dışa Aktarma Motoru',
            desc: 'Efor ve proje ilerleme raporunun filtrelenmiş şekilde CSV ve vektörel PDF çıktısının alınması.',
            assignee: 'Zeynep Kaya', priority: 'high', col: 'doing',
            startDate: '2026-09-14', dueDate: '2026-09-22', labels: ['frontend', 'analytics'],
            storyPoints: 5, estimatedEffort: 16, spentEffort: 12,
            subtasks: [
                { id: 'st122-1', text: 'CSV BOM karakter kodlama desteği', done: true },
                { id: 'st122-2', text: 'Yazıcı / PDF stil şablonu', done: true },
                { id: 'st122-3', text: 'Kişi bazlı filtreli dışa aktarma', done: false }
            ],
            comments: [{ id: 'cm122-1', text: 'Excel Türkçe karakter sorunu UTF-8 BOM ile çözüldü.', createdAt: 1789555200000, author: 'Zeynep Kaya' }],
            epicId: 'e4', sprintId: 's19', createdAt: 1789344000000
        },
        {
            id: 'c123', key: 'TK-123',
            title: 'Çift Yönlü Webhook Dağıtım Servisi ve Retry Mekanizması',
            desc: 'Kart güncellemelerinde harici servislere HMAC imzalı webhook fırlatma ve exponential backoff.',
            assignee: 'Ali Yılmaz', priority: 'high', col: 'doing',
            startDate: '2026-09-14', dueDate: '2026-09-24', labels: ['backend'],
            storyPoints: 8, estimatedEffort: 24, spentEffort: 18,
            subtasks: [
                { id: 'st123-1', text: 'Webhook payload şablonları', done: true },
                { id: 'st123-2', text: 'HMAC SHA256 imzalama', done: true },
                { id: 'st123-3', text: 'Kuyruk ve 3x tekrar deneme (retry)', done: false }
            ],
            comments: [{ id: 'cm123-1', text: 'Test endpointlerine teslimat gecikmesi < 15ms.', createdAt: 1789560000000, author: 'Ali Yılmaz' }],
            epicId: 'e10', sprintId: 's19', createdAt: 1789344000000
        },
        {
            id: 'c124', key: 'TK-124',
            title: 'Mobil Bildirim Servisi (APNs & FCM Entegrasyonu)',
            desc: 'Görevin kullanıcıya atanması veya son teslim tarihine 24 saat kala anlık push bildirim gönderimi.',
            assignee: 'Emre Aydın', priority: 'medium', col: 'doing',
            startDate: '2026-09-15', dueDate: '2026-09-23', labels: ['mobile'],
            storyPoints: 5, estimatedEffort: 18, spentEffort: 14,
            subtasks: [
                { id: 'st124-1', text: 'Apple Push Notification key konfigürasyonu', done: true },
                { id: 'st124-2', text: 'Firebase Cloud Messaging Android kurulumu', done: true },
                { id: 'st124-3', text: 'Kullanıcı bildirim izin istemi', done: false }
            ],
            comments: [], epicId: 'e3', sprintId: 's19', createdAt: 1789430400000
        },
        {
            id: 'c125', key: 'TK-125',
            title: 'İki Aşamalı Doğrulama (2FA / TOTP) Modülü',
            desc: 'Google Authenticator uyumlu QR kod ile 2 faktörlü kimlik doğrulama.',
            assignee: 'Tolga Kurt', priority: 'high', col: 'doing',
            startDate: '2026-09-15', dueDate: '2026-09-25', labels: ['security'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 10,
            subtasks: [
                { id: 'st125-1', text: 'TOTP gizli anahtar üretimi', done: true },
                { id: 'st125-2', text: 'Yedek kurtarma kodları', done: false }
            ],
            comments: [], epicId: 'e9', sprintId: 's19', createdAt: 1789430400000
        },
        {
            id: 'c126', key: 'TK-126',
            title: 'Dinamik Takım Davet Linkleri ve E-posta Doğrulaması',
            desc: 'Belirli bir süre geçerli güvenli davet tokenları oluşturma ve tek tıkla takıma dahil olma.',
            assignee: 'Derya Arslan', priority: 'medium', col: 'done',
            startDate: '2026-09-14', dueDate: '2026-09-18', labels: ['backend'],
            storyPoints: 3, estimatedEffort: 12, spentEffort: 12,
            subtasks: [{ id: 'st126-1', text: 'Davet token modeli', done: true }, { id: 'st126-2', text: 'E-posta şablonu tasarımı', done: true }],
            comments: [{ id: 'cm126-1', text: 'Canlı test ortamında davet akışı onaylandı.', createdAt: 1789600000000, author: 'Derya Arslan' }],
            epicId: 'e1', sprintId: 's19', createdAt: 1789344000000
        },
        {
            id: 'c127', key: 'TK-127',
            title: 'Gerçek Zamanlı Sprint Velocity ve Burn-Down Hesaplayıcı',
            desc: 'Sprint içerisindeki tamamlanan story point hızını geçmiş sprint ortalamalarıyla kıyaslayan motor.',
            assignee: 'Gamze Şahin', priority: 'medium', col: 'done',
            startDate: '2026-09-14', dueDate: '2026-09-19', labels: ['analytics'],
            storyPoints: 5, estimatedEffort: 18, spentEffort: 18,
            subtasks: [{ id: 'st127-1', text: 'Velocity algoritması', done: true }, { id: 'st127-2', text: 'Rapor ekranına görsel entegrasyon', done: true }],
            comments: [], epicId: 'e4', sprintId: 's19', createdAt: 1789344000000
        },
        {
            id: 'c128', key: 'TK-128',
            title: 'Sprint 19 Çapraz Tarayıcı ve Yük Testleri',
            desc: 'Safari, Chrome, Firefox ve Edge üzerinde 100 eşzamanlı kullanıcıyla stres testi.',
            assignee: 'Burcu Çelik', priority: 'medium', col: 'doing',
            startDate: '2026-09-16', dueDate: '2026-09-26', labels: ['qa'],
            storyPoints: 5, estimatedEffort: 16, spentEffort: 10,
            subtasks: [{ id: 'st128-1', text: 'k6 yük testi senaryosu', done: true }, { id: 'st128-2', text: 'Mobil tarayıcı uyumluluğu', done: false }],
            comments: [{ id: 'cm128-1', text: 'Ortalama API yanıt süresi 42ms olarak ölçüldü.', createdAt: 1789640000000, author: 'Burcu Çelik' }],
            epicId: 'e6', sprintId: 's19', createdAt: 1789516800000
        },
        {
            id: 'c129', key: 'TK-129',
            title: 'Prometheus & Grafana AlertManager Bildirim Kuralları',
            desc: 'CPU %80 ve bellek %85 sınırında Discord ve Slack kanalına otomatik alarm tetikleme.',
            assignee: 'Caner Öztürk', priority: 'medium', col: 'done',
            startDate: '2026-09-14', dueDate: '2026-09-17', labels: ['devops'],
            storyPoints: 3, estimatedEffort: 10, spentEffort: 10,
            subtasks: [], comments: [], epicId: 'e5', sprintId: 's19', createdAt: 1789344000000
        },
        {
            id: 'c130', key: 'TK-130',
            title: 'Q4 2026 Sprint Hedefleri ve Backlog Arındırma (Refinement)',
            desc: 'Son çeyrek hedefleri, kurumsal müşteri talepleri ve teknik borç temizliği planlaması.',
            assignee: 'Selin Yıldız', priority: 'low', col: 'doing',
            startDate: '2026-09-15', dueDate: '2026-09-21', labels: ['feature'],
            storyPoints: 3, estimatedEffort: 8, spentEffort: 6,
            subtasks: [], comments: [], epicId: 'e1', sprintId: 's19', createdAt: 1789430400000
        },
        {
            id: 'c131', key: 'TK-131',
            title: 'Developer API Dokümantasyonu (Swagger / OpenAPI v3)',
            desc: 'Tüm REST endpointlerinin parametre, yanıt ve kimlik doğrulama şemalarıyla dokümante edilmesi.',
            assignee: 'Mehmet Demir', priority: 'medium', col: 'todo',
            startDate: '2026-09-18', dueDate: '2026-09-27', labels: ['docs'],
            storyPoints: 5, estimatedEffort: 14, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e10', sprintId: 's19', createdAt: 1789516800000
        },

        // Q4 2026 ROADMAP
        {
            id: 'c132', key: 'TK-132',
            title: 'Mobil Çevrimdışı Çalışma (Offline Queue & Sync)',
            desc: 'İnternet bağlantısı kesildiğinde yerel SQLite veritabanında çalışıp bağlanınca otomatik eşitleme.',
            assignee: 'Emre Aydın', priority: 'high', col: 'todo',
            startDate: '2026-09-28', dueDate: '2026-10-08', labels: ['mobile'],
            storyPoints: 8, estimatedEffort: 30, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e3', sprintId: 's20', createdAt: 1789603200000
        },
        {
            id: 'c133', key: 'TK-133',
            title: 'Kurumsal SAML 2.0 & Okta SSO Desteği',
            desc: 'Büyük ölçekli kurumsal müşteriler için Active Directory ve Okta tekil oturum açma entegrasyonu.',
            assignee: 'Tolga Kurt', priority: 'high', col: 'todo',
            startDate: '2026-10-12', dueDate: '2026-10-22', labels: ['security'],
            storyPoints: 8, estimatedEffort: 32, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e9', sprintId: 's21', createdAt: 1789603200000
        },
        {
            id: 'c134', key: 'TK-134',
            title: 'Özel Dashboard Widget Oluşturucu (Custom Widgets)',
            desc: 'Kullanıcıların panoya özel metrik kartları ve sürükle-bırak grafikler ekleyebilmesi.',
            assignee: 'Gamze Şahin', priority: 'medium', col: 'todo',
            startDate: '2026-10-26', dueDate: '2026-11-05', labels: ['frontend', 'analytics'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e4', sprintId: 's22', createdAt: 1789603200000
        },
        {
            id: 'c135', key: 'TK-135',
            title: 'Multi-Region Veritabanı Yük Dengeleme ve Okuma Replikaları',
            desc: 'Avrupa, Asya ve Amerika sunucularında < 20ms okuma gecikmesi sağlayan replikasyon ağı.',
            assignee: 'Caner Öztürk', priority: 'high', col: 'todo',
            startDate: '2026-11-09', dueDate: '2026-11-19', labels: ['devops', 'backend'],
            storyPoints: 8, estimatedEffort: 34, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e5', sprintId: 's23', createdAt: 1789603200000
        },
        {
            id: 'c136', key: 'TK-136',
            title: 'Zapier & Make.com Entegrasyon Eklentisi',
            desc: 'Kod yazmadan 5000+ popüler uygulamayla iki yönlü tetikleyici ve aksiyon köprüsü.',
            assignee: 'Mehmet Demir', priority: 'medium', col: 'todo',
            startDate: '2026-11-23', dueDate: '2026-12-03', labels: ['feature'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e10', sprintId: 's24', createdAt: 1789603200000
        },
        {
            id: 'c137', key: 'TK-137',
            title: 'Kullanıcı Deneyimi (UX) ve Mobil Arayüz Yenilemesi',
            desc: 'Mikro etkileşimler, akıcı sayfa geçişleri ve cam efekti (glassmorphism) tasarım revizyonu.',
            assignee: 'Zeynep Kaya', priority: 'medium', col: 'todo',
            startDate: '2026-12-07', dueDate: '2026-12-17', labels: ['design', 'frontend'],
            storyPoints: 5, estimatedEffort: 22, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e6', sprintId: 's25', createdAt: 1789603200000
        },
        {
            id: 'c138', key: 'TK-138',
            title: '2026 Yıl Sonu Sürüm Kapanışı & v2.0 Geçiş Hazırlığı',
            desc: 'Yıllık performans çıktısı, teknik borç envanteri ve 2027 v2.0 geçiş planlaması.',
            assignee: 'Selin Yıldız', priority: 'low', col: 'todo',
            startDate: '2026-12-21', dueDate: '2026-12-30', labels: ['docs'],
            storyPoints: 5, estimatedEffort: 16, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e1', sprintId: 's26', createdAt: 1789603200000
        },

        // 2027 YOL HARİTASI
        {
            id: 'c139', key: 'TK-139',
            title: 'Yapay Zeka Destekli Görev Özeti ve Efor Tahmin Modeli',
            desc: 'Görev başlığı ve açıklamasına göre otomatik story points ve tahmini saat öneren LLM motoru.',
            assignee: 'Ali Yılmaz', priority: 'high', col: 'todo',
            startDate: '2027-01-04', dueDate: '2027-01-15', labels: ['backend', 'ai'],
            storyPoints: 8, estimatedEffort: 36, spentEffort: 0,
            subtasks: [{ id: 'st139-1', text: 'Geçmiş 1 yıllık sprint verileriyle model eğitimi', done: false }, { id: 'st139-2', text: 'Tek tıkla kart özetleme arayüzü', done: false }],
            comments: [], epicId: 'e7', sprintId: 's27', createdAt: 1798934400000
        },
        {
            id: 'c140', key: 'TK-140',
            title: 'Otomatik Risk Tespiti ve Sprint Gecikme Erken Uyarı Motoru',
            desc: 'Gecikme eğilimi gösteren görevleri harcanan efor sapmasına göre tespit edip lideri uyaran sistem.',
            assignee: 'Gamze Şahin', priority: 'high', col: 'todo',
            startDate: '2027-01-18', dueDate: '2027-01-29', labels: ['analytics', 'ai'],
            storyPoints: 8, estimatedEffort: 32, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e7', sprintId: 's28', createdAt: 1800144000000
        },
        {
            id: 'c141', key: 'TK-141',
            title: 'Global Edge Computing & Dağıtık Event Bus Mimarisi',
            desc: 'Tüm dünyada 300+ edge lokasyonunda çalışan sunucusuz olay yönlendirme altyapısı.',
            assignee: 'Caner Öztürk', priority: 'high', col: 'todo',
            startDate: '2027-02-15', dueDate: '2027-02-26', labels: ['devops'],
            storyPoints: 13, estimatedEffort: 44, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e8', sprintId: 's30', createdAt: 1802563200000
        },
        {
            id: 'c142', key: 'TK-142',
            title: 'Mikroservis Mimarisine Geçiş & gRPC Servisler Arası İletişim',
            desc: 'Yüksek hacimli veri akışlarında JSON yerine ikili Protocol Buffers ve gRPC standardı.',
            assignee: 'Derya Arslan', priority: 'high', col: 'todo',
            startDate: '2027-03-15', dueDate: '2027-03-26', labels: ['backend'],
            storyPoints: 8, estimatedEffort: 36, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e8', sprintId: 's32', createdAt: 1804982400000
        },
        {
            id: 'c143', key: 'TK-143',
            title: 'Mobil Tablet ve iPad Çoklu Pencere & Kalem Desteği',
            desc: 'Apple Pencil ve Samsung S-Pen ile kartlara serbest çizim notları ve diyagram ekleme.',
            assignee: 'Emre Aydın', priority: 'medium', col: 'todo',
            startDate: '2027-04-12', dueDate: '2027-04-23', labels: ['mobile'],
            storyPoints: 5, estimatedEffort: 24, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e3', sprintId: 's34', createdAt: 1807401600000
        },
        {
            id: 'c144', key: 'TK-144',
            title: 'LLM Destekli Doğal Dil ile Kart ve Sprint Filtreleme',
            desc: '"Bu sprintte Zeynep\'in yaptığı acil işleri göster" gibi doğal Türkçe komutlarla anlık filtreleme.',
            assignee: 'Zeynep Kaya', priority: 'medium', col: 'todo',
            startDate: '2027-05-10', dueDate: '2027-05-21', labels: ['frontend', 'ai'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e7', sprintId: 's36', createdAt: 1809820800000
        },
        {
            id: 'c145', key: 'TK-145',
            title: 'SOC2 Type II ve ISO 27001 Uyumluluk Denetim Hazırlığı',
            desc: 'Şifreleme standartları, veri saklama politikaları ve bağımsız üçüncü taraf denetim raporu.',
            assignee: 'Tolga Kurt', priority: 'high', col: 'todo',
            startDate: '2027-06-07', dueDate: '2027-06-18', labels: ['security'],
            storyPoints: 8, estimatedEffort: 40, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e9', sprintId: 's38', createdAt: 1812240000000
        },
        {
            id: 'c146', key: 'TK-146',
            title: 'Kaos Mühendisliği (Chaos Engineering) ve Otomatik Dayanıklılık Testleri',
            desc: 'Rastgele pod ve ağ kesintilerinde sistemin 0 kesintiyle (zero-downtime) kendini toparlaması testi.',
            assignee: 'Burcu Çelik', priority: 'medium', col: 'todo',
            startDate: '2027-07-05', dueDate: '2027-07-16', labels: ['qa', 'devops'],
            storyPoints: 5, estimatedEffort: 24, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e6', sprintId: 's40', createdAt: 1814659200000
        },
        {
            id: 'c147', key: 'TK-147',
            title: 'Kanban Public SDK v3 (Python, Go, Node.js Paketleri)',
            desc: 'Müşteri geliştiricilerinin sistemle doğrudan entegre olabilmesi için resmi SDK kütüphaneleri.',
            assignee: 'Mehmet Demir', priority: 'medium', col: 'todo',
            startDate: '2027-08-02', dueDate: '2027-08-13', labels: ['backend'],
            storyPoints: 8, estimatedEffort: 34, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e10', sprintId: 's42', createdAt: 1817078400000
        },
        {
            id: 'c148', key: 'TK-148',
            title: 'AI Akıllı Görev Atama (Yetkinlik ve İş Yüküne Göre Öneri)',
            desc: 'Ekip üyelerinin geçmiş uzmanlık alanları ve anlık haftalık saat yüküne göre en uygun kişiyi önerme.',
            assignee: 'Ali Yılmaz', priority: 'high', col: 'todo',
            startDate: '2027-09-13', dueDate: '2027-09-24', labels: ['ai'],
            storyPoints: 8, estimatedEffort: 32, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e7', sprintId: 's45', createdAt: 1820707200000
        },
        {
            id: 'c149', key: 'TK-149',
            title: 'Çoklu Bulut (Multi-Cloud AWS + GCP + Cloudflare) Yedeklilik Testleri',
            desc: 'Tek bir sağlayıcıya bağımlı kalmadan otomatik yük devretme (failover) mimarisinin doğrulanması.',
            assignee: 'Caner Öztürk', priority: 'high', col: 'todo',
            startDate: '2027-10-25', dueDate: '2027-11-05', labels: ['devops'],
            storyPoints: 8, estimatedEffort: 36, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e8', sprintId: 's48', createdAt: 1824336000000
        },
        {
            id: 'c150', key: 'TK-150',
            title: 'Yıllık Yönetici Özeti ve Tahmine Dayalı İş Yükü Raporlama',
            desc: '2027 yılı boyunca gerçekleşen eforların, hız eğrilerinin ve 2028 bütçe tahminlerinin çıktısı.',
            assignee: 'Gamze Şahin', priority: 'medium', col: 'todo',
            startDate: '2027-11-22', dueDate: '2027-12-03', labels: ['analytics'],
            storyPoints: 5, estimatedEffort: 20, spentEffort: 0,
            subtasks: [], comments: [], epicId: 'e4', sprintId: 's50', createdAt: 1826755200000
        },
        {
            id: 'c151', key: 'TK-151',
            title: '2027 Yıl Sonu Kapanışı ve 2028 Stratejik Ürün Vizyonu',
            desc: 'Nova takımı ile birlikte 2 yıllık hedeflerin tamamlanması ve kurumsal v3 lansman hazırlığı.',
            assignee: 'Selin Yıldız', priority: 'low', col: 'todo',
            startDate: '2027-12-20', dueDate: '2027-12-31', labels: ['docs'],
            storyPoints: 5, estimatedEffort: 18, spentEffort: 0,
            subtasks: [], comments: [{ id: 'cm151-1', text: 'Tüm ekip harika bir 2 yıl geçirdi! 2028 hedefleri belirlendi.', createdAt: 1829692800000, author: 'Selin Yıldız' }],
            epicId: 'e1', sprintId: 's52', createdAt: 1829174400000
        }
    ];
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
        taskCounter: cards.length,
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
