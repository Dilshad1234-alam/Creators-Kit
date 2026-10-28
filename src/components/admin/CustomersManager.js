'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, Edit2, Shield, ShoppingBag, CheckCircle2, Clock } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    isPending: false,
    name: '',
    isDeleting: false,
  });

  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    role: 'user',
    location: '',
    password: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCustomers();
    fetchPendingUsers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('/api/pending-users');
      const json = await res.json();
      if (json.success) {
        setPendingUsers(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
    }
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData(initialFormState);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      role: customer.role || 'user',
      location: customer.location || '',
      password: '',
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const requestDelete = (id, name, isPending = false) => {
    setDeleteModal({
      isOpen: true,
      id,
      name,
      isPending,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const { id, isPending } = deleteModal;

    try {
      const endpoint = isPending ? `/api/pending-users/${id}` : `/api/users/${id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        if (isPending) {
          setPendingUsers((prev) => prev.filter((u) => u._id !== id));
        } else {
          setCustomers((prev) => prev.filter((u) => u._id !== id && u.id !== id));
        }
        setDeleteModal({ isOpen: false, id: null, isPending: false, name: '', isDeleting: false });
      } else {
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      const isEdit = !!editingCustomer;
      const url = isEdit ? `/api/users/${editingCustomer._id || editingCustomer.id}` : '/api/users';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = { ...formData };
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchCustomers();
      } else {
        setErrorMessage(json.error || 'Failed to save customer');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error occurred while saving customer');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.role?.toLowerCase().includes(q)
    );
  });

  const filteredPending = pendingUsers.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
  });

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Customer &amp; User Directory</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time MongoDB query of registered creators, spending, and pending OTP signups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            className="bg-[#900606] hover:bg-[#720404] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Verified Creators ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Signups ({pendingUsers.length})</span>
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-neutral-200 rounded-xl px-3.5 py-2 outline-none focus:border-[#900606]"
          />
        </div>
      </div>

      {/* Active Customers Table */}
      {activeTab === 'active' && (
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-bold">
              Fetching MongoDB Customers...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No customers found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Orders</th>
                  <th className="py-3 px-3">Total Spent</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {filteredCustomers.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-neutral-900">{c.name}</div>
                      <div className="text-[11px] text-neutral-400">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-500">
                      <div>{c.phone || 'No phone'}</div>
                      <div className="text-[10px] text-neutral-400">{c.location || 'India'}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          c.role === 'admin'
                            ? 'bg-red-50 text-[#900606] border border-red-200'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {c.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold">
                      {c.orders || 0} {c.orders === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-neutral-900">
                      {c.formattedSpent || '₹0'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          c.status === 'VIP'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => requestDelete(c._id || c.id, c.name, false)}
                          className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pending Registrations Table */}
      {activeTab === 'pending' && (
        <div className="overflow-x-auto">
          {filteredPending.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No pending unverified registrations.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Pending User</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">OTP Code</th>
                  <th className="py-3 px-3">Expires At</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {filteredPending.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-neutral-900">{p.name}</td>
                    <td className="py-3.5 px-3 text-neutral-600">{p.email}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-600">{p.otpCode}</td>
                    <td className="py-3.5 px-3 text-neutral-400 text-[11px]">
                      {p.otpExpire ? new Date(p.otpExpire).toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => requestDelete(p._id, p.name, true)}
                        className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">
                {editingCustomer ? 'Edit Customer' : 'Add New User'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@email.com"
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606] bg-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Location / City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Mumbai, India"
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  {editingCustomer ? 'Change Password (Leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingCustomer ? '••••••••' : 'Minimum 6 characters'}
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl font-bold hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#900606] hover:bg-[#720404] text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingCustomer ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, id: null, isPending: false, name: '', isDeleting: false })
        }
        onConfirm={handleConfirmDelete}
        title={deleteModal.isPending ? 'Delete Pending Registration?' : 'Delete Customer Account?'}
        message={
          deleteModal.name
            ? `Are you sure you want to delete ${deleteModal.isPending ? 'pending registration for' : 'customer'} "${deleteModal.name}"? This action cannot be undone.`
            : 'Are you sure you want to delete this item? This action cannot be undone.'
        }
        isDeleting={deleteModal.isDeleting}
      />

    </div>
  );
}
