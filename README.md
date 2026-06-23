# 🎲 TopTop Monopoly

Telegram Mini App — космическая монополия с мультиплеером через Firebase.

## 🚀 Быстрый старт

### 1. Firebase настройка
- Откройте [Firebase Console](https://console.firebase.google.com/)
- Проект уже создан: `monopoly-a1d82`
- Убедитесь, что Firestore Database включён (режим тестовый)

### 2. Firestore Rules (временно для теста)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. GitHub Pages
```bash
git init
git add .
git commit -m "TopTop Monopoly initial"
git remote add origin https://github.com/Ermosh24/monopoly.git
git push -u origin main
```

Затем в репозитории: **Settings → Pages → Source: Deploy from branch → main → / (root)**

### 4. Telegram Bot
- @BotFather → /newbot
- /setmenubutton → URL вашего GitHub Pages

## 🎮 Демо-режим
Откройте: `index.html?demo=1` (без Telegram)

## 📁 Структура
```
monopoly/
├── index.html          # Главная страница
├── css/
│   └── style.css       # Стили
└── js/
    ├── firebase-config.js  # Firebase конфиг
    ├── auth.js             # Авторизация
    ├── game.js             # Игровой движок
    └── ui.js               # Интерфейс
```

## ✅ Реализовано
- 40 клеток поля (28 основных + специальные)
- 28 раундов, победа по активам
- 2 кубика, дубли = ещё ход, 3 дубля = тюрьма
- Банкротство
- 7 скинов фишек
- 1-4 игрока (мультиплеер + боты)
- Чат в реальном времени
- Таймер хода (30 сек)
- Покупка/аренда/постройка домов
- 16 карт Шанс + 16 карт Казна
- Тюрьма с 3 способами выхода
