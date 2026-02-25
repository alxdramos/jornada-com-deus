'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, ArrowLeft, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users, exact: false },
  { href: '/admin/assinaturas', label: 'Assinaturas', icon: CreditCard, exact: false },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 h-full bg-white border-r border-[#E5E7EB] flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-5 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FB923C] to-[#F97316] rounded-xl flex items-center justify-center shadow-sm">
            <Sprout size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1F2937] leading-tight">Jornada com Deus</p>
            <p className="text-xs text-[#9CA3AF] leading-tight">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#FB923C]/10 text-[#FB923C]'
                  : 'text-[#6B7280] hover:bg-[#F9F8F5] hover:text-[#1F2937]'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to App */}
      <div className="p-3 border-t border-[#E5E7EB]">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9F8F5] transition-all duration-200"
        >
          <ArrowLeft size={15} />
          Voltar ao App
        </Link>
      </div>
    </aside>
  )
}
