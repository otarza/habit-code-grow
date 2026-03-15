import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const coursesDir = path.join(rootDir, 'public', 'courses');

// Base routes
const routes = [
    '/',
    '/ai',
    '/fullstack-ai',
    '/python-sql',
    '/courses'
];

// Dynamically extract all course routes
if (fs.existsSync(coursesDir)) {
    const courses = fs.readdirSync(coursesDir).filter(f => fs.statSync(path.join(coursesDir, f)).isDirectory());
    for (const courseSlug of courses) {
        routes.push(`/courses/${courseSlug}`); // Course landing
        
        const manifestPath = path.join(coursesDir, courseSlug, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
            try {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                if (manifest.topics) {
                    for (const topic of manifest.topics) {
                        if (topic.lessons) {
                            for (const lesson of topic.lessons) {
                                routes.push(`/courses/${courseSlug}/${topic.slug}/${lesson.slug}`);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(`Error reading manifest for ${courseSlug}:`, err);
            }
        }
    }
}

const PORT = 4173;
const CONCURRENCY = 15; // Number of browser tabs to open at once

// Simple static file server
function createServer() {
    return http.createServer((req, res) => {
        let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);

        // Handle SPA routing - serve index.html for routes without extensions
        if (!path.extname(filePath)) {
            filePath = path.join(distDir, 'index.html');
        }

        const extname = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // Serve index.html for 404s (SPA fallback)
                    fs.readFile(path.join(distDir, 'index.html'), (err, indexContent) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent, 'utf-8');
                    });
                } else {
                    res.writeHead(500);
                    res.end('Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
}

async function prerender() {
    console.log(`🚀 Starting pre-rendering for ${routes.length} total routes...`);

    // Start local server
    const server = createServer();
    await new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`📡 Server running on http://localhost:${PORT}`);
            resolve();
        });
    });

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < routes.length; i += CONCURRENCY) {
            const chunk = routes.slice(i, i + CONCURRENCY);
            console.log(`📸 Prerendering batch ${Math.floor(i / CONCURRENCY) + 1} of ${Math.ceil(routes.length / CONCURRENCY)}...`);
            
            await Promise.all(chunk.map(async (route) => {
                const page = await browser.newPage();
                
                // Disable loading images and unnecessary resources to vastly speed up Puppeteer rendering
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                    if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });

                await page.setViewport({ width: 1280, height: 800 });

                const url = `http://localhost:${PORT}${route}`;
                try {
                    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

                    // Wait for React Helmet to update the head
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const content = await page.content();

                    const outputPath = path.join(distDir, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
                    const outputDir = path.dirname(outputPath);

                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir, { recursive: true });
                    }

                    fs.writeFileSync(outputPath, content);
                    successCount++;
                } catch (error) {
                    console.error(`❌ Error prerendering ${route}:`, error.message);
                    failCount++;
                } finally {
                    await page.close();
                }
            }));
        }

        console.log(`✨ Pre-rendering complete! Generated ${successCount} pages (${failCount} failed).`);
    } catch (error) {
        console.error('❌ Fatal error during pre-rendering:', error);
        await browser.close();
        server.close();
        process.exit(1);
    }

    await browser.close();
    server.close();
    process.exit(0);
}

prerender();
