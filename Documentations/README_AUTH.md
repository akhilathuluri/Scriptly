# Authentication System - Complete Guide

## 🎯 What's Implemented

A complete authentication system with:
- ✅ Email/Password sign up
- ✅ Email/Password sign in
- ✅ User profiles
- ✅ Session management
- ✅ Database storage (Supabase)
- ✅ Row Level Security
- ✅ UI components (dialogs, buttons, user menu)

---

## 🚀 Quick Start (3 Steps)

### 1. Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Run SQL Schema
- Open Supabase SQL Editor
- Copy/paste `supabase/schema.sql`
- Click Run

### 3. Restart Server
```bash
npm run dev
```

**Done!** You should see Sign In/Sign Up buttons.

---

## 📁 Files Structure

```
├── supabase/
│   └── schema.sql                    # Database schema (run this in Supabase)
│
├── lib/
│   ├── supabase.ts                   # Supabase client config
│   ├── auth.ts                       # Auth functions (signIn, signUp, etc)
│   └── database.ts                   # Database operations (CRUD)
│
├── contexts/
│   └── auth-context.tsx              # Global auth state management
│
├── components/auth/
│   ├── sign-in-dialog.tsx            # Sign in form
│   ├── sign-up-dialog.tsx            # Sign up form
│   ├── user-menu.tsx                 # User dropdown menu
│   ├── auth-buttons.tsx              # Sign in/up buttons
│   └── auth-check.tsx                # Config validation
│
├── app/
│   ├── layout.tsx                    # Wrapped with AuthProvider
│   └── landing/page.tsx              # Has auth buttons
│
└── Documentation/
    ├── QUICK_START.md                # Fast setup guide
    ├── SUPABASE_SETUP_GUIDE.md       # Detailed setup
    ├── AUTH_IMPLEMENTATION_SUMMARY.md # Technical details
    └── VISUAL_GUIDE.md               # What you should see
```

---

## 🔧 How It Works

### 1. User Signs Up
```typescript
// User fills form and clicks "Create Account"
const result = await signUp({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'John Doe'
});

// Supabase creates user in auth.users
// Trigger automatically creates profile in public.profiles
// Trigger automatically creates settings in public.user_settings
```

### 2. User Signs In
```typescript
// User enters credentials
const result = await signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Session is created and stored
// AuthContext updates with user data
// User menu appears with avatar
```

### 3. Auth State Management
```typescript
// AuthContext provides:
const { user, profile, loading, signOut } = useAuth();

// Available everywhere in the app
// Automatically updates on auth changes
// Persists across page refreshes
```

### 4. Data Storage
```typescript
// All user data is stored in Supabase:
- Documents (markdown files)
- Folders (organization)
- Chat history (AI conversations)
- User settings (preferences)
- Profile (name, avatar)
```

---

## 🗄️ Database Tables

### profiles
- User profile information
- Auto-created on signup
- Stores: name, email, avatar

### documents
- Markdown documents
- Belongs to user
- Has: title, content, folder, tags

### folders
- Document organization
- Supports nesting
- Has: name, color, parent

### chat_history
- AI chatbot conversations
- Per-document history
- Stores: messages (JSONB)

### user_settings
- User preferences
- Theme, editor settings
- AI configuration

### document_versions
- Version history (optional)
- Track changes
- Restore previous versions

---

## 🔒 Security

### Row Level Security (RLS)
Every table has policies:
```sql
-- Users can only see their own data
CREATE POLICY "Users can view their own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);
```

### What This Means
- ✅ Users can only access their own documents
- ✅ Users can only modify their own data
- ✅ Users can only delete their own content
- ✅ No user can see another user's data
- ✅ Enforced at database level (not just app)

---

## 🎨 UI Components

### AuthButtons
Shows on landing page:
- Sign In button (when not authenticated)
- Sign Up button (when not authenticated)
- User Menu (when authenticated)

### SignInDialog
Modal with:
- Email input
- Password input
- Submit button
- Link to sign up

### SignUpDialog
Modal with:
- Full name input
- Email input
- Password input
- Confirm password input
- Submit button
- Link to sign in

### UserMenu
Dropdown with:
- User avatar (initials or image)
- User name and email
- My Documents link
- Profile link
- Settings link
- Sign out button

---

## 📝 Usage Examples

### Check if User is Signed In
```typescript
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.email}!</div>;
}
```

### Create a Document
```typescript
import { createDocument } from '@/lib/database';
import { useAuth } from '@/contexts/auth-context';

function CreateDoc() {
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user) return;
    
    const doc = await createDocument(
      user.id,
      'My Document',
      '# Hello World'
    );
    
    console.log('Created:', doc);
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

### Get User's Documents
```typescript
import { getDocuments } from '@/lib/database';
import { useAuth } from '@/contexts/auth-context';

function DocumentList() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (user) {
      getDocuments(user.id).then(setDocs);
    }
  }, [user]);

  return (
    <ul>
      {docs.map(doc => (
        <li key={doc.id}>{doc.title}</li>
      ))}
    </ul>
  );
}
```

---

## 🐛 Troubleshooting

### Issue: Auth buttons not showing

**Check:**
1. `.env.local` file exists with correct variables
2. Dev server was restarted after creating `.env.local`
3. Browser console for errors
4. AuthCheck component shows no errors

**Solution:**
```bash
# 1. Verify .env.local
cat .env.local

# 2. Restart server
npm run dev

# 3. Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Issue: "Missing Supabase environment variables"

**Solution:**
Create `.env.local` in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Issue: SQL schema errors

**Solution:**
1. Copy the ENTIRE `supabase/schema.sql` file
2. Make sure you're in a fresh Supabase project
3. Run in SQL Editor, not in terminal
4. Check for error messages

### Issue: Can't create account

**Check:**
1. Password is at least 6 characters
2. Email format is valid
3. Email doesn't already exist
4. Supabase project is active

---

## 📚 Documentation

- **QUICK_START.md** - Get started in 5 minutes
- **SUPABASE_SETUP_GUIDE.md** - Detailed setup instructions
- **AUTH_IMPLEMENTATION_SUMMARY.md** - Technical implementation details
- **VISUAL_GUIDE.md** - Screenshots and UI guide

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] `.env.local` file created with Supabase credentials
- [ ] SQL schema executed successfully in Supabase
- [ ] Dev server restarted
- [ ] Sign In button visible on landing page
- [ ] Sign Up button visible on landing page
- [ ] Can create a test account
- [ ] Can sign in with test account
- [ ] User menu appears after sign in
- [ ] Can sign out
- [ ] No errors in browser console
- [ ] No configuration warnings

---

## 🎯 Next Steps

After authentication works:

1. **Test document creation**
   - Sign in
   - Create a document
   - Verify it appears in Supabase

2. **Integrate with editor**
   - Save documents to database
   - Load documents from database
   - Auto-save on changes

3. **Add features**
   - Document list/browser
   - Folder management
   - Search functionality
   - Settings page

4. **Production deployment**
   - Add production URLs to Supabase
   - Set environment variables in hosting
   - Test authentication flow

---

## 🆘 Need Help?

1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Review documentation files
4. Verify all steps were completed
5. Try in incognito mode

---

## 📊 What You Get

### For Users
- ✅ Secure authentication
- ✅ Personal data storage
- ✅ Cross-device sync
- ✅ Privacy (RLS protection)
- ✅ Fast performance

### For Developers
- ✅ Type-safe API
- ✅ Easy to use
- ✅ Well documented
- ✅ Scalable architecture
- ✅ Production ready

---

**Authentication system is ready to use! 🎉**

Start by creating `.env.local` and running the SQL schema.
