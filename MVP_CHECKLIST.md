# Dolce Vita MVP Deployment Checklist

## ✅ Code Complete

### Screens (4 total)
- [x] Check-In screen (mood + energy + note)
- [x] Today screen (Next Step card + plan view)
- [x] Reflection screen (1-5 rating + notes)
- [x] Settings screen (minimal account settings)

### Core Logic
- [x] Plan generation algorithm (energy-based focus blocks)
- [x] Next Step logic (finds current/next block)
- [x] Linear navigation flow
- [x] Auth guards and routing

### Database
- [x] Minimal schema (4 tables only)
- [x] RLS policies
- [x] Indexes for performance

### Components
- [x] Reusable Button component
- [x] Reusable Input component
- [x] Auth context provider

## 🚀 Pre-Deployment Steps

### 1. Supabase Setup
```bash
# Create Supabase project at supabase.com
# Run migrations:
supabase db push

# Or manually run in SQL editor:
# - 20250101000000_initial_schema.sql
# - 20250113120000_final_mvp_schema.sql
```

### 2. Environment Variables
```bash
# Create .env.local
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Set EAS secrets:
eas secret:create --scope project --name SUPABASE_URL --value your_url
eas secret:create --scope project --name SUPABASE_ANON_KEY --value your_key
```

### 3. Test Locally
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm start

# Test flow:
# 1. Sign up
# 2. Check-in
# 3. View Today plan
# 4. Mark steps complete
# 5. Reflect
```

### 4. Build for Production
```bash
# Login to EAS
eas login

# Configure project
eas build:configure

# Build iOS
eas build --profile production --platform ios

# Build Android
eas build --profile production --platform android
```

### 5. Internal Testing
```bash
# Build preview version
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Share with 5-10 test users
# Watch them use it (in person if possible)
```

## 📊 Success Metrics (Week 1)

- [ ] 10 users signed up
- [ ] 5 users completed full flow (check-in → today → reflection)
- [ ] 3 users returned next day
- [ ] Collect qualitative feedback: "Did this help?"

## 🐛 Known Limitations (By Design)

- No calendar integration yet (v2)
- No custom routines (v2)
- No notifications (v2)
- No task CRUD (v2)
- No multi-day planning (v2)
- Work hours hardcoded to 9am-5pm (v2)

## 🎯 Next Iteration Triggers

Ship v2 when users say:

1. "I love this but I need my calendar events"
   → Add Google Calendar read-only integration

2. "The plan doesn't match my actual schedule"
   → Add work hours customization

3. "I forget to check the app"
   → Add push notifications for next steps

4. "I want to track specific habits"
   → Consider adding simple habit tracking

## 📝 Post-Launch Actions

1. Set up error tracking (Sentry)
2. Monitor Supabase logs for errors
3. Schedule user interviews (5 users, 15 min each)
4. Document common failure points
5. Iterate based on real usage, not assumptions

---

**Remember: This is a brick, not a suite. Ship it. Learn. Iterate.**
