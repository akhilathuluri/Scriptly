# Visual Guide - What You Should See

## 🎨 Landing Page - Before Sign In

### Navigation Bar (Top Right)
```
┌─────────────────────────────────────────────────────┐
│  Markdown Pro    Features  Pricing  About           │
│                                                      │
│                    [Sign In] [Sign Up] [Launch Editor]│
└─────────────────────────────────────────────────────┘
```

**What you should see:**
- ✅ "Sign In" button (ghost style)
- ✅ "Sign Up" button (gradient purple/blue)
- ✅ "Launch Editor" button (gradient)

---

## 🔐 Sign Up Dialog

Click "Sign Up" button to see:

```
┌──────────────────────────────────────┐
│  👤 Create Account                   │
│  Sign up to start creating and       │
│  saving your documents               │
│                                      │
│  Full Name                           │
│  [👤 John Doe                    ]   │
│                                      │
│  Email                               │
│  [📧 you@example.com             ]   │
│                                      │
│  Password                            │
│  [🔒 ••••••••                    ]   │
│  Must be at least 6 characters       │
│                                      │
│  Confirm Password                    │
│  [🔒 ••••••••                    ]   │
│                                      │
│  [👤 Create Account              ]   │
│                                      │
│  Already have an account? Sign in    │
└──────────────────────────────────────┘
```

---

## 🔑 Sign In Dialog

Click "Sign In" button to see:

```
┌──────────────────────────────────────┐
│  🔓 Sign In                          │
│  Sign in to your account to access   │
│  your documents                      │
│                                      │
│  Email                               │
│  [📧 you@example.com             ]   │
│                                      │
│  Password                            │
│  [🔒 ••••••••                    ]   │
│                                      │
│  [🔓 Sign In                     ]   │
│                                      │
│  Don't have an account? Sign up      │
└──────────────────────────────────────┘
```

---

## 👤 After Sign In - User Menu

After signing in, you should see:

```
┌─────────────────────────────────────────────────────┐
│  Markdown Pro    Features  Pricing  About           │
│                                                      │
│                              [👤 JD] [Launch Editor] │
└─────────────────────────────────────────────────────┘
```

Click on the avatar (JD) to see dropdown:

```
                              ┌──────────────────────┐
                              │ John Doe             │
                              │ john@example.com     │
                              ├──────────────────────┤
                              │ 📄 My Documents      │
                              │ 👤 Profile           │
                              │ ⚙️  Settings         │
                              ├──────────────────────┤
                              │ 🚪 Sign out          │
                              └──────────────────────┘
```

---

## ⚠️ Configuration Error

If you see this at bottom-right:

```
┌────────────────────────────────────────┐
│ ⚠️ Configuration Error                 │
│                                        │
│ Missing Supabase environment           │
│ variables. Please check .env.local     │
│                                        │
│ Create a .env.local file with:         │
│ NEXT_PUBLIC_SUPABASE_URL=your_url      │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key │
└────────────────────────────────────────┘
```

**Action needed:**
1. Create `.env.local` file
2. Add Supabase credentials
3. Restart dev server

---

## ✅ Success Indicators

### 1. Sign Up Success
```
┌────────────────────────────────┐
│ ✅ Account created!            │
│ Please check your email to     │
│ verify your account.           │
└────────────────────────────────┘
```

### 2. Sign In Success
```
┌────────────────────────────────┐
│ ✅ Welcome back!               │
│ You have successfully          │
│ signed in.                     │
└────────────────────────────────┘
```

### 3. Sign Out Success
```
┌────────────────────────────────┐
│ ✅ Signed out                  │
│ You have been signed out       │
│ successfully                   │
└────────────────────────────────┘
```

---

## 🔴 Error Messages

### Invalid Credentials
```
┌────────────────────────────────┐
│ ❌ Sign in failed              │
│ Invalid email or password      │
└────────────────────────────────┘
```

### Password Mismatch
```
┌────────────────────────────────┐
│ ❌ Passwords do not match      │
│ Please make sure your          │
│ passwords match                │
└────────────────────────────────┘
```

### Password Too Short
```
┌────────────────────────────────┐
│ ❌ Password too short           │
│ Password must be at least      │
│ 6 characters                   │
└────────────────────────────────┘
```

---

## 🎯 User Flow

### New User Journey
```
Landing Page
    ↓
Click "Sign Up"
    ↓
Fill in form (name, email, password)
    ↓
Click "Create Account"
    ↓
Success message
    ↓
Check email for confirmation (if enabled)
    ↓
Redirected to /editor
    ↓
User menu appears with avatar
```

### Returning User Journey
```
Landing Page
    ↓
Click "Sign In"
    ↓
Enter email and password
    ↓
Click "Sign In"
    ↓
Success message
    ↓
Redirected to /editor
    ↓
User menu appears with avatar
```

---

## 🖥️ Browser Console

### Successful Auth
You should see:
```
✅ No errors
✅ No "Missing Supabase" warnings
✅ Auth state changes logged (if you added console.log)
```

### Configuration Issues
You might see:
```
❌ Error: Missing Supabase environment variables
❌ Failed to initialize Supabase client
❌ Cannot read properties of undefined
```

**Solution**: Check `.env.local` file and restart server

---

## 📱 Responsive Design

### Desktop (> 768px)
- Full navigation with all links
- Sign In and Sign Up buttons side by side
- User avatar in top right

### Mobile (< 768px)
- Hamburger menu (if implemented)
- Stacked buttons
- Compact user menu

---

## 🎨 Theme Support

### Light Mode
- White background
- Dark text
- Blue/purple gradients

### Dark Mode
- Dark background
- Light text
- Same gradients (adjusted opacity)

---

## 🔍 Debugging Checklist

If you don't see the auth buttons:

1. **Check browser console**
   - Look for red errors
   - Check for missing imports

2. **Verify files exist**
   - `components/auth/auth-buttons.tsx`
   - `components/auth/sign-in-dialog.tsx`
   - `components/auth/sign-up-dialog.tsx`
   - `components/auth/user-menu.tsx`

3. **Check imports**
   - Landing page imports AuthButtons
   - AuthButtons imports dialogs
   - All components use correct paths

4. **Verify environment**
   - `.env.local` exists
   - Variables are set correctly
   - Dev server was restarted

5. **Test in incognito**
   - Rules out cache issues
   - Fresh session

---

## ✨ Expected Behavior

### On Page Load
1. AuthProvider initializes
2. Checks for existing session
3. Shows loading state briefly
4. Shows Sign In/Sign Up OR User Menu

### On Sign Up
1. Form validation
2. API call to Supabase
3. Success/error message
4. Redirect to editor
5. User menu appears

### On Sign In
1. Form validation
2. API call to Supabase
3. Success/error message
4. Redirect to editor
5. User menu appears

### On Sign Out
1. Confirmation (optional)
2. Clear session
3. Success message
4. Redirect to landing
5. Sign In/Sign Up buttons appear

---

**If you see all these elements, authentication is working correctly! 🎉**
