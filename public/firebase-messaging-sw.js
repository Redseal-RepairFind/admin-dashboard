// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "repairfind-admin-app.firebaseapp.com",
  projectId: "repairfind-admin-app",
  storageBucket: "repairfind-admin-app.firebasestorage.app",
  messagingSenderId: "204257946275",
  appId: "1:204257946275:web:1c89733e771746ef486d16",
  measurementId: "G-6Q1QKKWWV0",
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
    data: payload.notification.click_action,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data) {
    clients.openWindow(event.notification.data);
  }
});
