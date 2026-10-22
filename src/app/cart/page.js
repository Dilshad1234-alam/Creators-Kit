'use client';

import { getImageUrl } from '@/lib/imagekit';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Lock,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const router = useRouter();

  if (!cart) return null; // Hydration/loading state

  // 1. EMPTY CART STATE
  if (cart.length === 0) {
    return (
      <div className="min-h-[100svh] bg-[#FBFBF7] text-neutral-900 font-sans selection:bg-[#900606] selection:text-white relative overflow-hidden flex flex-col justify-center items-center px-4 py-24">
        {/* Subtle Signature Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#900606]/10 blur-[140px] rounded-full pointer-events-none -z-0"></div>

        <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl sm:rounded-[2.5rem] border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-50 text-[#900606] flex items-center justify-center mb-6 shadow-inner border border-red-100/80">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.75]" />
          </div>

          <span className="text-xs font-bold tracking-[0.2em] text-[#900606] uppercase mb-2">
            YOUR BASKET IS EMPTY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-3">
            Your cart is currently empty
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-sm">
            Looks like you haven&apos;t added any studio gear or creator bundles yet. Time to level up your setup!
          </p>

          <Link
            href="/product"
            className="relative w-full sm:w-auto px-8 py-3.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm inline-flex items-center justify-center gap-2.5"
          >
            <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2.5">
              <span>Explore Studio Gear</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. ACTIVE CART STATE
  return (
    <div className="min-h-[100svh] bg-[#FBFBF7] text-neutral-900 font-sans selection:bg-[#900606] selection:text-white relative overflow-x-hidden pb-16">
      
      {/* Subtle Signature Ambient Glow Matching Contact/Product */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[550px] bg-[#900606]/10 blur-[140px] rounded-full pointer-events-none -z-0"></div>

      <main className="max-w-[1750px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 sm:pt-32 relative z-10">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-5">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span className="text-neutral-300">›</span>
          <Link href="/product" className="hover:text-neutral-900 transition-colors">Studio Gear</Link>
          <span className="text-neutral-300">›</span>
          <span className="text-[#900606] font-semibold">Your Cart</span>
        </nav>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3 sm:mb-5 pb-3 border-b border-neutral-200/80">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111827] tracking-tight">
              Review Your <span className="text-[#900606] whitespace-nowrap">Cart</span>
            </h1>
            <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-2.5 leading-relaxed">
              Verify your equipment selections and bundle upgrades before moving to secure checkout.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-neutral-200/90 rounded-full px-4 py-1.5 shadow-2xs text-xs font-bold text-neutral-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</span>
          </div>
        </div>

        {/* 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: CART ITEMS LIST (8 Columns) */}
          <div className="lg:col-span-8 space-y-5">
            {cart.map((item) => {
              const defaultKitImages = [
                { src: '/ring5.png', title: 'Studio RGB Ring Light' },
                { src: '/tripod6.png', title: 'ApexPro Heavy-Duty Tripod' },
                { src: '/chorma2.png', title: 'ChromaKey Green Screen' },
                { src: '/wireless-mic4.png', title: 'Rode Wireless GO II' }
              ];
              const isKitProduct = String(item.id).startsWith('rode-wireless-go-2') || String(item.id).startsWith('creators-kit');
              const allImages = (item.images && item.images.length > 1) 
                ? item.images 
                : (isKitProduct ? defaultKitImages : (item.images || []));

              const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl sm:rounded-[1rem] border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-neutral-300 transition-all duration-300 p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 group overflow-hidden"
                >
                  {/* IMAGES DISPLAY CONTAINER */}
                  <div className="shrink-0 w-full md:w-44 lg:w-48">
                    {allImages && allImages.length > 1 ? (
                      <div className="relative w-full aspect-square md:w-44 lg:w-48 md:h-44 lg:h-48 bg-neutral-50 rounded-xl p-2 border border-neutral-200/80 overflow-hidden shadow-inner mx-auto grid grid-cols-2 gap-2">
                        {allImages.slice(0, 4).map((img, idx) => {
                          const imgSrc = typeof img === 'string' ? img : (img.src || img.image);
                          const imgTitle = typeof img === 'object' ? (img.title || img.name) : `Item ${idx + 1}`;
                          return (
                            <div
                              key={idx}
                              className="relative w-full h-full bg-white rounded-xl flex items-center justify-center border border-neutral-100 overflow-hidden shadow-2xs hover:scale-105 transition-transform"
                              title={imgTitle}
                            >
                              <Image
                                src={getImageUrl(imgSrc)}
                                alt={imgTitle}
                                fill
                                className="object-contain p-1.5 mix-blend-multiply"
                                sizes="90px"
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : item.img || item.image ? (
                      <div className="relative w-full aspect-square md:w-44 lg:w-48 md:h-44 lg:h-48 bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 overflow-hidden shadow-inner mx-auto flex items-center justify-center">
                        <Image 
                          src={getImageUrl(item.img || item.image)} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                          sizes="192px" 
                        />
                      </div>
                    ) : (
                      <div className="relative w-full aspect-square md:w-44 lg:w-48 md:h-44 lg:h-48 bg-neutral-50 rounded-xl flex items-center justify-center border border-neutral-200/80 overflow-hidden shadow-inner mx-auto">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* ITEM DETAILS & QUANTITY ACTIONS */}
                  <div className="flex-1 w-full flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-[#111827] group-hover:text-[#900606] transition-colors leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                            {item.subtitle || 'Complete creator setup with hardware gear & masterclasses.'}
                          </p>
                        </div>

                        {/* Price Display on Desktop Top Right */}
                        <div className="hidden sm:flex flex-col items-end shrink-0">
                          <span className="text-2xl sm:text-3xl font-black text-[#900606] tracking-tight">
                            ₹{itemTotal.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-medium">
                            ₹{(Number(item.price) || 0).toLocaleString()} each
                          </span>
                        </div>
                      </div>

                      {/* Included Items Badges */}
                      {allImages && allImages.length > 1 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-3.5 mb-2">
                          <span className="text-[11px] font-bold text-neutral-500 mr-1 uppercase tracking-wider">
                            Kit includes:
                          </span>
                          {allImages.map((img, idx) => {
                            const imgSrc = typeof img === 'string' ? img : (img.src || img.image);
                            const imgTitle = typeof img === 'object' ? (img.title || img.name) : `Item ${idx + 1}`;
                            return (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 rounded-lg px-2.5 py-1 shadow-2xs text-[11px] font-semibold text-neutral-700 transition-colors"
                                title={imgTitle}
                              >
                                <div className="relative w-3.5 h-3.5 shrink-0 bg-white rounded overflow-hidden">
                                  <Image
                                    src={getImageUrl(imgSrc)}
                                    alt={imgTitle}
                                    fill
                                    className="object-contain"
                                    sizes="14px"
                                  />
                                </div>
                                <span className="truncate max-w-[120px] sm:max-w-[150px]">{imgTitle}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Price on Mobile View */}
                    <div className="flex sm:hidden items-baseline justify-between w-full pt-3 mt-3 border-t border-neutral-100">
                      <span className="text-xs font-semibold text-neutral-500">Item Total:</span>
                      <span className="text-2xl font-black text-[#900606] tracking-tight">
                        ₹{itemTotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Selector & Remove Button */}
                    <div className="flex items-center justify-between gap-4 pt-4 mt-3 border-t border-neutral-100">
                      
                      {/* Quantity Controller Pill */}
                      <div className="flex items-center gap-1 bg-[#F9F9F5] border border-neutral-200/90 rounded-xl p-1 shadow-2xs">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, (Number(item.quantity) || 1) - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-[#900606] hover:border-[#900606] font-bold text-sm transition-all flex items-center justify-center shadow-2xs disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        <span className="w-8 text-center font-bold text-sm text-[#111827]">
                          {item.quantity}
                        </span>

                        <button 
                          onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-[#900606] hover:border-[#900606] font-bold text-sm transition-all flex items-center justify-center shadow-2xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-neutral-900 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group/btn border border-transparent hover:border-red-200 text-xs font-semibold" 
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Action Bar under Cart Items */}
            <div className="flex items-center justify-between pt-2 px-1">
              <Link
                href="/product"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-900 hover:text-[#900606] transition-colors"
              >
                <span>←</span> Continue Browsing Gear
              </Link>

              <button
                onClick={clearCart}
                className="text-xs font-semibold text-neutral-900 hover:text-red-600 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY (4 Columns) */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white rounded-xl sm:rounded-[1rem] border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 xl:sticky xl:top-32 space-y-6">
              
              {/* Summary Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
                  Order Summary
                </h2>
                <span className="bg-red-50 text-[#900606] text-xs font-bold px-3 py-1 rounded-full border border-red-100">
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3.5 text-xs sm:text-sm text-neutral-600">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Subtotal</span>
                  <span className="font-bold text-[#111827]">₹{cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Standard Shipping</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    FREE
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Estimated Taxes</span>
                  <span className="font-medium text-neutral-500">Calculated at checkout</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-neutral-200/80">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-base font-bold text-[#111827]">Estimated Total</span>
                  <span className="text-3xl sm:text-4xl font-black text-[#900606] tracking-tight">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal text-right">
                  Inclusive of all applicable GST taxes
                </p>
              </div>

              {/* Checkout CTA */}
              <button 
                onClick={() => router.push('/checkout')}
                className="relative w-full py-3.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-base overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2.5">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </button>

              {/* Trust Badges Inside Summary */}
              <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-2.5 text-emerald-700 bg-emerald-50/70 border border-emerald-100/80 rounded-xl px-3 py-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-semibold">256-bit SSL Encrypted Checkout</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>7-Day Replacement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Official Warranty</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. BOTTOM TRUST & GUARANTEES ROW (Matching Product & About Pages) */}
        <div className="mt-10 sm:mt-15 pt-5 border-t border-neutral-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">Free Delivery</h4>
                <p className="text-[11px] text-neutral-600 font-medium">Nationwide 3-5 days</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">7 Days Replacement</h4>
                <p className="text-[11px] text-neutral-600 font-medium">Hassle-free doorstep pickup</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">Secure Payments</h4>
                <p className="text-[11px] text-neutral-600 font-medium">100% verified gateway</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#900606] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">Genuine Products</h4>
                <p className="text-[11px] text-neutral-600 font-medium">Official brand warranty</p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
