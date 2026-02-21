import streamlit as st
import pandas as pd
import plotly.express as px

def main():
    st.set_page_config(
        page_title="Digisale-Dash",
        page_icon="🤖",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    st.title("Digisale Dashboard")
    st.write("Welcome to the Digisale Dashboard.")

if __name__ == "__main__":
    main()
