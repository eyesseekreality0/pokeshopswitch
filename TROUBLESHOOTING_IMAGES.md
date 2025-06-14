# Image Display Troubleshooting Guide

## Overview
This guide helps resolve image display issues in your deployed Pokemon ecommerce application. Images may work locally but fail in production due to various deployment-specific factors.

## Quick Diagnosis Checklist

### ✅ Initial Verification
- [ ] Images display correctly in local development
- [ ] Images exist in the `public/` folder
- [ ] Image paths in code match actual filenames
- [ ] No console errors related to 404 (Not Found) for images
- [ ] Browser network tab shows successful image loading (200 status)

## Common Issues & Solutions

### 1. File Path Problems

#### **Issue**: Images work locally but not in production
**Symptoms**: 
- 404 errors in browser console
- Broken image icons on website
- Images load locally but not on deployed site

**Solutions**:

```javascript
// ❌ WRONG - Absolute paths from src folder
import pokemonImage from '../assets/pokemon.jpg'

// ❌ WRONG - Incorrect public path
<img src="/images/pokemon.jpg" />

// ✅ CORRECT - Direct public folder reference
<img src="/pokemon.jpg" />
<img src="/Pokemon Scarlet.jpeg" />
```

**Debugging Steps**:
1. Open browser DevTools → Network tab
2. Reload page and look for red 404 errors
3. Click on failed image requests to see the attempted URL
4. Compare attempted URL with actual file location

### 2. Case Sensitivity Issues

#### **Issue**: Filenames work on Windows/Mac but fail on Linux servers
**Symptoms**:
- Images work in local development
- 404 errors only in production
- Inconsistent loading across different files

**Solutions**:
```javascript
// ❌ WRONG - Case mismatch
// File: Pokemon Scarlet.jpeg
<img src="/pokemon scarlet.jpeg" />

// ✅ CORRECT - Exact case match
<img src="/Pokemon Scarlet.jpeg" />
```

**Prevention**:
- Use consistent naming conventions (kebab-case recommended)
- Rename files to avoid spaces and special characters
- Example: `pokemon-scarlet.jpeg` instead of `Pokemon Scarlet.jpeg`

### 3. File Format & Encoding Issues

#### **Supported Formats**:
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ SVG (.svg)
- ❌ HEIC, TIFF, BMP (convert to supported formats)

**File Size Optimization**:
```bash
# Recommended max sizes:
# - Thumbnails: 50KB
# - Product images: 200KB
# - Hero images: 500KB
```

### 4. Deployment Platform Specific Issues

#### **Netlify**
```bash
# Check build logs for file copying issues
# Ensure public folder is included in build output

# netlify.toml (if needed)
[build]
  publish = "dist"
  command = "npm run build"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

**Debugging Steps**:
1. Check Netlify build logs for errors
2. Verify `dist/` folder contains images after build
3. Test image URLs directly: `https://yoursite.netlify.app/Pokemon Scarlet.jpeg`

#### **Vercel**
```json
// vercel.json (if needed)
{
  "functions": {
    "app.js": {
      "includeFiles": "public/**"
    }
  }
}
```

#### **GitHub Pages**
- Ensure images are committed to repository
- Check that build process copies public folder to output
- Verify base URL configuration in vite.config.ts

### 5. Build Configuration Issues

#### **Vite Configuration**
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure correct base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure public files are copied
    copyPublicDir: true
  },
  publicDir: 'public' // Confirm public directory
})
```

## Debugging Tools & Commands

### 1. Local Testing
```bash
# Build and preview locally to simulate production
npm run build
npm run preview

# Check if images exist in build output
ls -la dist/
```

### 2. Browser DevTools
```javascript
// Console commands to test image loading
const img = new Image();
img.onload = () => console.log('Image loaded successfully');
img.onerror = () => console.log('Image failed to load');
img.src = '/Pokemon Scarlet.jpeg';
```

### 3. Network Analysis
1. Open DevTools → Network tab
2. Filter by "Img" to see only image requests
3. Look for:
   - Status codes (200 = success, 404 = not found)
   - Response times
   - File sizes

### 4. File Verification Script
```javascript
// Add to your component for debugging
const checkImageExists = (imagePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};

// Usage in component
useEffect(() => {
  const imagePaths = [
    '/Pokemon Scarlet.jpeg',
    '/Pokemon Violet.jpeg',
    // ... other images
  ];
  
  imagePaths.forEach(async (path) => {
    const exists = await checkImageExists(path);
    console.log(`${path}: ${exists ? 'EXISTS' : 'MISSING'}`);
  });
}, []);
```

## Step-by-Step Debugging Process

### Step 1: Verify Local Setup
```bash
# 1. Check file structure
ls -la public/
# Should show all your Pokemon images

# 2. Start dev server
npm run dev
# Verify images load at http://localhost:5173

# 3. Test direct image access
# Visit: http://localhost:5173/Pokemon Scarlet.jpeg
```

### Step 2: Test Production Build
```bash
# 1. Create production build
npm run build

# 2. Check build output
ls -la dist/
# Images should be present in dist folder

# 3. Preview production build
npm run preview
# Test at http://localhost:4173
```

### Step 3: Deployment Verification
```bash
# 1. Check deployed file structure (if possible)
# For Netlify: Check site files in dashboard
# For Vercel: Check deployment logs

# 2. Test direct image URLs
curl -I https://yoursite.com/Pokemon Scarlet.jpeg
# Should return 200 OK, not 404
```

### Step 4: Code Review
```javascript
// Check your product data file
// src/data/products.ts

// Ensure all image paths are correct:
const products = [
  {
    id: '1',
    name: 'Pokemon Scarlet',
    image: '/Pokemon Scarlet.jpeg', // ✅ Correct path
    // ...
  }
];
```

## Performance Optimization

### 1. Image Optimization
```javascript
// Add loading states for better UX
const [imageLoaded, setImageLoaded] = useState(false);
const [imageError, setImageError] = useState(false);

<img
  src="/Pokemon Scarlet.jpeg"
  alt="Pokemon Scarlet"
  onLoad={() => setImageLoaded(true)}
  onError={() => setImageError(true)}
  style={{ 
    opacity: imageLoaded ? 1 : 0,
    transition: 'opacity 0.3s'
  }}
/>

{imageError && (
  <div className="fallback-image">
    Image not available
  </div>
)}
```

### 2. Lazy Loading
```javascript
// Add lazy loading for better performance
<img
  src="/Pokemon Scarlet.jpeg"
  alt="Pokemon Scarlet"
  loading="lazy"
  decoding="async"
/>
```

## Emergency Fixes

### Quick Fix 1: Fallback Images
```javascript
// Add fallback for missing images
const handleImageError = (e) => {
  e.target.src = '/placeholder-pokemon.jpg'; // Add a placeholder image
};

<img
  src={product.image}
  alt={product.name}
  onError={handleImageError}
/>
```

### Quick Fix 2: External Image CDN
```javascript
// Temporarily use external images while fixing local ones
const getImageUrl = (imageName) => {
  // Fallback to external CDN if local image fails
  return `/images/${imageName}` || `https://via.placeholder.com/300x400?text=${imageName}`;
};
```

## Prevention Best Practices

### 1. File Naming Convention
```bash
# Use consistent, URL-safe naming
pokemon-scarlet.jpeg          # ✅ Good
pokemon_violet.jpeg           # ✅ Acceptable  
Pokemon Scarlet.jpeg          # ❌ Avoid spaces
pokémon-legends.jpeg          # ❌ Avoid special characters
```

### 2. Automated Testing
```javascript
// Add image existence tests
describe('Product Images', () => {
  test('all product images exist', async () => {
    for (const product of products) {
      const response = await fetch(product.image);
      expect(response.status).toBe(200);
    }
  });
});
```

### 3. Build Verification
```bash
# Add to package.json scripts
"verify-build": "node scripts/verify-images.js"

# scripts/verify-images.js
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const requiredImages = [
  'Pokemon Scarlet.jpeg',
  'Pokemon Violet.jpeg',
  // ... list all required images
];

requiredImages.forEach(image => {
  const imagePath = path.join(distDir, image);
  if (!fs.existsSync(imagePath)) {
    console.error(`Missing image: ${image}`);
    process.exit(1);
  }
});

console.log('All images verified!');
```

## Contact & Support

If issues persist after following this guide:

1. **Check browser console** for specific error messages
2. **Test in incognito mode** to rule out caching issues
3. **Try different browsers** to identify browser-specific problems
4. **Check deployment platform documentation** for platform-specific requirements

## Common Error Messages & Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `404 Not Found` | File doesn't exist at specified path | Check file exists in public folder |
| `403 Forbidden` | Permission issues | Check file permissions |
| `CORS Error` | Cross-origin restrictions | Ensure images are served from same domain |
| `Failed to load resource` | Network or path issues | Check network connectivity and paths |
| `Image broken icon` | Invalid image file | Verify image file isn't corrupted |

---

*Last updated: January 2025*
*For Pokemon ecommerce application troubleshooting*