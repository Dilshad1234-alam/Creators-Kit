'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter} from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

export default function ProductPage() {
 const router = useRouter();
 const { theme, mounted: themeMounted } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('creatorsKitTheme');
    setIsDarkMode(savedTheme === 'dark');

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);



 const [activeImageIndex, setActiveImageIndex] = useState(0);
 const [activeTab, setActiveTab] = useState('description');
 const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
 const [whatsInsideItems, setWhatsInsideItems] = useState([]);
 const [loading, setLoading] = useState(true);
 const [contentMap, setContentMap] = useState({});

 const [currentImage, setCurrentImage] = useState(0);
 const [openFaqIndex, setOpenFaqIndex] = useState(-1);

 useEffect(() => {
 async function fetchContent() {
 try {
 const res = await fetch('/api/content');
 const data = await res.json();
 if (data.success) {
 const map = {};
 data.data.forEach(item => {
 map[item.key] = item.value;
});
 setContentMap(map);
}
} catch (e) {
 console.error('Error fetching content:', e);
}
}
 fetchContent();
}, []);

 useEffect(() => {
 async function fetchData() {
 try {
 const [prodRes, whatsInsideRes] = await Promise.all([
 fetch('/api/products'),
 fetch('/api/whats-inside')
 ]);
 const prodData = await prodRes.json();
 const whatsInsideData = await whatsInsideRes.json();
 
 if (prodData.success && prodData.data.length > 0) {
 setProducts(prodData.data);
}
 if (whatsInsideData.success && whatsInsideData.data) {
 setWhatsInsideItems(whatsInsideData.data);
}
} catch (e) {
 console.error('Error fetching data:', e);
} finally {
 setLoading(false);
}
}
 fetchData();
}, []);

 // Separate products by category
 const bundleProducts = products.filter(p => !p.category || p.category === 'bundle' || p.category === 'both');
 const individualProducts = products.filter(p => !p.category || p.category === 'individual' || p.category === 'both');

 // Use the first bundle product for the Hero Section
 const mainBundle = bundleProducts[0] || {};
 
 let dynamicImages = [
 { src: '/kits 25 (1).jpg', bg: `${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} `, title: 'Loading...', description: 'Loading...'}
 ];

 if (mainBundle.images && mainBundle.images.length > 0) {
 dynamicImages = mainBundle.images.map(img => ({
 src: img.src || '/placeholder.png',
 bg: `${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} `,
 title: mainBundle.name || 'CREATOR BUNDLE',
 description: mainBundle.description
}));
} else if (mainBundle.image) {
 dynamicImages = [{
 src: mainBundle.image,
 bg: `${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} `,
 title: mainBundle.name || 'CREATOR BUNDLE',
 description: mainBundle.description
}];
}

 const product = {
 id: mainBundle._id || 'creators-kit-v1',
 name: mainBundle.name || contentMap['product_hero_heading'] || 'CREATOR BUNDLE',
 subheading: mainBundle.subheading || 'CREATOR BUNDLE - COMPLETE SETUP',
 price: mainBundle.price || 3999,
 originalPrice: mainBundle.originalPrice || 4999,
 description: mainBundle.description || contentMap['product_hero_desc'] || 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.',
 images: dynamicImages,
};

 const discountPercent = product.originalPrice > product.price 
 ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
 : 0;

 // Note: includedItems and partDetails have been removed to use dynamic mapping over products

 const faqs = [
 { question: 'Do I need to buy these parts separately?', answer: 'No! The Creators Kit is a single, complete bundle. You get all the hardware, courses, and physical resources in one box for one price.'},
 { question: 'Does the microphone work with my smartphone?', answer: 'Yes, our wireless microphone includes adapters for both USB-C and Lightning ports, making it plug-and-play compatible.'},
 { question: 'How do I access the Mastery Courses?', answer: 'The courses are pre-loaded onto a high-speed USB Pendrive included in the box. Simply plug it into your computer to watch them entirely offline, forever.'},
 { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee. If you are not completely satisfied, you can return the complete kit within 30 days for a full refund.'},
 ];

 const handleAddToCart = () => {
 if (!sessionStorage.getItem('userName')) {
 router.push('/login?redirect=/product');
 return;
}
 addToCart({ ...product, quantity: 1});
};

 const handleBuyNow = () => {
 if (!sessionStorage.getItem('userName')) {
 router.push('/login?redirect=/product');
 return;
}
 addToCart({ ...product, quantity: 1});
 router.push('/checkout');
};

 const handleAddIndividualToCart = (item) => {
 if (!sessionStorage.getItem('userName')) {
 router.push('/login?redirect=/product');
 return;
}
 addToCart({ id: item._id || item.id, name: item.name, price: item.price, quantity: 1, img: item.image});
};
  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
      </div>
    );
  }

  const currentImageData = product.images[currentImage] || product.images[0] || { src: '/placeholder.png', bg: 'bg-[#FDFBF7]', title: 'Product', description: '' };

 return (
 <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0B0F19] text-neutral-100' : 'bg-[#FDFBF7] text-neutral-900'} font-sans w-full pb-24 md:pb-0`}>
    <main className="flex-grow w-full">
 
 {/* Sticky Action Bar for Mobile (Hidden on Desktop) */}
 <div className={`fixed bottom-0 left-0 w-full ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} p-4 z-50 md:hidden flex gap-3`}>
 <div className="flex-1">
 <p className={`text-xs ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} font-bold uppercase tracking-wider`}>Total Price</p>
 <p className="text-xl font-black text-[#900606]">₹{product.price.toLocaleString()}</p>
 </div>
          <button onClick={handleBuyNow} className="flex-1 bg-[#900606] text-white rounded-full font-bold hover:bg-[#700505] transition-colors">
              Buy Now
          </button>
 </div>

 {/* 1. Main Product Overview Section */}
 <section className={`w-full ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} pt-24 md:pt-32 pb-12 min-h-[calc(100vh-5rem)] flex items-center justify-center border-b relative overflow-hidden`}>
 <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-#FF6B4A/10 via-transparent to-transparent opacity-70 pointer-events-none"></div>

 <div className="w-full px-4 md:px-8 lg:px-24 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 relative z-10">
 
 {/* Left: Product Gallery */}
 <div className="flex flex-col gap-4">
 {/* Main Image Viewport */}
 <div className={`w-full max-w-md mx-auto aspect-square rounded-[3rem] shadow-sm flex items-center justify-center transition-all duration-700 ease-in-out relative overflow-hidden ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} p-4 md:p-6 hover:border-[#900606] active:border-[#900606] transform hover:scale-[1.02] active:scale-[1.02] will-change-transform ${currentImageData.bg}`}>
 <Image
 src={currentImageData.src || '/placeholder.png'}
 alt="Product Image"
 fill
 className="object-contain p-1 sm:p-6 transform transition-all duration-500 ease-in-out hover:scale-110 active:scale-110 will-change-transform cursor-zoom-in"
 />
 </div>
 
 {/* Thumbnails */}
 <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar w-full justify-between items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 {product.images.map((img, idx) => (
 <button
 key={idx}
 onClick={() => setCurrentImage(idx)}
  className={`relative snap-center shrink-0 w-[18%] aspect-square rounded-xl md:rounded-2xl flex items-center justify-center border-2 transition-all duration-300 overflow-hidden ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} cursor-pointer ${
 currentImage === idx 
  ? 'border-[#900606] shadow-md scale-105 ring-2 ring-[#900606]/30' 
  : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105 hover:border-[#900606] hover:shadow-md'
}`}
 >
 <Image src={img.src || '/placeholder.png'} alt="Thumbnail" fill sizes="(max-width: 768px) 20vw, 10vw" className="object-contain p-2 " />
 </button>
 ))}
 </div>
 </div>

 {/* Right: Product Info & Pricing */}
 <div className="flex flex-col justify-center">
 
 <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-2 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-900'} uppercase`} style={{ fontFamily: 'Georgia, serif'}}>
 {currentImageData.title}
 </h1>
 <h2 className={`text-sm md:text-md lg:text-lg ${isDarkMode ? 'text-neutral-200' : 'text-neutral-500'} tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4`}>
 {product.subheading}
 </h2>
 
 <p className={`text-[17px] md:text-lg ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} mb-4 md:mb-6 leading-relaxed font-medium`}>
 {currentImageData.description}
 </p>

 {/* Pricing & Offer Area */}
 <div className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} p-6 md:p-8 rounded-3xl mb-6 relative overflow-hidden`}>
 {discountPercent > 0 && (
 <div className="absolute top-0 right-0 bg-[#900606] text-white text-xs font-bold px-4 py-1 rounded-bl-xl tracking-wider">
 SAVE {discountPercent}%
 </div>
 )}
 <div className="flex items-end gap-3 md:gap-4 mb-2">
 <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#900606]">₹{product.price.toLocaleString()}</span>
 <span className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} line-through mb-1`}>₹{product.originalPrice.toLocaleString()}</span>
 </div>
 <p className="text-xs sm:text-sm font-bold text-[#900606] flex items-center gap-2">
 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5l-2.5-4H14V5a1 1 0 00-1-1H3zM14 7h2.1l1.875 3H14V7z" /></svg>
 Free Standard Shipping Nationwide
 </p>
 </div>

 {/* CTAs */}
 <div className="flex flex-col sm:flex-row gap-4 mb-4">
 <button
 onClick={handleAddToCart}
 className={`hidden md:flex flex-1 py-5 px-8 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} border border-neutral-700 text-[#900606] rounded-full font-bold text-lg hover:border-[#900606] hover:text-[#900606] hover:${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} transition-colors items-center justify-center gap-3`}
 >
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
 Add to Cart
 </button>
 <button
 onClick={handleBuyNow}
 className="hidden md:flex flex-1 py-5 px-8 bg-[#900606] text-white rounded-full font-extrabold text-xl hover:bg-[#700505] transition-all hover:scale-105 items-center justify-center gap-2"
 >
 Buy Now
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </button>
 </div>

  {/* Secure Checkout Badges */}
    <div className={`grid grid-cols-2 gap-4 text-sm font-medium ${isDarkMode ? 'text-neutral-200' : 'text-neutral-500'}`}>
      <div className="flex items-center gap-2">
      <svg className={`w-5 h-5 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      Secure Encrypted Checkout
        </div>
          <div className="flex items-center gap-2">
            <svg className={`w-5 h-5 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            30-Day Guarantee
          </div>
        </div>
      </div>
    </div>
  </section>

 {/* 1.5. Individual Gear Purchase Section */}
  <section className={`w-full py-10 md:py-16 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} relative z-10 border-t`}>
      <div className="w-full px-6 md:px-12 lg:px-24 mx-auto text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#900606] mb-4">Need Just One Piece?</h2>
        <p className={`text-[15px] md:text-base ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} font-medium`}>Build your own setup by purchasing our premium gear individually.</p>
      </div>
 
    <div className="w-full px-4 md:px-8 lg:px-24 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
    {individualProducts.map((item) => (
          <div key={item._id || item.id} className={`group flex flex-col ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} rounded-[2rem] p-3 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
            {/* Image Container */}
            <div className="relative w-full aspect-[4/5] mb-4 bg-[#F9F6EE] rounded-[1.5rem] overflow-hidden">
              
              {/* Icons Top Right */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                  className={`w-8 h-8 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} rounded-full flex items-center justify-center hover:shadow-lg transition-all hover:scale-110 ${isInWishlist(item._id || item.id) ? 'text-red-500' : 'text-neutral-200 dark:text-neutral-500 hover:text-red-500'}`}
                >
                  <svg className="w-4 h-4" fill={isInWishlist(item._id || item.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
                <button className={`w-8 h-8 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} rounded-full flex items-center justify-center text-neutral-200 dark:text-neutral-500 hover:text-[#900606] hover:shadow-lg transition-all hover:scale-110`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
              </div>
              
              <Image 
                src={item.image || '/placeholder.png'} 
                alt={item.name} 
                fill 
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
              />
            </div>
            
            {/* Text Content & Button */}
            <div className="px-2 pb-2 flex flex-col flex-grow">
              <div className="w-full flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-neutral-200 dark:text-neutral-500 font-bold uppercase tracking-widest">Gear</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#900606]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className={`text-[11px] font-black ${isDarkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>4.9</span>
                </div>
              </div>
              
              <h3 className="font-extrabold text-[#900606] mb-2 text-[15px] md:text-base text-left line-clamp-1">{item.name}</h3>
              
            <div className="flex items-center gap-2 text-left mb-4">
              <span className="font-black text-[#900606] text-lg">₹{item.price}</span>
              <span className="text-xs text-neutral-200 dark:text-neutral-500 line-through font-bold">₹{Math.round(item.price * 1.1)}</span>
            </div>
              
            <button 
              onClick={(e) => { e.stopPropagation(); handleAddIndividualToCart(item); }}
              className={`mt-auto w-full py-2.5 ${isDarkMode ? 'bg-[#131C2E]' : 'bg-neutral-100'} hover:bg-[#900606] ${isDarkMode ? 'text-neutral-200' : 'text-neutral-900'} hover:text-white rounded-xl font-bold transition-all duration-300 text-xs md:text-sm flex items-center justify-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Add to Cart
            </button>
          </div>
        </div>
    ))}
    </div>
 </section>

  {/* 2. Flash Sale Promotional Banner */}
  <section className={`w-full py-12 md:py-20 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} border-t`}>
    <div className="w-full px-4 md:px-8 lg:px-24 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
      {/* Left: Twin Images Pair 1 */}
      <div className="grid grid-cols-2 gap-4 h-full relative">
        <div className={`relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-[3rem] overflow-hidden ${isDarkMode ? 'bg-[#131C2E]' : 'bg-neutral-100'} group cursor-pointer z-10`}>
          <Image src={individualProducts[0]?.image || '/placeholder.png'} alt="Setup Display 1" fill className="object-contain group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className={`relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-[3rem] overflow-hidden ${isDarkMode ? 'bg-[#131C2E]' : 'bg-neutral-100'} group cursor-pointer z-0 md:mt-16`}>
          <Image src={individualProducts[1]?.image || '/placeholder.png'} alt="Setup Display 2" fill className="object-contain group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Right: Twin Images Pair 2 */}
      <div className="grid grid-cols-2 gap-4 h-full relative">
        <div className={`relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-[3rem] overflow-hidden ${isDarkMode ? 'bg-[#131C2E]' : 'bg-neutral-100'} group cursor-pointer z-10`}>
          <Image src={individualProducts[2]?.image || '/placeholder.png'} alt="Setup Display 3" fill className="object-contain group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className={`relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-[3rem] overflow-hidden ${isDarkMode ? 'bg-[#131C2E]' : 'bg-neutral-100'} group cursor-pointer z-0 md:mt-16`}>
          <Image src={individualProducts[3]?.image || '/placeholder.png'} alt="Setup Display 4" fill className="object-contain group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>
      
    </div>
  </section>



 {/* 4. Details Tabs (Shipping/Policies) & FAQ */}
 <section className={`w-full py-12 md:py-24 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} border-t`}>
 <div className="w-full px-4 md:px-8 lg:px-24 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-24">
 
 {/* Policies */}
 <div>
 <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 tracking-tight text-[#900606]">Policies & Guarantees</h2>
 
 <div className="space-y-6 md:space-y-8">
 <div className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} p-6 md:p-8 rounded-3xl`}>
 <div className="flex items-center gap-4 mb-4">
 <div className="w-10 h-10 md:w-12 md:h-12 bg-[#900606]/10 rounded-2xl flex items-center justify-center text-[#900606]">
 <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5l-2.5-4H14V5a1 1 0 00-1-1H3zM14 7h2.1l1.875 3H14V7z" /></svg>
 </div>
 <h3 className="text-lg md:text-xl font-bold text-[#900606]">Fast & Free Shipping</h3>
 </div>
 <p className={`text-[15px] md:text-base ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} font-medium leading-relaxed`}>We process all orders within 24 hours. Standard delivery takes 3-5 business days nationwide absolutely free.</p>
 </div>
 
 <div className={`${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} p-6 md:p-8 rounded-3xl`}>
 <div className="flex items-center gap-4 mb-4">
 <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
 <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
 </div>
 <h3 className="text-lg md:text-xl font-bold text-[#900606]">30-Day Guarantee</h3>
 </div>
 <p className={`text-[15px] md:text-base ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} font-medium leading-relaxed`}>If you're not completely satisfied with the kit, simply return it within 30 days for a full, no-questions-asked refund.</p>
 </div>
 </div>
 </div>

 {/* FAQ Accordion */}
 <div>
 <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 tracking-tight text-[#900606]">Product FAQ</h2>
 <div className="space-y-4">
 {faqs.map((faq, index) => (
 <div key={index} className={`border ${openFaqIndex === index ? 'border-[#900606]' : ' '} rounded-[1.5rem] overflow-hidden ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-[#FDFBF7]'} transition-colors duration-300`}>
 <button
 className={`w-full px-5 py-4 md:px-8 md:py-6 text-left flex justify-between items-center hover:${isDarkMode ? 'bg-[#131C2E]' : 'bg-neutral-100'} transition-colors`}
 onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
 >
 <span className="font-bold text-[17px] md:text-lg text-[#900606] pr-4">{faq.question}</span>
 <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${openFaqIndex === index ? 'bg-[#900606]/20 text-[#900606]' : `${isDarkMode ? 'bg-[#131C2E]' : 'bg-neutral-100'} ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'}`}`}>
 <svg className={`w-4 h-4 md:w-5 md:h-5 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </div>
 </button>
 <div className={`px-5 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 pb-4 md:pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
 <p className={`text-[15px] md:text-base ${isDarkMode ? 'text-neutral-200' : 'text-neutral-600'} font-medium leading-relaxed`}>{faq.answer}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>
 </section>

 </main>
 </div>
 );
}
