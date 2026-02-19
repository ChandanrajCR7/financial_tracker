import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB9-rp0QGTb9HbY-mVol0bcR2IvPN6Y75s",
  authDomain: "financial-27a41.firebaseapp.com",
  databaseURL: "https://financial-27a41-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "financial-27a41",
  storageBucket: "financial-27a41.firebasestorage.app",
  messagingSenderId: "569128839512",
  appId: "1:569128839512:web:007fe6d562336aa27c5d2d",
  measurementId: "G-S0NNHX5CYY",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
