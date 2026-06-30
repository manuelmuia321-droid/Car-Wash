// js/supabase-client.js
// Shared Supabase client used by both the public booking form and the admin dashboard.
//
// SETUP: paste your own values below (Supabase Dashboard → Project Settings → API).
// The "anon" key is safe to expose in client-side code — it's public by design.
// Row Level Security (see sql/schema.sql) is what actually controls access, not this key.

const SUPABASE_URL = 'https://cxhhxgsvpkedtjoimvky.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4aGh4Z3N2cGtlZHRqb2ltdmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjE2MDgsImV4cCI6MjA5ODM5NzYwOH0.x3mDmMfxRtMEP5smy3gnJnqEylZjVEeI2CEY6gczStQ';

// Loaded via the CDN script tag in each HTML page (see index.html / admin.html),
// which exposes the global `supabase` object from @supabase/supabase-js.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
