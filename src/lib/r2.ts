/**
 * Cloudflare R2 client — S3-compatible
 *
 * Env vars necessárias (Vercel + .env.local):
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_R2_ACCESS_KEY_ID
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY
 *   CLOUDFLARE_R2_BUCKET_CONTENT     (bucket para uploads do CMS, ex: "jornada-content")
 *   NEXT_PUBLIC_R2_PUBLIC_URL        (URL pública do bucket, ex: "https://pub-xxx.r2.dev")
 */

import { S3Client } from '@aws-sdk/client-s3'

function getR2Client(): S3Client {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'R2 não configurado. Defina CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID e CLOUDFLARE_R2_SECRET_ACCESS_KEY.'
    )
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export const r2Client = new Proxy({} as S3Client, {
  get(_, prop) {
    return getR2Client()[prop as keyof S3Client]
  },
})

export function getR2BucketContent(): string {
  return process.env.CLOUDFLARE_R2_BUCKET_CONTENT ?? 'jornada-content'
}

/** Converte uma R2 key em URL pública */
export function r2PublicUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''
  return `${base.replace(/\/$/, '')}/${key}`
}

/** Gera uma key organizada por tipo e timestamp */
export function buildR2Key(
  contentType: string,
  fileType: 'audio' | 'image',
  originalName: string
): string {
  const ext = originalName.split('.').pop() ?? 'bin'
  const ts = Date.now()
  return `${contentType}/${fileType}/${ts}.${ext}`
}
