import pandas as pd

def get_orders_schema():
    return {
        "Order_ID": "string",
        "Customer_ID": "string", 
        "Product_ID": "string",
        "Order_Date": "string", # Format: YYYY-MM-DD
        "Quantity": "int",
        "Discount": "float", # e.g., 0.1 for 10% discount. May be missing.
        "Payment_Method": "string",
        "Channel": "string",
        "Status": "string" # Important: 'הושלם' (Completed) or 'בוטל' (Cancelled)
    }

def get_customers_schema():
    return {
        "Customer_ID": "string",
        "Customer_Segment": "string",
        "City": "string",
        "Registration_Date": "string"
    }

def get_products_schema():
    return {
        "Product_ID": "string",
        "Product_Name": "string",
        "Category": "string",
        "Unit_Price": "float",
        "Cost_Price": "float"
    }
