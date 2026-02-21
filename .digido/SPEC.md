# SPEC.md — Digisale-Dash
**דשבורד מנהלים לניתוח נתוני מכירות**
*גרסה: 1.0 | תאריך: 2026-02-21*

---

## 1. חזון הפרויקט

**Digisale-Dash** הוא כלי פנימי Web-based (מקומי לחלוטין) שמאפשר למנהלים לקבל תמונת מצב עסקית מיידית.
המערכת קולטת שלושה קבצי נתונים (הזמנות, לקוחות, מוצרים), מבצעת ביניהם Merge לפי מפתחות זיהוי, ומציגה KPIs וגרפים אינטראקטיביים — בלי שום נתון שיוצא מהמחשב.

---

## 2. משתמשים

| סוג משתמש | תיאור |
|---|---|
| מנהל חברה | משתמש קצה ללא רקע טכני. רוצה לראות "שורה תחתונה" בלבד |
| מפתח | תחזוקה, מעקב שגיאות דרך `error_log.md` |

---

## 3. דרישות אבטחה ופרטיות

> [!CAUTION]
> **Local Execution Only** — אפס חיבורים חיצוניים.
> - כל העיבוד מתבצע On-Premise, בזיכרון מקומי בלבד
> - אין API חיצוני, אין ענן, אין מסד נתונים חיצוני
> - שום דאטה עסקי לא עוזב את המחשב

---

## 4. סכמת הנתונים

### קובץ הזמנות (Orders)
| עמודה | תיאור |
|---|---|
| `Order_ID` | מזהה הזמנה |
| `Order_Date` | תאריך הזמנה |
| `Customer_ID` | מפתח חיבור → לקוחות |
| `Product_ID` | מפתח חיבור → מוצרים |
| `Quantity` | כמות |
| `Discount` | הנחה (0–1) |
| `Payment_Method` | אמצעי תשלום (PayPal וכו') |
| `Channel` | ערוץ מכירה (אתר וכו') |
| `Status` | סטטוס: `הושלם` / `בוטל` / אחר |

### קובץ לקוחות (Customers)
| עמודה | תיאור |
|---|---|
| `Customer_ID` | מפתח ראשי |
| `Customer_Segment` | סגמנט (ארגון גדול, צרכן פרטי וכו') |
| `City` | עיר |
| `Registration_Date` | תאריך הצטרפות |

### קובץ מוצרים (Products)
| עמודה | תיאור |
|---|---|
| `Product_ID` | מפתח ראשי |
| `Product_Name` | שם המוצר |
| `Category` | קטגוריה (ציוד משרדי, ריהוט וכו') |
| `Unit_Price` | מחיר מכירה |
| `Cost_Price` | מחיר עלות |

### חישוב מדדים
```
Revenue per row  = Unit_Price × Quantity × (1 - Discount)
Profit per row   = (Unit_Price - Cost_Price) × Quantity × (1 - Discount)
```
> **הערה לוגית:** KPIs מחושבים **רק** על הזמנות בסטטוס `הושלם`, למעט Cancellation Rate.

---

## 5. דרישות פונקציונליות — MVP

### 5.1 העלאת קבצים (Upload)
- [ ] מנגנון Drag & Drop לשלושה קבצים: הזמנות, לקוחות, מוצרים
- [ ] תמיכה בפורמטים: `.csv` ו-`.xlsx`
- [ ] Validation: בדיקת קיום כל העמודות הנדרשות
- [ ] הודעת שגיאה ידידותית אם קובץ חסר או פורמט שגוי
- [ ] רישום שגיאות טכניות ב-`error_log.md`

### 5.2 עיבוד נתונים (Data Processing)
- [ ] Merge: `orders` ← join → `customers` (על `Customer_ID`)
- [ ] Merge: `orders` ← join → `products` (על `Product_ID`)
- [ ] סינון הזמנות לפי סטטוס לחישובי KPI
- [ ] חישוב Revenue ו-Profit לכל שורה

### 5.3 KPIs — 4 מדדי על
| מדד | לוגיקה |
|---|---|
| **סך הכנסות** | `SUM(Revenue)` על הזמנות שהושלמו |
| **סך רווח** | `SUM(Profit)` על הזמנות שהושלמו |
| **כמות הזמנות שהושלמו** | `COUNT` סטטוס = `הושלם` |
| **אחוז ביטולים** | `COUNT(בוטל) / COUNT(total) × 100` |

### 5.4 גרפים — 2 ויזואליזציות בסיסיות
| גרף | ציר X | ציר Y | סינון |
|---|---|---|---|
| הכנסות לפי קטגוריית מוצרים | `Category` | `Revenue` | הושלם בלבד |
| הכנסות לפי סגמנט לקוחות | `Customer_Segment` | `Revenue` | הושלם בלבד |

---

## 6. דרישות טכניות (Stack)

| שכבה | טכנולוגיה |
|---|---|
| שפה | Python 3.x |
| ממשק משתמש | Streamlit (`layout="wide"`, Dark mode) |
| עיבוד נתונים | pandas |
| גרפים | Plotly Express / Graph Objects |
| קבצי קלט | CSV / Excel (openpyxl) |
| לוגים | קובץ `error_log.md` מקומי |
| הרצה | `streamlit run app.py` — מקומי בלבד |

### דרישות עיצוב UI
- `st.set_page_config(layout="wide", page_icon="📊")`
- Dark theme (Streamlit dark mode)
- `st.metric()` להצגת ה-4 KPIs בשורה אחת בגוף מסך
- Plotly גרפים אינטראקטיביים (Hover עם מספרים מדויקים)
- מראה Corporate/Clean — ללא "עומס ויזואלי"

---

## 7. מה לא נכלל ב-MVP (Out of Scope)

- אימות משתמשים / התחברות
- שמירת היסטוריה בין סשנים
- ייצוא לדוחות (PDF/PowerPoint) — שלב עתידי
- חיבור ל-Database מרוחק
- מסנני תאריכים / פילטרים מתקדמים — שלב עתידי

---

## 8. Milestones — מפת הדרך הכללית

```
Milestone 1: Foundation & Data Layer
  Phase 1.1 — הקמת הפרויקט (venv, requirements, מבנה תיקיות)
  Phase 1.2 — מודול טעינת נתונים + Merge + Validation

Milestone 2: Dashboard Core
  Phase 2.1 — מסך ראשי Streamlit + העלאת קבצים (Drag & Drop)
  Phase 2.2 — הצגת 4 KPIs (st.metric)
  Phase 2.3 — 2 גרפי Plotly

Milestone 3: Error Handling & Polish
  Phase 3.1 — טיפול בשגיאות + error_log.md
  Phase 3.2 — עיצוב Dark/Corporate + UX Refinement

Milestone 4: Testing & Handoff
  Phase 4.1 — בדיקות עם נתוני demo
  Phase 4.2 — תיעוד README
```

---

## 9. קריטריוני הצלחה (MVP Done When...)

- [ ] המנהל מעלה 3 קבצים → רואה KPIs + גרפים בפחות מ-5 שניות
- [ ] קובץ שגוי → הודעת שגיאה ברורה עולה, האפליקציה לא קורסת
- [ ] כל העיבוד מקומי לחלוטין — אפס בקשות רשת
- [ ] Dark mode + Plotly Hover פועלים כנדרש
