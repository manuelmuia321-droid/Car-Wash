// js/supabase-client.js
// Shared Supabase client used by both the public booking form and the admin dashboard.
//
// SETUP: paste your own values below (Supabase Dashboard → Project Settings → API).
// The "anon" key is safe to expose in client-side code — it's public by design.
// Row Level Security (see sql/schema.sql) is what actually controls access, not this key.

const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

// Loaded via the CDN script tag in each HTML page (see index.html / admin.html),
// which exposes the global `supabase` object from @supabase/supabase-js.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
