import { useGameStore } from '../../store/gameStore';

export default function WinnerScreen() {
  const { players, scores, resetGame } = useGameStore();

  const sorted = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  const topScore = scores[sorted[0]?.id] ?? 0;
  const winners = sorted.filter((p) => (scores[p.id] ?? 0) === topScore);
  const isTie = winners.length > 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-10 p-8">
      {/* Winner announcement */}
      <div className="text-center">
        <p className="text-6xl mb-4">{isTie ? '🤝' : '🏆'}</p>
        <h1 className="text-5xl font-bold">
          {isTie
            ? `It's a tie!`
            : `${winners[0].name} wins!`}
        </h1>
        {isTie && (
          <p className="text-2xl text-gray-400 mt-2">
            {winners.map((w) => w.name).join(' & ')} — {topScore} pts each
          </p>
        )}
      </div>

      {/* Final scores */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center justify-between px-6 py-4 rounded-2xl ${
              i === 0 ? 'bg-yellow-600' : 'bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-300 w-8">#{i + 1}</span>
              <span className="text-2xl font-semibold">{p.name}</span>
            </div>
            <span className="text-4xl font-bold">{scores[p.id] ?? 0}</span>
          </div>
        ))}
      </div>

      <button
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold px-14 py-5 rounded-2xl transition-colors"
        onClick={resetGame}
      >
        Play Again
      </button>
    </div>
  );
}
