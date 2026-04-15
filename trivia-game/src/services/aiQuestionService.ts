import Anthropic from '@anthropic-ai/sdk';
import type { Question } from '../types';

const MODEL = 'claude-sonnet-4-20250514';

interface AiQuestion {
  question: string;
  answers: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

function getClient(): Anthropic {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!key) throw new Error('VITE_ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
}

export async function fetchAiQuestions(
  category: string,
  amount: number,
  difficulty?: 'easy' | 'medium' | 'hard',
): Promise<Question[]> {
  const client = getClient();

  const difficultyClause = difficulty ? ` The difficulty level should be ${difficulty}.` : '';

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Generate ${amount} trivia questions about the category: "${category}".${difficultyClause}

Return ONLY a JSON array with no additional text. Each object must match this exact shape:
{
  "question": "string",
  "answers": ["string", "string", "string", "string"],
  "correctIndex": number,
  "difficulty": "easy" | "medium" | "hard"
}

Rules:
- Exactly 4 answers per question
- correctIndex is the 0-based index of the correct answer in the answers array
- Vary which index is correct — do not always put the correct answer first
- Questions should be unambiguous with a single correct answer`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  // Strip markdown code fences if the model wraps the JSON
  const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  const parsed: AiQuestion[] = JSON.parse(jsonText);

  return parsed.map((q) => ({
    id: crypto.randomUUID(),
    question: q.question,
    answers: q.answers,
    correctIndex: q.correctIndex,
    category,
    difficulty: q.difficulty,
    source: 'ai',
  }));
}
