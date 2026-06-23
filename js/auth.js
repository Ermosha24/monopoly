// Auth module - Telegram WebApp + Firebase Auth
class AuthManager {
    constructor() {
        this.user = null;
        this.isDemo = false;
        this.telegramUser = null;
    }

    init() {
        // Проверяем демо-режим
        const urlParams = new URLSearchParams(window.location.search);
        this.isDemo = urlParams.get('demo') === '1';

        if (this.isDemo) {
            this.createDemoUser();
            return;
        }

        // Проверяем Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            this.initTelegram();
        } else {
            // Fallback - анонимная авторизация
            this.initAnonymous();
        }
    }

    createDemoUser() {
        this.user = {
            uid: 'demo_' + Math.random().toString(36).substr(2, 9),
            displayName: 'Игрок (Демо)',
            photoURL: null,
            isDemo: true
        };
        this.onAuthSuccess();
    }

    initTelegram() {
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.ready();

        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
            this.telegramUser = tgUser;
            this.signInWithTelegram(tgUser);
        } else {
            this.initAnonymous();
        }
    }

    async signInWithTelegram(tgUser) {
        try {
            // Создаём кастомный токен через Firebase Function (временно - прямой вход)
            const result = await auth.signInAnonymously();
            this.user = {
                uid: result.user.uid,
                displayName: tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : ''),
                photoURL: tgUser.photo_url || null,
                telegramId: tgUser.id,
                isDemo: false
            };
            // Сохраняем профиль в Firestore
            await db.collection('users').doc(this.user.uid).set({
                name: this.user.displayName,
                photo: this.user.photoURL,
                telegramId: tgUser.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            this.onAuthSuccess();
        } catch (error) {
            console.error('Auth error:', error);
            this.initAnonymous();
        }
    }

    async initAnonymous() {
        try {
            const result = await auth.signInAnonymously();
            this.user = {
                uid: result.user.uid,
                displayName: 'Игрок ' + Math.floor(Math.random() * 9999),
                photoURL: null,
                isDemo: false
            };
            this.onAuthSuccess();
        } catch (error) {
            console.error('Anonymous auth failed:', error);
            // Последний fallback - локальный режим
            this.createDemoUser();
        }
    }

    onAuthSuccess() {
        window.dispatchEvent(new CustomEvent('auth-ready', { detail: this.user }));
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return this.user !== null;
    }
}

window.authManager = new AuthManager();
