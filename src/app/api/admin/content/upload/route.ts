/**
 * Gera presigned URL para upload direto ao Cloudflare R2
 * O cliente faz PUT direto no R2, sem passar pelo servidor Next.js
 */
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { supabaseAdmin } from '@/lib/supabase'
import { buildR2Key, getR2BucketContent, r2PublicUrl } from '@/lib/r2'
import { S3Client } from '@aws-sdk/client-s3'

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mp4']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_AUDIO_SIZE = 100 * 1024 * 1024  // 100 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024   // 10 MB

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return null

  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  if (!user) return null

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null
  return user
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { fileName, contentMimeType, fileType, contentType: itemType, fileSize } = await req.json()

  if (!fileName || !contentMimeType || !fileType || !itemType) {
    return NextResponse.json({ error: 'fileName, contentMimeType, fileType e contentType são obrigatórios' }, { status: 400 })
  }

  // Validar tipo de arquivo
  if (fileType === 'audio' && !ALLOWED_AUDIO_TYPES.includes(contentMimeType)) {
    return NextResponse.json({ error: `Tipo de áudio não permitido: ${contentMimeType}` }, { status: 400 })
  }
  if (fileType === 'image' && !ALLOWED_IMAGE_TYPES.includes(contentMimeType)) {
    return NextResponse.json({ error: `Tipo de imagem não permitido: ${contentMimeType}` }, { status: 400 })
  }
  if (fileType === 'audio' && fileSize > MAX_AUDIO_SIZE) {
    return NextResponse.json({ error: 'Arquivo de áudio excede 100 MB' }, { status: 400 })
  }
  if (fileType === 'image' && fileSize > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: 'Imagem excede 10 MB' }, { status: 400 })
  }

  // Criar client R2 inline para verificar configuração
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: 'R2 não configurado no servidor. Defina CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID e CLOUDFLARE_R2_SECRET_ACCESS_KEY.' },
      { status: 503 }
    )
  }

  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })

  const key = buildR2Key(itemType, fileType, fileName)
  const bucket = getR2BucketContent()

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentMimeType,
  })

  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 })
  const publicUrl = r2PublicUrl(key)

  return NextResponse.json({ presignedUrl, publicUrl, key })
}
