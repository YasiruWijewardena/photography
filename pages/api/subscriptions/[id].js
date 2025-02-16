// pages/api/subscriptions/[id].js

import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin' || session.user.admin_level !== 'SUPER') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, description, price, features } = req.body;
    try {
      // Update the plan details
      await prisma.subscriptionPlan.update({
        where: { id: parseInt(id, 10) },
        data: { name, description, price: parseFloat(price) }
      });
      // Remove all existing feature mappings for this plan
      await prisma.subscriptionPlanFeature.deleteMany({
        where: { subscriptionPlanId: parseInt(id, 10) }
      });
      // Re-create the feature mappings based on the new data
      for (const feature of features) {
        const { featureName, featureValue } = feature;
        let subscriptionFeature = await prisma.subscriptionFeature.findUnique({
          where: { key: featureName }
        });
        if (!subscriptionFeature) {
          subscriptionFeature = await prisma.subscriptionFeature.create({
            data: {
              key: featureName,
              description: `Feature ${featureName}`,
              dataType: "string",
            }
          });
        }
        await prisma.subscriptionPlanFeature.create({
          data: {
            subscriptionPlanId: parseInt(id, 10),
            subscriptionFeatureId: subscriptionFeature.id,
            value: featureValue
          }
        });
      }
      // Fetch and return the updated plan with its features
      const updatedPlan = await prisma.subscriptionPlan.findUnique({
        where: { id: parseInt(id, 10) },
        include: { planFeatures: { include: { subscriptionFeature: true } } }
      });
      return res.status(200).json(updatedPlan);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  else if (req.method === 'DELETE') {
    try {
      await prisma.subscriptionPlan.delete({
        where: { id: parseInt(id, 10) }
      });
      return res.status(200).json({ message: 'Subscription deleted' });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
