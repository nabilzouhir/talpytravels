# TalpyTravels

A mobile-first travel planning & diary web app for two people. Built with Next.js 14, Supabase, and Tailwind CSS.

## Stack

- **Next.js 14** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS** (dark mode support)
- **Supabase** (PostgreSQL database, Auth-free, Storage for photos)

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd talpytravels
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **anon/public key** from Settings > API

### 3. Run the database schema

1. Open the **SQL Editor** in your Supabase dashboard
2. Paste the contents of `supabase/schema.sql` and run it
3. This creates all tables, indexes, RLS policies, and the `travel-photos` storage bucket

### 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `APP_PASSWORD` | The shared password for both users |
| `AUTH_SECRET` | A random string used to sign the auth cookie (generate with `openssl rand -hex 32`) |

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

## Deploy on Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add the four environment variables in the Vercel project settings
4. Deploy

## Features

- **Destinations** — organize trips by status: Wishlist, Planned, Visited
- **Activities** — track things to do, grouped by category (food, sightseeing, adventure, etc.)
- **Itinerary** — assign activities to days for a day-by-day plan
- **Diary** — write travel diary entries with text and linked photos
- **Photos** — upload and browse photos with captions and lightbox view
- **Dark mode** — toggle between light, dark, and system preference
- **Mobile-first** — designed for phones with bottom navigation
- **Shared access** — single password for both users, no account creation needed

## Project Structure

```
app/
  layout.tsx              Root layout with ThemeProvider
  middleware.ts           Auth middleware
  login/page.tsx          Login page
  (app)/
    layout.tsx            App shell (header + bottom nav)
    page.tsx              Home / destinations list
    destinations/
      new/page.tsx        New destination form
      [id]/page.tsx       Destination detail with tabs
      [id]/edit/page.tsx  Edit destination form
components/
  ThemeProvider.tsx        Dark mode context
  ThemeToggle.tsx          Theme toggle button
  DestinationsList.tsx     Collapsible destination sections
  DestinationCard.tsx      Destination card component
  DestinationForm.tsx      Create/edit destination form
  DestinationTabs.tsx      Tab switcher component
  tabs/
    ActivitiesTab.tsx      Activities list with inline form
    ItineraryTab.tsx       Day-by-day itinerary view
    DiaryTab.tsx           Diary entries with view/edit
    PhotosTab.tsx          Photo grid with lightbox
lib/
  supabase-server.ts      Server-side Supabase client
  supabase-browser.ts     Browser-side Supabase client
  auth.ts                 Cookie-based auth utilities
  actions.ts              Server Actions for all mutations
  types.ts                TypeScript interfaces
  utils.ts                Date formatting, constants
supabase/
  schema.sql              Database schema + storage bucket
```
