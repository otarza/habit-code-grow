#!/usr/bin/env node

/**
 * TutorLMS JSON Import Script
 *
 * Imports course content from a TutorLMS JSON export file
 * and converts it to markdown files for the static site.
 *
 * Usage:
 *   node scripts/import-tutor-json.js <json-file> [--course-id <id>] [--slug <slug>]
 *
 * Examples:
 *   node scripts/import-tutor-json.js tutor-lms-data.json
 *   node scripts/import-tutor-json.js tutor-lms-data.json --course-id 10592 --slug python
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'public', 'courses'),
};

// ============================================================================
// Argument Parsing
// ============================================================================
function parseArgs(args) {
  const result = {
    jsonFile: null,
    courseId: null,
    slug: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--course-id' && args[i + 1]) {
      result.courseId = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--slug' && args[i + 1]) {
      result.slug = args[i + 1];
      i++;
    } else if (!args[i].startsWith('--')) {
      result.jsonFile = args[i];
    }
  }

  return result;
}

// ============================================================================
// HTML to Markdown Converter
// ============================================================================
function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // Remove scripts and styles
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Convert headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n');

  // Convert paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // Convert line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Convert bold
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');

  // Convert italic
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // Convert code blocks
  md = md.replace(/<pre[^>]*><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    (match, lang, code) => `\`\`\`${lang}\n${decodeHtmlEntities(code)}\n\`\`\`\n\n`);
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    (match, code) => `\`\`\`\n${decodeHtmlEntities(code)}\n\`\`\`\n\n`);
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi,
    (match, code) => `\`\`\`\n${decodeHtmlEntities(code)}\n\`\`\`\n\n`);

  // Convert inline code
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Convert links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Convert images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Convert unordered lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n') + '\n';
  });

  // Convert ordered lists
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    let counter = 0;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, text) => {
      counter++;
      return `${counter}. ${text}\n`;
    }) + '\n';
  });

  // Convert blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
    return content.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
  });

  // Convert horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

  // Handle iframes (video embeds)
  md = md.replace(/<iframe[^>]*src="([^"]*youtube[^"]*)"[^>]*><\/iframe>/gi, '\n\n{% youtube "$1" %}\n\n');
  md = md.replace(/<iframe[^>]*src="([^"]*vimeo[^"]*)"[^>]*><\/iframe>/gi, '\n\n{% vimeo "$1" %}\n\n');
  md = md.replace(/<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/gi, '\n\n{% embed "$1" %}\n\n');

  // Convert divs and spans (just extract content)
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n');
  md = md.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = decodeHtmlEntities(md);

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

function decodeHtmlEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&ndash;': '\u2013',
    '&mdash;': '\u2014',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&hellip;': '\u2026',
    '&copy;': '\u00A9',
    '&reg;': '\u00AE',
    '&trade;': '\u2122',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }

  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

  return result;
}

// ============================================================================
// Helper Functions
// ============================================================================
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function slugify(text, fallback = 'item') {
  if (!text) return fallback;

  const slug = text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens
    .substring(0, 50); // Limit length

  return slug || fallback;
}

function extractVideoInfo(meta) {
  const videoMeta = meta?._video?.[0];
  if (!videoMeta) return { videoUrl: '', videoDuration: '' };

  // Get video URL from various sources
  const videoUrl = videoMeta.source_youtube ||
                   videoMeta.source_vimeo ||
                   videoMeta.source_external_url ||
                   videoMeta.source_html5 ||
                   '';

  // Get duration
  const runtime = videoMeta.runtime;
  let videoDuration = '';
  if (runtime) {
    const hours = parseInt(runtime.hours) || 0;
    const minutes = parseInt(runtime.minutes) || 0;
    const seconds = parseInt(runtime.seconds) || 0;
    if (hours > 0) {
      videoDuration = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      videoDuration = `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
  } else if (videoMeta.playtime) {
    videoDuration = videoMeta.playtime;
  }

  return { videoUrl, videoDuration };
}

function escapeYamlString(str) {
  if (!str) return '';
  // Escape quotes and handle special characters
  return str.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function createCourseFrontmatter(course) {
  const title = escapeYamlString(course.post_title || '');
  const description = escapeYamlString(
    htmlToMarkdown(course.post_excerpt || '')
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 500)
  );
  const thumbnail = course.thumbnail_url || '';

  return `---
title: "${title}"
description: "${description}"
thumbnail: "${thumbnail}"
---

`;
}

function createTopicFrontmatter(topic, index) {
  const title = escapeYamlString(topic.post_title || '');
  return `---
title: "${title}"
order: ${index}
---

`;
}

function createLessonFrontmatter(lesson, topicIndex, lessonIndex) {
  const title = escapeYamlString(lesson.post_title || '');
  const { videoUrl, videoDuration } = extractVideoInfo(lesson.meta);
  const isPreview = lesson.meta?._is_preview?.[0] === '1';

  return `---
title: "${title}"
order: ${topicIndex * 100 + lessonIndex}
videoUrl: "${videoUrl}"
videoDuration: "${videoDuration}"
isPreview: ${isPreview}
---

`;
}

// ============================================================================
// Import Functions
// ============================================================================
function importCourse(course, outputDir, overrideSlug = null) {
  // Use override slug if provided, otherwise use post_name or generate from title
  const courseSlug = overrideSlug || course.post_name || slugify(course.post_title, 'course');
  const courseDir = path.join(outputDir, courseSlug);
  const mediaDir = path.join(courseDir, 'media');

  // Clean up existing directory
  if (fs.existsSync(courseDir)) {
    fs.rmSync(courseDir, { recursive: true });
  }

  ensureDir(courseDir);
  ensureDir(mediaDir);

  console.log(`\nImporting course: ${course.post_title}`);
  console.log(`  ID: ${course.ID}`);
  console.log(`  Slug: ${courseSlug}`);
  console.log(`  Output: ${courseDir}`);

  // Create course index file
  const courseContent = course.post_content || '';
  const courseMd = createCourseFrontmatter(course) + htmlToMarkdown(courseContent);
  fs.writeFileSync(path.join(courseDir, 'index.md'), courseMd);
  console.log('  Created index.md');

  // Process topics and lessons
  const exportedTopics = [];
  const contents = course.contents || [];

  let topicIndex = 0;
  for (const topic of contents) {
    if (topic.post_type !== 'topics') continue;

    topicIndex++;

    // Create clean topic slug with number prefix
    const topicSlugBase = slugify(topic.post_title, 'topic');
    const topicSlug = `${String(topicIndex).padStart(2, '0')}-${topicSlugBase}`;
    const topicDir = path.join(courseDir, topicSlug);
    ensureDir(topicDir);

    const topicTitle = topic.post_title || 'Topic';
    console.log(`  Topic ${topicIndex}: ${topicTitle}`);

    // Create topic index
    const topicContent = topic.post_content || '';
    const topicMd = createTopicFrontmatter(topic, topicIndex) + htmlToMarkdown(topicContent);
    fs.writeFileSync(path.join(topicDir, 'index.md'), topicMd);

    // Process lessons in this topic (only lessons, skip quizzes)
    const exportedLessons = [];
    const children = topic.children || [];

    let lessonIndex = 0;
    for (const lesson of children) {
      // Only process lessons, skip quizzes and other content types
      if (lesson.post_type !== 'lesson') {
        console.log(`    Skipping ${lesson.post_type}: ${lesson.post_title}`);
        continue;
      }

      lessonIndex++;
      const lessonTitle = lesson.post_title || 'Lesson';

      // Create clean lesson slug with number prefix
      const lessonSlugBase = slugify(lessonTitle, 'lesson');
      const lessonSlug = `${String(lessonIndex).padStart(2, '0')}-${lessonSlugBase}`;
      const lessonContent = lesson.post_content || '';

      const lessonMd = createLessonFrontmatter(lesson, topicIndex, lessonIndex) +
                       htmlToMarkdown(lessonContent);

      fs.writeFileSync(path.join(topicDir, `${lessonSlug}.md`), lessonMd);
      console.log(`    Lesson ${lessonIndex}: ${lessonTitle}`);

      const { videoUrl, videoDuration } = extractVideoInfo(lesson.meta);
      exportedLessons.push({
        id: lesson.ID,
        slug: lessonSlug,
        title: lessonTitle,
        order: topicIndex * 100 + lessonIndex,
        videoUrl: videoUrl || undefined,
        videoDuration: videoDuration || undefined,
        isPreview: lesson.meta?._is_preview?.[0] === '1',
      });
    }

    // Only add topic if it has lessons
    if (exportedLessons.length > 0) {
      exportedTopics.push({
        id: topic.ID,
        slug: topicSlug,
        title: topicTitle,
        order: topicIndex,
        lessons: exportedLessons,
      });
    } else {
      console.log(`    (No lessons in this topic)`);
    }
  }

  // Create manifest.json
  const manifest = {
    id: course.ID,
    title: course.post_title,
    slug: courseSlug,
    description: htmlToMarkdown(course.post_excerpt || '')
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 500),
    thumbnail: course.thumbnail_url || null,
    exportedAt: new Date().toISOString(),
    topics: exportedTopics,
  };

  fs.writeFileSync(
    path.join(courseDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Create course.json for backwards compatibility
  const metadata = {
    id: course.ID,
    title: course.post_title,
    slug: courseSlug,
    description: manifest.description,
    thumbnail: manifest.thumbnail,
    exportedAt: manifest.exportedAt,
  };

  fs.writeFileSync(
    path.join(courseDir, 'course.json'),
    JSON.stringify(metadata, null, 2)
  );

  // Calculate stats
  const totalLessons = exportedTopics.reduce((sum, t) => sum + t.lessons.length, 0);

  console.log(`  Created manifest.json and course.json`);
  console.log(`  Stats: ${exportedTopics.length} topics, ${totalLessons} lessons`);

  return courseDir;
}

// ============================================================================
// Main
// ============================================================================
async function main() {
  const args = process.argv.slice(2);
  const parsedArgs = parseArgs(args);

  if (!parsedArgs.jsonFile) {
    console.error('Usage: node scripts/import-tutor-json.js <json-file> [--course-id <id>] [--slug <slug>]');
    console.error('');
    console.error('Options:');
    console.error('  --course-id <id>  Import only the course with this ID');
    console.error('  --slug <slug>     Use this slug for the course (overrides default)');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/import-tutor-json.js tutor-lms-data.json');
    console.error('  node scripts/import-tutor-json.js tutor-lms-data.json --course-id 10592 --slug python');
    process.exit(1);
  }

  const jsonFilePath = path.resolve(parsedArgs.jsonFile);

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`Error: File not found: ${jsonFilePath}`);
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('TutorLMS JSON Import');
  console.log('='.repeat(60));
  console.log(`\nInput file: ${jsonFilePath}`);
  console.log(`Output directory: ${CONFIG.outputDir}`);

  if (parsedArgs.courseId) {
    console.log(`Filter: Course ID ${parsedArgs.courseId}`);
  }
  if (parsedArgs.slug) {
    console.log(`Override slug: ${parsedArgs.slug}`);
  }

  // Read and parse JSON
  console.log('\nReading JSON file...');
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  console.log(`Schema version: ${jsonData.schema_version}`);
  console.log(`Exported at: ${jsonData.exported_at}`);

  // Find courses data
  const coursesData = jsonData.data.find(d => d.content_type === 'courses');
  if (!coursesData) {
    console.error('Error: No courses found in JSON file');
    process.exit(1);
  }

  let courses = coursesData.data;
  console.log(`\nFound ${courses.length} course(s) in export`);

  // Filter by course ID if specified
  if (parsedArgs.courseId) {
    courses = courses.filter(c => c.ID === parsedArgs.courseId);
    if (courses.length === 0) {
      console.error(`Error: Course with ID ${parsedArgs.courseId} not found`);
      console.log('\nAvailable courses:');
      coursesData.data.forEach(c => {
        console.log(`  - ${c.ID}: ${c.post_title}`);
      });
      process.exit(1);
    }
  }

  ensureDir(CONFIG.outputDir);

  // Import each course
  let importedCount = 0;
  for (const course of courses) {
    try {
      importCourse(course, CONFIG.outputDir, parsedArgs.slug);
      importedCount++;
    } catch (err) {
      console.error(`\nError importing course "${course.post_title}": ${err.message}`);
      console.error(err.stack);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Import completed! ${importedCount}/${courses.length} courses imported.`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
