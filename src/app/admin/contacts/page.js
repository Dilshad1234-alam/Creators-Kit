import MessagesManager from '@/components/admin/MessagesManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Inquiries | CreatorsKit Admin',
  description: 'Manage customer contact messages and inquiries in real-time.',
};

export default function AdminContactsPage() {
  return (
    <div className="w-full">
      <MessagesManager />
    </div>
  );
}
