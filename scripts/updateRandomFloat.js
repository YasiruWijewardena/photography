// scripts/updateRandomFloat.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateRandomFloats() {
  console.log('Starting random_float update...');
  const batchSize = 1000; // Adjust based on your dataset size
  let skip = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const photos = await prisma.photograph.findMany({
        skip,
        take: batchSize,
        select: { id: true },
      });

      if (photos.length === 0) {
        hasMore = false;
        break;
      }

      const updatePromises = photos.map(photo =>
        prisma.photograph.update({
          where: { id: photo.id },
          data: { random_float: Math.random() },
        })
      );

      await Promise.all(updatePromises);
      skip += batchSize;
      console.log(`Updated random_float for ${skip} photos`);
    }

    console.log('Completed updating random_float for all photos.');
  } catch (error) {
    console.error('Error updating random_float:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRandomFloats();
