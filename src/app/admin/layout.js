'use client';
import { getImageUrl } from '@/lib/imagekit';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'products', label: 'Products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'content', label: 'Content', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'coupons', label: 'Coupons', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { id: 'blogs', label: 'Blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { id: 'messages', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'legal', label: 'Legal Pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
];

function SidebarNav({ setIsMobileSidebarOpen }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  return (
    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
      {navItems.map((item) => {
        const isActive = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              router.push(`/admin?tab=${item.id}`);
              if (setIsMobileSidebarOpen) setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold tracking-wide ${
              isActive 
                ? 'bg-white text-[#900606] shadow-[0_4px_20px_rgba(0,0,0,0.15)] transform scale-[1.02]' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#900606]' : 'text-white/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </button>
        )
      })}
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/');
    } else {
      setIsAuthorized(true);
      const name = sessionStorage.getItem('userName') || 'Admin User';
      setAdminName(name);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    router.push('/login');
  };

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#900606] font-bold">Verifying Access...</div>;
  }

  return (
    <div className="flex h-screen bg-[#F4F7FE] dark:bg-[#0B0F19] overflow-hidden transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Brand Maroon */}
      <aside className={`fixed md:relative top-0 left-0 h-full w-64 bg-[#900606] text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shrink-0`}>
        <div className="h-24 flex items-center justify-start border-b border-white/10 px-6 shrink-0 relative">
          <Link href="/" className="relative h-25 w-92 cursor-pointer">
            <Image src={getImageUrl("/logo-kits.png")} 
              alt="Creators Kit Logo" 
              fill 
              className="object-contain brightness-0 invert transition-transform" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          </Link>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden absolute right-4 text-white hover:text-neutral-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <Suspense fallback={<nav className="flex-1"></nav>}>
          <SidebarNav setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
        </Suspense>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/20 hover:bg-black/40 text-white font-bold transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-20 shrink-0 bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 md:px-8 shadow-sm z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="relative hidden md:block w-72 lg:w-96">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search data, orders, products..." 
                className="w-full bg-[#F4F7FE] dark:bg-[#0f172a] border-none rounded-full py-2.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-[#900606]/30 focus:outline-none dark:text-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 ml-auto shrink-0">
            {/* Notification Icon */}
            <button className="relative p-2.5 text-neutral-400 hover:text-[#900606] transition-colors rounded-full hover:bg-[#F4F7FE] dark:hover:bg-neutral-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#900606] rounded-full border border-white dark:border-[#131C2E]"></span>
            </button>
            
            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 hidden sm:block"></div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-extrabold text-neutral-800 dark:text-white group-hover:text-[#900606] transition-colors">{adminName}</span>
                <span className="text-xs font-semibold text-neutral-500">Admin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#900606] text-white flex items-center justify-center font-bold shadow-md ring-2 ring-transparent group-hover:ring-[#900606]/30 transition-all">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="w-full pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}






