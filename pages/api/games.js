// pages/api/games.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const games = await prisma.game.findMany();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching games data' });
  } finally {
    await prisma.$disconnect();
  }
}
