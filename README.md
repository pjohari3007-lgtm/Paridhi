# SahiKhata

Fixed-fee **fixed asset** and **vendor master reconciliation** web application for manufacturing MSMEs (₹10–100 Cr turnover) running Tally or SAP across the Uttarakhand industrial belt (Haridwar SIDCUL, Selaqui, Dehradun, Rudrapur) and North India.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`.

## Production Build

```bash
npm run lint
npm run build
```

## Deploying via GitHub & Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SahiKhata web application"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sahikhata.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Import the GitHub repository in the [Vercel Dashboard](https://vercel.com/new).
   - Vercel automatically detects **Vite** via `vercel.json` (`npm run build` → `dist/`).
   - No environment variables or database secrets are required for the static production deployment.
