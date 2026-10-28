'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/product' },
    { name: 'Bundles', href: '/product#bundles' },
    { name: 'Courses', href: '/account?tab=courses' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const supportLinks = [
    { name: 'FAQs', href: '/product#faq' },
    { name: 'Shipping Policy', href: '/shipping' },
    { name: 'Return & Refund', href: '/refund' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Track Order', href: '/track' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.55a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="w-full bg-[#111827] text-white pt-16 pb-12 border-t border-neutral-800 font-sans">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-neutral-800">
          
          {/* Column 1: Brand Logo, Description & Social Icons */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#900606] flex items-center justify-center text-white shadow-md shadow-[#900606]/30 shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                  Creators<span className="text-[#900606]">kit</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-neutral-400 block uppercase mt-1">
                  GEAR UP. CREATE MORE.
                </span>
              </div>
            </Link>

            <p className="text-neutral-400 text-xs sm:text-sm font-normal leading-relaxed max-w-sm">
              Premium creator products and expert courses to help you start, grow and succeed. Our mission is to create more and more creators across India.
            </p>

            {/* Social Media Rounded Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-9 h-9 rounded-full border border-neutral-700/80 bg-neutral-900/60 hover:bg-[#900606] hover:border-[#900606] transition-all duration-300 flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer shadow-sm hover:scale-105"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-sm sm:text-base text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400 font-normal">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors duration-200 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-bold text-sm sm:text-base text-white tracking-wide">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-400 font-normal">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors duration-200 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-bold text-sm sm:text-base text-white tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-400 font-normal">
              <li className="flex items-center gap-3">
                <span className="text-[#900606] shrink-0">
                  <Mail className="w-4 h-4 stroke-[2]" />
                </span>
                <span className="hover:text-white transition-colors">support@creatorskit.in</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#900606] shrink-0">
                  <Phone className="w-4 h-4 stroke-[2]" />
                </span>
                <span className="hover:text-white transition-colors">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#900606] shrink-0">
                  <MapPin className="w-4 h-4 stroke-[2]" />
                </span>
                <span>New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#900606] shrink-0">
                  <Clock className="w-4 h-4 stroke-[2]" />
                </span>
                <span>Mon - Sat, 10AM - 7PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Clean Divider & Copyright */}
        <div className="pt-8 text-center text-xs sm:text-sm text-neutral-400 font-medium">
          © 2026 Creators Kit — All Rights Reserved
        </div>

      </div>
    </footer>
  );
}