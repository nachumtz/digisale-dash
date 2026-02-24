import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ExportPDFProps {
    targetRef: React.RefObject<HTMLDivElement | null>
}

export default function ExportPDF({ targetRef }: ExportPDFProps) {
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        if (!targetRef.current || exporting) return
        setExporting(true)

        try {
            const canvas = await html2canvas(targetRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f8fafc',
                logging: false,
                // Remove interactive elements from capture
                ignoreElements: (element) => element.classList.contains('pdf-hide'),
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            // Handle multi-page if content is too tall
            const pageHeight = pdf.internal.pageSize.getHeight()
            let currentY = 0

            while (currentY < pdfHeight) {
                if (currentY > 0) pdf.addPage()

                pdf.addImage(imgData, 'PNG', 0, -currentY, pdfWidth, pdfHeight)
                currentY += pageHeight
            }

            const now = new Date()
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
            pdf.save(`digisale-report-${dateStr}.pdf`)
        } catch (err) {
            console.error('PDF export error:', err)
        } finally {
            setExporting(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm shadow-sm disabled:opacity-50"
        >
            {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileDown className="w-4 h-4" />
            )}
            {exporting ? 'מייצא...' : 'Export Report'}
        </button>
    )
}
