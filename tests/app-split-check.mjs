import assert from 'node:assert/strict';
import fs from 'node:fs';

const appSource = fs.readFileSync('App.tsx', 'utf8');

assert.match(appSource, /useTheme\(/, 'App.tsx should call useTheme()');
