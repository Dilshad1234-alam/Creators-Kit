import OrdersManager from '@/components/admin/OrdersManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders | CreatorsKit Admin',
  description: 'Manage your store orders in one place.',
};

export default function AdminOrdersPage() {
  return (
    <div className="w-full">
      <OrdersManager />
    </div>
  );
}
