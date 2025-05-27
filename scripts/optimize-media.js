import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function downloadFile(bucket, filePath) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath);
  
  if (error) throw error;
  return data;
}

async function optimizeImage(buffer) {
  return sharp(buffer)
    .resize(1080, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

async function uploadOptimizedFile(bucket, filePath, buffer, contentType) {
  const optimizedPath = `optimized/${path.basename(filePath, path.extname(filePath))}.webp`;
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(optimizedPath, buffer, {
      contentType,
      cacheControl: '31536000',
      upsert: true
    });

  if (error) throw error;
  return optimizedPath;
}

async function processAllMedia() {
  try {
    // Get all cars
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, images, videos');

    if (carsError) throw carsError;

    console.log(`Found ${cars.length} cars to process`);

    for (const car of cars) {
      console.log(`Processing car ${car.id}`);

      // Process images
      for (const imagePath of car.images) {
        try {
          console.log(`Processing image: ${imagePath}`);
          const imageBuffer = await downloadFile('car-images', imagePath);
          const optimizedBuffer = await optimizeImage(imageBuffer);
          const optimizedPath = await uploadOptimizedFile(
            'car-images',
            imagePath,
            optimizedBuffer,
            'image/webp'
          );
          console.log(`Optimized image saved to: ${optimizedPath}`);
        } catch (error) {
          console.error(`Failed to process image ${imagePath}:`, error);
        }
      }

      // Process videos (just move to optimized bucket for now)
      if (car.videos) {
        for (const videoPath of car.videos) {
          try {
            console.log(`Processing video: ${videoPath}`);
            const videoBuffer = await downloadFile('car-videos', videoPath);
            const optimizedPath = await uploadOptimizedFile(
              'car-videos',
              videoPath,
              videoBuffer,
              'video/mp4'
            );
            console.log(`Video moved to: ${optimizedPath}`);
          } catch (error) {
            console.error(`Failed to process video ${videoPath}:`, error);
          }
        }
      }
    }

    console.log('Media optimization complete!');
  } catch (error) {
    console.error('Failed to process media:', error);
  }
}

processAllMedia();