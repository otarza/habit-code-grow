#!/bin/bash

# Script to optimize video thumbnail for web
# Usage: ./optimize-thumbnail.sh <input-image-path>

INPUT_FILE="$1"

if [ -z "$INPUT_FILE" ]; then
    echo "Please provide an input image file path"
    echo "Usage: ./optimize-thumbnail.sh <input-image-path>"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file does not exist: $INPUT_FILE"
    exit 1
fi

echo "Optimizing thumbnail image..."

# Run the Node.js optimization script
node optimize-image.js "$INPUT_FILE"

echo "Done! Thumbnail has been optimized and saved to public/video-thumbnail.jpg"