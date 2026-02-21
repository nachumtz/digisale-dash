import pandas as pd
from data_loader import load_and_validate, merge_data, calculate_kpis

def test_pipeline():
    print("Loading data...")
    orders = load_and_validate("orders_deme.csv", ["Order_ID", "Customer_ID", "Product_ID", "Order_Date", "Quantity", "Status"])
    customers = load_and_validate("customers_deme.csv", ["Customer_ID", "Customer_Segment", "City"])
    products = load_and_validate("products_deme.csv", ["Product_ID", "Category", "Unit_Price", "Cost_Price"])
    
    # Check if Discount exists, if not, add it as 0 just in case to test it handles it or not
    print("orders_deme.csv columns:", orders.columns.tolist())
    
    print("Merging data...")
    merged = merge_data(orders, customers, products)
    print("Merged columns:", merged.columns.tolist())
    print("Revenue sample:", merged['Revenue'].head().tolist())
    print("Profit sample:", merged['Profit'].head().tolist())
    
    print("Calculating KPIs...")
    kpis = calculate_kpis(merged)
    print("KPIs:", kpis)
    print("SUCCESS!")

if __name__ == "__main__":
    test_pipeline()
