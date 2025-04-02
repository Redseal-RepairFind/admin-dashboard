// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js"
);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRMJz1ld9AExywcQfVI4lYSlQrGKMi29o",
  authDomain: "lustrous-maxim-419405.firebaseapp.com",
  projectId: "lustrous-maxim-419405",
  storageBucket: "lustrous-maxim-419405.appspot.com", // Fixed storageBucket
  messagingSenderId: "264013304597",
  appId: "1:264013304597:web:a234f027e118b74fb3cf1c",
  measurementId: "G-J29QSRWYRF",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    icon: "/logo.png", // Make sure this image exists in `public/`
    data: payload.notification?.click_action || "/",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});
