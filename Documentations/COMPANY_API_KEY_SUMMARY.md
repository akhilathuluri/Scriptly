# Company API Key - Quick Setup

## 🚀 Quick Start

### 1. Get Your API Key
Visit: https://makersuite.google.com/app/apikey

### 2. Add to `.env.local`
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Done! ✅
All users can now use AI features without their own API key.

---

## What Changed

### Code Updates

**`lib/ai-assistant.ts`**
- Added `getCompanyAPIKey()` - Gets key from environment
- Added `hasCompanyKey()` - Checks if company key exists
- Updated `initializeAIAssistant()` - Defaults to company key
- Updated `getUseCompanyKey()` - Returns true by default if company key exists

**`app/settings/page.tsx`**
- Shows green highlighted "Use Company API Key" option when available
- Marked as "Recommended" 
- Shows info message when no company key is available
- Imports `hasCompanyKey()` helper

**`.env.example`**
- Added documentation for `NEXT_PUBLIC_GEMINI_API_KEY`
- Includes setup instructions

---

## User Experience

### With Company Key (Recommended)
✅ Sign in → AI features work immediately  
✅ No configuration needed  
✅ Free for all users  
✅ Can still use personal key if preferred  

### Without Company Key
⚠️ Users must provide their own API key  
⚠️ Extra setup step required  
⚠️ Users pay for their own usage  

---

## Settings UI

### When Company Key Exists
```
┌─────────────────────────────────────────┐
│ ✓ AI Assistant is configured and ready │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Use Company API Key    [Recommended] ✓  │
│ Free for all users, no setup needed     │
└─────────────────────────────────────────┘
```

### When No Company Key
```
┌─────────────────────────────────────────┐
│ ⚠ AI Assistant requires configuration   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⓘ No Company API Key Available          │
│ Please provide your own API key         │
└─────────────────────────────────────────┘

Your Google Gemini API Key
[Enter your API key...]
```

---

## Testing Checklist

- [ ] Add `NEXT_PUBLIC_GEMINI_API_KEY` to `.env.local`
- [ ] Restart development server
- [ ] Sign in to the app
- [ ] Go to Settings → AI Settings
- [ ] Verify "Use Company API Key" option shows (green, recommended)
- [ ] Verify it's enabled by default
- [ ] Test AI Assistant (select text, click AI button)
- [ ] Test Auto-Complete (type in editor)
- [ ] Test Document Chat (click chat button)
- [ ] All features should work without user configuration

---

## Production Deployment

Add environment variable to your hosting platform:

**Vercel**: Settings → Environment Variables  
**Netlify**: Site settings → Environment variables  
**Docker**: Add to `docker-compose.yml` or `.env`  

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_production_key
```

---

## Security Notes

✅ Company key stored in environment (secure)  
✅ User keys stored in localStorage (client-only)  
✅ Neither sent to your backend  
⚠️ Never commit `.env.local` to git  
⚠️ Rotate keys every 3-6 months  
⚠️ Monitor usage in Google Cloud Console  

---

## Support

**Key not working?**
1. Check variable name: `NEXT_PUBLIC_GEMINI_API_KEY`
2. Restart dev server after adding
3. Check browser console for errors
4. Verify key is valid in Google AI Studio

**Users can't access AI?**
1. Ensure they're signed in (required)
2. Check Settings → AI Settings status
3. Try toggling company key on/off
4. Clear browser cache

---

## Files Created/Modified

✅ `lib/ai-assistant.ts` - Company key logic  
✅ `app/settings/page.tsx` - UI updates  
✅ `.env.example` - Documentation  
✅ `COMPANY_API_KEY_SETUP.md` - Full guide  
✅ `COMPANY_API_KEY_SUMMARY.md` - This file  

---

**Ready to go!** 🎉

Just add your API key to `.env.local` and restart the server.
