import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
  ?? (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.warn(
    "⚠️  Supabase não configurado. Certifique-se de que as variáveis estão definidas no ambiente:" +
    "\n  - VITE_SUPABASE_URL" +
    "\n  - VITE_SUPABASE_ANON_KEY" +
    "\n\nEm produção (Vercel): defina essas variáveis em Environment Variables na dashboard do projeto."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
