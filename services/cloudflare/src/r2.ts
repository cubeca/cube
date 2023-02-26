import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as settings from './settings';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${settings.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: `${settings.CLOUDFLARE_R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`,
  }
});

export const getPresignedUploadUrl = async (filePathInBucket: string, expiresIn: number) => {
  const putCommand = new PutObjectCommand({
    Bucket: settings.CLOUDFLARE_R2_BUCKET_NAME,
    Key: filePathInBucket
  });

  return await getSignedUrl(s3, putCommand, { expiresIn });
}
