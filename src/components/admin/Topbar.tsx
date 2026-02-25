interface TopbarProps {
  adminName: string | null
  adminEmail: string | null
}

export function Topbar({ adminName, adminEmail }: TopbarProps) {
  const initial = adminName?.charAt(0)?.toUpperCase() ?? 'A'

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Capitalizar primeira letra
  const dateLabel = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shrink-0">
      <p className="text-sm text-[#9CA3AF] hidden sm:block">{dateLabel}</p>
      <div className="flex items-center gap-3 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-[#1F2937] leading-tight">{adminName ?? 'Admin'}</p>
          <p className="text-xs text-[#9CA3AF] leading-tight">{adminEmail}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center text-white text-sm font-bold shadow-sm">
          {initial}
        </div>
      </div>
    </header>
  )
}
