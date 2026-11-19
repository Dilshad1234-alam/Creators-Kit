'use client';

import { useEffect, useRef, Suspense } from 'react';
import AuthContainer from '@/components/AuthContainer';

export default function AuthModal({
  isOpen = false,
  onClose = () => {},
  redirectUrl = null,
  initialEmail = '',
}) {
  const openTimeRef = useRef(0);
  const isBackdropPointerDownRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && Date.now() - openTimeRef.current >= 500) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropPointerDown = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    if (Date.now() - openTimeRef.current < 600) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    if (e.target === e.currentTarget) {
      isBackdropPointerDownRef.current = true;
    }
  };

  const handleBackdropClick = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    if (Date.now() - openTimeRef.current < 600) {
      isBackdropPointerDownRef.current = false;
      return;
    }
    if (e.target === e.currentTarget && isBackdropPointerDownRef.current) {
      isBackdropPointerDownRef.current = false;
      onClose();
    } else {
      isBackdropPointerDownRef.current = false;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onPointerDown={handleBackdropPointerDown}
      onClick={handleBackdropClick}
    >
      <Suspense fallback={null}>
        <AuthContainer
          isModal
          initialEmail={initialEmail}
          redirectOverride={redirectUrl || ''}
          onCloseOverride={onClose}
        />
      </Suspense>
    </div>
  );
}