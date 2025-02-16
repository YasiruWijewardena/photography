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
  console.log('Update-photographer session:', session);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const tempDir = path.join(process.cwd(), 'temp');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_pictures');

  await fs.ensureDir(tempDir);
  await fs.ensureDir(uploadDir);

  const form = new IncomingForm({
    uploadDir: tempDir,
    keepExtensions: true,
    multiples: false,
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

    // Extract single values from arrays
    const bio = Array.isArray(fields.bio) ? fields.bio[0] : fields.bio;
    const website = Array.isArray(fields.website) ? fields.website[0] : fields.website;
    const instagram = Array.isArray(fields.instagram) ? fields.instagram[0] : fields.instagram;
    const mobile_num = Array.isArray(fields.mobile_num) ? fields.mobile_num[0] : fields.mobile_num;
    const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
    const subscription_id = Array.isArray(fields.subscription_id) ? fields.subscription_id[0] : fields.subscription_id;

    if (!bio || !mobile_num || !address || !subscription_id) {
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!validateMobileNum(mobile_num)) {
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'Invalid mobile number.' });
    }

    const subscription = await prisma.subscriptionPlan.findUnique({
      where: { id: parseInt(subscription_id, 10) },
    });

    if (!subscription) {
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'Selected subscription does not exist.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { Photographer: true },
    });

    if (!user) {
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role !== 'photographer') {
      if (files.profile_picture) {
        const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
        await fs.remove(file.filepath || file.path);
      }
      return res.status(400).json({ error: 'User is not a photographer.' });
    }

    let profilePictureUrl = user.Photographer?.profile_picture || null;
    if (files.profile_picture) {
      const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
      console.log('Received file:', file);

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        await fs.remove(file.filepath || file.path);
        return res.status(400).json({ error: 'Only JPEG, PNG, and GIF files are allowed.' });
      }

      const ext = path.extname(file.originalFilename || file.name);
      const newFileName = `${Date.now()}-${user.username}${ext}`;
      const finalPath = path.join(uploadDir, newFileName);

      await fs.move(file.filepath || file.path, finalPath, { overwrite: true });

      profilePictureUrl = `/uploads/profile_pictures/${newFileName}`;
    }

    // Update photographer details (without subscription_id change)
    await prisma.photographer.upsert({
      where: { photo_id: user.id },
      update: {
        bio,
        website: website || '',
        instagram: instagram || '',
        mobile_num: parseInt(mobile_num, 10),
        address,
        profile_picture: profilePictureUrl,
      },
      create: {
        photo_id: user.id,
        bio,
        website: website || '',
        instagram: instagram || '',
        mobile_num: parseInt(mobile_num, 10),
        address,
        profile_picture: profilePictureUrl,
      },
    });

    // Update or create the photographer's subscription record.
    const existingSub = await prisma.photographerSubscription.findFirst({
      where: { photographerId: user.id, active: true },
    });
    if (existingSub) {
      await prisma.photographerSubscription.update({
        where: { id: existingSub.id },
        data: { subscriptionPlanId: parseInt(subscription_id, 10) },
      });
    } else {
      await prisma.photographerSubscription.create({
        data: {
          photographerId: user.id,
          subscriptionPlanId: parseInt(subscription_id, 10),
          startDate: new Date(),
          active: true,
        },
      });
    }

    return res.status(200).json({ message: 'Photographer profile updated successfully.', photographer: user.Photographer });
  } catch (error) {
    console.error('Error updating photographer:', error);
    if (files && files.profile_picture) {
      const file = Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture;
      await fs.remove(file.filepath || file.path);
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default handler;