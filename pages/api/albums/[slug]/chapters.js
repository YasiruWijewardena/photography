// pages/api/albums/[slug]/chapters.js

import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]';

export default async function handler(req, res) {
  const { slug } = req.query;

  // Authenticate the session
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'photographer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find the album by its slug and include chapters
  const album = await prisma.album.findUnique({
    where: { slug },
    include: { chapters: true },
  });
  if (!album) {
    return res.status(404).json({ error: 'Album not found' });
  }

  if (req.method === 'GET') {
    // Return the album's chapters
    return res.status(200).json({ chapters: album.chapters });
  } else if (req.method === 'POST') {
    // Expecting title, description, and order for the new chapter
    const { title, description, order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required for a chapter' });
    }

    try {
      const newChapter = await prisma.chapter.create({
        data: {
          title,
          description: description || '',
          order: Number(order),
          album: { connect: { id: album.id } },
        },
      });
      return res.status(200).json({ chapter: newChapter });
    } catch (error) {
      console.error('Error creating chapter:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}