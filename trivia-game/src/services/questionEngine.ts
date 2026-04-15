import type { Question } from '../types';
import { fetchOtdbQuestions, fetchOtdbCategories, type OtdbCategory } from './otdbService';

export type { OtdbCategory };

export interface QuestionRequest {
  category: string;
  categoryId: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  amount: number;
}

export async function fetchQuestions(req: QuestionRequest): Promise<Question[]> {
  return fetchOtdbQuestions(req.amount, req.categoryId, req.difficulty);
}

export { fetchOtdbCategories };
