// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// 1. IMPORTAR ESTOS MÓDULOS NUEVOS PARA PERSISTENCIA
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// @ts-ignore: Ignora el error de tipo, getReactNativePersistence existe en el entorno RN aunque TS se queje.
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// 2. INICIALIZAR AUTH CON PERSISTENCIA
// Esto le dice a Firebase: "Usa el almacenamiento nativo del celular para guardar la sesión"
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export const db = getFirestore(app);
export { storage };