'use client';

import { useSearchParams } from 'next/navigation';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductsManager from '@/components/admin/ProductsManager';
import OrdersManager from '@/components/admin/OrdersManager';
import ContentManager from '@/components/admin/ContentManager';
import CouponsManager from '@/components/admin/CouponsManager';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  return (
    <div className="w-full animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md text-white mb-2 capitalize">
          {tab.replace('-', ' ')}
        </h1>
        <p className="text-zinc-400 text-lg">Manage your storefront data dynamically.</p>
      </header>

      <div className="w-full">
        {tab === 'dashboard' && <DashboardOverview />}
        {tab === 'content' && <ContentManager tab="content" />}
        {tab === 'products' && <ProductsManager />}
        {tab === 'orders' && <OrdersManager />}
        {tab === 'coupons' && <CouponsManager />}
        {tab === 'legal' && <ContentManager tab="legal" />}
      </div>
    </div>
  );
}
