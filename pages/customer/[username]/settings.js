// pages/customer/[username]/settings.js

import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../../components/CustomerLayout';
import Settings from '../../../components/CustomerSettings';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      router.replace('/login');
    } else if (session.user.role !== 'customer' || session.user.username !== username) {
      router.replace('/login'); // Unauthorized access
    }
  }, [session, status, router, username]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <CustomerLayout username={username}>
      <Settings username={username} />
    </CustomerLayout>
  );
}

// Optional: Server-side rendering to protect the route
export async function getServerSideProps(context) {
  const session = await getSession(context);

  const { username } = context.params;

  if (!session || session.user.role !== 'customer' || session.user.username !== username) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}