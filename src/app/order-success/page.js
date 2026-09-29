'use client';

import { useEffect, useState} from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export default function OrderSuccessPage({ searchParams}) {
 const [resolvedParams, setResolvedParams] = useState(null);
 const [isReady, setIsReady] = useState(false);

 useEffect(() => {
 if (searchParams && typeof searchParams.then === 'function') {
 searchParams.then((params) => {
 setResolvedParams(params);
 setIsReady(true);
});
} else {
 setResolvedParams(searchParams);
 setIsReady(true);
}
}, [searchParams]);

 if (!isReady) {
 return (
 <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
 <div className="flex flex-col items-center justify-center min-h-[60vh]">
 <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-green-500 animate-spin mb-4"></div>
 <p className="text-neutral-600 font-medium tracking-wide">Loading...</p>
 </div>
 </div>
 );
}

 const orderId = resolvedParams?.orderId || null;

 return (
 <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
 {/* Background Glow */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#900606]/5 rounded-full blur-[150px] pointer-events-none"></div>

 <OrderSuccessClient orderId={orderId} />
 </div>
 );
}
