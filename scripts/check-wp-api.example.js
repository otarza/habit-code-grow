#!/usr/bin/env node

/**
 * Diagnostic script to check available WordPress/TutorLMS API endpoints
 *
 * USAGE:
 *   1. Copy this file to check-wp-api.js
 *   2. Update the CONFIG object with your credentials
 *   3. Run: node scripts/check-wp-api.js
 *   4. NEVER commit check-wp-api.js to git!
 */

import https from 'https';

const CONFIG = {
  wpUrl: process.env.WP_URL || 'https://www.bitcamp.ge',
  username: process.env.WP_USERNAME || 'YOUR_USERNAME',
  appPassword: process.env.WP_APP_PASSWORD || 'YOUR APP PASSWORD HERE',
  courseId: process.env.COURSE_ID || 10592,
};

// Validate configuration
if (CONFIG.username === 'YOUR_USERNAME' || CONFIG.appPassword === 'YOUR APP PASSWORD HERE') {
  console.error('ERROR: Please configure your credentials first!');
  console.log('\nOption 1: Set environment variables:');
  console.log('  WP_USERNAME=your_user WP_APP_PASSWORD="your pass" node scripts/check-wp-api.js');
  console.log('\nOption 2: Copy this file to check-wp-api.js and edit the CONFIG object');
  process.exit(1);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const auth = Buffer.from(`${CONFIG.username}:${CONFIG.appPassword}`).toString('base64');

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function checkEndpoint(name, url) {
  try {
    const result = await makeRequest(url);
    console.log(`\n${name}:`);
    console.log(`  Status: ${result.status}`);
    if (result.status === 200) {
      try {
        const json = JSON.parse(result.data);
        if (Array.isArray(json)) {
          console.log(`  Result: Array with ${json.length} items`);
          if (json.length > 0) {
            console.log(`  First item keys: ${Object.keys(json[0]).join(', ')}`);
          }
        } else {
          console.log(`  Result keys: ${Object.keys(json).slice(0, 10).join(', ')}...`);
        }
      } catch {
        console.log(`  Result: ${result.data.slice(0, 200)}...`);
      }
    } else {
      console.log(`  Error: ${result.data.slice(0, 200)}`);
    }
  } catch (err) {
    console.log(`\n${name}: ERROR - ${err.message}`);
  }
}

async function main() {
  console.log('Checking WordPress/TutorLMS API endpoints...');
  console.log('='.repeat(60));

  await checkEndpoint('WP REST API Root', `${CONFIG.wpUrl}/wp-json/`);
  await checkEndpoint('WP REST API Index', `${CONFIG.wpUrl}/wp-json/wp/v2/`);
  await checkEndpoint('TutorLMS API', `${CONFIG.wpUrl}/wp-json/tutor/v1/`);
  await checkEndpoint('WP Courses (courses)', `${CONFIG.wpUrl}/wp-json/wp/v2/courses`);
  await checkEndpoint(`WP Course ${CONFIG.courseId}`, `${CONFIG.wpUrl}/wp-json/wp/v2/courses/${CONFIG.courseId}?_embed`);
  await checkEndpoint('WP Lessons', `${CONFIG.wpUrl}/wp-json/wp/v2/lesson?per_page=5`);
  await checkEndpoint('WP Topics', `${CONFIG.wpUrl}/wp-json/wp/v2/topics?per_page=5`);
  await checkEndpoint(`Lessons for course ${CONFIG.courseId}`, `${CONFIG.wpUrl}/wp-json/wp/v2/lesson?course=${CONFIG.courseId}&per_page=5`);
  await checkEndpoint('WP Post Types', `${CONFIG.wpUrl}/wp-json/wp/v2/types`);

  console.log('\n' + '='.repeat(60));
  console.log('Diagnostic complete');
}

main();
