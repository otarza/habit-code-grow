import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const routes = [
    '/',
    '/ai',
    '/fullstack-ai'
];

const PORT = 4173;

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
    console.log('🚀 Starting pre-rendering...');

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
        for (const route of routes) {
            console.log(`📸 Prerendering ${route}...`);
            const page = await browser.newPage();

            await page.setViewport({ width: 1280, height: 800 });

            const url = `http://localhost:${PORT}${route}`;
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait for React Helmet to update the head
            await new Promise(resolve => setTimeout(resolve, 1500));

            const content = await page.content();

            const outputPath = path.join(distDir, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
            const outputDir = path.dirname(outputPath);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(outputPath, content);
            console.log(`✅ Saved ${outputPath}`);

            await page.close();
        }
    } catch (error) {
        console.error('❌ Error during pre-rendering:', error);
        await browser.close();
        server.close();
        process.exit(1);
    }

    await browser.close();
    server.close();
    console.log('✨ Pre-rendering complete!');
    process.exit(0);
}

prerender();
