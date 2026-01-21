#!/usr/bin/env node

/**
 * Markdown Fixer Script
 *
 * Fixes common markdown formatting issues in course files:
 * - Converts single backtick code blocks to triple backticks
 * - Fixes check50/submit50 commands format
 * - Fixes text running together issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixMarkdown(content) {
  let fixed = content;

  // Fix check50/submit50 commands that have backticks breaking the command
  // Pattern: `check50 cs50/problems/2022/python/`name -> proper code block
  fixed = fixed.replace(/`(check50|submit50) (cs50\/problems\/\d+\/python\/)`(\w+)/g, (match, cmd, path, name) => {
    return `\n\n\`\`\`bash\n${cmd} ${path}${name}\n\`\`\``;
  });

  // Fix inline code that should be code blocks (multiline code with single backticks)
  // Pattern: - `for c in s:\n    print(c, end="")\n` -> proper code block
  fixed = fixed.replace(/- `(for \w+ in \w+:[\s\S]*?)`\n/g, (match, code) => {
    if (code.includes('\n')) {
      return `\n\`\`\`python\n${code.trim()}\n\`\`\`\n\n`;
    }
    return match;
  });

  // Fix inline code that should be code blocks (def statements)
  fixed = fixed.replace(/`(def \w+\([^)]*\):[\s\S]*?)`([^`])/g, (match, code, after) => {
    if (code.includes('\n') || code.includes('...')) {
      return `\n\n\`\`\`python\n${code.trim()}\n\`\`\`\n\n${after}`;
    }
    return match;
  });

  // Fix text running together after code: `code`text -> `code`\n\ntext
  fixed = fixed.replace(/`([^`]+)`([ა-ჰ])/g, '`$1`\n\n$2');

  // Fix **heading**text -> **heading**\n\ntext
  fixed = fixed.replace(/\*\*([^*]+)\*\*([ა-ჰ])/g, '**$1**\n\n$2');

  // Fix mkdir commands with space before folder name
  // `mkdir `folder -> `mkdir folder`
  fixed = fixed.replace(/`mkdir `(\w+)/g, '`mkdir $1`');

  // Fix code with trailing space before hyphen: `file.py `- -> `file.py` -
  fixed = fixed.replace(/`(\w+\.py) `(-)/g, '`$1` $2');

  // Fix code with trailing space at end: `file.py ` ფაილში -> `file.py` ფაილში
  fixed = fixed.replace(/`(\w+\.py) ` (ფაილში)/g, '`$1` $2');

  // Fix cd commands with space issues
  // cd folder (not in backticks) after numbered list item
  fixed = fixed.replace(/(\d+\.\s+)შემდეგ გაუშვი cd (\w+)/g, '$1შემდეგ გაუშვი `cd $2`');

  // Fix code filename mentions with trailing space
  // `filename.py ` -> `filename.py`
  fixed = fixed.replace(/`(\w+\.py) `/g, '`$1`');

  // Fix broken "ფაილში." text that got separated
  fixed = fixed.replace(/`(\w+\.py) `\n\nფაილში\./g, '`$1` ფაილში.');

  // Fix broken code blocks that wrap text incorrectly
  // ```\ntext that's not code\n``` -> remove the code block markers
  fixed = fixed.replace(/```\n(შემდეგ გაუშვი [^\n]+)\n```/g, '$1');

  // Clean up multiple empty lines
  fixed = fixed.replace(/\n{4,}/g, '\n\n\n');

  // Remove orphaned "ფაილში." on its own line
  fixed = fixed.replace(/\n\nფაილში\.\n/g, ' ფაილში.\n');

  return fixed;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixed = fixMarkdown(content);

  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed);
    return true;
  }
  return false;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.md')) {
      callback(filePath);
    }
  }
}

async function main() {
  const coursesDir = path.join(__dirname, '..', 'public', 'courses');

  if (!fs.existsSync(coursesDir)) {
    console.error('Courses directory not found:', coursesDir);
    process.exit(1);
  }

  console.log('Fixing markdown files in:', coursesDir);
  console.log('');

  let fixedCount = 0;
  let totalCount = 0;

  walkDir(coursesDir, (filePath) => {
    totalCount++;
    const wasFixed = processFile(filePath);
    if (wasFixed) {
      fixedCount++;
      console.log('Fixed:', path.relative(coursesDir, filePath));
    }
  });

  console.log('');
  console.log(`Done! Fixed ${fixedCount}/${totalCount} files.`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
