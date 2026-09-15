import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserRole } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('Officer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch or create user role in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setRole(userSnap.data().role as UserRole);
        } else {
          // Default role
          await setDoc(userRef, {
            email: firebaseUser.email,
            role: 'Officer',
            createdAt: new Date().toISOString()
          });
          setRole('Officer');
        }
      } else {
        setUser(null);
        setRole('Viewer');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateRole = async (newRole: UserRole) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { role: newRole }, { merge: true });
    setRole(newRole);
  };

  return { user, role, loading, updateRole };
}
