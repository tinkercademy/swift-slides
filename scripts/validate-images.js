#!/usr/bin/env node

/**
 * Image validation script for Swift Slides project
 * Validates WebP images and checks for missing references
 * Usage: node scripts/validate-images.js
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

/**
 * Main validation function
 */
async function validateImages() {
  console.log('🔍 Validating all image references...\n');
  
  const errors = [];
  const warnings = [];
  let success = 0;

  // Check all WebP images referenced in source code
  const webpReferences = [
    '/assets/logos/tinkercademy.webp',
    '/assets/logos/swift_explorers_purple.webp',
    '/assets/logos/swift_explorers_yellow.webp',
    '/assets/logos/tinkercademy_long_dark.webp',
    '/assets/logos/tinkercademy_long_light.webp',
    '/covers/placeholder.webp',
  ];

  // Add all track and unit covers
  const tracks = ['track_a', 'track_b', 'track_c', 'track_x'];
  for (const track of tracks) {
    webpReferences.push(`/covers/${track}/track.webp`);
    
    // Get all unit WebP files for this track
    const unitFiles = await glob(`public/covers/${track}/unit*.webp`);
    for (const file of unitFiles) {
      const relativePath = file.replace('public', '');
      webpReferences.push(relativePath);
    }
  }

  // Check each WebP reference
  console.log('📸 Checking WebP images...');
  for (const ref of webpReferences) {
    const filePath = path.join('public', ref);
    try {
      await fs.access(filePath);
      success++;
      console.log(`  ✅ ${ref}`);
    } catch (error) {
      errors.push(`Missing WebP: ${ref}`);
      console.log(`  ❌ ${ref} - MISSING`);
    }
  }

  // Check for orphaned PNG files (that should have been converted)
  console.log('\n🔎 Checking for unconverted PNGs in UI assets...');
  const uiPngs = [
    ...await glob('public/assets/logos/*.png'),
    ...await glob('public/covers/**/*.png')
  ];

  for (const pngFile of uiPngs) {
    const webpFile = pngFile.replace('.png', '.webp');
    try {
      await fs.access(webpFile);
      warnings.push(`PNG still exists (has WebP): ${pngFile.replace('public/', '')}`);
      console.log(`  ⚠️  ${pngFile.replace('public/', '')} - Has WebP version, consider removing PNG`);
    } catch (error) {
      warnings.push(`PNG without WebP: ${pngFile.replace('public/', '')}`);
      console.log(`  ⚠️  ${pngFile.replace('public/', '')} - No WebP version`);
    }
  }

  // Check markdown images exist
  console.log('\n📄 Checking markdown slide images...');
  const markdownFiles = await glob('public/markdown/**/*.md');
  let markdownImageCount = 0;
  const missingMarkdownImages = [];

  for (const mdFile of markdownFiles) {
    const content = await fs.readFile(mdFile, 'utf-8');
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
      const imagePath = match[2];
      
      // Skip external URLs
      if (imagePath.startsWith('http')) continue;
      
      markdownImageCount++;
      const fullPath = path.join(path.dirname(mdFile), imagePath);
      
      try {
        await fs.access(fullPath);
      } catch (error) {
        missingMarkdownImages.push({
          markdown: mdFile.replace('public/', ''),
          image: imagePath
        });
      }
    }
  }

  if (missingMarkdownImages.length > 0) {
    console.log(`  ❌ Found ${missingMarkdownImages.length} missing images in markdown files`);
    for (const missing of missingMarkdownImages.slice(0, 5)) {
      console.log(`     - ${missing.markdown}: ${missing.image}`);
    }
    if (missingMarkdownImages.length > 5) {
      console.log(`     ... and ${missingMarkdownImages.length - 5} more`);
    }
  } else {
    console.log(`  ✅ All ${markdownImageCount} markdown images exist`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Validation Summary');
  console.log('='.repeat(50));
  console.log(`✅ Valid WebP images: ${success}`);
  console.log(`❌ Errors: ${errors.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  console.log(`📄 Missing markdown images: ${missingMarkdownImages.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors found:');
    errors.forEach(err => console.log(`  - ${err}`));
    process.exit(1);
  }

  if (missingMarkdownImages.length === 0) {
    console.log('\n✨ All critical images validated successfully!');
  } else {
    console.log('\n⚠️  Some markdown images are missing, but core UI images are OK');
  }
}

// Run the script if executed directly
if (require.main === module) {
  validateImages().catch(console.error);
}

module.exports = validateImages;