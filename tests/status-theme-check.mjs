import assert from 'node:assert/strict';
import fs from 'node:fs';

const appSource = fs.readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');

const darkVariantChecks = [
  {
    name: 'timeline status badges',
    pattern: /dark:(?:bg|text|ring)-[^\s"'`]*[\s\S]{0,240}(?:已掌握|学习中)|(?:已掌握|学习中)[\s\S]{0,240}dark:(?:bg|text|ring)-[^\s"'`]*/g,
  },
  {
    name: 'problem list status dots',
    pattern: /title=\{problem\.status === 'mastered' \? '已掌握' : '学习中'\}[\s\S]{0,240}dark:(?:bg|text|ring)-[^\s"'`]*/g,
  },
  {
    name: 'problem detail status controls',
    pattern: /selectedProblem\.status === 'mastered'[\s\S]{0,360}dark:(?:bg|text|ring)-[^\s"'`]*/g,
  },
];

for (const check of darkVariantChecks) {
  assert.equal(
    check.pattern.test(appSource),
    false,
    `${check.name} should use explicit theme classes instead of dark: variants`,
  );
}

assert.match(
  appSource,
  /const t = themeClasses\[theme\];\s+const statusT = statusThemeClasses\[theme\];\s+\n\s+\/\/ 1\. First, filter by search query/,
  'App should define statusT in the main component before rendering status-dependent sections',
);

assert.match(
  appSource,
  /problem\.status === 'mastered' && problem\.masteredAt[\s\S]{0,220}statusT\.masteredDateText/,
  'mastered date text should reuse the mastered status text color',
);

assert.match(
  appSource,
  /activeBlockId === item\.id[\s\S]{0,240}'border-indigo-500 font-medium text-indigo-600'[\s\S]{0,200}hover:text-indigo-600/,
  'right-side navigation hover text should use the same purple as the active accent',
);
