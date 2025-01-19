import analyticsDb from '../../../lib/analyticsPrisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { parse } from 'cookie'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse request
    const { photoId } = req.body;
    if (!photoId) {
      return res.status(400).json({ error: 'Missing photoId' });
    }

    // Check if user is logged in
    const session = await getServerSession(req, res, authOptions);


    const userId = session?.user?.id || null;
    let anonymousId = null;

    if(!userId){
        const cookies = parse(req.headers.cookie || '');
        anonymousId = cookies.anonymousId || null;
    }

    

    // Insert the record
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