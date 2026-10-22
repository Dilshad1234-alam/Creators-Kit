import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AuthCallbackClient from './AuthCallbackClient';

export const dynamic = 'force-dynamic';

export default async function AuthCallbackPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const redirectParam = resolvedParams?.redirect || '';
  const session = await getServerSession(authOptions);

  return (
    <AuthCallbackClient
      initialUser={session?.user || null}
      redirectParam={redirectParam}
    />
  );
}
