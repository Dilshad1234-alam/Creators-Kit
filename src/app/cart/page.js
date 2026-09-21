'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  if (!cart) return null; // loading state

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-neutral-100">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-neutral-400 mb-8 text-center max-w-md">
          Looks like you haven't added the Creators Kit to your cart yet. Time to start your journey!
        </p>
        <Link
          href="/product"
          className="px-8 py-3 bg-primary text-neutral-950 rounded-full font-bold hover:bg-primary-hover transition-colors shadow-sm"
        >
          View Creators Kit
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-neutral-100">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <h1 className="text-4xl font-extrabold mb-10 text-neutral-100">Review Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/80 rounded-3xl shadow-2xl gap-6 w-full overflow-hidden">
                <div className="grid grid-cols-3 gap-2 shrink-0 w-[184px]">
                  {item.img ? (
                    <div className="relative w-full h-28 col-span-3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-700/40 via-neutral-900/80 to-background rounded-2xl flex items-center justify-center border border-neutral-800 overflow-hidden shadow-inner">
                      <Image src={item.img} alt={item.name} fill className="object-contain p-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
                    </div>
                  ) : item.images && item.images.length > 0 ? (
                    item.images.map((img, idx) => (
                      <div key={idx} className="relative w-14 h-14 bg-background rounded-xl flex items-center justify-center border border-neutral-800 overflow-hidden shadow-inner hover:scale-110 transition-transform">
                        <Image src={img.src} alt={`${item.name} part ${idx + 1}`} fill className="object-contain p-1.5" />
                      </div>
                    ))
                  ) : (
                    <div className="relative w-full h-28 col-span-3 bg-background rounded-2xl flex items-center justify-center border border-neutral-800 overflow-hidden shadow-inner">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-neutral-100 mb-1 truncate">{item.name}</h3>
                  <p className="text-neutral-400 text-sm mb-4 truncate">Complete setup with hardware & courses.</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 bg-background rounded-lg p-1 border border-neutral-800">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded bg-neutral-900 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-neutral-900 border border-neutral-700 text-neutral-400 hover:bg-neutral-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-#FF6B4A hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-2xl font-bold text-right sm:ml-auto text-neutral-100 tracking-tight">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-neutral-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-neutral-800/80 shadow-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-neutral-100">Order Summary</h2>
              
              <div className="space-y-4 text-neutral-400 border-b border-neutral-800/80 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-100">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-green-400">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="font-medium text-neutral-100">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-neutral-100">Total</span>
                <span className="text-3xl font-extrabold text-neutral-100 tracking-tight">₹{cartTotal.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-primary text-neutral-950 rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all duration-300 shadow-xl hover:shadow-primary/40 hover:-translate-y-1"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-neutral-500 text-sm font-medium">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Encrypted Checkout
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
