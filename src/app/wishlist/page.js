'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    removeFromWishlist(item._id || item.id);
  };
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#900606] dark:text-neutral-100 pt-28 pb-12 md:pt-36 md:pb-24 transition-colors duration-300 animate-page-enter">
      <div className="w-full px-6 md:px-12 lg:px-24 mx-auto pt-5">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-[#900606] text-center">Your Wishlist</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-12 font-medium">Saved items you want to keep an eye on.</p>

        {!wishlist ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#900606] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#131C2E] rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-xl max-w-2xl mx-auto transition-colors duration-300">
            <svg className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#900606] dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-center max-w-md">Looks like you haven't saved any items yet. Explore our gear to find something you like!</p>
            <Link href="/product" className="px-8 py-3 bg-[#900606] text-white rounded-full font-bold hover:bg-[#700505] transition-colors shadow-lg">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item._id || item.id} className="group flex flex-col bg-white dark:bg-[#131C2E] border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-4 shadow-lg hover:shadow-2xl transition-all duration-300">
                
                <div className="relative w-full aspect-[4/5] mb-4 bg-neutral-50 dark:bg-[#0f172a] rounded-[1.5rem] overflow-hidden flex items-center justify-center p-4">
                  <Image 
                    src={item.image || '/placeholder.png'} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                
                <div className="px-2 pb-2 flex flex-col flex-grow">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1.5">Gear</span>
                  <h3 className="font-extrabold text-neutral-900 dark:text-white mb-2 text-base text-left line-clamp-2">{item.name}</h3>
                  <div className="font-black text-[#900606] dark:text-[#ff4d4d] text-lg mb-6">₹{item.price}</div>
                  
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="mt-auto w-full py-3 bg-[#900606] text-white rounded-xl font-bold hover:bg-[#700505] transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

