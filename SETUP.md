# SparkWash KE — Admin Dashboard Setup Guide

This adds a password-protected `/admin` page where you (the owner) can see every
booking that comes in from the website, and update its status (new → confirmed →
in progress → done).

It needs two free accounts: **Supabase** (the database + login system) and
**Vercel** (hosting). Total setup time: ~15 minutes.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → sign up (GitHub or email is easiest).
2. Click **New project**.
   - Name: `sparkwash-ke` (anything works)
   - Database password: generate one and save it somewhere safe — you won't need
     it day-to-day, but keep it.
   - Region: pick the closest to Nairobi (e.g. `eu-west` or `af-south` if offered).
3. Wait ~2 minutes for it to provision.

## 2. Create the bookings table

1. In your new project, go to **SQL Editor** (left sidebar) → **New query**.
2. Open `sql/schema.sql` from this project, copy the whole file, paste it in.
3. Click **Run**.
4. Go to **Table Editor** → you should now see a `bookings` table with the right columns.

This also sets up the security rules (Row Level Security):
- Anyone visiting the website can **submit** a booking (no login needed).
- Only someone **logged in** can **view or update** bookings — i.e. only you.

## 3. Create your owner login

1. Go to **Authentication** → **Users** (left sidebar) → **Add user**.
2. Enter your email and a password you'll remember.
3. Tick **Auto Confirm User** (so you don't need to click an email link) → **Create user**.

This is the email/password you'll use to log into `/admin`.

> Want more than one staff login later? Just add more users the same way —
> the current setup gives every logged-in user the same access (view + update
> all bookings).

## 4. Get your API keys

1. Go to **Project Settings** (gear icon) → **API**.
2. Copy two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (a long string)

## 5. Plug the keys into the code

Open `js/supabase-client.js` and replace the two placeholder values:

```js
const SUPABASE_URL = 'https://xxxxx.supabase.co';       // ← your Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';                // ← your anon public key
```

Save the file. That's it for code changes — both `index.html` (booking form)
and `admin.html` (dashboard) use this same file.

> The anon key is safe to have in client-side code — it's meant to be public.
> Supabase's Row Level Security (step 2) is what actually controls who can do
> what, not this key.

## 6. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → sign up (GitHub login is easiest).
2. Push this project folder to a GitHub repo (or use Vercel's "drag and drop"
   deploy if you'd rather skip GitHub — Vercel supports uploading a folder
   directly under **Add New → Project → "..." → Deploy without Git**, or via
   the Vercel CLI: `npx vercel` from inside this folder).
3. Since this is a static site (no build step needed), Vercel will detect it
   automatically — just click **Deploy**.
4. Once deployed, your site is live at something like `sparkwash-ke.vercel.app`,
   and the admin dashboard is at `sparkwash-ke.vercel.app/admin.html`.
5. (Optional) Add your own domain under **Project Settings → Domains**.

## 7. Try it end-to-end

1. Visit your live site, fill in the booking form, submit it.
2. Go to `/admin.html`, log in with the email/password from step 3.
3. You should see the booking appear, with a status dropdown.

---

### Notes

- `admin.html` is not linked anywhere in the public navigation — visit it
  directly. It's also marked `noindex` so search engines won't list it. For
  real security, the login (step 3) is what matters, not the lack of a link.
- The existing WhatsApp/SMS notification flows in the chatbot and booking form
  still work exactly as before — this only *adds* a database record + a place
  to view it, it doesn't replace anything.
- If you ever want a second owner/staff account, repeat step 3 — no code
  changes needed.
