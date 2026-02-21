# ROADMAP.md — Digisale-Dash
*עודכן: 2026-02-21*

---

## סטטוס כללי

| Milestone | סטטוס |
|---|---|
| M1: Foundation & Data Layer | ✅ הושלם |
| M2: Dashboard Core | ✅ הושלם |
| M3: Error Handling & Polish | ⬜ לא התחיל |
| M4: Testing & Handoff | ⬜ לא התחיל |

---

## Milestone 1: Foundation & Data Layer

> **מטרה:** הכנת תשתית הפרויקט ומנוע עיבוד הנתונים — לפני כל UI.

- [x] **Phase 1.1** — הקמת הפרויקט (venv, requirements, מבנה תיקיות)
- [x] **Phase 1.2** — מודול טעינת נתונים + Merge + Validation + חישוב KPI

---

## Milestone 2: Dashboard Core

> **מטרה:** בניית ממשק Streamlit עם כל הפונקציונליות הבסיסית.

- [x] **Phase 2.1** — מסך ראשי Streamlit + העלאת קבצים (File Uploader)
- [x] **Phase 2.2** — הצגת 4 KPIs באמצעות `st.metric`
- [x] **Phase 2.3** — 2 גרפי Plotly (קטגוריה + סגמנט לקוחות)

> 💡 *Phase 2.2 ו-2.3 תלויים ב-2.1 — יש לבצע בסדר.*

---

## Milestone 3: Error Handling & Polish

> **מטרה:** חסינות לשגיאות + עיצוב Dark/Corporate סופי.

- [x] **Phase 3.1** — טיפול בשגיאות + כתיבה ל-`error_log.md`
- [ ] **Phase 3.2** — Custom CSS / עיצוב Dark Corporate + UX Refinement

---

## Milestone 4: Testing & Handoff

> **מטרה:** אימות עם נתוני demo + תיעוד מלא.

- [ ] **Phase 4.1** — בדיקות מלאות עם קבצי `*_deme.csv`
- [ ] **Phase 4.2** — כתיבת `README.md` + הוראות הרצה

---

## עץ הקבצים המתוכנן

```
digisale-dash/
├── app.py                  # נקודת כניסה Streamlit
├── data_loader.py          # טעינה, Merge, Validation, חישוב KPI
├── charts.py               # פונקציות גרפי Plotly
├── error_logger.py         # כתיבה ל-error_log.md
├── error_log.md            # לוג שגיאות (נוצר בזמן ריצה)
├── requirements.txt        # תלויות Python
├── .streamlit/
│   └── config.toml         # Dark theme config
├── .digido/
│   ├── SPEC.md
│   ├── ROADMAP.md
│   ├── CHANGELOG.md
│   ├── STATE.md
│   └── phases/
│       ├── 1/ (1.1-PLAN.md, 1.2-PLAN.md)
│       ├── 2/ (2.1-PLAN.md, 2.2-PLAN.md, 2.3-PLAN.md)
│       ├── 3/ (3.1-PLAN.md, 3.2-PLAN.md)
│       └── 4/ (4.1-PLAN.md, 4.2-PLAN.md)
└── README.md
```

---

## ציר הזמן המוצע

```
M1 ──────► M2 ──────► M3 ──────► M4
[1.1→1.2]  [2.1→2.2→2.3]  [3.1→3.2]  [4.1→4.2]
```
