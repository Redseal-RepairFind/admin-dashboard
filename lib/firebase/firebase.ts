import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCRMJz1ld9AExywcQfVI4lYSlQrGKMi29o",
  authDomain: "lustrous-maxim-419405.firebaseapp.com",
  projectId: "lustrous-maxim-419405",
  storageBucket: "lustrous-maxim-419405.firebasestorage.app",
  messagingSenderId: "264013304597",
  appId: "1:264013304597:web:a234f027e118b74fb3cf1c",
  measurementId: "G-J29QSRWYRF",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Request Notification Permission & Get Token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error getting permission:", error);
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
