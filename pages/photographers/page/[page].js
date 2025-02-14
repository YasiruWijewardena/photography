// pages/photographers/page/[page].js

import PublicLayout from '../../../components/PublicLayout';
import prisma from '../../../lib/prisma';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import '../../../styles/public/global.css';
import '../../../styles/public/home.css';
import '../../../styles/public/photographers.css';

const PHOTOGRAPHERS_PER_PAGE = 10;

export default function PhotographersPage({ photographers, currentPage, totalPages }) {
  return (
    <PublicLayout>
      <Head>
        <title>Photographers - Page {currentPage}</title>
        <meta
          name="description"
          content={`Discover talented photographers - page ${currentPage} of ${totalPages}.`}
        />
      </Head>
      <div className="photographers-page">
        <h1 className="photographers-page-title">Discover Talented Photographers</h1>
        <div className="photographers-list-container">
          {photographers.map((photographer) => (
            <div className='photographer-wrapper' key={photographer.photo_id}>
                <Link href={`/${photographer.User.username}`}>
                    <Image
                        src={
                        photographer?.profile_picture ||
                        '/default-profile.png'
                        }
                        alt={
                        photographer
                            ? `${photographer.name}`
                            : 'Unknown Photographer'
                        }
                        width={100}
                        height={100}
                        className='photographer-pro-pic'
                    />
                </Link>
                <div> 
                    <Link href={`/${photographer.User.username}`}>
                        <h3 className='photographer-name'>
                            {photographer.User.firstname} {photographer.User.lastname}
                        </h3>
                    </Link>
                    <p>
                        {photographer.bio}
                    </p>
                </div>
                
            </div>
          ))}
        </div>
        <div className="pagination">
          {currentPage > 1 && (
            <Link href={`/photographers/page/${currentPage - 1}`}>
              Previous
            </Link>
          )}
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/photographers/page/${currentPage + 1}`}>
              Next
            </Link>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export async function getServerSideProps({ params }) {
  const page = parseInt(params.page, 10) || 1;
  const skip = (page - 1) * PHOTOGRAPHERS_PER_PAGE;
  const take = PHOTOGRAPHERS_PER_PAGE;

  // Fetch the photographers along with the associated User data, ordered by photo_id.
  const [photographers, totalCount] = await Promise.all([
    prisma.photographer.findMany({
      skip,
      take,
      include: {
        User: true,
      },
      orderBy: {
        photo_id: 'desc',
      },
    }),
    prisma.photographer.count(),
  ]);

  // Serialize Date objects to strings (for example, created_at and updated_at from User)
  const serializedPhotographers = photographers.map((photographer) => ({
    ...photographer,
    User: {
      ...photographer.User,
      created_at: photographer.User.created_at?.toISOString() || null,
      updated_at: photographer.User.updated_at?.toISOString() || null,
    },
  }));

  const totalPages = Math.ceil(totalCount / PHOTOGRAPHERS_PER_PAGE);

  return {
    props: {
      photographers: serializedPhotographers,
      currentPage: page,
      totalPages,
    },
  };
}