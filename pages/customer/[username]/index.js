// pages/customer/[username]/index.js

import { getSession } from 'next-auth/react';
import CustomerLayout from '../../../components/CustomerLayout';
import FavouritedAlbums from '../../../components/FavouritedAlbums';
import PropTypes from 'prop-types';
import '../../../styles/public/albums.css';

export default function CustomerProfile({ username, firstname }) {
  return (
    <CustomerLayout username={username}>
      <div>
        <h1>Hello {firstname}</h1>
      </div>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { username } = context.params;

  // Redirect to login if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Redirect to login if trying to access another user's profile
  if (session.user.role !== 'customer' || session.user.username !== username) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const firstname = session.user.firstname;

  // If authenticated and authorized, proceed to render the page
  return {
    props: {
      username, // Pass username as a prop
      firstname
    },
  };
}

CustomerProfile.propTypes = {
  username: PropTypes.string.isRequired,
  firstname : PropTypes.string.isRequired,
};