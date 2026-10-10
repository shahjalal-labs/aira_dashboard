# 🏖️ Aira Dashboard — Property Rental & Reservation Administration Portal

![UI Architecture Banner](./assets/banner.svg)

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind_CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix_UI" />
  <img src="https://img.shields.io/badge/Rental_Ops-8B5CF6?style=for-the-badge&logo=home&logoColor=white" alt="Rental_Ops" />
  
</p>

---

## 📌 Executive Overview

Aira Dashboard empowers property managers to supervise short-term rental listings, dynamic seasonal pricing, guest reservations, cleaning rosters, and payment payouts across multiple properties.

---

## 🚀 Key Frontend Engineering Highlights

- **Reservation Timeline**: Interactive Gantt-style booking timeline displaying room occupancy and turnover dates.
- **Dynamic Rate Engine**: Configure seasonal multipliers, weekend surcharges, and discount codes.
- **Guest Management**: Traveler verification status, check-in instructions, and communication logs.
- **Payout Auditing**: Automated commission calculation, host balances, and payout history.
- **Fluid Layout**: Mobile-responsive dashboard built with Tailwind CSS and Radix UI primitives.

---

## 📂 Project Architecture

```plaintext
aira_dashboard/
├── assets/
│   └── banner.svg         # UI architecture visual banner
├── src/
│   ├── components/        # Reusable design system primitives & UI atoms
│   ├── pages/ or app/     # Application routes & layouts
│   ├── hooks/             # Custom React hooks & state encapsulation
│   ├── services/          # API client endpoints & HTTP adapters
│   └── styles/            # Tailwind CSS configurations & themes
├── public/                # Static assets & icons
├── package.json
└── tsconfig.json
```

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahjalal-labs/aira_dashboard.git
cd aira_dashboard
npm install
```

### 2. Environment Configuration
Create a local `.env` file if required:
```bash
cp .env.example .env 2>/dev/null || true
```

### 3. Run Development Server
```bash
npm run dev
```

Application will launch locally at `http://localhost:3000` or `http://localhost:5173`.

---

## 👨‍💻 Engineering & Authorship

Developed and maintained by **Md. Shahjalal**.

* **GitHub**: [@shahjalal-labs](https://github.com/shahjalal-labs)
* **Email**: [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
