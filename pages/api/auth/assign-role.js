// pages/api/auth/assign-role.js

import nextConnect from 'next-connect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import prisma from '../../../lib/prisma';
import { generateUniqueUsername } from '../../../lib/usernameUtils';

const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in assign-role API:', error);
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  console.log('Assign-role session:', session); // Debugging line

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { role } = req.body;

  if (!role || !['customer', 'photographer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role && user.role !== 'pending') {
      return res.status(400).json({ error: 'Role already assigned' });
    }

    // Generate unique username if empty
    let username = user.username;
    if (!username) {
      username = await generateUniqueUsername(`${user.firstname}${user.lastname}`);
      if (!username) {
        return res.status(400).json({ error: 'Unable to generate a unique username.' });
      }
    }

    // Update user with role and username
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role,
        username,
      },
    });

    if (role === 'customer') {
      await prisma.customer.create({
        data: {
          cust_id: updatedUser.id,
          favourites: JSON.stringify([]),
          profile_image: null,
        },
      });
    }

    return res.status(200).json({ message: 'Role assigned successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error assigning role:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;