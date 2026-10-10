# 🏖️ Aira — Short-Term Vacation Rental & Property Host Portal

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js_16" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React_18" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Turbopack-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Turbopack" />
  <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white" alt="Ant_Design" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/Hospitality_UI-14B8A6?style=for-the-badge&logo=home&logoColor=white" alt="Hospitality_UI" />
  
</p>

---

## 📌 Executive Overview

**Aira Dashboard** is a property management and reservation control plane for vacation rental operators and short-term hospitality hosts. Engineered with **Next.js 16 (Turbopack, App Router)**, the portal provides property managers with calendar day pricing/availability controls, guest reservation rosters, add-on service billing, dispute reports, and automated host payout ledger tracking.

---

## 🚀 Key Engineering & Domain Capabilities

- **Property Listings & Inventory Grid**: Manage vacation villa listings, photo galleries, seasonal amenities, and house rules.
- **Dynamic Calendar Availability & Pricing**: Visual date matrix allowing custom daily rates and blackout dates.
- **Guest Booking Lifecycle**: Track pending, confirmed, active, and completed stays with check-in details.
- **Host Payout & Financial Ledgers**: Automated tracking of host withdrawal requests, platform fees, and revenue shares.
- **Next.js 16 App Router Architecture**: Domain-driven route architecture under `app/(dashboard)` with high Core Web Vitals performance.

---

## 🏛️ Application Architecture & Route Tree

```plaintext
aira_dashboard/
├── assets/
│   └── banner.svg                     # High-resolution architectural banner
├── app/
│   ├── (auth)/                        # Host & manager authentication
│   ├── (dashboard)/
│   │   ├── listings/                  # Vacation property catalogue & photos
│   │   ├── bookings/                  # Guest reservations & check-in rosters
│   │   ├── payouts/                   # Host withdrawal requests & ledger balance
│   │   ├── reviews/                   # Guest feedback & ratings moderation
│   │   ├── reports/                   # Occupancy telemetry & revenue analytics
│   │   ├── user-management/           # Guests & property owner directories
│   │   └── settings/                  # Platform fees & cancellation policies
│   ├── layout.tsx                     # Root Next.js 16 layout
│   └── globals.css                    # Tailwind CSS styling
├── components/                        # Ant Design custom modals & cards
├── redux/                             # State management & API queries
├── package.json                       # Next.js 16.0.10, React 18, Ant Design
└── tsconfig.json
```

---

## 💻 Tech Stack Specification

| Layer | Technologies |
|---|---|
| **Framework** | **Next.js 16** (App Router, Turbopack, Server/Client Components) |
| **UI Components** | Ant Design, Lucide Icons, Custom Tailwind Primitives |
| **State Management** | Redux Toolkit (RTK), RTK Query API Caching |
| **Styling** | Tailwind CSS 3.4, PostCSS, Responsive Mobile-First Theme |
| **Language** | TypeScript 5 (Strict Mode) |

---

## 🛠️ Getting Started & Local Development

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm`, `yarn`, or `pnpm`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/aira_dashboard.git
cd aira_dashboard
npm install
```

### 2. Configure Environment Variables
Create a local `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server (Turbopack)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👨‍💻 Engineering & Authorship

Developed and engineered by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
