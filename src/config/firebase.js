import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import getAuth for all types login and GoogleAuthProvider for login with gmail
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import for storing files on firebase
// import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBcMy5qIpuIeNLPmWpXv6Nbak3-mVLwhzo",
  authDomain: "chatglobe-ac09d.firebaseapp.com",
  projectId: "chatglobe-ac09d",
  storageBucket: "chatglobe-ac09d.appspot.com",
  messagingSenderId: "1013698568654",
  appId: "1:1013698568654:web:ca205075b750b75215cb9f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Create variable and assign it with GoogleAuthProvider() for gmail login
export const googleProvider = new GoogleAuthProvider(); // Add google gmail provider
export const db = getFirestore(app); // Variable for database
export const storage = getStorage(app); // Variable for storage

// export const messaging = getMessaging(app);

// function requestPermission() {
//   console.log("Requesting permission...");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//       const app = initializeApp(firebaseConfig);

//       const messaging = getMessaging(app);
//       getToken(messaging, {
//         vapidKey:
//           "BPtzklm6NFDtqXfGtuHNSFfab6SFWAtN0Ws2lixXYA7tV4JGSZpBD0w0x79jhLYObZUTWR9ydKGAUdPKqzQNA9U",
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log("currentToken: ", currentToken);
//         } else {
//           console.log("Can not get token");
//         }
//       });
//     } else {
//       console.log("Do not have permission!");
//     }
//   });
// }

// requestPermission();
