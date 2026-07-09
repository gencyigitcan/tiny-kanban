// ============================================================
//  Authentication and User Routes
// ============================================================
import { Router } from 'express';
import crypto from 'crypto';
import { readDb, writeDbSync, uid } from '../lib/db.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/error.js';
import { requireAuth } from '../middleware/auth.js';
import { registerSchema, loginSchema, requestDemoSchema } from '../lib/schemas.js';
import type { User, Session } from '../types/index.js';

export const authRouter = Router();

const PASTEL_COLORS = [
    '#4f46e5', // Indigo
    '#0ea5e9', // Sky
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f97316', // Orange
    '#14b8a6', // Teal
    '#06b6d4'  // Cyan
];

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
    const [salt, hash] = stored.split(':');
    const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === testHash;
}

/** POST /api/auth/register */
authRouter.post('/register', validate(registerSchema), (req, res) => {
    const { username, password, name } = req.body;
    const db = readDb();

    // Check if user already exists
    const normalizedUsername = username.toLowerCase().trim();
    if (db.users.some(u => u.username.toLowerCase() === normalizedUsername)) {
        throw new AppError('Kullanıcı adı zaten kullanımda', 400);
    }

    const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    const newUser: User = {
        id: 'usr-' + uid(),
        username: normalizedUsername,
        name: name.trim(),
        passwordHash: hashPassword(password),
        avatarColor: randomColor,
        createdAt: Date.now()
    };

    db.users.push(newUser);

    // Create session immediately
    const token = crypto.randomBytes(24).toString('hex');
    const newSession: Session = {
        token,
        userId: newUser.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    db.sessions.push(newSession);

    writeDbSync(db);

    res.status(201).json({
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            avatarColor: newUser.avatarColor
        }
    });
});

/** POST /api/auth/login */
authRouter.post('/login', validate(loginSchema), (req, res) => {
    const { username, password } = req.body;
    const db = readDb();

    const normalizedUsername = username.toLowerCase().trim();
    const user = db.users.find(u => u.username.toLowerCase() === normalizedUsername);
    if (!user || !verifyPassword(password, user.passwordHash)) {
        throw new AppError('Kullanıcı adı veya şifre hatalı', 401);
    }

    if (user.expiresAt && Date.now() > user.expiresAt) {
        throw new AppError('Bu demo hesabının kullanım süresi (30 gün) dolmuştur.', 401);
    }

    const token = crypto.randomBytes(24).toString('hex');
    const newSession: Session = {
        token,
        userId: user.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    db.sessions.push(newSession);
    writeDbSync(db);

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarColor: user.avatarColor
        }
    });
});

/** POST /api/auth/logout */
authRouter.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const db = readDb();
        db.sessions = db.sessions.filter(s => s.token !== token);
        writeDbSync(db);
    }
    res.json({ ok: true });
});

/** GET /api/auth/me */
authRouter.get('/me', requireAuth, (req, res) => {
    const user = req.user!;
    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        avatarColor: user.avatarColor
    });
});

/** GET /api/users */
authRouter.get('/list', requireAuth, (_req, res) => {
    const db = readDb();
    const publicUsers = db.users.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarColor: u.avatarColor
    }));
    res.json(publicUsers);
});

/** POST /api/auth/request-demo */
authRouter.post('/request-demo', validate(requestDemoSchema), (req, res) => {
    const { name, email } = req.body;
    const db = readDb();

    const emailLower = email.toLowerCase().trim();
    
    // Check if user already exists
    if (db.users.some(u => u.username.toLowerCase() === emailLower)) {
        throw new AppError('Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut', 400);
    }

    // Check if there is an active pending notification for this email
    db.notifications = db.notifications || [];
    const hasPending = db.notifications.some(n => n.type === 'demo-request' && n.email === emailLower && n.demoStatus === 'pending');
    if (hasPending) {
        throw new AppError('Bu e-posta adresiyle yapılmış bekleyen bir demo talebi zaten mevcut', 400);
    }

    // Create notification for admin (usr-1)
    const newNotif = {
        id: 'ntf-' + uid(),
        userId: 'usr-1',
        senderId: 'visitor',
        senderName: name.trim(),
        cardId: '',
        cardTitle: '',
        text: `${name.trim()} (${email.trim()}) yeni bir demo hesabı talep etti.`,
        read: false,
        createdAt: Date.now(),
        type: 'demo-request',
        email: emailLower,
        name: name.trim(),
        demoStatus: 'pending' as const
    };

    db.notifications.push(newNotif);
    writeDbSync(db);

    res.status(201).json({ ok: true, message: 'Demo talebi başarıyla oluşturuldu.' });
});

/** POST /api/auth/approve-demo */
authRouter.post('/approve-demo', requireAuth, (req, res) => {
    const { notificationId } = req.body;
    const db = readDb();

    // Only admin can approve
    if (req.user!.id !== 'usr-1') {
        throw new AppError('Yetkisiz işlem: Sadece yönetici demo taleplerini onaylayabilir', 403);
    }

    db.notifications = db.notifications || [];
    const notification = db.notifications.find(n => n.id === notificationId);
    if (!notification || notification.type !== 'demo-request') {
        throw new AppError('Talep bulunamadı', 404);
    }

    if (notification.demoStatus === 'approved') {
        throw new AppError('Bu talep zaten onaylanmış', 400);
    }

    // Generate random 6-character password
    const tempPassword = Math.random().toString(36).substring(2, 8).toUpperCase();
    const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

    const newUser: User = {
        id: 'usr-' + uid(),
        username: notification.email!,
        name: notification.name!,
        passwordHash: hashPassword(tempPassword),
        avatarColor: randomColor,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    db.users.push(newUser);

    // Update notification status & text
    notification.demoStatus = 'approved' as const;
    notification.text = `${notification.name} (${notification.email}) demo talebi onaylandı. Giriş: ${notification.email} (Şifre: ${tempPassword})`;
    
    writeDbSync(db);

    res.json({
        ok: true,
        username: newUser.username,
        password: tempPassword,
        expiresAt: newUser.expiresAt
    });
});
