'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  if (!cart) return null; // loading state

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8 text-center max-w-md">
          Looks like you haven't added the Creators Kit to your cart yet. Time to start your journey!
        </p>
        <Link
          href="/product"
          className="px-8 py-3 bg-[#FC1D00] text-white rounded-full font-bold hover:bg-[#E01900] transition-colors shadow-sm"
        >
          View Creators Kit
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold mb-8">Review Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm gap-6">
                <div className="w-24 h-24 bg-neutral-100 rounded-xl flex items-center justify-center text-5xl border border-neutral-200 shrink-0">
                  📦
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-1">{item.name}</h3>
                  <p className="text-neutral-500 text-sm mb-4">Includes hardware, courses, and physical pendrive.</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 bg-neutral-50 rounded-lg p-1 border border-neutral-200">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-xl font-bold text-right sm:ml-auto">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-neutral-600 border-b border-neutral-200 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span className="font-medium text-neutral-900">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-extrabold text-neutral-900">${cartTotal.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-[#FC1D00] text-white rounded-full font-bold text-lg hover:bg-[#E01900] transition-colors shadow-md shadow-red-500/20"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-neutral-400 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
