# PWA Icons Guide

To complete the PWA setup, you need to create the following icon files:

## Required Icons:

1. **pwa-192x192.png** - 192x192 pixels
2. **pwa-512x512.png** - 512x512 pixels
3. **apple-touch-icon.png** - 180x180 pixels (optional)
4. **favicon.ico** - 32x32 pixels (optional)

## Design Specifications:

- Background: Orange (#f97316)
- Text: White "IM" letters
- Font: Bold, centered
- Style: Circular or rounded square

## Quick Generation Methods:

### Method 1: Online Tools
- Visit: https://www.pwabuilder.com/imageGenerator
- Upload a 512x512 base image
- Download all generated sizes

### Method 2: Manual Creation
1. Create a 512x512 canvas
2. Fill with orange background (#f97316)
3. Add white "IM" text in center (bold, large font)
4. Export as PNG
5. Resize to create 192x192 version

### Method 3: Using Canva
1. Go to canva.com
2. Create 512x512 design
3. Use orange background
4. Add "IM" text in white
5. Download and resize

## Placement:
Place all generated icons in the `frontend/public/` directory.

The PWA will work without icons but will show default browser icons until you add them.
