# Terminal Prime: Zorvyn Executive Financial Dashboard

Terminal Prime is a high-density, institutional-grade financial dashboard built with **Next.js 15**, **Tailwind CSS v4**, and **Recharts**. It is explicitly designed following **Bloomberg Terminal aesthetics**, prioritizing data density, rapid cognitive translation, and high-visibility contrast metrics over soft, overly spacious modern web design.

**Live Prototype:** [https://terminal-prime-zorvyn-dashboard-88088500020.us-central1.run.app/](https://terminal-prime-zorvyn-dashboard-88088500020.us-central1.run.app/)

---

## 🧭 Dashboard Features & Navigation Guide

### 1. Dynamic Domain Access (Region Filters)
Located in the sidebar, the **Domain Access** selector allows you to isolate financial data by region (e.g., `US-EAST`, `APAC`). 
*   **Dynamic Synchronization**: Clicking a region instantly triggers a recalculation across the **entire application state**. 
*   The Macro Tier (KPIs), Contextual Analytics (Charts), and Granular Tier (Audit Trail) will dynamically filter and render data exclusively relevant to that specific geographic boundary. Month-over-Month logic automatically recalculates on the fly.

### 2. Access Protocol (Role-Based Access Control)
The sidebar contains an **Access Protocol** toggle allowing you to test permissions within the system:
*   **ADMIN**: Grants full Read/Write authority. Enables "New Entry" capabilities, as well as Edit and Delete buttons on individual transaction rows in the Audit Trail.
*   **VIEWER**: Simulates a read-only analyst. Modification protocols are strictly disabled, instantly stripping the UI of any buttons that could mutate the ledger data.

### 3. High-Density Audit Trail & Contextual Search
The third tier of the dashboard houses the `TransactionTable`, containing thousands of mock ledger records.
*   **Ledger Search**: The dark terminal search bar executes client-side fuzzy searching across the currently active regional data, allowing for instant discovery of counterparties, IDs, or transaction statuses.
*   **Default Sorting**: The data is automatically sorted chronologically by timestamp (newest first).
*   **Multi-Directional Sorting**: Clicking any column header (Date, Amount, Category, etc.) triggers an instant toggle between ascending and descending order, powered by high-performance TanStack Table sorting logic for rapid audit investigations.

### 4. Algorithmic Quick Insights & Data Visualizations
We abandoned standard tooltips in favor of actionable intelligence:
*   **Quick Insights Bar**: Located directly below the executive summary, this dynamic horizontal bar algorithmically scans the currently visible data to calculate the top operational expense, the immediate net profit trajectory (Up/Down over 30 days), and the active data scope in real-time.
*   **KPI Metric Focus**: Clicking any of the top 4 KPI cards triggers a cinematic "Metric Focus Modal." The dashboard blurs into the background (`backdrop-blur-2xl`) while the exact dollar amount scales up for distraction-free analysis.
*   **Waterfall & Bar Charts**: Hovering over the chart columns (like 'OPEX Budget Variance') drops a high-contrast terminal overlay that explicitly renders the hidden variance dollar amounts and specific category intersections.

### 5. Multi-Theme Terminal Interface
The dashboard includes an integrated dark and light mode toggle. 
> [!IMPORTANT]
> **For the optimal UI/UX viewing experience, use Dark Mode.** The architecture was designed native-dark first, utilizing a canvas of `#000000` with striking `Bloomberg Sunshade Amber` (`#FFA028`) accents to faithfully recreate the dense, high-contrast aesthetic of an actual institutional Bloomberg Terminal.

*   **Dark Mode**: The definitive, recommended state featuring CVD-accessible Bullish/Bearish semantic coloring against true black.
*   **Light Mode**: Intelligently flips the canvas while persisting the deep greyish-dark borders around critical sections (like the Audit Trail and Sidebar toggles) to ensure the layout always feels like an enclosed command center piece of software.

### 6. Responsive Degradation & UI Adaptation
The high-density UI was engineered to gracefully degrade across devices:
*   **Desktop/Laptop**: Full multi-column grids and persistent left-hand sidebar navigation.
*   **Tablet/iPad**: The persistent sidebar vanishes into a **Slide-out Drawer (Hamburger Menu)** located in the top navigation bar. KPI Modals automatically scale down from 55vw to 75vw.
*   **Mobile**: Complete vertical stacking. Bar charts resize horizontally, and the Audit Trail table introduces an internal horizontal scroll to preserve data integrity without breaking the parent DOM boundaries.

*(Note: The Navigation Stubs in the top-left of the sidebar like 'Market Terminals' and 'Risk Portfolio' are placeholder features representing the future scale of the application.)*

---

## 🏗️ Architectural Decisions: The "Why"

### Why Next.js?
I selected **Next.js 15 (App Router)** as the foundation for this dashboard due to its advanced routing capabilities and optimized performance. The decision was driven by:
- **Server/Client Component Hybridity**: Allowing us to keep heavy aggregation logic on the server-side while maintaining highly interactive client-side charts.
- **Global Theme Provider**: Leveraging `next-themes` and a centralized `globals.css` allowed for a robust, flicker-free dark/light mode implementation that persists institutional contrast requirements.
- **Standalone Output**: The ease of generating a standalone build for Docker containerization made it the ideal choice for our Cloud Run deployment strategy.

### Why Docker & Google Cloud Run instead of Vercel/Serverless?

While Vercel provides excellent out-of-the-box hosting for Next.js, we explicitly chose to architect this dashboard for **containerization (Docker)** and deployment to **Google Cloud Run** for several institutional logic reasons:

1.  **No Vendor Lock-in (Portability)**:
    By building a standalone Next.js Docker image (`output: 'standalone'`), the Zorvyn codebase is completely decoupled from Vercel's proprietary edge network. This container can run identically on Google Cloud, AWS ECS, Azure, or an on-premise institutional server in a strictly regulated environment.

2.  **Regulated Security Environments**:
    Financial tech often requires deployment within Virtual Private Clouds (VPCs) disconnected from the public internet. Vercel acts as a public multi-tenant edge. A Docker container sitting in GCP Artifact Registry can be deployed into an isolated internal subnetwork matching explicit SOC2/compliance requirements.

3.  **Persistent File Storage Foundations**:
    Serverless platforms are strictly ephemeral—writing to absolute file paths (like our existing `src/lib/mockData.js`) in production won't persist across requests. While Cloud Run is also stateless, a containerized environment is far easier to migrate directly into an attached persistent volume or scale into a clustered microservice relying on Cloud SQL than refactoring a heavy edge-function application.

---

## 🔍 Research & Methodology

This dashboard is a product of cross-disciplinary and AI-assisted research:
- **AI-Enhanced Data Modeling**: **Gemini** was utilized to programmatically generate the 1,500+ record financial mock dataset, ensuring high data density and structural integrity mimicking a corporate database.
- **Financial Domain Research**: Initial research on institutional financial dashboard hierarchies and operational metrics was conducted using **Pinterest & Gemini** to define the "Macro-to-Granular" disclosure model.
- **Visual & Aesthetic Identity**: **Pinterest** served as the primary source for benchmarking for Bloomberg Terminal design language, focus-states, and F-pattern spatial hierarchies.
- **Deep Research & Palette Optimization**: **Gemini Deep Research** was used to:
    - Extract exact institutional color palette codes (e.g., Bloomberg Sunshade Amber `#FFA028`).
    - Curate a list of high-performance UI libraries and fetch official documentation for rapid implementation.
    - Validate complex variance formulas (MoM/YoY) used across the "Macro Tier" summaries, which were then manually implemented as custom JavaScript utilities.
