import plotly.express as px
import pandas as pd

def chart_revenue_by_category(df: pd.DataFrame):
    """
    Creates a bar chart of Revenue by Category for completed orders.
    """
    completed_df = df[df['Status'] == 'הושלם']
    grouped = completed_df.groupby('Category')['Revenue'].sum().reset_index()
    
    fig = px.bar(
        grouped,
        x='Category',
        y='Revenue',
        title="פדיון לפי קטגוריה",
        template="plotly_dark",
        text_auto=".2s" # format to K/M
    )
    
    # Update hover template to show exact currency amount
    fig.update_traces(
        hovertemplate="<b>קטגוריה:</b> %{x}<br><b>פדיון:</b> ₪%{y:,.0f}<extra></extra>"
    )
    
    fig.update_layout(
        xaxis_title="קטגוריה",
        yaxis_title="פדיון (₪)",
        showlegend=False
    )
    
    return fig

def chart_revenue_by_segment(df: pd.DataFrame):
    """
    Creates a bar chart of Revenue by Customer Segment for completed orders.
    """
    completed_df = df[df['Status'] == 'הושלם']
    grouped = completed_df.groupby('Customer_Segment')['Revenue'].sum().reset_index()
    
    fig = px.bar(
        grouped,
        x='Customer_Segment',
        y='Revenue',
        title="פדיון לפי סגמנט לקוחות",
        template="plotly_dark",
        text_auto=".2s", 
        color_discrete_sequence=['#ff7f0e'] # Just distinguishing colors slightly
    )
    
    # Update hover template to show exact currency amount
    fig.update_traces(
        hovertemplate="<b>סגמנט:</b> %{x}<br><b>פדיון:</b> ₪%{y:,.0f}<extra></extra>"
    )
    
    fig.update_layout(
        xaxis_title="סגמנט מתשמשים",
        yaxis_title="פדיון (₪)",
        showlegend=False
    )
    
    return fig
