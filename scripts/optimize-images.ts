import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const BATCH_SIZE = 10;
const MAX_RETRIES = 3;
const SIZES = {
  thumbnail: 400,
  medium: 800,
  large: 1600
};

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadFile(bucket: string, filePath: string, retries = 0): Promise<ArrayBuffer> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);
    
    if (error) throw error;
    return await data.arrayBuffer();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await sleep(1000 * Math.pow(2, retries));
      return downloadFile(bucket, filePath, retries + 1);
    }
    throw error;
  }
}

async function optimizeImage(buffer: ArrayBuffer, size: number): Promise<Buffer> {
  return sharp(Buffer.from(buffer))
    .resize(size, null, { 
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({ 
      quality: 80,
      effort: 6,
      preset: 'photo'
    })
    .toBuffer();
}

async function uploadOptimizedFile(
  bucket: string,
  originalPath: string,
  buffer: Buffer,
  size: number,
  retries = 0
): Promise<string> {
  try {
    const fileName = path.basename(originalPath, path.extname(originalPath));
    const optimizedPath = `optimized/${size}/${fileName}.webp`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(optimizedPath, buffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(optimizedPath);

    return publicUrl;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await sleep(1000 * Math.pow(2, retries));
      return uploadOptimizedFile(bucket, originalPath, buffer, size, retries + 1);
    }
    throw error;
  }
}

async function processImage(bucket: string, imagePath: string): Promise<void> {
  try {
    console.log(`Processing ${imagePath}...`);
    const imageBuffer = await downloadFile(bucket, imagePath);

    // Generate optimized versions for each size
    for (const [name, size] of Object.entries(SIZES)) {
      const optimizedBuffer = await optimizeImage(imageBuffer, size);
      const optimizedUrl = await uploadOptimizedFile(bucket, imagePath, optimizedBuffer, size);
      console.log(`Created ${name} version: ${optimizedUrl}`);
    }
  } catch (error) {
    console.error(`Failed to process ${imagePath}:`, error);
  }
}

async function processAllImages() {
  try {
    // Get all cars with images
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, images');

    if (carsError) throw carsError;

    console.log(`Found ${cars.length} cars to process`);

    // Process images in batches
    const allImages = cars.flatMap(car => car.images);
    const uniqueImages = [...new Set(allImages)];

    for (let i = 0; i < uniqueImages.length; i += BATCH_SIZE) {
      const batch = uniqueImages.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(image => processImage('car-images', image)));
      console.log(`Processed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(uniqueImages.length / BATCH_SIZE)}`);
    }

    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Failed to process images:', error);
  }
}

processAllImages();