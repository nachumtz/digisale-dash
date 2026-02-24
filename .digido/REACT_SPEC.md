# 🎯 Zero-to-One Vibe Coding Prompt: Digisale-Dash (React Edition)

**Context for the AI Agent**: You are building a completely new React application from scratch. You do not need any prior knowledge of an existing codebase. I am providing you with the full technical specification, the exact data structure (via the attached `schema.py`), and the desired UI/UX vibe.

**Goal**: Build a modern, SaaS-style B2B/B2C sales dashboard. Managers will upload 3 raw CSV files (Orders, Customers, Products), and your app must merge this data *entirely client-side* in the browser and instantly visualize key performance indicators (KPIs) and interactive charts.

---

## 1. 🛠️ Tech Stack & Architecture (Mandatory)

You must use the following stack to build this application:

-   **Framework**: Next.js (App Router) OR Vite + React (Choose whichever you can build fastest and most reliably).
-   **Styling**: Tailwind CSS.
-   **UI Components**: `shadcn/ui` (Use this for all buttons, cards, inputs, selects, and layout elements).
-   **Icons**: `lucide-react`.
-   **Charts**: `Recharts` (Ensure charts are responsive and beautiful).
-   **Data Processing**: `PapaParse` (for parsing the uploaded CSVs).
-   **Exporting**: `html2canvas` + `jspdf` (or `react-to-print`) for the "Export to PDF" feature.
-   **Architecture Constraints**: 100% Client-Side. **DO NOT** build a Node.js backend. **DO NOT** use a database. The data uploaded must be processed entirely in the browser memory and never leave the user's machine.

---

## 2. 📊 Data Structure & Merge Logic (See `schema.py`)

I have attached a file called `schema.py` which defines the exact columns you expect in the three CSV files.

**The Client-Side Merge Operation**:
When the user uploads all three files, parse them using `PapaParse` and perform the following Javascript equivalent of a SQL JOIN/Pandas Merge:
1.  Take the `Orders` array.
2.  Left Join an order with its matching `Customer` (matching `Customer_ID`).
3.  Left Join an order with its matching `Product` (matching `Product_ID`).

**Row-level Calculations (Calculate these for every merged order row)**:
*   `Revenue = Unit_Price * Quantity * (1 - Discount)` *(Note: Assume `Discount` is 0 if the column is null/empty).*
*   `Profit = (Unit_Price - Cost_Price) * Quantity * (1 - Discount)`.

**Crucial Logic Rule**:
All KPI calculations and Charts (except for the *Cancellation Rate* KPI) must ONLY include orders where the `Status` column equals exactly the Hebrew word: `"הושלם"` (Completed).

---

## 3. 🖥️ Core UI Features & Layout

### A. The "Dropzone" (Initial View)
*   Center the screen with a highly polished drag-and-drop zone requiring the 3 files.
*   Show a clear indicator (checkbox or green highlight) as each file is successfully parsed.
*   Once all 3 are ready, show a bold "Generate Dashboard" button.
*   Show a smooth spinner/skeleton loader while the merge logic runs.

### B. Global Filters (Sticky Top Bar or Sidebar)
*   Create a prominent dropdown selector for `City`.
*   Extract the unique cities from the merged data array dynamically.
*   Include a default "All Cities" option.
*   Whenever the city changes, the KPIs and Charts below must instantly cross-filter and animate to the new values.

### C. KPI Cards (Top Row of Dashboard)
Display 4 elegant metric cards horizontally:
1.  **Total Revenue**: Sum of `Revenue` (Format: currency `₪`).
2.  **Total Profit**: Sum of `Profit` (Format: currency `₪`).
3.  **Completed Orders**: Count of orders (Format: integer).
4.  **Cancellation Rate**: `(Count of Status === 'בוטל' / Total original orders) * 100` (Format: percentage `%`).

### D. Interactive Charts (Below KPIs)
Use `Recharts` to build two beautiful visualizations side-by-side:
1.  **Chart 1**: Bar Chart showing `Revenue` aggregated by `Category`.
2.  **Chart 2**: Bar Chart (or Donut) showing `Revenue` aggregated by `Customer_Segment`.
*Must have clean, readable tooltips.*

### E. Export to PDF
*   Place a primary button "Export Report" at the top right of the dashboard.
*   Clicking it should cleanly capture the KPI cards and the charts and downlaod them as an A4 PDF.

---

## 4. ✨ The "Vibe" & Design Language

-   **Theme**: Light mode. Bright, clean, airy.
-   **Color Palette**: Use Slate/Zinc for backgrounds. Cards should be pure crisp white `#FFFFFF`.
-   **Shadows**: Use soft CSS shadows (`shadow-sm`, `shadow-md` in Tailwind) to lift cards off the background.
-   **Accents**: Use a vibrant, premium primary color (like Emerald-500 or Indigo-600) for active states, the export button, and chart bars.
-   **Micro-interactions**: Everything should feel alive. Add hover states to cards (slight lift) and buttons. Ensure data transitions have smooth easing.
-   **Error Handling**: If an uploaded CSV is missing columns, use a gorgeous `shadcn/ui` Toast notification to tell the user what's wrong, without breaking the app.

---

## 5. 🚀 Action Items for You (The AI)

1. Scaffold the app immediately with your chosen framework (Next.js/Vite) and Tailwind.
2. Setup `shadcn/ui` components needed.
3. Build the File Uploader & PapaParse logic.
4. Build the Merge & Calculation engine (referencing `schema.py` logic).
5. Build the Dashboard UI (City Filter, KPIs, Recharts).
6. Add the PDF export feature.
7. Deliver a fully working, beautiful MVP in one go. Give me the terminal commands to start it and everything I need.
