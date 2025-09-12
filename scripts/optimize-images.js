#!/usr/bin/env node

/**
 * Image optimization script for Swift Slides project
 * Optimizes PNG, JPG, and GIF images in place and creates WebP versions
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true
  },
  png: {
    quality: 90,
    compressionLevel: 9,
    palette: true
  },
  webp: {
    quality: 85,
    effort: 6
  },
  maxWidth: 2048,  // Max width for slides
  coverMaxWidth: 800, // Max width for cover images
  logoMaxWidth: 400  // Max width for logos
};

// Track optimization stats
let stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalSaved: 0,
  files: []
};

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + 'KB';
}

async function optimizeImage(inputPath, outputPath) {
  try {
    const originalSize = await getFileSize(inputPath);
    const ext = path.extname(inputPath).toLowerCase();
    const dir = path.dirname(inputPath);
    
    // Use a temporary file for in-place optimization
    const tempPath = inputPath + '.tmp';
    
    // Determine max dimensions based on directory
    let maxWidth = CONFIG.maxWidth;
    if (dir.includes('/covers/')) {
      maxWidth = CONFIG.coverMaxWidth;
    } else if (dir.includes('/logos/')) {
      maxWidth = CONFIG.logoMaxWidth;
    }
    
    // Create sharp instance
    let pipeline = sharp(inputPath);
    
    // Get metadata
    const metadata = await pipeline.metadata();
    
    // Resize if needed (maintaining aspect ratio)
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Apply format-specific optimizations
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        pipeline = pipeline.jpeg(CONFIG.jpeg);
        break;
      case '.png':
        // For PNGs with transparency, be careful with palette
        if (metadata.channels === 4) {
          pipeline = pipeline.png({
            ...CONFIG.png,
            palette: false // Don't use palette for transparent PNGs
          });
        } else {
          pipeline = pipeline.png(CONFIG.png);
        }
        break;
      case '.gif':
        // Convert GIF to WebP for better compression
        const webpPath = outputPath.replace('.gif', '.webp');
        pipeline = pipeline.webp(CONFIG.webp);
        outputPath = webpPath;
        break;
      default:
        console.log(`  ⚠️  Unsupported format: ${ext}`);
        stats.skipped++;
        return;
    }
    
    // Save optimized image to temp file first
    await pipeline.toFile(tempPath);
    
    const newSize = await getFileSize(tempPath);
    const saved = originalSize - newSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);
    
    if (saved > 100) { // Only replace if we save more than 100 bytes
      // Replace original with optimized version
      await fs.rename(tempPath, outputPath);
      
      stats.processed++;
      stats.totalSaved += saved;
      stats.files.push({
        path: inputPath,
        original: originalSize,
        optimized: newSize,
        saved: saved
      });
      
      console.log(`  ✅ ${path.basename(inputPath)}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savedPercent}% saved)`);
    } else {
      // Remove temp file if no significant savings
      await fs.unlink(tempPath);
      stats.skipped++;
      console.log(`  ⏭️  ${path.basename(inputPath)}: Already optimized`);
    }
    
  } catch (error) {
    stats.errors++;
    console.error(`  ❌ Error optimizing ${inputPath}:`, error.message);
    
    // Clean up temp file if it exists
    try {
      await fs.unlink(inputPath + '.tmp');
    } catch {
      // Ignore cleanup errors
    }
  }
}

async function createWebPVersions(imagePaths) {
  console.log('\n📸 Creating WebP versions for better performance...\n');
  
  for (const imagePath of imagePaths) {
    const ext = path.extname(imagePath).toLowerCase();
    if (ext === '.webp') continue; // Skip if already WebP
    
    const webpPath = imagePath.replace(ext, '.webp');
    
    // Skip if WebP version already exists
    try {
      await fs.access(webpPath);
      console.log(`  ⏭️  WebP exists: ${path.basename(webpPath)}`);
      continue;
    } catch {
      // WebP version doesn't exist, continue
    }
    
    try {
      await sharp(imagePath)
        .webp(CONFIG.webp)
        .toFile(webpPath);
      
      const originalSize = await getFileSize(imagePath);
      const webpSize = await getFileSize(webpPath);
      const savedPercent = ((1 - webpSize / originalSize) * 100).toFixed(1);
      
      console.log(`  ✅ Created: ${path.basename(webpPath)} (${savedPercent}% smaller than ${ext})`);
    } catch (error) {
      console.error(`  ❌ Error creating WebP for ${imagePath}:`, error.message);
    }
  }
}

/**
 * Optimize all images in a directory
 * @param {string} directory - Directory to scan
 * @param {string} pattern - Glob pattern for image files
 * @returns {Promise<string[]>} Array of processed file paths
 */
async function optimizeDirectory(directory, pattern = '**/*.{jpg,jpeg,png,gif}') {
  console.log(`\n🔍 Scanning ${directory}...\n`);
  
  const files = await glob(path.join(directory, pattern));
  console.log(`Found ${files.length} images to process\n`);
  
  for (const file of files) {
    // Optimize in place
    await optimizeImage(file, file);
  }
  
  return files;
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log('⚠️  This will optimize images in place. Make sure you have a backup!\n');
  
  const startTime = Date.now();
  
  // Optimize assets
  const assetImages = await optimizeDirectory('public/assets');
  
  // Optimize covers
  const coverImages = await optimizeDirectory('public/covers');
  
  // Create WebP versions for frequently used images
  const criticalImages = [
    ...await glob('public/covers/**/*.{jpg,jpeg,png}'),
    ...await glob('public/assets/logos/*.{jpg,jpeg,png}')
  ];
  await createWebPVersions(criticalImages);
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n' + '='.repeat(50));
  console.log('📊 Optimization Summary');
  console.log('='.repeat(50));
  console.log(`✅ Processed: ${stats.processed} images`);
  console.log(`⏭️  Skipped: ${stats.skipped} images`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`💾 Total saved: ${formatBytes(stats.totalSaved)}`);
  console.log(`⏱️  Duration: ${duration}s`);
  
  // Show top savings
  if (stats.files.length > 0) {
    console.log('\n🏆 Top 5 Optimizations:');
    stats.files
      .sort((a, b) => b.saved - a.saved)
      .slice(0, 5)
      .forEach((file, i) => {
        const name = path.basename(file.path);
        const saved = formatBytes(file.saved);
        const percent = ((file.saved / file.original) * 100).toFixed(1);
        console.log(`  ${i + 1}. ${name}: ${saved} saved (${percent}%)`);
      });
  }
}

/**
 * Check if required dependencies are installed
 */
async function checkDependencies() {
  try {
    require.resolve('sharp');
    require.resolve('glob');
  } catch (error) {
    console.error('❌ Required dependencies not found!');
    console.log('\nPlease install dependencies first:');
    console.log('  bun add -D sharp glob');
    console.log('  or');
    console.log('  npm install --save-dev sharp glob');
    process.exit(1);
  }
}

// Run the script
checkDependencies().then(() => {
  main().catch(console.error);
});