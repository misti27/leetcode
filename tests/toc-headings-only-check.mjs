import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('App.tsx', 'utf8');
const tocSectionMatch = source.match(/const tableOfContents = React\.useMemo\(\(\) => \{[\s\S]*?\}, \[selectedProblem\]\);/);

assert.ok(tocSectionMatch, 'Could not locate tableOfContents logic in App.tsx');

const tocSection = tocSectionMatch[0];

assert.equal(
  tocSection.includes('题目描述') || tocSection.includes('棰樼洰鎻忚堪'),
  false,
  'tableOfContents should not inject a "题目描述" item'
);

assert.equal(
  tocSection.includes('解法代码') || tocSection.includes('瑙ｆ硶浠ｇ爜'),
  false,
  'tableOfContents should not inject a code block TOC item'
);
