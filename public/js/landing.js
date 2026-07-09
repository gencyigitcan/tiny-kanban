/* ============================================================
   TINY KANBAN – LANDING PAGE INTERACTIVE SIMULATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Sprint Templates for Rotation
    const SPRINT_TEMPLATES = [
        {
            name: "Sprint 1: Altyapı & Yetkilendirme",
            cards: [
                {
                    id: 'sim-c1',
                    key: 'TK-11',
                    title: 'Veritabanı Performans Optimizasyonu',
                    epic: 'Altyapı & DevOps',
                    epicColor: '#0891b2',
                    priority: 'high',
                    col: 'doing',
                    sp: 8,
                    assignee: 'Ali Yılmaz',
                    avatarBg: '#4f46e5',
                    subtasks: [
                        { text: 'Sorgu indeksleme kontrolü', done: true },
                        { text: 'Redis cache katmanı', done: false }
                    ],
                    commentsCount: 3
                },
                {
                    id: 'sim-c2',
                    key: 'TK-12',
                    title: 'OAuth 2.0 Entegrasyonu',
                    epic: 'Kullanıcı Yönetimi',
                    epicColor: '#6366f1',
                    priority: 'medium',
                    col: 'todo',
                    sp: 5,
                    assignee: 'Zeynep Kaya',
                    avatarBg: '#0ea5e9',
                    subtasks: [
                        { text: 'Google Login testi', done: false },
                        { text: 'GitHub Login testi', done: false }
                    ],
                    commentsCount: 1
                },
                {
                    id: 'sim-c3',
                    key: 'TK-13',
                    title: 'Redis Cache Kurulumu',
                    epic: 'Altyapı & DevOps',
                    epicColor: '#0891b2',
                    priority: 'low',
                    col: 'todo',
                    sp: 3,
                    assignee: 'Mehmet Demir',
                    avatarBg: '#10b981',
                    subtasks: [],
                    commentsCount: 0
                },
                {
                    id: 'sim-c4',
                    key: 'TK-14',
                    title: 'API Hata Yakalama Middleware',
                    epic: 'Altyapı & DevOps',
                    epicColor: '#0891b2',
                    priority: 'low',
                    col: 'done',
                    sp: 2,
                    assignee: 'Hakan Demir',
                    avatarBg: '#ec4899',
                    subtasks: [
                        { text: 'Zod şema doğrulaması', done: true },
                        { text: 'Hata yakalama testleri', done: true }
                    ],
                    commentsCount: 2
                }
            ],
            newTask: {
                id: 'sim-new-api',
                key: 'TK-15',
                title: 'Swagger API Dokümantasyonu',
                epic: 'Altyapı & DevOps',
                epicColor: '#0891b2',
                priority: 'medium',
                col: 'todo',
                sp: 3,
                assignee: 'Ali Yılmaz',
                avatarBg: '#4f46e5',
                subtasks: [],
                commentsCount: 0
            },
            cardToMoveId: 'sim-c2',
            secondCardToMoveId: 'sim-c1'
        },
        {
            name: "Sprint 2: Mobil Uygulama & Ödeme",
            cards: [
                {
                    id: 'sim-c1',
                    key: 'TK-21',
                    title: 'Kredi Kartı Saklama Altyapısı',
                    epic: 'Ödeme Entegrasyonu',
                    epicColor: '#f59e0b',
                    priority: 'high',
                    col: 'doing',
                    sp: 13,
                    assignee: 'Mehmet Demir',
                    avatarBg: '#10b981',
                    subtasks: [
                        { text: 'Tokenization testleri', done: true },
                        { text: 'PCI-DSS sertifikasyon kontrolü', done: false }
                    ],
                    commentsCount: 4
                },
                {
                    id: 'sim-c2',
                    key: 'TK-22',
                    title: 'iOS Push Notification Kurulumu',
                    epic: 'Mobil Uygulama',
                    epicColor: '#22c55e',
                    priority: 'high',
                    col: 'todo',
                    sp: 5,
                    assignee: 'Zeynep Kaya',
                    avatarBg: '#0ea5e9',
                    subtasks: [
                        { text: 'APNS sertifika üretimi', done: false },
                        { text: 'Cihaz kaydı testi', done: false }
                    ],
                    commentsCount: 2
                },
                {
                    id: 'sim-c3',
                    key: 'TK-23',
                    title: 'Android UI Hata Düzeltmeleri',
                    epic: 'Mobil Uygulama',
                    epicColor: '#22c55e',
                    priority: 'medium',
                    col: 'todo',
                    sp: 3,
                    assignee: 'Ali Yılmaz',
                    avatarBg: '#4f46e5',
                    subtasks: [],
                    commentsCount: 0
                },
                {
                    id: 'sim-c4',
                    key: 'TK-24',
                    title: 'Mobil Sepet Ekranı Tasarımı',
                    epic: 'Mobil Uygulama',
                    epicColor: '#22c55e',
                    priority: 'medium',
                    col: 'done',
                    sp: 5,
                    assignee: 'Hakan Demir',
                    avatarBg: '#ec4899',
                    subtasks: [
                        { text: 'Figma tasarımı onaylandı', done: true },
                        { text: 'Mobil arayüz iskeleti', done: true }
                    ],
                    commentsCount: 1
                }
            ],
            newTask: {
                id: 'sim-new-api',
                key: 'TK-25',
                title: 'Iyzico Test Cüzdanı Entegrasyonu',
                epic: 'Ödeme Entegrasyonu',
                epicColor: '#f59e0b',
                priority: 'high',
                col: 'todo',
                sp: 8,
                assignee: 'Mehmet Demir',
                avatarBg: '#10b981',
                subtasks: [],
                commentsCount: 0
            },
            cardToMoveId: 'sim-c2',
            secondCardToMoveId: 'sim-c1'
        },
        {
            name: "Sprint 3: Dashboard & Raporlar",
            cards: [
                {
                    id: 'sim-c1',
                    key: 'TK-31',
                    title: 'Haftalık Verimlilik Raporu API',
                    epic: 'Dashboard & Raporlar',
                    epicColor: '#ef4444',
                    priority: 'medium',
                    col: 'doing',
                    sp: 8,
                    assignee: 'Ali Yılmaz',
                    avatarBg: '#4f46e5',
                    subtasks: [
                        { text: 'Ekip bazlı veri çekme sorgusu', done: true },
                        { text: 'Performans optimizasyonu', done: false }
                    ],
                    commentsCount: 2
                },
                {
                    id: 'sim-c2',
                    key: 'TK-32',
                    title: 'Excel Raporu Dışa Aktarım Modülü',
                    epic: 'Dashboard & Raporlar',
                    epicColor: '#ef4444',
                    priority: 'high',
                    col: 'todo',
                    sp: 5,
                    assignee: 'Zeynep Kaya',
                    avatarBg: '#0ea5e9',
                    subtasks: [
                        { text: 'xlsx kütüphane kurulumu', done: false },
                        { text: 'Sütun hizalama şablonu', done: false }
                    ],
                    commentsCount: 3
                },
                {
                    id: 'sim-c3',
                    key: 'TK-33',
                    title: 'Karanlık Tema Renk Paleti',
                    epic: 'Tasarım Sistemi',
                    epicColor: '#8b5cf6',
                    priority: 'low',
                    col: 'todo',
                    sp: 2,
                    assignee: 'Mehmet Demir',
                    avatarBg: '#10b981',
                    subtasks: [],
                    commentsCount: 0
                },
                {
                    id: 'sim-c4',
                    key: 'TK-34',
                    title: 'Kullanıcı Paneli Grafik Çizimi',
                    epic: 'Dashboard & Raporlar',
                    epicColor: '#ef4444',
                    priority: 'high',
                    col: 'done',
                    sp: 8,
                    assignee: 'Hakan Demir',
                    avatarBg: '#ec4899',
                    subtasks: [
                        { text: 'Chart.js kütüphane entegrasyonu', done: true },
                        { text: 'Grid düzeni ayarları', done: true }
                    ],
                    commentsCount: 6
                }
            ],
            newTask: {
                id: 'sim-new-api',
                key: 'TK-35',
                title: 'PDF Rapor Çıktısı Alınması',
                epic: 'Dashboard & Raporlar',
                epicColor: '#ef4444',
                priority: 'medium',
                col: 'todo',
                sp: 5,
                assignee: 'Zeynep Kaya',
                avatarBg: '#0ea5e9',
                subtasks: [],
                commentsCount: 0
            },
            cardToMoveId: 'sim-c2',
            secondCardToMoveId: 'sim-c1'
        }
    ];

    let currentSprintIndex = 0;
    let cards = [];
    let currentStep = 0;
    let isSpeedUp = false;
    let simulationTimer = null;
    let animationTimeout = null;

    // Simulation Speed Configuration
    const SPEED_NORMAL = 4000;
    const SPEED_FAST = 1800;

    // Elements
    const colTodo = document.getElementById('sim-col-todo');
    const colDoing = document.getElementById('sim-col-doing');
    const colDone = document.getElementById('sim-col-done');
    
    const countTodo = document.getElementById('sim-todo-count');
    const countDoing = document.getElementById('sim-doing-count');
    const countDone = document.getElementById('sim-done-count');

    const statTotal = document.getElementById('stat-total-tasks');
    const statDone = document.getElementById('stat-done-tasks');
    const statOverdue = document.getElementById('stat-overdue');
    const statVelocity = document.getElementById('stat-velocity');

    const btnSpeed = document.getElementById('btn-speed');
    const btnReset = document.getElementById('btn-reset');
    const btnAddTask = document.getElementById('btn-add-task');
    const inputTaskTitle = document.getElementById('input-task-title');
    const simTitleText = document.getElementById('sim-title-text');

    // Helper: Escaping HTML
    function esc(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Helper: Initials
    function getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    // Render Stats
    function updateStats() {
        const total = cards.length;
        const done = cards.filter(c => c.col === 'done').length;
        
        // Calculate dynamic velocity based on completed story points
        const velocity = cards.filter(c => c.col === 'done').reduce((sum, c) => sum + (c.sp || 0), 0);

        statTotal.textContent = total;
        statDone.textContent = done;
        statVelocity.textContent = velocity + ' SP';
        
        // Highlight updates
        [statTotal, statDone, statVelocity].forEach(el => {
            el.style.transform = 'scale(1.15)';
            el.style.color = '#818cf8';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
                el.style.color = '';
            }, 300);
        });
    }

    // Generate Card HTML
    function createCardHTML(card) {
        const priorityLabel = card.priority === 'high' ? 'ACİL' : card.priority === 'medium' ? 'ORTA' : 'DÜŞÜK';
        
        // Subtasks progress calculation
        let subtasksHTML = '';
        if (card.subtasks && card.subtasks.length > 0) {
            const completed = card.subtasks.filter(s => s.done).length;
            const pct = Math.round((completed / card.subtasks.length) * 100);
            
            subtasksHTML = `
                <div class="card-subtasks">
                    ${card.subtasks.map((s, idx) => `
                        <div class="subtask-item">
                            <span class="subtask-check ${s.done ? 'checked' : ''}" data-card-id="${card.id}" data-idx="${idx}"></span>
                            <span>${esc(s.text)}</span>
                        </div>
                    `).join('')}
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="sim-card" id="${card.id}" data-col="${card.col}">
                <div class="card-top">
                    <span class="card-epic" style="background: ${card.epicColor}20; color: ${card.epicColor}">${esc(card.epic)}</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="card-key">${esc(card.key)}</span>
                        <span class="card-priority priority-${card.priority}">${priorityLabel}</span>
                    </div>
                </div>
                <div class="card-title">${esc(card.title)}</div>
                ${subtasksHTML}
                <div class="card-footer">
                    <div class="card-meta">
                        <div class="meta-item">💬 ${card.commentsCount}</div>
                        ${card.sp ? `<div class="meta-item">🎯 ${card.sp} SP</div>` : ''}
                    </div>
                    <div class="card-assignee">
                        <span class="avatar-badge" style="background: ${card.avatarBg}" title="${esc(card.assignee)}">${getInitials(card.assignee)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Render Board Columns
    function renderBoard() {
        const todoCards = cards.filter(c => c.col === 'todo');
        const doingCards = cards.filter(c => c.col === 'doing');
        const doneCards = cards.filter(c => c.col === 'done');

        colTodo.innerHTML = todoCards.map(createCardHTML).join('');
        colDoing.innerHTML = doingCards.map(createCardHTML).join('');
        colDone.innerHTML = doneCards.map(createCardHTML).join('');

        countTodo.textContent = todoCards.length;
        countDoing.textContent = doingCards.length;
        countDone.textContent = doneCards.length;

        updateStats();
    }

    // Smooth Column Move Animation
    function animateMoveCard(cardId, targetCol, callback) {
        const cardEl = document.getElementById(cardId);
        if (!cardEl) return callback();

        cardEl.classList.add('moving');
        
        // Wait for scale effect, then do the move
        animationTimeout = setTimeout(() => {
            const cardObj = cards.find(c => c.id === cardId);
            if (cardObj) {
                cardObj.col = targetCol;
            }
            renderBoard();
            
            const newCardEl = document.getElementById(cardId);
            if (newCardEl) {
                newCardEl.style.animation = 'cardEntrance 0.4s ease';
            }
            callback();
        }, 400);
    }

    // Load Sprint Data
    function loadSprint(index) {
        const sprint = SPRINT_TEMPLATES[index];
        cards = JSON.parse(JSON.stringify(sprint.cards));
        currentStep = 0;
        
        // Update dashboard/header sprint title
        if (simTitleText) {
            simTitleText.textContent = `Arayüz Simülasyonu - ${sprint.name}`;
            
            // Soft highlight on sprint change
            simTitleText.style.color = '#818cf8';
            setTimeout(() => {
                simTitleText.style.color = '';
            }, 500);
        }
        
        renderBoard();
    }

    // Rotate to next sprint
    function rotateSprint() {
        currentSprintIndex = (currentSprintIndex + 1) % SPRINT_TEMPLATES.length;
        loadSprint(currentSprintIndex);
    }

    // Simulation Scenario Queue based on current sprint metadata
    function runSimulationStep() {
        const sprint = SPRINT_TEMPLATES[currentSprintIndex];
        
        switch (currentStep) {
            case 0:
                // Step 1: Create a new task in To Do
                const customNewTask = JSON.parse(JSON.stringify(sprint.newTask));
                cards.push(customNewTask);
                renderBoard();
                currentStep = 1;
                break;

            case 1:
                // Step 2: Move sprint.cardToMoveId to Doing
                animateMoveCard(sprint.cardToMoveId, 'doing', () => {
                    currentStep = 2;
                });
                break;

            case 2:
                // Step 3: Check first subtask of sprint.cardToMoveId
                const cToMoveObj = cards.find(c => c.id === sprint.cardToMoveId);
                if (cToMoveObj && cToMoveObj.subtasks && cToMoveObj.subtasks[0]) {
                    cToMoveObj.subtasks[0].done = true;
                    renderBoard();
                }
                currentStep = 3;
                break;

            case 3:
                // Step 4: Check second subtask of sprint.cardToMoveId
                const cToMoveObj2 = cards.find(c => c.id === sprint.cardToMoveId);
                if (cToMoveObj2 && cToMoveObj2.subtasks && cToMoveObj2.subtasks[1]) {
                    cToMoveObj2.subtasks[1].done = true;
                    renderBoard();
                }
                currentStep = 4;
                break;

            case 4:
                // Step 5: Move sprint.cardToMoveId to Done
                animateMoveCard(sprint.cardToMoveId, 'done', () => {
                    currentStep = 5;
                });
                break;

            case 5:
                // Step 6: Move sprint.secondCardToMoveId to Done
                const cSecondObj = cards.find(c => c.id === sprint.secondCardToMoveId);
                if (cSecondObj && cSecondObj.subtasks) {
                    // Complete subtasks
                    cSecondObj.subtasks.forEach(s => s.done = true);
                }
                animateMoveCard(sprint.secondCardToMoveId, 'done', () => {
                    currentStep = 6;
                });
                break;

            case 6:
                // Step 7: Restart scenario loop and rotate sprint after short pause
                setTimeout(() => {
                    rotateSprint();
                }, 1200);
                break;
        }
    }

    // Restart Timer
    function startSimulationTimer() {
        if (simulationTimer) clearInterval(simulationTimer);
        const speed = isSpeedUp ? SPEED_FAST : SPEED_NORMAL;
        simulationTimer = setInterval(runSimulationStep, speed);
    }

    // Event Handlers
    btnSpeed.addEventListener('click', () => {
        isSpeedUp = !isSpeedUp;
        if (isSpeedUp) {
            btnSpeed.classList.add('demo-btn-active');
            btnSpeed.textContent = '⚡ Hızlı';
        } else {
            btnSpeed.classList.remove('demo-btn-active');
            btnSpeed.textContent = '⏱ Normal';
        }
        startSimulationTimer();
    });

    btnReset.addEventListener('click', () => {
        rotateSprint();
        // Give subtle active rotation visual
        btnReset.style.transform = 'rotate(-180deg)';
        setTimeout(() => {
            btnReset.style.transform = 'none';
        }, 300);
        startSimulationTimer();
    });

    // Add Task from Input
    function handleAddTask() {
        const title = inputTaskTitle.value.trim();
        if (!title) return;

        const epicsList = [
            { name: 'Kullanıcı Yönetimi', color: '#6366f1' },
            { name: 'Ödeme Entegrasyonu', color: '#f59e0b' },
            { name: 'Mobil Uygulama', color: '#22c55e' },
            { name: 'Dashboard & Raporlar', color: '#ef4444' }
        ];
        const randomEpic = epicsList[Math.floor(Math.random() * epicsList.length)];
        const randomSp = [1, 2, 3, 5, 8][Math.floor(Math.random() * 5)];
        const randomPriority = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
        
        const assignees = [
            { name: 'Ali Yılmaz', bg: '#4f46e5' },
            { name: 'Zeynep Kaya', bg: '#0ea5e9' },
            { name: 'Mehmet Demir', bg: '#10b981' }
        ];
        const randomUser = assignees[Math.floor(Math.random() * assignees.length)];

        // Generate dynamic key based on total count
        const taskNum = 100 + cards.length + 1;
        const customCard = {
            id: 'sim-custom-' + Date.now(),
            key: `TK-${taskNum}`,
            title: title,
            epic: randomEpic.name,
            epicColor: randomEpic.color,
            priority: randomPriority,
            col: 'todo',
            sp: randomSp,
            assignee: randomUser.name,
            avatarBg: randomUser.bg,
            subtasks: [],
            commentsCount: 0
        };

        cards.push(customCard);
        renderBoard();
        inputTaskTitle.value = '';
        
        // Show success animation
        btnAddTask.style.background = '#10b981';
        setTimeout(() => {
            btnAddTask.style.background = '';
        }, 500);

        // Reset simulation step to accommodate custom tasks naturally
        if (currentStep >= 5) {
            currentStep = 0;
        }
    }

    btnAddTask.addEventListener('click', handleAddTask);
    inputTaskTitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAddTask();
    });

    // Demo Request Form Submission
    const reqForm = document.getElementById('demoRequestForm');
    const reqName = document.getElementById('req-name');
    const reqEmail = document.getElementById('req-email');
    const reqMsg = document.getElementById('demo-req-message');

    if (reqForm) {
        reqForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            reqMsg.style.display = 'none';
            reqMsg.textContent = '';
            
            try {
                const res = await fetch('/api/auth/request-demo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: reqName.value.trim(),
                        email: reqEmail.value.trim()
                    })
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Talep gönderilemedi.');
                }
                
                reqMsg.style.color = '#4ade80';
                reqMsg.textContent = 'Demo talebiniz başarıyla alındı! Yönetici onayladığında giriş şifreniz paylaşılacaktır.';
                reqMsg.style.display = 'block';
                reqName.value = '';
                reqEmail.value = '';
            } catch (err) {
                reqMsg.style.color = '#f87171';
                reqMsg.textContent = err.message;
                reqMsg.style.display = 'block';
            }
        });
    }

    // Boot
    loadSprint(currentSprintIndex);
    startSimulationTimer();
});
