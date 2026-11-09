'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductsManager from '@/components/admin/ProductsManager';
import OrdersManager from '@/components/admin/OrdersManager';
import BlogsManager from '@/components/admin/BlogsManager';
import MessagesManager from '@/components/admin/MessagesManager';
import MasterclassesManager from '@/components/admin/MasterclassesManager';
import CustomersManager from '@/components/admin/CustomersManager';
import HomepageFeaturesManager from '@/components/admin/HomepageFeaturesManager';
import AboutManager from '@/components/admin/AboutManager';
import ContactManager from '@/components/admin/ContactManager';
import LiveSaleManager from '@/components/admin/LiveSaleManager';

const validTabs = [
  'overview',
  'dashboard',
  'analytics',
  'orders',
  'sale',
  'products',
  'bundles',
  'customers',
  'courses',
  'settings',
  'blogs',
  'messages',
  'contacts',
  'contact',
  'contact-page',
  'contact-content',
  'features',
  'homepagefeatures',
  'home',
  'about',
];

const navLabels = {
  overview: 'Overview',
  dashboard: 'Overview',
  orders: 'Orders',
  sale: 'Live Sale & Offers',
  products: 'Products',
  bundles: 'Products',
  customers: 'Customers',
  courses: 'Courses',
  analytics: 'Analytics',
  settings: 'Settings',
  blogs: 'Blogs',
  messages: 'Contacts',
  contacts: 'Contacts',
  contact: 'Contacts',
  'contact-page': 'Contact Page',
  'contact-content': 'Contact Page',
  features: 'Home',
  home: 'Home',
  about: 'About Us',
};

function SettingsManager() {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Workspace settings</h2>
        <p className="text-xs text-neutral-400 mt-1">Configure your store identity and currency preferences.</p>
      </div>

      <div className="space-y-4 text-xs font-semibold">
        <div>
          <label className="block text-neutral-700 mb-1">Store Name</label>
          <input
            type="text"
            defaultValue="CreatorsKit Store"
            className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
          />
        </div>

        <div>
          <label className="block text-neutral-700 mb-1">Support Email</label>
          <input
            type="email"
            defaultValue="support@creatorskit.com"
            className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
          />
        </div>

        <div>
          <label className="block text-neutral-700 mb-1">Currency</label>
          <select className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white">
            <option>INR (₹) - Indian Rupee</option>
            <option>USD ($) - US Dollar</option>
          </select>
        </div>

        <div className="pt-2">
          <button className="bg-[#900606] hover:bg-[#720404] text-white font-bold px-5 py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = (searchParams.get('tab') || 'overview').toLowerCase();
  const isInvalid = !validTabs.includes(rawTab);
  const tab = isInvalid ? 'overview' : rawTab;

  useEffect(() => {
    if (isInvalid) {
      router.replace('/admin?tab=overview');
    }
  }, [isInvalid, router]);

  const isOverview = tab === 'overview' || tab === 'dashboard' || tab === 'analytics';
  const isCustomHeader =
    isOverview ||
    tab === 'orders' ||
    tab === 'products' ||
    tab === 'bundles' ||
    tab === 'blogs' ||
    tab === 'messages' ||
    tab === 'contacts' ||
    tab === 'contact' ||
    tab === 'contact-page' ||
    tab === 'contact-content' ||
    tab === 'features' ||
    tab === 'homepagefeatures' ||
    tab === 'home' ||
    tab === 'about' ||
    tab === 'courses' ||
    tab === 'sale';
  const currentTabName = navLabels[tab] || (tab.charAt(0).toUpperCase() + tab.slice(1));

  return (
    <div className="w-full">
      {/* If not custom header, render standard section heading */}
      {!isCustomHeader && (
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-1 capitalize">
            {currentTabName}
          </h1>
          <p className="text-neutral-500 text-xs font-medium">
            Manage and monitor your store {currentTabName.toLowerCase()} settings and resources.
          </p>
        </header>
      )}

      {/* Main Tab Routing */}
      <div className="w-full">
        {isOverview && <DashboardOverview />}
        {(tab === 'products' || tab === 'bundles') && <ProductsManager />}
        {tab === 'orders' && <OrdersManager />}
        {tab === 'sale' && <LiveSaleManager />}
        {tab === 'customers' && <CustomersManager />}
        {tab === 'courses' && <MasterclassesManager />}
        {tab === 'settings' && <SettingsManager />}
        {tab === 'blogs' && <BlogsManager />}
        {(tab === 'messages' || tab === 'contacts' || tab === 'contact') && <MessagesManager />}
        {(tab === 'contact-page' || tab === 'contact-content') && <ContactManager />}
        {(tab === 'features' || tab === 'homepagefeatures' || tab === 'home') && <HomepageFeaturesManager />}
        {tab === 'about' && <AboutManager />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#900606] font-bold text-xs">Loading Workspace...</div>}>
      <AdminContent />
    </Suspense>
  );
}
