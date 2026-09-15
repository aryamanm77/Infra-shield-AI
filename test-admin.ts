import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ credential: applicationDefault() });
const db = getFirestore();
db.collection('test').doc('test').set({ ok: true }).then(() => console.log('success')).catch(console.error);
