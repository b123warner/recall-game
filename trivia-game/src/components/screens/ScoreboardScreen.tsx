import { useGameStore } from '../../store/gameStore';

export default function ScoreboardScreen() {
  const { players, scores, roundNumber, totalRounds, setPhase } = useGameStore();

  const sorted = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <p className="text-gray-400 text-xl">After round {roundNumber - 1} of {totalRounds}</p>
        <h2 className="text-4xl font-bold mt-1">Scoreboard</h2>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-3">
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center justify-between px-6 py-4 rounded-2xl ${
              i === 0 ? 'bg-yellow-600' : 'bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-400 w-8">#{i + 1}</span>
              <span className="text-2xl font-semibold">{p.name}</span>
            </div>
            <span className="text-4xl font-bold">{scores[p.id] ?? 0}</span>
          </div>
        ))}
      </div>

      <button
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold px-14 py-5 rounded-2xl transition-colors mt-4"
        onClick={() => setPhase('category-pick')}
      >
        Next Round →
      </button>
    </div>
  );
}
