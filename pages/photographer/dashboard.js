// pages/photographer/dashboard.js
import { getSession, useSession } from 'next-auth/react';
import PhotographerLayout from '../../components/PhotographerLayout';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Photographer Dashboard</h1>
      <p>Welcome {session?.user?.username}, manage your albums and settings.</p>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <PhotographerLayout>{page}</PhotographerLayout>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user.role !== 'photographer') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    };
  }
  return { props: {} };
}
