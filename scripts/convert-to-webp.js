const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const blogDir = path.join(__dirname, '../public/blog');
const productsDir = path.join(__dirname, '../public/products');

async function convertToWebP(dir) {
    const files = fs.readdirSync(dir);
    const pngFiles = files.filter(f => f.endsWith('.png'));

    for (const file of pngFiles) {
        const pngPath = path.join(dir, file);
        const webpPath = pngPath.replace('.png', '.webp');
        const baseName = path.basename(file, '.png');

        console.log(`Converting: ${file} -> ${baseName}.webp`);

        await sharp(pngPath)
            .webp({ quality: 85, nearLossless: true })
            .toFile(webpPath);

        // Get file sizes for comparison
        const pngStats = fs.statSync(pngPath);
        const webpStats = fs.statSync(webpPath);
        const savings = ((1 - webpStats.size / pngStats.size) * 100).toFixed(1);

        console.log(`  PNG: ${(pngStats.size / 1024).toFixed(1)}KB -> WebP: ${(webpStats.size / 1024).toFixed(1)}KB (${savings}% smaller)`);
    }
}

async function main() {
    console.log('=== Converting Blog Images ===');
    await convertToWebP(blogDir);

    console.log('\n=== Converting Products Images ===');
    await convertToWebP(productsDir);

    console.log('\n✅ Conversion complete!');
}

main().catch(console.error);
