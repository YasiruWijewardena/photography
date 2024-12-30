// pages/api/auth/signup/photographer.js

import nextConnect from 'next-connect';
import fs from 'fs-extra';
import path from 'path';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';
import { parseForm, getSingleValue, moveFile } from '@/lib/formUtils';

export const config = {
  api: {
    bodyParser: false, // Disables Next.js's default body parser
    sizeLimit: '1000mb',
  },
};

// Define directories
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_pictures');

// Ensure the upload directory exists
fs.ensureDirSync(uploadDir);

// Initialize Next-Connect handler
const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  try {
    // Parse the form data
    const { fields, files } = await parseForm(req);

    // Extract single values
    const firstname = getSingleValue(fields.firstname);
    const lastname = getSingleValue(fields.lastname);
    const username = getSingleValue(fields.username);
    const email = getSingleValue(fields.email);
    const password = getSingleValue(fields.password);
    const bio = getSingleValue(fields.bio);
    const website = getSingleValue(fields.website);
    const instagram = getSingleValue(fields.instagram);
    const mobile_num = getSingleValue(fields.mobile_num);
    const address = getSingleValue(fields.address);
    const subscription_id = getSingleValue(fields.subscription_id);

    // Validate required fields
    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password ||
      !bio ||
      !mobile_num ||
      !address ||
      !subscription_id
    ) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Check if the username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists.' });
    }


    // Handle profile picture
    let profilePictureUrl = null;
    if (files.profile_picture) {
      const profilePic = Array.isArray(files.profile_picture)
        ? files.profile_picture[0]
        : files.profile_picture;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(profilePic.mimetype)) {
        // Remove the uploaded file
        await fs.remove(profilePic.filepath);
        return res.status(400).json({ error: 'Only JPEG, PNG, and GIF files are allowed.' });
      }

      // Define the new file name
      const fileExt = path.extname(profilePic.originalFilename);
      const newFileName = `${Date.now()}-${firstname}-${lastname}${fileExt}`;

      // Move the file to the final directory
      profilePictureUrl = await moveFile(profilePic, uploadDir, newFileName);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user and photographer in the database
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        role: 'photographer',
        Photographer: {
          create: {
            bio,
            website,
            instagram,
            mobile_num: parseInt(mobile_num, 10),
            address,
            profile_picture: profilePictureUrl,
            is_approved: false,
            subscription_id: parseInt(subscription_id, 10),
          },
        },
      },
      include: {
        Photographer: true,
      },
    });

    return res.status(201).json({ message: 'Photographer created successfully', userId: user.id });
  } catch (error) {
    console.error('Error during photographer signup:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;
