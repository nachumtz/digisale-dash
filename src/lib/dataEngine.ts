import Papa from 'papaparse'
import type { RawOrder, RawCustomer, RawProduct, MergedRow, KPIData } from './types'

// ─── CSV Parsing ─────────────────────────────────────────────

export function parseCSV<T>(file: File): Promise<T[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.warn('CSV parse warnings:', results.errors)
                }
                resolve(results.data as T[])
            },
            error: (error: Error) => reject(error),
        })
    })
}

export function parseCSVText<T>(text: string): T[] {
    const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
    })
    return result.data as T[]
}

// ─── Column Validation ──────────────────────────────────────

export function validateCSVColumns(
    data: Record<string, unknown>[],
    requiredColumns: string[],
    fileName: string
): string[] {
    if (data.length === 0) return [`${fileName}: הקובץ ריק`]
    const columns = Object.keys(data[0])
    const missing = requiredColumns.filter(col => !columns.includes(col))
    return missing.map(col => `${fileName}: חסרה עמודה "${col}"`)
}

export const REQUIRED_COLUMNS = {
    orders: ['Order_ID', 'Customer_ID', 'Product_ID', 'Order_Date', 'Quantity', 'Discount', 'Payment_Method', 'Channel', 'Status'],
    customers: ['Customer_ID', 'Customer_Segment', 'City', 'Registration_Date'],
    products: ['Product_ID', 'Product_Name', 'Category', 'Unit_Price', 'Cost_Price'],
}

// ─── Left-Join Merge ────────────────────────────────────────

export function mergeData(
    orders: RawOrder[],
    customers: RawCustomer[],
    products: RawProduct[]
): MergedRow[] {
    const customerMap = new Map(customers.map(c => [c.Customer_ID.trim(), c]))
    const productMap = new Map(products.map(p => [p.Product_ID.trim(), p]))

    return orders.map(order => {
        const customer = customerMap.get(order.Customer_ID.trim())
        const product = productMap.get(order.Product_ID.trim())

        const quantity = parseInt(order.Quantity) || 0
        const discount =
            order.Discount !== undefined &&
                order.Discount !== null &&
                order.Discount.toString().trim() !== ''
                ? parseFloat(order.Discount)
                : 0
        const unitPrice = product ? parseFloat(product.Unit_Price) : 0
        const costPrice = product ? parseFloat(product.Cost_Price) : 0

        // Row-level calculations
        const revenue = unitPrice * quantity * (1 - discount)
        const profit = (unitPrice - costPrice) * quantity * (1 - discount)

        return {
            Order_ID: order.Order_ID,
            Customer_ID: order.Customer_ID,
            Product_ID: order.Product_ID,
            Order_Date: order.Order_Date,
            Quantity: quantity,
            Discount: discount,
            Payment_Method: order.Payment_Method,
            Channel: order.Channel,
            Status: order.Status,
            Customer_Segment: customer?.Customer_Segment || '',
            City: customer?.City || '',
            Registration_Date: customer?.Registration_Date || '',
            Product_Name: product?.Product_Name || '',
            Category: product?.Category || '',
            Unit_Price: unitPrice,
            Cost_Price: costPrice,
            Revenue: revenue,
            Profit: profit,
        }
    })
}

// ─── KPI Calculations ───────────────────────────────────────

export function computeKPIs(data: MergedRow[]): KPIData {
    // CRITICAL: Only completed orders for Revenue/Profit/Count
    const completed = data.filter(row => row.Status.trim() === 'הושלם')
    const totalOrders = data.length
    const cancelledOrders = data.filter(row => row.Status.trim() === 'בוטל').length

    return {
        totalRevenue: completed.reduce((sum, row) => sum + row.Revenue, 0),
        totalProfit: completed.reduce((sum, row) => sum + row.Profit, 0),
        completedOrders: completed.length,
        // Cancellation rate is against ALL orders
        cancellationRate: totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0,
    }
}

// ─── Filters & Aggregations ─────────────────────────────────

export function getUniqueCities(data: MergedRow[]): string[] {
    const cities = new Set(data.map(row => row.City).filter(Boolean))
    return Array.from(cities).sort()
}

export function filterByCity(data: MergedRow[], city: string): MergedRow[] {
    if (city === 'כל הערים') return data
    return data.filter(row => row.City === city)
}

export function getRevenueByCategory(data: MergedRow[]): { name: string; value: number }[] {
    const completed = data.filter(row => row.Status.trim() === 'הושלם')
    const categoryMap = new Map<string, number>()

    completed.forEach(row => {
        const current = categoryMap.get(row.Category) || 0
        categoryMap.set(row.Category, current + row.Revenue)
    })

    return Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value)
}

export function getRevenueBySegment(data: MergedRow[]): { name: string; value: number }[] {
    const completed = data.filter(row => row.Status.trim() === 'הושלם')
    const segmentMap = new Map<string, number>()

    completed.forEach(row => {
        const current = segmentMap.get(row.Customer_Segment) || 0
        segmentMap.set(row.Customer_Segment, current + row.Revenue)
    })

    return Array.from(segmentMap.entries())
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .sort((a, b) => b.value - a.value)
}
