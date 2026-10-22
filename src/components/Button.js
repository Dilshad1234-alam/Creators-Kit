'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Standardized Animated Button Component with Sliding Fill Effect
 * 
 * Pattern:
 * - Base wrapper: relative [width] [padding] bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center
 * - Background slide span: <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0 pointer-events-none"></span>
 * - Text/Content span: <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">...</span>
 */
export default function Button({
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  contentClassName = '',
  slideColor = 'bg-[#900606]',
  as,
  ...props
}) {
  const baseClasses = `relative py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
  } ${className}`;

  const innerContent = (
    <>
      <span className={`absolute inset-0 ${slideColor} translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0 pointer-events-none`}></span>
      <span className={`relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2 ${contentClassName}`}>
        {children}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={baseClasses} {...props}>
        {innerContent}
      </Link>
    );
  }

  if (as === 'div') {
    return (
      <div onClick={disabled ? undefined : onClick} className={baseClasses} {...props}>
        {innerContent}
      </div>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {innerContent}
    </button>
  );
}

export { Button };
