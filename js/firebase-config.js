// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyCuH1UqVMaLtnmvPNjU0fFxJ3ucIQbFksg",
    authDomain: "monopoly-a1d82.firebaseapp.com",
    projectId: "monopoly-a1d82",
    storageBucket: "monopoly-a1d82.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Инициализация Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.auth = firebase.auth();
}
