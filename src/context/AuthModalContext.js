'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthModal from '@/components/AuthModal';

const AuthModalContext = createContext({
  isOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    redirectUrl: null,
    email: '',
  });

  const openAuthModal = useCallback(({ redirectUrl = null, email = '' } = {}) => {
    setModalConfig({ redirectUrl, email });
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Global window event listener so any button or cart action can trigger the login modal:
  // window.dispatchEvent(new CustomEvent('creatorskit-open-auth', { detail: { redirectUrl: '/checkout' } }))
  useEffect(() => {
    const handleOpenEvent = (e) => {
      const detail = e.detail || {};
      openAuthModal({
        redirectUrl: detail.redirectUrl || null,
        email: detail.email || '',
      });
    };

    window.addEventListener('creatorskit-open-auth', handleOpenEvent);
    return () => window.removeEventListener('creatorskit-open-auth', handleOpenEvent);
  }, [openAuthModal]);

  return (
    <AuthModalContext.Provider value={{ isOpen, openAuthModal, closeAuthModal }}>
      {children}
      {isOpen && (
        <AuthModal
          isOpen={isOpen}
          onClose={closeAuthModal}
          redirectUrl={modalConfig.redirectUrl}
          initialEmail={modalConfig.email}
        />
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}
