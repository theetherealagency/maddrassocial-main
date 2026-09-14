// Supabase browser client.
//
// The generated original called createClient() with the raw env vars, which
// throws "supabaseUrl is required" at module load when they are unset — that
// killed the whole SPA, not just the forms. Per CLAUDE.md every key needs a
// graceful fallback so local dev runs without secrets, so the client is only
// constructed when both values are present.
//
// `supabase` is null when unconfigured. Callers must check `isSupabaseReady`
// (or null-check) before writing, and tell the user the form is unavailable
// rather than failing silently.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseReady = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

if (!isSupabaseReady && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set. ' +
      'Forms will report that submission is unavailable. See .env.example.',
  );
}

export const supabase = isSupabaseReady
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
