import { useState } from 'react'
import { ChevronDown, ChevronUp, Table } from 'lucide-react'
import type { MergedRow } from '@/lib/types'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface DataPreviewProps {
    data: MergedRow[]
}

export default function DataPreview({ data }: DataPreviewProps) {
    const [isOpen, setIsOpen] = useState(false)
    const previewData = data.slice(0, 10)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {/* Toggle Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Table className="w-5 h-5 text-slate-400" />
                    <span className="font-semibold text-slate-700">הצג תצוגה מקדימה</span>
                    <span className="text-sm text-slate-400">({Math.min(10, data.length)} מתוך {data.length} שורות)</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </button>

            {/* Table */}
            {isOpen && (
                <div className="overflow-x-auto border-t border-slate-100">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">מזהה</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">תאריך</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">מוצר</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">קטגוריה</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">לקוח</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">עיר</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">כמות</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">הנחה</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">פדיון</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">רווח</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-600">סטטוס</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.map((row, index) => (
                                <tr
                                    key={row.Order_ID}
                                    className={`border-t border-slate-50 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                                        }`}
                                >
                                    <td className="px-4 py-3 font-mono text-slate-600">{row.Order_ID}</td>
                                    <td className="px-4 py-3 text-slate-600">{row.Order_Date}</td>
                                    <td className="px-4 py-3 text-slate-700 font-medium">{row.Product_Name}</td>
                                    <td className="px-4 py-3 text-slate-600">{row.Category}</td>
                                    <td className="px-4 py-3 text-slate-600">{row.Customer_Segment}</td>
                                    <td className="px-4 py-3 text-slate-600">{row.City}</td>
                                    <td className="px-4 py-3 text-slate-700 font-medium">{row.Quantity}</td>
                                    <td className="px-4 py-3 text-slate-600">{formatPercent(row.Discount * 100)}</td>
                                    <td className="px-4 py-3 text-emerald-600 font-semibold">{formatCurrency(row.Revenue)}</td>
                                    <td className="px-4 py-3 text-blue-600 font-semibold">{formatCurrency(row.Profit)}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${row.Status.trim() === 'הושלם'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {row.Status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
