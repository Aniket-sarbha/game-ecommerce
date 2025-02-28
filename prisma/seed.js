import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const gamesList = [
  { id: 1, name: "Dragon’s Dogma 2" },
];

async function main() {
  console.log('Starting to seed database...');
  
  
  const transformedGames = gamesList.map(game => ({
    gameId: game.id,
    gameName: game.name
  }));
  
  const batchSize = 100;
  let totalCreated = 0;
  
  for (let i = 0; i < transformedGames.length; i += batchSize) {
    const batch = transformedGames.slice(i, i + batchSize);
    
    const result = await prisma.game.createMany({
      data: batch,
      skipDuplicates: true, 
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