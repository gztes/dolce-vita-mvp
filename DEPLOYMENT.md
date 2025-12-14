# Dolce Vita Deployment Guide

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```
3. **Supabase Project**: Set up at [supabase.com](https://supabase.com)

## Initial Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Supabase

1. Create a new Supabase project
2. Run the migrations:
   ```bash
   supabase db push
   ```
   Or manually run the SQL files in `supabase/migrations/` in order

3. Get your Supabase credentials:
   - Project URL
   - Anon/Public Key

4. Create `.env.local` file:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Configure EAS

1. Login to EAS:
   ```bash
   eas login
   ```

2. Configure your project:
   ```bash
   eas build:configure
   ```

3. Set environment variables in EAS:
   ```bash
   eas secret:create --scope project --name SUPABASE_URL --value your_supabase_url
   eas secret:create --scope project --name SUPABASE_ANON_KEY --value your_supabase_anon_key
   ```

## Development

### Run Locally

```bash
pnpm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Development Build

For a more production-like experience:

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

## Building for Production

### iOS

1. **Prerequisites**:
   - Apple Developer account ($99/year)
   - App Store Connect app created

2. **Build**:
   ```bash
   eas build --profile production --platform ios
   ```

3. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

### Android

1. **Build**:
   ```bash
   eas build --profile production --platform android
   ```

2. **Submit to Google Play**:
   ```bash
   eas submit --platform android
   ```

## Preview/Internal Testing

For internal testing without app stores:

```bash
# iOS (TestFlight)
eas build --profile preview --platform ios

# Android (APK)
eas build --profile preview --platform android
```

## Database Migrations

When you update the schema:

1. Create a new migration file in `supabase/migrations/`
2. Name it with timestamp: `YYYYMMDDHHMMSS_description.sql`
3. Push to Supabase:
   ```bash
   supabase db push
   ```

## Environment Variables

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key

These are set in:
- `.env.local` for local development
- EAS Secrets for builds

## Troubleshooting

### Build Fails

1. Check EAS secrets are set correctly
2. Verify `app.json` configuration
3. Check logs: `eas build:list`

### Database Connection Issues

1. Verify Supabase URL and key
2. Check RLS policies are enabled
3. Ensure migrations have run

### Auth Issues

1. Verify Supabase Auth is enabled
2. Check email templates in Supabase dashboard
3. Configure redirect URLs in Supabase Auth settings

## Monitoring

- **EAS Dashboard**: Monitor builds and submissions
- **Supabase Dashboard**: Monitor database and auth
- **Expo Analytics**: Track app usage (if enabled)

## Next Steps

1. Set up Sentry or similar for error tracking
2. Configure push notifications
3. Set up CI/CD with GitHub Actions
4. Add app icons and splash screens
5. Configure deep linking for email verification

## Support

For issues:
- Expo: [docs.expo.dev](https://docs.expo.dev)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- GitHub Issues: Create an issue in the repository
