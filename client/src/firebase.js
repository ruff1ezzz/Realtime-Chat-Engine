// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDChzYYOMFhXQnR9d0zSBK1NArZdZPSJBI",
  authDomain: "realtime-chatengine.firebaseapp.com",
  databaseURL: "https://realtime-chatengine-default-rtdb.firebaseio.com",
  projectId: "realtime-chatengine",
  storageBucket: "realtime-chatengine.firebasestorage.app",
  messagingSenderId: "156811505030",
  appId: "1:156811505030:web:92548ebeb2ff20c53b1007",
  measurementId: "G-48DK612YK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { database, auth, analytics };
