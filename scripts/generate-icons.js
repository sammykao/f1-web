const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/icon.svg'));
  
  // Generate regular icon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '../public/icon.png'));

  // Generate apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-icon.png'));

  // Generate og image
  await sharp(svgBuffer)
    .resize(1920, 1080)
    .extend({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    })
    .png()
    .toFile(path.join(__dirname, '../public/og.jpg'));

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error); 