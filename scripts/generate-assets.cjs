const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPNG(width, height, drawPixel) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // filter type None
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y);
      rawData[idx] = r;
      rawData[idx + 1] = g;
      rawData[idx + 2] = b;
      rawData[idx + 3] = a;
    }
  }
  const compressed = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = zlib.crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  
  return Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

// Generate Stempel (300x300)
function generateStempel() {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  
  const png = createPNG(size, size, (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Stamp Ink color: deep purple-blue with subtle noise
    const noise = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
    const alphaNoise = 0.85 + Math.abs(noise) * 0.15;
    
    const inkR = 28;
    const inkG = 58;
    const inkB = 148;
    
    // Outer thick ring: r between 136 and 142
    if (dist >= 134 && dist <= 142) {
      return [inkR, inkG, inkB, Math.round(240 * alphaNoise)];
    }
    // Inner thin ring: r between 110 and 113
    if (dist >= 110 && dist <= 113) {
      return [inkR, inkG, inkB, Math.round(230 * alphaNoise)];
    }
    // Center ring: r between 58 and 61
    if (dist >= 58 && dist <= 61) {
      return [inkR, inkG, inkB, Math.round(220 * alphaNoise)];
    }
    
    // Center horizontal banner for LUNAS / SACIL
    if (dist <= 58) {
      // Basketball ribs/seams
      if (Math.abs(dy) <= 1.5 || Math.abs(dx) <= 1.5) {
        return [inkR, inkG, inkB, Math.round(200 * alphaNoise)];
      }
      // curved seams
      const seamDist1 = Math.abs(Math.sqrt((dx - 35) * (dx - 35) + dy * dy) - 45);
      const seamDist2 = Math.abs(Math.sqrt((dx + 35) * (dx + 35) + dy * dy) - 45);
      if (seamDist1 <= 1.5 || seamDist2 <= 1.5) {
        return [inkR, inkG, inkB, Math.round(200 * alphaNoise)];
      }
    }

    // Rectangular stamp box across middle
    if (Math.abs(dy) <= 18 && Math.abs(dx) <= 90) {
      if (Math.abs(dy) >= 15 || Math.abs(dx) >= 86) {
        return [inkR, inkG, inkB, Math.round(250 * alphaNoise)];
      }
      // inside box text hint
      if (Math.abs(dy) <= 14 && Math.abs(dx) <= 84) {
        // slightly tinted transparent fill for stamp box
        return [inkR, inkG, inkB, 25];
      }
    }
    
    // Decorative stars on left and right
    const starLeft = Math.sqrt((dx + 122) * (dx + 122) + dy * dy);
    const starRight = Math.sqrt((dx - 122) * (dx - 122) + dy * dy);
    if (starLeft <= 5 || starRight <= 5) {
      return [inkR, inkG, inkB, 230];
    }
    
    // Lettering track dots/simulated text in circular band
    if (dist > 114 && dist < 133) {
      // pseudo-glyph pattern around circular band
      const angle = Math.atan2(dy, dx);
      const pattern = Math.sin(angle * 32) * Math.sin((dist - 123) * 1.8);
      if (pattern > 0.4) {
        return [inkR, inkG, inkB, Math.round(210 * alphaNoise)];
      }
    }
    
    return [0, 0, 0, 0]; // transparent
  });
  
  fs.writeFileSync(path.join(__dirname, '../public/assets/sacil-basket-stempel.png'), png);
  console.log('Created sacil-basket-stempel.png');
}

// Generate School Logo SMAN 1 Cileunyi (200x200)
function generateSchoolLogo() {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  
  const png = createPNG(size, size, (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Outer border
    if (dist <= 96 && dist >= 90) {
      return [26, 54, 93, 255]; // Navy
    }
    if (dist < 90 && dist >= 86) {
      return [217, 119, 6, 255]; // Gold
    }
    if (dist < 86) {
      // Shield crest inside
      if (dy > -60 && dy < 60 && Math.abs(dx) < 70 - Math.max(0, dy) * 0.4) {
        // Torch / book design colors
        if (Math.abs(dx) <= 4 && dy >= -40 && dy <= 20) {
          return [220, 38, 38, 255]; // Torch handle / flame
        }
        if (dy >= -55 && dy <= -38 && Math.abs(dx) <= 12) {
          return [245, 158, 11, 255]; // Flame gold
        }
        if (dy >= 20 && dy <= 45 && Math.abs(dx) <= 50) {
          return [30, 64, 175, 255]; // Open book base navy
        }
        return [255, 255, 255, 250];
      }
      return [240, 249, 255, 240];
    }
    
    return [0, 0, 0, 0];
  });
  
  fs.writeFileSync(path.join(__dirname, '../public/assets/logo-sman1-cileunyi.png'), png);
  console.log('Created logo-sman1-cileunyi.png');
}

generateStempel();
generateSchoolLogo();
