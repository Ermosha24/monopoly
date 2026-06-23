// Firebase конфигурация - TopTop Monopoly
const firebaseConfig = {
    apiKey: "AIzaSyCuH1UqVMaLtnmvPNjU0fFxJ3ucIQbFksg",
    authDomain: "monopoly-a1d82.firebaseapp.com",
    databaseURL: "https://monopoly-a1d82-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "monopoly-a1d82",
    storageBucket: "monopoly-a1d82.firebasestorage.app",
    messagingSenderId: "996264930218",
    appId: "1:996264930218:web:48a33e1f061fdf366e99d3",
    measurementId: "G-54C9FYX6YG"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Экспорт для использования в других модулях
window.db = db;
window.auth = auth;
