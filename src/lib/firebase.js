import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA_DClQ0lVOq9zBCkepCitqxDv6BG5OqeQ",
  authDomain: "chenggongstreet-senpai.firebaseapp.com",
  projectId: "chenggongstreet-senpai",
  storageBucket: "chenggongstreet-senpai.firebasestorage.app",
  messagingSenderId: "16277466540",
  appId: "1:16277466540:web:de1735af8f0dafa2bc1e09"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
