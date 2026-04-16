import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync('services/geminiService.ts', 'utf8');
const sourceFile = ts.createSourceFile(
  'services/geminiService.ts',
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

const diagnostics = sourceFile.parseDiagnostics.map((diagnostic) =>
  ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
);

assert.deepEqual(diagnostics, [], diagnostics.join('\n'));
