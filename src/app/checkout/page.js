'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: 'US',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          customer: formData,
        }),
      });

      if (!res.ok) {
        throw new Error('Payment processing failed');
      }

      // Mock successful checkout
      clearCart();
      alert('Order placed successfully! Check your email for confirmation.');
      router.push('/');
    } catch (error) {
      alert('Checkout error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No items in checkout.</h1>
          <Link href="/product" className="text-[#FC1D00] hover:underline font-medium">Return to store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-foreground flex flex-col md:flex-row">
      
      {/* Left side: Checkout Form */}
      <div className="flex-1 p-4 sm:p-8 md:p-12 lg:p-24 bg-white border-r border-neutral-200">
        <div className="max-w-xl mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tighter text-[#FC1D00] mb-12 block">
            Creators Kit
          </Link>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00] focus:border-transparent transition-shadow"
                />
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                />
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                />
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleChange}
                  className="col-span-2 w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                />
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                />
                <input
                  type="text"
                  name="zip"
                  required
                  placeholder="ZIP code"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-xl font-bold mb-4">Payment Details</h2>
              <p className="text-sm text-neutral-500 mb-4">This is a mock checkout. Do not enter real credit card details.</p>
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  required
                  placeholder="Card number"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    required
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                  />
                  <input
                    type="text"
                    name="cvc"
                    required
                    placeholder="CVC"
                    value={formData.cvc}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#FC1D00]"
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FC1D00] text-white rounded-xl font-bold text-lg hover:bg-[#E01900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex justify-center items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                `Pay $${cartTotal.toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Order Summary */}
      <div className="w-full md:w-96 lg:w-[450px] p-4 sm:p-8 md:p-12 bg-neutral-50">
        <div className="max-w-md mx-auto sticky top-12">
          <h2 className="text-xl font-bold mb-6 hidden md:block">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-white border border-neutral-200 rounded-lg flex items-center justify-center text-3xl shrink-0">
                  📦
                  <span className="absolute -top-2 -right-2 bg-neutral-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-neutral-900">{item.name}</h4>
                  <p className="text-xs text-neutral-500">Complete bundle</p>
                </div>
                <div className="font-medium text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-3 text-sm text-neutral-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-900">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-neutral-900">Free</span>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 pt-6 flex justify-between items-center">
            <span className="text-lg font-bold text-neutral-900">Total</span>
            <div className="text-right">
              <span className="text-xs text-neutral-500 mr-2">USD</span>
              <span className="text-2xl font-extrabold text-neutral-900">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
