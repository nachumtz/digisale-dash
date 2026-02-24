export interface RawOrder {
    Order_ID: string
    Customer_ID: string
    Product_ID: string
    Order_Date: string
    Quantity: string
    Discount: string
    Payment_Method: string
    Channel: string
    Status: string
}

export interface RawCustomer {
    Customer_ID: string
    Customer_Segment: string
    City: string
    Registration_Date: string
}

export interface RawProduct {
    Product_ID: string
    Product_Name: string
    Category: string
    Unit_Price: string
    Cost_Price: string
}

export interface MergedRow {
    Order_ID: string
    Customer_ID: string
    Product_ID: string
    Order_Date: string
    Quantity: number
    Discount: number
    Payment_Method: string
    Channel: string
    Status: string
    Customer_Segment: string
    City: string
    Registration_Date: string
    Product_Name: string
    Category: string
    Unit_Price: number
    Cost_Price: number
    Revenue: number
    Profit: number
}

export interface KPIData {
    totalRevenue: number
    totalProfit: number
    completedOrders: number
    cancellationRate: number
}

export interface UploadState {
    orders: RawOrder[] | null
    customers: RawCustomer[] | null
    products: RawProduct[] | null
}
