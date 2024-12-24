// pages/admin/photographers/[id].js

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import prisma from '../../../lib/prisma';
import { serializeData } from '../../../lib/serialize';
import Image from 'next/image'; // Optional: For optimized image rendering
import '../../../styles/global.css';

export default function PhotographerDetails({ photographer }) {
  const router = useRouter();

  const handleApprove = async () => {
    const res = await fetch(`/api/admin/photographers/${photographer.photo_id}/approve`, {
      method: 'POST',
    });

    if (res.ok) {
      router.push('/admin/photographers/approve');
    } else {
      const errorData = await res.json();
      alert(`Failed to approve photographer: ${errorData.error || 'Unknown error'}`);
    }
  };

  // Destructure necessary fields for cleaner access
  const {
    photo_id,
    bio,
    website,
    instagram,
    mobile_num,
    address,
    profile_picture,
    is_approved,
    User,
  } = photographer;

  return (
    <AdminLayout>
      <h1>Photographer Details</h1>

      

      
      <div className='admin-photo-id-container'>
        {/* Profile Picture */}
      {profile_picture && (
        <div>
          <h3>Profile picture</h3>
          <Image
            src={profile_picture}
            alt={`${User.username || User.email}'s Profile Picture`}
            width={300}
            height={300}
            className='admin-photo-profile-pic'
          />
        </div>
      )}
      </div>

      <div className='admin-photographer-info-container'>
      <div className='admin-photo-basic-container'> 
      {/* Basic Information */}
      <p>
        <span>Name</span> {User.username || User.email}
      </p>
      <p>
        <span>Email</span> {User.email}
      </p>
      <p>
        <span>Bio</span> {bio || 'No bio provided'}
      </p>
      <p>
        <span>Website</span>{' '}
        {website ? (
          <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        ) : (
          'N/A'
        )}
      </p>
      <p>
        <span>Instagram</span> {instagram ? `@${instagram}` : 'N/A'}
      </p>
      <p>
        <span>Mobile Number</span> {mobile_num}
      </p>
      <p>
        <span>Address</span> {address}
      </p>
      <p>
        <span>Approved</span> {is_approved ? 'Yes' : 'No'}
      </p>
      </div>
      

      
      </div>
      

      {/* Approval Button */}
      {!is_approved && (
        <button onClick={handleApprove} className='admin-primary-btn photographer-approve-btn'>
          Approve Photographer
        </button>
      )}

      {/* Optional: Link to View Photographer's Portfolio or Albums */}
      {/* <a href={`/admin/photographers/${photo_id}/portfolio`}>View Portfolio</a> */}
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { id } = context.params;

  // Security Check: Ensure the user is an approved admin
  if (
    !session ||
    session.user.role !== 'admin' ||
    !['BASIC', 'SUPER'].includes(session.user.admin_level)
  ) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  // Fetch the photographer with necessary fields
  const photographer = await prisma.photographer.findUnique({
    where: {
      photo_id: parseInt(id, 10),
    },
    include: {
      User: true, // Include related User data
    },
  });

  if (!photographer) {
    return {
      notFound: true,
    };
  }

  // Serialize data to handle Date objects and other non-serializable fields
  const serializedPhotographer = serializeData(photographer);

  return {
    props: {
      photographer: serializedPhotographer,
    },
  };
}
