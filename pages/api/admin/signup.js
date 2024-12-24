// pages/api/admin/signup.js

import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role: 'admin',
        },
      });

      await prisma.admin.create({
        data: {
          admin_id: user.id,
          admin_level: 'BASIC',
          is_approved: false,    
          permissions: {},
        },
      });

      res.status(201).json({ message: 'Admin registration submitted for approval' });
    } catch (error) {
      console.error('Error creating admin:', error);
      if (error.code === 'P2002') {
        res.status(409).json({ error: 'User with this email already exists' });
      } else {
        res.status(500).json({ error: 'An error occurred while creating the admin' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


