// pages/admin/admin.js
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetch('/api/admin/admins')
      .then((res) => res.json())
      .then((data) => setAdmins(data));
  }, []);

  const handleApprove = async (id) => {
    await fetch(`/api/admin/admins/${id}/approve`, {
      method: 'POST',
    });
    setAdmins((prev) =>
      prev.map((a) => (a.admin_id === id ? { ...a, is_approved: true } : a))
    );
  };

  return (
    <div>
      <h1>Pending Admin Approvals</h1>
      <ul>
        {admins
          .filter((a) => !a.is_approved)
          .map((admin) => (
            <li key={admin.admin_id}>
              {admin.User.email}
              <button onClick={() => handleApprove(admin.admin_id)}>Approve</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (
    !session ||
    session.user.role !== 'admin' ||
    session.user.admin_level !== 'SUPER' ||
    session.user.admin_level !== 'BASIC'
  ) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
