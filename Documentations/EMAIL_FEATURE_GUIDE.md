# Email Sending Feature - Complete Guide

## 🎯 Overview

Send your markdown documents via email with beautiful HTML formatting and optional attachments. This feature integrates seamlessly with your editor's export functionality.

---

## ✨ Features

- ✅ **Beautiful HTML Emails** - Professionally formatted with custom styling
- ✅ **Multiple Attachment Formats** - Send as .md, .html, or PDF (coming soon)
- ✅ **Authentication Required** - Secure, user-only feature
- ✅ **Email History** - Track all sent emails in Supabase
- ✅ **SMTP Protocol** - Uses standard email protocols
- ✅ **Validation** - Email address and content validation
- ✅ **Error Handling** - Graceful error messages and retry support

---

## 🚀 Quick Start

### 1. Database Setup

Run the email history schema in your Supabase SQL Editor:

```bash
# File: supabase/email_history_schema.sql
```

This creates the `email_history` table to track sent emails.

### 2. Configure SMTP Settings

Add these environment variables to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
```

### 3. Gmail Setup (Recommended)

For Gmail users:

1. Enable 2-factor authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this app password as `SMTP_PASSWORD`

### 4. Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your_email@yahoo.com
```

**Custom SMTP:**
Use your provider's SMTP settings.

---

## 📧 How to Use

### Accessing the Feature

1. Open your document in the editor
2. Click the **Export** button in the toolbar
3. Select **Send via Email** from the dropdown

**Note:** You must be signed in to use this feature. If not signed in, you'll see a lock icon (🔒) and be prompted to sign in.

### Sending an Email

1. **Enter Recipient Email** - Type the recipient's email address
2. **Set Subject** - Customize the email subject (defaults to document title)
3. **Choose Attachment Format** (optional):
   - **No Attachment** - Email body only
   - **Markdown (.md)** - Raw markdown file
   - **HTML (.html)** - Formatted HTML file
   - **PDF (.pdf)** - Coming soon!
4. Click **Send Email**

### Email Content

The email includes:
- **HTML Body** - Your markdown converted to beautifully styled HTML
- **Professional Styling** - Clean, readable formatting
- **Responsive Design** - Looks great on all devices
- **Optional Attachment** - Based on your selection

---

## 🗄️ Database Schema

### email_history Table

```sql
CREATE TABLE email_history (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    document_id UUID REFERENCES documents(id),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    attachment_format TEXT,
    sent_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'sent',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Fields

- `id` - Unique identifier
- `user_id` - Who sent the email
- `document_id` - Which document was sent (if applicable)
- `recipient_email` - Recipient's email address
- `subject` - Email subject line
- `attachment_format` - 'md', 'html', 'pdf', or NULL
- `sent_at` - When the email was sent
- `status` - 'sent', 'failed', or 'pending'
- `error_message` - Error details if failed

---

## 🔒 Security Features

### Authentication
- Only signed-in users can send emails
- User ID is tracked for all sent emails
- Row Level Security (RLS) enabled

### Validation
- Email address format validation
- Subject and content required
- SMTP credentials stored securely in environment variables

### Privacy
- Users can only view their own email history
- Recipient emails are stored for verification only
- No email content is stored (only metadata)

---

## 📊 Email History

View your email sending history in Supabase:

1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → **email_history**
3. Filter by your `user_id` to see your sent emails

### Query Your History

```sql
SELECT 
    recipient_email,
    subject,
    attachment_format,
    sent_at,
    status
FROM email_history
WHERE user_id = auth.uid()
ORDER BY sent_at DESC
LIMIT 50;
```

---

## 🎨 Email Styling

The HTML emails include:

### Visual Features
- Clean, modern design
- Responsive layout
- Professional typography
- Syntax-highlighted code blocks
- Styled tables and lists
- Blockquote formatting
- Image support

### Branding
- "Sent from Markdown Editor" footer
- Customizable styles (future enhancement)
- Professional color scheme

---

## 🛠️ Technical Details

### Architecture

```
User Action → SendEmailDialog → API Route → Nodemailer → SMTP Server → Recipient
                                    ↓
                              Email History (Supabase)
```

### Files Structure

```
components/
  └── send-email-dialog.tsx      # Email dialog UI
  └── editor-toolbar.tsx         # Updated with email option

lib/
  └── email.ts                   # Email utilities

app/
  └── api/
      └── send-email/
          └── route.ts           # Email sending API

supabase/
  └── email_history_schema.sql   # Database schema
```

### API Endpoint

**POST** `/api/send-email`

**Request Body:**
```json
{
  "recipientEmail": "user@example.com",
  "subject": "My Document",
  "content": "# Markdown content...",
  "attachmentFormat": "html",
  "documentId": "uuid",
  "documentTitle": "My Document"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

## 🐛 Troubleshooting

### "Failed to send email"

**Possible Causes:**
- Invalid SMTP credentials
- Incorrect SMTP host/port
- Firewall blocking SMTP
- Gmail app password not generated

**Solutions:**
1. Verify `.env.local` settings
2. Check SMTP credentials
3. Ensure 2FA is enabled (Gmail)
4. Generate new app password
5. Check server logs for details

### "Invalid email address"

**Solution:**
- Ensure email format is correct (user@domain.com)
- No spaces or special characters
- Valid domain extension

### "Please sign in to send emails"

**Solution:**
- Sign in to your account
- Refresh the page
- Check authentication status

### Email not received

**Possible Causes:**
- Email in spam folder
- Invalid recipient address
- SMTP server issues

**Solutions:**
1. Check spam/junk folder
2. Verify recipient email
3. Check email history in Supabase
4. Review server logs

### "PDF attachments not supported"

**Note:** PDF attachments via email are not yet implemented. Use .md or .html format instead. You can still export PDFs directly using the "Enhanced Export" option.

---

## 📈 Future Enhancements

### Planned Features
- [ ] PDF attachment support via server-side rendering
- [ ] Email templates
- [ ] Batch email sending
- [ ] Email scheduling
- [ ] Custom branding options
- [ ] Email analytics
- [ ] Attachment size limits
- [ ] Rich text editor for email body
- [ ] CC/BCC support
- [ ] Email preview before sending

---

## 💡 Best Practices

### Do's
✅ Use descriptive subject lines
✅ Test with your own email first
✅ Keep documents reasonably sized
✅ Use appropriate attachment formats
✅ Check email history for verification
✅ Verify recipient email addresses

### Don'ts
❌ Don't send spam or unsolicited emails
❌ Don't share SMTP credentials
❌ Don't send very large documents (>5MB)
❌ Don't use for bulk email campaigns
❌ Don't store sensitive data in emails

---

## 🔐 Environment Variables Reference

```env
# Required for email feature
SMTP_HOST=smtp.gmail.com          # SMTP server hostname
SMTP_PORT=587                     # SMTP port (587 for TLS)
SMTP_SECURE=false                 # true for 465, false for 587
SMTP_USER=your_email@gmail.com    # Your email address
SMTP_PASSWORD=your_app_password   # App password (not regular password)
SMTP_FROM=your_email@gmail.com    # From address (usually same as SMTP_USER)
```

---

## 📚 Related Documentation

- `SUPABASE_SETUP_GUIDE.md` - Database setup
- `AUTH_IMPLEMENTATION_SUMMARY.md` - Authentication system
- `IMPLEMENTATION_SUMMARY.md` - Overall features
- `TROUBLESHOOTING.md` - General troubleshooting

---

## 🎉 Success!

Your email sending feature is now ready to use! 

**Test it out:**
1. Sign in to your account
2. Create or open a document
3. Click Export → Send via Email
4. Send a test email to yourself

---

**Happy Emailing! 📧**
