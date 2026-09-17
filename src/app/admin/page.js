'use client';

import { useSearchParams } from 'next/navigation';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductsManager from '@/components/admin/ProductsManager';
import OrdersManager from '@/components/admin/OrdersManager';
import ContentManager from '@/components/admin/ContentManager';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  return (
    <div className="w-full animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md text-white mb-2 capitalize">
          {tab === 'faq' ? 'FAQ & Support' : tab.replace('-', ' ')}
        </h1>
        <p className="text-zinc-400 text-lg">Manage your storefront data dynamically.</p>
      </header>

      <div className="w-full">
        {tab === 'dashboard' && <DashboardOverview />}
        {tab === 'products' && <ProductsManager />}
        {tab === 'orders' && <OrdersManager />}
        {tab === 'content' && <ContentManager tab="content" />}
        {tab === 'faq' && <ContentManager tab="faq" />}
        {tab === 'legal' && <ContentManager tab="legal" />}
        {tab === 'coupons' && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-10 backdrop-blur-xl text-center">
            <h2 className="text-2xl font-bold mb-2">Coupons Coming Soon</h2>
            <p className="text-zinc-400">This module is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}
