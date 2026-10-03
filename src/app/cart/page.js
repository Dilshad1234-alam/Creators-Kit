'use client';
import { getImageUrl } from '@/lib/imagekit';
import Link from 'next/link';
import { useCart} from '@/context/CartContext';
import { useRouter} from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
 const { cart, removeFromCart, updateQuantity, cartTotal} = useCart();
 const router = useRouter();

 if (!cart) return null; // loading state

 if (cart.length === 0) {
 return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] px-4 text-[#900606]">
 <div className="text-6xl mb-6">🛒</div>
 <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
 <p className="text-neutral-600 mb-8 text-center max-w-md">
 Looks like you haven't added the Creators Kit to your cart yet. Time to start your journey!
 </p>
 <Link
 href="/product"
 className="px-8 py-3 bg-[#900606] text-white rounded-full font-bold hover:bg-[#700505] transition-colors shadow-sm"
 >
 View Creators Kit
 </Link>
 </div>
 );
}

 return (
 <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden text-[#900606]">
 {/* Background Glow */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#900606]/10 blur-[120px] rounded-full pointer-events-none"></div>

 <main className="max-w-[90rem] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 md:pt-32 relative z-10">
 <h1 className="text-4xl font-extrabold mb-10 text-[#900606]">Review Your Cart</h1>

 <div className="flex flex-col lg:grid lg:grid-cols-[70%_30%] gap-8 lg:gap-12">
 {/* Cart Items */}
 <div className="space-y-6 w-full pr-0 lg:pr-4">
 {cart.map((item) => (
 <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-white hover:bg-neutral-50 transition-all duration-300 border border-neutral-100 rounded-3xl shadow-sm hover:shadow-md gap-8 w-full group">
 <div className="grid grid-cols-3 gap-2 shrink-0 w-full sm:w-[220px]">
 {item.img ? (
 <div className="relative w-full h-36 col-span-3 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-200 overflow-hidden shadow-inner">
 <Image src={getImageUrl(item.img)} alt={item.name} fill className="object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
 </div>
 ) : item.images && item.images.length > 0 ? (
 item.images.map((img, idx) => (
 <div key={idx} className="relative w-16 h-16 bg-neutral-50 cursor-pointer rounded-xl flex items-center justify-center border border-neutral-200 overflow-hidden shadow-inner hover:scale-110 transition-transform">
 <Image src={getImageUrl(img.src)} alt={`${item.name} part ${idx + 1}`} fill className="object-contain p-1.5 mix-blend-multiply" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
 </div>
 ))
 ) : (
 <div className="relative w-full h-36 col-span-3 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-200 overflow-hidden shadow-inner">
 <span className="text-4xl">📦</span>
 </div>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-xl font-bold text-[#900606] mb-1 truncate">{item.name}</h3>
 <p className="text-neutral-600 text-sm mb-4 truncate">Complete setup with hardware & courses.</p>
 
 <div className="flex items-center justify-between mt-auto">
 <div className="flex items-center gap-4 bg-white rounded-xl p-1.5 shadow-sm border border-neutral-200">
 <button 
 onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
 className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-[#900606] transition-colors"
 >
 -
 </button>
 <span className="font-bold w-6 text-center text-lg">{item.quantity}</span>
 <button 
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-[#900606] transition-colors"
 >
 +
 </button>
 </div>
 
 <button onClick={() => removeFromCart(item.id)} className="p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-all group/btn flex items-center justify-center" title="Remove item"><svg className="w-6 h-6 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
 </div>
 </div>
 <div className="text-3xl font-black text-right sm:ml-auto text-[#900606] tracking-tight">
 ₹{(item.price * item.quantity).toLocaleString()}
 </div>
 </div>
 ))}
 </div>

 {/* Order Summary */}
 <div className="w-full h-full">
 <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-xl sticky top-32">
 <h2 className="text-2xl font-black mb-8 text-[#900606]">Order Summary</h2>
 
 <div className="space-y-4 text-neutral-600 border-b border-neutral-200 pb-6 mb-6">
 <div className="flex justify-between">
 <span>Subtotal</span>
 <span className="font-medium text-[#900606]">₹{cartTotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between">
 <span>Shipping</span>
 <span className="font-medium text-green-400">Free</span>
 </div>
 <div className="flex justify-between">
 <span>Taxes</span>
 <span className="font-medium text-[#900606]">Calculated at checkout</span>
 </div>
 </div>
 
 <div className="flex justify-between items-center mb-8">
 <span className="text-xl font-bold text-[#900606]">Total</span>
 <span className="text-4xl font-black text-[#900606] tracking-tight">₹{cartTotal.toLocaleString()}</span>
 </div>
 
 <button 
 onClick={() => router.push('/checkout')}
 className="w-full py-5 bg-[#900606] text-white rounded-2xl font-black text-xl hover:bg-[#700505] transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#900606]/30 hover:-translate-y-1"
 >
 Proceed to Checkout
 </button>
 
 <div className="mt-8 flex items-center justify-center gap-2 text-green-600 text-sm font-bold bg-green-50 py-3 rounded-xl">
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





