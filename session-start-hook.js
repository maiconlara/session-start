const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const raw = readFileSync(join(__dirname, 'SKILL.md'), 'utf8');
const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

process.stdout.write(body);
