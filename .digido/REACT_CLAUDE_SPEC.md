# 🎯 Digisale-Dash — React Migration Spec (Vibe Coding Prompt)

**Context**: You are building a completely new React application from scratch. Below is the **full specification** — data structure, business logic, UI/UX design, and test data. No prior codebase knowledge is needed. Build everything from this document alone.

**Goal**: Build a modern, SaaS-style B2B/B2C sales dashboard. Managers upload 3 raw CSV files (Orders, Customers, Products), and the app merges this data **entirely client-side** in the browser and instantly visualizes KPIs and interactive charts.

---

## 1. 🛠️ Tech Stack & Architecture (Mandatory)

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js (App Router) **or** Vite + React — choose whichever you build fastest |
| **Styling** | Tailwind CSS |
| **UI Components** | `shadcn/ui` — for all buttons, cards, inputs, selects, layout |
| **Icons** | `lucide-react` |
| **Charts** | `Recharts` — responsive and beautiful |
| **CSV Parsing** | `PapaParse` |
| **PDF Export** | `html2canvas` + `jspdf` (or `react-to-print`) |

> [!CAUTION]
> **100% Client-Side.** DO NOT build a Node.js backend. DO NOT use a database. All data is processed in browser memory and **never leaves the user's machine**.

---

## 2. 📊 Data Schema (Final & Definitive)

### Orders CSV
| Column | Type | Notes |
|--------|------|-------|
| `Order_ID` | string | Unique order identifier |
| `Customer_ID` | string | FK → Customers |
| `Product_ID` | string | FK → Products |
| `Order_Date` | string | Format: `M/DD/YYYY` or `MM/DD/YYYY` |
| `Quantity` | int | |
| `Discount` | float | e.g. `0.1` = 10%. **May be missing/empty — treat as 0** |
| `Payment_Method` | string | e.g. PayPal, Credit Card |
| `Channel` | string | e.g. אתר, חנות |
| `Status` | string | **Critical**: `הושלם` (Completed) or `בוטל` (Cancelled) |

### Customers CSV
| Column | Type | Notes |
|--------|------|-------|
| `Customer_ID` | string | PK |
| `Customer_Segment` | string | e.g. ארגון גדול, צרכן פרטי |
| `City` | string | Hebrew city names (e.g. תל אביב, פתח תקווה) |
| `Registration_Date` | string | |

### Products CSV
| Column | Type | Notes |
|--------|------|-------|
| `Product_ID` | string | PK |
| `Product_Name` | string | Hebrew product names |
| `Category` | string | e.g. ציוד משרדי, ריהוט |
| `Unit_Price` | float | |
| `Cost_Price` | float | |

---

## 3. 🔗 Client-Side Merge & Calculation Logic

### Step 1: Parse
When all 3 files are uploaded, parse each with `PapaParse`.

### Step 2: Left-Join Merge
```
MergedData = Orders
  LEFT JOIN Customers  ON  Customer_ID
  LEFT JOIN Products   ON  Product_ID
```

### Step 3: Row-Level Calculations (for every merged row)
```
Revenue = Unit_Price × Quantity × (1 - Discount)
Profit  = (Unit_Price - Cost_Price) × Quantity × (1 - Discount)
```
> If `Discount` is null/empty/undefined → treat as `0`.

### Critical Business Rule
> [!IMPORTANT]
> **All KPI calculations and Charts** (except Cancellation Rate) must **ONLY** include orders where `Status === "הושלם"` (the Hebrew word for "Completed").
>
> **Cancellation Rate** is calculated against **all** orders (both הושלם and בוטל).

---

## 4. 🖥️ UI Layout & Features

### A. Initial View — File Upload "Dropzone"
- Center screen with a polished drag-and-drop area requiring 3 files
- Show a clear indicator (checkbox / green highlight) as each file is successfully parsed
- Display the expected file name next to each slot: `Orders`, `Customers`, `Products`
- Once all 3 are parsed → show a bold **"Generate Dashboard"** button
- Show a smooth spinner/skeleton loader while merge runs

### B. Global Filter — City Selector
- Prominent dropdown in a sticky top bar or sidebar
- Dynamically populated from the unique `City` values in merged data
- Default option: **"כל הערים"** (All Cities)
- Changing the city → instantly cross-filters KPIs and Charts with smooth animation

### C. KPI Cards — Top Row (4 Horizontal Cards)
| # | KPI | Calculation | Format |
|---|-----|-------------|--------|
| 1 | סה״כ פדיון (Total Revenue) | Sum of `Revenue` where Status=הושלם | `₪XX,XXX` |
| 2 | סה״כ רווח (Total Profit) | Sum of `Profit` where Status=הושלם | `₪XX,XXX` |
| 3 | הזמנות שהושלמו (Completed Orders) | Count of rows where Status=הושלם | Integer with comma separator |
| 4 | אחוז ביטולים (Cancellation Rate) | `(Count Status=בוטל / Total ALL orders) × 100` | `XX.X%` |

### D. Interactive Charts — Below KPIs (Side by Side)
1. **Bar Chart**: Revenue aggregated by `Category` (completed orders only)
2. **Bar Chart** (or Donut): Revenue aggregated by `Customer_Segment` (completed orders only)
- Clean, readable tooltips with Hebrew labels and ₪ currency formatting
- Responsive — stack on mobile

### E. Data Preview
- Collapsible "הצג תצוגה מקדימה" section showing first 10 rows of merged data in a table

### F. Export to PDF
- Primary button **"Export Report"** at top right of dashboard
- Captures KPI cards + charts → downloads as A4 PDF

---

## 5. ✨ Design Language & "Vibe"

| Aspect | Specification |
|--------|--------------|
| **Theme** | Light mode. Bright, clean, airy |
| **Background** | Slate/Zinc tones (`slate-50`, `zinc-100`) |
| **Cards** | Pure white `#FFFFFF` with soft shadows (`shadow-sm`, `shadow-md`) |
| **Primary Accent** | Emerald-500 or Indigo-600 — for buttons, active states, chart bars |
| **Typography** | Modern font (Inter or similar via Google Fonts) |
| **RTL Direction** | The UI language is Hebrew — ensure proper `dir="rtl"` on the `<html>` tag |
| **Hover Effects** | Cards lift slightly on hover; buttons have scale/glow transitions |
| **Animations** | Smooth easing on data transitions when filters change |
| **Error Handling** | Missing columns → beautiful `shadcn/ui` Toast notification (non-blocking) |
| **Responsive** | Desktop-first, but charts stack vertically on mobile |

---

## 6. 📁 Test Data (Use for Immediate Verification)

Create these 3 CSV files in the project so the app can be tested immediately without manual upload.

### `orders_demo.csv`
```csv
Order_ID,Order_Date,Customer_ID,Product_ID,Quantity,Discount,Payment_Method,Channel,Status
1001,6/12/2025,C001,P001,3,0.05,PayPal,אתר,הושלם
1002,12/19/2024,C002,P002,6,0,PayPal,אתר,בוטל
1003,3/15/2025,C001,P002,2,0.1,Credit Card,חנות,הושלם
1004,7/22/2025,C002,P001,1,0,Credit Card,אתר,הושלם
1005,1/5/2025,C001,P001,4,0.15,PayPal,חנות,בוטל
```

### `customers_demo.csv`
```csv
Customer_ID,Customer_Segment,City,Registration_Date
C001,ארגון גדול,פתח תקווה,6/10/2024
C002,צרכן פרטי,תל אביב,9/14/2024
```

### `products_demo.csv`
```csv
Product_ID,Product_Name,Category,Unit_Price,Cost_Price
P001,מדפסת לייזר OfficeDepot Ultra,ציוד משרדי,3029,2120
P002,מנורת שולחן Logitech X1,ריהוט,3213,2249
```

### Expected KPI Results (All Cities, for verification)
Using the test data above, when filtering "כל הערים" the expected results are:

| KPI | Expected Value | Calculation |
|-----|----------------|-------------|
| Total Revenue | ₪16,056 | Order 1001: 3029×3×0.95=8,633 + Order 1003: 3213×2×0.9=5,783 + Order 1004: 3029×1×1.0=3,029 — but **excludes** 1002(בוטל) and 1005(בוטל) |
| Total Profit | ₪4,649 | Same 3 orders: (3029-2120)×3×0.95 + (3213-2249)×2×0.9 + (3029-2120)×1×1.0 |
| Completed Orders | 3 | |
| Cancellation Rate | 40.0% | 2 cancelled / 5 total × 100 |

---

## 7. 🚀 Action Items for You (The AI Agent)

1. **Scaffold** the app with your chosen framework (Next.js or Vite) + Tailwind
2. **Install & configure** `shadcn/ui` components
3. **Create the test CSV files** from section 6 inside the project
4. **Build the File Uploader** with PapaParse integration and validation
5. **Build the Merge & Calculation engine** following section 3 logic exactly
6. **Build the Dashboard UI** — City Filter → KPI Cards → Recharts → Data Preview
7. **Add PDF Export** feature
8. **Verify** using the test data — KPIs must match the expected values in section 6
9. **Deliver** a fully working, beautiful MVP. Provide the terminal commands to install and start

> [!TIP]
> Start by generating the test CSV files and building the data pipeline first. Once the numbers are correct, layer on the beautiful UI.
