import type { Question } from '../types';

interface RawTriviaQuestion {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface RawFamilyFeudQuestion {
  id: string;
  category: 'Family Feud';
  question: string;
  answers: string[];
  correctIndex: number;
}

let triviaCache: RawTriviaQuestion[] | null = null;
let familyFeudCache: RawFamilyFeudQuestion[] | null = null;

async function loadTrivia(): Promise<RawTriviaQuestion[]> {
  if (triviaCache) return triviaCache;
  const res = await fetch('/trivia-questions.json');
  if (!res.ok) throw new Error('Failed to load local trivia bank');
  triviaCache = await res.json() as RawTriviaQuestion[];
  return triviaCache;
}

async function loadFamilyFeud(): Promise<RawFamilyFeudQuestion[]> {
  if (familyFeudCache) return familyFeudCache;
  const res = await fetch('/family-feud-questions.json');
  if (!res.ok) throw new Error('Failed to load Family Feud question bank');
  familyFeudCache = await res.json() as RawFamilyFeudQuestion[];
  return familyFeudCache;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function getLocalCategories(): Promise<string[]> {
  const [trivia, ff] = await Promise.all([loadTrivia(), loadFamilyFeud()]);
  const cats = new Set([
    ...trivia.map((q) => q.category),
    ...ff.map((q) => q.category),
  ]);
  return [...cats].sort();
}

export async function fetchLocalQuestions(category: string, amount: number): Promise<Question[]> {
  if (category === 'Family Feud') {
    const all = await loadFamilyFeud();
    if (all.length < amount) throw new Error('Not enough Family Feud questions');
    return shuffle(all).slice(0, amount).map((q) => ({
      id: `ff-${q.id}`,
      question: q.question,
      answers: q.answers,
      correctIndex: q.correctIndex,
      category: q.category,
      difficulty: 'medium' as const,
      source: 'local' as const,
    }));
  }

  const all = await loadTrivia();
  const pool = all.filter((q) => q.category === category);
  if (pool.length < 4) throw new Error(`Not enough questions in category: ${category}`);

  const answerPool = pool.map((q) => q.answer);
  const picked = shuffle(pool).slice(0, amount);

  return picked.map((q) => {
    const wrongOptions = shuffle(answerPool.filter((a) => a !== q.answer)).slice(0, 3);
    const answers = shuffle([q.answer, ...wrongOptions]);
    return {
      id: q.id,
      question: q.question,
      answers,
      correctIndex: answers.indexOf(q.answer),
      category: q.category,
      difficulty: 'medium' as const,
      source: 'local' as const,
    };
  });
}
