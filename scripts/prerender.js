
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const routes = [
    '/',
    '/ai',
    '/fullstack-ai'
];

async function prerender() {
    console.log('🚀 Starting pre-rendering...');

    // Start a local server serving the dist folder
    const server = spawn('npx', ['serve', 'dist', '-p', '4173'], {
        stdio: 'ignore',
        shell: true
    });

    // Give the server a moment to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        for (const route of routes) {
            console.log(`📸 Prerendering ${route}...`);
            const page = await browser.newPage();

            // Set a reasonable viewport
            await page.setViewport({ width: 1280, height: 800 });

            // Navigate to the route
            const url = `http://localhost:4173${route}`;
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Wait for React to hydrate and Helmet to update the head
            // Checking for a specific element or just a small timeout
            await new Promise(resolve => setTimeout(resolve, 1000));

            const content = await page.content();

            // Determine output path
            let outputPath = path.join(distDir, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);

            // Ensure directory exists
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
        process.exit(1);
    } finally {
        await browser.close();
        server.kill();
        console.log('✨ Pre-rendering complete!');
        process.exit(0);
    }
}

prerender();
