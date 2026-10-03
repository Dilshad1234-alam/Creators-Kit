'use client';
import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for user session in sessionStorage
    const storedUserName = sessionStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('token');
    router.push('/login');
  };

  if (pathname === '/login' || pathname === '/register' || pathname === '/verify-otp' || pathname === '/forgot-password' || pathname.startsWith('/admin')) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Product', href: '/product' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavClick = (e, href) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0B0F19] border-b border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
      <div className="w-full h-[70px] md:h-[80px] px-4 md:px-6 flex items-center justify-between transition-colors duration-300">
        {/* Brand Logo */}
        <div className="flex-1 flex items-center justify-start h-full">
          <Link href="/" className="relative flex items-center">
            <div className="relative h-[70px] w-[230px] sm:w-[260px] md:h-[109px] md:w-[340px] overflow-hidden ml-2 md:ml-0">
              <Image
                src={getImageUrl("/logo-kits.png")}
                alt="Creators Kit Logo"
                fill
                sizes="(max-width: 768px) 260px, 340px"
                className="object-contain object-left scale-[1.15] md:scale-100 transform transition-transform duration-300"
                priority
              />
            </div>
          </Link>
        </div>

          {/* Desktop Navigation */}
          {!pathname.startsWith('/admin') && (
            <nav className="flex-1 hidden md:flex items-center justify-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-5 py-2 text-sm md:text-[15px] font-bold transition-all duration-300 rounded-full ${
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
          <div className="flex-1 hidden md:flex items-center justify-end space-x-2 md:space-x-4 h-full pr-2 md:pr-10 lg:pr-20">
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
                    <Link href="/account?tab=user-info" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      User
                    </Link>

                    <Link href="/account?tab=orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      My Orders
                    </Link>
                    <Link href="/account?tab=setting" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Setting
                    </Link>
                    <Link href="/account?tab=notifications" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                      <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      Notifications
                    </Link>
                    
                    <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1"></div>
                    
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 font-bold transition-colors w-full text-left">
                      <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mr-4 md:mr-6">
                <Link href="/login" className="text-[15px] font-bold text-neutral-600 dark:text-neutral-300 hover:text-[#900606] px-2 transition-colors duration-300">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold bg-[#900606] text-white px-5 py-2 rounded-full hover:bg-[#700505] transition-all duration-300 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
            

            {/* Wishlist Icon */}
            {!pathname.startsWith('/admin') && (
              <Link href="/wishlist" className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition-all duration-300 hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {userName && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-[#0B0F19]">
                  {wishlistCount}
                </span>
                )}
              </Link>
            )}

            {/* Cart Icon */}
            {!pathname.startsWith('/admin') && (
              <Link href="/cart" className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-[#900606] transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {userName && cartCount > 0 && (
                <span className="absolute top-0 right-0 w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-[#900606] rounded-full border-2 border-white dark:border-[#0B0F19]">
                  {cartCount}
                </span>
              )}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex-1 flex justify-end md:hidden items-center space-x-1 sm:space-x-2 h-full">
            {/* Mobile Wishlist Icon */}
            {!pathname.startsWith('/admin') && (
              <Link href="/wishlist" className="relative p-2 text-neutral-600 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {userName && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {wishlistCount}
                </span>
                )}
              </Link>
            )}

            {/* Mobile Cart Icon */}
            {!pathname.startsWith('/admin') && (
              <Link href="/cart" className="relative p-2 text-neutral-600 hover:text-[#900606] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {userName && cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#900606] rounded-full">
                  {cartCount}
                </span>
              )}
              </Link>
            )}
            
            <div className="w-px h-6 bg-neutral-200 mx-1"></div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>


      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute w-full left-0 top-full bg-white dark:bg-[#0B0F19] shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
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
        <div className="pt-4 pb-6 border-t border-neutral-200 dark:border-neutral-800/80">
          <div className="flex flex-col px-4 sm:px-6 space-y-4">
            {!isMounted ? (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-800/80 border-t-primary animate-spin"></div>
              </div>
            ) : userName ? (
              <>
                <Link href="/account?tab=user-info" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  User
                </Link>

                <Link href="/account?tab=orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  My Orders
                </Link>
                <Link href="/account?tab=setting" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Setting
                </Link>
                <Link href="/account?tab=notifications" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#900606] font-semibold transition-colors">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  Notifications
                </Link>

                <div className="h-px bg-neutral-200 dark:bg-neutral-800/80 my-2"></div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl font-bold bg-white dark:bg-[#0B0F19] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-semibold text-neutral-600 dark:text-neutral-400 hover:text-[#900606] text-center"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center rounded-full text-base font-bold bg-[#900606] text-white hover:bg-[#700505] shadow-lg shadow-primary/30 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}






