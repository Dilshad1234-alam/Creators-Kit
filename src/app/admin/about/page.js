import AboutManager from '@/components/admin/AboutManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us Management | CreatorsKit Admin',
  description: 'Manage live About Us page content, team members, timeline, and stats.',
};

export default function AdminAboutPage() {
  return (
    <div className="w-full">
      <AboutManager />
    </div>
  );
}

