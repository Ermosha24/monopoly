// Game Engine - TopTop Monopoly
class MonopolyGame {
    constructor() {
        this.gameId = null;
        this.playerId = null;
        this.players = [];
        this.board = this.createBoard();
        this.chanceCards = this.createChanceCards();
        this.kaznaCards = this.createKaznaCards();
        this.gameState = null;
        this.unsubscribe = null;
    }

    // 28 клеток поля
    createBoard() {
        return [
            { id: 0, name: 'СТАРТ', type: 'start', price: 0 },
            { id: 1, name: 'Малая улица', type: 'property', price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, color: 'brown' },
            { id: 2, name: 'Казна', type: 'kazna', price: 0 },
            { id: 3, name: 'Большая улица', type: 'property', price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, color: 'brown' },
            { id: 4, name: 'Подоходный налог', type: 'tax', price: 200 },
            { id: 5, name: 'Ж/д Станция', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 6, name: 'Аллея', type: 'property', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: 'lightblue' },
            { id: 7, name: 'Шанс', type: 'chance', price: 0 },
            { id: 8, name: 'Проспект', type: 'property', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, color: 'lightblue' },
            { id: 9, name: 'Бульвар', type: 'property', price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, color: 'lightblue' },
            { id: 10, name: 'ТЮРЬМА', type: 'jail', price: 0 },
            { id: 11, name: 'Парк', type: 'property', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, color: 'pink' },
            { id: 12, name: 'Электростанция', type: 'utility', price: 150, rent: [4, 10] },
            { id: 13, name: 'Сад', type: 'property', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, color: 'pink' },
            { id: 14, name: 'Площадь', type: 'property', price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100, color: 'pink' },
            { id: 15, name: 'Ж/д Вокзал', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 16, name: 'Набережная', type: 'property', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, color: 'orange' },
            { id: 17, name: 'Казна', type: 'kazna', price: 0 },
            { id: 18, name: 'Набережная 2', type: 'property', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, color: 'orange' },
            { id: 19, name: 'Порт', type: 'property', price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, color: 'orange' },
            { id: 20, name: 'БЕСПЛАТНАЯ ПАРКОВКА', type: 'parking', price: 0 },
            { id: 21, name: 'Улица 1', type: 'property', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, color: 'red' },
            { id: 22, name: 'Шанс', type: 'chance', price: 0 },
            { id: 23, name: 'Улица 2', type: 'property', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, color: 'red' },
            { id: 24, name: 'Улица 3', type: 'property', price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, color: 'red' },
            { id: 25, name: 'Ж/д Депо', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 26, name: 'Проспект 1', type: 'property', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, color: 'yellow' },
            { id: 27, name: 'Проспект 2', type: 'property', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, color: 'yellow' },
            { id: 28, name: 'Водоканал', type: 'utility', price: 150, rent: [4, 10] },
            { id: 29, name: 'Проспект 3', type: 'property', price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, color: 'yellow' },
            { id: 30, name: 'ИДИ В ТЮРЬМУ', type: 'gojail', price: 0 },
            { id: 31, name: 'Авеню', type: 'property', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, color: 'green' },
            { id: 32, name: 'Авеню 2', type: 'property', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, color: 'green' },
            { id: 33, name: 'Казна', type: 'kazna', price: 0 },
            { id: 34, name: 'Авеню 3', type: 'property', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, color: 'green' },
            { id: 35, name: 'Ж/д Терминал', type: 'railroad', price: 200, rent: [25, 50, 100, 200] },
            { id: 36, name: 'Шанс', type: 'chance', price: 0 },
            { id: 37, name: 'Площадь 1', type: 'property', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, color: 'blue' },
            { id: 38, name: 'Роскошный налог', type: 'tax', price: 100 },
            { id: 39, name: 'Площадь 2', type: 'property', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, color: 'blue' }
        ];
    }

    createChanceCards() {
        return [
            { text: 'Пройдите на СТАРТ', action: 'move', target: 0 },
            { text: 'Банковская ошибка в вашу пользу. Получите 200', action: 'money', amount: 200 },
            { text: 'Заплатите штраф 50', action: 'money', amount: -50 },
            { text: 'Вы выиграли кроссворд. Получите 100', action: 'money', amount: 100 },
            { text: 'Идите в тюрьму', action: 'jail' },
            { text: 'Возврат налога. Получите 20', action: 'money', amount: 20 },
            { text: 'С днём рождения! Получите 10 от каждого', action: 'birthday', amount: 10 },
            { text: 'Страховка выплачена. Получите 100', action: 'money', amount: 100 },
            { text: 'Оплатите больничные 100', action: 'money', amount: -100 },
            { text: 'Школьные взносы 150', action: 'money', amount: -150 },
            { text: 'Получите 25 за консультацию', action: 'money', amount: 25 },
            { text: 'Улица ремонт. Заплатите 40 за дом', action: 'repair', perHouse: 40 },
            { text: 'Вы 2-е в конкурсе красоты. Получите 10', action: 'money', amount: 10 },
            { text: 'Наследство 100', action: 'money', amount: 100 },
            { text: 'Займ банку 150', action: 'money', amount: -150 },
            { text: 'Премия 50', action: 'money', amount: 50 }
        ];
    }

    createKaznaCards() {
        return [
            { text: 'Выход из тюрьмы (карта)', action: 'jailcard' },
            { text: 'Ошибка банка. Получите 200', action: 'money', amount: 200 },
            { text: 'Продажа акций. Получите 50', action: 'money', amount: 50 },
            { text: 'Курсы. Заплатите 50', action: 'money', amount: -50 },
            { text: 'День рождения. Получите 10 от каждого', action: 'birthday', amount: 10 },
            { text: 'Наследство 100', action: 'money', amount: 100 },
            { text: 'Возврат долга 20', action: 'money', amount: 20 },
            { text: 'Страховка 100', action: 'money', amount: 100 },
            { text: 'Больница 50', action: 'money', amount: -50 },
            { text: 'Школа 50', action: 'money', amount: -50 },
            { text: 'Консультация 25', action: 'money', amount: 25 },
            { text: 'Ремонт 40 за дом', action: 'repair', perHouse: 40 },
            { text: 'Конкурс 10', action: 'money', amount: 10 },
            { text: 'Наследство 100', action: 'money', amount: 100 },
            { text: 'Займ 150', action: 'money', amount: -150 },
            { text: 'Премия 50', action: 'money', amount: 50 }
        ];
    }

    async createGame(playerName, skin = 'hat') {
        const gameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        const playerId = 'player_' + Date.now();

        const gameData = {
            id: gameId,
            status: 'waiting',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            currentPlayer: 0,
            round: 1,
            maxRounds: 28,
            players: {
                [playerId]: {
                    id: playerId,
                    name: playerName,
                    skin: skin,
                    money: 1500,
                    position: 0,
                    properties: [],
                    houses: {},
                    inJail: false,
                    jailTurns: 0,
                    jailCards: 0,
                    bankrupt: false,
                    doubles: 0,
                    isBot: false
                }
            },
            turnOrder: [playerId],
            chat: [],
            turnTimer: null,
            lastRoll: null,
            boardState: {},
            chanceDeck: this.shuffleArray([...Array(16).keys()]),
            kaznaDeck: this.shuffleArray([...Array(16).keys()]),
            chanceIndex: 0,
            kaznaIndex: 0
        };

        await db.collection('games').doc(gameId).set(gameData);
        this.gameId = gameId;
        this.playerId = playerId;
        return { gameId, playerId };
    }

    async joinGame(gameId, playerName, skin = 'hat') {
        const gameRef = db.collection('games').doc(gameId);
        const gameDoc = await gameRef.get();

        if (!gameDoc.exists) throw new Error('Игра не найдена');

        const gameData = gameDoc.data();
        if (gameData.status !== 'waiting') throw new Error('Игра уже началась');
        if (Object.keys(gameData.players).length >= 4) throw new Error('Игра заполнена');

        const playerId = 'player_' + Date.now();
        const playerData = {
            id: playerId,
            name: playerName,
            skin: skin,
            money: 1500,
            position: 0,
            properties: [],
            houses: {},
            inJail: false,
            jailTurns: 0,
            jailCards: 0,
            bankrupt: false,
            doubles: 0,
            isBot: false
        };

        await gameRef.update({
            [`players.${playerId}`]: playerData,
            turnOrder: firebase.firestore.FieldValue.arrayUnion(playerId)
        });

        this.gameId = gameId;
        this.playerId = playerId;
        return { gameId, playerId };
    }

    async startGame() {
        if (!this.gameId) return;
        await db.collection('games').doc(this.gameId).update({
            status: 'playing',
            startedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    subscribeToGame(callback) {
        if (!this.gameId) return;
        this.unsubscribe = db.collection('games').doc(this.gameId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    this.gameState = doc.data();
                    callback(this.gameState);
                }
            });
    }

    unsubscribeFromGame() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    async rollDice() {
        if (!this.gameState || this.gameState.status !== 'playing') return null;

        const currentPlayerId = this.gameState.turnOrder[this.gameState.currentPlayer];
        if (currentPlayerId !== this.playerId) return null;

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const isDouble = dice1 === dice2;
        const total = dice1 + dice2;

        await this.addToLog(`${this.gameState.players[currentPlayerId].name} бросает ${dice1}+${dice2}`);

        return { dice1, dice2, total, isDouble };
    }

    async movePlayer(diceResult) {
        const currentPlayerId = this.gameState.turnOrder[this.gameState.currentPlayer];
        const player = this.gameState.players[currentPlayerId];

        let newPosition = (player.position + diceResult.total) % 40;
        let passedGo = player.position + diceResult.total >= 40;
        let doubles = diceResult.isDouble ? player.doubles + 1 : 0;
        let inJail = player.inJail;
        let jailTurns = player.jailTurns;

        // 3 дубля = тюрьма
        if (doubles >= 3) {
            newPosition = 10;
            inJail = true;
            jailTurns = 3;
            doubles = 0;
            await this.addToLog(`${player.name} попадает в тюрьму за 3 дубля!`);
        } else if (diceResult.isDouble && player.inJail) {
            // Дубль выходит из тюрьмы
            inJail = false;
            jailTurns = 0;
            await this.addToLog(`${player.name} выходит из тюрьмы по дублю!`);
        }

        // Прошли СТАРТ
        if (passedGo && !player.inJail) {
            await this.updatePlayerMoney(currentPlayerId, 200);
            await this.addToLog(`${player.name} получает 200 за проход СТАРТ`);
        }

        await db.collection('games').doc(this.gameId).update({
            [`players.${currentPlayerId}.position`]: newPosition,
            [`players.${currentPlayerId}.doubles`]: doubles,
            [`players.${currentPlayerId}.inJail`]: inJail,
            [`players.${currentPlayerId}.jailTurns`]: jailTurns,
            lastRoll: diceResult
        });

        return newPosition;
    }

    async handleCellLanding(position) {
        const cell = this.board[position];
        const currentPlayerId = this.gameState.turnOrder[this.gameState.currentPlayer];
        const player = this.gameState.players[currentPlayerId];

        switch (cell.type) {
            case 'start':
                await this.updatePlayerMoney(currentPlayerId, 200);
                break;
            case 'property':
            case 'railroad':
            case 'utility':
                await this.handlePropertyLanding(cell, currentPlayerId);
                break;
            case 'chance':
                await this.drawChance(currentPlayerId);
                break;
            case 'kazna':
                await this.drawKazna(currentPlayerId);
                break;
            case 'tax':
                await this.updatePlayerMoney(currentPlayerId, -cell.price);
                await this.addToLog(`${player.name} платит налог ${cell.price}`);
                break;
            case 'jail':
                await this.addToLog(`${player.name} посетил тюрьму`);
                break;
            case 'gojail':
                await this.sendToJail(currentPlayerId);
                break;
            case 'parking':
                await this.addToLog(`${player.name} на бесплатной парковке`);
                break;
        }
    }

    async handlePropertyLanding(cell, playerId) {
        const boardState = this.gameState.boardState || {};
        const ownerId = boardState[cell.id]?.owner;
        const player = this.gameState.players[playerId];

        if (!ownerId) {
            // Свободная - предложить купить
            window.dispatchEvent(new CustomEvent('offer-buy', { 
                detail: { cell, playerId, price: cell.price } 
            }));
        } else if (ownerId !== playerId) {
            // Заплатить аренду
            const rent = this.calculateRent(cell, ownerId);
            await this.updatePlayerMoney(playerId, -rent);
            await this.updatePlayerMoney(ownerId, rent);
            await this.addToLog(`${player.name} платит аренду ${rent} ${this.gameState.players[ownerId].name}`);
        }
    }

    calculateRent(cell, ownerId) {
        const boardState = this.gameState.boardState || {};
        const cellState = boardState[cell.id] || {};

        if (cell.type === 'property') {
            const houses = cellState.houses || 0;
            return cell.rent[houses];
        } else if (cell.type === 'railroad') {
            const railroads = Object.values(boardState).filter(c => 
                c.owner === ownerId && this.board[c.cellId]?.type === 'railroad'
            ).length;
            return cell.rent[Math.min(railroads - 1, 3)];
        } else if (cell.type === 'utility') {
            const utilities = Object.values(boardState).filter(c => 
                c.owner === ownerId && this.board[c.cellId]?.type === 'utility'
            ).length;
            const multiplier = utilities === 2 ? 10 : 4;
            return (this.gameState.lastRoll?.total || 0) * multiplier;
        }
        return 0;
    }

    async buyProperty(cellId) {
        const currentPlayerId = this.gameState.turnOrder[this.gameState.currentPlayer];
        const player = this.gameState.players[currentPlayerId];
        const cell = this.board[cellId];

        if (player.money < cell.price) return false;

        await this.updatePlayerMoney(currentPlayerId, -cell.price);
        await db.collection('games').doc(this.gameId).update({
            [`boardState.${cellId}`]: { owner: currentPlayerId, cellId: cellId, houses: 0 },
            [`players.${currentPlayerId}.properties`]: firebase.firestore.FieldValue.arrayUnion(cellId)
        });
        await this.addToLog(`${player.name} купил ${cell.name} за ${cell.price}`);
        return true;
    }

    async buildHouse(cellId) {
        const currentPlayerId = this.gameState.turnOrder[this.gameState.currentPlayer];
        const player = this.gameState.players[currentPlayerId];
        const cell = this.board[cellId];
        const boardState = this.gameState.boardState || {};
        const cellState = boardState[cellId] || {};

        if (cellState.houses >= 5) return false;
        if (player.money < cell.houseCost) return false;

        await this.updatePlayerMoney(currentPlayerId, -cell.houseCost);
        await db.collection('games').doc(this.gameId).update({
            [`boardState.${cellId}.houses`]: (cellState.houses || 0) + 1
        });
        await this.addToLog(`${player.name} строит дом на ${cell.name}`);
        return true;
    }

    async drawChance(playerId) {
        const deck = this.gameState.chanceDeck || [...Array(16).keys()];
        const index = this.gameState.chanceIndex || 0;
        const card = this.chanceCards[deck[index % 16]];

        await this.addToLog(`Шанс: ${card.text}`);
        await this.executeCard(card, playerId);

        await db.collection('games').doc(this.gameId).update({
            chanceIndex: (index + 1) % 16
        });
    }

    async drawKazna(playerId) {
        const deck = this.gameState.kaznaDeck || [...Array(16).keys()];
        const index = this.gameState.kaznaIndex || 0;
        const card = this.kaznaCards[deck[index % 16]];

        await this.addToLog(`Казна: ${card.text}`);
        await this.executeCard(card, playerId);

        await db.collection('games').doc(this.gameId).update({
            kaznaIndex: (index + 1) % 16
        });
    }

    async executeCard(card, playerId) {
        const player = this.gameState.players[playerId];

        switch (card.action) {
            case 'move':
                await db.collection('games').doc(this.gameId).update({
                    [`players.${playerId}.position`]: card.target
                });
                if (card.target === 10) await this.sendToJail(playerId);
                break;
            case 'money':
                await this.updatePlayerMoney(playerId, card.amount);
                break;
            case 'jail':
                await this.sendToJail(playerId);
                break;
            case 'jailcard':
                await db.collection('games').doc(this.gameId).update({
                    [`players.${playerId}.jailCards`]: firebase.firestore.FieldValue.increment(1)
                });
                break;
            case 'birthday':
                for (const pid of this.gameState.turnOrder) {
                    if (pid !== playerId) {
                        await this.updatePlayerMoney(pid, -card.amount);
                    }
                }
                await this.updatePlayerMoney(playerId, card.amount * (this.gameState.turnOrder.length - 1));
                break;
            case 'repair':
                const houses = Object.values(this.gameState.boardState || {})
                    .filter(c => c.owner === playerId)
                    .reduce((sum, c) => sum + (c.houses || 0), 0);
                await this.updatePlayerMoney(playerId, -houses * card.perHouse);
                break;
        }
    }

    async sendToJail(playerId) {
        await db.collection('games').doc(this.gameId).update({
            [`players.${playerId}.position`]: 10,
            [`players.${playerId}.inJail`]: true,
            [`players.${playerId}.jailTurns`]: 3,
            [`players.${playerId}.doubles`]: 0
        });
        await this.addToLog(`${this.gameState.players[playerId].name} отправляется в тюрьму!`);
    }

    async payJailFine(playerId) {
        await this.updatePlayerMoney(playerId, -50);
        await db.collection('games').doc(this.gameId).update({
            [`players.${playerId}.inJail`]: false,
            [`players.${playerId}.jailTurns`]: 0
        });
        await this.addToLog(`${this.gameState.players[playerId].name} заплатил 50 за выход из тюрьмы`);
    }

    async useJailCard(playerId) {
        await db.collection('games').doc(this.gameId).update({
            [`players.${playerId}.inJail`]: false,
            [`players.${playerId}.jailTurns`]: 0,
            [`players.${playerId}.jailCards`]: firebase.firestore.FieldValue.increment(-1)
        });
        await this.addToLog(`${this.gameState.players[playerId].name} использовал карту выхода из тюрьмы`);
    }

    async endTurn() {
        const currentPlayerId = this.gameState.turnOrder[this.gameState.currentPlayer];
        const player = this.gameState.players[currentPlayerId];

        // Сброс дублей
        await db.collection('games').doc(this.gameId).update({
            [`players.${currentPlayerId}.doubles`]: 0
        });

        // Проверка банкротства
        if (player.money < 0) {
            await this.handleBankruptcy(currentPlayerId);
        }

        // Следующий игрок
        let nextPlayer = (this.gameState.currentPlayer + 1) % this.gameState.turnOrder.length;

        // Пропускаем банкротов
        while (this.gameState.players[this.gameState.turnOrder[nextPlayer]]?.bankrupt) {
            nextPlayer = (nextPlayer + 1) % this.gameState.turnOrder.length;
        }

        // Увеличиваем раунд
        let round = this.gameState.round;
        if (nextPlayer === 0) round++;

        await db.collection('games').doc(this.gameId).update({
            currentPlayer: nextPlayer,
            round: round,
            lastRoll: null
        });

        // Проверка конца игры
        if (round > this.gameState.maxRounds) {
            await this.endGame();
        }
    }

    async handleBankruptcy(playerId) {
        const player = this.gameState.players[playerId];
        const boardState = this.gameState.boardState || {};

        // Отдаём всё банку (простая версия)
        for (const cellId of player.properties) {
            delete boardState[cellId];
        }

        await db.collection('games').doc(this.gameId).update({
            [`players.${playerId}.bankrupt`]: true,
            [`players.${playerId}.money`]: 0,
            [`players.${playerId}.properties`]: [],
            boardState: boardState
        });
        await this.addToLog(`${player.name} объявлен банкротом!`);
    }

    async endGame() {
        const players = Object.values(this.gameState.players);
        const winner = players.reduce((best, p) => 
            !p.bankrupt && p.money > best.money ? p : best, players[0]
        );

        await db.collection('games').doc(this.gameId).update({
            status: 'finished',
            winner: winner.id,
            finishedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        await this.addToLog(`🏆 Игра окончена! Победитель: ${winner.name} с ${winner.money}!`);
    }

    async updatePlayerMoney(playerId, amount) {
        await db.collection('games').doc(this.gameId).update({
            [`players.${playerId}.money`]: firebase.firestore.FieldValue.increment(amount)
        });
    }

    async addToLog(message) {
        await db.collection('games').doc(this.gameId).update({
            chat: firebase.firestore.FieldValue.arrayUnion({
                text: message,
                time: Date.now(),
                system: true
            })
        });
    }

    async sendChat(message) {
        if (!this.gameId || !this.playerId) return;
        await db.collection('games').doc(this.gameId).update({
            chat: firebase.firestore.FieldValue.arrayUnion({
                text: message,
                playerId: this.playerId,
                playerName: this.gameState?.players[this.playerId]?.name || 'Игрок',
                time: Date.now(),
                system: false
            })
        });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getMyPlayer() {
        if (!this.gameState || !this.playerId) return null;
        return this.gameState.players[this.playerId];
    }

    isMyTurn() {
        if (!this.gameState || !this.playerId) return false;
        const currentId = this.gameState.turnOrder[this.gameState.currentPlayer];
        return currentId === this.playerId;
    }
}

window.monopolyGame = new MonopolyGame();
