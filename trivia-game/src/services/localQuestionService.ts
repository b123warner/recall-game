import type { Question } from '../types';

interface RawQuestion {
  id: string;
  category: string;
  question: string;
  answer: string;
}

let cache: RawQuestion[] | null = null;

async function loadAll(): Promise<RawQuestion[]> {
  if (cache) return cache;
  const res = await fetch('/trivia-questions.json');
  if (!res.ok) throw new Error('Failed to load local question bank');
  cache = await res.json() as RawQuestion[];
  return cache;
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
  const all = await loadAll();
  const cats = new Set(all.map((q) => q.category));
  return [...cats].sort();
}

export async function fetchLocalQuestions(category: string, amount: number): Promise<Question[]> {
  const all = await loadAll();
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
