import { useGameStore } from '../../store/gameStore';

const LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionScreen() {
  const { currentQuestion, players, currentPlayerIndex, roundNumber, totalRounds, selectAnswer } = useGameStore();

  if (!currentQuestion) return null;

  const activePlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center gap-8 p-8">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center text-gray-400 text-lg">
        <span>{currentQuestion.category}</span>
        <span>Round {roundNumber} of {totalRounds}</span>
        <span className="capitalize">{currentQuestion.difficulty}</span>
      </div>

      {/* Question */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-8 mt-4">
        <p className="text-4xl font-semibold leading-snug text-center">
          {currentQuestion.question}
        </p>
      </div>

      {/* Answers */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.answers.map((answer, i) => (
          <button
            key={i}
            className="flex items-center gap-4 bg-gray-800 hover:bg-indigo-700 text-white text-2xl font-medium px-6 py-5 rounded-2xl text-left transition-colors"
            onClick={() => selectAnswer(i)}
          >
            <span className="text-indigo-400 font-bold w-8 shrink-0">{LABELS[i]}</span>
            {answer}
          </button>
        ))}
      </div>

      {/* Active player indicator */}
      <p className="text-gray-400 text-xl mt-4">
        <span className="text-white font-semibold">{activePlayer?.name}</span> is answering
      </p>
    </div>
  );
}
