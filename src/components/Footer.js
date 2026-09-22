'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/admin')) return null;
  return (
    <footer className="w-full bg-white dark:bg-background text-neutral-600 dark:text-neutral-400 py-12 md:py-20 border-t border-neutral-200 dark:border-neutral-800 font-sans">
      <div className="w-full px-6 md:px-12 lg:px-24 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 lg:gap-8">
        
        {/* Brand Summary */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="relative block w-[180px] h-[55px] md:w-[220px] md:h-[70px] mb-4 md:mb-6">
            <Image
              src="/logo kits.png - Edited.png"
              alt="Creators Kit Logo"
              fill
              className="object-contain object-left mix-blend-lighten contrast-125"
            />
          </Link>
          <p className="text-base md:text-lg max-w-md font-medium leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6 md:mb-8">
            The complete toolkit for modern creators. Professional equipment, elite education, and tactile physical resources bundled into one seamless experience.
          </p>
          <div className="flex items-center gap-4 text-neutral-900 dark:text-neutral-100">
            {/* Social Icons (Mock) */}
            <a href="https://instagram.com/creatorskithub" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center hover:bg-primary transition-colors border border-neutral-200 dark:border-neutral-800 hover:border-transparent">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <span className="font-bold text-sm md:text-base">@creatorskithub</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-neutral-900 dark:text-neutral-100 font-bold text-lg md:text-xl mb-4 md:mb-6">Company</h4>
          <ul className="space-y-3 md:space-y-4 text-sm md:text-base font-medium">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/product" className="hover:text-primary transition-colors">Product Bundle</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-neutral-900 dark:text-neutral-100 font-bold text-lg md:text-xl mb-4 md:mb-6">Legal</h4>
          <ul className="space-y-3 md:space-y-4 text-sm md:text-base font-medium">
            <li><Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/legal/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link href="/legal/returns" className="hover:text-primary transition-colors">Return Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="w-full px-6 md:px-12 lg:px-24 mt-10 md:mt-20 pt-6 md:pt-10 border-t border-neutral-200 dark:border-neutral-800 text-sm md:text-base text-center font-medium">
        &copy; {new Date().getFullYear()} Creators Kit. All rights reserved. Designed for the modern creator.
      </div>
    </footer>
  );
}
