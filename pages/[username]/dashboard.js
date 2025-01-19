// pages/[username]/dashboard.js
import { getSession, useSession } from 'next-auth/react';
import PhotographerLayout from '../../components/PhotographerLayout';
import '../../styles/public/dashboard.css';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className='photographer-dashboard-page'>
      <h1>Dashboard</h1>
      <p className='desc'>Welcome {session?.user?.firstname}, see your profile's performance here.</p>
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
