"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';

export default function AccountPage() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeTab, setActiveTab] = useState('user-info');
  const [formData, setFormData] = useState({
    name: 'Md Dilshad',
    fullName: 'Md Dilshad',
    email: 'dilshad@creatorskit.com',
    phone: '',
    location: '',
    postalCode: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('creatorsKitUserInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('creatorsKitUserInfo', JSON.stringify(formData));
  };

  const navItems = [
    { 
      id: 'user-info', 
      label: 'User info', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> 
    },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> 
    },

    { 
      id: 'setting', 
      label: 'Setting', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> 
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'user-info':
        return (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Profile Header section */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-4">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[6px] border-white shadow-md bg-neutral-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/placeholder.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
                {/* Edit badge */}
                <button className="absolute bottom-0 right-0 bg-[#900606] text-white p-2.5 rounded-full shadow-lg hover:bg-[#700505] transition-transform hover:scale-110 border-2 border-white">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-100">Md Dilshad</h2>
              <p className="text-neutral-500 font-medium mt-1">dilshad@creatorskit.com</p>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 mb-10"></div>

            {/* Form Grid */}
            <form className="space-y-8" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-neutral-800 dark:text-neutral-300">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#900606]/50 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 transition-colors font-medium text-neutral-800" 
                  />
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-neutral-800 dark:text-neutral-300">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#900606]/50 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 transition-colors font-medium text-neutral-800" 
                  />
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-neutral-800 dark:text-neutral-300">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#900606]/50 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 transition-colors font-medium text-neutral-800" 
                  />
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-neutral-800 dark:text-neutral-300">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000" 
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#900606]/50 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 transition-colors font-medium text-neutral-800" 
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-neutral-800 dark:text-neutral-300">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="City, Country" 
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#900606]/50 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 transition-colors font-medium text-neutral-800" 
                  />
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-neutral-800 dark:text-neutral-300">Postal Code</label>
                  <input 
                    type="text" 
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    placeholder="Zip / Postal Code" 
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#900606]/50 focus:border-[#900606] bg-neutral-50/50 hover:bg-neutral-50 dark:bg-neutral-800/50 dark:border-neutral-700 transition-colors font-medium text-neutral-800" 
                  />
                </div>
                
              </div>
              
              <div className="pt-8 flex justify-end md:justify-start">
                <button 
                  type="submit" 
                  className="px-10 py-4 bg-[#900606] text-white rounded-full font-bold hover:bg-[#700505] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );
      case 'favorites':
        return (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white capitalize">Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { name: 'Professional LED Ring Light', price: '₹3999', img: '/kits-26-1.jpg' },
                { name: 'Flexible Desk Tripod', price: '₹999', img: '/kits-27-1.jpg' }
              ].map((item, idx) => (
                <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col gap-4 group hover:shadow-md transition-shadow">
                  <div className="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 dark:text-white text-lg leading-tight">{item.name}</h3>
                    <p className="text-[#900606] font-bold mt-1.5">{item.price}</p>
                  </div>
                  <div className="flex gap-2 mt-auto pt-2">
                    <button className="flex-1 py-2.5 bg-[#900606] text-white rounded-xl font-bold hover:bg-[#700505] transition-colors text-sm shadow-sm hover:shadow-md">Move to Cart</button>
                    <button className="px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'setting':
        return (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white">Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <div>
                  <h4 className="font-bold text-neutral-800 dark:text-white">Email Notifications</h4>
                  <p className="text-sm text-neutral-500 mt-1">Receive order updates and offers</p>
                </div>
                <div className="w-12 h-6 bg-[#900606] rounded-full relative cursor-pointer shadow-inner">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <div>
                  <h4 className="font-bold text-neutral-800 dark:text-white">Dark Mode</h4>
                  <p className="text-sm text-neutral-500 mt-1">Toggle dark theme appearance</p>
                </div>
                <div 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#900606]' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
                <h3 className="font-bold text-neutral-800 dark:text-white mb-4 text-lg">Security</h3>
                <button className="px-6 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white">Notifications</h2>
            <div className="space-y-4">
              {[
                { title: 'Order Delivered', desc: 'Your Creator Bundle Pro has been delivered.', time: '2 hours ago', unread: true },
                { title: 'Special Offer', desc: 'Get 20% off on all lighting equipment this week.', time: '1 day ago', unread: false },
                { title: 'Security Alert', desc: 'New login detected from Chrome on Windows.', time: '3 days ago', unread: false }
              ].map((notif, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${notif.unread ? 'border-[#900606]/30 bg-[#900606]/5' : 'border-neutral-200 dark:border-neutral-800 bg-transparent'} flex gap-4 transition-all hover:shadow-sm`}>
                  <div className="mt-1 shrink-0">
                    {notif.unread ? (
                      <div className="w-3 h-3 bg-[#900606] rounded-full shadow-sm"></div>
                    ) : (
                      <div className="w-3 h-3 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold ${notif.unread ? 'text-[#900606] dark:text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>{notif.title}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 mb-2">{notif.desc}</p>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-background pt-32 pb-16 md:pb-24">
      <div className="w-full px-4 md:px-8 lg:px-12">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#900606] dark:text-white tracking-tight">
            Account Details
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Sidebar Menu */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-[1rem] font-bold transition-all text-left ${
                    activeTab === item.id 
                    ? 'bg-[#900606] text-white shadow-md' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-white hover:shadow-sm dark:hover:bg-neutral-800'
                  }`}
                >
                  <span className={`${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
              
              <div className="my-4 border-t border-neutral-200 dark:border-neutral-800 px-4"></div>
              
              <button
                onClick={() => alert('Logging out...')}
                className="flex items-center gap-4 px-5 py-4 rounded-[1rem] font-bold transition-all text-left text-red-500 hover:bg-red-50 hover:shadow-sm dark:hover:bg-red-950/20"
              >
                <span className="opacity-70 group-hover:opacity-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </span>
                Log out
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:flex-1">
            {renderContent()}
          </div>
          
        </div>
      </div>
    </div>
  );
}
