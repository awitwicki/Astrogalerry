import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/images/originals');
const outputDir = path.join(__dirname, '../public/images/thumbnails');

async function generateThumbnails() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(inputDir);

    for (const file of files) {
      if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);

        await sharp(inputPath)
          .resize(500, 500, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toFile(outputPath);

        console.log(`Generated thumbnail for: ${file}`);
      }
    }
    console.log('Thumbnail generation complete!');
  } catch (error) {
    console.error('Error generating thumbnails:', error);
  }
}

generateThumbnails();
