import type { Env } from '../env';
import { makeCloudflareTusUploadMetadata } from '../utils/tus';

function streamUrl(env: Env, path = ''): string {
  return `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream${path}`;
}

function authHeaders(env: Env): HeadersInit {
  return { Authorization: `bearer ${env.CLOUDFLARE_API_TOKEN}` };
}

export async function getTusUploadUrl(
  env: Env,
  fileId: string,
  fileSizeBytes: number,
  reserveDurationSeconds: number,
  urlValidDurationSeconds: number,
  userId: string
): Promise<{ tusUploadUrl: string | null; cloudflareStreamUid: string | null }> {
  const response = await fetch(`${streamUrl(env)}?direct_user=true`, {
    method: 'POST',
    headers: {
      ...authHeaders(env),
      'Tus-Resumable': '1.0.0',
      'Upload-Creator': `file:${fileId}`,
      'Upload-Length': String(fileSizeBytes),
      'Upload-Metadata': makeCloudflareTusUploadMetadata({
        reserveDurationSeconds,
        isPrivate: false,
        urlValidDurationSeconds,
        uploadingUserId: userId
      })
    }
  });

  return {
    tusUploadUrl: response.headers.get('location'),
    cloudflareStreamUid: response.headers.get('stream-media-id')
  };
}

export async function deleteVideo(env: Env, cloudflareStreamUid: string): Promise<boolean> {
  const response = await fetch(streamUrl(env, `/${cloudflareStreamUid}`), {
    method: 'DELETE',
    headers: authHeaders(env)
  });
  return response.status === 200;
}

export async function getVideoDetails(env: Env, cloudflareStreamUid: string): Promise<Record<string, unknown> | null> {
  const response = await fetch(streamUrl(env, `/${cloudflareStreamUid}`), { headers: authHeaders(env) });
  if (response.status !== 200) return null;
  const body = (await response.json()) as { result?: Record<string, unknown> };
  return body.result ?? null;
}
