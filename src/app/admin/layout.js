'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    return <div className="min-h-screen bg-[#0B0D0E] flex items-center justify-center text-white">Verifying Access...</div>;
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: '📊' },
    { name: 'Products & Pricing', path: '/admin?tab=products', icon: '🛍️' },
    { name: 'Orders Management', path: '/admin?tab=orders', icon: '📦' },
    { name: 'Coupons & Discounts', path: '/admin?tab=coupons', icon: '🏷️' },
    { name: 'Homepage Content', path: '/admin?tab=content', icon: '📝' },
    { name: 'FAQ & Support', path: '/admin?tab=faq', icon: '❓' },
    { name: 'Legal & Policies', path: '/admin?tab=legal', icon: '⚖️' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 lg:w-72 bg-zinc-950 border-b md:border-r border-zinc-900 shrink-0 sticky top-0 md:h-screen overflow-y-auto z-20 shadow-2xl">
        <div className="p-6 md:p-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF3B14] to-[#FF6B4A] flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(252,29,0,0.4)] group-hover:shadow-[0_0_25px_rgba(252,29,0,0.6)] transition-all">
              Z
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="px-4 pb-8 space-y-1">
          {navItems.map((item, index) => {
            // Simplified active state handling for URL params
            return (
              <Link
                key={index}
                href={item.path}
                className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FF3B14]/5 via-[#0B0D0E] to-[#0B0D0E] pointer-events-none z-0"></div>
        <div className="relative z-10 p-6 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
