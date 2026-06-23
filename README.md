# TopTop Monopoly

Telegram Mini App — игра Монополия для 2-4 игроков с мультиплеером через Firebase.

## 🎮 Особенности

- **28 клеток** поля (как в референсе)
- **Мультиплеер** через Firebase Firestore
- **28 раундов**, победа по активам
- **2 кубика**, дубли = ещё ход, 3 дубля = тюрьма
- **Банкротство** — активы обнуляются
- **16 карт Шанс + 16 карт Казна**
- **Чат** в реальном времени
- **Таймер хода**
- **Покупка/аренда/постройка домов**

## 🚀 Деплой

### 1. GitHub Pages
1. Залейте файлы на GitHub
2. Settings → Pages → Source: main / (root)
3. Подождите 2-5 минут

### 2. Firebase
1. Откройте Firebase Console
2. Создайте Firestore Database
3. Правила (временно для теста):
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

### 3. Telegram Bot
1. @BotFather → /setmenubutton
2. URL: `https://yourname.github.io/monopoly/`

## 📁 Структура

```
monopoly/
├── index.html          # Главная страница
├── css/
│   └── style.css       # Стили + анимации
└── js/
    ├── firebase-config.js  # Firebase конфиг
    ├── game.js             # Игровой движок
    └── ui.js               # UI функции
```

## 🧪 Тест

Откройте в браузере:
```
https://yourname.github.io/monopoly/?demo=1
```

## 🔧 Технологии

- HTML5 + CSS3 (градиенты, тени, анимации)
- Vanilla JavaScript (ES6+)
- Firebase (Firestore, Auth)
- GitHub Pages (хостинг)
