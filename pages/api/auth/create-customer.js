// pages/api/auth/create-customer.js

import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { generateUniqueUsername } from '../../../lib/usernameUtils';
import { validateEmail, validatePassword } from '../../../lib/validationUtils';

const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in create-customer API:', error);
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  // Validate role
  if (role !== 'customer') {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  try {
    // Validate inputs
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Generate unique username
    const username = await generateUniqueUsername(`${firstname}${lastname}`);
    if (!username) {
      return res.status(400).json({ error: 'Unable to generate a unique username.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role 'customer'
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        username,
        password: hashedPassword,
        role: 'customer',
        Customer: {
          create: {
            favourites: [], // Initialize as needed
            profile_image: null,
          },
        },
      },
    });

    return res.status(201).json({ message: 'Customer created successfully.', userId: user.id });
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;