#!/bin/bash

# Advanced image optimization using command-line tools
# Provides better compression than JavaScript-based tools

echo "🚀 Advanced Image Optimization"
echo "=============================="
echo ""

# Check if tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Run ./scripts/install-image-tools.sh first"
        exit 1
    fi
}

check_tool pngquant
check_tool optipng
check_tool jpegoptim
check_tool cwebp

# Create backup directory
BACKUP_DIR="image-backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup at $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r public/assets "$BACKUP_DIR/"
cp -r public/covers "$BACKUP_DIR/"

echo ""
echo "🔍 Starting optimization..."
echo ""

# Track statistics
TOTAL_BEFORE=$(du -sb public/assets public/covers | awk '{total += $1} END {print total}')
PNG_COUNT=0
JPG_COUNT=0
WEBP_CREATED=0

# Optimize PNG files
echo "🖼️  Optimizing PNG files..."
for file in $(find public/assets public/covers -name "*.png"); do
    echo -n "  Processing: $(basename $file)... "
    
    # Get size before
    SIZE_BEFORE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    
    # Apply lossy compression with pngquant (quality 85-95)
    pngquant --quality=85-95 --speed=1 --force --output "$file.tmp" "$file" 2>/dev/null
    
    if [ -f "$file.tmp" ]; then
        # Apply lossless optimization with optipng
        optipng -quiet -o2 "$file.tmp"
        
        # Check if the new file is smaller
        SIZE_AFTER=$(stat -f%z "$file.tmp" 2>/dev/null || stat -c%s "$file.tmp" 2>/dev/null)
        
        if [ "$SIZE_AFTER" -lt "$SIZE_BEFORE" ]; then
            mv "$file.tmp" "$file"
            SAVED=$((SIZE_BEFORE - SIZE_AFTER))
            PERCENT=$((SAVED * 100 / SIZE_BEFORE))
            echo "✅ Saved $(($SAVED / 1024))KB (${PERCENT}%)"
            ((PNG_COUNT++))
        else
            rm "$file.tmp"
            echo "⏭️  Already optimized"
        fi
    else
        echo "⏭️  Skipped"
    fi
done

echo ""
echo "📸 Optimizing JPEG files..."
# Optimize JPEG files
for file in $(find public/assets public/covers -name "*.jpg" -o -name "*.jpeg"); do
    echo -n "  Processing: $(basename $file)... "
    
    SIZE_BEFORE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    
    # Optimize with jpegoptim (85% quality, progressive)
    jpegoptim --quiet --max=85 --all-progressive "$file"
    
    SIZE_AFTER=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    
    if [ "$SIZE_AFTER" -lt "$SIZE_BEFORE" ]; then
        SAVED=$((SIZE_BEFORE - SIZE_AFTER))
        PERCENT=$((SAVED * 100 / SIZE_BEFORE))
        echo "✅ Saved $(($SAVED / 1024))KB (${PERCENT}%)"
        ((JPG_COUNT++))
    else
        echo "⏭️  Already optimized"
    fi
done

echo ""
echo "🌐 Creating WebP versions..."
# Create WebP versions for all images
for file in $(find public/assets public/covers -name "*.png" -o -name "*.jpg" -o -name "*.jpeg"); do
    WEBP_FILE="${file%.*}.webp"
    
    if [ ! -f "$WEBP_FILE" ]; then
        echo -n "  Creating: $(basename $WEBP_FILE)... "
        
        # Detect if PNG has transparency
        if [[ "$file" == *.png ]]; then
            # Check for alpha channel
            if file "$file" | grep -q "RGBA"; then
                # Has transparency - use lossless or high quality
                cwebp -q 95 -alpha_q 100 "$file" -o "$WEBP_FILE" -quiet
            else
                # No transparency - can use more aggressive compression
                cwebp -q 85 "$file" -o "$WEBP_FILE" -quiet
            fi
        else
            # JPEG - use lossy compression
            cwebp -q 85 "$file" -o "$WEBP_FILE" -quiet
        fi
        
        if [ -f "$WEBP_FILE" ]; then
            SIZE_ORIG=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            SIZE_WEBP=$(stat -f%z "$WEBP_FILE" 2>/dev/null || stat -c%s "$WEBP_FILE" 2>/dev/null)
            SAVED=$((SIZE_ORIG - SIZE_WEBP))
            PERCENT=$((SAVED * 100 / SIZE_ORIG))
            echo "✅ ${PERCENT}% smaller than original"
            ((WEBP_CREATED++))
        else
            echo "❌ Failed"
        fi
    else
        echo "  ⏭️  $(basename $WEBP_FILE) already exists"
    fi
done

# Calculate total savings
TOTAL_AFTER=$(du -sb public/assets public/covers | awk '{total += $1} END {print total}')
TOTAL_SAVED=$((TOTAL_BEFORE - TOTAL_AFTER))
TOTAL_SAVED_MB=$(echo "scale=2; $TOTAL_SAVED / 1048576" | bc)

echo ""
echo "=================================================="
echo "📊 Optimization Complete!"
echo "=================================================="
echo "✅ PNG files optimized: $PNG_COUNT"
echo "✅ JPEG files optimized: $JPG_COUNT"
echo "✅ WebP versions created: $WEBP_CREATED"
echo "💾 Total space saved: ${TOTAL_SAVED_MB}MB"
echo ""
echo "📦 Backup saved at: $BACKUP_DIR"
echo ""
echo "To restore original images:"
echo "  cp -r $BACKUP_DIR/* public/"