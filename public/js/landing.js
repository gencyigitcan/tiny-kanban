/* ============================================================
   KANBAN v1.3 – APPLE-GRADE 2026 LANDING PAGE CONTROLLER
   Interactive Showcase Tabs & Secure Gateway Handlers
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ── 1. Apple Stage Showcase Tab Switcher ──────────────────
    const tabButtons = document.querySelectorAll('.stage-tab-btn');
    const stageViews = document.querySelectorAll('.stage-view');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (!targetId) return;

            // Update active state on buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch active view with smooth fade
            stageViews.forEach(view => {
                if (view.id === targetId) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // ── 2. Quick Fill Credentials Helper ──────────────────────
    window.fillHeroCredentials = function(username, password) {
        const u = document.getElementById('heroUsername');
        const p = document.getElementById('heroPassword');
        if (u) u.value = username;
        if (p) p.value = password;
        if (u) u.focus();
    };

    // ── 3. Kurumsal Canlı Giriş Formu (Hero Login) ────────────
    const heroLoginForm = document.getElementById('heroLoginForm');
    const heroLoginMsg = document.getElementById('heroLoginMsg');
    const heroLoginBtn = document.getElementById('heroLoginBtn');

    if (heroLoginForm) {
        heroLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('heroUsername')?.value.trim();
            const password = document.getElementById('heroPassword')?.value;
            if (!username || !password) return;

            if (heroLoginMsg) {
                heroLoginMsg.className = 'msg-banner';
                heroLoginMsg.style.display = 'none';
            }
            if (heroLoginBtn) {
                heroLoginBtn.disabled = true;
                heroLoginBtn.innerHTML = '<span>Giriş Yapılıyor…</span> ⏳';
            }

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Giriş yapılamadı.');
                }

                // Token ve kullanıcı bilgisini localStorage'a kaydet
                if (data.token) {
                    localStorage.setItem('kanban_token', data.token);
                    localStorage.setItem('tiny_kanban_token', data.token);
                }
                if (data.user) {
                    localStorage.setItem('kanban_user', JSON.stringify(data.user));
                }

                if (heroLoginMsg) {
                    heroLoginMsg.className = 'msg-banner success';
                    heroLoginMsg.textContent = '✓ Giriş başarılı! Çalışma alanınıza yönlendiriliyorsunuz...';
                    heroLoginMsg.style.display = 'block';
                }

                setTimeout(() => {
                    window.location.href = '/board';
                }, 400);
            } catch (err) {
                if (heroLoginMsg) {
                    heroLoginMsg.className = 'msg-banner error';
                    heroLoginMsg.textContent = err.message || 'Kullanıcı adı veya şifre hatalı.';
                    heroLoginMsg.style.display = 'block';
                }
                if (heroLoginBtn) {
                    heroLoginBtn.disabled = false;
                    heroLoginBtn.innerHTML = '<span>Giriş Yap ve Panoyu Aç</span> ➔';
                }
            }
        });
    }

    // ── 4. 30 Günlük Özel Alan Talep Formu ─────────────────────
    const reqForm = document.getElementById('demoRequestForm');
    const reqName = document.getElementById('req-name');
    const reqEmail = document.getElementById('req-email');
    const reqMsg = document.getElementById('demo-req-message');

    if (reqForm) {
        reqForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (reqMsg) {
                reqMsg.style.display = 'none';
                reqMsg.textContent = '';
            }

            try {
                const res = await fetch('/api/auth/request-demo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: reqName?.value.trim() || '',
                        email: reqEmail?.value.trim() || ''
                    })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Talep iletilemedi.');
                }

                if (reqMsg) {
                    reqMsg.style.color = '#34d399';
                    reqMsg.textContent = '✓ Talebiniz başarıyla alındı! Yönetici onayının ardından erişim bilgileriniz iletilecektir.';
                    reqMsg.style.display = 'block';
                }
                if (reqName) reqName.value = '';
                if (reqEmail) reqEmail.value = '';
            } catch (err) {
                if (reqMsg) {
                    reqMsg.style.color = '#f87171';
                    reqMsg.textContent = err.message || 'Talep gönderilirken hata oluştu.';
                    reqMsg.style.display = 'block';
                }
            }
        });
    }

    // ── 5. Dynamic Navbar Scroll Elevation ─────────────────────
    const navbar = document.querySelector('header.apple-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.style.background = 'rgba(6, 9, 15, 0.94)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(6, 9, 15, 0.82)';
            navbar.style.boxShadow = 'none';
        }
    }, { passive: true });
});
