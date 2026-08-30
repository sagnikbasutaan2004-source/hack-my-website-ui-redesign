# 🎨 Hack My Website — Frontend UI & Design Sandbox

> ### ⚠️ PROPRIETARY & CONFIDENTIAL INTELLECTUAL PROPERTY
> **Copyright © 2026 Hack My Website / AIVI Intelligence. All Rights Reserved.**
> This repository is private and confidential. Access is granted exclusively for UI/UX development for Hack My Website. **Copying, redistribution, commercial cloning, creating derivative products, or exporting source code for unauthorized personal/third-party use is strictly prohibited** and subject to legal enforcement under international copyright law and Non-Disclosure Agreements.

---

Welcome to the **Hack My Website UI Design Sandbox**! 🚀

This is a standalone, isolated frontend repository built with **Next.js 15, React 19, Tailwind CSS, and Lucide Icons**. It includes full mock data layers so you can redesign, polish, and animate all pages locally without needing any backend servers, database, or API keys.

---

## 🛠️ Quick Start (Run Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the live design.

---

## 🎯 Key Pages to Redesign & Focus Areas

| Page / Route | File Location | Redesign Scope & Goal |
|---|---|---|
| **1. Landing Page** (`/`) | `app/page.tsx`<br>`components/landing-*.tsx` | Modernize Hero typography, multi-engine showcase cards, AI score spotlight, pricing tables, and footer. |
| **2. Workspace & Dashboard** (`/workspace`) | `components/workspace-page.tsx`<br>`app/workspace/page.tsx` | Redesign the scanner input box, scan history table, active engine status cards, and left sidebar navigation. |
| **3. Sample Security Report** (`/sample-report`) | `app/sample-report/page.tsx`<br>`components/sample-report-*.tsx` | Elevate executive report summary, severity gauge charts (0–100), and interactive vulnerability accordion cards. |
| **4. How It Works** (`/how-it-works`) | `app/how-it-works/page.tsx` | Polish the 8-step security journey timeline, before/after code diffs, and developer persona cards. |
| **5. Methodology Matrix** (`/methodology`) | `app/methodology/page.tsx` | Modernize threat scoring matrices and scientific methodology breakdown. |
| **6. Sign In / Sign Up** (`/login`, `/signup`) | `components/auth/modern-auth-view.tsx` | Clean up auth cards, orbital animation styling, and responsive form inputs. |

---

## 🎨 Design System & Tech Stack
* **Framework:** [Next.js App Router](https://nextjs.org/) (`app/` directory)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (`tailwind.config.ts`)
* **Icons:** [Lucide React](https://lucide.dev/icons/)
* **Theme:** Dark cyberpunk / clean enterprise SaaS aesthetic (`#070A10` deep backdrop, emerald `#10b981` accents, slate borders).

---

## 📦 How to Submit Your Designs
1. Create a new branch for your design improvements:
   ```bash
   git checkout -b design/modern-ui-refresh
   ```
2. Commit your design & styling changes:
   ```bash
   git commit -m "feat(ui): redesign landing hero and dashboard cards"
   ```
3. Push to your branch and open a Pull Request!
