'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return { logout };
};