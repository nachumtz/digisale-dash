# CHANGELOG.md — Digisale-Dash

---

## [2026-02-21] — Project Initialized

- ✅ SPEC.md נוצר ואושר על ידי הארכיטקט
- ✅ ROADMAP.md נוצר — 4 Milestones, 9 Phases
- ✅ 9 קבצי PLAN אטומיים נוצרו ב-`.digido/phases/`
- ✅ STATE.md אותחל

---

## [2026-02-22] — Project Completed (Milestones 1-4)

### Milestone 1: Foundation & Data Layer
- ✅ **Phase 1.1:** Setup project structure, `venv`, and `requirements.txt`.
- ✅ **Phase 1.2:** Created `data_loader.py` for reading logic, Data Merge, and KPI calculation.

### Milestone 2: Dashboard Core
- ✅ **Phase 2.1:** Built the Streamlit Interface + File Uploaders in Sidebar.
- ✅ **Phase 2.2:** Displayed 4 dynamic KPIs (`st.metric`).
- ✅ **Phase 2.3:** Added interactive Plotly Charts (Revenue by Category and Segment) inside `charts.py`.

### Milestone 3: Error Handling & Polish
- ✅ **Phase 3.1:** Wrapped module and UI calls in `try/except` functionality & implemented an external `error_logger.py` saving to `error_log.md`.
- ✅ **Phase 3.2:** Applied 'Dark Corporate' aesthetics through injected custom CSS. Re-structured application UI (Titles/Subtitles) and added City real-time filtering via the app Sidebar.

### Milestone 4: Testing & Handoff
- ✅ **Phase 4.1:** Verified end-to-end functionality using demo DataFrames and verified Error handling routines.
- ✅ **Phase 4.2:** Complete project documentation and generated `README.md`.
