import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export async function seedDatabaseIfNeeded(force = false) {
  const projectsRef = collection(db, 'projects');
  const snapshot = await getDocs(projectsRef);
  
  if (!snapshot.empty && !force) {
    console.log('Database already seeded.');
    return false; // Already seeded
  }

  console.log('Seeding database with initial data...');
  
  // We can dynamically fetch from the API to seed
  const [projRes, alertsRes, kpisRes, dsRes] = await Promise.all([
    fetch('/api/projects'),
    fetch('/api/alerts'),
    fetch('/api/kpis'),
    fetch('/api/data-sources')
  ]);

  const projects = await projRes.json();
  const alerts = await alertsRes.json();
  const kpis = await kpisRes.json();
  const dataSources = await dsRes.json();

  const batch = writeBatch(db);

  projects.forEach((p: any) => {
    const ref = doc(db, 'projects', p.project_id || p.id);
    if (p.route_coordinates) {
      p.route_coordinates = JSON.stringify(p.route_coordinates);
    }
    batch.set(ref, p);
  });

  alerts.forEach((a: any) => {
    const ref = doc(db, 'alerts', a.alert_id || a.id);
    batch.set(ref, a);
  });

  dataSources.forEach((ds: any) => {
    const ref = doc(db, 'dataSources', ds.source_id || ds.id);
    batch.set(ref, ds);
  });

  // KPI is a single object
  const kpiRef = doc(db, 'system', 'kpis');
  batch.set(kpiRef, kpis);

  await batch.commit();
  console.log('Database seeded successfully.');
  return true;
}
