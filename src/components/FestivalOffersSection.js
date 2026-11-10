'use client';

import React, { useState, useCallback } from 'react';
import {
  Tag,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function FestivalOffersSection({
  promoCode = 'CREATE10',
  headline,
  discountPercent = 10,
  subtitle,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [promoCode]);

  return (
    <section id="bundles-section" className="py-2 sm:py-3 relative w-full scroll-mt-24">
      {/* PROMINENT BOTTOM COUPON CALLOUT CARD (EXTRA 10% OFF WITH CREATE10) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#451206] via-[#731c0a] to-[#9e310e] border-2 border-amber-400/50 p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(69,18,6,0.3)]">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left Text */}
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs font-black uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>INSTANT FESTIVAL CHECKOUT BONUS</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
              {headline ? (
                <span>{headline}</span>
              ) : (
                <>
                  Extra <span className="text-amber-300">{discountPercent}% Off</span> on All Creator Kits
                </>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-amber-100/90 font-normal">
              {subtitle ||
                'Apply code at checkout on top of all existing festival discounts. Zero minimum order value, valid across all bundles & individual gear.'}
            </p>
          </div>

          {/* Right Coupon Voucher Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto shrink-0 justify-center">
            {/* Dashed Voucher Box */}
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-dashed border-amber-400/80 shadow-inner">
              <Tag className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-amber-200/80 uppercase tracking-widest">
                  Coupon Code
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider">
                  {promoCode}
                </span>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="ml-3 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Explore Button */}
            <a
              href="#standout-gear"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
