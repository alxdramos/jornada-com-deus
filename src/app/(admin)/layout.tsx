import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'
import { Sidebar } from '@/components/admin/Sidebar'
import { Topbar } from '@/components/admin/Topbar'

export const metadata = {
  title: 'Admin — Jornada com Deus',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verifica sessão Supabase
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verifica role admin (service role bypassa RLS)
  const { data: adminUser } = await supabaseAdmin
    .from('users')
    .select('name, email, image, role')
    .eq('id', user.id)
    .single()

  if (!adminUser || adminUser.role !== 'admin') redirect('/')

  return (
    <div className="flex h-screen bg-[#FAF9F6] overflow-hidden">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar adminName={adminUser.name} adminEmail={adminUser.email} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
