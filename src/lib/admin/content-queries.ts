/**
 * Content Library queries — usa supabaseAdmin (service role, bypassa RLS)
 * NUNCA importar em Client Components
 */
import { supabaseAdmin } from '@/lib/supabase'

export type ContentType = 'meditacao' | 'oracao' | 'devocional' | 'estudo' | 'kids'
export type ContentStatus = 'draft' | 'published' | 'archived'

export interface ContentItem {
  id: string
  type: ContentType
  status: ContentStatus
  title: string
  short_title: string | null
  description: string | null
  content: string | null
  reference: string | null
  category: string | null
  plus: boolean
  audio_url: string | null
  audio_duration: number | null
  image_url: string | null
  tags: string[]
  sort_order: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ContentListParams {
  type?: ContentType
  status?: ContentStatus
  page?: number
  pageSize?: number
  search?: string
}

export interface ContentListResult {
  items: ContentItem[]
  total: number
}

export async function getContentItems({
  type,
  status,
  page = 1,
  pageSize = 20,
  search,
}: ContentListParams = {}): Promise<ContentListResult> {
  let query = supabaseAdmin
    .from('content_library')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (type) query = query.eq('type', type)
  if (status) query = query.eq('status', status)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, count, error } = await query

  if (error) {
    console.error('[getContentItems]', error)
    return { items: [], total: 0 }
  }

  return { items: (data ?? []) as ContentItem[], total: count ?? 0 }
}

export async function getContentItem(id: string): Promise<ContentItem | null> {
  const { data, error } = await supabaseAdmin
    .from('content_library')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as ContentItem
}

export async function createContentItem(
  item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>
): Promise<ContentItem | null> {
  const { data, error } = await supabaseAdmin
    .from('content_library')
    .insert(item)
    .select()
    .single()

  if (error) {
    console.error('[createContentItem]', error)
    return null
  }
  return data as ContentItem
}

export async function updateContentItem(
  id: string,
  updates: Partial<Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>>
): Promise<ContentItem | null> {
  const { data, error } = await supabaseAdmin
    .from('content_library')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[updateContentItem]', error)
    return null
  }
  return data as ContentItem
}

export async function deleteContentItem(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('content_library')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteContentItem]', error)
    return false
  }
  return true
}

export async function getContentKpis() {
  const types: ContentType[] = ['meditacao', 'oracao', 'devocional', 'estudo', 'kids']

  const [totalResult, publishedResult, draftResult, ...typeCounts] = await Promise.all([
    supabaseAdmin.from('content_library').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('content_library').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabaseAdmin.from('content_library').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    ...types.map((t) =>
      supabaseAdmin.from('content_library').select('*', { count: 'exact', head: true }).eq('type', t)
    ),
  ])

  return {
    total: totalResult.count ?? 0,
    published: publishedResult.count ?? 0,
    draft: draftResult.count ?? 0,
    byType: Object.fromEntries(types.map((t, i) => [t, typeCounts[i].count ?? 0])) as Record<ContentType, number>,
  }
}
