# Dolce Vita MVP

**A decision-eliminating engine for people who don't know what to do next.**

## The Problem

You wake up overwhelmed. Your calendar is a lie. Every hour requires micro-decisions you're too tired to make. Productivity tools add more obligations instead of reducing choices.

## The Solution

Dolce Vita tells you **exactly what to do next** — based on your mood, energy, and real schedule.

No planning. No thinking. Just: **"Do this now."**

## MVP Features (v1)

### 4 Screens Only

1. **Check-In** — How are you feeling? (mood + energy + optional note)
2. **Today** — Your plan + Next Step card
3. **Reflection** — How did it go? (1-5 rating + optional text)
4. **Settings** — Minimal account settings

### Linear Flow

```
Login → Check-In → Today → Reflection → Repeat
```

No tabs. No navigation complexity. Just the next step.

### Plan Generation

The app takes:
- Today's check-in (mood + energy)
- Calendar events (coming soon)
- Work hours (9am-5pm default)

And generates a plan with:
- **Focus blocks** (duration based on energy)
- **Break blocks** (adaptive)
- **Calendar events** (read-only)

### Next Step Logic

The **Today** screen shows a single giant card:

> **NEXT UP**  
> Focus Block  
> 2:00 PM - 3:30 PM (90 min)  
> [Mark Complete]

No choices. No overwhelm. Just do this.

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (Auth + Database)
- **Deployment**: EAS Build (iOS/Android)

## Database Schema

Only 4 tables:

1. `profiles` — User accounts
2. `check_ins` — Daily mood/energy
3. `day_plans` — Generated plans (JSON blob)
4. `reflections` — End-of-day ratings

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up Supabase:
   - Create project at [supabase.com](https://supabase.com)
   - Run migrations in `supabase/migrations/`
   - Copy `.env.example` to `.env.local` and add credentials

3. Run locally:
   ```bash
   pnpm start
   ```

4. Build for production:
   ```bash
   eas build --profile production --platform ios
   eas build --profile production --platform android
   ```

## What's NOT in v1

- ❌ Custom routines
- ❌ Task CRUD
- ❌ Habit tracking
- ❌ Multi-day planning
- ❌ Analytics/dashboards
- ❌ Onboarding personas
- ❌ Calendar write access
- ❌ Notifications (yet)

These are nice-to-haves. The MVP solves **one problem perfectly**:

> "I don't know what to do next."

## Next Steps

1. Ship to 10 users
2. Watch them use it
3. Iterate based on where they fail
4. Add calendar integration (Google Calendar read-only)
5. Add basic notifications for next steps

## Philosophy

This is a **brick**, not a suite.

It's embarrassingly incomplete by design. Early Airbnb didn't have payments. Early Dolce Vita doesn't have routines.

We're solving the hair-on-fire problem first. Everything else is decoration.

---

**Built with the YC MVP philosophy: tiny, desperate, fast.**
