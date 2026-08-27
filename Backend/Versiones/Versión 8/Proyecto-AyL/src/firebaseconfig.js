import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlmjblIzALMb8ymzONJI-hd7A7TfXkAl0",
  authDomain: "aylcompresoresypartes-25952.firebaseapp.com",
  projectId: "aylcompresoresypartes-25952",
  storageBucket: "aylcompresoresypartes-25952.firebasestorage.app",
  messagingSenderId: "600235643471",
  appId: "1:600235643471:web:f595127df9f609dbf1d03a",
  measurementId: "G-DHQQSNR72K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);