import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Your original games list data
const gamesList = [
  { id: 1, name: "Dragon’s Dogma 2" },
];

async function main() {
  console.log('Starting to seed database...');
  
  // Transform the data to match your schema
  const transformedGames = gamesList.map(game => ({
    gameId: game.id,
    gameName: game.name
  }));
  
  // Create games in batches to avoid potential issues with large datasets
  const batchSize = 100;
  let totalCreated = 0;
  
  for (let i = 0; i < transformedGames.length; i += batchSize) {
    const batch = transformedGames.slice(i, i + batchSize);
    
    // Use createMany for efficient bulk insertion
    const result = await prisma.game.createMany({
      data: batch,
      skipDuplicates: true, // Skip records that would cause unique constraint violations
    });
    
    totalCreated += result.count;
    console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedGames.length / batchSize)}`);
  }
  
  console.log(`Successfully seeded ${totalCreated} games.`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });