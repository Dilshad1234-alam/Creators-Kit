import HomeManager from '@/components/admin/HomeManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Home Page Management | CreatorsKit Admin',
  description: 'Manage live Hero Banners and Shop by Category.',
};

export default function AdminHomePage() {
  return (
    <div className="w-full">
      <HomeManager />
    </div>
  );
}
