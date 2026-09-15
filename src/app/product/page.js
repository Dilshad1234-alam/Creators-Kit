'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const { addToCart, cartCount } = useCart();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('included');
  const [currentImage, setCurrentImage] = useState(0);

  const product = {
    id: 'creators-kit-v1',
    name: 'The Ultimate Creators Kit',
    price: 199.99,
    description:
      'Everything you need to launch your channel, start a podcast, or go viral on TikTok. We bundled the essential hardware with the exact knowledge you need to use it.',
    images: [
      '📦', // Placeholder for the main kit image
      '💡', // Ring light
      '🎙️', // Mic
      '🟩', // Green screen
    ],
  };

  const includedItems = [
    '10-inch Professional LED Ring Light',
    'Adjustable Aluminum Ring Light Stand',
    'Wireless Noise-Canceling Microphone',
    'Flexible Tripod for Camera/Phone',
    'Chroma Key Green Curtain with Clamps',
    'Physical USB Pendrive (Courses Offline)',
    'Printed Masterclass Workbooks',
  ];

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity: 1 });
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">


      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-neutral-100 rounded-3xl flex items-center justify-center text-9xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="transform transition-transform hover:scale-110 duration-500 cursor-zoom-in">
                {product.images[currentImage]}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`aspect-square bg-neutral-50 rounded-xl flex items-center justify-center text-4xl border-2 transition-all ${
                    currentImage === idx ? 'border-[#FC1D00] ring-2 ring-[#FC1D00]/20' : 'border-transparent hover:border-neutral-200'
                  }`}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-[#FC1D00] font-bold tracking-wider uppercase text-sm mb-2 block">
              Complete Bundle
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-neutral-800 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-8 border-2 border-[#FC1D00] text-[#FC1D00] rounded-full font-bold text-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-8 bg-[#FC1D00] text-white rounded-full font-bold text-lg hover:bg-[#E01900] transition-transform hover:-translate-y-0.5 shadow-lg shadow-red-500/30 flex items-center justify-center"
              >
                Buy Now
              </button>
            </div>

            {/* Tabs for extra info */}
            <div className="border-t border-neutral-200 pt-8">
              <div className="flex space-x-8 mb-6 border-b border-neutral-200">
                {['included', 'shipping', 'faq'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-bold text-sm uppercase tracking-wider transition-colors relative ${
                      activeTab === tab ? 'text-[#FC1D00]' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {tab === 'included' ? "What's Included" : tab === 'shipping' ? 'Shipping & Returns' : 'FAQ'}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FC1D00]"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px] text-neutral-600">
                {activeTab === 'included' && (
                  <ul className="space-y-3">
                    {includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Fast & Free Delivery</h4>
                      <p className="text-sm">We process all orders within 24 hours. Standard delivery takes 3-5 business days nationwide absolutely free.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">30-Day Money-Back Guarantee</h4>
                      <p className="text-sm">If you're not completely satisfied with the kit, simply return it within 30 days for a full, no-questions-asked refund.</p>
                    </div>
                  </div>
                )}
                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Does the ring light work with my specific phone?</h4>
                      <p className="text-sm">Yes! The included tripod mount expands to fit nearly every modern smartphone on the market.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Are the courses completely free?</h4>
                      <p className="text-sm">Yes, they are 100% included in this bundle with lifetime access on the provided USB Pendrive.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Creators Kit. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
