// pages/api/auth/signup.js

import nextConnect from 'next-connect';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { checkReservedUsername, generateUniqueUsername } from '../../../lib/usernameUtils';
import { validateEmail, validatePassword } from '../../../lib/validationUtils';

const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in signup API:', error);
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Validate input
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Generate unique username
    let username = await generateUniqueUsername(email);
    if (!username) {
      return res.status(400).json({ error: 'Unable to generate a unique username.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with role 'pending'
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        username,
        password: hashedPassword,
        role: 'pending', // Temporary role until role selection
      },
    });

    // Return success response
    return res.status(201).json({ message: 'User created successfully.', userId: user.id });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;