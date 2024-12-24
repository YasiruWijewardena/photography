// pages/api/subscriptions/index.js

import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Only allow super admins to access this endpoint for POST requests
  if (req.method === 'POST') {
    if (
      !session ||
      session.user.role !== 'admin' ||
      session.user.admin_level !== 'SUPER'
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, description, price, features } = req.body;

    try {
      // Convert features array to JSON object
      const featuresObject = {};
      features.forEach((feature) => {
        featuresObject[feature.featureName] = feature.featureValue;
      });

      // Create subscription
      const subscription = await prisma.subscription.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          features: featuresObject,
        },
      });

      return res.status(201).json(subscription);
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    // Public endpoint to fetch subscriptions
    try {
      const subscriptions = await prisma.subscription.findMany();
      return res.status(200).json(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
