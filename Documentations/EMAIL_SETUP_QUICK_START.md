# Email Feature - Quick Setup (5 Minutes)

## Step 1: Add Database Table (2 minutes)

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

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

-- Enable Row Level Security
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own email history"
    ON public.email_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email history"
    ON public.email_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_history_user_id ON public.email_history(user_id);
CREATE INDEX IF NOT EXISTS idx_email_history_sent_at ON public.email_history(sent_at DESC);
```

5. Click **Run**
6. You should see: "Success. No rows returned"

---

## Step 2: Configure SMTP (3 minutes)

### For Gmail (Recommended):

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Add to .env.local**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   SMTP_FROM=your_email@gmail.com
   ```

4. **Restart your dev server**
   ```bash
   npm run dev
   ```

---

## Step 3: Test It! (1 minute)

1. Sign in to your app
2. Open any document
3. Click **Export** → **Send via Email**
4. Enter your email address
5. Click **Send Email**
6. Check your inbox!

---

## ✅ Done!

Your email feature is now working!

### Verify Setup:

- [ ] Database table created (check Supabase Table Editor)
- [ ] SMTP credentials added to .env.local
- [ ] Dev server restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox

---

## 🆘 Quick Troubleshooting

**Email not sending?**
- Check SMTP credentials in .env.local
- Ensure app password is correct (not regular password)
- Restart dev server after adding env variables

**"Please sign in" message?**
- Sign in to your account first
- Email feature requires authentication

**Email in spam?**
- Check spam/junk folder
- Mark as "Not Spam" for future emails

---

## 📖 Full Documentation

For detailed information, see `EMAIL_FEATURE_GUIDE.md`

---

**Ready to send emails! 📧**
