// pages/api/auth/check-username.js

import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';

const reservedUsernames = [
  'about',
  'contact',
  'api',
  'login',
  'signup',
  'admin',
  'profile',
  'settings',
  // Add more reserved words as needed
];

const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in check-username API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.get(async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  // Check if username is reserved
  if (reservedUsernames.includes(username.toLowerCase())) {
    return res.status(200).json({ available: false, message: 'This username is reserved.' });
  }

  // Check if username already exists
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    return res.status(200).json({ available: false, message: 'Username already taken.' });
  } else {
    return res.status(200).json({ available: true, message: 'Username is available.' });
  }
});

export default handler;