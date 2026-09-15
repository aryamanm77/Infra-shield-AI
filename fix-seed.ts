import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

async function fix() {
  const [projRes, alertsRes, dsRes, kpisRes] = await Promise.all([
    fetch('http://localhost:3000/api/projects'),
    fetch('http://localhost:3000/api/alerts'),
    fetch('http://localhost:3000/api/data-sources'),
    fetch('http://localhost:3000/api/kpis')
  ]);
  const projects = await projRes.json();
  const alerts = await alertsRes.json();
  const ds = await dsRes.json();
  const kpis = await kpisRes.json();

  const batch = db.batch();
  for (const p of projects) {
    if (p.route_coordinates) {
      p.route_coordinates = JSON.stringify(p.route_coordinates);
    }
    batch.set(db.collection('projects').doc(p.project_id || p.id), p);
  }
  for (const a of alerts) {
    batch.set(db.collection('alerts').doc(a.id), a);
  }
  for (const d of ds) {
    batch.set(db.collection('dataSources').doc(d.source_id || d.id), d);
  }
  batch.set(db.collection('system').doc('kpis'), kpis);

  await batch.commit();
  console.log('Fixed seed done.');
}
fix().catch(console.error);
