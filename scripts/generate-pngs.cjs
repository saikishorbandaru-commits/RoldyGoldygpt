const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const products = [
  {
    id: 'p-1',
    name: 'Rajwada Handcrafted Kundan & Emerald Choker',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=90',
    type: 'choker',
    bg: 'dark'
  },
  {
    id: 'p-2',
    name: 'Divine Temple Deity Kemp Jhumka Set',
    url: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=1000&q=90',
    type: 'earrings',
    bg: 'light'
  },
  {
    id: 'p-3',
    name: 'Seoul Minimalist 18K Dipped Hoop Earrings',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=90',
    type: 'earrings',
    bg: 'light'
  },
  {
    id: 'p-4',
    name: 'Mughal Polki Bridal Maangtikka & Passa Set',
    url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1000&q=90',
    type: 'tikka',
    bg: 'light'
  },
  {
    id: 'p-5',
    name: 'Nawabi Meenakari Peacock Chandbali Earrings',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=90',
    type: 'earrings',
    bg: 'light'
  },
  {
    id: 'p-6',
    name: 'Sleek 18K Gold Plated Paperclip Chain & Locket',
    url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=90',
    type: 'necklace',
    bg: 'dark'
  },
  {
    id: 'p-7',
    name: 'Ganga-Jamuna Royal Filigree Bangle Pair',
    url: 'https://images.unsplash.com/photo-1611591475152-478311d9e76b?auto=format&fit=crop&w=1000&q=90',
    type: 'bangles',
    bg: 'neutral'
  },
  {
    id: 'p-8',
    name: 'Gangotri Temple Kasu Harame Haram Long Necklace',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=90',
    type: 'necklace',
    bg: 'light'
  }
];

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadImage(res.headers.location));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function processProduct(prod) {
  console.log(`Processing ${prod.id}: ${prod.name}...`);
  try {
    const rawBuffer = await downloadImage(prod.url);
    const image = sharp(rawBuffer);
    const metadata = await image.metadata();
    
    // Resize to max 800x800 for optimal crispness & performance
    const { data, info } = await image
      .resize(800, 800, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const channels = info.channels; // 4 (RGBA)

    // Sample corner pixels to determine background baseline
    const corners = [
      0, // top-left
      (width - 1) * channels, // top-right
      ((height - 1) * width) * channels, // bottom-left
      ((height - 1) * width + (width - 1)) * channels // bottom-right
    ];

    let bgR = 0, bgG = 0, bgB = 0;
    for (const c of corners) {
      bgR += data[c];
      bgG += data[c + 1];
      bgB += data[c + 2];
    }
    bgR /= corners.length;
    bgG /= corners.length;
    bgB /= corners.length;

    const isLightBg = (bgR + bgG + bgB) / 3 > 120;
    console.log(`  Background detected: ${isLightBg ? 'Light' : 'Dark'} (R:${Math.round(bgR)}, G:${Math.round(bgG)}, B:${Math.round(bgB)})`);

    // Edge flood-fill or distance-based alpha calculation
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const brightness = (r + g + b) / 3;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;

      // Calculate color distance to background
      const distToBg = Math.sqrt(
        (r - bgR) ** 2 +
        (g - bgG) ** 2 +
        (b - bgB) ** 2
      );

      if (isLightBg) {
        // In light backgrounds, jewelry has higher saturation (gold/green/red) or darker tone
        if (brightness > 220 && saturation < 0.2) {
          data[i + 3] = 0; // completely transparent
        } else if (distToBg < 40 && saturation < 0.25) {
          const alpha = Math.max(0, Math.min(255, (distToBg - 15) * 8));
          data[i + 3] = alpha;
        } else if (brightness > 190 && saturation < 0.15) {
          const alpha = Math.max(0, Math.min(255, (220 - brightness) * 8));
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      } else {
        // In dark backgrounds, jewelry is bright gold/gems
        if (brightness < 35 && saturation < 0.3) {
          data[i + 3] = 0;
        } else if (distToBg < 35 && saturation < 0.2) {
          const alpha = Math.max(0, Math.min(255, (distToBg - 15) * 8));
          data[i + 3] = alpha;
        } else if (brightness < 50 && saturation < 0.25) {
          const alpha = Math.max(0, Math.min(255, (brightness - 25) * 8));
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      }
    }

    const outPath = path.join(__dirname, '..', 'public', 'assets', 'tryon', `${prod.id}.png`);
    await sharp(data, {
      raw: {
        width,
        height,
        channels: 4
      }
    })
      .png({ quality: 95, compressionLevel: 8 })
      .toFile(outPath);

    console.log(`  ✓ Saved transparent PNG to ${outPath}`);
  } catch (err) {
    console.error(`  ✕ Error processing ${prod.id}:`, err);
  }
}

async function run() {
  for (const p of products) {
    await processProduct(p);
  }
  console.log('All products processed successfully!');
}

run();
