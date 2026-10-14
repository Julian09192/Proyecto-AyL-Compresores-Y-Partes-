import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0oEmPTDaCa5S-lMhSl6YyURKw-LtEpQs",
  authDomain: "aylcompresores-a3b16.firebaseapp.com",
  projectId: "aylcompresores-a3b16",
  storageBucket: "aylcompresores-a3b16.firebasestorage.app",
  messagingSenderId: "795942466382",
  appId: "1:795942466382:web:b58ea4b6a22b9f6f12a41f",
  measurementId: "G-NPL8VE1MCR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);