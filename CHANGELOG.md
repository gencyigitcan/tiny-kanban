# Changelog

All notable changes to this project are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] — 2026-06-12

### 📦 Added
- **Kullanıcı Efor Takibi (Effort Tracking)**: Kartlar üzerinde tahmini ve harcanan efor saatlerini girip görüntüleme desteği eklendi. Limit aşıldığında görsel uyarı veren efor barları eklendi.
- **Gelişmiş Raporlar Paneli (Premium Reports Dashboard)**: Kullanıcı iş yükleri, epic durumu ilerlemeleri, sprint hızları (velocity), sapma değerleri ve efor tüketim oranlarını gösteren premium arayüz.
- **Yazdırılabilir PDF & CSV Dışa Aktarım**: Raporların A4 yazıcı formatına uygun PDF çıktısını alabilme ve MS Excel uyumlu UTF-8 CSV dosyası olarak indirebilme desteği.
- **Dinamik 2026 Çalışma Yılı Simülasyonu**: Demo ve tarayıcı hafızası modları için güncel tarihe (Haziran 2026) göre otomatik 6 tamamlanmış ve 1 aktif/gelecek sprint dummy verisi üreten seeder.
- **Otomatik Tarayıcı Hafızası (LocalStorage) Fallback**: Sunucu çevrimdışı olduğunda veya Cloudflare Pages gibi statik hosting ortamlarında tüm CRUD işlemlerini tarayıcı localStorage'ına kaydeden akıllı API katmanı.
- Efor takibi için `estimatedEffort` ve `spentEffort` Zod şemaları ve TypeScript tip tanımlamaları.

---

## [1.2.0] — 2026-03-07

### 🏗 Architecture
- **TypeScript migration** — full `src/` rewrite with strict mode
- Proper module structure: `types/`, `lib/`, `middleware/`, `routes/`
- `tsx` runner — zero-config TypeScript execution (no build step required)

### 🔐 Security
- `helmet` — security HTTP headers (X-Powered-By removed, etc.)
- `cors` — restricted to configured origin
- `express-rate-limit` — 200 requests/minute on all `/api/*` routes
- **Zod** — schema validation on every POST/PUT endpoint with structured 400 errors
- `write-file-atomic` — crash-safe DB writes (prevents partial JSON corruption)
- Request body capped at 128 KB

### 📦 Added
- `AppError` / `NotFoundError` / `ValidationError` typed error classes
- Global error handler middleware (automatic 5xx logging)
- `initDb()` — atomic database bootstrapping on startup
- `README.md`, `CHANGELOG.md`, `SECURITY.md`

---

## [1.1.0] — 2026-03-07

### Added
- **Start date** field on cards — `startDate` (YYYY-MM-DD)
- Gantt chart now draws bars from `startDate` (falls back to `createdAt` if not set)
- Start date input in card detail modal alongside due date

---

## [1.0.0] — 2026-03-07 (tag: v1.1.0)

### Added
- **Epic management** — color-coded epics; cards link to epics
- **Sprint management** — date-ranged sprints; single-active-sprint invariant
- **Enhanced card modal** — due date, labels (8 types), story points, subtasks, comments, epic/sprint selectors
- **5 view tabs** — Board · List · Backlog · Dashboard · Gantt
- **Dashboard** — stats, priority breakdown bars, overdue tracker, sprint progress, epic summary
- **Gantt** — blue today marker; bar width from start → due date
- **Card badges** — due date (green/orange/red), story point badge, label pills, subtask progress bar
- Multi-page Node.js/Express app with JSON file persistence (`data/db.json`)
- Personal board (`board.html`) + read-only Turkish demo (`demo.html`)
- GitHub repository: [gencyigitcan/tiny-kanban](https://github.com/gencyigitcan/tiny-kanban)

---

## [0.1.0] — Initial

- Single-file HTML Kanban with localStorage: Todo → Doing → Done
- Drag-and-drop, search, priority filter
- Turkish/English content demo
