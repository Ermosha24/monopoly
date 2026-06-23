// ============ ИГРОВОЙ ДВИЖОК ============

// Константы
const BOARD_SIZE = 28;
const MAX_ROUNDS = 28;
const START_MONEY = 3000;
const PASS_GO_MONEY = 200;

// Типы клеток
const CELL_TYPES = {
    START: 'start',
    PROPERTY: 'property',
    CHANCE: 'chance',
    CHEST: 'chest',
    TAX: 'tax',
    JAIL: 'jail',
    FREE: 'free',
    GO_TO_JAIL: 'go_to_jail',
    RAILROAD: 'railroad',
    UTILITY: 'utility'
};

// Цвета групп свойств
const GROUP_COLORS = {
    purple: '#a855f7',
    yellow: '#f59e0b',
    pink: '#ec4899',
    blue: '#3b82f6',
    green: '#22c55e',
    red: '#ef4444'
};

// Определение клеток поля (28 клеток)
const BOARD_CELLS = [
    { id: 0, type: CELL_TYPES.START, name: 'СТАРТ', icon: 'GO' },
    { id: 1, type: CELL_TYPES.PROPERTY, name: 'Ул. Пушкина', price: 100, group: 'purple', icon: '🏠' },
    { id: 2, type: CELL_TYPES.CHEST, name: 'Казна', icon: '💰' },
    { id: 3, type: CELL_TYPES.PROPERTY, name: 'Ул. Лермонтова', price: 100, group: 'purple', icon: '🏠' },
    { id: 4, type: CELL_TYPES.TAX, name: 'Налог', price: 200, icon: '💸' },
    { id: 5, type: CELL_TYPES.RAILROAD, name: 'Ж/д Вокзал', price: 200, icon: '🚂' },
    { id: 6, type: CELL_TYPES.PROPERTY, name: 'Проспект Мира', price: 150, group: 'yellow', icon: '🏢' },
    { id: 7, type: CELL_TYPES.CHANCE, name: 'Шанс', icon: '❓' },
    { id: 8, type: CELL_TYPES.PROPERTY, name: 'Ул. Гоголя', price: 150, group: 'yellow', icon: '🏢' },
    { id: 9, type: CELL_TYPES.PROPERTY, name: 'Проспект Ленина', price: 180, group: 'yellow', icon: '🏢' },
    { id: 10, type: CELL_TYPES.JAIL, name: 'Тюрьма', icon: '🚔' },
    { id: 11, type: CELL_TYPES.PROPERTY, name: 'Ул. Чехова', price: 200, group: 'pink', icon: '🏨' },
    { id: 12, type: CELL_TYPES.UTILITY, name: 'Электро', price: 150, icon: '⚡' },
    { id: 13, type: CELL_TYPES.PROPERTY, name: 'Ул. Толстого', price: 220, group: 'pink', icon: '🏨' },
    { id: 14, type: CELL_TYPES.PROPERTY, name: 'Проспект Победы', price: 240, group: 'pink', icon: '🏨' },
    { id: 15, type: CELL_TYPES.RAILROAD, name: 'Ж/д Станция', price: 200, icon: '🚂' },
    { id: 16, type: CELL_TYPES.PROPERTY, name: 'Ул. Достоевского', price: 260, group: 'blue', icon: '🏰' },
    { id: 17, type: CELL_TYPES.CHANCE, name: 'Шанс', icon: '❓' },
    { id: 18, type: CELL_TYPES.PROPERTY, name: 'Проспект Надежды', price: 280, group: 'blue', icon: '🏰' },
    { id: 19, type: CELL_TYPES.PROPERTY, name: 'Ул. Солнца', price: 300, group: 'blue', icon: '🏰' },
    { id: 20, type: CELL_TYPES.FREE, name: 'Парковка', icon: '🅿️' },
    { id: 21, type: CELL_TYPES.PROPERTY, name: 'Ул. Весны', price: 320, group: 'green', icon: '🌳' },
    { id: 22, type: CELL_TYPES.CHEST, name: 'Казна', icon: '💰' },
    { id: 23, type: CELL_TYPES.PROPERTY, name: 'Проспект Героев', price: 340, group: 'green', icon: '🌳' },
    { id: 24, type: CELL_TYPES.PROPERTY, name: 'Ул. Мечты', price: 360, group: 'green', icon: '🌳' },
    { id: 25, type: CELL_TYPES.RAILROAD, name: 'Ж/д Депо', price: 200, icon: '🚂' },
    { id: 26, type: CELL_TYPES.PROPERTY, name: 'Ул. Королей', price: 400, group: 'red', icon: '👑' },
    { id: 27, type: CELL_TYPES.GO_TO_JAIL, name: 'В тюрьму', icon: '🚓' },
];

// Карты Шанс
const CHANCE_CARDS = [
    { text: 'Пройдите на СТАРТ', action: 'move', target: 0 },
    { text: 'Банк ошибся в вашу пользу. Получите $200', action: 'money', amount: 200 },
    { text: 'Заплатите штраф $50', action: 'money', amount: -50 },
    { text: 'Перейдите в Тюрьму', action: 'jail' },
    { text: 'Получите $100 за хорошую оценку', action: 'money', amount: 100 },
    { text: 'Заплатите налог $75', action: 'money', amount: -75 },
    { text: 'Перейдите на ближайшую Ж/д', action: 'nearest', type: 'railroad' },
    { text: 'Вас ограбили! Потеряйте $100', action: 'money', amount: -100 },
];

// Карты Казны
const CHEST_CARDS = [
    { text: 'Наследство! Получите $100', action: 'money', amount: 100 },
    { text: 'Продажа акций. Получите $50', action: 'money', amount: 50 },
    { text: 'Штраф за превышение $25', action: 'money', amount: -25 },
    { text: 'Вернуть долг $150', action: 'money', amount: -150 },
    { text: 'Лотерея! Получите $200', action: 'money', amount: 200 },
    { text: 'Страховка. Получите $20', action: 'money', amount: 20 },
    { text: 'Больничный счёт $100', action: 'money', amount: -100 },
    { text: 'День рождения! Получите $10 от каждого', action: 'birthday', amount: 10 },
];

// ============ СОСТОЯНИЕ ИГРЫ ============
let gameState = {
    roomId: null,
    players: [],
    currentPlayer: 0,
    round: 1,
    board: [],
    dice: [1, 1],
    doublesCount: 0,
    gameOver: false,
    myId: null,
    isHost: false
};

let roomUnsubscribe = null;

// ============ ИНИЦИАЛИЗАЦИЯ ПОЛЯ ============
function initBoard() {
    const board = document.getElementById('game-board');
    if (!board) return;
    board.innerHTML = '';

    const size = 340;
    const cellSize = 42;
    const gap = 4;
    const cols = 8;
    const rows = 8;

    // Расположение клеток по периметру (28 клеток)
    const positions = [];
    // Верхняя сторона (8 клеток)
    for (let i = 0; i < 8; i++) {
        positions.push({ x: i * (cellSize + gap), y: 0 });
    }
    // Правая сторона (6 клеток, без углов)
    for (let i = 1; i < 7; i++) {
        positions.push({ x: 7 * (cellSize + gap), y: i * (cellSize + gap) });
    }
    // Нижняя сторона (8 клеток, справа налево)
    for (let i = 7; i >= 0; i--) {
        positions.push({ x: i * (cellSize + gap), y: 7 * (cellSize + gap) });
    }
    // Левая сторона (6 клеток, снизу вверх, без углов)
    for (let i = 6; i > 0; i--) {
        positions.push({ x: 0, y: i * (cellSize + gap) });
    }

    BOARD_CELLS.forEach((cell, index) => {
        const pos = positions[index];
        const el = document.createElement('div');
        el.className = 'cell';
        el.dataset.cellId = cell.id;

        // Определяем класс цвета
        if (cell.group) {
            el.classList.add(`cell-${cell.group}`);
        } else if (cell.type === CELL_TYPES.START) {
            el.classList.add('cell-green');
        } else if (cell.type === CELL_TYPES.JAIL || cell.type === CELL_TYPES.GO_TO_JAIL) {
            el.classList.add('cell-red');
        } else if (cell.type === CELL_TYPES.CHANCE || cell.type === CELL_TYPES.CHEST) {
            el.classList.add('cell-yellow');
        } else if (cell.type === CELL_TYPES.RAILROAD) {
            el.classList.add('cell-purple');
        } else if (cell.type === CELL_TYPES.UTILITY) {
            el.classList.add('cell-blue');
        } else {
            el.classList.add('cell-white');
        }

        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;

        el.innerHTML = `
            <span class="cell-icon">${cell.icon}</span>
            <span class="cell-price">${cell.price || ''}</span>
        `;

        board.appendChild(el);
    });
}

// ============ СОЗДАНИЕ КОМНАТЫ ============
function createRoom() {
    const mode = document.getElementById('game-mode')?.value || 'monopoly';
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    gameState.roomId = roomId;
    gameState.isHost = true;
    gameState.myId = generatePlayerId();

    const player = createPlayer(gameState.myId, 'Вы', true);
    gameState.players = [player];

    // Сохраняем в Firestore
    if (window.db) {
        window.db.collection('games').doc(roomId).set({
            roomId: roomId,
            mode: mode,
            status: 'waiting',
            round: 1,
            currentPlayer: 0,
            players: gameState.players,
            board: BOARD_CELLS.map(c => ({ ...c, owner: null, houses: 0 })),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            showRoomInfo(roomId);
            listenToRoom(roomId);
        }).catch(err => {
            console.error('Error creating room:', err);
            showToast('Ошибка создания комнаты');
        });
    } else {
        // Демо-режим
        showRoomInfo(roomId);
        addBotPlayers(1);
        updatePlayersPanel();
    }
}

function generatePlayerId() {
    return 'p_' + Math.random().toString(36).substring(2, 10);
}

function createPlayer(id, name, isMe = false) {
    return {
        id: id,
        name: name,
        avatar: isMe ? '👤' : ['🐶', '🐱', '🦊', '🐼'][Math.floor(Math.random() * 4)],
        color: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][gameState.players.length % 4],
        money: START_MONEY,
        position: 0,
        inJail: false,
        jailTurns: 0,
        properties: [],
        isBot: !isMe && name !== 'Вы',
        isMe: isMe
    };
}

function showRoomInfo(roomId) {
    document.getElementById('room-info')?.classList.remove('hidden');
    document.getElementById('room-id')?.textContent && (document.getElementById('room-id').textContent = roomId);
}

function copyRoomId() {
    const roomId = document.getElementById('room-id')?.textContent;
    if (roomId) {
        navigator.clipboard.writeText(roomId).then(() => {
            showToast('ID скопирован!');
        });
    }
}

function listenToRoom(roomId) {
    if (!window.db) return;

    if (roomUnsubscribe) roomUnsubscribe();

    roomUnsubscribe = window.db.collection('games').doc(roomId)
        .onSnapshot(doc => {
            if (!doc.exists) return;
            const data = doc.data();
            gameState.players = data.players || [];
            gameState.currentPlayer = data.currentPlayer || 0;
            gameState.round = data.round || 1;
            gameState.board = data.board || [];

            updatePlayersPanel();
            updateGameUI();

            if (data.status === 'playing' && document.getElementById('screen-game')?.classList.contains('active') === false) {
                showScreen('screen-game');
                initBoard();
                updatePlayersPanel();
            }
        });
}

// ============ ПРИСОЕДИНЕНИЕ К КОМНАТЕ ============
function joinRoom() {
    const roomId = document.getElementById('join-room-id')?.value?.toUpperCase().trim();
    if (!roomId || roomId.length !== 6) {
        showToast('Введите корректный ID комнаты');
        return;
    }

    gameState.roomId = roomId;
    gameState.myId = generatePlayerId();

    if (window.db) {
        window.db.collection('games').doc(roomId).get().then(doc => {
            if (!doc.exists) {
                showToast('Комната не найдена');
                return;
            }

            const data = doc.data();
            if (data.players.length >= 4) {
                showToast('Комната заполнена');
                return;
            }

            const player = createPlayer(gameState.myId, 'Игрок ' + (data.players.length + 1));
            data.players.push(player);

            return window.db.collection('games').doc(roomId).update({
                players: data.players
            });
        }).then(() => {
            listenToRoom(roomId);
            showScreen('screen-create');
            showRoomInfo(roomId);
            document.querySelector('.create-form')?.classList.add('hidden');
        }).catch(err => {
            console.error('Error joining room:', err);
            showToast('Ошибка присоединения');
        });
    } else {
        // Демо
        showScreen('screen-game');
        initBoard();
        addBotPlayers(3);
        updatePlayersPanel();
        startGameLoop();
    }
}

// ============ БОТЫ ============
function addBotPlayers(count) {
    const botNames = ['Влад', 'Настя', 'Денис', 'Оля', 'Макс', 'Катя'];
    for (let i = 0; i < count; i++) {
        const bot = createPlayer(generatePlayerId(), botNames[i] || 'Бот ' + (i + 1));
        bot.isBot = true;
        gameState.players.push(bot);
    }
}

// ============ НАЧАЛО ИГРЫ ============
function startGame() {
    if (!gameState.isHost) return;

    if (window.db) {
        window.db.collection('games').doc(gameState.roomId).update({
            status: 'playing',
            startedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } else {
        showScreen('screen-game');
        initBoard();
        updatePlayersPanel();
        startGameLoop();
    }
}

// ============ БРОСОК КУБИКОВ ============
function rollDice() {
    if (gameState.gameOver) return;

    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (!currentPlayer.isMe && !currentPlayer.isBot) return;

    const btn = document.getElementById('btn-go');
    if (btn) btn.disabled = true;

    // Анимация кубиков
    let rolls = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        updateDiceDisplay(d1, d2);
        rolls++;
        if (rolls >= maxRolls) {
            clearInterval(interval);
            finalizeRoll();
        }
    }, 100);
}

function updateDiceDisplay(d1, d2) {
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    if (dice1) dice1.textContent = getDiceEmoji(d1);
    if (dice2) dice2.textContent = getDiceEmoji(d2);
}

function getDiceEmoji(n) {
    return ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][n - 1];
}

function finalizeRoll() {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    gameState.dice = [d1, d2];
    updateDiceDisplay(d1, d2);

    const isDouble = d1 === d2;
    const currentPlayer = gameState.players[gameState.currentPlayer];

    if (currentPlayer.inJail) {
        if (isDouble) {
            currentPlayer.inJail = false;
            currentPlayer.jailTurns = 0;
            showToast('Дубль! Вы выходите из тюрьмы');
        } else {
            currentPlayer.jailTurns++;
            if (currentPlayer.jailTurns >= 3) {
                currentPlayer.inJail = false;
                currentPlayer.jailTurns = 0;
                currentPlayer.money -= 50;
                showToast('Заплатили $50 и вышли из тюрьмы');
            } else {
                showToast('В тюрьме. Пропуск хода.');
                nextTurn();
                return;
            }
        }
    }

    if (isDouble) {
        gameState.doublesCount++;
        if (gameState.doublesCount >= 3) {
            showToast('3 дубля подряд! В тюрьму!');
            sendToJail(currentPlayer);
            gameState.doublesCount = 0;
            nextTurn();
            return;
        }
    } else {
        gameState.doublesCount = 0;
    }

    movePlayer(currentPlayer, d1 + d2);

    if (!isDouble) {
        setTimeout(() => nextTurn(), 1500);
    } else {
        showToast('Дубль! Ещё ход!');
        if (btn) btn.disabled = false;
    }
}

function movePlayer(player, steps) {
    const oldPos = player.position;
    player.position = (player.position + steps) % BOARD_SIZE;

    // Прошли СТАРТ
    if (player.position < oldPos && oldPos + steps >= BOARD_SIZE) {
        player.money += PASS_GO_MONEY;
        showToast(`${player.name} прошёл СТАРТ и получил $${PASS_GO_MONEY}`);
    }

    updatePlayerToken(player);

    setTimeout(() => {
        handleCellLanding(player);
    }, 500);
}

function updatePlayerToken(player) {
    // Удаляем старую фишку
    const oldToken = document.querySelector(`.player-token[data-player="${player.id}"]`);
    if (oldToken) oldToken.remove();

    // Находим клетку
    const cell = document.querySelector(`.cell[data-cell-id="${player.position}"]`);
    if (!cell) return;

    // Создаём фишку
    const token = document.createElement('div');
    token.className = 'player-token';
    token.dataset.player = player.id;
    token.style.backgroundColor = player.color;
    token.style.borderColor = '#fff';
    token.textContent = player.avatar;

    // Смещаем если несколько игроков на одной клетке
    const sameCell = gameState.players.filter(p => p.position === player.position);
    const index = sameCell.findIndex(p => p.id === player.id);
    const offset = index * 8;

    token.style.left = `${parseInt(cell.style.left) + 7 + offset}px`;
    token.style.top = `${parseInt(cell.style.top) + 7}px`;

    document.getElementById('game-board')?.appendChild(token);
}

// ============ ОБРАБОТКА КЛЕТКИ ============
function handleCellLanding(player) {
    const cell = BOARD_CELLS[player.position];

    switch (cell.type) {
        case CELL_TYPES.PROPERTY:
        case CELL_TYPES.RAILROAD:
        case CELL_TYPES.UTILITY:
            handleProperty(player, cell);
            break;
        case CELL_TYPES.CHANCE:
            drawChanceCard(player);
            break;
        case CELL_TYPES.CHEST:
            drawChestCard(player);
            break;
        case CELL_TYPES.TAX:
            player.money -= cell.price;
            showToast(`${player.name} заплатил налог $${cell.price}`);
            break;
        case CELL_TYPES.GO_TO_JAIL:
            sendToJail(player);
            break;
        case CELL_TYPES.FREE:
            showToast(`${player.name} на бесплатной парковке`);
            break;
        case CELL_TYPES.JAIL:
            showToast(`${player.name} посетил тюрьму`);
            break;
    }

    updatePlayersPanel();

    if (player.money <= 0) {
        bankrupt(player);
    }
}

function handleProperty(player, cell) {
    const boardCell = gameState.board[player.position];
    if (!boardCell) return;

    if (boardCell.owner === null) {
        // Можно купить
        if (player.isMe) {
            showBuyDialog(player, cell);
        } else if (player.isBot) {
            // Бот покупает если хватает денег
            if (player.money >= cell.price * 1.5) {
                buyProperty(player, player.position);
            }
        }
    } else if (boardCell.owner !== player.id) {
        // Заплатить аренду
        const owner = gameState.players.find(p => p.id === boardCell.owner);
        if (owner) {
            const rent = calculateRent(cell, boardCell.houses);
            player.money -= rent;
            owner.money += rent;
            showToast(`${player.name} заплатил аренду $${rent} игроку ${owner.name}`);
        }
    }
}

function calculateRent(cell, houses) {
    let base = cell.price / 10;
    if (houses > 0) base *= (1 + houses * 0.5);
    return Math.floor(base);
}

function showBuyDialog(player, cell) {
    const buy = confirm(`Купить ${cell.name} за $${cell.price}?`);
    if (buy) {
        buyProperty(player, player.position);
    }
}

function buyProperty(player, cellIndex) {
    const cell = BOARD_CELLS[cellIndex];
    if (player.money < cell.price) {
        showToast('Недостаточно денег');
        return;
    }

    player.money -= cell.price;
    player.properties.push(cellIndex);
    if (gameState.board[cellIndex]) {
        gameState.board[cellIndex].owner = player.id;
    }

    showToast(`${player.name} купил ${cell.name}`);
    updatePlayersPanel();

    if (window.db) {
        window.db.collection('games').doc(gameState.roomId).update({
            players: gameState.players,
            board: gameState.board
        });
    }
}

// ============ КАРТЫ ============
function drawChanceCard(player) {
    const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    showToast(`Шанс: ${card.text}`);

    switch (card.action) {
        case 'move':
            player.position = card.target;
            updatePlayerToken(player);
            handleCellLanding(player);
            break;
        case 'money':
            player.money += card.amount;
            break;
        case 'jail':
            sendToJail(player);
            break;
        case 'nearest':
            // Найти ближайшую Ж/д
            let nearest = 0;
            let minDist = 999;
            BOARD_CELLS.forEach((c, i) => {
                if (c.type === CELL_TYPES.RAILROAD) {
                    const dist = Math.abs(i - player.position);
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = i;
                    }
                }
            });
            player.position = nearest;
            updatePlayerToken(player);
            handleCellLanding(player);
            break;
    }
}

function drawChestCard(player) {
    const card = CHEST_CARDS[Math.floor(Math.random() * CHEST_CARDS.length)];
    showToast(`Казна: ${card.text}`);

    if (card.action === 'money') {
        player.money += card.amount;
    } else if (card.action === 'birthday') {
        gameState.players.forEach(p => {
            if (p.id !== player.id) {
                p.money -= card.amount;
                player.money += card.amount;
            }
        });
    }
}

// ============ ТЮРЬМА ============
function sendToJail(player) {
    player.position = 10; // Тюрьма
    player.inJail = true;
    player.jailTurns = 0;
    showToast(`${player.name} отправлен в тюрьму!`);
    updatePlayerToken(player);
}

// ============ БАНКРОТСТВО ============
function bankrupt(player) {
    player.money = 0;
    player.properties.forEach(propIndex => {
        if (gameState.board[propIndex]) {
            gameState.board[propIndex].owner = null;
            gameState.board[propIndex].houses = 0;
        }
    });
    player.properties = [];
    showToast(`${player.name} обанкротился!`);

    const activePlayers = gameState.players.filter(p => p.money > 0);
    if (activePlayers.length <= 1) {
        endGame(activePlayers[0]);
    }
}

// ============ СЛЕДУЮЩИЙ ХОД ============
function nextTurn() {
    gameState.currentPlayer = (gameState.currentPlayer + 1) % gameState.players.length;

    // Проверяем новый раунд
    if (gameState.currentPlayer === 0) {
        gameState.round++;
        document.getElementById('current-round') && (document.getElementById('current-round').textContent = String(gameState.round).padStart(2, '0'));

        if (gameState.round > MAX_ROUNDS) {
            endGameByAssets();
            return;
        }
    }

    updatePlayersPanel();

    const currentPlayer = gameState.players[gameState.currentPlayer];
    const btn = document.getElementById('btn-go');

    if (currentPlayer.isMe || currentPlayer.isBot) {
        if (btn) btn.disabled = false;
        if (currentPlayer.isBot) {
            setTimeout(() => rollDice(), 1000);
        }
    } else {
        if (btn) btn.disabled = true;
    }

    if (window.db) {
        window.db.collection('games').doc(gameState.roomId).update({
            currentPlayer: gameState.currentPlayer,
            round: gameState.round,
            players: gameState.players
        });
    }
}

// ============ КОНЕЦ ИГРЫ ============
function endGame(winner) {
    gameState.gameOver = true;
    showToast(`🏆 Победитель: ${winner.name}!`);
    if (window.db) {
        window.db.collection('games').doc(gameState.roomId).update({
            status: 'finished',
            winner: winner.id
        });
    }
}

function endGameByAssets() {
    gameState.gameOver = true;
    let maxAssets = -1;
    let winner = null;

    gameState.players.forEach(p => {
        const assets = p.money + p.properties.reduce((sum, prop) => sum + BOARD_CELLS[prop].price, 0);
        if (assets > maxAssets) {
            maxAssets = assets;
            winner = p;
        }
    });

    endGame(winner);
}

// ============ ОБНОВЛЕНИЕ UI ============
function updatePlayersPanel() {
    const panel = document.getElementById('players-panel');
    if (!panel) return;

    panel.innerHTML = '';
    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        if (index === gameState.currentPlayer) {
            card.style.animation = 'pulse 1s infinite';
        }

        card.innerHTML = `
            <div class="player-avatar" style="border-color: ${player.color}">
                ${player.avatar}
            </div>
            <span class="player-name">${player.name}</span>
            <span class="player-balance" style="background: ${player.color}">
                ${player.money}
            </span>
        `;

        panel.appendChild(card);
    });
}

function updateGameUI() {
    document.getElementById('current-round') && (document.getElementById('current-round').textContent = String(gameState.round).padStart(2, '0'));
}

// ============ ИГРОВОЙ ЦИКЛ ============
function startGameLoop() {
    updatePlayersPanel();
    const btn = document.getElementById('btn-go');
    if (btn) btn.disabled = false;
}

// ============ УТИЛИТЫ ============
function showToast(message) {
    const toast = document.getElementById('game-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId)?.classList.add('active');
}

function showMenu() {
    showScreen('screen-menu');
    if (roomUnsubscribe) {
        roomUnsubscribe();
        roomUnsubscribe = null;
    }
}

function showGameModes() {
    showScreen('screen-create');
}

function startCasual() {
    showScreen('screen-create');
}

function createGame() {
    showScreen('screen-create');
}

function searchGame() {
    showScreen('screen-join');
}

function showRules() {
    document.getElementById('modal-rules')?.classList.add('active');
}

function closeRules() {
    document.getElementById('modal-rules')?.classList.remove('active');
}

function showSkins() {
    showToast('Скины скоро будут доступны!');
}

function switchTab(tabId) {
    document.querySelectorAll('.rules-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(tabId)?.classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function setPlayers(n) {
    document.querySelectorAll('.player-selector button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function setBet(n) {
    document.querySelectorAll('.bet-selector button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

// ============ ЧАТ ============
function sendChat(e) {
    if (e.key !== 'Enter') return;
    const input = document.getElementById('chat-input');
    const message = input?.value.trim();
    if (!message) return;

    addChatMessage('Вы', message, true);
    input.value = '';

    if (window.db && gameState.roomId) {
        window.db.collection('games').doc(gameState.roomId).collection('chat').add({
            player: gameState.myId,
            name: 'Вы',
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

function addChatMessage(name, message, isOwn = false) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble' + (isOwn ? ' own' : '');
    bubble.textContent = `${name}: ${message}`;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

// ============ ДЕМО-РЕЖИМ ============
function initDemo() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === '1') {
        gameState.myId = generatePlayerId();
        const me = createPlayer(gameState.myId, 'Вы', true);
        me.avatar = '👤';
        gameState.players = [me];
        addBotPlayers(3);

        showScreen('screen-game');
        initBoard();

        // Размещаем фишки
        gameState.players.forEach(p => updatePlayerToken(p));
        updatePlayersPanel();
        startGameLoop();

        // Демо-сообщения в чат
        setTimeout(() => addChatMessage('Влад', 'Hello all, I'm joining you!'), 500);
        setTimeout(() => addChatMessage('Настя', 'Hello all, I'm joining you!'), 1000);
    }
}

// ============ ИНИЦИАЛИЗАЦИЯ ============
document.addEventListener('DOMContentLoaded', () => {
    initDemo();
});
