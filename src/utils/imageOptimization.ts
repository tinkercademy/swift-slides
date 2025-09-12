/**
 * Image optimization utilities for Reveal.js presentations
 * Provides lazy loading, progressive enhancement, and preloading capabilities
 */

interface ImageLoadingOptions {
  rootMargin?: string;
  threshold?: number;
  fadeIn?: boolean;
}

/**
 * Implements lazy loading for Reveal.js slide images
 */
export function setupLazyLoading(options: ImageLoadingOptions = {}) {
  const {
    rootMargin = '200px', // Start loading 200px before visible
    threshold = 0.01,
    fadeIn = true
  } = options;

  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  // Add fade-in styles if enabled
  if (fadeIn) {
    const style = document.createElement('style');
    style.textContent = `
      .lazy-image {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      .lazy-image.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Handle srcset for responsive images
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        // Add loaded class for fade-in effect
        if (fadeIn) {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        }
        
        // Stop observing this image
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin,
    threshold
  });

  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.classList.add('lazy-image');
    imageObserver.observe(img);
  });

  // Also handle background images in Reveal.js slides
  document.querySelectorAll('[data-background-image]').forEach(element => {
    const bgImage = element.getAttribute('data-background-image');
    if (bgImage) {
      // Preload background images for nearby slides
      const img = new Image();
      img.src = bgImage;
    }
  });

  return imageObserver;
}

/**
 * Preload critical images for better performance
 */
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof window === 'undefined') return;

  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
}



/**
 * Setup progressive image loading for slides
 */
export function setupProgressiveImages() {
  if (typeof window === 'undefined') return;
  
  // Load low-quality placeholders first
  document.querySelectorAll('img[data-placeholder]').forEach(img => {
    const imgElement = img as HTMLImageElement;
    const placeholder = imgElement.dataset.placeholder;
    const fullImageSrc = imgElement.dataset.src;
    
    if (placeholder && fullImageSrc) {
      // Load placeholder immediately
      imgElement.src = placeholder;
      
      // Load full image when ready
      const fullImage = new Image();
      fullImage.onload = () => {
        imgElement.src = fullImage.src;
        imgElement.classList.add('loaded');
      };
      
      // Start loading full image
      fullImage.src = fullImageSrc;
    }
  });
}

/**
 * Initialize all image optimizations for Reveal.js
 */
export function initializeImageOptimizations(options: ImageLoadingOptions = {}) {
  if (typeof window === 'undefined') return;
  
  // Setup lazy loading
  setupLazyLoading(options);
  
  // Setup progressive images
  setupProgressiveImages();
  
  // Preload critical images (e.g., logos, first slide images)
  const criticalImages = [
    '/assets/logos/tinkercademy.webp',
    '/assets/logos/swift_explorers_purple.webp',
    '/covers/placeholder.webp'
  ];
  preloadCriticalImages(criticalImages);
  
  // Listen for Reveal.js slide changes to preload upcoming images
  const windowWithReveal = window as unknown as { 
    Reveal?: { 
      on: (event: string, callback: (event: { currentSlide: HTMLElement }) => void) => void 
    } 
  };
  
  if (windowWithReveal.Reveal) {
    const Reveal = windowWithReveal.Reveal;
    
    Reveal.on('slidechanged', (event) => {
      // Preload images in next and previous slides
      const currentSlide = event.currentSlide;
      const nextSlide = currentSlide.nextElementSibling;
      const prevSlide = currentSlide.previousElementSibling;
      
      [nextSlide, prevSlide].forEach(slide => {
        if (slide) {
          const images = slide.querySelectorAll('img[data-src]');
          images.forEach((img) => {
            const imgElement = img as HTMLImageElement;
            if (imgElement.dataset.src && !imgElement.src) {
              // Start loading the image
              const preloader = new Image();
              preloader.src = imgElement.dataset.src;
            }
          });
        }
      });
    });
  }
}

// Export as default object for convenience
const imageOptimizationUtils = {
  setupLazyLoading,
  preloadCriticalImages,
  setupProgressiveImages,
  initializeImageOptimizations
};

export default imageOptimizationUtils;