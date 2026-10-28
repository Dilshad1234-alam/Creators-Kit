import HomepageFeaturesManager from '@/components/admin/HomepageFeaturesManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Homepage Features | CreatorsKit Admin',
  description: 'Manage featured kit components and creator gear highlights.',
};

export default function AdminHomepageFeaturesPage() {
  return (
    <div className="w-full">
      <HomepageFeaturesManager />
    </div>
  );
}
