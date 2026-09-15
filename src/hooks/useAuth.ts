import { useState } from 'react';
import { UserRole } from '../types';

export function useAuth() {
  const [role, setRole] = useState<UserRole>('Officer');

  const updateRole = async (newRole: UserRole) => {
    setRole(newRole);
  };

  return { user: { uid: 'mock-user', email: 'user@example.com' }, role, loading: false, updateRole };
}
