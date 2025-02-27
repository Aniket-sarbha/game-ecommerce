import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { id } = req.query;
  const gameId = parseInt(id, 10);
  
  if (isNaN(gameId)) {
    return res.status(400).json({ error: 'Invalid game ID' });
  }
  
  const prisma = new PrismaClient();
  
  try {
    const game = await prisma.game.findUnique({
      where: {
        gameId: gameId
      }
    });
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  } finally {
    await prisma.$disconnect();
  }
}