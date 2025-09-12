#!/usr/bin/env node

/**
 * Image reference verification script for Swift Slides project
 * Verifies WebP migration and finds missing image references
 * Usage: node scripts/verify-images.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Results object to track findings
const results = {
  webpReferences: [],
  missingWebpFiles: [],
  pngReferences: [],
  markdownImageRefs: [],
  missingMarkdownImages: [],
  summary: {}
};

/**
 * Check if a file exists at the given path
 * @param {string} filePath - Path to check
 * @returns {boolean} True if file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Extract image references from TypeScript/JavaScript source files
 */
function findImageRefsInSource() {
  const srcDir = path.join(rootDir, 'src');
  const extensions = ['.tsx', '.ts', '.js', '.jsx'];
  
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (extensions.includes(path.extname(entry.name))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const relativePath = path.relative(rootDir, fullPath);
        
        // Find WebP references
        const webpMatches = content.match(/["'`]([^"'`]*\.webp)["'`]/g);
        if (webpMatches) {
          webpMatches.forEach(match => {
            const imagePath = match.slice(1, -1); // Remove quotes
            const fullImagePath = path.join(rootDir, 'public', imagePath.replace(/^\//, ''));
            results.webpReferences.push({
              file: relativePath,
              imagePath,
              fullImagePath,
              exists: fileExists(fullImagePath)
            });
            
            if (!fileExists(fullImagePath)) {
              results.missingWebpFiles.push({
                file: relativePath,
                imagePath,
                fullImagePath
              });
            }
          });
        }
        
        // Find PNG references
        const pngMatches = content.match(/["'`]([^"'`]*\.png)["'`]/g);
        if (pngMatches) {
          pngMatches.forEach(match => {
            const imagePath = match.slice(1, -1); // Remove quotes
            // Skip external URLs
            if (!imagePath.startsWith('http')) {
              const fullImagePath = path.join(rootDir, 'public', imagePath.replace(/^\//, ''));
              results.pngReferences.push({
                file: relativePath,
                imagePath,
                fullImagePath,
                exists: fileExists(fullImagePath)
              });
            }
          });
        }
      }
    }
  }
  
  scanDirectory(srcDir);
}

/**
 * Extract image references from markdown slide files
 */
function findImageRefsInMarkdown() {
  const markdownDir = path.join(rootDir, 'public', 'markdown');
  
  function scanMarkdownDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanMarkdownDirectory(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const relativePath = path.relative(rootDir, fullPath);
        
        // Find all image references in markdown
        const imageMatches = content.match(/(?:src=["']([^"']*\.(?:png|jpg|jpeg|webp|svg))["']|!\[[^\]]*\]\(([^)]*\.(?:png|jpg|jpeg|webp|svg))\))/gi);
        
        if (imageMatches) {
          imageMatches.forEach(match => {
            let imagePath;
            
            // Extract path from src="" or markdown ![](path) format
            const srcMatch = match.match(/src=["']([^"']*)["']/i);
            const mdMatch = match.match(/!\[[^\]]*\]\(([^)]*)\)/);
            
            imagePath = srcMatch ? srcMatch[1] : mdMatch ? mdMatch[1] : null;
            
            if (imagePath) {
              // Skip external URLs
              if (!imagePath.startsWith('http')) {
                const fullImagePath = path.join(rootDir, 'public', imagePath.replace(/^\//, ''));
                const exists = fileExists(fullImagePath);
                
                results.markdownImageRefs.push({
                  file: relativePath,
                  imagePath,
                  fullImagePath,
                  exists,
                  extension: path.extname(imagePath)
                });
                
                if (!exists) {
                  results.missingMarkdownImages.push({
                    file: relativePath,
                    imagePath,
                    fullImagePath
                  });
                }
              }
            }
          });
        }
      }
    }
  }
  
  scanMarkdownDirectory(markdownDir);
}

/**
 * Generate summary statistics for the verification results
 */
function generateSummary() {
  results.summary = {
    totalWebpReferences: results.webpReferences.length,
    missingWebpFiles: results.missingWebpFiles.length,
    totalPngReferences: results.pngReferences.length,
    totalMarkdownImageRefs: results.markdownImageRefs.length,
    missingMarkdownImages: results.missingMarkdownImages.length,
    markdownImageTypes: {
      png: results.markdownImageRefs.filter(ref => ref.extension === '.png').length,
      jpg: results.markdownImageRefs.filter(ref => ref.extension === '.jpg').length,
      jpeg: results.markdownImageRefs.filter(ref => ref.extension === '.jpeg').length,
      webp: results.markdownImageRefs.filter(ref => ref.extension === '.webp').length,
      svg: results.markdownImageRefs.filter(ref => ref.extension === '.svg').length,
    }
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Verifying image references after PNG to WebP migration...\n');

  findImageRefsInSource();
  findImageRefsInMarkdown();
  generateSummary();

  // Output results
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`WebP references in source code: ${results.summary.totalWebpReferences}`);
  console.log(`Missing WebP files: ${results.summary.missingWebpFiles}`);
  console.log(`PNG references in source code: ${results.summary.totalPngReferences}`);
  console.log(`Markdown image references: ${results.summary.totalMarkdownImageRefs}`);
  console.log(`Missing markdown images: ${results.summary.missingMarkdownImages}`);

  console.log('\n📁 MARKDOWN IMAGE BREAKDOWN');
  console.log('='.repeat(50));
  Object.entries(results.summary.markdownImageTypes).forEach(([ext, count]) => {
    console.log(`${ext.toUpperCase()}: ${count}`);
  });

  if (results.missingWebpFiles.length > 0) {
    console.log('\n❌ MISSING WEBP FILES');
    console.log('='.repeat(50));
    results.missingWebpFiles.forEach(item => {
      console.log(`File: ${item.file}`);
      console.log(`Missing: ${item.imagePath}`);
      console.log(`Expected at: ${item.fullImagePath}`);
      console.log('---');
    });
  }

  if (results.missingMarkdownImages.length > 0) {
    console.log('\n❌ MISSING MARKDOWN IMAGES');
    console.log('='.repeat(50));
    results.missingMarkdownImages.forEach(item => {
      console.log(`File: ${item.file}`);
      console.log(`Missing: ${item.imagePath}`);
      console.log(`Expected at: ${item.fullImagePath}`);
      console.log('---');
    });
  }

  if (results.pngReferences.length > 0) {
    console.log('\n⚠️  REMAINING PNG REFERENCES IN SOURCE CODE');
    console.log('='.repeat(50));
    results.pngReferences.forEach(item => {
      console.log(`File: ${item.file}`);
      console.log(`PNG Reference: ${item.imagePath}`);
      console.log(`Exists: ${item.exists ? '✅' : '❌'}`);
      console.log('---');
    });
  }

  console.log('\n✅ VERIFICATION COMPLETE');

  // Write detailed results to JSON file
  fs.writeFileSync(
    path.join(rootDir, 'image-verification-results.json'), 
    JSON.stringify(results, null, 2)
  );
  console.log('\n📄 Detailed results saved to: image-verification-results.json');
}

// Run the script
main();