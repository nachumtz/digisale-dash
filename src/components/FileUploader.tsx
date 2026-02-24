import { useState, useCallback, useRef } from 'react'
import { Upload, FileCheck, AlertCircle, Sparkles, Database } from 'lucide-react'
import { toast } from 'sonner'
import { parseCSV, parseCSVText, validateCSVColumns, REQUIRED_COLUMNS } from '@/lib/dataEngine'
import type { RawOrder, RawCustomer, RawProduct } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
    onDataReady: (orders: RawOrder[], customers: RawCustomer[], products: RawProduct[]) => void
}

interface FileSlot {
    label: string
    key: 'orders' | 'customers' | 'products'
    fileName: string | null
    data: unknown[] | null
    status: 'waiting' | 'parsed' | 'error'
}

export default function FileUploader({ onDataReady }: FileUploaderProps) {
    const [slots, setSlots] = useState<FileSlot[]>([
        { label: 'הזמנות (Orders)', key: 'orders', fileName: null, data: null, status: 'waiting' },
        { label: 'לקוחות (Customers)', key: 'customers', fileName: null, data: null, status: 'waiting' },
        { label: 'מוצרים (Products)', key: 'products', fileName: null, data: null, status: 'waiting' },
    ])
    const [loadingDemo, setLoadingDemo] = useState(false)
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null])

    const handleFile = useCallback(async (file: File, slotIndex: number) => {
        const slotKey = slots[slotIndex].key
        const requiredCols = REQUIRED_COLUMNS[slotKey]

        try {
            const data = await parseCSV<Record<string, unknown>>(file)
            const errors = validateCSVColumns(data, requiredCols, file.name)

            if (errors.length > 0) {
                errors.forEach(err => toast.error(err))
                setSlots(prev => prev.map((s, i) =>
                    i === slotIndex ? { ...s, status: 'error', fileName: file.name, data: null } : s
                ))
                return
            }

            setSlots(prev => prev.map((s, i) =>
                i === slotIndex ? { ...s, status: 'parsed', fileName: file.name, data } : s
            ))
            toast.success(`${file.name} — נטען בהצלחה (${data.length} שורות)`)
        } catch {
            toast.error(`שגיאה בקריאת ${file.name}`)
            setSlots(prev => prev.map((s, i) =>
                i === slotIndex ? { ...s, status: 'error', fileName: file.name, data: null } : s
            ))
        }
    }, [slots])

    const handleDrop = useCallback((e: React.DragEvent, slotIndex: number) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file, slotIndex)
    }, [handleFile])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file, slotIndex)
    }, [handleFile])

    const allReady = slots.every(s => s.status === 'parsed')

    const handleGenerate = () => {
        if (!allReady) return
        onDataReady(
            slots[0].data as RawOrder[],
            slots[1].data as RawCustomer[],
            slots[2].data as RawProduct[]
        )
    }

    const handleLoadDemo = async () => {
        setLoadingDemo(true)
        try {
            const [ordersRes, customersRes, productsRes] = await Promise.all([
                fetch('/data/orders_demo.csv'),
                fetch('/data/customers_demo.csv'),
                fetch('/data/products_demo.csv'),
            ])

            const ordersText = await ordersRes.text()
            const customersText = await customersRes.text()
            const productsText = await productsRes.text()

            const orders = parseCSVText<RawOrder>(ordersText)
            const customers = parseCSVText<RawCustomer>(customersText)
            const products = parseCSVText<RawProduct>(productsText)

            setSlots([
                { label: 'הזמנות (Orders)', key: 'orders', fileName: 'orders_demo.csv', data: orders, status: 'parsed' },
                { label: 'לקוחות (Customers)', key: 'customers', fileName: 'customers_demo.csv', data: customers, status: 'parsed' },
                { label: 'מוצרים (Products)', key: 'products', fileName: 'products_demo.csv', data: products, status: 'parsed' },
            ])
            toast.success('נתוני הדמו נטענו בהצלחה!')
        } catch {
            toast.error('שגיאה בטעינת נתוני הדמו')
        } finally {
            setLoadingDemo(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-5 shadow-lg shadow-emerald-200">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">DigiSale Dashboard</h1>
                    <p className="text-slate-500 text-lg">העלה 3 קבצי CSV כדי ליצור לוח בקרת מכירות חכם</p>
                </div>

                {/* File Slots */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {slots.map((slot, index) => (
                        <div
                            key={slot.key}
                            className={cn(
                                'relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300',
                                'hover:shadow-lg hover:-translate-y-1',
                                'animate-slide-up',
                                slot.status === 'waiting' && 'border-slate-300 bg-white hover:border-emerald-400',
                                slot.status === 'parsed' && 'border-emerald-400 bg-emerald-50',
                                slot.status === 'error' && 'border-red-400 bg-red-50',
                            )}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                            onDrop={(e) => handleDrop(e, index)}
                            onClick={() => fileInputRefs.current[index]?.click()}
                        >
                            <input
                                ref={el => { fileInputRefs.current[index] = el }}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => handleInputChange(e, index)}
                            />

                            {slot.status === 'waiting' && (
                                <>
                                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                    <p className="font-semibold text-slate-700 mb-1">{slot.label}</p>
                                    <p className="text-sm text-slate-400">גרור קובץ CSV לכאן או לחץ לבחירה</p>
                                </>
                            )}

                            {slot.status === 'parsed' && (
                                <>
                                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-count-up">
                                        <FileCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="font-semibold text-emerald-700 mb-1">{slot.label}</p>
                                    <p className="text-sm text-emerald-600">{slot.fileName}</p>
                                    <p className="text-xs text-emerald-500 mt-1">{(slot.data as unknown[])?.length} שורות</p>
                                </>
                            )}

                            {slot.status === 'error' && (
                                <>
                                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                                    <p className="font-semibold text-red-700 mb-1">{slot.label}</p>
                                    <p className="text-sm text-red-500">שגיאה — לחץ לנסות שוב</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    {allReady && (
                        <button
                            onClick={handleGenerate}
                            className="px-8 py-4 bg-gradient-to-l from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            🚀 צור לוח בקרה
                        </button>
                    )}

                    <button
                        onClick={handleLoadDemo}
                        disabled={loadingDemo}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                        <Database className="w-4 h-4" />
                        {loadingDemo ? 'טוען...' : 'טען נתוני דמו לבדיקה'}
                    </button>
                </div>
            </div>
        </div>
    )
}
