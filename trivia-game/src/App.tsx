import { useGameStore } from './store/gameStore';
import SetupScreen from './components/screens/SetupScreen';
import CategoryPickScreen from './components/screens/CategoryPickScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import AnswerRevealScreen from './components/screens/AnswerRevealScreen';
import ScoreboardScreen from './components/screens/ScoreboardScreen';
import WinnerScreen from './components/screens/WinnerScreen';

export default function App() {
  const phase = useGameStore((s) => s.phase);

  switch (phase) {
    case 'setup':         return <SetupScreen />;
    case 'category-pick': return <CategoryPickScreen />;
    case 'question':      return <QuestionScreen />;
    case 'answer-reveal': return <AnswerRevealScreen />;
    case 'score-update':  return <ScoreboardScreen />;
    case 'game-over':     return <WinnerScreen />;
  }
}
