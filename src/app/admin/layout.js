'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SidebarNav({ navItems }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  return (
    <nav className="px-4 pb-8 space-y-2">
      {navItems.map((item, index) => {
        const isDashboard = item.path === '/admin';
        const isActive = isDashboard
          ? !currentTab
          : currentTab && item.path.includes(`tab=${currentTab}`);

        return (
          <Link
            key={index}
            href={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group ${
              isActive
                ? 'bg-primary text-neutral-950 shadow-lg shadow-primary/20'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
            }`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-neutral-100">Verifying Access...</div>;
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin'},
    { name: 'Homepage', path: '/admin?tab=content'},
    { name: 'Products & Pricing', path: '/admin?tab=products'},
    { name: 'Orders Management', path: '/admin?tab=orders'},
    { name: 'Coupons & Discounts', path: '/admin?tab=coupons'},
    { name: 'Blog Management', path: '/admin?tab=blogs'},
    { name: 'Legal & Policies', path: '/admin?tab=legal'},
  ];

  return (
    <div className="min-h-screen bg-background text-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 lg:w-72 bg-neutral-950 border-b md:border-r border-neutral-900 shrink-0 sticky top-0 md:h-screen overflow-y-auto z-20 shadow-2xl">
        <div className="p-6 md:p-8 pb-4 flex flex-col items-start gap-1">
          <Link href="/" className="relative block w-[200px] h-[65px] group mb-6">
            <Image
              src="/logo kits.png - Edited.png"
              alt="Creators Kit Logo"
              fill
              className="object-contain object-left transform transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
              priority
            />
          </Link>
        </div>
        
        <Suspense fallback={<nav className="px-4 pb-8 space-y-1"></nav>}>
          <SidebarNav navItems={navItems} />
        </Suspense>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none z-0"></div>
        <div className="relative z-10 p-6 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
