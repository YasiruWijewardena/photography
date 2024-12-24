// pages/api/photographer/[id]/update-profile.js

import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import { IncomingForm } from 'formidable';
import fs from 'fs-extra';
import path from 'path';
import bcrypt from 'bcrypt';
import { parseForm, getSingleValue, moveFile } from '@/lib/formUtils';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_pictures');

fs.ensureDirSync(uploadDir);

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getSession({ req });

  if (!session || session.user.role !== 'photographer' || session.user.id !== Number(id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Parse the form data
    const { fields, files } = await parseForm(req);

    // Extract single values
    const firstname = getSingleValue(fields.firstname);
    const lastname = getSingleValue(fields.lastname);
    const bio = getSingleValue(fields.bio);
    const website = getSingleValue(fields.website);
    const instagram = getSingleValue(fields.instagram);
    const mobile_num = getSingleValue(fields.mobile_num);
    const subscription_id = getSingleValue(fields.subscription_id);
    const password = getSingleValue(fields.password);

    // Validate required fields
    if (!firstname && !lastname) {
      return res.status(400).json({ error: 'Full name is required.' });
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
      const newFileName = `${id}-${Date.now()}${fileExt}`;

      // Move the file to the final directory
      profilePictureUrl = `/uploads/profile_pictures/${newFileName}`;
      await fs.move(profilePic.filepath, path.join(uploadDir, newFileName));

      // Delete the old profile picture if it exists
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: { Photographer: { select: { profile_picture: true } } },
      });

      if (
        existingUser &&
        existingUser.Photographer &&
        existingUser.Photographer.profile_picture
      ) {
        const oldFilePath = path.join(process.cwd(), 'public', existingUser.Photographer.profile_picture);
        if (await fs.pathExists(oldFilePath)) {
          await fs.remove(oldFilePath);
        }
      }
    }

    // If password is being updated, hash it
    let hashedPassword = undefined;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Prepare data for Prisma update
    const updateData = {
      firstname,
      lastname,
      Photographer: {
        update: {
          bio,
          website,
          instagram,
          mobile_num: mobile_num ? parseInt(mobile_num, 10) : undefined,
          subscription_id: subscription_id ? parseInt(subscription_id, 10) : undefined,
          ...(profilePictureUrl && { profile_picture: profilePictureUrl }),
        },
      },
      ...(hashedPassword && { password: hashedPassword }),
    };

    // Update user and photographer data in the database
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        Photographer: {
          select: {
            bio: true,
            website: true,
            instagram: true,
            mobile_num: true,
            subscription_id: true,
            profile_picture: true,
          },
        },
      },
    });

    return res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Error updating profile.' });
  }
}
