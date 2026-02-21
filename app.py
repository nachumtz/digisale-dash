import streamlit as st
import pandas as pd
import plotly.express as px
from data_loader import load_and_validate, merge_data, calculate_kpis
from charts import chart_revenue_by_category, chart_revenue_by_segment

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
                # Note: some CSVs have BOM, so we try to catch the first column if it's garbled, but pandas read_csv usually handles it.
                # However, looking at the error: ['Order_ID', 'Product_ID', 'Order_Date', 'Quantity', 'Status'] are ALL missing?
                # This suggests the DataFrame wasn't loaded correctly, maybe because of delimiter or upload type.
                # Let's read them into local DFs first
                orders_df = pd.read_csv(orders_file) if orders_file.name.endswith('.csv') else pd.read_excel(orders_file)
                customers_df = pd.read_csv(customers_file) if customers_file.name.endswith('.csv') else pd.read_excel(customers_file)
                products_df = pd.read_csv(products_file) if products_file.name.endswith('.csv') else pd.read_excel(products_file)

                # Now validate
                orders_cols = ["Order_ID", "Customer_ID", "Product_ID", "Order_Date", "Quantity", "Status"]
                missing_orders = [c for c in orders_cols if c not in orders_df.columns]
                if missing_orders:
                    raise ValueError(f"Missing expected columns in Orders: {missing_orders}. Found: {orders_df.columns.tolist()}")
                    
                customers_cols = ["Customer_ID", "Customer_Segment", "City"]
                missing_customers = [c for c in customers_cols if c not in customers_df.columns]
                if missing_customers:
                    raise ValueError(f"Missing expected columns in Customers: {missing_customers}. Found: {customers_df.columns.tolist()}")
                    
                products_cols = ["Product_ID", "Category", "Unit_Price", "Cost_Price"]
                missing_products = [c for c in products_cols if c not in products_df.columns]
                if missing_products:
                    raise ValueError(f"Missing expected columns in Products: {missing_products}. Found: {products_df.columns.tolist()}")
                
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
                
            # Display KPIs
            st.subheader("מדדים מרכזיים")
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric("סה״כ פדיון", f"₪{kpis['total_revenue']:,.0f}")
            with col2:
                st.metric("סה״כ רווח", f"₪{kpis['total_profit']:,.0f}")
            with col3:
                st.metric("הזמנות שהושלמו", f"{kpis['completed_orders']:,}")
            with col4:
                st.metric("אחוז ביטולים", f"{kpis['cancellation_rate']:.1f}%")
                
            st.divider()
            
            # Display Charts
            st.subheader("ניתוח מגמות")
            chart_col1, chart_col2 = st.columns(2)
            
            with chart_col1:
                fig_cat = chart_revenue_by_category(merged_df)
                st.plotly_chart(fig_cat, use_container_width=True)
                
            with chart_col2:
                fig_seg = chart_revenue_by_segment(merged_df)
                st.plotly_chart(fig_seg, use_container_width=True)
                
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
