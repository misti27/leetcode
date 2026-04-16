import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('services/geminiService.ts', 'utf8');

assert.equal(
  /const\s+ai\s*=\s*new\s+GoogleGenAI\s*\(/.test(source),
  false,
  'geminiService.ts should not create a GoogleGenAI client at module load time'
);
