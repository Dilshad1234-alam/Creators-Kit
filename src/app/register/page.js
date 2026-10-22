'use client';

import { Suspense } from 'react';
import AuthContainer from '@/components/AuthContainer';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-[100svh] bg-neutral-950" />}>
      <AuthContainer initialMode="register" />
    </Suspense>
  );
}
