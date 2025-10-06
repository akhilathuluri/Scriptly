# Email Feature - Installation Guide

## 📦 Dependencies

The email feature uses the following packages (already included in package.json):

- `nodemailer` (v7.0.6) - Email sending
- `marked` (v16.3.0) - Markdown to HTML conversion

### Optional: Install TypeScript Types

For better TypeScript support, you can install nodemailer types:

```bash
npm install --save-dev @types/nodemailer
```

---

## 🗂️ Files Added

### New Files Created:

1. **components/send-email-dialog.tsx**
   - Email sending dialog UI component
   - Form validation and user input
   - Status messages and error handling

2. **lib/email.ts**
   - Email utility functions
   - Markdown to HTML conversion
   - Email history management
   - Email validation

3. **app/api/send-email/route.ts**
   - API endpoint for sending emails
   - SMTP configuration
   - Attachment handling
   - Error handling

4. **supabase/email_history_schema.sql**
   - Database schema for email history
   - Row Level Security policies
   - Indexes for performance

### Modified Files:

1. **components/editor-toolbar.tsx**
   - Added "Send via Email" option to Export dropdown
   - Authentication check for email feature
   - Import SendEmailDialog component

2. **components/editor.tsx**
   - Added documentId prop support
   - Pass documentId to toolbar

3. **.env.example**
   - Added SMTP configuration examples
   - Gmail setup instructions

---

## 🔧 Setup Steps

### 1. Database Setup

Run the SQL schema in Supabase:

```bash
# File location: supabase/email_history_schema.sql
```

Or copy from `EMAIL_SETUP_QUICK_START.md`

### 2. Environment Variables

Add to your `.env.local`:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
```

### 3. Install Dependencies (if needed)

If you're setting up a fresh project:

```bash
npm install nodemailer marked
npm install --save-dev @types/nodemailer
```

### 4. Restart Development Server

```bash
npm run dev
```

---

## 🏗️ Architecture

### Component Hierarchy

```
Editor
  └── EditorToolbar
        └── Export Dropdown
              └── SendEmailDialog (new)
```

### Data Flow

```
User Input → SendEmailDialog
              ↓
         Validation
              ↓
         API Call (/api/send-email)
              ↓
         Nodemailer → SMTP Server
              ↓
         Save to email_history (Supabase)
              ↓
         Success/Error Response
              ↓
         User Notification (Toast)
```

### Authentication Flow

```
User clicks "Send via Email"
              ↓
         Check if user is signed in
              ↓
    Yes: Open dialog    No: Show "Sign in required" toast
              ↓
         User fills form
              ↓
         Submit → API validates user session
              ↓
         Send email + Save history
```

---

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use `.env.example` for documentation only
- Store SMTP credentials securely

### Authentication
- Email feature requires user authentication
- User ID is validated on both client and server
- Row Level Security prevents unauthorized access

### Email Validation
- Client-side validation for email format
- Server-side validation for all inputs
- Sanitization of user inputs

### Rate Limiting (Recommended)
Consider adding rate limiting to prevent abuse:

```typescript
// Example: Limit to 10 emails per hour per user
// Implement in app/api/send-email/route.ts
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Send email without attachment
- [ ] Send email with .md attachment
- [ ] Send email with .html attachment
- [ ] Test with invalid email address
- [ ] Test without signing in
- [ ] Test with empty subject
- [ ] Test with empty content
- [ ] Verify email history in Supabase
- [ ] Check email received in inbox
- [ ] Test email formatting (HTML rendering)

### Test Email Template

```markdown
# Test Email

This is a **test email** from the markdown editor.

## Features to Test
- Bold and *italic* text
- Lists and bullets
- Code blocks
- Links and images

> This is a blockquote

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
```

---

## 📊 Monitoring

### Check Email History

Query Supabase to monitor sent emails:

```sql
SELECT 
    recipient_email,
    subject,
    status,
    sent_at,
    error_message
FROM email_history
WHERE user_id = auth.uid()
ORDER BY sent_at DESC;
```

### Failed Emails

Find failed email attempts:

```sql
SELECT *
FROM email_history
WHERE status = 'failed'
ORDER BY sent_at DESC;
```

### Email Statistics

```sql
SELECT 
    COUNT(*) as total_emails,
    COUNT(*) FILTER (WHERE status = 'sent') as successful,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    COUNT(*) FILTER (WHERE attachment_format IS NOT NULL) as with_attachments
FROM email_history
WHERE user_id = auth.uid();
```

---

## 🚀 Production Deployment

### Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_production_email@gmail.com
SMTP_PASSWORD=your_production_app_password
SMTP_FROM=noreply@yourdomain.com
```

### Recommendations

1. **Use a dedicated email service**
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Set up SPF/DKIM records**
   - Improves email deliverability
   - Reduces spam classification

3. **Monitor email sending**
   - Set up alerts for failed emails
   - Track delivery rates
   - Monitor bounce rates

4. **Add rate limiting**
   - Prevent abuse
   - Protect SMTP quota
   - Implement per-user limits

5. **Consider email queue**
   - For high-volume sending
   - Better error handling
   - Retry failed emails

---

## 🔄 Upgrade Path

### Current Implementation
- Direct SMTP sending via Nodemailer
- Synchronous email sending
- Basic error handling

### Future Enhancements
- [ ] Email queue system (Bull, BullMQ)
- [ ] Background job processing
- [ ] Email templates system
- [ ] Transactional email service integration
- [ ] Email analytics and tracking
- [ ] Retry mechanism for failed emails
- [ ] Email scheduling
- [ ] Batch email sending

---

## 📝 Code Examples

### Send Email Programmatically

```typescript
import { sendEmail } from '@/lib/email';

const result = await sendEmail({
  recipientEmail: 'user@example.com',
  subject: 'Your Document',
  content: '# Hello\n\nThis is your document.',
  attachmentFormat: 'html',
  documentId: 'uuid-here',
  documentTitle: 'My Document'
});

if (result.success) {
  console.log('Email sent!');
} else {
  console.error('Failed:', result.error);
}
```

### Query Email History

```typescript
import { getEmailHistory } from '@/lib/email';

const history = await getEmailHistory(userId);
console.log(`Sent ${history.length} emails`);
```

### Validate Email

```typescript
import { isValidEmail } from '@/lib/email';

if (isValidEmail('user@example.com')) {
  // Valid email
}
```

---

## 🆘 Support

### Common Issues

See `EMAIL_FEATURE_GUIDE.md` → Troubleshooting section

### Getting Help

1. Check documentation files
2. Review Supabase logs
3. Check server console logs
4. Verify SMTP credentials
5. Test with a simple email first

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Database table `email_history` exists
- [ ] RLS policies are enabled
- [ ] SMTP credentials in `.env.local`
- [ ] Dev server restarted
- [ ] "Send via Email" appears in Export menu
- [ ] Authentication check works (shows lock icon when not signed in)
- [ ] Test email sends successfully
- [ ] Email appears in inbox
- [ ] Email history saved in Supabase
- [ ] Error handling works (try invalid email)

---

## 📚 Related Files

- `EMAIL_FEATURE_GUIDE.md` - Complete feature documentation
- `EMAIL_SETUP_QUICK_START.md` - 5-minute setup guide
- `supabase/email_history_schema.sql` - Database schema
- `.env.example` - Environment variable examples

---

**Installation Complete! 🎉**

Your email sending feature is now ready to use.
