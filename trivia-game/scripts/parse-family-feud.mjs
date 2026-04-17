/**
 * Parses FamilyFeudQuestionDatabase.xlsx and writes
 * public/family-feud-questions.json for use as an offline question source.
 *
 * Each question stores the 3 answers pre-shuffled with correctIndex already set
 * (Answer 1 from the Excel is considered the correct answer).
 *
 * Run from the trivia-game directory:
 *   node scripts/parse-family-feud.mjs
 */

import XLSX from 'xlsx';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Sheets where answers have point columns interleaved:
//   [Q, A1, #1, A2, #2, A3, #3, ...]  → answer indices 1, 3, 5
const POINT_SHEETS = ['3 Answers', '4 Answers', '5 Answers', '6 Answers', '7 Answers'];

// Sheets where answers follow the question directly (no points):
//   [Q, A1, A2, A3, ...]  → answer indices 1, 2, 3
const NO_POINT_SHEETS = ['No Points 3', 'No Points 4', 'No Points 5', 'No Points 6', 'No Points 7'];

const wb = XLSX.readFile(path.join(__dirname, '../../FamilyFeudQuestionDatabase.xlsx'));

const questions = [];

for (const sheetName of POINT_SHEETS) {
  const ws = wb.Sheets[sheetName];
  if (!ws) continue;
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  for (const row of rows.slice(1)) {
    const q = row[0];
    const a1 = row[1];
    const a2 = row[3];
    const a3 = row[5];
    if (!q || a1 === null || a1 === undefined || a2 === null || a2 === undefined || a3 === null || a3 === undefined) continue;
    const question = String(q).trim();
    const correct = String(a1).trim();
    const wrong1 = String(a2).trim();
    const wrong2 = String(a3).trim();
    if (!question || !correct || !wrong1 || !wrong2) continue;

    const answers = shuffle([correct, wrong1, wrong2]);
    questions.push({
      id: String(questions.length + 1),
      category: 'Family Feud',
      question,
      answers,
      correctIndex: answers.indexOf(correct),
    });
  }
}

for (const sheetName of NO_POINT_SHEETS) {
  const ws = wb.Sheets[sheetName];
  if (!ws) continue;
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  for (const row of rows.slice(1)) {
    const q = row[0];
    const a1 = row[1];
    const a2 = row[2];
    const a3 = row[3];
    if (!q || a1 === null || a1 === undefined || a2 === null || a2 === undefined || a3 === null || a3 === undefined) continue;
    const question = String(q).trim();
    const correct = String(a1).trim();
    const wrong1 = String(a2).trim();
    const wrong2 = String(a3).trim();
    if (!question || !correct || !wrong1 || !wrong2) continue;

    const answers = shuffle([correct, wrong1, wrong2]);
    questions.push({
      id: String(questions.length + 1),
      category: 'Family Feud',
      question,
      answers,
      correctIndex: answers.indexOf(correct),
    });
  }
}

mkdirSync(path.join(__dirname, '../public'), { recursive: true });
writeFileSync(
  path.join(__dirname, '../public/family-feud-questions.json'),
  JSON.stringify(questions),
);
console.log(`Wrote ${questions.length} Family Feud questions to public/family-feud-questions.json`);
