const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage() {
  // For now, we'll create a placeholder thumbnail
  // In production, you would process the actual image file
  
  const inputPath = process.argv[2];
  const outputPath = './public/video-thumbnail.jpg';
  
  if (!inputPath) {
    console.log('Please provide an input image path');
    return;
  }
  
  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input file does not exist:', inputPath);
      return;
    }
    
    // Optimize the image for web
    await sharp(inputPath)
      .resize(1920, 1080, { // Standard HD resolution
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85, // Good quality with smaller file size
        progressive: true, // Progressive loading for better UX
        mozjpeg: true // Use mozjpeg encoder for better compression
      })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    const fileSizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    
    console.log(`✓ Image optimized successfully!`);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Size: ${fileSizeInMB} MB`);
    
    // Additional WebP version for modern browsers
    const webpPath = './public/video-thumbnail.webp';
    await sharp(inputPath)
      .resize(1920, 1080, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 85,
        effort: 6 // Higher effort for better compression
      })
      .toFile(webpPath);
    
    const webpStats = fs.statSync(webpPath);
    const webpSizeInMB = (webpStats.size / 1024 / 1024).toFixed(2);
    
    console.log(`✓ WebP version created!`);
    console.log(`  Output: ${webpPath}`);
    console.log(`  Size: ${webpSizeInMB} MB`);
    
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

optimizeImage();