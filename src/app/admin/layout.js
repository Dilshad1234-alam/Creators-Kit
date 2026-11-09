'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { 
        id: 'overview', 
        label: 'Overview', 
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="7" height="18" rx="1.5" />
            <rect x="14" y="3" width="7" height="18" rx="1.5" />
          </svg>
        )
      },
      { 
        id: 'orders', 
        label: 'Orders', 
        badgeKey: 'orders',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 8h10M7 12h10M7 16h6" />
          </svg>
        )
      },
      { 
        id: 'sale', 
        label: 'Live Sale & Offers', 
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        )
      },
      { 
        id: 'products', 
        label: 'Products', 
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        )
      },
      { 
        id: 'customers', 
        label: 'Customers', 
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        )
      },
      { 
        id: 'courses', 
        label: 'Courses', 
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'Content & Engagement',
    items: [
      {
        id: 'blogs',
        label: 'Blogs',
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        )
      },
      {
        id: 'contacts',
        label: 'Contacts',
        badgeKey: 'contacts',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      },
      {
        id: 'home',
        label: 'Home',
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )
      },
      {
        id: 'about',
        label: 'About Us',
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        id: 'contact-page',
        label: 'Contact Page',
        badgeKey: null,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      }
    ]
  }
];

// Flatten for breadcrumb and active lookup
const allNavItems = navGroups.flatMap(g => g.items);

function SidebarNav({ setIsMobileSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathTab = pathname?.startsWith('/admin/') ? pathname.replace('/admin/', '').split('/')[0] : '';
  const currentTab = searchParams.get('tab') || pathTab || 'overview';
  const normalizedTab = currentTab === 'dashboard' ? 'overview' : currentTab;

  const [liveCounts, setLiveCounts] = useState({ orders: 0, messages: 0 });

  useEffect(() => {
    // Fetch live badges
    const fetchBadgeCounts = async () => {
      try {
        const [ordersRes, contactRes] = await Promise.allSettled([
          fetch('/api/orders'),
          fetch('/api/contact')
        ]);
        let ordersCount = 0;
        let messagesCount = 0;

        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const ordersData = await ordersRes.value.json();
          if (ordersData.success && Array.isArray(ordersData.data)) {
            ordersCount = ordersData.data.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
          }
        }
        if (contactRes.status === 'fulfilled' && contactRes.value.ok) {
          const contactData = await contactRes.value.json();
          if (contactData.success && Array.isArray(contactData.data)) {
            messagesCount = contactData.data.length;
          }
        }
        setLiveCounts({ orders: ordersCount, messages: messagesCount, contacts: messagesCount });
      } catch {
        // silent fallback
      }
    };

    fetchBadgeCounts();
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-start overflow-y-auto px-4 py-4 space-y-6">
      
      {/* Workspace Navigation Groups */}
      <div className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase px-3 mb-2.5">
              {group.title}
            </p>

            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  normalizedTab === item.id ||
                  (item.id === 'products' && normalizedTab === 'bundles') ||
                  (item.id === 'home' && (normalizedTab === 'homepagefeatures' || normalizedTab === 'features')) ||
                  (item.id === 'contacts' && (normalizedTab === 'messages' || normalizedTab === 'contact'));
                const badgeValue = item.badgeKey ? liveCounts[item.badgeKey] : null;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(`/admin?tab=${item.id}`);
                      if (setIsMobileSidebarOpen) setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-red-50/90 text-[#900606] border border-red-100 shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`transition-colors ${isActive ? 'text-[#900606]' : 'text-neutral-400'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {Boolean(badgeValue && badgeValue > 0) && (
                      <span className="bg-[#900606] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                        {badgeValue}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Area: Utility Links */}
      <div className="pt-4 border-t border-neutral-100">
        {/* Secondary Links: Settings & Public Store */}
        <div className="space-y-1">
          <button
            onClick={() => {
              router.push('/admin?tab=settings');
              if (setIsMobileSidebarOpen) setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
              normalizedTab === 'settings'
                ? 'bg-red-50 text-[#900606] border border-red-100'
                : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
            }`}
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900 transition-colors"
            title="Open Public Store in a new tab"
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Public Store</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium bg-neutral-100 px-1.5 py-0.5 rounded">View ↗</span>
          </a>
        </div>

      </div>

    </div>
  );
}

function AdminLayoutInner({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathTab = pathname?.startsWith('/admin/') ? pathname.replace('/admin/', '').split('/')[0] : '';
  const currentTab = searchParams.get('tab') || pathTab || 'overview';
  const normalizedTab = currentTab === 'dashboard' ? 'overview' : currentTab;

  const [isMounted, setIsMounted] = useState(false);
  const [adminName, setAdminName] = useState('Md Dilshad');
  const [adminEmail, setAdminEmail] = useState('dmd68699@gmail.com');
  const [adminRole, setAdminRole] = useState('Administrator');
  const [adminImage, setAdminImage] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const getCookie = (name) => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const adminRole =
      sessionStorage.getItem('adminRole') ||
      localStorage.getItem('adminRole') ||
      getCookie('admin_role') ||
      sessionStorage.getItem('userRole') ||
      localStorage.getItem('userRole') ||
      getCookie('user_role');

    const adminEmail =
      sessionStorage.getItem('adminEmail') ||
      localStorage.getItem('adminEmail') ||
      getCookie('admin_email') ||
      sessionStorage.getItem('userEmail') ||
      localStorage.getItem('userEmail') ||
      getCookie('user_email');

    const adminName =
      sessionStorage.getItem('adminName') ||
      localStorage.getItem('adminName') ||
      getCookie('admin_name') ||
      sessionStorage.getItem('userName') ||
      localStorage.getItem('userName') ||
      getCookie('user_name');

    // Restrict non-admin users from accessing admin workspace
    if (adminRole !== 'admin') {
      router.push('/login?redirect=/admin');
      return;
    }

    if (adminName) {
      setAdminName(adminName);
    }
    if (adminEmail) {
      setAdminEmail(adminEmail);
    }

    // Fetch verified admin profile directly from MongoDB
    const query = adminEmail ? `?email=${encodeURIComponent(adminEmail)}` : '';
    fetch(`/api/admin/profile${query}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          const admin = result.data;
          setAdminName(admin.name);
          setAdminEmail(admin.email);
          setAdminRole(admin.role === 'admin' ? 'Administrator' : admin.role);
          if (admin.profileImage) {
            setAdminImage(admin.profileImage);
          }
          // Dedicated admin storage (does not override customer storefront session)
          sessionStorage.setItem('adminName', admin.name);
          sessionStorage.setItem('adminEmail', admin.email);
          sessionStorage.setItem('adminRole', 'admin');
          sessionStorage.setItem('adminToken', 'admin_active');
          localStorage.setItem('adminName', admin.name);
          localStorage.setItem('adminEmail', admin.email);
          localStorage.setItem('adminRole', 'admin');
          localStorage.setItem('adminToken', 'admin_active');

          document.cookie = `admin_role=admin; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `admin_email=${encodeURIComponent(admin.email)}; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `admin_name=${encodeURIComponent(admin.name)}; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `admin_token=admin_active; path=/; max-age=2592000; SameSite=Lax`;
          document.cookie = `user_role=admin; path=/; max-age=2592000; SameSite=Lax`;
        }
      })
      .catch((err) => {
        console.error('Failed to load admin profile from MongoDB:', err);
      });
  }, [router]);

  const handleLogout = async () => {
    // Clear dedicated admin storage
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminRole');
    sessionStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminToken');

    if (localStorage.getItem('userRole') === 'admin') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }
    if (sessionStorage.getItem('userRole') === 'admin') {
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userEmail');
    }

    document.cookie = 'admin_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'admin_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'admin_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    router.push('/login?redirect=/admin');
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'AD';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'AD';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isInvalidTab = ['whats-inside', 'whatsinside', 'notifications'].includes(normalizedTab);

  useEffect(() => {
    if (isInvalidTab) {
      router.replace('/admin?tab=overview');
    }
  }, [isInvalidTab, router]);

  const activeItem =
    allNavItems.find((t) => t.id === normalizedTab) ||
    (normalizedTab === 'bundles' ? allNavItems.find((t) => t.id === 'products') : null) ||
    (normalizedTab === 'messages' || normalizedTab === 'contact' ? allNavItems.find((t) => t.id === 'contacts') : null);
  const breadcrumbCurrent = isInvalidTab
    ? 'Overview'
    : activeItem
    ? activeItem.label
    : ['settings', 'legal', 'content'].includes(normalizedTab)
    ? (normalizedTab.charAt(0).toUpperCase() + normalizedTab.slice(1))
    : 'Overview';

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#111827] font-sans overflow-hidden">
      
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR: Clean Light Theme with CreatorsKit Branding */}
      <aside 
        className={`fixed md:relative top-0 left-0 h-full w-64 bg-white border-r border-neutral-200/80 flex flex-col z-50 transform transition-transform duration-300 shrink-0 ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Logo Badge */}
        <div className="h-20 flex items-center px-6 border-b border-neutral-100 justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            {/* Red Triangle Brand Emblem */}
            <div className="w-8 h-8 rounded-lg bg-[#900606] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#111827] leading-none">
                Creators<span className="text-[#900606]">Kit</span>
              </span>
              <span className="text-[8px] font-extrabold tracking-[0.18em] text-neutral-400 uppercase mt-1">
                Gear That Creates Possibilities
              </span>
            </div>
          </Link>

          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden text-neutral-400 hover:text-neutral-700 p-1"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation */}
        <Suspense fallback={<div className="flex-1 p-4 text-xs text-neutral-400">Loading navigation...</div>}>
          <SidebarNav setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
        </Suspense>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header & Breadcrumbs Bar */}
        <header className="h-16 shrink-0 bg-white border-b border-neutral-200/80 px-4 sm:px-8 flex items-center justify-between z-30">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-neutral-400">Workspace</span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-800 font-bold">{breadcrumbCurrent}</span>
            </div>
          </div>

          {/* Right: Administrator Profile & Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2.5">
              {/* Initials Avatar or Profile Image */}
              {isMounted && adminImage ? (
                <img
                  src={adminImage}
                  alt={adminName || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-200 shadow-2xs"
                />
              ) : (
                <div
                  suppressHydrationWarning
                  className="w-8 h-8 rounded-full bg-[#FEE2E2] text-[#900606] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                >
                  {getInitials(adminName)}
                </div>
              )}

              <div className="flex flex-col text-left hidden sm:flex">
                <span suppressHydrationWarning className="text-xs font-bold text-neutral-900 leading-tight">
                  {adminName || 'Md Dilshad'}
                </span>
                <span suppressHydrationWarning className="text-[10px] text-neutral-400 font-medium">
                  {adminRole || 'Administrator'}
                </span>
              </div>
            </div>

            {/* Admin Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:text-[#900606] hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
              title="Logout from Admin Workspace"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>

        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-[1700px] mx-auto pb-12">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full bg-[#F8FAFC] items-center justify-center font-bold text-xs text-[#900606]">
        Loading workspace...
      </div>
    }>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
