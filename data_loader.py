import pandas as pd
import io

def load_and_validate(file, expected_columns):
    """
    Loads a CSV or Excel file and validates that all expected columns are present.
    """
    try:
        # Check if file is string path or file-like object
        if isinstance(file, str):
            if file.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file)
            else:
                raise ValueError("Unsupported file format. Please provide CSV or Excel file.")
        else:
            # Assuming file-like object (e.g. from Streamlit uploader)
            filename = getattr(file, 'name', '')
            if filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file)
            else:
                raise ValueError("Unsupported file format in upload.")

        missing_cols = [col for col in expected_columns if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing expected columns: {missing_cols}")
            
        return df
    except Exception as e:
        raise Exception(f"Error loading file: {str(e)}")

def merge_data(orders_df, customers_df, products_df):
    """
    Merges orders, customers, and products DataFrames and calculates Revenue and Profit.
    """
    # Merge orders with customers
    merged_df = pd.merge(orders_df, customers_df, on='Customer_ID', how='left')
    
    # Merge result with products
    merged_df = pd.merge(merged_df, products_df, on='Product_ID', how='left')
    
    # Calculate Revenue and Profit for each row
    # Revenue = Unit_Price × Quantity × (1 - Discount)
    # Profit = (Unit_Price - Cost_Price) × Quantity × (1 - Discount)
    merged_df['Revenue'] = merged_df['Unit_Price'] * merged_df['Quantity'] * (1 - merged_df.get('Discount', 0))
    merged_df['Profit'] = (merged_df['Unit_Price'] - merged_df['Cost_Price']) * merged_df['Quantity'] * (1 - merged_df.get('Discount', 0))
    
    return merged_df

def calculate_kpis(merged_df):
    """
    Calculates key performance indicators based on merged data.
    """
    # Total Cancellation Rate is based on all orders
    total_orders_count = len(merged_df)
    cancelled_orders_count = len(merged_df[merged_df['Status'] == 'בוטל'])
    cancellation_rate = (cancelled_orders_count / total_orders_count * 100) if total_orders_count > 0 else 0
    
    # Other KPIs are based only on completed orders
    completed_df = merged_df[merged_df['Status'] == 'הושלם']
    
    total_revenue = completed_df['Revenue'].sum()
    total_profit = completed_df['Profit'].sum()
    completed_orders = len(completed_df)
    
    return {
        'total_revenue': total_revenue,
        'total_profit': total_profit,
        'completed_orders': completed_orders,
        'cancellation_rate': cancellation_rate
    }
