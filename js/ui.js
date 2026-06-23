// ============ UI ФУНКЦИИ ============

// Предотвращение зума на мобильных
window.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });

// Безопасная зона для iPhone
function setSafeArea() {
    const safeTop = getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0px';
    document.documentElement.style.setProperty('--safe-top', safeTop);
}

// Вибрация при действиях
function haptic(type = 'light') {
    if (navigator.vibrate) {
        const patterns = {
            light: [10],
            medium: [20],
            heavy: [30],
            success: [10, 50, 10],
            error: [50, 30, 50]
        };
        navigator.vibrate(patterns[type] || patterns.light);
    }
}

// Анимация появления элементов
function animateIn(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.4s ease';

    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// Пульсация кнопки
function pulseButton(selector) {
    const btn = document.querySelector(selector);
    if (!btn) return;
    btn.style.animation = 'pulse 0.5s ease';
    setTimeout(() => btn.style.animation = '', 500);
}

// Показать модальное окно с анимацией
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.querySelector('.modal-content')?.style?.transform && (modal.querySelector('.modal-content').style.transform = 'scale(0.9)');
    modal.querySelector('.modal-content')?.style?.opacity && (modal.querySelector('.modal-content').style.opacity = '0');

    requestAnimationFrame(() => {
        modal.querySelector('.modal-content')?.style?.transform && (modal.querySelector('.modal-content').style.transform = 'scale(1)');
        modal.querySelector('.modal-content')?.style?.opacity && (modal.querySelector('.modal-content').style.opacity = '1');
    });
}

// Закрыть модальное окно
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
}

// Эффект конфетти для победы
function confetti() {
    const colors = ['#ff4444', '#ffcc00', '#44ff44', '#4444ff', '#ff44ff'];
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            z-index: 9999;
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
        `;
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 5000);
    }
}

// Добавить стиль для конфетти
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(${360 + Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Проверка онлайн-статуса
window.addEventListener('online', () => showToast('Соединение восстановлено'));
window.addEventListener('offline', () => showToast('Нет соединения'));

// Автосохранение для демо
function autoSave() {
    if (gameState && gameState.roomId) {
        localStorage.setItem('monopoly_autosave', JSON.stringify({
            roomId: gameState.roomId,
            timestamp: Date.now()
        }));
    }
}

setInterval(autoSave, 30000);

// Загрузка автосохранения
function loadAutoSave() {
    const saved = localStorage.getItem('monopoly_autosave');
    if (saved) {
        const data = JSON.parse(saved);
        if (Date.now() - data.timestamp < 3600000) { // 1 час
            // Можно предложить восстановить
        }
    }
}

// Обработка кнопки назад
window.addEventListener('popstate', (e) => {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id !== 'screen-menu') {
        e.preventDefault();
        showMenu();
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    setSafeArea();
    loadAutoSave();
});
