import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as settings from '../settings';

export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${settings.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: `${settings.CLOUDFLARE_R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`
  }
});

export const deleteFile = async (filePathInBucket: string) => {
  console.log(settings.CLOUDFLARE_R2_BUCKET_NAME, filePathInBucket);
  const deleteCommand = new DeleteObjectCommand({
    Bucket: settings.CLOUDFLARE_R2_BUCKET_NAME,
    Key: filePathInBucket
  });

  const r = await s3.send(deleteCommand);
  return r['$metadata'].httpStatusCode === 204;
};
