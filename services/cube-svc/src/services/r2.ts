import { AwsClient } from 'aws4fetch';
import type { Env } from '../env';

/**
 * Browser uploads PUT directly to R2 with the Content-Type they declared.
 * An R2 binding cannot mint that S3 SigV4 URL, so presigning stays on the S3 API.
 * Deletes go through the R2 binding and remove the same object key.
 */
export async function presignPut(env: Env, filePathInBucket: string, mimeType: string | undefined, expiresIn: number): Promise<string> {
  const encodedKey = filePathInBucket.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  const url = new URL(`https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.CLOUDFLARE_R2_BUCKET_NAME}/${encodedKey}`);
  url.searchParams.set('X-Amz-Expires', String(expiresIn));

  // Content-Type is intentionally not signed. The browser sends it later with the
  // file body. R2 accepts that unsigned header when the payload is UNSIGNED-PAYLOAD.
  // Signing it here would bind the signature to an empty body.
  void mimeType;

  const client = new AwsClient({
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto'
  });

  const signed = await client.sign(new Request(url, { method: 'PUT' }), { aws: { signQuery: true } });
  return signed.url;
}

export async function deleteR2Object(env: Env, filePathInBucket: string): Promise<void> {
  await env.R2_BUCKET.delete(filePathInBucket);
}
