'use client'

import { motion } from 'framer-motion'
import { Users, UserPlus, Crown, Activity, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KpiColor, KpiIconName } from '@/lib/admin/types'

const iconMap = {
  users: Users,
  'user-plus': UserPlus,
  crown: Crown,
  activity: Activity,
  'trending-up': TrendingUp,
  zap: Zap,
}

const colorMap: Record<KpiColor, { icon: string; bg: string }> = {
  default: { icon: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]' },
  green: { icon: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  orange: { icon: 'text-[#FB923C]', bg: 'bg-[#FB923C]/10' },
  blue: { icon: 'text-blue-500', bg: 'bg-blue-50' },
}

interface KpiCardProps {
  title: string
  value: number | string
  icon: KpiIconName
  trend?: string
  trendUp?: boolean
  color?: KpiColor
  description?: string
  index?: number
}

export function KpiCard({
  title,
  value,
  icon,
  trend,
  trendUp = true,
  color = 'default',
  description,
  index = 0,
}: KpiCardProps) {
  const Icon = iconMap[icon]
  const colors = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide truncate">{title}</p>
          <p className="text-3xl font-bold text-[#1F2937] mt-1.5 tabular-nums leading-none">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </p>
          {trend && (
            <p className={cn('text-xs font-semibold mt-1.5', trendUp ? 'text-[#10B981]' : 'text-red-400')}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
          {description && !trend && (
            <p className="text-xs text-[#C4C9D4] mt-1.5 leading-tight">{description}</p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl flex-shrink-0 mt-0.5', colors.bg)}>
          <Icon size={19} className={colors.icon} />
        </div>
      </div>
    </motion.div>
  )
}
