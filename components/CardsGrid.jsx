"use client";

import { useEffect, useState } from "react";

export default function CardsGrid() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch("/api/games/route.js");

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data.games);
      } catch (err) {
        setError("Error loading games. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game) => (
        <div key={game.gameId}>
          <h3>{game.gameName}</h3>
        </div>
      ))}
    </div>
  );
}
