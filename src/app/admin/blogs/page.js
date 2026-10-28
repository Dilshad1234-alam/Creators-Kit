import BlogsManager from '@/components/admin/BlogsManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blogs | CreatorsKit Admin',
  description: 'Manage creator stories and journal blog posts in real-time.',
};

export default function AdminBlogsPage() {
  return (
    <div className="w-full">
      <BlogsManager />
    </div>
  );
}
