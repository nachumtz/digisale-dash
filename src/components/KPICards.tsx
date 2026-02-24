import { DollarSign, TrendingUp, ShoppingCart, XCircle } from 'lucide-react'
import type { KPIData } from '@/lib/types'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'

interface KPICardsProps {
    kpis: KPIData
}

const kpiConfig = [
    {
        key: 'totalRevenue' as const,
        label: 'סה״כ פדיון',
        icon: DollarSign,
        format: formatCurrency,
        gradient: 'from-emerald-500 to-emerald-600',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
    },
    {
        key: 'totalProfit' as const,
        label: 'סה״כ רווח',
        icon: TrendingUp,
        format: formatCurrency,
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        key: 'completedOrders' as const,
        label: 'הזמנות שהושלמו',
        icon: ShoppingCart,
        format: formatNumber,
        gradient: 'from-violet-500 to-violet-600',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
    },
    {
        key: 'cancellationRate' as const,
        label: 'אחוז ביטולים',
        icon: XCircle,
        format: formatPercent,
        gradient: 'from-amber-500 to-red-500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
    },
]

export default function KPICards({ kpis }: KPICardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {kpiConfig.map((config, index) => {
                const Icon = config.icon
                const value = kpis[config.key]
                const formattedValue = config.format(value)

                return (
                    <div
                        key={config.key}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-500">{config.label}</span>
                            <div className={`w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${config.iconColor}`} />
                            </div>
                        </div>

                        <div className="text-2xl font-bold text-slate-800 animate-count-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                            {formattedValue}
                        </div>

                        {/* Decorative bottom gradient bar */}
                        <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-l ${config.gradient} opacity-60`} />
                    </div>
                )
            })}
        </div>
    )
}
