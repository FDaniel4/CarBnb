// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzLlqO61Az9K1Bq1_Ebv5K46DgQOihVAU",
  authDomain: "carbnb-eadd7.firebaseapp.com",
  projectId: "carbnb-eadd7",
  storageBucket: "carbnb-eadd7.firebasestorage.app",
  messagingSenderId: "447372298178",
  appId: "1:447372298178:web:cc092ef855a41b6386385b",
  measurementId: "G-BZPZHQLGGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { storage };