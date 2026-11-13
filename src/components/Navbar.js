'use client';
import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuthModal } from '@/context/AuthModalContext';
import { useSession, signOut } from 'next-auth/react';
import { Search, User } from 'lucide-react';

const Menu = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const X = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GuestUserLightningIcon = ({ className = "w-5 h-5 xl:w-6 xl:h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Person Head */}
    <circle
      cx="10"
      cy="6.8"
      r="3.5"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Person Body Left */}
    <path
      d="M3.5 20.5v-1.5a4.8 4.8 0 0 1 4.8-4.8h3"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Person Body Right */}
    <path
      d="M18.5 20.5v-1a4.8 4.8 0 0 0-1-2.8"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Lightning Bolt */}
    <polygon
      points="15.2 4.2 10.8 12.2 14.5 12.2 12.5 19.8 19 10.5 14.8 10.5 16.2 4.2"
      fill="#F59E0B"
      stroke="#EA580C"
      strokeWidth="0.6"
      strokeLinejoin="round"
    />
  </svg>
);

const getTickerContent = (pathname, customTicker) => {
  if (!pathname) return null;

  // 1. Live Sale / Flash Offers
  if (pathname === '/live-sale') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8 8a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-8-8zM7 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
        </svg>
      ),
      badge: 'Creator Sale',
      text: customTicker || 'Special prices on your next setup',
      href: '/live-sale',
    };
  }

  // 2. Contact & Customer Support
  if (pathname === '/contact') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 0 0-10 10v6a3 3 0 0 0 3 3h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5.07A8 8 0 0 1 12 4a8 8 0 0 1 6.93 8H17a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2a3 3 0 0 0 3-3v-6a10 10 0 0 0-10-10z" />
        </svg>
      ),
      badge: 'Creator Support',
      text: 'Need help choosing gear? Our creator team replies within 24 hours',
      href: '/contact',
    };
  }

  // 3. Single Product Details
  if (pathname.startsWith('/product/') && pathname !== '/product') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      ),
      badge: 'Certified Equipment',
      text: '1-Year Official Warranty • Easy 7-Day Doorstep Replacement',
      href: '/product',
    };
  }

  // 4. Products Catalog / Store
  if (pathname === '/product') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="#900606" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      badge: 'Studio Gear Store',
      text: 'Explore 100% genuine creator equipment with 1-Year Warranty',
      href: '/product',
    };
  }

  // 5. Creator Bundles
  if (pathname.startsWith('/bundle')) {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7m16 0H4m16 0-3-7H7L4 12m12-5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="#900606" strokeWidth="1.8" fill="none" />
        </svg>
      ),
      badge: 'All-in-One Bundle',
      text: 'Save up to 60% + 3 Free Lifetime Masterclasses (Worth ₹4,999) Included',
      href: '/product',
    };
  }

  // 6. Cart
  if (pathname === '/cart') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" fill="none" stroke="#900606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      badge: 'Secure Shopping',
      text: 'Fast Dispatch Across India • Free Masterclass Access on Orders',
      href: '/cart',
    };
  }

  // 7. Checkout
  if (pathname === '/checkout') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#900606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      badge: '100% Safe Checkout',
      text: 'Encrypted Payments • UPI, Net Banking, Cards & COD Available',
      href: '/checkout',
    };
  }

  // 8. Blogs & Creator Academy
  if (pathname.startsWith('/blog')) {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" fill="none" stroke="#900606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      badge: 'Creator Academy',
      text: 'Free guides, setup tips & masterclasses to grow your content channel',
      href: '/blog',
    };
  }

  // 9. About Us
  if (pathname === '/about') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#900606" />
        </svg>
      ),
      badge: 'Built for Creators',
      text: 'Empowering 50,000+ modern creators across India with professional gear',
      href: '/about',
    };
  }

  // 10. FAQs
  if (pathname === '/faq') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#900606" strokeWidth="2" fill="none" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01" stroke="#900606" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      badge: 'Help & FAQs',
      text: 'Instant answers on shipping, 1-year warranty & easy returns',
      href: '/faq',
    };
  }

  // 11. Track Order
  if (pathname === '/track') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <rect x="1" y="3" width="15" height="13" stroke="#900606" strokeWidth="2" fill="none" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="#900606" strokeWidth="2" fill="none" />
          <circle cx="5.5" cy="18.5" r="2.5" fill="#900606" />
          <circle cx="18.5" cy="18.5" r="2.5" fill="#900606" />
        </svg>
      ),
      badge: 'Live Tracking',
      text: 'Track your studio equipment shipment in real-time across India',
      href: '/track',
    };
  }

  // 12. Policies & Legal
  if (pathname === '/return-policy' || pathname === '/terms' || pathname === '/privacy') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="#900606" strokeWidth="2" />
        </svg>
      ),
      badge: 'Buyer Protection',
      text: '100% Authentic gear guarantee • Hassle-free 7-day replacement',
      href: '/return-policy',
    };
  }

  // 13. Dashboard & Account
  if (pathname === '/account' || pathname === '/dashboard') {
    return {
      icon: (
        <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#900606" strokeWidth="2" fill="none" />
          <circle cx="12" cy="7" r="4" stroke="#900606" strokeWidth="2" fill="none" />
        </svg>
      ),
      badge: 'Creator Account',
      text: 'Manage your orders, warranties & bonus masterclass credentials',
      href: '/account',
    };
  }

  // Default: Homepage ('/') & fallback
  return {
    icon: (
      <svg className="w-3.5 h-3.5 fill-[#900606]" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    badge: 'Creator Hub',
    text: 'All-in-One Studio Equipment, Lighting & Free Masterclasses Included',
    href: '/live-sale',
  };
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { cartCount, clearCart } = useCart();
  const { openAuthModal } = useAuthModal();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Search Bar States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [liveSaleTicker, setLiveSaleTicker] = useState(null);
  const searchRef = useRef(null);

  // Load live sale dynamic ticker if on live sale page
  useEffect(() => {
    async function fetchLiveTicker() {
      try {
        const res = await fetch('/api/admin/live-sale');
        if (res.ok) {
          const data = await res.json();
          if (data && data.tickerText) {
            setLiveSaleTicker(data.tickerText);
          }
        }
      } catch (e) {}
    }
    fetchLiveTicker();
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced product search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (err) {
        console.error('Navbar search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setShowSearchDropdown(false);
    setIsMobileSearchOpen(false);
    router.push(`/product?search=${encodeURIComponent(q)}`);
  };

  const handleSelectProduct = (item) => {
    setShowSearchDropdown(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
    router.push(`/product/${item._id || item.id}`);
  };

  useEffect(() => {
    // Navbar is completely hidden and inactive on /admin routes.
    // Never run auth redirects when already in /admin to avoid reload loops.
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const updateAuth = () => {
      // If user has explicitly logged out, ensure state remains strictly unauthenticated
      if (
        typeof window !== 'undefined' &&
        (sessionStorage.getItem('creatorskit_logged_out') === '1' ||
          localStorage.getItem('creatorskit_logged_out') === '1')
      ) {
        setUserName(null);
        setUserRole(null);
        return;
      }

      // Check for user account info in creatorsKitUserInfo
      const userInfoStr = sessionStorage.getItem('creatorsKitUserInfo') || localStorage.getItem('creatorsKitUserInfo');
      let customerName = null;
      let role = 'user';

      if (userInfoStr) {
        try {
          const parsed = JSON.parse(userInfoStr);
          if (parsed && parsed.name) {
            customerName = parsed.name;
            if (parsed.role) role = parsed.role;
          }
        } catch (e) {}
      }

      // Fallback to storage/session
      if (!customerName) {
        customerName =
          sessionStorage.getItem('userName') ||
          localStorage.getItem('userName') ||
          session?.user?.name;
        const storedRole =
          sessionStorage.getItem('userRole') ||
          localStorage.getItem('userRole') ||
          session?.user?.role;
        if (storedRole) role = storedRole;
      }

      // Synchronize Google OAuth session into client storage and cookies (only if not explicitly logged out)
      const isLoggedOut =
        typeof window !== 'undefined' &&
        (sessionStorage.getItem('creatorskit_logged_out') === '1' ||
          localStorage.getItem('creatorskit_logged_out') === '1');

      if (session?.user?.email && !isLoggedOut) {
        const googleEmail = session.user.email.toLowerCase().trim();
        const googleName = session.user.name || googleEmail.split('@')[0];
        const googleRole = session.user.role || 'user';
        customerName = googleName;
        role = googleRole;

        try {
          if (!sessionStorage.getItem('userEmail')) {
            const googleUserInfo = {
              name: googleName,
              email: googleEmail,
              role: googleRole,
              image: session.user.image || '',
            };
            sessionStorage.setItem('userName', googleName);
            sessionStorage.setItem('userEmail', googleEmail);
            sessionStorage.setItem('userRole', googleRole);
            sessionStorage.setItem('token', 'session_active');
            sessionStorage.setItem('creatorsKitUserInfo', JSON.stringify(googleUserInfo));

            localStorage.setItem('userName', googleName);
            localStorage.setItem('userEmail', googleEmail);
            localStorage.setItem('userRole', googleRole);
            localStorage.setItem('creatorsKitUserInfo', JSON.stringify(googleUserInfo));

            document.cookie = `user_role=${googleRole}; path=/; SameSite=Lax`;
            document.cookie = `user_email=${encodeURIComponent(googleEmail)}; path=/; SameSite=Lax`;
            document.cookie = `user_name=${encodeURIComponent(googleName)}; path=/; SameSite=Lax`;
            document.cookie = 'auth_token=session_active; path=/; SameSite=Lax';

            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: googleUserInfo }));
          }
        } catch (e) {}
      }

      if (customerName) {
        setUserName(customerName);
        setUserRole(role);
      } else {
        setUserName(null);
        setUserRole(null);
      }
    };

    updateAuth();
    setIsMounted(true);

    window.addEventListener('storage', updateAuth);
    window.addEventListener('creatorskit-auth-change', updateAuth);

    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('creatorskit-auth-change', updateAuth);
    };
  }, [session, pathname, router]);

  const handleLogout = async () => {
    let activeEmail =
      sessionStorage.getItem('userEmail') ||
      localStorage.getItem('userEmail') ||
      session?.user?.email ||
      '';

    if (!activeEmail) {
      try {
        const u = JSON.parse(sessionStorage.getItem('creatorsKitUserInfo') || localStorage.getItem('creatorsKitUserInfo') || '{}');
        if (u.email) activeEmail = u.email;
      } catch (e) {}
    }

    // 1. Immediately mark logged-out flag to prevent state resurrection across tabs & reload
    try {
      sessionStorage.setItem('creatorskit_logged_out', '1');
      localStorage.setItem('creatorskit_logged_out', '1');
    } catch (e) {}

    // 2. Immediately wipe UI state
    setUserName(null);
    setUserRole(null);

    // 3. Clear all storage
    try {
      ['creatorsKitUserInfo', 'userName', 'userEmail', 'userRole', 'token', 'adminToken', 'admin_role'].forEach((k) => {
        sessionStorage.removeItem(k);
        localStorage.removeItem(k);
      });
    } catch (e) {}

    // 4. Clear all cookies
    try {
      const cookieNames = [
        'user_role', 'user_email', 'user_name', 'auth_token',
        'admin_role', 'admin_email', 'admin_name', 'admin_token',
        'next-auth.session-token', '__Secure-next-auth.session-token',
        'next-auth.callback-url', 'next-auth.csrf-token', '__Host-next-auth.csrf-token'
      ];
      cookieNames.forEach((c) => {
        document.cookie = `${c}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });
    } catch (e) {}

    // 5. Clear cart
    if (typeof clearCart === 'function') {
      try { clearCart(); } catch (e) {}
    }

    // 6. Notify all listeners
    try {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('creatorskit-auth-change', { detail: null }));
    } catch (e) {}

    // 7. Delete user from MongoDB Compass 'users' collection & clear server cookies
    if (activeEmail) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: activeEmail }),
        });
      } catch (err) {
        console.warn('Logout API request error:', err);
      }
    }

    // 8. Complete NextAuth sign out
    try {
      await signOut({ redirect: false });
    } catch (e) {}

    // 9. Hard navigation/reload to home page so UI state is guaranteed clean on first click
    window.location.href = '/';
    if (window.location.pathname === '/') {
      window.location.reload();
    }
  };

  if (pathname === '/login' || pathname === '/register' || pathname === '/verify-otp' || pathname === '/forgot-password' || pathname.startsWith('/admin')) return null;

  // Updated navigation links matching homepage content, About, Contact, and Live Sale
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/product' },
    { name: 'Live Sale', href: '/live-sale', isLive: true },
    // { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (e, href) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ticker = getTickerContent(pathname, liveSaleTicker);

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 transition-colors duration-300 shadow-sm">
      {/* Top Dynamic Page Ticker */}
      {ticker && (
        <Link
          href={ticker.href || '#'}
          className="w-full bg-[#FAF9F5] border-b border-neutral-200/90 text-[#111827] text-[11px] sm:text-xs md:text-sm font-medium py-1.5 px-4 text-center tracking-normal flex items-center justify-center gap-2 select-none hover:bg-[#f5f3ec] transition-colors group block"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[#900606] font-extrabold flex items-center gap-1 shrink-0 group-hover:scale-105 transition-transform">
              {ticker.icon}
              <span>{ticker.badge}</span>
            </span>
            <span className="text-neutral-700 font-medium truncate max-w-[280px] xs:max-w-sm sm:max-w-none">
              • {ticker.text}
            </span>
          </span>
        </Link>
      )}
      <div className="w-full bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="w-full h-16 sm:h-20 px-4 md:px-6 flex items-center justify-between transition-colors duration-300">
          
          {/* Brand Logo */}
          <div className="flex-1 flex items-center justify-start h-full min-w-0">
            <Link href="/" className="relative flex items-center">
              <div className="relative h-12 w-[160px] sm:h-[70px] sm:w-[230px] xl:h-[109px] xl:w-[340px] overflow-hidden ml-1 md:ml-0">
                <Image
                  src={getImageUrl("/logo-kits.png")}
                  alt="Creators Kit Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 260px, 340px"
                  className="object-contain object-left scale-[1.15] md:scale-100 transform transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!pathname.startsWith('/admin') && (
            <nav className="flex-none hidden lg:flex items-center justify-center gap-3 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3 xl:px-5 py-2 text-xs xl:text-sm font-bold transition-all duration-300 rounded-full whitespace-nowrap flex items-center gap-1.5 ${
                    pathname === link.href 
                      ? 'bg-[#900606] text-white shadow-md' 
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-[#900606] dark:hover:text-[#900606] hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="flex-1 hidden lg:flex items-center justify-end gap-2.5 xl:gap-4 h-full pr-2 xl:pr-6">
            
            {/* Search Bar & Live Dropdown */}
            {!pathname.startsWith('/admin') && (
              <div className="relative mr-1" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex items-center bg-neutral-100/90 hover:bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-3.5 py-1.5 focus-within:border-[#900606] focus-within:ring-2 focus-within:ring-[#900606]/15 transition-all duration-200 w-44 xl:w-60">
                    <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchDropdown(true);
                      }}
                      onFocus={() => {
                        if (searchQuery.trim()) setShowSearchDropdown(true);
                      }}
                      placeholder="Search products..."
                      className="w-full bg-transparent text-xs xl:text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none pl-2 pr-1"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowSearchDropdown(false);
                        }}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Live Search Results Dropdown */}
                {showSearchDropdown && searchQuery.trim() && (
                  <div className="absolute right-0 top-full mt-2 w-72 xl:w-80 bg-white dark:bg-[#131C2E] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-[#900606] rounded-full animate-spin" />
                        Searching products...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="p-2 flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[360px] overflow-y-auto">
                        {searchResults.map((item) => (
                          <button
                            key={item._id || item.id}
                            type="button"
                            onClick={() => handleSelectProduct(item)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors text-left w-full cursor-pointer group"
                          >
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80">
                              {item.image || item.images?.[0] ? (
                                <Image
                                  src={getImageUrl(item.image || item.images?.[0])}
                                  alt={item.name}
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-neutral-400">
                                  CK
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-neutral-900 dark:text-white truncate group-hover:text-[#900606] transition-colors">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-black text-[#900606]">
                                  ₹{Number(item.price || 0).toLocaleString('en-IN')}
                                </span>
                                {item.category && (
                                  <span className="text-[10px] text-neutral-400 truncate">
                                    • {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="p-2 text-center text-xs font-bold text-[#900606] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors w-full cursor-pointer mt-1"
                        >
                          View all results for &ldquo;{searchQuery}&rdquo; →
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 text-center text-xs text-neutral-500">
                        No products found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Person Icon / User Profile Dropdown */}
            {!isMounted ? (
              <div className="w-9 h-9 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-neutral-200 border-t-[#900606] animate-spin"></div>
              </div>
            ) : userName ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center justify-center p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-all"
                  title={`My Account (${userName})`}
                  aria-label="My Account"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-neutral-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl("/profile.svg")} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </Link>

                <div className="absolute -right-2 md:-right-4 top-full mt-2 w-56 bg-white dark:bg-[#131C2E] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                  <div className="p-2 flex flex-col gap-1">
                    <Link href="/account?tab=user" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      User ({userName})
                    </Link>
                    <Link href="/account?tab=orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      My Orders
                    </Link>
                    <Link href="/account?tab=courses" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      Courses
                    </Link>
                    <Link href="/account?tab=setting" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      Setting
                    </Link>
                    <Link href="/account?tab=notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      Notifications
                    </Link>
                    <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 font-bold transition-colors w-full text-left cursor-pointer">
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Person Icon with Lightning Bolt for Guest / Non-logged in -> Opens Auth Modal */
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] dark:hover:text-[#900606] hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer group"
                title="Sign In"
                aria-label="Sign In"
              >
                <GuestUserLightningIcon className="w-5 h-5 xl:w-6 xl:h-6 group-hover:scale-105 transition-transform" />
              </button>
            )}

            {/* Cart Icon */}
            {!pathname.startsWith('/admin') && (
              <Link
                href="/cart"
                className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-[#900606] rounded-full border-2 border-white dark:border-[#0B0F19] animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Right Actions */}
          <div className="flex justify-end lg:hidden items-center gap-1 sm:gap-2 h-full flex-shrink-0">
            {/* Mobile Search Toggle */}
            {!pathname.startsWith('/admin') && (
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>
            )}

            {/* Mobile Person Icon */}
            {!pathname.startsWith('/admin') && (
              userName ? (
                <Link
                  href="/account"
                  className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="My Account"
                >
                  <User className="w-5 h-5 stroke-[2]" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Sign In"
                  aria-label="Sign In"
                >
                  <GuestUserLightningIcon className="w-5 h-5" />
                </button>
              )
            )}

            {/* Mobile Cart Icon */}
            {!pathname.startsWith('/admin') && (
              <Link
                href="/cart"
                className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] transition-colors cursor-pointer"
                aria-label="Shopping Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold text-white bg-[#900606] rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {!isMobileMenuOpen ? (
                <Menu className="block h-6 w-6" />
              ) : (
                <X className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {isMobileSearchOpen && !pathname.startsWith('/admin') && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 px-4 py-2.5 bg-white dark:bg-[#0B0F19] shadow-md animate-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-3.5 py-1.5 focus-within:border-[#900606]">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none pl-2 pr-1"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-neutral-400 hover:text-neutral-600 mr-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#900606] text-white text-xs font-bold rounded-full hover:bg-[#780505] transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Mobile Quick Results */}
            {searchQuery.trim() && searchResults.length > 0 && (
              <div className="mt-2 flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[260px] overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={`m-${item._id || item.id}`}
                    type="button"
                    onClick={() => handleSelectProduct(item)}
                    className="flex items-center gap-2.5 py-2 text-left w-full cursor-pointer"
                  >
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80">
                      {item.image || item.images?.[0] ? (
                        <Image
                          src={getImageUrl(item.image || item.images?.[0])}
                          alt={item.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {item.name}
                      </p>
                      <span className="text-[11px] font-black text-[#900606]">
                        ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Menu */}
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 w-full bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-[600px] opacity-100 border-t border-neutral-200 dark:border-neutral-800' : 'max-h-0 opacity-0 border-t-0'
          }`}
        >
          {!pathname.startsWith('/admin') && (
            <div className="px-4 pt-4 pb-6 space-y-2 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href ? 'text-[#900606] bg-neutral-100 dark:bg-neutral-800' : 'text-neutral-700 dark:text-neutral-300 hover:text-[#900606] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isLive && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
                {userName ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      My Profile ({userName})
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account?tab=courses"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Courses
                    </Link>
                    <Link
                      href="/account?tab=setting"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Setting
                    </Link>
                    <Link
                      href="/account?tab=notifications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Notifications
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal();
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-center rounded-xl text-sm font-bold bg-[#900606] text-white hover:bg-[#7a0505] shadow-sm cursor-pointer"
                    >
                      <GuestUserLightningIcon className="w-4 h-4 text-white" />
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
