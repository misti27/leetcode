import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('App.tsx', 'utf8');

assert.match(
  source,
  /<main className=\{`flex-1 overflow-y-auto custom-scrollbar \$\{t\.bg\} relative transition-colors duration-300`\}>/,
  'Main content area should reuse the custom-scrollbar class'
);
