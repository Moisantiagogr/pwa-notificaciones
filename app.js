// Importamos los módulos de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// Configuración obtenida desde Firebase Console

const firebaseConfig = {
    apiKey: "AIzaSyAw8dJ-L4Ij1GWER8A0D7Vs4-VL4wTM3L4",
    authDomain: "pwa-10b-20223tn055.firebaseapp.com",
    projectId: "pwa-10b-20223tn055",
    storageBucket: "pwa-10b-20223tn055.firebasestorage.app",
    messagingSenderId: "322163094924",
    appId: "1:322163094924:web:4fc459feb7648d54a2d2a9"
};


// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Utilidades para manipular el DOM
const $ = (sel) => document.querySelector(sel);
const log = (m) => ($("#log").textContent += (($("#log").textContent === "—" ? "" : "\n") + m));

// Mostramos el estado inicial del permiso
$("#perm").textContent = Notification.permission;

// Registramos el Service Worker que manejará las notificaciones en segundo plano
let swReg;
if ('serviceWorker' in navigator) {
    swReg = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
    console.log('SW registrado:', swReg.scope);
}

// Verificamos si el navegador soporta FCM
const supported = await isSupported();
let messaging = null;

if (supported) {
    messaging = getMessaging(app);
} else {
    log("Este navegador no soporta FCM en la Web.");
}

// Clave pública VAPID (de Cloud Messaging)
const VAPID_KEY = "BHwHy3CUptU8tCpS2PEN7TQ_bQguqBDrs9oFSNgmTRnL1p_WMexrhFhWo8QrbuWVAb94qt_XdptusHScZxUHv_g";

// Función para pedir permiso al usuario y obtener token
async function requestPermissionAndGetToken() {
    try {
        const permission = await Notification.requestPermission();
        $("#perm").textContent = permission;

        if (permission !== 'granted') {
            log("Permiso denegado por el usuario.");
            return;
        }

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: swReg,
        });

        if (token) {
            $("#token").textContent = token;
            log("Token obtenido. Usa este token en Firebase Console → Cloud Messaging.");
        } else {
            log("No se pudo obtener el token.");
        }
    } catch (err) {
        console.error(err);
        log("Error al obtener token: " + err.message);
    }
}

// Escuchamos mensajes cuando la pestaña está abierta
if (messaging) {
    onMessage(messaging, (payload) => {
        log("Mensaje en primer plano:\n" + JSON.stringify(payload, null, 2));
    });
}

// Vinculamos la función al botón de permiso
$("#btn-permission").addEventListener("click", requestPermissionAndGetToken);