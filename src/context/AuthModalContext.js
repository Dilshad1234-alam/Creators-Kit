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
    mode: 'register',
    redirectUrl: null,
    email: '',
  });

  const openAuthModal = useCallback(({ mode = 'register', redirectUrl = null, email = '' } = {}) => {
    setModalConfig({ mode, redirectUrl, email });
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Global window event listener so ANY component, button, or context can open the auth modal:
  // window.dispatchEvent(new CustomEvent('creatorskit-open-auth', { detail: { mode: 'register', redirectUrl: '/checkout' } }))
  useEffect(() => {
    const handleOpenEvent = (e) => {
      const detail = e.detail || {};
      openAuthModal({
        mode: detail.mode || 'register',
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
          initialMode={modalConfig.mode}
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

