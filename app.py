import streamlit as st
import pandas as pd
import plotly.express as px
from data_loader import load_and_validate, merge_data, calculate_kpis

def main():
    st.set_page_config(
        page_title="Digisale-Dash",
        page_icon="🤖",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    st.title("Digisale Dashboard")
    
    # Sidebar: File Uploaders
    st.sidebar.header("העלאת נתונים 📂")
    orders_file = st.sidebar.file_uploader("העלה קובץ הזמנות (Orders)", type=["csv", "xlsx"])
    customers_file = st.sidebar.file_uploader("העלה קובץ לקוחות (Customers)", type=["csv", "xlsx"])
    products_file = st.sidebar.file_uploader("העלה קובץ מוצרים (Products)", type=["csv", "xlsx"])

    # Check if all files are uploaded
    if orders_file and customers_file and products_file:
        try:
            with st.spinner("מעבד נתונים..."):
                # Load and validate
                orders_df = load_and_validate(orders_file, ["Order_ID", "Customer_ID", "Product_ID", "Order_Date", "Quantity", "Status"])
                customers_df = load_and_validate(customers_file, ["Customer_ID", "Customer_Segment", "City"])
                products_df = load_and_validate(products_file, ["Product_ID", "Category", "Unit_Price", "Cost_Price"])
                
                # Merge data
                merged_df = merge_data(orders_df, customers_df, products_df)
                
                # Calculate KPIs to make sure the data is structured correctly even if we don't display them yet
                kpis = calculate_kpis(merged_df)
                
                # Save to session state
                st.session_state["merged_df"] = merged_df
                st.session_state["kpis"] = kpis
                
            st.success("הנתונים נטענו בהצלחה ✅")
            
            # Temporary view to verify the loaded data
            with st.expander("הצג תצוגה מקדימה של הנתונים"):
                st.dataframe(merged_df.head(10))
                
        except Exception as e:
            st.error(f"שגיאה בעיבוד הנתונים: {str(e)}")
            # Remove from session state if error
            if "merged_df" in st.session_state:
                del st.session_state["merged_df"]
                
    else:
        st.info("⬆️ אנא העלה את שלושת הקבצים כדי להציג את הדשבורד")
        # Clear session state if files are removed
        if "merged_df" in st.session_state:
            del st.session_state["merged_df"]

if __name__ == "__main__":
    main()
