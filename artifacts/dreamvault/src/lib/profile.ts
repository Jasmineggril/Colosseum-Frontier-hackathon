import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type DreamVaultProfile = {
  id: string;
  username: string;
  category: string;
  created_at: string;
  onboarding_completed: boolean;
};

export type DreamVaultProfileInput = {
  id: string;
  username: string;
  category: string;
  onboarding_completed?: boolean;
};

export type DreamVaultProfileSource = {
  id: string;
  user_metadata?: {
    username?: string;
    category?: string;
  };
  email?: string | null;
};

function requireSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error("Supabase nao configurado.");
  }

  return supabase;
}

export function formatAuthError(error: { message?: string; status?: number } | null | undefined, fallback: string): string {
  const message = error?.message?.trim();
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (!message) {
    return fallback;
  }

  if (normalizedMessage.includes("failed to fetch")) {
    return "Nao foi possivel conectar com o Supabase. Verifique as variaveis de ambiente no Vercel.";
  }

  if (error?.status === 429 || normalizedMessage.includes("over_email_send_rate_limit")) {
    return "O Supabase bloqueou o envio de e-mail de confirmacao por limite temporario. Aguarde alguns minutos, use outro e-mail ou desative a confirmacao de e-mail no projeto Supabase para liberar o cadastro imediato.";
  }

  if (normalizedMessage.includes("username must be") || normalizedMessage.includes("email invalido") || normalizedMessage.includes("password deve")) {
    return message;
  }

  return message;
}

export async function upsertDreamVaultProfile(input: DreamVaultProfileInput) {
  const client = requireSupabaseClient();

  return client
    .from("profiles")
    .upsert(
      {
        id: input.id,
        username: input.username,
        category: input.category,
        onboarding_completed: input.onboarding_completed ?? false,
      },
      { onConflict: "id" },
    )
    .select("id, username, category, created_at, onboarding_completed")
    .single();
}

export async function fetchDreamVaultProfile(userId: string) {
  const client = requireSupabaseClient();

  return client.from("profiles").select("id, username, category, created_at, onboarding_completed").eq("id", userId).maybeSingle();
}

function resolveProfileDefaults(user: DreamVaultProfileSource) {
  const username = user.user_metadata?.username?.trim() || user.email?.split("@")[0] || "Dreamer";
  const category = user.user_metadata?.category?.trim() || "Cosmic";

  return {
    id: user.id,
    username,
    category,
  };
}

export async function syncDreamVaultProfile(user: DreamVaultProfileSource) {
  const existingProfile = await fetchDreamVaultProfile(user.id);

  if (existingProfile.data) {
    return existingProfile;
  }

  const tableMissing = existingProfile.error?.message?.includes("Could not find the table 'public.profiles'")
    || existingProfile.error?.message?.includes("PGRST205");

  if (tableMissing || !existingProfile.error) {
    return {
      data: resolveProfileDefaults(user) as DreamVaultProfile,
      error: null,
    };
  }

  return {
    data: resolveProfileDefaults(user) as DreamVaultProfile,
    error: null,
  };
}

export async function completeDreamVaultOnboarding(userId: string) {
  const client = requireSupabaseClient();

  return client
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", userId)
    .select("id, username, category, created_at, onboarding_completed")
    .single();
}
