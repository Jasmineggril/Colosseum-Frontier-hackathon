import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawSupabaseAnonKey = (import.meta.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJreHBjaWdyb2d5ZXpieHJrb2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDQ3NDQsImV4cCI6MjA5MzY4MDc0NH0.rr142If6C4EZtB5Qh1U18xNCkhVY5hBQjznYDDUa-VA as string | undefined)
  ?? (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);

function normalizeSupabaseUrl(url: string | undefined): string | null {
  const trimmedUrl = url?.trim();

  if (!trimmedUrl) {
    return null;
  }

  const candidateUrl = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;

  try {
    const parsedUrl = new URL(candidateUrl);

    if (!parsedUrl.hostname.includes("supabase.co")) {
      return null;
    }

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function normalizeSupabaseKey(key: string | undefined): string | null {
  const trimmedKey = key?.trim();

  return trimmedKey ? trimmedKey : null;
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = normalizeSupabaseKey(rawSupabaseAnonKey);

const missingConfigReasons: string[] = [];

if (!rawSupabaseUrl?.trim()) {
  missingConfigReasons.push("VITE_SUPABASE_URL");
} else if (!supabaseUrl) {
  missingConfigReasons.push("VITE_SUPABASE_URL inválida");
}

if (!supabaseAnonKey) {
  missingConfigReasons.push("VITE_SUPABASE_ANON_KEY ou VITE_SUPABASE_PUBLISHABLE_KEY");
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseConfigError = isSupabaseConfigured
  ? null
  : `Supabase não configurado corretamente. Verifique: ${missingConfigReasons.join(", ")}.`;

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.warn(
    "⚠️  Supabase não configurado. Certifique-se de que as variáveis estão definidas no ambiente:" +
    "\n  - VITE_SUPABASE_URL" +
    "\n  - VITE_SUPABASE_ANON_KEY ou VITE_SUPABASE_PUBLISHABLE_KEY" +
    "\n\nEm produção (Vercel): defina essas variáveis em Environment Variables na dashboard do projeto."
  );
}

export const supabase = (() => {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
})();
