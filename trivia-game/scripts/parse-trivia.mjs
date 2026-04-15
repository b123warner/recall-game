/**
 * Parses Trivia-Printable.xlsx (the "Trivia" sheet) and writes
 * public/trivia-questions.json for use as an offline question source.
 *
 * Run from the trivia-game directory:
 *   node scripts/parse-trivia.mjs
 */

import XLSX from 'xlsx';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CATEGORY_MAP = {
  'Tech & Video Games': 'Technology & Video Games',
  'Mathematics & Geometry': 'Mathematics',
};

function normalizeCategory(cat) {
  const trimmed = cat.trim();
  return CATEGORY_MAP[trimmed] ?? trimmed;
}

const wb = XLSX.readFile(path.join(__dirname, '../../Trivia-Printable.xlsx'));
const ws = wb.Sheets['Trivia'];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

const questions = [];

for (const row of rows.slice(1)) {
  // Each row has 3 sets: [Cat, Q, A, null, Cat, Q, A, null, Cat, Q, A]
  for (let i = 0; i < 3; i++) {
    const base = i * 4;
    const cat = row[base];
    const q = row[base + 1];
    const a = row[base + 2];
    if (!cat || !q || a === null || a === undefined) continue;
    const category = normalizeCategory(String(cat));
    const question = String(q).trim();
    const answer = String(a).trim();
    if (!question || !answer) continue;
    questions.push({ id: String(questions.length + 1), category, question, answer });
  }
}

mkdirSync(path.join(__dirname, '../public'), { recursive: true });
writeFileSync(
  path.join(__dirname, '../public/trivia-questions.json'),
  JSON.stringify(questions),
);
console.log(`Wrote ${questions.length} questions across ${new Set(questions.map(q => q.category)).size} categories to public/trivia-questions.json`);
