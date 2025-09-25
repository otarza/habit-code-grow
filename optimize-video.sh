#!/bin/bash

# Video optimization script using ffmpeg
# This will create an optimized version of your video for web streaming

INPUT_VIDEO="public/challenges-bitcamp.mp4"
OUTPUT_VIDEO="public/challenges-bitcamp-optimized.mp4"

echo "🎬 Starting video optimization..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed. Please install it first:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "   Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Optimize video with the following settings:
# - H.264 codec for best compatibility
# - CRF 28 for good quality/size balance (lower = better quality, 23-28 is good for web)
# - Fast start for web streaming (moov atom at beginning)
# - Scale to 1080p max
# - Audio at 128k bitrate
ffmpeg -i "$INPUT_VIDEO" \
    -c:v libx264 \
    -crf 28 \
    -preset slow \
    -movflags +faststart \
    -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
    -c:a aac \
    -b:a 128k \
    -y \
    "$OUTPUT_VIDEO"

# Get file sizes
ORIGINAL_SIZE=$(ls -lh "$INPUT_VIDEO" | awk '{print $5}')
OPTIMIZED_SIZE=$(ls -lh "$OUTPUT_VIDEO" | awk '{print $5}')

echo "✅ Video optimization complete!"
echo "Original size: $ORIGINAL_SIZE"
echo "Optimized size: $OPTIMIZED_SIZE"
echo ""
echo "📤 Next steps for CDN setup:"
echo ""
echo "Option 1: Cloudinary (Free tier - 25GB/month)"
echo "1. Sign up at https://cloudinary.com"
echo "2. Upload your video to the Media Library"
echo "3. Get the optimized URL with transformations"
echo "4. Update videoUrl in VideoExplainer.tsx"
echo ""
echo "Option 2: Bunny CDN (Pay as you go - $0.01/GB)"
echo "1. Sign up at https://bunny.net"
echo "2. Create a Pull Zone"
echo "3. Upload video to Storage Zone"
echo "4. Update videoUrl in VideoExplainer.tsx"
echo ""
echo "Option 3: Cloudflare Stream (Pay as you go - $1/1000 minutes)"
echo "1. Sign up at https://www.cloudflare.com/products/cloudflare-stream/"
echo "2. Upload your video"
echo "3. Get the embed URL"
echo "4. Update videoUrl in VideoExplainer.tsx"