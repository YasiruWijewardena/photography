// /pages/api/analytics/photo-view.js

import { getOrSetAnonymousId } from '../../../lib/anonymousId'; 
import analyticsDb from '../../../lib/analyticsPrisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { parse } from 'cookie'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse the request body
    const { photoId } = req.body;
    if (!photoId) {
      return res.status(400).json({ error: 'Missing photoId' });
    }

    // Retrieve the session
    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id || null;
    let anonymousId = null;

    if (!userId) {
      // Call getOrSetAnonymousId to ensure the anonymousId cookie is set
      anonymousId = getOrSetAnonymousId(req, res);
    }

    // Insert the view event into the analytics database
    await analyticsDb.photoViewEvent.create({
      data: {
        userId,
        anonymousId,
        photoId,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error logging photo view:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}