import MasterclassesManager from '@/components/admin/MasterclassesManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Courses & Masterclasses Management | CreatorsKit Admin',
  description: 'Manage live Masterclasses, video curriculum, modules, and lessons.',
};

export default function AdminCoursesPage() {
  return (
    <div className="w-full">
      <MasterclassesManager />
    </div>
  );
}
