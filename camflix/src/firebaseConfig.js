import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCih7xQjf5GJb-neqwH57abl_gsckHPVyM",
  authDomain: "camflix-8d1a4.firebaseapp.com",
  projectId: "camflix-8d1a4",
  storageBucket: "camflix-8d1a4.firebasestorage.app",
  messagingSenderId: "10034898515",
  appId: "1:10034898515:web:dcd2c832b9e06ff7a248a6",
  measurementId: "G-ZE10YE883R"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
