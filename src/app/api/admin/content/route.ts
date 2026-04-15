import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { getContentItems, createContentItem } from '@/lib/admin/content-queries'
import { zodErrorResponse } from '@/lib/validation/schemas'

const CONTENT_TYPES = ['meditacao', 'oracao', 'devocional', 'estudo', 'kids'] as const
const CONTENT_STATUSES = ['draft', 'published', 'archived'] as const

const CreateContentSchema = z.object({
  type: z.enum(CONTENT_TYPES),
  status: z.enum(CONTENT_STATUSES).default('draft'),
  title: z.string().min(1).max(300),
  short_title: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  content: z.string().max(20000).optional().nullable(),
  reference: z.string().max(200).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  plus: z.boolean().default(false),
  audio_url: z.string().url().optional().nullable(),
  audio_duration: z.number().int().positive().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
})

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

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req)
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  const result = await getContentItems({
    type: (searchParams.get('type') as typeof CONTENT_TYPES[number]) || undefined,
    status: (searchParams.get('status') as typeof CONTENT_STATUSES[number]) || undefined,
    page: parseInt(searchParams.get('page') ?? '1'),
    pageSize: parseInt(searchParams.get('pageSize') ?? '20'),
    search: searchParams.get('search') ?? undefined,
  })

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req)
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = CreateContentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 })
  }

  const itemData = {
    ...parsed.data,
    short_title: parsed.data.short_title ?? null,
    description: parsed.data.description ?? null,
    content: parsed.data.content ?? null,
    reference: parsed.data.reference ?? null,
    category: parsed.data.category ?? null,
    audio_url: parsed.data.audio_url ?? null,
    audio_duration: parsed.data.audio_duration ?? null,
    image_url: parsed.data.image_url ?? null,
    created_by: user.id,
  }
  const item = await createContentItem(itemData)
  if (!item) {
    return NextResponse.json({ error: 'Erro ao criar conteúdo' }, { status: 500 })
  }

  return NextResponse.json(item, { status: 201 })
}
