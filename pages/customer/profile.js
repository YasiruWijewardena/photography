// pages/customer/profile.js

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CustomerProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('signOut:', signOut); // Debugging Line

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'customer') {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user.role !== 'customer') {
    return <p>Loading...</p>;
  }

  return (
    <div className="customer-profile">
      <h1>Hello, {session.user.username}</h1>
      <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
    </div>
  );
}
