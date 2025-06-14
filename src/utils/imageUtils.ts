// Image utility functions for handling deployment issues

export const getImagePath = (imagePath: string): string => {
  // Ensure the path starts with / for public folder access
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  return `/${imagePath}`;
};

export const createFallbackImage = (productName: string, width = 400, height = 300): string => {
  const encodedName = encodeURIComponent(productName);
  return `https://via.placeholder.com/${width}x${height}/FFD700/000000?text=${encodedName}`;
};

export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

export const checkImageExists = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Debug function to check all product images
export const debugProductImages = async (products: any[]): Promise<void> => {
  console.log('🔍 Checking product images...');
  
  for (const product of products) {
    const imagePath = getImagePath(product.image);
    const exists = await checkImageExists(imagePath);
    
    console.log(`${exists ? '✅' : '❌'} ${product.name}: ${imagePath}`);
    
    if (!exists) {
      console.warn(`Missing image for ${product.name}: ${imagePath}`);
    }
  }
};

// Function to optimize image loading
export const optimizeImageLoading = () => {
  // Add intersection observer for lazy loading
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
};