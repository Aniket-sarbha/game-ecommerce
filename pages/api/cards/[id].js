// pages/api/cards/[id].js
import prisma from '@/lib/prisma';

export async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Card ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const cardId = parseInt(id, 10);
      if (isNaN(cardId)) {
        return res.status(400).json({ error: 'Invalid card ID format' });
      }

      const card = await prisma.Game.findUnique({
        where: { gameId: cardId },
        select: { gameId: true, gameName: true },
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      return res.status(200).json(card);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ 
        error: 'Error fetching card data', 
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export default handler;
