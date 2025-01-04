// pages/api/auth/update-photographer.js

import nextConnect from 'next-connect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import prisma from '../../../lib/prisma';
import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs-extra';
import { validateMobileNum } from '../../../lib/validationUtils';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in update-photographer API:', error);
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  console.log('Update-photographer session:', session); // Debugging line

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Define absolute paths
  const tempDir = path.join(process.cwd(), 'temp');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_pictures');

  // Ensure that temp and upload directories exist
  await fs.ensureDir(tempDir);
  await fs.ensureDir(uploadDir);

  const form = new IncomingForm({
    uploadDir: tempDir,
    keepExtensions: true,
    multiples: false, // Ensure only single file per field
  });

  let fields;
  let files;

  try {
    const parsed = await new Promise((resolve, reject) => {
      form.parse(req, (err, parsedFields, parsedFiles) => {
        if (err) reject(err);
        else resolve({ parsedFields, parsedFiles });
      });
    });

    fields = parsed.parsedFields;
    files = parsed.parsedFiles;

    console.log('Parsed fields:', fields); // Debugging
    console.log('Parsed files:', files); // Debugging

    // Extract single values from arrays
    const bio = Array.isArray(fields.bio) ? fields.bio[0] : fields.bio;
    const website = Array.isArray(fields.website) ? fields.website[0] : fields.website;
    const instagram = Array.isArray(fields.instagram) ? fields.instagram[0] : fields.instagram;
    const mobile_num = Array.isArray(fields.mobile_num) ? fields.mobile_num[0] : fields.mobile_num;
    const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
    const subscription_id = Array.isArray(fields.subscription_id) ? fields.subscription_id[0] : fields.subscription_id;

    // Validate required fields
    if (!bio || !mobile_num || !address || !subscription_id) {
      // Remove uploaded file if validation fails
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate mobile number
    if (!validateMobileNum(mobile_num)) {
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'Invalid mobile number.' });
    }

    // Validate subscription_id exists
    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(subscription_id, 10) },
    });

    if (!subscription) {
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'Selected subscription does not exist.' });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { Photographer: true },
    });

    if (!user) {
      // Remove uploaded file if user not found
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role !== 'photographer') {
      // Remove uploaded file if user is not photographer
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'User is not a photographer.' });
    }

    // Handle profile picture
    let profilePictureUrl = user.Photographer?.profile_picture || null;
    if (files.profile_picture) {
      const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
      console.log('Received file:', file); // Debugging

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        await fs.remove(file.filepath || file.path);
        return res.status(400).json({ error: 'Only JPEG, PNG, and GIF files are allowed.' });
      }

      const ext = path.extname(file.originalFilename || file.name);
      const newFileName = `${Date.now()}-${user.username}${ext}`;
      const finalPath = path.join(uploadDir, newFileName);

      await fs.move(file.filepath || file.path, finalPath, { overwrite: true });

      // Generate the URL (assuming 'public' is served at root)
      profilePictureUrl = `/uploads/profile_pictures/${newFileName}`;
    }

    // Upsert Photographer record
    const updatedPhotographer = await prisma.photographer.upsert({
      where: { photo_id: user.id }, // Using photo_id as per schema
      update: {
        bio,
        website: website || '',
        instagram: instagram || '',
        mobile_num: parseInt(mobile_num, 10),
        address,
        profile_picture: profilePictureUrl,
        subscription_id: parseInt(subscription_id, 10),
      },
      create: {
        photo_id: user.id,
        bio,
        website: website || '',
        instagram: instagram || '',
        mobile_num: parseInt(mobile_num, 10),
        address,
        profile_picture: profilePictureUrl,
        subscription_id: parseInt(subscription_id, 10),
      },
    });

    return res.status(200).json({ message: 'Photographer profile updated successfully.', photographer: updatedPhotographer });
  } catch (error) {
    console.error('Error updating photographer:', error);
    // Remove uploaded file in case of error
    if (files && files.profile_picture) {
      const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
      await fs.remove(file.filepath || file.path);
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;