import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9I1DEjtPZSJHTFMtscSD-U8YCbP7kRsQ",
  authDomain: "inventory-tracker-stockmate.firebaseapp.com",
  projectId: "inventory-tracker-stockmate",
  storageBucket: "inventory-tracker-stockmate.appspot.com",
  messagingSenderId: "281113326232",
  appId: "1:281113326232:web:5233d39a7109871cd616ed",
  measurementId: "G-ZR1X0R7CLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// try to add analytics
const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
const firestore = getFirestore(app);
export { firestore };