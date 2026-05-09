#!/usr/bin/env node
/**
 * Validate Supabase environment variables before building.
 * Missing values should not block deploys because the app degrades gracefully.
 */

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.warn(
    '\n⚠️  Supabase environment variables are missing.\n' +
    'The app will build and run with auth features disabled.\n' +
    'Missing variables:\n' +
    missing.map(v => `  - ${v}`).join('\n') +
    '\n\n📖 Setup instructions:\n' +
    '  Local: Copy .env.example to .env.local and fill in values\n' +
    '  Vercel: Set these variables in Environment Variables dashboard\n' +
    '          Project Settings > Environment Variables > Add for Production\n' +
    '          Then trigger a redeploy\n' +
    '  Reference: .env.production.example\n'
  );
} else {
  console.log('✅ Environment variables validated successfully');
}
