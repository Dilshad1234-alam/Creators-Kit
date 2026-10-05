'use client';
import { useState } from 'react';

const faqData = [
  {
    category: "Shipping & Delivery",
    items: [
      { q: "How long does shipping take?", a: "Standard shipping typically takes 3-5 business days depending on your location. We provide tracking information the moment your Creator Kit is dispatched from our warehouse." },
      { q: "Do you ship internationally?", a: "Currently, we offer nationwide shipping only. However, we are actively working on expanding our logistics to support international creators very soon!" },
      { q: "How can I track my order?", a: "You can track your order using the 'Track Order' link in our footer or by visiting our Tracking page. Simply enter your Order ID to see real-time updates." }
    ]
  },
  {
    category: "Product & Gear",
    items: [
      { q: "Is the Ring Light dimmable?", a: "Yes! The professional LED Ring Light features fully adjustable brightness controls and three color temperature modes (Warm, White, and Daylight) so you can get the perfect shot in any environment." },
      { q: "Can the tripod support heavy DSLR cameras?", a: "Absolutely. Our reinforced tripod is constructed with premium aluminum alloy and features a universal mount that securely supports both smartphones and heavy professional DSLR cameras." },
      { q: "Is the green screen easy to set up?", a: "Yes, our chroma key green screen is designed for instant setup. It features a collapsible frame that pops up in seconds and folds away neatly into its carrying case." }
    ]
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We offer a hassle-free 7-day money-back guarantee on all physical gear. To be eligible for a refund, items must be returned in their original packaging and in unused condition." },
      { q: "Are the digital masterclasses refundable?", a: "Due to the immediate access nature of digital goods, the educational masterclasses included in the bundle are strictly non-refundable once the purchase is complete." }
    ]
  },
  {
    category: "Payments & Security",
    items: [
      { q: "What payment methods do you accept?", a: "We securely process payments via all major Credit Cards, Debit Cards, Net Banking, UPI, and select digital wallets. All transactions are encrypted." },
      { q: "Is my payment information secure?", a: "Yes. We use industry-standard SSL encryption and trusted payment gateways. We never store your full credit card details on our servers." }
    ]
  }
];

function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-[#131C2E] transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left focus:outline-none focus:bg-neutral-50 dark:focus:bg-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      >
        <h3 className={`text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-[#900606]' : 'text-neutral-900 dark:text-white'}`}>
          {question}
        </h3>
        <span className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#900606]/10 text-[#900606]' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 sm:p-5 md:p-6 pt-0 text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter FAQs based on search query
  const filteredData = faqData.map(category => {
    const filteredItems = category.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, items: filteredItems };
  }).filter(category => category.items.length > 0);

  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#900606] dark:text-neutral-100 font-sans transition-colors duration-300 w-full overflow-hidden pb-16 md:pb-24 pt-32 md:pt-40">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-[#900606] tracking-tighter uppercase mb-6 leading-none">
            FAQ.
          </h1>
          <p className="text-lg md:text-xl font-bold text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Everything you need to know about the Creators Kit, shipping, returns, and getting your gear set up.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-12 sm:mb-16 max-w-2xl w-full mx-auto z-10">
          <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#131C2E] border border-neutral-200 dark:border-neutral-800 shadow-xl text-neutral-900 dark:text-white rounded-full pl-14 pr-6 py-4 md:py-5 focus:outline-none focus:ring-2 focus:ring-[#900606] transition-all text-lg"
          />
        </div>

        {/* FAQ Categories & Accordions */}
        <div className="space-y-12 animate-page-enter">
          {filteredData.length > 0 ? (
            filteredData.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-6 uppercase tracking-wider">{category.category}</h2>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-[#131C2E] rounded-3xl border border-neutral-200 dark:border-neutral-800">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No results found</h3>
              <p className="text-neutral-500 dark:text-neutral-400">We couldn't find any questions matching "{searchQuery}".</p>
              <button onClick={() => setSearchQuery('')} className="mt-4 text-[#900606] font-bold hover:underline">Clear search</button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
