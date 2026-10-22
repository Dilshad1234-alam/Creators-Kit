'use client';

import { Suspense } from 'react';
import AuthContainer from '@/components/AuthContainer';

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[100svh] w-full flex items-center justify-center bg-neutral-950 text-white">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-700 border-t-[#FF1F2D] animate-spin" />
        </div>
      }
    >
      <AuthContainer initialMode="otp" />
    </Suspense>
  );
}
