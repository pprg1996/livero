import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkznvRFE3D4oq41Yeos82CeINR9W60Ptg",
  authDomain: "livero-337cb.firebaseapp.com",
  projectId: "livero-337cb",
  storageBucket: "livero-337cb.appspot.com",
  messagingSenderId: "12328114091",
  appId: "1:12328114091:web:2f08b01fa9520c02fa64ee",
  measurementId: "G-BMY942BXHX",
  databaseUrl: "https://livero-337cb-default-rtdb.firebaseio.com/",
};

if (typeof window !== "undefined") firebase.initializeApp(firebaseConfig);

export {};
