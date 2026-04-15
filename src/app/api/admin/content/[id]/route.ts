import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { getContentItem, updateContentItem, deleteContentItem } from '@/lib/admin/content-queries'
import { zodErrorResponse } from '@/lib/validation/schemas'

const CONTENT_TYPES = ['meditacao', 'oracao', 'devocional', 'estudo', 'kids'] as const
const CONTENT_STATUSES = ['draft', 'published', 'archived'] as const

const UpdateContentSchema = z.object({
  type: z.enum(CONTENT_TYPES).optional(),
  status: z.enum(CONTENT_STATUSES).optional(),
  title: z.string().min(1).max(300).optional(),
  short_title: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  content: z.string().max(20000).optional().nullable(),
  reference: z.string().max(200).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  plus: z.boolean().optional(),
  audio_url: z.string().url().optional().nullable(),
  audio_duration: z.number().int().positive().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  sort_order: z.number().int().optional(),
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const item = await getContentItem(id)
  if (!item) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = UpdateContentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(zodErrorResponse(parsed.error), { status: 400 })
  }

  const item = await updateContentItem(id, parsed.data)
  if (!item) return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })

  return NextResponse.json(item)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const ok = await deleteContentItem(id)
  if (!ok) return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
