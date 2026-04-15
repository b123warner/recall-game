import { useState } from 'react';
import { useGameStore, type QuestionSource } from '../../store/gameStore';

export default function SetupScreen() {
  const { players, totalRounds, questionSource, addPlayer, removePlayer, setTotalRounds, setQuestionSource, startGame } = useGameStore();
  const [nameInput, setNameInput] = useState('');

  function handleAddPlayer() {
    const name = nameInput.trim();
    if (!name || players.length >= 8) return;
    addPlayer(name);
    setNameInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAddPlayer();
  }

  const canStart = players.length >= 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-10 p-8">
      <h1 className="text-6xl font-bold tracking-tight">Trivia Night</h1>

      {/* Players */}
      <div className="w-full max-w-lg flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-gray-300">Players</h2>

        <div className="flex gap-3">
          <input
            className="flex-1 bg-gray-800 text-white text-xl px-4 py-3 rounded-xl border border-gray-700 outline-none focus:border-indigo-500"
            placeholder="Enter name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-semibold px-6 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={handleAddPlayer}
            disabled={!nameInput.trim() || players.length >= 8}
          >
            Add
          </button>
        </div>

        <ul className="flex flex-col gap-2">
          {players.map((p, i) => (
            <li key={p.id} className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-xl">
              <span className="text-xl">
                <span className="text-gray-500 mr-3">#{i + 1}</span>
                {p.name}
              </span>
              <button
                className="text-gray-500 hover:text-red-400 text-lg transition-colors"
                onClick={() => removePlayer(p.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Rounds */}
      <div className="w-full max-w-lg flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-gray-300">Rounds</h2>
        <div className="flex gap-3">
          {[5, 10, 15, 20].map((n) => (
            <button
              key={n}
              className={`flex-1 py-3 rounded-xl text-xl font-semibold transition-colors ${
                totalRounds === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setTotalRounds(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Question Source */}
      <div className="w-full max-w-lg flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-gray-300">Question Source</h2>
        <div className="flex gap-3">
          {([['otdb', 'Online (Open Trivia DB)'], ['local', 'Offline (Local Trivia)']] as [QuestionSource, string][]).map(([val, label]) => (
            <button
              key={val}
              className={`flex-1 py-3 rounded-xl text-lg font-semibold transition-colors ${
                questionSource === val
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setQuestionSource(val)}
            >
              {label}
            </button>
          ))}
        </div>
        {questionSource === 'local' && (
          <p className="text-gray-500 text-sm">45,000+ questions from the local trivia bank — no internet needed.</p>
        )}
      </div>

      {/* Start */}
      <button
        className="bg-green-600 hover:bg-green-500 text-white text-2xl font-bold px-16 py-5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        onClick={startGame}
        disabled={!canStart}
      >
        Start Game
      </button>

      {!canStart && (
        <p className="text-gray-500 text-lg">Add at least one player to start</p>
      )}
    </div>
  );
}
