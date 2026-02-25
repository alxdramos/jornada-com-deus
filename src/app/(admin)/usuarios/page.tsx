import { Suspense } from 'react'
import { getAdminUsers } from '@/lib/admin/queries'
import { UsersTable } from '@/components/admin/UsersTable'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

async function UsersList({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const pageSize = 20
  const search = searchParams.search ?? ''

  const { users, total } = await getAdminUsers(page, pageSize, search || undefined)

  return <UsersTable users={users} total={total} page={page} pageSize={pageSize} />
}

export default async function UsuariosPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Usuários</h1>
        <p className="text-sm text-[#9CA3AF] mt-0.5">
          Lista completa de usuários cadastrados
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 bg-white rounded-2xl border border-[#E5E7EB] animate-pulse" />
        }
      >
        <UsersList searchParams={params} />
      </Suspense>
    </div>
  )
}
