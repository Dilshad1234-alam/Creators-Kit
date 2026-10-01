"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

function AccountOrdersTab({ email }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/user/orders?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.error || 'Failed to load orders.');
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [email]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-pulse flex justify-center items-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-16 text-center shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col items-center">
        <span className="text-6xl mb-6">🛍️</span>
        <h2 className="text-2xl font-bold mb-3 text-[#900606]">No orders placed yet</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">Looks like you haven't bought anything from us yet. Explore our gear and build your ultimate setup!</p>
        <Link href="/product" className="px-8 py-3 bg-[#900606] text-white rounded-xl font-bold hover:bg-[#700505] transition-colors shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => {
          const statusStyles = {
            Confirmed: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            Packed: 'bg-blue-50 text-blue-700 border-blue-200',
            Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'Out for Delivery': 'bg-orange-50 text-orange-700 border-orange-200',
            Delivered: 'bg-green-50 text-green-700 border-green-200',
            Cancelled: 'bg-red-50 text-red-700 border-red-200',
          };
          const statusClass = statusStyles[order.status] || 'bg-neutral-50 text-neutral-600 border-neutral-200';

          return (
            <div key={order._id} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">Order Placed</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">Total</p>
                    <p className="font-semibold text-neutral-800 dark:text-white">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">Order #</p>
                    <p className="font-mono font-bold text-[#900606]">{order._id}</p>
                  </div>
                  {order.deliveryOtp && (
                    <div>
                      <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">Delivery PIN</p>
                      <p className="font-bold text-blue-600 tracking-widest">{order.deliveryOtp}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusClass} flex-1 sm:flex-none text-center`}>
                    {order.status}
                  </span>
                  <Link 
                    href={`/order-success?orderId=${order._id}`}
                    className="px-4 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-full text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-1 sm:flex-none text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#900606] dark:text-red-400 line-clamp-1 text-sm">{item.name}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                        <p className="font-bold text-neutral-800 dark:text-white mt-1 text-sm">₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccountSettingsTab({ email, theme, toggleTheme }) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwData, setPwData] = useState({ current: '', newPw: '' });
  const [pwStatus, setPwStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('creatorsKitEmailNotifs');
    if (saved !== null) setEmailNotifs(saved === 'true');
  }, []);

  const toggleNotifs = () => {
    const newVal = !emailNotifs;
    setEmailNotifs(newVal);
    localStorage.setItem('creatorsKitEmailNotifs', newVal.toString());
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwStatus('Changing...');
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword: pwData.current, newPassword: pwData.newPw })
      });
      const data = await res.json();
      if (data.success) {
        setPwStatus('Password updated successfully!');
        setPwData({ current: '', newPw: '' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPwStatus(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPwStatus('An error occurred');
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white">Settings</h2>
      
      {showPasswordModal && (
        <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm z-10 flex items-center justify-center p-8 rounded-3xl">
          <form onSubmit={handlePasswordChange} className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-neutral-200 dark:border-neutral-700 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-4 text-neutral-800 dark:text-white">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Current Password</label>
                <input type="password" required value={pwData.current} onChange={e => setPwData({...pwData, current: e.target.value})} className="w-full px-4 py-2 mt-1 rounded-xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 focus:outline-none focus:border-[#900606]" />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">New Password</label>
                <input type="password" required value={pwData.newPw} onChange={e => setPwData({...pwData, newPw: e.target.value})} className="w-full px-4 py-2 mt-1 rounded-xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 focus:outline-none focus:border-[#900606]" />
              </div>
              {pwStatus && <p className={`text-sm font-semibold ${pwStatus.includes('success') ? 'text-green-600' : 'text-[#900606]'}`}>{pwStatus}</p>}
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => { setShowPasswordModal(false); setPwStatus(''); }} className="flex-1 py-2 font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 font-bold text-white bg-[#900606] hover:bg-[#700505] rounded-xl transition-colors">Update</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <div>
            <h4 className="font-bold text-neutral-800 dark:text-white">Email Notifications</h4>
            <p className="text-sm text-neutral-500 mt-1">Receive order updates and offers</p>
          </div>
          <div onClick={toggleNotifs} className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${emailNotifs ? 'bg-[#900606]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-300 ${emailNotifs ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <div>
            <h4 className="font-bold text-neutral-800 dark:text-white">Dark Mode</h4>
            <p className="text-sm text-neutral-500 mt-1">Toggle dark theme appearance</p>
          </div>
          <div onClick={toggleTheme} className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#900606]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
          </div>
        </div>
        <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
          <h3 className="font-bold text-neutral-800 dark:text-white mb-4 text-lg">Security</h3>
          <button onClick={() => setShowPasswordModal(true)} className="px-6 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl font-bold text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountNotificationsTab({ email }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }
    const fetchNotifs = async () => {
      try {
        const res = await fetch(`/api/user/notifications?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [email]);

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    let interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " secs ago";
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-8 text-neutral-800 dark:text-white">Notifications</h2>
      {loading ? (
        <div className="flex justify-center p-8"><div className="w-8 h-8 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div></div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-400 dark:text-neutral-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2">You're all caught up!</h3>
          <p className="text-neutral-500 max-w-sm">When you place orders or receive exclusive offers, your notifications will appear right here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif._id} className={`p-5 rounded-2xl border ${notif.unread ? 'border-[#900606]/30 bg-[#900606]/5' : 'border-neutral-200 dark:border-neutral-800 bg-transparent'} flex gap-4 transition-all hover:shadow-sm`}>
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
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{timeAgo(notif.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountContent() {
  const { theme, toggleTheme, mounted } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const validTabs = ['user-info', 'orders', 'setting', 'notifications'];
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(validTabs.includes(tabParam) ? tabParam : 'user-info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    postalCode: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Get registration data from session
      const userName = sessionStorage.getItem('userName') || '';
      const userEmail = sessionStorage.getItem('userEmail') || '';
      
      let newFormData = {
        name: userName,
        email: userEmail,
        phone: '',
        location: '',
        postalCode: '',
        profileImage: ''
      };

      const savedData = localStorage.getItem('creatorsKitUserInfo');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Apply saved name/email along with other fields so user edits persist across refreshes
        newFormData = { 
          ...newFormData, 
          name: parsedData.name || newFormData.name,
          email: parsedData.email || newFormData.email,
          phone: parsedData.phone || newFormData.phone,
          location: parsedData.location || newFormData.location,
          postalCode: parsedData.postalCode || newFormData.postalCode,
          profileImage: parsedData.profileImage || newFormData.profileImage
        };
      }

      // 2. Fetch latest order to sync shipping/checkout details
      if (userEmail) {
        try {
          const res = await fetch(`/api/user/orders?email=${encodeURIComponent(userEmail)}`);
          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data && result.data.length > 0) {
              const latestOrder = result.data[0];
              const c = latestOrder.customer || {};
              newFormData.phone = c.phone || newFormData.phone;
              newFormData.location = c.address ? `${c.address}${c.city ? ', ' + c.city : ''}${c.state ? ', ' + c.state : ''}` : newFormData.location;
              newFormData.postalCode = c.zipCode || newFormData.postalCode;
            }
          }
        } catch (err) {
          console.error('Error fetching user orders for profile sync:', err);
        }
      }

      setFormData(newFormData);
    };

    fetchUserData();
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.replace(`${pathname}?tab=${tabId}`, { scroll: false });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('creatorsKitUserInfo', JSON.stringify(formData));
    sessionStorage.setItem('userEmail', formData.email);
    sessionStorage.setItem('userName', formData.name);
    // Optional alert to let the user know it was saved
    alert('Profile saved successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const updated = { ...prev, profileImage: reader.result };
          localStorage.setItem('creatorsKitUserInfo', JSON.stringify(updated));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const navItems = [
    { 
      id: 'user-info', 
      label: 'User', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> 
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
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
                  <img src={formData.profileImage || "/placeholder.png"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                {/* Edit badge */}
                <label className="absolute bottom-0 right-0 bg-[#900606] text-white p-2.5 rounded-full shadow-lg hover:bg-[#700505] transition-transform hover:scale-110 border-2 border-white cursor-pointer">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-100">{formData.name || 'User'}</h2>
              <p className="text-neutral-500 font-medium mt-1">{formData.email || 'Email not available'}</p>
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
      case 'orders':
        return <AccountOrdersTab email={formData.email} />;
      case 'setting':
        return <AccountSettingsTab email={formData.email} theme={theme} toggleTheme={toggleTheme} />;
      case 'notifications':
        return <AccountNotificationsTab email={formData.email} />;
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
                  onClick={() => handleTabChange(item.id)}
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

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-background pt-32 pb-16 md:pb-24 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
