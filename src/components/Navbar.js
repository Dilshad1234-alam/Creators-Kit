'use client';

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
          <Link href="/" className="relative flex items-center group">
            <div className="relative h-[90px] md:h-[109px] w-[280px] md:w-[340px] overflow-hidden">
              <Image
                src="/kit logo 2.png - Edited.png"
                alt="Creators Kit Logo"
                fill
                className="object-contain object-left transform transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>
        </div>

          {/* Desktop Navigation */}
          {!pathname.startsWith('/admin') && (
            <nav className="flex-1 hidden lg:flex items-center justify-center space-x-1">
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
          <div className="flex-1 hidden lg:flex items-center justify-end space-x-1 h-full">
            {!isMounted ? (
              <div className="flex items-center gap-4 w-[140px] justify-end">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-800/80 border-t-primary animate-spin"></div>
              </div>
            ) : userName ? (
              <div className="flex items-center gap-2">
                <Link href="/account" className="flex items-center text-[15px] font-bold text-neutral-800 dark:text-neutral-200 px-2 py-1 hover:text-[#900606] dark:hover:text-[#900606] cursor-pointer transition-colors">
                  {userName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-500 hover:text-red-600 transition-colors bg-transparent hover:bg-neutral-100 rounded-full"
                  title="Log out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
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
          <div className="flex-1 flex justify-end lg:hidden items-center space-x-2 h-full mr-1">
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
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-[#FDFBF7] dark:bg-[#900606] absolute w-full left-0 shadow-2xl transition-colors duration-300">
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
                  pathname === link.href ? 'text-[#900606] bg-[#FDFBF7] dark:bg-[#900606]' : 'text-neutral-700 dark:text-neutral-300 hover:text-[#900606] hover:bg-[#FDFBF7] dark:bg-[#900606]'
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
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-[#FDFBF7] dark:bg-[#900606]/50 justify-center hover:bg-neutral-100 dark:hover:bg-[#900606]/70 cursor-pointer transition-colors">
                    <span className="text-base font-semibold text-[#900606] dark:text-neutral-100">👋 Hi, {userName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 text-center rounded-full text-base font-bold bg-[#FDFBF7] dark:bg-[#900606] text-red-500 hover:bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-all"
                  >
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
      )}
    </header>
  );
}
