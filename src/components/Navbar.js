'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { cartCount } = useCart();
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

  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin')) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Product', href: '/product' },
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
    <header className="w-full bg-[#0B0D0E]/80 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-8 relative">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="relative flex items-center w-[200px] h-[65px] group">
              <Image
                src="/logo kits.png - Edited.png"
                alt="Creators Kit Logo"
                fill
                className="object-contain object-left transform transition-transform duration-300 group-hover:scale-105 mix-blend-lighten contrast-125"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!pathname.startsWith('/admin') && (
            <nav className="hidden md:flex space-x-10 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-base font-bold transition-colors duration-300 py-2 ${
                  pathname === link.href ? 'text-[#FF3B14]' : 'text-zinc-400 hover:text-[#FF3B14]'
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF3B14] shadow-[0_0_8px_rgba(252,29,0,0.8)] rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isMounted ? (
              <div className="flex items-center gap-4 w-[140px] justify-end">
                <div className="w-8 h-8 rounded-full border-2 border-zinc-800/80 border-t-[#FF3B14] animate-spin"></div>
              </div>
            ) : userName ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold bg-zinc-900/80 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-full">
                  {userName}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-900/50 hover:bg-zinc-900 border border-transparent hover:border-red-900/30 rounded-full"
                  title="Log out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-[#FF3B14] transition-colors duration-300">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold bg-[#FF3B14] text-white px-5 py-2.5 rounded-full hover:bg-[#E01900] transition-all duration-300 shadow-lg hover:shadow-[#FF3B14]/40 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
            
            {/* Cart Icon */}
            {!pathname.startsWith('/admin') && (
              <Link href="/cart" className="relative p-2 text-zinc-400 hover:text-[#FF3B14] transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#FF3B14] rounded-full">
                  {cartCount}
                </span>
              )}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4 ml-auto">
            {/* Mobile Cart Icon */}
            {!pathname.startsWith('/admin') && (
              <Link href="/cart" className="relative p-2 text-zinc-400 hover:text-[#FF3B14] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#FF3B14] rounded-full">
                  {cartCount}
                </span>
              )}
              </Link>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-[#FF3B14] hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF3B14]"
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
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800/80 bg-[#0B0D0E]/90 backdrop-blur-xl absolute w-full left-0 shadow-2xl">
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
                  pathname === link.href ? 'text-[#FF3B14] bg-zinc-900' : 'text-zinc-300 hover:text-[#FF3B14] hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            </div>
          )}
          <div className="pt-4 pb-6 border-t border-zinc-800/80">
            <div className="flex flex-col px-4 sm:px-6 space-y-4">
              {!isMounted ? (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-800/80 border-t-[#FF3B14] animate-spin"></div>
                </div>
              ) : userName ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-900/50 justify-center">
                    <span className="text-base font-semibold text-white">👋 Hi, {userName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 text-center rounded-full text-base font-bold bg-zinc-900 text-red-500 hover:bg-zinc-800 border border-zinc-800 transition-all"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base font-semibold text-zinc-400 hover:text-[#FF3B14] text-center"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center rounded-full text-base font-bold bg-[#FF3B14] text-white hover:bg-[#E01900] shadow-lg shadow-[#FF3B14]/30 transition-all"
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
