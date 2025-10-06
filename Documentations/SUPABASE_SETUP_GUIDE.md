# Supabase Authentication Setup Guide

## 🚀 Complete Setup Instructions

This guide will walk you through setting up authentication and database for the Markdown Editor.

---

## Step 1: Create Supabase Project

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### 1.2 Create New Project
1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Project Name**: `markdown-editor` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
4. Click "Create new project"
5. Wait 2-3 minutes for project to be ready

---

## Step 2: Get API Credentials

### 2.1 Find Your Credentials
1. In your Supabase project dashboard
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **API** under Project Settings
4. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

### 2.2 Copy Credentials
Copy these two values - you'll need them next!

---

## Step 3: Configure Environment Variables

### 3.1 Create .env.local File
1. In your project root, create a file named `.env.local`
2. Add the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Google Gemini API for AI features
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### 3.2 Replace Values
- Replace `https://your-project-id.supabase.co` with your **Project URL**
- Replace `your-anon-key-here` with your **anon public key**

### 3.3 Important Notes
- ⚠️ Never commit `.env.local` to Git
- ✅ `.env.local` is already in `.gitignore`
- 🔒 Keep your keys secure

---

## Step 4: Run Database Schema

### 4.1 Open SQL Editor
1. In Supabase dashboard, click **SQL Editor** in left sidebar
2. Click **New query**

### 4.2 Copy and Run Schema
1. Open the file `supabase/schema.sql` in your project
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)

### 4.3 Verify Success
You should see:
```
✅ Database schema created successfully!
📝 Tables created: profiles, documents, folders, chat_history, user_settings, document_versions
🔒 Row Level Security enabled on all tables
🪝 Triggers created for auto-updating timestamps
👤 Auto-profile creation on signup enabled
📦 Storage bucket for avatars created
```

---

## Step 5: Configure Authentication

### 5.1 Enable Email Authentication
1. Go to **Authentication** → **Providers** in Supabase
2. Find **Email** provider
3. Make sure it's **Enabled**
4. Configure settings:
   - ✅ Enable email confirmations (recommended)
   - ✅ Enable email change confirmations
   - ✅ Secure email change

### 5.2 Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize:
   - Confirmation email
   - Magic link email
   - Password reset email
3. Add your app name and branding

### 5.3 Set Site URL
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset-password`
4. For production, add your production URLs

---

## Step 6: Test the Setup

### 6.1 Install Dependencies
```bash
npm install
```

### 6.2 Run Development Server
```bash
npm run dev
```

### 6.3 Test Authentication
1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up"
3. Create a test account
4. Check your email for confirmation
5. Sign in with your credentials

---

## Step 7: Verify Database

### 7.1 Check Tables
1. In Supabase, go to **Table Editor**
2. You should see these tables:
   - ✅ profiles
   - ✅ documents
   - ✅ folders
   - ✅ chat_history
   - ✅ user_settings
   - ✅ document_versions

### 7.2 Check Your Profile
1. Click on **profiles** table
2. You should see your user profile
3. Verify email and name are correct

### 7.3 Test Creating a Document
1. In your app, create a new document
2. Go to Supabase **Table Editor** → **documents**
3. You should see your document!

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**:
1. Make sure `.env.local` exists in project root
2. Check that variables start with `NEXT_PUBLIC_`
3. Restart your dev server after adding env vars

### Issue: "Failed to create account"

**Possible causes**:
- Email already exists
- Password too short (min 6 characters)
- Email confirmation required

**Solution**:
1. Check Supabase **Authentication** → **Users**
2. Verify email settings
3. Check spam folder for confirmation email

### Issue: "Row Level Security policy violation"

**Solution**:
1. Make sure you ran the complete schema.sql
2. Check that RLS policies were created
3. Re-run the schema if needed

### Issue: Tables not created

**Solution**:
1. Check SQL Editor for errors
2. Make sure you copied the entire schema.sql
3. Try running sections separately if needed

### Issue: Can't sign in after signup

**Solution**:
1. Check if email confirmation is required
2. Go to **Authentication** → **Users**
3. Manually confirm user if needed
4. Or disable email confirmation for testing

---

## Production Deployment

### Update Environment Variables
When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform
2. Update Site URL in Supabase:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: `https://yourdomain.com/auth/callback`

### Security Checklist
- ✅ Enable email confirmation
- ✅ Set strong password requirements
- ✅ Configure rate limiting
- ✅ Enable CAPTCHA for signup (optional)
- ✅ Set up custom SMTP (optional)
- ✅ Monitor authentication logs

---

## Database Schema Overview

### Tables Created

#### 1. **profiles**
- User profile information
- Extends auth.users
- Stores: name, avatar, email

#### 2. **documents**
- Markdown documents
- Stores: title, content, tags
- Features: favorites, archive, folders

#### 3. **folders**
- Document organization
- Supports nested folders
- Custom colors

#### 4. **chat_history**
- AI chatbot conversations
- Per-document history
- JSONB message storage

#### 5. **user_settings**
- User preferences
- Theme, editor settings
- AI configuration

#### 6. **document_versions**
- Version history (optional)
- Track changes over time
- Restore previous versions

### Security Features

- ✅ **Row Level Security (RLS)**: Users can only access their own data
- ✅ **Auto-profile creation**: Profile created on signup
- ✅ **Cascading deletes**: Clean up related data
- ✅ **Timestamps**: Auto-updated on changes
- ✅ **Indexes**: Fast queries

---

## Features Enabled

### Authentication
- ✅ Email/Password signup
- ✅ Email confirmation
- ✅ Password reset
- ✅ Session management
- ✅ Auto-refresh tokens

### Data Storage
- ✅ Documents with folders
- ✅ Chat history
- ✅ User settings
- ✅ Profile management
- ✅ Version history

### Security
- ✅ Row Level Security
- ✅ User isolation
- ✅ Secure API keys
- ✅ HTTPS only

---

## Next Steps

### 1. Customize Email Templates
- Add your branding
- Customize messages
- Add support links

### 2. Set Up Custom Domain
- Configure custom SMTP
- Use your domain for emails
- Better deliverability

### 3. Enable Additional Auth Providers
- Google OAuth
- GitHub OAuth
- Magic links

### 4. Set Up Backups
- Enable point-in-time recovery
- Schedule regular backups
- Test restore process

### 5. Monitor Usage
- Check authentication logs
- Monitor API usage
- Set up alerts

---

## Useful Links

- **Supabase Dashboard**: [https://app.supabase.com](https://app.supabase.com)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Auth Docs**: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- **RLS Guide**: [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)

---

## Support

If you encounter issues:

1. Check Supabase logs in dashboard
2. Review error messages carefully
3. Consult Supabase documentation
4. Check GitHub issues
5. Ask in Supabase Discord

---

**🎉 Setup Complete! You now have a fully functional authentication system with database storage!**
