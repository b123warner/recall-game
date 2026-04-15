import { useGameStore } from '../../store/gameStore';

const LABELS = ['A', 'B', 'C', 'D'];

export default function AnswerRevealScreen() {
  const { currentQuestion, selectedAnswerIndex, players, currentPlayerIndex, scores, advanceRound } = useGameStore();

  if (!currentQuestion) return null;

  const activePlayer = players[currentPlayerIndex];
  const isCorrect = selectedAnswerIndex === currentQuestion.correctIndex;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center gap-8 p-8">
      {/* Result banner */}
      <div className={`w-full max-w-4xl rounded-2xl py-6 px-8 text-center ${isCorrect ? 'bg-green-700' : 'bg-red-800'}`}>
        <p className="text-3xl font-bold">
          {isCorrect ? `✓ Correct! +1 point for ${activePlayer?.name}` : `✗ Wrong!`}
        </p>
      </div>

      {/* Question (reminder) */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6">
        <p className="text-2xl text-gray-300 text-center">{currentQuestion.question}</p>
      </div>

      {/* Answers */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.answers.map((answer, i) => {
          const isCorrectAnswer = i === currentQuestion.correctIndex;
          const wasSelected = i === selectedAnswerIndex;

          let bg = 'bg-gray-800';
          if (isCorrectAnswer) bg = 'bg-green-700';
          else if (wasSelected && !isCorrectAnswer) bg = 'bg-red-800';

          return (
            <div
              key={i}
              className={`flex items-center gap-4 ${bg} text-white text-2xl font-medium px-6 py-5 rounded-2xl`}
            >
              <span className="font-bold w-8 shrink-0">{LABELS[i]}</span>
              {answer}
              {isCorrectAnswer && <span className="ml-auto">✓</span>}
              {wasSelected && !isCorrectAnswer && <span className="ml-auto">✗</span>}
            </div>
          );
        })}
      </div>

      {/* Scores summary */}
      <div className="w-full max-w-4xl flex flex-wrap gap-4 justify-center">
        {players.map((p) => (
          <div key={p.id} className="bg-gray-800 px-6 py-3 rounded-xl text-center">
            <p className="text-gray-400 text-sm">{p.name}</p>
            <p className="text-3xl font-bold">{scores[p.id] ?? 0}</p>
          </div>
        ))}
      </div>

      <button
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold px-14 py-5 rounded-2xl transition-colors mt-4"
        onClick={advanceRound}
      >
        Next Round →
      </button>
    </div>
  );
}
