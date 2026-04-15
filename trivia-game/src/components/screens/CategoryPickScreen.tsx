import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { fetchOtdbCategories, fetchQuestions, type OtdbCategory } from '../../services/questionEngine';
import { getLocalCategories, fetchLocalQuestions } from '../../services/localQuestionService';

export default function CategoryPickScreen() {
  const { players, currentPlayerIndex, totalRounds, roundNumber, questionSource, loadQuestions } = useGameStore();
  const [otdbCategories, setOtdbCategories] = useState<OtdbCategory[]>([]);
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const activePlayer = players[currentPlayerIndex];

  useEffect(() => {
    setLoading(true);
    setError('');
    if (questionSource === 'local') {
      getLocalCategories()
        .then(setLocalCategories)
        .catch(() => setError('Failed to load local question bank.'))
        .finally(() => setLoading(false));
    } else {
      fetchOtdbCategories()
        .then(setOtdbCategories)
        .catch(() => setError('Failed to load categories. Check your connection.'))
        .finally(() => setLoading(false));
    }
  }, [questionSource]);

  async function handlePickOtdb(cat: OtdbCategory) {
    setFetching(true);
    setError('');
    try {
      const questions = await fetchQuestions({ category: cat.name, categoryId: cat.id, amount: 1 });
      loadQuestions(questions);
    } catch {
      setError('Failed to fetch questions. Try another category.');
      setFetching(false);
    }
  }

  async function handlePickLocal(category: string) {
    setFetching(true);
    setError('');
    try {
      const questions = await fetchLocalQuestions(category, 1);
      loadQuestions(questions);
    } catch {
      setError('Failed to load questions. Try another category.');
      setFetching(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center gap-8 p-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-gray-400 text-xl">Round {roundNumber} of {totalRounds}</p>
        <h2 className="text-4xl font-bold mt-1">
          <span className="text-indigo-400">{activePlayer?.name}</span>, pick a category
        </h2>
      </div>

      {error && <p className="text-red-400 text-lg">{error}</p>}

      {loading ? (
        <p className="text-gray-400 text-xl mt-16">Loading categories...</p>
      ) : fetching ? (
        <p className="text-gray-400 text-xl mt-16">Loading question...</p>
      ) : questionSource === 'local' ? (
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-3">
          {localCategories.map((cat) => (
            <button
              key={cat}
              className="bg-gray-800 hover:bg-indigo-700 text-white text-lg font-medium px-5 py-4 rounded-xl text-left transition-colors"
              onClick={() => handlePickLocal(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-3">
          {otdbCategories.map((cat) => (
            <button
              key={cat.id}
              className="bg-gray-800 hover:bg-indigo-700 text-white text-lg font-medium px-5 py-4 rounded-xl text-left transition-colors"
              onClick={() => handlePickOtdb(cat)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
