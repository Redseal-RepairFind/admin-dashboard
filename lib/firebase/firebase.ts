import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  deleteToken,
  Messaging,
} from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyCRMJz1ld9AExywcQfVI4lYSlQrGKMi29o",
  authDomain: "lustrous-maxim-419405.firebaseapp.com",
  projectId: "lustrous-maxim-419405",
  storageBucket: "lustrous-maxim-419405.firebasestorage.app",
  messagingSenderId: "264013304597",
  appId: "1:264013304597:web:a234f027e118b74fb3cf1c",
  measurementId: "G-J29QSRWYRF",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Messaging instance and token storage
let messaging: Messaging | null = null;
let fcmToken: string | null = null;

// Initialize Messaging
export const initializeMessaging = async () => {
  if (typeof window === "undefined") return; // Skip in SSR

  if (await isSupported()) {
    messaging = getMessaging(app);
    console.log("Firebase Messaging initialized");

    // Handle token refreshes
    // onTokenRefresh(messaging, async () => {
    //   try {
    //     fcmToken = await getToken(messaging!, {
    //       vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    //     });
    //     console.log("Token refreshed:", fcmToken);
    //   } catch (error) {
    //     console.error("Token refresh failed:", error);
    //     fcmToken = null;
    //   }
    // });

    return true;
  }

  console.warn("Firebase Messaging not supported");
  return false;
};

/**
 * Request Notification Permission & Get FCM Token
 */
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    if (!messaging) {
      console.warn("Firebase Messaging not initialized");
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.error("Service Workers not supported");
      return null;
    }

    let registration: ServiceWorkerRegistration | undefined;

    try {
      // Try to get existing registration first
      registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        console.log("Registering new service worker...");
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );
        console.log("Service Worker registered:", registration);
      }

      // Wait for service worker to be ready
      await new Promise<void>((resolve, reject) => {
        if (registration?.active) {
          return resolve();
        }

        const worker = registration?.installing || registration?.waiting;
        if (!worker) {
          return resolve();
        }

        worker.addEventListener("statechange", () => {
          if (worker.state === "activated") {
            resolve();
          }
        });

        setTimeout(() => {
          reject(new Error("Service Worker activation timeout"));
        }, 10000);
      });
    } catch (swError) {
      console.error("Service Worker registration failed:", swError);
      return null;
    }

    if (!registration?.active) {
      console.error("No active service worker found");
      return null;
    }

    if (!("PushManager" in window)) {
      console.error("Push notifications not supported");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return null;
    }

    try {
      fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      // console.log("FCM Token:", fcmToken);
      return fcmToken;
    } catch (tokenError) {
      console.error("Error getting FCM token:", tokenError);
      return null;
    }
  } catch (error) {
    console.error("Error in requestNotificationPermission:", error);
    return null;
  }
};

/**
 * Get current FCM token (if available)
 */
export const getCurrentToken = (): string | null => {
  return fcmToken;
};

/**
 * Delete FCM token (for logout)
 */
export const deleteFCMToken = async (): Promise<void> => {
  if (!messaging || !fcmToken) return;

  try {
    await deleteToken(messaging);
    console.log("Token successfully deleted");

    // Optional: Send revocation to your server
    await fetch("/api/revoke-token", {
      method: "POST",
      body: JSON.stringify({ token: fcmToken }),
    });
  } catch (error) {
    console.error("Error deleting token:", error);
  } finally {
    fcmToken = null;
  }
};

/**
 * Listen for Foreground Messages
 */
export const onMessageListener = () => {
  return new Promise((resolve, reject) => {
    if (!messaging) {
      reject("Messaging not initialized");
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      resolve(payload);
    });
  });
};

// Initialize messaging on module load (optional)
if (typeof window !== "undefined") {
  initializeMessaging();
}
