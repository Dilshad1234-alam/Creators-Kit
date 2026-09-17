'use client';

import { useState } from 'react';

const faqs = [
  {
    question: "What exactly is included in the Creators Kit bundle?",
    answer: "The bundle includes a 10-inch LED Ring Light, an adjustable aluminum stand, a wireless noise-canceling microphone, a flexible smartphone/camera tripod, a chroma key green curtain with clamps, a physical USB pendrive containing all our Mastery Courses, and printed masterclass workbooks."
  },
  {
    question: "Are the Mastery Courses really free?",
    answer: "Yes! The Instagram Mastery, YouTube Mastery, and Filmora Mastery courses are 100% included with your purchase of the Creators Kit. You'll receive them pre-loaded on the physical USB pendrive for lifetime, offline access."
  },
  {
    question: "Does the microphone work with my smartphone?",
    answer: "Yes, our wireless microphone includes adapters for both USB-C and Lightning ports, making it plug-and-play compatible with modern iPhones and Android devices."
  },
  {
    question: "How long does shipping take?",
    answer: "We offer fast and free nationwide delivery. Orders are typically processed within 24 hours and delivered within 3-5 business days."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee. If you are not completely satisfied with your Creators Kit, you can return it within 30 days of receiving it for a full refund, no questions asked."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-zinc-100">Frequently Asked Questions</h1>
          <p className="text-xl text-zinc-400">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200 bg-zinc-900"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-bold text-lg text-zinc-100">{faq.question}</span>
                <svg 
                  className={`w-6 h-6 text-[#FF3B14] transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 py-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h3 className="text-xl font-bold mb-2 text-zinc-100">Still have questions?</h3>
          <p className="text-zinc-400 mb-6">Our support team is ready to help you out.</p>
          <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#FF3B14] hover:bg-[#E01900] transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
