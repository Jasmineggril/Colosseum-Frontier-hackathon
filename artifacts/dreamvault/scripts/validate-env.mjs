#!/usr/bin/env node
/**
 * Validate required Supabase environment variables before building
 * Prevents deploying broken builds to production
 */

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error(
    '\n❌ BUILD FAILED: Missing required environment variables\n' +
    'The following variables must be set:\n' +
    missing.map(v => `  - ${v}`).join('\n') +
    '\n\n📖 Setup instructions:\n' +
    '  Local: Copy .env.example to .env.local and fill in values\n' +
    '  Vercel: Set these variables in Environment Variables dashboard\n' +
    '          Project Settings > Environment Variables > Add for Production\n' +
    '          Then trigger a redeploy\n' +
    '  Reference: .env.production.example\n'
  );
  process.exit(1);
}

console.log('✅ Environment variables validated successfully');
