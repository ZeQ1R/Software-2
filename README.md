# 💰 Budget Ledger

A beautiful personal finance app with user accounts, cloud storage, and full expense tracking.

**Stack:** React + Vite · Supabase (Auth + PostgreSQL) · Vercel (Hosting)

---

## 🚀 Step-by-Step Setup Guide

### Step 1 — Create a Supabase Project (Free)

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"**, give it a name (e.g. `budget-ledger`), set a password, choose a region
3. Wait ~1 minute for the project to spin up

### Step 2 — Set Up the Database

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `database/schema.sql` from this project
4. Paste it into the editor and click **"Run"**
5. You should see: *"Success. No rows returned"*

This creates:
- `profiles` table — stores user info
- `expenses` table — stores all expenses
- Row Level Security (RLS) policies — ensures users can only see their own data

### Step 3 — Get Your API Keys

1. In Supabase dashboard → **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

### Step 4 — Configure Environment Variables

```bash
# In the project root, copy the example file:
cp .env.example .env

# Then edit .env and paste your values:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Step 5 — Run Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Open http://localhost:5173
```

---

Users can then tap **"Add to Home Screen"** in their browser to install it like a native app.

---

## 🔒 Security Features

- **Row Level Security (RLS)** — Database-enforced isolation; users physically cannot access other users' data
- **JWT Authentication** — Supabase handles secure token-based auth
- **Email verification** — Optional; can be enabled in Supabase Auth settings
- **Password hashing** — Handled automatically by Supabase (bcrypt)

---

## 📁 Project Structure

```
budget-ledger/
├── database/
│   └── schema.sql          ← Run this in Supabase SQL Editor
├── src/
│   ├── lib/
│   │   └── supabase.js     ← Supabase client
│   ├── pages/
│   │   ├── AuthPage.jsx    ← Login / Signup UI
│   │   └── BudgetPage.jsx  ← Main budget app
│   ├── App.jsx             ← Route protection & auth state
│   └── main.jsx            ← Entry point
├── .env.example            ← Copy to .env and fill in keys
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎯 Features

- ✅ User signup & login with email/password
- ✅ Each user's data is private and isolated
- ✅ Add expenses with name, description, date, cost, category
- ✅ 8 built-in categories (Food, Bills, Transport, etc.)
- ✅ Browse expenses by month
- ✅ Click any expense to see full details
- ✅ Delete expenses
- ✅ Visual category breakdown bar
- ✅ Year total & month totals
- ✅ Cloud sync — access your data from any device
- ✅ Beautiful dark luxury UI

---

## 💡 Future Ideas

- [ ] Monthly budget limits with alerts
- [ ] CSV/PDF export
- [ ] Charts & analytics dashboard
- [ ] Recurring expense templates
- [ ] Multi-currency support
- [ ] Mobile app via React Native
