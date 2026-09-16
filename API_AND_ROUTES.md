# Tiny Kanban — Erişim Yolları ve API Referans Kılavuzu

Bu belge, Tiny Kanban projesinde arayüz sayfaları, yönetim uç noktaları, kimlik doğrulama, ortam erişimi (Test vs Canlı) ve veri API'lerinin tam listesini içermektedir.

---

## 1. Web Sayfaları (Kullanıcı Arayüzü)

| Sayfa Yolu (Path) | Tür | Açıklama |
|---|---|---|
| **`/board.html`** | HTML | **Ana Kanban Panosu:** Kişisel çalışma alanınız, takım panolarınız veya bireysel kullanıcı panoları bu sayfada çalışır. Sol üst köşedeki çalışma alanı seçiciden panolar arası geçiş yapılabilir. |
| **`/`** veya **`/index.html`** | HTML | **Tanıtım & Karşılama Sayfası:** Bireysel proje sunumu, teknik mimari incelemesi ve demo talep formu. |
| **`/demo.html`** | HTML | **Genel Demo Panosu:** 6 sprintlik örnek gerçekçi verilerin yer aldığı herkese açık demo alanı. |

---

## 2. Ortam Ayrımı (Environment) ve Test Erişimi

Sistem istek geldiğinde ortamı otomatik olarak tespit eder. Test ortamında veriler `test:db` (kişisel verilerden %100 izole) üzerinde çalışır:

| Yöntem | Örnek | Açıklama |
|---|---|---|
| **Subdomain / Host** | `test.tiny-kanban.pages.dev`<br>`preview.tiny-kanban.pages.dev` | Domain adında `test`, `preview`, `staging` geçtiğinde otomatik **Test DB** kullanılır. |
| **URL Parametresi** | `/board.html?env=test` | Sayfa veya API çağrısına `?env=test` eklendiğinde test ortamı tetiklenir. |
| **HTTP Başlığı (Header)** | `X-Environment: test` | API istemcileri (Postman, fetch, curl vb.) üzerinden test ortamına erişim sağlar. |
| **Ortam Değişkeni** | `APP_ENV=test` | Cloudflare Pages / Workers veya yerel `.env` ayarlarında tanımlanabilir. |

---

## 3. Kimlik Doğrulama & Oturum API (`/api/auth`)

| Metot & Endpoint | Yetki | Açıklama | Örnek Gövde (Body) |
|---|---|---|---|
| `POST /api/auth/login` | Herkese Açık | Kullanıcı girişi yapar. | `{"username": "selin", "password": "secret", "company": "Opsiyonel"}` |
| `POST /api/auth/register` | Herkese Açık | Yeni hesap açar. Şirket adı girilirse şirket DB'si, girilmezse izole bireysel DB açar. | `{"name": "Selin Y.", "username": "selin", "password": "secret", "company": "Acme"}` |
| `POST /api/auth/switch-workspace` | Oturum Gerekli | Yetkili olunan başka bir çalışma alanına/takıma geçer (Token yenilenir). | `{"workspaceId": "team_xyz"}` |
| `GET /api/auth/me` | Oturum Gerekli | Giriş yapmış kullanıcının bilgilerini, aktif çalışma alanını ve yetkili takımlarını döner. | — |
| `POST /api/auth/logout` | Oturum Gerekli | Aktif oturumu sonlandırır. | — |
| `POST /api/auth/request-demo` | Herkese Açık | Dışarıdan demo hesabı talebinde bulunma formu. | `{"name": "Ali Veli", "email": "ali@example.com"}` |
| `POST /api/auth/approve-demo` | Admin / Superadmin | Demo talebini onaylayıp 30 günlük hesap açar. | `{"notificationId": "ntf-xxx"}` |

---

## 4. Kullanıcı, Takım ve Yetki Yönetimi API (`/api/admin`)

*Bu bölümdeki endpoint'lere yalnızca `admin` ve `superadmin` rollerindeki kullanıcılar erişebilir.*

| Metot & Endpoint | Açıklama | Örnek Gövde (Body) |
|---|---|---|
| `GET /api/admin/workspaces` | Kullanıcının erişebildiği veya yönettiği tüm takımları listeler. | — |
| `POST /api/admin/workspaces` | Yeni bir takım/şirket çalışma alanı ve bağımsız DB oluşturur. | `{"name": "Mobil Geliştirme Ekibi", "description": "iOS/Android ekibi"}` |
| `GET /api/admin/users` | Kullanıcıları, rolleri ve yetkili oldukları panoları listeler. | — |
| `POST /api/admin/users` | **Yeni kullanıcı ekler:**<br>1. `workspaceMode: "personal"` → Kullanıcıya özel bağımsız DB açılır.<br>2. `workspaceMode: "team"` → Seçilen takımın DB kayıtlarını görür. | `{"name": "Ahmet K.", "username": "ahmet", "password": "password123", "role": "user", "workspaceMode": "team", "targetWorkspaceId": "team_xyz"}` |
| `PUT /api/admin/users/:id/workspaces` | Bir kullanıcının erişebildiği takım panolarını günceller. | `{"workspaces": ["personal", "team_xyz"]}` |
| `DELETE /api/admin/users/:id` | Kullanıcıyı ve oturumlarını siler (Kendi hesabını veya Süper Admin'i silemez). | — |

---

## 5. Kartlar ve Görev Yönetimi API (`/api/cards`)

*Tüm kart endpoint'leri kullanıcının aktif çalışma alanındaki veritabanı üzerinden işlem yapar.*

| Metot & Endpoint | Açıklama | Örnek Parametreler / Gövde |
|---|---|---|
| `GET /api/cards` | Aktif panodaki tüm görev kartlarını getirir. | — |
| `POST /api/cards` | Aktif panoya yeni bir görev kartı ekler. | `{"title": "Görev Başlığı", "assignee": "Selin", "priority": "high", "col": "todo", "storyPoints": 3}` |
| `PUT /api/cards/:id` | Görevi günceller (Sütun taşıma, durum, efor, etiket, kişi atama vb.). | `{"col": "doing", "priority": "medium", "spentEffort": 2}` |
| `DELETE /api/cards/:id` | Görev kartını siler. | — |

---

## 6. Epikler, Sprintler, Etiketler ve Bildirimler

### Epik Yönetimi (`/api/epics`)
* `GET /api/epics` — Epik listesi
* `POST /api/epics` — Yeni epik oluşturma (`{"name": "Altyapı", "color": "#6366f1"}`)
* `PUT /api/epics/:id` — Epik güncelleme
* `DELETE /api/epics/:id` — Epik silme

### Sprint Yönetimi (`/api/sprints`)
* `GET /api/sprints` — Sprint listesi
* `POST /api/sprints` — Yeni sprint (`{"name": "Sprint 1", "startDate": "2026-03-01", "endDate": "2026-03-21"}`)
* `PUT /api/sprints/:id` — Sprint güncelleme / aktif etme (`{"active": true}`)
* `DELETE /api/sprints/:id` — Sprint silme

### Etiket Yönetimi (`/api/labels`)
* `GET /api/labels` — Panodaki etiketleri listeler
* `POST /api/labels` — Yeni etiket (`{"name": "DevOps", "color": "#0891b2"}`)
* `DELETE /api/labels/:id` — Etiket silme

### Bildirimler (`/api/notifications`)
* `GET /api/notifications` — Kullanıcının okunmamış ve geçmiş bildirimleri
* `POST /api/notifications/:id/read` — Bildirimi okundu olarak işaretle
* `POST /api/notifications/read-all` — Tüm bildirimleri okundu yap

### Kullanıcılar Listesi (`/api/users`)
* `GET /api/users` — Aktif çalışma alanındaki görev atamalarında seçilebilecek kullanıcıları listeler.

---

## 7. Veritabanı ve Dosya Yapısı

| Dosya / Anahtar | Ortam / Kapsam | Açıklama |
|---|---|---|
| `data/db.json` *(D1 key: `db`)* | Production / Personal | **Kişisel Çalışma Alanı:** Süper Admin'in tüm kişisel biletleri burada saklanır. |
| `data/test_db.json` *(D1 key: `test:db`)* | Test Ortamı | **Test Panosu:** Test ortamında çalışan tertemiz test biletleri. |
| `data/demo_db.json` *(D1 key: `demo`)* | Production / Demo | **Demo Panosu:** Halka açık demo verisi. |
| `data/tenants_index.json` | Tümü | Çalışma alanları ve kullanıcı yetki haritası indeksi. |
| `data/tenants/<tenantId>.json` | Production / Takım | Oluşturulan takımların veya bireysel kullanıcıların bağımsız DB'leri. |
