// pages/api/auth/signup/photographer.js

import nextConnect from 'next-connect';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs-extra';
import { parseForm, getSingleValue, moveFile } from '@/lib/formUtils'; // Adjust the import path as needed
import { getSession } from 'next-auth/react'; // Import getSession here

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
    sizeLimit: '5mb',  // Adjust based on your needs
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'photographer_profile_pictures');

const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in photographer signup API:', error);
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  try {
    // Parse the form data using Formidable
    const { fields, files } = await parseForm(req);

    // Extract single values
    const bio = getSingleValue(fields.bio);
    const website = getSingleValue(fields.website);
    const instagram = getSingleValue(fields.instagram);
    const mobile_num = getSingleValue(fields.mobile_num);
    const address = getSingleValue(fields.address);
    const subscription_id = getSingleValue(fields.subscription_id);

    // Validate required fields
    if (!bio || !mobile_num || !address || !subscription_id) {
      // Remove uploaded file if validation fails
      if (files.profile_picture) {
        const profilePic = Array.isArray(files.profile_picture)
          ? files.profile_picture[0]
          : files.profile_picture;
        await fs.remove(profilePic.filepath);
      }
      return res.status(400).json({ error: 'Bio, mobile number, address, and subscription are required.' });
    }

    // Validate mobile number (basic validation)
    const mobileNumRegex = /^\d{10,15}$/; // Adjust the regex based on your requirements
    if (!mobileNumRegex.test(mobile_num)) {
      if (files.profile_picture) {
        const profilePic = Array.isArray(files.profile_picture)
          ? files.profile_picture[0]
          : files.profile_picture;
        await fs.remove(profilePic.filepath);
      }
      return res.status(400).json({ error: 'Invalid mobile number format.' });
    }

    // Validate subscription_id (ensure it's a valid integer)
    const parsedSubscriptionId = parseInt(subscription_id, 10);
    if (isNaN(parsedSubscriptionId)) {
      if (files.profile_picture) {
        const profilePic = Array.isArray(files.profile_picture)
          ? files.profile_picture[0]
          : files.profile_picture;
        await fs.remove(profilePic.filepath);
      }
      return res.status(400).json({ error: 'Invalid subscription ID.' });
    }

    // Get the session to identify the user
    const session = await getSession({ req });

    if (!session) {
      // Remove uploaded file if unauthorized
      if (files.profile_picture) {
        const profilePic = Array.isArray(files.profile_picture)
          ? files.profile_picture[0]
          : files.profile_picture;
        await fs.remove(profilePic.filepath);
      }
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const userEmail = session.user.email;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { Photographer: true },
    });

    if (!user) {
      if (files.profile_picture) {
        const profilePic = Array.isArray(files.profile_picture)
          ? files.profile_picture[0]
          : files.profile_picture;
        await fs.remove(profilePic.filepath);
      }
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role === 'photographer') {
      if (files.profile_picture) {
        const profilePic = Array.isArray(files.profile_picture)
          ? files.profile_picture[0]
          : files.profile_picture;
        await fs.remove(profilePic.filepath);
      }
      return res.status(400).json({ error: 'User is already a photographer.' });
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
      const newFileName = `${Date.now()}-${user.username}${fileExt}`;

      // Move the file to the final directory
      profilePictureUrl = await moveFile(profilePic, uploadDir, newFileName);
    }

    // Create the Photographer record and update the user's role
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        role: 'photographer',
        Photographer: {
          create: {
            bio,
            website: website || '',
            instagram: instagram || '',
            mobile_num: parseInt(mobile_num, 10),
            address,
            profile_picture: profilePictureUrl,
            is_approved: false,
            subscription_id: parsedSubscriptionId,
          },
        },
      },
    });

    return res.status(201).json({ message: 'Photographer details added successfully.' });
  } catch (error) {
    console.error('Error during photographer signup:', error);
    // Remove the uploaded file in case of error
    if (error instanceof Error && error.message.includes('Only JPEG, PNG, and GIF files are allowed.')) {
      if (req.file) {
        await fs.remove(req.file.filepath);
      }
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;