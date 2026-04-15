import type { Question } from '../types';

// https://opentdb.com/api_category.php
export interface OtdbCategory {
  id: number;
  name: string;
}

interface OtdbApiQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OtdbApiResponse {
  response_code: number;
  results: OtdbApiQuestion[];
}

function decode(str: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function fetchOtdbCategories(): Promise<OtdbCategory[]> {
  const res = await fetch('https://opentdb.com/api_category.php');
  const data = await res.json();
  return data.trivia_categories as OtdbCategory[];
}

export async function fetchOtdbQuestions(
  amount: number,
  categoryId?: number,
  difficulty?: 'easy' | 'medium' | 'hard',
): Promise<Question[]> {
  const params = new URLSearchParams({ amount: String(amount), type: 'multiple' });
  if (categoryId) params.set('category', String(categoryId));
  if (difficulty) params.set('difficulty', difficulty);

  const res = await fetch(`https://opentdb.com/api.php?${params}`);
  const data: OtdbApiResponse = await res.json();

  if (data.response_code !== 0) {
    throw new Error(`OTDB response_code ${data.response_code}`);
  }

  return data.results.map((q) => {
    const correct = decode(q.correct_answer);
    const incorrects = q.incorrect_answers.map(decode);
    const answers = shuffle([correct, ...incorrects]);

    return {
      id: crypto.randomUUID(),
      question: decode(q.question),
      answers,
      correctIndex: answers.indexOf(correct),
      category: decode(q.category),
      difficulty: q.difficulty as Question['difficulty'],
      source: 'api',
    };
  });
}
