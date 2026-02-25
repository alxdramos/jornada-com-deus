import { Crown, ArrowRight } from 'lucide-react'

export function SubscriptionsPlaceholder() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-10 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[#FB923C]/10 to-[#F97316]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Crown size={28} className="text-[#FB923C]" />
      </div>
      <h3 className="text-base font-semibold text-[#1F2937] mb-2">Assinaturas em breve</h3>
      <p className="text-sm text-[#6B7280] max-w-sm mx-auto leading-relaxed">
        A integração com gateway de pagamento será adicionada em breve. Os dados de assinatura, conversão e churn aparecerão aqui automaticamente.
      </p>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between max-w-xs mx-auto bg-[#F9F8F5] rounded-xl px-4 py-3">
          <span className="text-xs text-[#6B7280]">Gateway de pagamento</span>
          <span className="text-xs font-semibold text-[#FB923C]">Stripe / Hotmart</span>
        </div>
        <div className="flex items-center justify-between max-w-xs mx-auto bg-[#F9F8F5] rounded-xl px-4 py-3">
          <span className="text-xs text-[#6B7280]">Tabela subscriptions</span>
          <span className="text-xs font-semibold text-[#9CA3AF]">TODO</span>
        </div>
        <div className="flex items-center justify-between max-w-xs mx-auto bg-[#F9F8F5] rounded-xl px-4 py-3">
          <span className="text-xs text-[#6B7280]">Webhooks de pagamento</span>
          <span className="text-xs font-semibold text-[#9CA3AF]">TODO</span>
        </div>
      </div>

      <p className="text-xs text-[#C4C9D4] mt-6 inline-flex items-center gap-1 font-mono">
        <span>MVP — features avançadas de assinatura serão adicionadas depois</span>
        <ArrowRight size={10} />
      </p>
    </div>
  )
}
