// pages/api/auth/create-photographer.js

import { IncomingForm } from 'formidable';
import prisma from '../../../lib/prisma';
import path from 'path';
import fs from 'fs-extra';
import nextConnect from 'next-connect';
import { generateUniqueUsername } from '../../../lib/usernameUtils';
import { validateEmail, validatePassword, validateMobileNum } from '../../../lib/validationUtils';
import bcrypt from 'bcrypt';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const handler = nextConnect({
  onError(error, req, res) {
    console.error('Error in create-photographer API:', error);
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.post(async (req, res) => {
  const form = new IncomingForm(); // Updated this line
  form.uploadDir = path.join(process.cwd(), 'temp');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ error: 'Error parsing the form data.' });
    }

    const {
      firstname,
      lastname,
      email,
      password,
      role,
      bio,
      website,
      instagram,
      mobile_num,
      address,
      subscription_id,
    } = fields;

    // Validate role
    if (role !== 'photographer') {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    // Validate required fields
    if (!firstname || !lastname || !email || !password || !bio || !mobile_num || !address || !subscription_id) {
      // Remove uploaded file if validation fails
      if (files.profile_picture) {
        await fs.remove(files.profile_picture.filepath);
      }
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate email and password
    if (!validateEmail(email)) {
      if (files.profile_picture) {
        await fs.remove(files.profile_picture.filepath);
      }
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
      if (files.profile_picture) {
        await fs.remove(files.profile_picture.filepath);
      }
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Validate mobile number
    if (!validateMobileNum(mobile_num)) {
      if (files.profile_picture) {
        await fs.remove(files.profile_picture.filepath);
      }
      return res.status(400).json({ error: 'Invalid mobile number.' });
    }

    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        if (files.profile_picture) {
          await fs.remove(files.profile_picture.filepath);
        }
        return res.status(400).json({ error: 'Email already exists.' });
      }

      // Generate unique username
      const username = await generateUniqueUsername(`${firstname}${lastname}`);
      if (!username) {
        if (files.profile_picture) {
          await fs.remove(files.profile_picture.filepath);
        }
        return res.status(400).json({ error: 'Unable to generate a unique username.' });
      }

      // Handle profile picture
      let profilePictureUrl = null;
      if (files.profile_picture) {
        const file = files.profile_picture;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
          await fs.remove(file.filepath);
          return res.status(400).json({ error: 'Only JPEG, PNG, and GIF files are allowed.' });
        }

        const ext = path.extname(file.originalFilename);
        const newFileName = `${Date.now()}-${username}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile_pictures');

        await fs.ensureDir(uploadDir);
        const finalPath = path.join(uploadDir, newFileName);
        await fs.move(file.filepath, finalPath, { overwrite: true });

        // Generate the URL (assuming 'public' is served at root)
        profilePictureUrl = `/uploads/profile_pictures/${newFileName}`;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user and photographer record
      const user = await prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          username,
          password: hashedPassword,
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
              subscription_id: parseInt(subscription_id, 10),
            },
          },
        },
      });

      return res.status(201).json({ message: 'Photographer created successfully.', userId: user.id });
    } catch (error) {
      console.error('Error creating photographer:', error);
      // Remove uploaded file in case of error
      if (files.profile_picture) {
        await fs.remove(files.profile_picture.filepath);
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

export default handler;