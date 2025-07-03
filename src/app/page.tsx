'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  iat: number;
}

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const role = decoded.role?.trim().toLowerCase();


        if (role === 'admin') {
          router.replace('/admin-page');
        } else {
          router.replace('/todo');
        }
      } catch (error) {
        console.error('Invalid token', error);
        router.replace('/login');
      }
    };

    // Jalankan redirect setelah render pertama
    redirectUser();
  }, [router]);

  return null;
}
