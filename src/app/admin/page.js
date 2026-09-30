'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductsManager from '@/components/admin/ProductsManager';
import OrdersManager from '@/components/admin/OrdersManager';
import ContentManager from '@/components/admin/ContentManager';
import CouponsManager from '@/components/admin/CouponsManager';
import BlogsManager from '@/components/admin/BlogsManager';
import MessagesManager from '@/components/admin/MessagesManager';

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'content', label: 'Content' },
  { id: 'coupons', label: 'Coupons' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'messages', label: 'Messages' },
  { id: 'legal', label: 'Legal Pages' }
];

function AdminContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  const currentTabName = navItems.find(t => t.id === tab)?.label || tab;

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white mb-2 capitalize">
          {currentTabName} Overview
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold">
          Manage, monitor and control your Creator's Kit store analytics.
        </p>
      </header>

      <div className="w-full">
        {tab === 'dashboard' && <DashboardOverview />}
        {tab === 'content' && <ContentManager tab="content" />}
        {tab === 'products' && <ProductsManager />}
        {tab === 'orders' && <OrdersManager />}
        {tab === 'coupons' && <CouponsManager />}
        {tab === 'blogs' && <BlogsManager />}
        {tab === 'messages' && <MessagesManager />}
        {tab === 'legal' && <ContentManager tab="legal" />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#900606] font-bold">Loading Panel...</div>}>
      <AdminContent />
    </Suspense>
  );
}
