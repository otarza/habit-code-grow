#!/usr/bin/env node

/**
 * External Media Downloader
 *
 * Scans markdown files for external URLs (images, media),
 * downloads them locally, and updates the markdown to use relative paths.
 *
 * Usage:
 *   node scripts/download-external-media.js [options]
 *
 * Options:
 *   --dry-run       Show what would be downloaded without actually doing it
 *   --path <dir>    Scan only a specific directory (default: public/courses)
 *   --verbose       Show detailed progress
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Configuration
const config = {
  // Where to store downloaded media (relative to public folder)
  mediaDir: 'media/external',

  // File extensions to download
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp'],
  videoExtensions: ['.mp4', '.webm', '.ogg', '.mov'],
  audioExtensions: ['.mp3', '.wav', '.ogg', '.m4a'],
  documentExtensions: ['.pdf'],

  // Domains to skip (already local or should stay external)
  skipDomains: [
    'youtube.com',
    'www.youtube.com',
    'youtu.be',
    'vimeo.com',
    'player.vimeo.com',
    'asciinema.org',
    'github.com',
    'raw.githubusercontent.com',
    'gist.github.com',
    'codepen.io',
    'jsfiddle.net',
    'codesandbox.io',
    'localhost',
    '127.0.0.1',
  ],

  // URL patterns to match in markdown
  urlPatterns: [
    // Markdown images: ![alt](url)
    /!\[[^\]]*\]\(([^)\s]+)\)/g,
    // HTML img tags: <img src="url">
    /<img[^>]+src=["']([^"']+)["']/gi,
    // HTML source tags: <source src="url">
    /<source[^>]+src=["']([^"']+)["']/gi,
    // HTML video/audio tags with src
    /<(?:video|audio)[^>]+src=["']([^"']+)["']/gi,
    // Background images in inline styles
    /url\(["']?([^"')]+)["']?\)/gi,
    // Direct URLs that look like images (standalone on a line)
    /^(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|svg|webp|pdf))$/gim,
  ],

  // Request timeout in ms
  timeout: 30000,

  // Max concurrent downloads
  maxConcurrent: 5,
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose'),
  path: null,
};

const pathIndex = args.indexOf('--path');
if (pathIndex !== -1 && args[pathIndex + 1]) {
  options.path = args[pathIndex + 1];
}

// Statistics
const stats = {
  filesScanned: 0,
  urlsFound: 0,
  urlsSkipped: 0,
  urlsDownloaded: 0,
  urlsFailed: 0,
  bytesDownloaded: 0,
};

// URL to local path mapping (to avoid re-downloading same URL)
const urlCache = new Map();

/**
 * Get all supported extensions
 */
function getAllExtensions() {
  return [
    ...config.imageExtensions,
    ...config.videoExtensions,
    ...config.audioExtensions,
    ...config.documentExtensions,
  ];
}

/**
 * Check if URL should be skipped
 */
function shouldSkipUrl(url) {
  try {
    const urlObj = new URL(url);

    // Skip non-http(s) URLs
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return true;
    }

    // Skip domains in skiplist
    const hostname = urlObj.hostname.toLowerCase();
    if (config.skipDomains.some(domain => hostname.includes(domain))) {
      return true;
    }

    // Check if it's a supported file type
    const ext = path.extname(urlObj.pathname).toLowerCase();
    const allExtensions = getAllExtensions();

    // If no extension, try to determine from URL path
    if (!ext) {
      return true; // Skip URLs without file extensions
    }

    if (!allExtensions.includes(ext)) {
      return true;
    }

    return false;
  } catch {
    return true; // Invalid URL
  }
}

/**
 * Generate a safe filename from URL
 */
function generateLocalPath(url, mdFilePath) {
  try {
    const urlObj = new URL(url);
    const ext = path.extname(urlObj.pathname).toLowerCase() || '.bin';

    // Create a hash of the URL for uniqueness
    const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);

    // Extract a readable name from the URL path
    let basename = path.basename(urlObj.pathname, ext);
    // Clean up the basename
    basename = basename.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);

    if (!basename) {
      basename = 'file';
    }

    // Determine subdirectory based on file type
    let subdir = 'other';
    if (config.imageExtensions.includes(ext)) {
      subdir = 'images';
    } else if (config.videoExtensions.includes(ext)) {
      subdir = 'videos';
    } else if (config.audioExtensions.includes(ext)) {
      subdir = 'audio';
    } else if (config.documentExtensions.includes(ext)) {
      subdir = 'documents';
    }

    const filename = `${basename}-${hash}${ext}`;
    const localPath = path.join(config.mediaDir, subdir, filename);

    return localPath;
  } catch {
    return null;
  }
}

/**
 * Download a file from URL
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullDestPath = path.join(projectRoot, 'public', destPath);

    // Create directory if it doesn't exist
    const dir = path.dirname(fullDestPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      timeout: config.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MediaDownloader/1.0)',
        'Accept': '*/*',
      },
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        const redirectUrl = new URL(response.headers.location, url).href;
        downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(fullDestPath);
      let downloadedBytes = 0;

      response.pipe(fileStream);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
      });

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(downloadedBytes);
      });

      fileStream.on('error', (err) => {
        fs.unlink(fullDestPath, () => {}); // Clean up partial file
        reject(err);
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Calculate relative path from markdown file to downloaded media
 */
function getRelativePath(mdFilePath, localMediaPath) {
  // mdFilePath is relative to project root (e.g., public/courses/python/topic/lesson.md)
  // localMediaPath is relative to public folder (e.g., media/external/images/file.png)

  const mdDir = path.dirname(mdFilePath);
  const mediaFullPath = path.join('public', localMediaPath);

  // Calculate relative path from md file's directory to the media file
  let relativePath = path.relative(mdDir, mediaFullPath);

  // Ensure forward slashes for URLs
  relativePath = relativePath.replace(/\\/g, '/');

  return relativePath;
}

/**
 * Extract all external URLs from markdown content
 */
function extractUrls(content) {
  const urls = new Set();

  for (const pattern of config.urlPatterns) {
    // Reset regex state
    pattern.lastIndex = 0;

    let match;
    while ((match = pattern.exec(content)) !== null) {
      const url = match[1];
      if (url && url.startsWith('http')) {
        urls.add(url);
      }
    }
  }

  return Array.from(urls);
}

/**
 * Process a single markdown file
 */
async function processMarkdownFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;

  const urls = extractUrls(content);
  stats.urlsFound += urls.length;

  if (options.verbose && urls.length > 0) {
    console.log(`\n  Found ${urls.length} URLs in ${filePath}`);
  }

  for (const url of urls) {
    if (shouldSkipUrl(url)) {
      stats.urlsSkipped++;
      if (options.verbose) {
        console.log(`    [SKIP] ${url.substring(0, 60)}...`);
      }
      continue;
    }

    // Check cache first
    if (urlCache.has(url)) {
      const localPath = urlCache.get(url);
      const relativePath = getRelativePath(filePath, localPath);
      content = content.split(url).join(relativePath);
      if (options.verbose) {
        console.log(`    [CACHE] ${url.substring(0, 50)}...`);
      }
      continue;
    }

    const localPath = generateLocalPath(url, filePath);
    if (!localPath) {
      stats.urlsSkipped++;
      continue;
    }

    if (options.dryRun) {
      console.log(`    [DRY-RUN] Would download: ${url}`);
      console.log(`              To: public/${localPath}`);
      stats.urlsDownloaded++;
      continue;
    }

    try {
      if (options.verbose) {
        process.stdout.write(`    [DOWNLOADING] ${url.substring(0, 50)}...`);
      }

      const bytes = await downloadFile(url, localPath);
      stats.urlsDownloaded++;
      stats.bytesDownloaded += bytes;

      // Cache the mapping
      urlCache.set(url, localPath);

      // Replace URL in content
      const relativePath = getRelativePath(filePath, localPath);
      content = content.split(url).join(relativePath);

      if (options.verbose) {
        console.log(` OK (${formatBytes(bytes)})`);
      }
    } catch (error) {
      stats.urlsFailed++;
      if (options.verbose) {
        console.log(` FAILED: ${error.message}`);
      } else {
        console.log(`    [FAILED] ${url}: ${error.message}`);
      }
    }
  }

  // Write updated content if changed
  if (content !== originalContent && !options.dryRun) {
    fs.writeFileSync(fullPath, content, 'utf8');
    if (options.verbose) {
      console.log(`    [UPDATED] ${filePath}`);
    }
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Walk directory recursively and find all .md files
 */
function findMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        findMarkdownFiles(fullPath, files);
      }
    } else if (entry.name.endsWith('.md')) {
      files.push(path.relative(projectRoot, fullPath));
    }
  }

  return files;
}

/**
 * Main function
 */
async function main() {
  console.log('External Media Downloader');
  console.log('=========================\n');

  if (options.dryRun) {
    console.log('DRY RUN MODE - No files will be downloaded or modified\n');
  }

  // Determine scan path
  const scanPath = options.path
    ? path.join(projectRoot, options.path)
    : path.join(projectRoot, 'public', 'courses');

  if (!fs.existsSync(scanPath)) {
    console.error(`Error: Path does not exist: ${scanPath}`);
    process.exit(1);
  }

  console.log(`Scanning: ${scanPath}\n`);

  // Find all markdown files
  const mdFiles = findMarkdownFiles(scanPath);
  stats.filesScanned = mdFiles.length;

  console.log(`Found ${mdFiles.length} markdown files\n`);

  // Process files
  for (let i = 0; i < mdFiles.length; i++) {
    const file = mdFiles[i];

    if (!options.verbose) {
      process.stdout.write(`\rProcessing: ${i + 1}/${mdFiles.length} files...`);
    } else {
      console.log(`[${i + 1}/${mdFiles.length}] ${file}`);
    }

    await processMarkdownFile(file);
  }

  if (!options.verbose) {
    console.log('\n');
  }

  // Print summary
  console.log('\nSummary');
  console.log('-------');
  console.log(`Files scanned:    ${stats.filesScanned}`);
  console.log(`URLs found:       ${stats.urlsFound}`);
  console.log(`URLs skipped:     ${stats.urlsSkipped}`);
  console.log(`URLs downloaded:  ${stats.urlsDownloaded}`);
  console.log(`URLs failed:      ${stats.urlsFailed}`);
  if (!options.dryRun) {
    console.log(`Total downloaded: ${formatBytes(stats.bytesDownloaded)}`);
  }

  if (options.dryRun) {
    console.log('\nRun without --dry-run to actually download files.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
