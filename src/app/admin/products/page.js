import ProductsManager from '@/components/admin/ProductsManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products | CreatorsKit Admin',
  description: 'Manage your store products in one place.',
};

export default function AdminProductsPage() {
  return (
    <div className="w-full">
      <ProductsManager />
    </div>
  );
}
