# 📧 Email Feature - Quick Reference

> Send your markdown documents via email with beautiful HTML formatting

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Add Database Table
```sql
-- Run in Supabase SQL Editor
-- Copy from: supabase/email_history_schema.sql
```

### 2️⃣ Configure SMTP
```env
# Add to .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
```

### 3️⃣ Restart Server
```bash
npm run dev
```

### 4️⃣ Test It!
1. Sign in to your account
2. Open any document
3. Click **Export** → **Send via Email**
4. Enter your email and click **Send**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📧 **Email Sending** | Send documents via SMTP |
| 🎨 **HTML Formatting** | Beautiful, professional styling |
| 📎 **Attachments** | .md, .html formats supported |
| 🔒 **Secure** | Authentication required |
| 📊 **History** | Track all sent emails |
| ✅ **Validation** | Email and content validation |

---

## 🎯 How to Use

### Access the Feature
```
Editor → Export Button → Send via Email
```

### Send an Email
1. **Enter recipient email** - Who receives the document
2. **Set subject** - Email subject line (defaults to document title)
3. **Choose attachment** (optional):
   - No Attachment (email body only)
   - Markdown (.md)
   - HTML (.html)
4. **Click Send Email**

### Requirements
- ✅ Must be signed in
- ✅ Valid email address
- ✅ Document content exists

---

## 📁 Files Overview

```
components/
  └── send-email-dialog.tsx       # Email dialog UI

lib/
  └── email.ts                    # Email utilities

app/api/
  └── send-email/route.ts         # API endpoint

supabase/
  └── email_history_schema.sql    # Database schema
```

---

## 🗄️ Database

### email_history Table
Tracks all sent emails with:
- Recipient email
- Subject
- Attachment format
- Send status
- Timestamp
- Error messages (if failed)

### Query Your History
```sql
SELECT * FROM email_history 
WHERE user_id = auth.uid() 
ORDER BY sent_at DESC;
```

---

## 🔧 Configuration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication
2. Generate app password at [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use app password in `.env.local`

### Other Providers
- **Outlook:** `smtp-mail.outlook.com:587`
- **Yahoo:** `smtp.mail.yahoo.com:587`
- **Custom:** Use your provider's SMTP settings

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check SMTP credentials in `.env.local` |
| "Sign in required" | Sign in to your account first |
| Invalid email | Verify email format is correct |
| Email in spam | Check spam folder, mark as not spam |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `EMAIL_SETUP_QUICK_START.md` | 5-minute setup guide |
| `EMAIL_FEATURE_GUIDE.md` | Complete feature documentation |
| `EMAIL_INSTALLATION.md` | Technical installation guide |
| `EMAIL_FEATURE_DIAGRAM.md` | Visual architecture diagrams |
| `EMAIL_FEATURE_SUMMARY.md` | Implementation summary |

---

## 🔐 Security

- ✅ Authentication required
- ✅ Email validation
- ✅ Row Level Security (RLS)
- ✅ SMTP credentials in environment variables
- ✅ User isolation (can only see own history)

---

## 🎨 Email Preview

Your emails will include:
- Professional HTML styling
- Responsive design
- Syntax-highlighted code
- Styled tables and lists
- "Sent from Markdown Editor" footer

---

## 📊 Email History

View sent emails in Supabase:
1. Go to Supabase Dashboard
2. **Table Editor** → **email_history**
3. Filter by your user ID

---

## 🚀 Production Deployment

Set environment variables in your hosting platform:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=production@yourdomain.com
SMTP_PASSWORD=production_app_password
SMTP_FROM=noreply@yourdomain.com
```

---

## 💡 Tips

✅ **Do:**
- Test with your own email first
- Use descriptive subject lines
- Keep documents reasonably sized
- Check email history for verification

❌ **Don't:**
- Send spam or unsolicited emails
- Share SMTP credentials
- Send very large documents (>5MB)
- Use for bulk email campaigns

---

## 🎯 Status

✅ **Fully Implemented**
- Email sending via SMTP
- HTML formatting
- Attachments (.md, .html)
- Email history tracking
- Authentication protection
- Error handling

🚧 **Coming Soon**
- PDF attachments
- Email templates
- CC/BCC support
- Email scheduling

---

## 🆘 Need Help?

1. Check `EMAIL_SETUP_QUICK_START.md` for setup
2. Read `EMAIL_FEATURE_GUIDE.md` for details
3. Review `EMAIL_INSTALLATION.md` for technical info
4. Check Supabase logs for errors
5. Verify SMTP credentials

---

## ✨ Example Usage

```typescript
// Programmatic usage
import { sendEmail } from '@/lib/email';

await sendEmail({
  recipientEmail: 'user@example.com',
  subject: 'My Document',
  content: '# Hello\n\nThis is my document.',
  attachmentFormat: 'html',
  documentTitle: 'My Document'
});
```

---

## 📈 Future Enhancements

- [ ] PDF attachment support
- [ ] Email templates
- [ ] Batch sending
- [ ] Email analytics
- [ ] Custom branding
- [ ] Rate limiting
- [ ] Email queue system

---

## 🎉 Ready to Use!

The email feature is fully functional and ready to use. Follow the Quick Start guide above to get started in 5 minutes.

**Happy Emailing! 📧**

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2025-10-05
