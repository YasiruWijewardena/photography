// pages/api/albums/[slug]/add-photos.js

import prisma from '../../../../lib/prisma';
import formidable from 'formidable';
import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';

// Disable Next.js's default body parser to use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { slug } = req.query; // Use slug to identify the album

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Create the upload directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'public/uploads/photos');
  await fs.mkdir(uploadDir, { recursive: true });

  // Initialize formidable to handle file uploads
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: uploadDir,
    filename: (name, ext, part) => {
      return `${Date.now()}-${part.originalFilename}`;
    },
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    // Find album by slug
    const album = await prisma.album.findUnique({ where: { slug } });
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Read chapterId from form fields (if provided)
    const chapterId = fields.chapterId ? parseInt(fields.chapterId, 10) : null;

    // Process uploaded images (handle single or multiple files)
    const images = Array.isArray(files.images)
      ? files.images
      : files.images
      ? [files.images]
      : [];
    if (images.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    try {
      // Process each image file and create a photograph record
      const createPromises = images.map(async (image) => {
        const relativePath = `/uploads/photos/${path.basename(image.filepath)}`;
        const absolutePath = path.join(uploadDir, path.basename(image.filepath));

        // Get original image metadata using sharp
        const originalMetadata = await sharp(absolutePath).metadata().catch(() => ({
          width: 800,
          height: 600,
        }));
        let thumbnail_url = relativePath;
        let thumbnail_width = originalMetadata.width;
        let thumbnail_height = originalMetadata.height;

        // Optionally generate a thumbnail if the file size is large
        if (image.size > 2 * 1024 * 1024) {
          const thumbFilename = `thumb-${path.basename(image.filepath, path.extname(image.filepath))}.jpg`;
          const thumbPath = path.join(uploadDir, thumbFilename);
          await sharp(absolutePath)
            .resize({ width: 300 })
            .jpeg({ quality: 90 })
            .toFile(thumbPath);
          const thumbMetadata = await sharp(thumbPath).metadata().catch(() => ({
            width: 300,
            height: Math.round((originalMetadata.height * 300) / originalMetadata.width),
          }));
          thumbnail_url = `/uploads/photos/${thumbFilename}`;
          thumbnail_width = thumbMetadata.width;
          thumbnail_height = thumbMetadata.height;
        }

        // Create a photograph record with the chapterId (if provided)
        return prisma.photograph.create({
          data: {
            album_id: album.id,
            title: image.originalFilename || 'Untitled',
            image_url: relativePath,
            image_width: originalMetadata.width,
            image_height: originalMetadata.height,
            thumbnail_url,
            thumbnail_width,
            thumbnail_height,
            chapterId: chapterId,
          },
        });
      });

      await Promise.all(createPromises);
      return res.status(200).json({ message: 'Photos added successfully' });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to save photos' });
    }
  });
}