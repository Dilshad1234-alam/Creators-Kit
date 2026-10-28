'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const fallbackBundles = [
  {
    id: 'pro-creator-kit',
    name: 'Pro Creator Kit',
    tag: 'Most Popular',
    rating: '5.0/5 (2,800 Ratings)',
    price: 9999,
    formattedPrice: '₹9,999',
    oldPrice: '₹14,999',
    discount: '33% OFF',
    image: '/pro1.png',
    features: [
      'Rode Wireless GO II Dual Mic',
      '18" High-CRI LED Ring Light',
      'Heavy-Duty Aluminum Tripod',
      'Wrinkle-Resistant Green Screen',
      'Reinforced Gear Travel Bag',
    ],
  },
  {
    id: 'basic-creator-kit',
    name: 'Basic Creator Kit',
    tag: 'Best Seller',
    rating: '4.9/5 (3,150 Ratings)',
    price: 4999,
    formattedPrice: '₹4,999',
    oldPrice: '₹6,999',
    discount: '28% OFF',
    image: '/pro.png',
    features: [
      'Ring Light 18" with Phone Mount',
      'Adjustable Aluminum Tripod Stand',
      'Wireless Lapel Microphone',
      'Universal Smartphone Grip',
      'Zippered Gear Carry Pouch',
    ],
  },
  {
    id: 'ultimate-creator-kit',
    name: 'Ultimate Creator Kit',
    tag: 'New Arrival',
    rating: '5.0/5 (1,950 Ratings)',
    price: 14999,
    formattedPrice: '₹14,999',
    oldPrice: '₹24,999',
    discount: '40% OFF',
    image: '/pro2.png',
    features: [
      'Dual Bi-Color LED RGB Panels',
      'Broadcast Boom Arm & Condenser Mic',
      'Professional Carbon Fiber Tripod',
      'Ultra-Wide Studio Green Screen',
      'Hard Shell Travel Equipment Case',
    ],
  },
];

export default function PopularBundlesSection() {
  const [bundles, setBundles] = useState(fallbackBundles);

  useEffect(() => {
    async function loadBundles() {
      try {
        const res = await fetch('/api/bundles');
        if (res.ok) {
          const data = await res.json();
          const dbBundles = data.data || [];
          if (dbBundles.length > 0) {
            const formatted = dbBundles.map((b) => {
              const priceVal = typeof b.price === 'number' ? b.price : Number(b.price) || 0;
              const origVal = b.originalPrice ? Number(b.originalPrice) : null;
              let discountStr = b.discount || '';
              if (!discountStr && origVal && origVal > priceVal) {
                discountStr = `${Math.round(((origVal - priceVal) / origVal) * 100)}% OFF`;
              }

              return {
                id: b.id || b._id,
                _id: b._id,
                name: b.name,
                tag: b.tag || (priceVal > 10000 ? 'New Arrival' : 'Most Popular'),
                price: priceVal,
                formattedPrice: `₹${priceVal.toLocaleString('en-IN')}`,
                oldPrice: origVal ? `₹${origVal.toLocaleString('en-IN')}` : '',
                discount: discountStr,
                image: b.image || '/pro1.png',
                features: Array.isArray(b.features) && b.features.length > 0
                  ? b.features
                  : [
                      'Professional Studio Lighting',
                      'High-Fidelity Audio Capture',
                      'Heavy-Duty Stabilization Tripod',
                      'Full Creator Warranty & Accessories',
                    ],
              };
            });
            setBundles(formatted);
          }
        }
      } catch (err) {
        console.error('Failed to load bundles from database:', err);
      }
    }

    loadBundles();
  }, []);

  const [mobileBundleRef, mobileBundleEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollBundleNext = useCallback(() => {
    if (mobileBundleEmbla) mobileBundleEmbla.scrollNext();
  }, [mobileBundleEmbla]);

  const scrollBundlePrev = useCallback(() => {
    if (mobileBundleEmbla) mobileBundleEmbla.scrollPrev();
  }, [mobileBundleEmbla]);

  const mobileBundles = bundles && bundles.length > 0
    ? (bundles.length <= 4 ? [...bundles, ...bundles, ...bundles] : bundles)
    : [];

  return (
    <section className="w-full pt-3 pb-2 sm:pt-6 sm:pb-5 bg-[#FBFBF7] overflow-hidden">
      <div className="w-full max-w-[1750px] mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-3 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight pb-1 sm:pb-3">
            Popular <span className="text-[#900606] whitespace-nowrap">Creators Bundles</span>
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal max-w-xl">
            Everything you need to build a visually demanding, high-retention podcast or streaming studio.
          </p>
        </div>

        {/* MOBILE VIEW (block md:hidden) - EXACTLY 1 CARD PER SCREEN WITH BOTH ARROWS */}
        <div className="block md:hidden relative w-full px-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={scrollBundlePrev}
            aria-label="Previous bundle"
            className="absolute left-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={scrollBundleNext}
            aria-label="Next bundle"
            className="absolute right-0 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
          </button>

          {/* Embla Viewport - 1 Card at a Time */}
          <div className="overflow-hidden w-full px-1" ref={mobileBundleRef}>
            <div className="flex">
              {mobileBundles.map((bundle, idx) => {
                const targetId = bundle.id || bundle._id;
                return (
                  <div
                    key={`${targetId}-${idx}`}
                    className="flex-[0_0_100%] min-w-0 px-2 shrink-0"
                  >
                    <div className="group bg-white border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden flex flex-col transition-shadow duration-300 h-full justify-between">
                      <div>
                        {/* Image Container with aspect-[4/3] & Tag */}
                        <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                          {bundle.tag && (
                            <div className="absolute top-3 left-3 z-20">
                              <span className="bg-[#900606] text-white text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase shadow-md">
                                {bundle.tag}
                              </span>
                            </div>
                          )}

                          <Image
                            src={getImageUrl(bundle.image)}
                            alt={bundle.name}
                            fill
                            sizes="80vw"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5 flex flex-col">
                          <h3 className="font-bold text-[#111827] text-lg mb-2">
                            {bundle.name}
                          </h3>

                          {/* Pricing & Discount */}
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="font-bold text-2xl text-[#111827]">{bundle.formattedPrice}</span>
                            {bundle.oldPrice && (
                              <span className="text-xs text-neutral-400 font-medium line-through">MRP {bundle.oldPrice}</span>
                            )}
                          </div>

                          {/* Features List */}
                          <ul className="space-y-2 mb-4">
                            {bundle.features.slice(0, 5).map((feature, index) => (
                              <li key={index} className="flex items-start gap-2.5 text-neutral-600 text-xs font-medium">
                                <span className="text-[#900606] font-bold">✓</span>
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* View Details Button with Slide-Up Hover Effect & rounded-xl */}
                      <div className="px-4 pb-4">
                        <Link 
                          href={`/bundle/${targetId}`}
                          className="relative isolate w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-xs sm:text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0 pointer-events-none"></span>
                          <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                            View Details
                          </span>
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW (hidden md:grid) - EXACTLY AS BEFORE */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 w-full">
          {bundles.map((bundle) => {
            const targetId = bundle.id || bundle._id;
            return (
              <div
                key={targetId}
                className="group bg-white border border-neutral-200 shadow-sm hover:shadow-md rounded-[1rem] overflow-hidden flex flex-col transition-shadow duration-300"
              >
                {/* Image Container edge-to-edge at the top */}
                <div className="relative w-full h-62 sm:h-70 md:h-84 lg:h-88 bg-neutral-100 overflow-hidden">
                  {bundle.tag && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-[#900606] text-white text-xs font-extrabold tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-md">
                        {bundle.tag}
                      </span>
                    </div>
                  )}

                  <Image
                    src={getImageUrl(bundle.image)}
                    alt={bundle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Bundle Content with padding */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-bold text-[#111827] text-xl mb-3">
                    {bundle.name}
                  </h3>

                  {/* Pricing & Discount */}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-bold text-3xl text-[#111827]">{bundle.formattedPrice}</span>
                    {bundle.oldPrice && (
                      <span className="text-sm text-neutral-400 font-medium line-through">MRP {bundle.oldPrice}</span>
                    )}
                  </div>

                  {/* Features List (Checkmarks) */}
                  <ul className="space-y-3 mb-10 flex-grow">
                    {bundle.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-neutral-600 text-sm font-medium">
                        <span className="text-[#900606] mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* View Details Button with Slide-Up Hover Effect */}
                  <Link 
                    href={`/bundle/${targetId}`}
                    className="relative isolate w-full py-3.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer hover:shadow-md"
                  >
                    <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0 pointer-events-none"></span>
                    <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                      View Details
                    </span>
                  </Link>

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}