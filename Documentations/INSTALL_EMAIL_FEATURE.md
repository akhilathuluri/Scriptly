# Install Email Feature - One Command Reference

> Quick reference for installing the email sending feature

---

## ✅ What's Already Done

The email feature code is **already implemented** in your project. You just need to configure it!

### Files Already Created:
✅ `components/send-email-dialog.tsx`  
✅ `lib/email.ts`  
✅ `app/api/send-email/route.ts`  
✅ `supabase/email_history_schema.sql`  
✅ Updated `components/editor-toolbar.tsx`  
✅ Updated `components/editor.tsx`  
✅ Updated `.env.example`

---

## 🚀 Installation Steps

### Step 1: Install Dependencies (Optional)

The required packages are already in `package.json`. If you need to reinstall:

```bash
npm install
```

For TypeScript support (optional):
```bash
npm install --save-dev @types/nodemailer
```

---

### Step 2: Setup Database

Copy and run this SQL in your Supabase SQL Editor:

```sql
-- Email History Table
CREATE TABLE IF NOT EXISTS public.email_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    attachment_format TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email history"
    ON public.email_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email history"
    ON public.email_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_email_history_user_id ON public.email_history(user_id);
CREATE INDEX IF NOT EXISTS idx_email_history_sent_at ON public.email_history(sent_at DESC);
```

---

### Step 3: Configure SMTP

Add these lines to your `.env.local` file:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
```

**For Gmail:**
1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password as `SMTP_PASSWORD`

---

### Step 4: Restart Server

```bash
npm run dev
```

---

## ✅ Verify Installation

1. Sign in to your app
2. Open any document
3. Click **Export** → **Send via Email**
4. Send a test email to yourself
5. Check your inbox!

---

## 📚 Full Documentation

For complete documentation, see:
- **Quick Start:** `EMAIL_SETUP_QUICK_START.md`
- **Full Guide:** `EMAIL_FEATURE_GUIDE.md`
- **All Docs:** `EMAIL_DOCS_INDEX.md`

---

## 🐛 Troubleshooting

**Email not sending?**
```bash
# Check your .env.local file
# Verify SMTP credentials are correct
# Restart your dev server
```

**"Sign in required"?**
```bash
# Sign in to your account first
# Email feature requires authentication
```

**Need help?**
```bash
# See EMAIL_FEATURE_GUIDE.md → Troubleshooting section
```

---

## 🎉 That's It!

Your email feature is now installed and ready to use!

**Total Setup Time:** ~5 minutes

---

**Status:** ✅ Installation Complete
