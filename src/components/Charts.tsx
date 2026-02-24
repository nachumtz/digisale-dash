import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
    PieChart,
    Pie,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ChartsProps {
    revenueByCategory: { name: string; value: number }[]
    revenueBySegment: { name: string; value: number }[]
}

const BAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{ value: number; name: string }>
    label?: string
}

function CustomBarTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
            <p className="text-sm text-emerald-600 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
    )
}

function CustomPieTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-slate-700 mb-1">{payload[0].name}</p>
            <p className="text-sm text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
    )
}

export default function Charts({ revenueByCategory, revenueBySegment }: ChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue by Category — Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-bold text-slate-800 mb-1">פדיון לפי קטגוריה</h3>
                <p className="text-sm text-slate-400 mb-6">הזמנות שהושלמו בלבד</p>

                {revenueByCategory.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400">אין נתונים להצגה</div>
                ) : (
                    <ResponsiveContainer width="100%" height={Math.max(280, revenueByCategory.length * 60)}>
                        <BarChart data={revenueByCategory} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis
                                type="number"
                                tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                orientation="right"
                                width={120}
                                tick={{ fontSize: 14, fill: '#334155', fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={32}>
                                {revenueByCategory.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Revenue by Segment — Donut Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-bold text-slate-800 mb-1">פדיון לפי פלח לקוחות</h3>
                <p className="text-sm text-slate-400 mb-6">הזמנות שהושלמו בלבד</p>

                {revenueBySegment.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400">אין נתונים להצגה</div>
                ) : (
                    <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={revenueBySegment}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    nameKey="name"
                                    strokeWidth={0}
                                >
                                    {revenueBySegment.map((_, index) => (
                                        <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {revenueBySegment.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                                    />
                                    <span className="text-sm text-slate-600">{item.name}</span>
                                    <span className="text-sm font-semibold text-slate-800">{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
