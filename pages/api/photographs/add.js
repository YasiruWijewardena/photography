// pages/api/photographs/add.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import formidable from 'formidable';
import prisma from '../../../lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import exifParser from 'exif-parser';

// Disable Next.js's default body parser to handle file uploads with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const photographerId = await getPhotographerId(session.user.id);
  if (!photographerId) {
    return res.status(404).json({ error: 'Photographer not found' });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads/photos');
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    multiples: true, // Allow multiple files
    keepExtensions: true, // Keep file extensions
    uploadDir: uploadDir, // Set upload directory
    filename: (name, ext, part, form) => {
      // Generate a unique filename
      return `${Date.now()}-${part.originalFilename}`;
    },
  });

  // Parse the incoming request containing the form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const albumId = parseInt(fields.albumId, 10);
    if (isNaN(albumId)) {
      return res.status(400).json({ error: 'Invalid album ID' });
    }

    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album || album.photographer_id !== photographerId) {
      return res.status(404).json({ error: 'Album not found or no permission' });
    }

    // Ensure 'images' is an array for multiple files
    const images = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    try {
      // Process each image: extract metadata and generate thumbnail
      const createPromises = images.map(async (image) => {
        const relativePath = `/uploads/photos/${path.basename(image.filepath)}`;
        const absolutePath = path.join(uploadDir, path.basename(image.filepath));

        // Extract EXIF data
        const buffer = await fs.readFile(absolutePath);
        let metadata = {};
        try {
          const parser = exifParser.create(buffer);
          const result = parser.parse();
          metadata = {
            cameraModel: result.tags.Make && result.tags.Model ? `${result.tags.Make} ${result.tags.Model}` : null,
            lens: result.tags.LensModel || null,
            exposure: result.tags.ExposureTime ? `${result.tags.ExposureTime} sec` : null,
            focalLength: result.tags.FocalLength ? `${result.tags.FocalLength} mm` : null,
          };
        } catch (exifError) {
          console.warn('Failed to parse EXIF data:', exifError);
        }

        // Generate Thumbnail
        const thumbFilename = `thumb-${path.basename(image.filepath)}`;
        const thumbPath = path.join(uploadDir, thumbFilename);
        const thumbRelativePath = `/uploads/photos/${thumbFilename}`;

        await sharp(absolutePath)
          .resize({ width: 300 }) // Adjust thumbnail width as needed
          .toFile(thumbPath);

        // Get thumbnail dimensions
        const thumbMetadata = await sharp(thumbPath).metadata();

        // Get original image dimensions
        const originalMetadata = await sharp(absolutePath).metadata();

        return prisma.photograph.create({
          data: {
            album_id: albumId,
            photographer_id: photographerId,
            title: image.originalFilename || 'Untitled',
            description: fields.description || '', // Optional description
            image_url: relativePath,
            thumbnail_url: thumbRelativePath,
            image_width: originalMetadata.width,
            image_height: originalMetadata.height,
            thumbnail_width: thumbMetadata.width,
            thumbnail_height: thumbMetadata.height,
            ...metadata,
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

async function getPhotographerId(userId) {
  const photographer = await prisma.photographer.findUnique({ where: { photo_id: userId } });
  return photographer?.photo_id; // Ensure this matches your Prisma schema
}
