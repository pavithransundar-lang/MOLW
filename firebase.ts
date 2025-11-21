
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCB9IIkS3DLfF0J9CWyHYtBw0AIWM_v7qY",
  authDomain: "classroomwallet-f0ae2.firebaseapp.com",
  projectId: "classroomwallet-f0ae2",
  storageBucket: "classroomwallet-f0ae2.firebasestorage.app",
  messagingSenderId: "170287908488",
  appId: "1:170287908488:web:97624f88abd595f9ae813d",
  measurementId: "G-PH4CJ157N6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
