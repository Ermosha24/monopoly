// UI Manager - TopTop Monopoly
class UIManager {
    constructor() {
        this.screens = ['auth', 'menu', 'lobby', 'game', 'gameover'];
        this.currentScreen = 'auth';
        this.skins = [
            { id: 'hat', name: 'Шляпа', emoji: '🎩', color: '#8B4513' },
            { id: 'penguin', name: 'Пингвин', emoji: '🐧', color: '#2C3E50' },
            { id: 'duck', name: 'Утка', emoji: '🦆', color: '#F1C40F' },
            { id: 'car', name: 'Машина', emoji: '🚗', color: '#E74C3C' },
            { id: 'boat', name: 'Катер', emoji: '🚢', color: '#3498DB' },
            { id: 'train', name: 'Поезд', emoji: '🚂', color: '#95A5A6' },
            { id: 'ufo', name: 'НЛО', emoji: '🛸', color: '#9B59B6' }
        ];
        this.selectedSkin = 'hat';
        this.turnTimer = null;
    }

    init() {
        this.setupEventListeners();
        this.renderSkinSelector();
        this.showScreen('auth');
    }

    setupEventListeners() {
        // Auth
        window.addEventListener('auth-ready', (e) => {
            this.showScreen('menu');
            document.getElementById('player-name').value = e.detail.displayName || 'Игрок';
        });

        // Menu
        document.getElementById('btn-create').addEventListener('click', () => this.onCreateGame());
        document.getElementById('btn-join').addEventListener('click', () => this.showJoinDialog());
        document.getElementById('btn-rules').addEventListener('click', () => this.showRules());

        // Lobby
        document.getElementById('btn-start-game').addEventListener('click', () => this.onStartGame());
        document.getElementById('btn-leave-lobby').addEventListener('click', () => this.onLeaveLobby());
        document.getElementById('btn-add-bot').addEventListener('click', () => this.onAddBot());

        // Game
        document.getElementById('btn-roll').addEventListener('click', () => this.onRollDice());
        document.getElementById('btn-buy').addEventListener('click', () => this.onBuyProperty());
        document.getElementById('btn-skip-buy').addEventListener('click', () => this.onSkipBuy());
        document.getElementById('btn-build').addEventListener('click', () => this.onBuildHouse());
        document.getElementById('btn-end-turn').addEventListener('click', () => this.onEndTurn());
        document.getElementById('btn-pay-jail').addEventListener('click', () => this.onPayJail());
        document.getElementById('btn-use-card').addEventListener('click', () => this.onUseJailCard());
        document.getElementById('btn-chat-send').addEventListener('click', () => this.onSendChat());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.onSendChat();
        });

        // Game events
        window.addEventListener('offer-buy', (e) => this.showBuyDialog(e.detail));
    }

    showScreen(screenName) {
        this.screens.forEach(s => {
            const el = document.getElementById(s + '-screen');
            if (el) {
                el.classList.toggle('hidden', s !== screenName);
                el.classList.toggle('active', s === screenName);
            }
        });
        this.currentScreen = screenName;
    }

    renderSkinSelector() {
        const container = document.getElementById('skin-selector');
        if (!container) return;

        container.innerHTML = this.skins.map(skin => `
            <div class="skin-option ${skin.id === this.selectedSkin ? 'selected' : ''}" 
                 data-skin="${skin.id}" style="--skin-color: ${skin.color}">
                <span class="skin-emoji">${skin.emoji}</span>
                <span class="skin-name">${skin.name}</span>
            </div>
        `).join('');

        container.querySelectorAll('.skin-option').forEach(el => {
            el.addEventListener('click', () => {
                this.selectedSkin = el.dataset.skin;
                this.renderSkinSelector();
            });
        });
    }

    async onCreateGame() {
        const playerName = document.getElementById('player-name').value.trim() || 'Игрок';
        try {
            const { gameId } = await monopolyGame.createGame(playerName, this.selectedSkin);
            this.showLobby(gameId, true);
        } catch (e) {
            this.showToast('Ошибка создания игры: ' + e.message);
        }
    }

    showJoinDialog() {
        const gameId = prompt('Введите ID игры:');
        if (!gameId) return;
        this.joinGame(gameId);
    }

    async joinGame(gameId) {
        const playerName = document.getElementById('player-name').value.trim() || 'Игрок';
        try {
            await monopolyGame.joinGame(gameId, playerName, this.selectedSkin);
            this.showLobby(gameId, false);
        } catch (e) {
            this.showToast('Ошибка: ' + e.message);
        }
    }

    showLobby(gameId, isHost) {
        this.showScreen('lobby');
        document.getElementById('lobby-game-id').textContent = gameId;
        document.getElementById('btn-start-game').style.display = isHost ? 'block' : 'none';
        document.getElementById('btn-add-bot').style.display = isHost ? 'block' : 'none';

        monopolyGame.subscribeToGame((state) => {
            this.renderLobbyPlayers(state);
            if (state.status === 'playing') {
                this.startGameUI(state);
            }
        });
    }

    renderLobbyPlayers(state) {
        const container = document.getElementById('lobby-players');
        const players = Object.values(state.players);

        container.innerHTML = players.map(p => {
            const skin = this.skins.find(s => s.id === p.skin) || this.skins[0];
            return `
                <div class="lobby-player">
                    <span class="player-skin">${skin.emoji}</span>
                    <span class="player-name">${p.name}${p.isBot ? ' (Бот)' : ''}</span>
                    <span class="player-status ${p.isBot ? 'bot' : 'ready'}">●</span>
                </div>
            `;
        }).join('');
    }

    async onStartGame() {
        await monopolyGame.startGame();
    }

    async onLeaveLobby() {
        monopolyGame.unsubscribeFromGame();
        monopolyGame.gameId = null;
        this.showScreen('menu');
    }

    async onAddBot() {
        const botNames = ['Алиса', 'Борис', 'Вика', 'Гриша', 'Даша', 'Егор'];
        const botSkins = ['penguin', 'duck', 'car', 'boat', 'train', 'ufo'];
        const gameRef = db.collection('games').doc(monopolyGame.gameId);
        const gameDoc = await gameRef.get();
        const data = gameDoc.data();

        if (Object.keys(data.players).length >= 4) {
            this.showToast('Максимум 4 игрока');
            return;
        }

        const botId = 'bot_' + Date.now();
        const botNum = Object.keys(data.players).filter(k => k.startsWith('bot')).length;

        await gameRef.update({
            [`players.${botId}`]: {
                id: botId,
                name: botNames[botNum % botNames.length] + ' (Бот)',
                skin: botSkins[botNum % botSkins.length],
                money: 1500,
                position: 0,
                properties: [],
                houses: {},
                inJail: false,
                jailTurns: 0,
                jailCards: 0,
                bankrupt: false,
                doubles: 0,
                isBot: true
            },
            turnOrder: firebase.firestore.FieldValue.arrayUnion(botId)
        });
    }

    startGameUI(state) {
        this.showScreen('game');
        this.renderBoard();
        this.updateGameUI(state);

        monopolyGame.subscribeToGame((newState) => {
            this.updateGameUI(newState);
        });
    }

    renderBoard() {
        const board = document.getElementById('game-board');
        if (!board) return;

        const cells = monopolyGame.board;
        board.innerHTML = '';

        cells.forEach((cell, index) => {
            const cellEl = document.createElement('div');
            cellEl.className = `board-cell cell-${cell.type}`;
            cellEl.id = `cell-${index}`;
            cellEl.dataset.index = index;

            let content = '';
            if (cell.type === 'property') {
                content = `
                    <div class="cell-color" style="background: ${this.getColorCode(cell.color)}"></div>
                    <div class="cell-name">${cell.name}</div>
                    <div class="cell-price">$${cell.price}</div>
                `;
            } else if (cell.type === 'start') {
                content = `<div class="cell-icon">🏁</div><div class="cell-name">СТАРТ</div>`;
            } else if (cell.type === 'jail') {
                content = `<div class="cell-icon">🔒</div><div class="cell-name">ТЮРЬМА</div>`;
            } else if (cell.type === 'gojail') {
                content = `<div class="cell-icon">👮</div><div class="cell-name">В ТЮРЬМУ</div>`;
            } else if (cell.type === 'parking') {
                content = `<div class="cell-icon">🅿️</div><div class="cell-name">ПАРКОВКА</div>`;
            } else if (cell.type === 'chance') {
                content = `<div class="cell-icon">❓</div><div class="cell-name">ШАНС</div>`;
            } else if (cell.type === 'kazna') {
                content = `<div class="cell-icon">🏦</div><div class="cell-name">КАЗНА</div>`;
            } else if (cell.type === 'tax') {
                content = `<div class="cell-icon">💸</div><div class="cell-name">НАЛОГ</div><div class="cell-price">$${cell.price}</div>`;
            } else if (cell.type === 'railroad') {
                content = `<div class="cell-icon">🚂</div><div class="cell-name">${cell.name}</div><div class="cell-price">$${cell.price}</div>`;
            } else if (cell.type === 'utility') {
                content = `<div class="cell-icon">💡</div><div class="cell-name">${cell.name}</div><div class="cell-price">$${cell.price}</div>`;
            }

            cellEl.innerHTML = content;
            board.appendChild(cellEl);
        });
    }

    getColorCode(color) {
        const colors = {
            brown: '#8B4513', lightblue: '#87CEEB', pink: '#FF69B4',
            orange: '#FFA500', red: '#FF0000', yellow: '#FFFF00',
            green: '#008000', blue: '#0000FF'
        };
        return colors[color] || '#999';
    }

    updateGameUI(state) {
        if (!state) return;

        // Обновляем игроков
        this.renderPlayers(state);

        // Обновляем позиции на доске
        this.renderPlayerPositions(state);

        // Обновляем владение клетками
        this.renderOwnership(state);

        // Обновляем чат
        this.renderChat(state);

        // Обновляем кнопки управления
        this.updateControls(state);

        // Обновляем информацию о ходе
        this.renderTurnInfo(state);

        // Обновляем таймер
        this.updateTimer(state);
    }

    renderPlayers(state) {
        const container = document.getElementById('players-panel');
        if (!container) return;

        const turnOrder = state.turnOrder;
        const currentId = turnOrder[state.currentPlayer];

        container.innerHTML = turnOrder.map(pid => {
            const p = state.players[pid];
            if (!p || p.bankrupt) return '';
            const skin = this.skins.find(s => s.id === p.skin) || this.skins[0];
            const isCurrent = pid === currentId;
            const isMe = pid === monopolyGame.playerId;

            return `
                <div class="player-card ${isCurrent ? 'current' : ''} ${isMe ? 'me' : ''}">
                    <div class="player-avatar" style="background: ${skin.color}">${skin.emoji}</div>
                    <div class="player-info">
                        <div class="player-name">${p.name}${isMe ? ' (Вы)' : ''}</div>
                        <div class="player-money">$${p.money}</div>
                        <div class="player-stats">
                            🏠 ${p.properties.length} | 
                            ${p.inJail ? '🔒' : '📍'} ${p.position}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPlayerPositions(state) {
        // Очищаем все токены
        document.querySelectorAll('.player-token').forEach(t => t.remove());

        const turnOrder = state.turnOrder;
        turnOrder.forEach((pid, index) => {
            const p = state.players[pid];
            if (!p || p.bankrupt) return;

            const cell = document.getElementById(`cell-${p.position}`);
            if (!cell) return;

            const skin = this.skins.find(s => s.id === p.skin) || this.skins[0];
            const token = document.createElement('div');
            token.className = 'player-token';
            token.style.background = skin.color;
            token.innerHTML = skin.emoji;
            token.style.zIndex = 10 + index;

            // Позиционирование токенов в клетке
            const offset = index * 15;
            token.style.transform = `translate(${offset}px, ${offset}px)`;

            cell.appendChild(token);
        });
    }

    renderOwnership(state) {
        const boardState = state.boardState || {};

        Object.entries(boardState).forEach(([cellId, data]) => {
            const cell = document.getElementById(`cell-${cellId}`);
            if (!cell) return;

            const owner = state.players[data.owner];
            if (!owner) return;

            const skin = this.skins.find(s => s.id === owner.skin) || this.skins[0];

            let ownerBadge = cell.querySelector('.owner-badge');
            if (!ownerBadge) {
                ownerBadge = document.createElement('div');
                ownerBadge.className = 'owner-badge';
                cell.appendChild(ownerBadge);
            }
            ownerBadge.innerHTML = skin.emoji;
            ownerBadge.style.background = skin.color;

            // Дома
            if (data.houses > 0) {
                let housesEl = cell.querySelector('.houses-indicator');
                if (!housesEl) {
                    housesEl = document.createElement('div');
                    housesEl.className = 'houses-indicator';
                    cell.appendChild(housesEl);
                }
                housesEl.innerHTML = '🏠'.repeat(Math.min(data.houses, 4)) + (data.houses === 5 ? '🏨' : '');
            }
        });
    }

    renderChat(state) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const messages = state.chat || [];
        const lastMessages = messages.slice(-50);

        container.innerHTML = lastMessages.map(msg => {
            if (msg.system) {
                return `<div class="chat-system">${msg.text}</div>`;
            }
            return `
                <div class="chat-message">
                    <span class="chat-author">${msg.playerName}:</span>
                    <span class="chat-text">${this.escapeHtml(msg.text)}</span>
                </div>
            `;
        }).join('');

        container.scrollTop = container.scrollHeight;
    }

    updateControls(state) {
        const isMyTurn = monopolyGame.isMyTurn();
        const myPlayer = monopolyGame.getMyPlayer();

        if (!myPlayer || myPlayer.bankrupt) {
            this.setButtonsVisible(['btn-end-turn']);
            return;
        }

        const buttons = {
            'btn-roll': isMyTurn && !state.lastRoll,
            'btn-end-turn': isMyTurn && state.lastRoll,
            'btn-buy': false,
            'btn-skip-buy': false,
            'btn-build': isMyTurn && !state.lastRoll && myPlayer.properties.length > 0,
            'btn-pay-jail': isMyTurn && myPlayer.inJail,
            'btn-use-card': isMyTurn && myPlayer.inJail && myPlayer.jailCards > 0
        };

        Object.entries(buttons).forEach(([id, visible]) => {
            const btn = document.getElementById(id);
            if (btn) btn.style.display = visible ? 'block' : 'none';
        });
    }

    setButtonsVisible(ids) {
        ['btn-roll', 'btn-end-turn', 'btn-buy', 'btn-skip-buy', 'btn-build', 'btn-pay-jail', 'btn-use-card']
            .forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = ids.includes(id) ? 'block' : 'none';
            });
    }

    renderTurnInfo(state) {
        const info = document.getElementById('turn-info');
        if (!info) return;

        const currentId = state.turnOrder[state.currentPlayer];
        const player = state.players[currentId];

        if (!player) return;

        const isMyTurn = currentId === monopolyGame.playerId;
        info.innerHTML = `
            <div class="turn-badge">Раунд ${state.round}/${state.maxRounds}</div>
            <div class="current-player">
                Ход: <strong>${player.name}</strong>${isMyTurn ? ' (Ваш ход!)' : ''}
            </div>
            ${state.lastRoll ? `
                <div class="dice-result">
                    🎲 ${state.lastRoll.dice1} + ${state.lastRoll.dice2} = ${state.lastRoll.total}
                    ${state.lastRoll.isDouble ? ' (Дубль!)' : ''}
                </div>
            ` : ''}
        `;
    }

    updateTimer(state) {
        if (this.turnTimer) clearInterval(this.turnTimer);

        const isMyTurn = monopolyGame.isMyTurn();
        if (!isMyTurn || state.status !== 'playing') {
            document.getElementById('turn-timer').textContent = '';
            return;
        }

        let timeLeft = 30;
        const timerEl = document.getElementById('turn-timer');
        timerEl.textContent = `⏱️ ${timeLeft}s`;

        this.turnTimer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = `⏱️ ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(this.turnTimer);
                this.onEndTurn();
            }
        }, 1000);
    }

    async onRollDice() {
        const btn = document.getElementById('btn-roll');
        btn.disabled = true;
        btn.innerHTML = '🎲 Бросаем...';

        // Анимация кубиков
        const diceEl = document.getElementById('dice-animation');
        diceEl.classList.remove('hidden');

        for (let i = 0; i < 10; i++) {
            diceEl.innerHTML = `🎲 ${Math.floor(Math.random() * 6) + 1} + ${Math.floor(Math.random() * 6) + 1}`;
            await this.sleep(100);
        }

        const result = await monopolyGame.rollDice();
        if (!result) {
            btn.disabled = false;
            btn.innerHTML = '🎲 Бросить кубики';
            diceEl.classList.add('hidden');
            return;
        }

        diceEl.innerHTML = `🎲 ${result.dice1} + ${result.dice2} = ${result.total}${result.isDouble ? ' (Дубль!)' : ''}`;

        // Перемещаем фишку
        const newPos = await monopolyGame.movePlayer(result);
        await this.sleep(500);

        // Обрабатываем клетку
        await monopolyGame.handleCellLanding(newPos);

        btn.disabled = false;
        btn.innerHTML = '🎲 Бросить кубики';

        // Если не дубль - можно закончить ход
        if (!result.isDouble) {
            diceEl.classList.add('hidden');
        }
    }

    showBuyDialog(detail) {
        const dialog = document.getElementById('buy-dialog');
        const cell = detail.cell;

        document.getElementById('buy-property-name').textContent = cell.name;
        document.getElementById('buy-property-price').textContent = `$${cell.price}`;
        document.getElementById('buy-property-rent').textContent = `Аренда: $${cell.rent[0]}`;

        dialog.classList.remove('hidden');
    }

    async onBuyProperty() {
        const cellId = monopolyGame.gameState.players[monopolyGame.playerId].position;
        const success = await monopolyGame.buyProperty(cellId);

        document.getElementById('buy-dialog').classList.add('hidden');

        if (success) {
            this.showToast('Имущество куплено!');
        } else {
            this.showToast('Недостаточно денег!');
        }
    }

    onSkipBuy() {
        document.getElementById('buy-dialog').classList.add('hidden');
    }

    async onBuildHouse() {
        const myPlayer = monopolyGame.getMyPlayer();
        if (!myPlayer || myPlayer.properties.length === 0) return;

        // Простая версия - строим на первой доступной
        const cellId = myPlayer.properties[0];
        const success = await monopolyGame.buildHouse(cellId);

        if (success) {
            this.showToast('Дом построен!');
        } else {
            this.showToast('Нельзя построить (нет денег или макс домов)');
        }
    }

    async onEndTurn() {
        if (this.turnTimer) clearInterval(this.turnTimer);
        await monopolyGame.endTurn();
    }

    async onPayJail() {
        await monopolyGame.payJailFine(monopolyGame.playerId);
    }

    async onUseJailCard() {
        await monopolyGame.useJailCard(monopolyGame.playerId);
    }

    async onSendChat() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        await monopolyGame.sendChat(text);
        input.value = '';
    }

    showRules() {
        alert(`Правила TopTop Monopoly:

🎯 Цель: Набрать больше всех активов за 28 раундов

🎲 Ход:
- Бросьте 2 кубика
- 3 дубля подряд = тюрьма
- Пройдите СТАРТ = +200

🏠 Имущество:
- Покупайте свободные клетки
- Стройте дома для увеличения аренды
- Попадая на чужое - платите аренду

🔒 Тюрьма:
- Заплатите 50
- Используйте карту
- Выбросите дубль

💰 Банкротство:
- При отрицательном балансе
- Все активы возвращаются банку

🏆 Победа:
- После 28 раундов побеждает богатейший игрок`);
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.uiManager = new UIManager();
