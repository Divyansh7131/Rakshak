// firebaseconfigyl.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// ✅ Import compat for expo-firebase-recaptcha (important for web)
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMkxt9je_GdoEQoShOqGrVDpAp9E_NiQg",
  authDomain: "rakshak-1d880.firebaseapp.com",
  projectId: "rakshak-1d880",
  storageBucket: "rakshak-1d880.appspot.com",
  messagingSenderId: "610386603851",
  appId: "1:610386603851:android:8d2d57b5054b56cc5d02ce",
};

// ✅ Modular app initialization (for modern Firebase APIs)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ✅ Compat app initialization (needed by expo-firebase-recaptcha on web)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { app, auth, firebase };
