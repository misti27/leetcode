import assert from 'node:assert/strict';
import fs from 'node:fs';

const appSource = fs.readFileSync('App.tsx', 'utf8');
const htmlSource = fs.readFileSync('index.html', 'utf8');

assert.match(appSource, /theme-light/, 'App.tsx should apply a theme-light class to the root element');
assert.match(appSource, /theme-dark/, 'App.tsx should apply a theme-dark class to the root element');
assert.match(appSource, /theme-eyecare/, 'App.tsx should apply a theme-eyecare class to the root element');

assert.match(htmlSource, /\.theme-light\s+\.custom-scrollbar::\-webkit-scrollbar-thumb/, 'index.html should define a light theme scrollbar thumb');
assert.match(htmlSource, /\.theme-dark\s+\.custom-scrollbar::\-webkit-scrollbar-thumb/, 'index.html should define a dark theme scrollbar thumb');
assert.match(htmlSource, /\.theme-eyecare\s+\.custom-scrollbar::\-webkit-scrollbar-thumb/, 'index.html should define an eyecare theme scrollbar thumb');
