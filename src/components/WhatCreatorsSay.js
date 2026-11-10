'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, CheckCircle2 } from 'lucide-react';
import { getImageUrl } from '@/lib/imagekit';

const defaultTestimonials = [
  {
    name: 'Vikram Kashyap',
    role: 'Tech Reviewer • 240K Subs',
    text: '“Comprehensive studio kit that actually feels premium. The color accuracy on the main ring light exceeds my expectations, and the fluid head tripod alone is worth the entry price point.”',
    date: '2 days ago',
    stars: 5,
    image: '/team/rahul.jpg',
    product: 'Pro Creator Kit'
  },
  {
    name: 'Sanya Malhotra',
    role: 'Beauty & Lifestyle Creator',
    text: '“The ring light color accuracy is phenomenal! Most budget lights give off a weird sickly green cast, but not this one. The skin tones look flawless, and the setup took me less than 10 mins.”',
    date: '1 week ago',
    stars: 5,
    image: '/team/priya.jpg',
    product: 'Studio RGB Ring Light'
  },
  {
    name: 'Rishi Aditya',
    role: 'Podcaster & Interviewer',
    text: '“Rock solid mic arm and the mount holds well. The tripod extends high without any wobble, and the wireless trigger is a neat touch for remote recording setups.”',
    date: '3 weeks ago',
    stars: 5,
    image: '/team/manish.jpg',
    product: 'Rode Wireless GO II'
  },
  {
    name: 'Priya Desai',
    role: 'Fitness & Motion Vlogger',
    text: '“The RGB lighting and green screen are incredibly versatile. They completely transformed my workout room into an ultra-sharp production studio. Super happy!”',
    date: '1 month ago',
    stars: 5,
    image: '/team/team_3.jpg',
    product: 'Basic Creator Kit'
  },
  {
    name: 'Karan Singh',
    role: 'Gaming & Live Streamer',
    text: '“The mic clarity is insane for the price! No more room echo or background hiss. Having free access to the editing course helped me fix my workflow in days.”',
    date: '1 month ago',
    stars: 5,
    image: '/team/ankit.jpg',
    product: 'Wireless Mic Bundle'
  },
  {
    name: 'Ananya Rao',
    role: 'Travel Filmmaker',
    text: '“The heavy-duty tripod is super lightweight yet holds my mirrorless rig effortlessly on windy days. Best purchase I’ve made for run-and-gun content.”',
    date: '2 months ago',
    stars: 5,
    image: '/cand_1.jpg',
    product: 'ApexPro Heavy-Duty Tripod'
  },
];

export default function WhatCreatorsSay({ testimonials = defaultTestimonials, className = '' }) {
  const [testimonialRef, testimonialEmbla] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 1024px)': { slidesToScroll: 3 },
      '(min-width: 640px)': { slidesToScroll: 2 },
    },
  });

  const [testimonialSelectedIndex, setTestimonialSelectedIndex] = useState(0);
  const [testimonialScrollSnaps, setTestimonialScrollSnaps] = useState([]);

  const onSelectTestimonial = useCallback(() => {
    if (!testimonialEmbla) return;
    setTestimonialSelectedIndex(testimonialEmbla.selectedScrollSnap());
  }, [testimonialEmbla]);

  const onInitTestimonial = useCallback(() => {
    if (!testimonialEmbla) return;
    setTestimonialScrollSnaps(testimonialEmbla.scrollSnapList());
    setTestimonialSelectedIndex(testimonialEmbla.selectedScrollSnap());
  }, [testimonialEmbla]);

  useEffect(() => {
    if (!testimonialEmbla) return;
    onInitTestimonial();
    testimonialEmbla.on('select', onSelectTestimonial);
    testimonialEmbla.on('reInit', onInitTestimonial);
    return () => {
      testimonialEmbla.off('select', onSelectTestimonial);
      testimonialEmbla.off('reInit', onInitTestimonial);
    };
  }, [testimonialEmbla, onSelectTestimonial, onInitTestimonial]);

  const scrollToTestimonial = useCallback(
    (index) => {
      if (testimonialEmbla) testimonialEmbla.scrollTo(index);
    },
    [testimonialEmbla]
  );

  const testimonialDots = testimonialScrollSnaps.length > 0
    ? testimonialScrollSnaps
    : [...Array(Math.ceil((testimonials?.length || 6) / 3))];

  return (
    <section className={`w-full pt-2 pb-2.5 sm:pt-3 sm:pb-3.5 border-t border-neutral-200/70 bg-[#FBFBF7] overflow-hidden font-sans ${className}`}>
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Testimonials Header - Centered */}
        <div className="text-center max-w-2xl mx-auto mb-2 sm:mb-3">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
            What <span className="text-[#900606] whitespace-nowrap">Creators</span> Say
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-normal mt-1 sm:mt-1.5 leading-relaxed">
            Join over 50,000+ creators who transformed their content quality with Creators Kit gear.
          </p>
        </div>

        {/* Testimonials Carousel Container */}
        <div className="relative w-full">
          {/* Embla Viewport - Exactly 3 Cards on Desktop, 2 on Tablet, 1 on Mobile */}
          <div className="overflow-hidden w-full py-1.5 px-0.5" ref={testimonialRef}>
            <div className="flex -mx-3">
              {testimonials.map((t, i) => (
                <div
                  key={`testi-${i}`}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333333%] min-w-0 px-3 shrink-0"
                >
                  <div className="bg-white dark:bg-[#131C2E] p-6 sm:p-7 rounded-3xl sm:rounded-[2rem] border border-neutral-200/90 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      {/* Top row: Avatar, Name, Verified Checkmark, Rating */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border-2 border-white dark:border-neutral-700 shadow-sm shrink-0">
                            {t.image ? (
                              <Image
                                src={getImageUrl(t.image)}
                                alt={t.name}
                                fill
                                sizes="48px"
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-neutral-600 bg-neutral-200">
                                {t.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm sm:text-base text-[#111827] dark:text-white leading-tight">
                                {t.name}
                              </h4>
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black" title="Verified Creator">
                                ✓
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 font-medium mt-0.5">{t.role}</p>
                          </div>
                        </div>

                        {/* Verified Purchase Tag */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      </div>

                      {/* 5-Star Yellow Stars Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 ml-1.5">5.0</span>
                      </div>

                      {/* Testimonial Feedback Text */}
                      <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal">
                        {t.text}
                      </p>
                    </div>

                    {/* Bottom Footer inside Card */}
                    <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-medium text-[#900606] dark:text-red-400 truncate max-w-[180px]">
                        {t.product || 'Creators Kit Bundle'}
                      </span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-2.5 sm:mt-3 pt-0">
            {testimonialDots.map((_, idx) => {
              const isActive = (testimonialSelectedIndex % testimonialDots.length) === idx;
              return (
                <button
                  key={`test-dot-${idx}`}
                  type="button"
                  onClick={() => scrollToTestimonial(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                    ? 'w-7 bg-[#900606]'
                    : 'w-2.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                    }`}
                  aria-label={`Go to testimonial page ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

