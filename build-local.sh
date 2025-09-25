#!/bin/bash

# Temporarily change base path for local testing
sed -i.bak "s|base: mode === 'production' ? '/wp-content/landing/' : '/'|base: '/'|" vite.config.ts

# Build
npm run build

# Copy media files to dist
cp public/bitcamp-challenges-thumbnail.jpg dist/ 2>/dev/null
cp public/challenges-bitcamp.mp4 dist/ 2>/dev/null

# Restore original base path
mv vite.config.ts.bak vite.config.ts

echo "Build complete for local testing. You can now serve the dist folder."
echo "Run: npx serve dist"