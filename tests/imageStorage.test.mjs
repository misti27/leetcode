import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createImageRef,
  isImageRef,
  isInlineImageData,
  migrateInlineImageBlocks,
} from '../services/imageStorage.js';

test('migrateInlineImageBlocks converts inline image data into IndexedDB refs', async () => {
  const problems = [
    {
      id: '1',
      title: 'problem',
      blocks: [
        { id: 'a', type: 'text', content: 'plain text' },
        { id: 'b', type: 'image', content: 'data:image/png;base64,AAA' },
        { id: 'c', type: 'image', content: 'https://example.com/image.png' },
      ],
    },
  ];

  const storedPayloads = [];
  const result = await migrateInlineImageBlocks(problems, async (dataUrl) => {
    storedPayloads.push(dataUrl);
    return createImageRef(`stored-${storedPayloads.length}`);
  });

  assert.equal(result.changed, true);
  assert.deepEqual(storedPayloads, ['data:image/png;base64,AAA']);
  assert.equal(result.problems[0].blocks[0].content, 'plain text');
  assert.equal(result.problems[0].blocks[1].content, 'idb://image/stored-1');
  assert.equal(result.problems[0].blocks[2].content, 'https://example.com/image.png');
  assert.equal(isImageRef(result.problems[0].blocks[1].content), true);
  assert.equal(isInlineImageData(result.problems[0].blocks[1].content), false);
});

test('migrateInlineImageBlocks leaves already migrated content untouched', async () => {
  const problems = [
    {
      id: '2',
      title: 'problem',
      blocks: [
        { id: 'b', type: 'image', content: 'idb://image/existing' },
      ],
    },
  ];

  const result = await migrateInlineImageBlocks(problems, async () => {
    throw new Error('should not store already migrated images');
  });

  assert.equal(result.changed, false);
  assert.equal(result.problems, problems);
});
