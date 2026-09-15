import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "hip-temple-9sx2c",
  appId: "1:319616892259:web:3cefc6e46d286c67d8e756",
  apiKey: "AIzaSyCd5cZcFWw732jV65pin5QSJ9-DbN7Jh0g",
  authDomain: "hip-temple-9sx2c.firebaseapp.com",
  storageBucket: "hip-temple-9sx2c.firebasestorage.app",
  messagingSenderId: "319616892259"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-infrashieldai-91203a41-a241-4441-af72-2b20e12620d2");
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
