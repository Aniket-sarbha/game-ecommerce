
export default function GameCard({ game }) {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full" src="/public/images/download.jpe" alt="Game Image" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{game.gameName}</div>
      </div>
    </div>
  );
}
