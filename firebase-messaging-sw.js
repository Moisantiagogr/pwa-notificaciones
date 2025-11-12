// Importamos las versiones compat de Firebase para SW
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuración igual que en app.js
firebase.initializeApp({
    apiKey: "AIzaSyAw8dJ-L4Ij1GWER8A0D7Vs4-VL4wTM3L4",
    authDomain: "pwa-10b-20223tn055.firebaseapp.com",
    projectId: "pwa-10b-20223tn055",
    storageBucket: "pwa-10b-20223tn055.firebasestorage.app",
    messagingSenderId: "322163094924",
    appId: "1:322163094924:web:4fc459feb7648d54a2d2a9"
});

const messaging = firebase.messaging();

// Evento cuando llega un mensaje en segundo plano
messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Notificación";
    const options = {
        body: payload.notification?.body || "",
        icon: "./icon-192.png"
    };
    self.registration.showNotification(title, options);
});

// Manejar clics en la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});