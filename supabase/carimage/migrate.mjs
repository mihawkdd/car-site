import fs from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET = process.env.R2_BUCKET;

async function convertAndUpload(fileName) {
  try {
    const inputPath = path.join(process.cwd(), fileName);

    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const outputName = `${baseName}.webp`;

    const webpBuffer = await sharp(inputPath)
      .resize(1600, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 6, preset: 'photo' })
      .toBuffer();

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `original/${outputName}`,
      Body: webpBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000'
    }));

    console.log(`✅ Uploaded: ${outputName}`);
  } catch (err) {
    console.error(`❌ Failed on ${fileName}:`, err);
  }
}

async function processAllImages() {
  const files = await fs.readdir(process.cwd());

  const images = files.filter(name =>
    name.toLowerCase().endsWith('.jpg') ||
    name.toLowerCase().endsWith('.jpeg') ||
    name.toLowerCase().endsWith('.png')
  );

  console.log(`Found ${images.length} image(s)...`);

  for (const file of images) {
    await convertAndUpload(file);
  }

  console.log('🎉 All images processed!');
}

processAllImages();
