# 📧 Email Feature - Quick Reference Card

> One-page reference for the email sending feature

---

## 🚀 Quick Start (3 Steps)

### 1. Database
```sql
-- Run in Supabase SQL Editor
-- File: supabase/email_history_schema.sql
```

### 2. Environment
```env
# Add to .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
```

### 3. Restart
```bash
npm run dev
```

---

## 📍 How to Access

```
Editor → Export Button → Send via Email
```

**Requirements:** Must be signed in ✅

---

## 📝 Form Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Recipient Email** | ✅ Yes | Who receives the email |
| **Subject** | ✅ Yes | Email subject line |
| **Attachment** | ❌ No | .md, .html, or none |

---

## 📎 Attachment Options

- **No Attachment** - Email body only
- **Markdown (.md)** - Raw markdown file
- **HTML (.html)** - Formatted HTML file
- **PDF (.pdf)** - Coming soon (disabled)

---

## ✅ What Gets Sent

1. **Email Body** - Beautiful HTML formatted content
2. **Attachment** - Optional file in chosen format
3. **Footer** - "Sent from Markdown Editor"

---

## 🗄️ Email History

View in Supabase:
```
Dashboard → Table Editor → email_history
```

Query your emails:
```sql
SELECT * FROM email_history 
WHERE user_id = auth.uid() 
ORDER BY sent_at DESC;
```

---

## 🔐 Security

- ✅ Authentication required
- ✅ Email validation
- ✅ RLS policies enabled
- ✅ Secure SMTP credentials

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Email not sending | Check SMTP credentials |
| "Sign in required" | Sign in first |
| Invalid email | Check email format |
| Email in spam | Check spam folder |

---

## 📚 Documentation

| Need | Document |
|------|----------|
| **Setup** | `EMAIL_SETUP_QUICK_START.md` |
| **Guide** | `EMAIL_FEATURE_GUIDE.md` |
| **Technical** | `EMAIL_INSTALLATION.md` |
| **All Docs** | `EMAIL_DOCS_INDEX.md` |

---

## 🎯 Key Features

✅ Send documents via email  
✅ Beautiful HTML formatting  
✅ Optional attachments  
✅ Email history tracking  
✅ Secure & authenticated  
✅ Error handling  

---

## 📊 Files Created

### Code (5 files)
- `components/send-email-dialog.tsx`
- `lib/email.ts`
- `app/api/send-email/route.ts`
- `supabase/email_history_schema.sql`
- Modified: `editor-toolbar.tsx`, `editor.tsx`

### Docs (10 files)
- `README_EMAIL.md`
- `EMAIL_SETUP_QUICK_START.md`
- `EMAIL_FEATURE_GUIDE.md`
- `EMAIL_INSTALLATION.md`
- `EMAIL_FEATURE_SUMMARY.md`
- `EMAIL_FEATURE_DIAGRAM.md`
- `EMAIL_IMPLEMENTATION_CHECKLIST.md`
- `EMAIL_DOCS_INDEX.md`
- `INSTALL_EMAIL_FEATURE.md`
- `EMAIL_FEATURE_COMPLETE.md`

---

## ⚡ Common Tasks

### Send Email
1. Open document
2. Click Export → Send via Email
3. Fill form
4. Click Send

### Check History
1. Open Supabase
2. Go to email_history table
3. View your sent emails

### Test Feature
1. Send email to yourself
2. Check inbox
3. Verify formatting

---

## 🔧 SMTP Providers

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```
[Get App Password](https://myaccount.google.com/apppasswords)

### Outlook
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

---

## 📈 Status

**Implementation:** ✅ Complete  
**Testing:** ✅ Verified  
**Documentation:** ✅ Comprehensive  
**Production:** ✅ Ready  

---

## 💡 Pro Tips

1. **Test first** - Send to yourself before others
2. **Check spam** - First emails might go to spam
3. **Use attachments** - Share formatted versions
4. **Track history** - Monitor sent emails in Supabase
5. **Secure credentials** - Never commit .env.local

---

## 🎉 Quick Win

```bash
# 1. Add SMTP to .env.local
# 2. Run SQL in Supabase
# 3. Restart server
# 4. Send test email
# 5. Done! ✅
```

**Total Time:** 5 minutes

---

## 📞 Need Help?

**Quick Setup:** `EMAIL_SETUP_QUICK_START.md`  
**Full Guide:** `EMAIL_FEATURE_GUIDE.md`  
**All Docs:** `EMAIL_DOCS_INDEX.md`

---

**Print this page for quick reference! 📄**
