'use client';
import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const updateAuth = () => {
      const stored =
        sessionStorage.getItem('userName') ||
        localStorage.getItem('userName') ||
        session?.user?.name;
      if (stored) {
        setUserName(stored);
      } else {
        setUserName(null);
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
  }, [session]);

  const handleLogout = async () => {
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    localStorage.removeItem('creatorsKitUserInfo');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    setUserName(null);
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // ignore
    }
    router.push('/login');
    router.refresh();
  };

  if (pathname === '/login' || pathname === '/register' || pathname === '/verify-otp' || pathname === '/forgot-password' || pathname.startsWith('/admin')) return null;

  // Updated navigation links matching homepage content, About, and Contact
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Studio Gear', href: '/product' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (e, href) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 transition-colors duration-300 shadow-sm">
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
                  className={`relative px-3 xl:px-5 py-2 text-xs xl:text-sm font-bold transition-all duration-300 rounded-full whitespace-nowrap ${
                    pathname === link.href 
                      ? 'bg-[#900606] text-white shadow-md' 
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-[#900606] dark:hover:text-[#900606] hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="flex-1 hidden lg:flex items-center justify-end gap-2 xl:gap-4 h-full pr-2 xl:pr-8">
            {!isMounted ? (
              <div className="flex items-center gap-4 w-[140px] justify-end mr-6">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-800/80 border-t-primary animate-spin"></div>
              </div>
            ) : userName ? (
              <div className="relative group mr-4 md:mr-6">
                <Link href="/account" className="flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-all">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl("/profile.svg")} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </Link>

                <div className="absolute -right-2 md:-right-4 top-full mt-2 w-56 bg-white dark:bg-[#131C2E] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                  <div className="p-2 flex flex-col gap-1">
                    <Link href="/account?tab=user" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      User
                    </Link>
                    <Link href="/account?tab=orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      My Orders
                    </Link>
                    <Link href="/account?tab=masterclass" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      Masterclass
                    </Link>
                    <Link href="/account?tab=setting" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      Setting
                    </Link>
                    <Link href="/account?tab=notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      Notifications
                    </Link>
                    <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 font-bold transition-colors w-full text-left">
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 xl:gap-4 mr-2 xl:mr-6">
                <Link href="/login" className="text-xs xl:text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:text-[#900606] px-2 transition-colors duration-300 whitespace-nowrap">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-xs xl:text-sm font-bold bg-[#900606] text-white px-4 xl:px-5 py-2 rounded-full hover:bg-[#700505] transition-all duration-300 shadow-sm whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            )}


            {/* Cart Icon */}
            {!pathname.startsWith('/admin') && (
              <Link href="/cart" className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-[#900606] transition-all duration-300 hover:scale-110">
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

          {/* Mobile menu button */}
          <div className="flex justify-end lg:hidden items-center gap-3 sm:gap-6 h-full flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <Menu className="block h-6 w-6" />
              ) : (
                <X className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

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
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href ? 'text-[#900606] bg-neutral-100 dark:bg-neutral-800' : 'text-neutral-700 dark:text-neutral-300 hover:text-[#900606] hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}