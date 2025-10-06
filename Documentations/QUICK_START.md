# Quick Start Guide - Authentication Setup

## ⚡ Fast Setup (5 minutes)

### Step 1: Create .env.local File

Create a file named `.env.local` in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Click "New Project"
4. Fill in:
   - Project name: `markdown-editor`
   - Database password: (generate and save it)
   - Region: Choose closest to you
5. Wait 2-3 minutes for project creation
6. Go to **Settings** → **API**
7. Copy:
   - **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Run Database Schema

1. In Supabase dashboard, click **SQL Editor**
2. Click **New query**
3. Open `supabase/schema.sql` in your project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or Ctrl/Cmd + Enter)
7. Wait for success message

### Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test Authentication

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see **Sign In** and **Sign Up** buttons in the navigation
3. Click **Sign Up**
4. Create a test account
5. Check your email for confirmation (if enabled)
6. Sign in!

---

## ✅ Verification Checklist

- [ ] `.env.local` file created with both variables
- [ ] Supabase project created
- [ ] SQL schema executed successfully
- [ ] Dev server restarted
- [ ] Sign In/Sign Up buttons visible on landing page
- [ ] Can create account
- [ ] Can sign in
- [ ] User menu appears after sign in

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables" error

**Solution**: 
1. Check `.env.local` exists in project root (not in a subfolder)
2. Variable names must start with `NEXT_PUBLIC_`
3. No quotes around values
4. Restart dev server after creating file

### Sign In/Sign Up buttons not showing

**Solution**:
1. Check browser console for errors
2. Verify `.env.local` has correct values
3. Hard refresh browser (Ctrl+Shift+R)
4. Check that `@supabase/supabase-js` is installed

### "Failed to create account"

**Solution**:
1. Check password is at least 6 characters
2. Verify email format is correct
3. Check if email already exists
4. Look at Supabase logs in dashboard

### SQL schema errors

**Solution**:
1. Make sure you copied the ENTIRE schema.sql file
2. Run it in a fresh Supabase project
3. Check for any error messages in SQL Editor
4. Tables should be created in this order: profiles, folders, documents, chat_history, user_settings, document_versions

---

## 📝 What Gets Created

### In Supabase:
- ✅ 6 database tables
- ✅ Row Level Security policies
- ✅ Auto-profile creation trigger
- ✅ Storage bucket for avatars
- ✅ Indexes for performance

### In Your App:
- ✅ Sign In dialog
- ✅ Sign Up dialog
- ✅ User menu with avatar
- ✅ Auth state management
- ✅ Protected routes (coming soon)

---

## 🎯 Next Steps

After authentication works:

1. **Test document creation**
   - Sign in
   - Go to editor
   - Create a document
   - Check Supabase Table Editor → documents

2. **Customize email templates**
   - Go to Supabase → Authentication → Email Templates
   - Add your branding

3. **Configure production**
   - Add production URLs to Supabase
   - Set environment variables in hosting platform

---

## 📚 Full Documentation

For detailed setup instructions, see:
- `SUPABASE_SETUP_GUIDE.md` - Complete setup guide
- `AUTH_IMPLEMENTATION_SUMMARY.md` - Technical details
- `supabase/schema.sql` - Database schema with comments

---

## 🆘 Still Having Issues?

1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify all environment variables are set
4. Make sure dev server was restarted
5. Try in incognito/private browsing mode

---

**Need help? Check the full setup guide in `SUPABASE_SETUP_GUIDE.md`**
