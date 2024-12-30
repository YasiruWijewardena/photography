// lib/slugify.js

import slugify from 'slugify';
import prisma from './prisma'; // Adjust the path if necessary

/**
 * Generates a unique slug for an album within a photographer's albums.
 * @param {string} title - The album title.
 * @param {number} photographerId - The photographer's ID.
 * @returns {string} - A unique slug.
 */
export async function generateUniqueSlug(title, photographerId) {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Check if the slug already exists for this photographer
  while (
    await prisma.album.findFirst({
      where: {
        slug: slug,
        photographer_id: photographerId,
      },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}