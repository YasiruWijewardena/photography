// pages/api/subscriptions/index.js

import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === 'POST') {
    if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { name, description, price, features } = req.body; // features: an array of { featureName, featureValue }
    try {
      // Create the subscription plan record
      const subscriptionPlan = await prisma.subscriptionPlan.create({
        data: {
          name,
          description,
          price: parseFloat(price),
        }
      });
      // Loop through each provided feature value
      for (const feature of features) {
        const { featureName, featureValue } = feature;
        // Find the globally defined feature (it must exist)
        const subscriptionFeature = await prisma.subscriptionFeature.findUnique({
          where: { key: featureName }
        });
        if (subscriptionFeature) {
          await prisma.subscriptionPlanFeature.create({
            data: {
              subscriptionPlanId: subscriptionPlan.id,
              subscriptionFeatureId: subscriptionFeature.id,
              value: featureValue
            }
          });
        }
      }
      // Return the created plan with its features
      const createdPlan = await prisma.subscriptionPlan.findUnique({
        where: { id: subscriptionPlan.id },
        include: { planFeatures: { include: { subscriptionFeature: true } } }
      });
      return res.status(201).json(createdPlan);
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // GET: Return all subscription plans with their features
  else if (req.method === 'GET') {
    try {
      const subscriptions = await prisma.subscriptionPlan.findMany({
        include: { planFeatures: { include: { subscriptionFeature: true } } }
      });
      return res.status(200).json(subscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}