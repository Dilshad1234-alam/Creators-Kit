import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import Link from 'next/link';

const popularBundles = [
  {
    id: 'basic-creator-kit',
    name: 'Basic Creator Kit',
    tag: 'Best Seller',
    rating: '4.9/5 (3,150 Ratings)',
    price: '₹1,999',
    oldPrice: '₹2,999',
    discount: '28% OFF',
    image: '/pro.png',
    features: [
      'Ring Light 18"',
      'Tripod Stand',
      'Microphone (Basic)',
      'Mobile Holder',
      'Carry Bag',
    ],
  },
  {
    id: 'pro-creator-kit',
    name: 'Pro Creator Kit',
    tag: 'Most Popular',
    rating: '5.0/5 (2,800 Ratings)',
    price: '₹2,999',
    oldPrice: '₹3,999',
    discount: '33% OFF',
    image: '/pro1.png',
    features: [
      'Softbox Light (2pcs)',
      'Heavy Duty Stand',
      'Condenser Mic',
      'Green Screen (9x6ft)',
      'Professional Carry Bag',
    ],
  },
  {
    id: 'ultimate-creator-kit',
    name: 'Ultimate Creator Kit',
    tag: 'New Arrival',
    rating: '5.0/5 (1,950 Ratings)',
    price: '₹3,999',
    oldPrice: '₹4,999',
    discount: '32% OFF',
    image: '/pro2.png',
    features: [
      '4K Professional Cam',
      'LED RGB Panels (2pcs)',
      'Boom Mic System',
      'Motorized Slider',
      'All-in-One Travel Case',
    ],
  },
];

export default function PopularBundlesSection() {
  return (
    <section className="w-full pt-8 pb-5 bg-[#FBFBF7] overflow-hidden">
      <div className="w-full max-w-[1750px] mx-auto px-4 md:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
            Popular <span className="text-[#900606] whitespace-nowrap">Creators Bundles</span>
          </h2>
          <p className="text-neutral-500 text-sm md:text-base font-normal max-w-xl">
            Everything you need to build a visually demanding, high-retention podcast or streaming studio.
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {popularBundles.map((bundle) => (
            <div key={bundle.id} className="bg-white border border-neutral-200 shadow-sm rounded-[1rem] overflow-hidden flex flex-col ">
              
              {/* Image Container edge-to-edge at the top */}
              <div className="relative w-full h-62 sm:h-70 md:h-84 lg:h-88 bg-neutral-100 overflow-hidden">
                {bundle.tag === 'Most Popular' && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-[#900606] text-white text-xs font-extrabold tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-md">
                      {bundle.tag}
                    </span>
                  </div>
                )}
              
                {bundle.discount && (
                  <span className="absolute top-4 right-4 z-20 bg-[#900606] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {bundle.discount}
                  </span>
                )}
              
                <Image
                  src={getImageUrl(bundle.image)}
                  alt={bundle.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bundle Content with padding */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-bold text-[#111827] text-xl mb-3">
                  {bundle.name}
                </h3>

                {/* Pricing & Discount */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-bold text-3xl text-[#111827]">{bundle.price}</span>
                  <span className="text-sm text-neutral-400 font-medium line-through">MRP {bundle.oldPrice}</span>
                  <span className="ml-auto bg-[#900606]/10 text-[#900606] text-xs font-bold px-3 py-1 rounded-full">
                    {bundle.discount}
                  </span>
                </div>

                {/* Features List (Checkmarks) */}
                <ul className="space-y-3 mb-10 flex-grow">
                  {bundle.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-neutral-600 text-sm font-medium">
                      <span className="text-[#900606] mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* View Details Button with Slide-Up Hover Effect */}
                <Link 
                  href={`/bundle/${bundle.id}`}
                  className="relative w-full py-4 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center text-center block"
                >
                  <span className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0 bg-[#900606]"></span>
                  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300">
                    View Details
                  </span>
                </Link>

              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}