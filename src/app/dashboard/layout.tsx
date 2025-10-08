'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex w-screen flex-1 flex-col">
        <Header />
        <main className="w-screen flex-1 overflow-y-auto bg-gray-100 py-6">
          {children}
        </main>
        <div className="h-15 w-screen bg-white">
          <Footer />
        </div>
      </div>
    </div>
  );
}
