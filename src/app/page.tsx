'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const role = decoded.role?.trim().toLowerCase();


        if (role === 'admin') {
          router.replace('/todo/admin');
        } else {
          router.replace('/todo/user');
        }
      } catch (error) {
        console.error('Invalid token', error);
        router.replace('/auth/login');
      }
    };

    redirectUser();
  }, [router]);

  return null;
}
