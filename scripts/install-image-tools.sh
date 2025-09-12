#!/bin/bash

# Script to install advanced image optimization tools
# These provide better compression than the JavaScript-based tools

echo "🔧 Installing advanced image optimization tools..."
echo ""
echo "This script will install the following tools using Homebrew:"
echo "  - pngquant (lossy PNG compression)"
echo "  - optipng (lossless PNG optimization)"
echo "  - jpegoptim (JPEG optimization)"
echo "  - webp (WebP tools from Google)"
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "Installing image optimization tools..."

# Install the tools
brew install pngquant optipng jpegoptim webp

echo ""
echo "✅ Installation complete!"
echo ""
echo "You can now use the advanced optimization script:"
echo "  ./scripts/optimize-images-advanced.sh"