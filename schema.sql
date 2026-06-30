-- SparkWash KE — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query → paste → Run

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  service text not null,
  booking_date date not null,
  booking_time text not null,
  plate text,
  promo_code text,
  sms_opt_in boolean not null default true,
  status text not null default 'new' check (status in ('new', 'confirmed', 'in_progress', 'done', 'cancelled'))
);

-- Helpful index for the admin dashboard (newest first, filter by status)
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);

-- Row Level Security
alter table public.bookings enable row level security;

-- Anyone (anon key, i.e. the public website) can INSERT a booking.
-- This is what lets the booking form on index.html submit without logging in.
create policy "Public can insert bookings"
  on public.bookings
  for insert
  to anon
  with check (true);

-- Only a logged-in user (the owner, after email/password auth) can READ bookings.
create policy "Authenticated owner can read bookings"
  on public.bookings
  for select
  to authenticated
  using (true);

-- Only a logged-in user can UPDATE booking status (e.g. mark as done).
create policy "Authenticated owner can update bookings"
  on public.bookings
  for update
  to authenticated
  using (true)
  with check (true);

-- No public delete/update — keeps the form write-only and the dashboard read/update-only.
