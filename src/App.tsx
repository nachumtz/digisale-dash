import { useState, useMemo, useRef } from 'react'
import { Toaster, toast } from 'sonner'
import { BarChart3, MapPin, RotateCcw, Loader2 } from 'lucide-react'
import FileUploader from './components/FileUploader'
import KPICards from './components/KPICards'
import Charts from './components/Charts'
import DataPreview from './components/DataPreview'
import ExportPDF from './components/ExportPDF'
import type { RawOrder, RawCustomer, RawProduct, MergedRow } from './lib/types'
import {
    mergeData,
    filterByCity,
    getUniqueCities,
    computeKPIs,
    getRevenueByCategory,
    getRevenueBySegment,
} from './lib/dataEngine'

export default function App() {
    const [mergedData, setMergedData] = useState<MergedRow[] | null>(null)
    const [selectedCity, setSelectedCity] = useState('כל הערים')
    const [isLoading, setIsLoading] = useState(false)
    const dashboardRef = useRef<HTMLDivElement>(null)

    const handleDataReady = async (
        orders: RawOrder[],
        customers: RawCustomer[],
        products: RawProduct[]
    ) => {
        setIsLoading(true)

        // Small delay for smooth loading animation
        await new Promise((r) => setTimeout(r, 800))

        try {
            const merged = mergeData(orders, customers, products)
            setMergedData(merged)
            setSelectedCity('כל הערים')
            toast.success(`עובד! ${merged.length} שורות מוזגו בהצלחה`, { duration: 3000 })
        } catch (error) {
            console.error('Merge error:', error)
            toast.error('שגיאה בעיבוד הנתונים — בדוק את תוכן הקבצים')
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setMergedData(null)
        setSelectedCity('כל הערים')
    }

    // ─── Derived State ────────────────────────────────────────
    const filteredData = useMemo(() => {
        if (!mergedData) return []
        return filterByCity(mergedData, selectedCity)
    }, [mergedData, selectedCity])

    const kpis = useMemo(() => computeKPIs(filteredData), [filteredData])
    const cities = useMemo(() => (mergedData ? getUniqueCities(mergedData) : []), [mergedData])
    const revenueByCategory = useMemo(() => getRevenueByCategory(filteredData), [filteredData])
    const revenueBySegment = useMemo(() => getRevenueBySegment(filteredData), [filteredData])

    // ─── Loading Screen ───────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Toaster position="top-center" richColors dir="rtl" />
                <div className="text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-6 shadow-lg">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">מעבד נתונים...</h2>
                    <p className="text-slate-400">ממזג טבלאות ומחשב מדדים</p>
                </div>
            </div>
        )
    }

    // ─── Upload Screen ────────────────────────────────────────
    if (!mergedData) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Toaster position="top-center" richColors dir="rtl" />
                <FileUploader onDataReady={handleDataReady} />
            </div>
        )
    }

    // ─── Dashboard ────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50">
            <Toaster position="top-center" richColors dir="rtl" />

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200/50">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 leading-tight">DigiSale Dashboard</h1>
                                <p className="text-xs text-slate-400">לוח בקרת מכירות</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* City Filter */}
                            <div className="relative flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer transition-all"
                                >
                                    <option value="כל הערים">כל הערים</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Export PDF */}
                            <ExportPDF targetRef={dashboardRef} />

                            {/* Reset */}
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 pdf-hide"
                                title="חזרה למסך ההעלאה"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span className="hidden sm:inline">איפוס</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <KPICards kpis={kpis} />
                <Charts revenueByCategory={revenueByCategory} revenueBySegment={revenueBySegment} />
                <DataPreview data={filteredData} />
            </main>
        </div>
    )
}
