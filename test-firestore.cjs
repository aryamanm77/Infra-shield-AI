const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "hip-temple-9sx2c",
  appId: "1:319616892259:web:3cefc6e46d286c67d8e756",
  apiKey: "AIzaSyCd5cZcFWw732jV65pin5QSJ9-DbN7Jh0g",
  authDomain: "hip-temple-9sx2c.firebaseapp.com",
  storageBucket: "hip-temple-9sx2c.firebasestorage.app",
  messagingSenderId: "319616892259"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-infrashieldai-91203a41-a241-4441-af72-2b20e12620d2");

async function run() {
  try {
    const projectsRef = collection(db, 'projects');
    const snap = await getDocs(projectsRef);
    console.log("Success! Docs count:", snap.size);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
