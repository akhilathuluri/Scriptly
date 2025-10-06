# Email Feature - Visual Architecture

## 🎨 User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                             │
└─────────────────────────────────────────────────────────────┘

1. User writes document in editor
                ↓
2. Clicks "Export" button in toolbar
                ↓
3. Selects "Send via Email" from dropdown
                ↓
4. Is user signed in?
        ↓                    ↓
      YES                   NO
        ↓                    ↓
   Open dialog      Show "Sign in required"
        ↓                    ↓
5. Fill form:           User signs in
   - Email address           ↓
   - Subject            Return to step 3
   - Attachment format
        ↓
6. Click "Send Email"
        ↓
7. Validation
        ↓
8. Send email via API
        ↓
9. Save to email_history
        ↓
10. Show success message
        ↓
11. Email delivered to recipient
```

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐         ┌──────────────────┐           │
│  │  Editor.tsx    │────────▶│ EditorToolbar    │           │
│  │  (Document)    │         │  (Export Menu)   │           │
│  └────────────────┘         └────────┬─────────┘           │
│                                      │                      │
│                                      ▼                      │
│                          ┌──────────────────────┐          │
│                          │ SendEmailDialog.tsx  │          │
│                          │  - Form UI           │          │
│                          │  - Validation        │          │
│                          │  - State Management  │          │
│                          └──────────┬───────────┘          │
│                                     │                      │
└─────────────────────────────────────┼──────────────────────┘
                                      │
                                      │ HTTP POST
                                      │
┌─────────────────────────────────────▼──────────────────────┐
│                     BACKEND (Next.js API)                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────┐        │
│  │  /api/send-email/route.ts                      │        │
│  │  ┌──────────────────────────────────────────┐  │        │
│  │  │ 1. Validate request                      │  │        │
│  │  │ 2. Check authentication                  │  │        │
│  │  │ 3. Convert markdown to HTML              │  │        │
│  │  │ 4. Prepare attachments                   │  │        │
│  │  │ 5. Send via Nodemailer                   │  │        │
│  │  └──────────────────────────────────────────┘  │        │
│  └────────────────┬───────────────────┬───────────┘        │
│                   │                   │                    │
└───────────────────┼───────────────────┼────────────────────┘
                    │                   │
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   SMTP Server    │  │    Supabase      │
        │   (Gmail, etc)   │  │  email_history   │
        └────────┬─────────┘  └──────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │    Recipient     │
        │   Email Inbox    │
        └──────────────────┘
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                │
└─────────────────────────────────────────────────────────────┘

User Input
    │
    ├─ recipientEmail: string
    ├─ subject: string
    ├─ content: string (markdown)
    ├─ attachmentFormat: 'md' | 'html' | 'pdf' | null
    ├─ documentId: string (optional)
    └─ documentTitle: string
            ↓
    ┌───────────────┐
    │  Validation   │
    └───────┬───────┘
            ↓
    ┌───────────────┐
    │  API Request  │
    └───────┬───────┘
            ↓
    ┌───────────────────────┐
    │  Markdown → HTML      │
    │  (lib/email.ts)       │
    └───────┬───────────────┘
            ↓
    ┌───────────────────────┐
    │  Generate Attachment  │
    │  (if requested)       │
    └───────┬───────────────┘
            ↓
    ┌───────────────────────┐
    │  Nodemailer           │
    │  - SMTP Config        │
    │  - Email Body (HTML)  │
    │  - Attachments        │
    └───────┬───────────────┘
            ↓
    ┌───────────────────────┐
    │  SMTP Server          │
    │  (Send Email)         │
    └───────┬───────────────┘
            │
            ├──────────────────────┐
            ↓                      ↓
    ┌───────────────┐      ┌──────────────┐
    │  Recipient    │      │  Save to DB  │
    │  Inbox        │      │  (Supabase)  │
    └───────────────┘      └──────────────┘
```

---

## 🗄️ Database Schema Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    email_history                             │
├──────────────────────────────────────────────────────────────┤
│  id                  UUID (PK)                               │
│  user_id             UUID (FK → auth.users)                  │
│  document_id         UUID (FK → documents) [nullable]        │
│  recipient_email     TEXT                                    │
│  subject             TEXT                                    │
│  attachment_format   TEXT [nullable]                         │
│  sent_at             TIMESTAMP                               │
│  status              TEXT ('sent', 'failed', 'pending')      │
│  error_message       TEXT [nullable]                         │
│  created_at          TIMESTAMP                               │
└──────────────────────────────────────────────────────────────┘
         │                        │
         │ (FK)                   │ (FK)
         ↓                        ↓
┌─────────────────┐      ┌─────────────────┐
│  auth.users     │      │   documents     │
├─────────────────┤      ├─────────────────┤
│  id (PK)        │      │  id (PK)        │
│  email          │      │  title          │
│  ...            │      │  content        │
└─────────────────┘      │  ...            │
                         └─────────────────┘

Indexes:
  - idx_email_history_user_id (user_id)
  - idx_email_history_sent_at (sent_at DESC)
  - idx_email_history_document_id (document_id)

RLS Policies:
  ✓ Users can view their own email history
  ✓ Users can create their own email history
```

---

## 🎯 Component Structure

```
components/
│
├── editor.tsx
│   └── Props: { content, onChange, title, documentId }
│       └── Renders: EditorToolbar
│
├── editor-toolbar.tsx
│   └── Props: { content, title, documentId, ... }
│       └── Renders: Export Dropdown
│           └── Contains: SendEmailDialog
│
└── send-email-dialog.tsx
    └── Props: { content, title, documentId, children }
        └── State:
            ├── recipientEmail
            ├── subject
            ├── attachmentFormat
            ├── isSending
            └── sendStatus
        └── Functions:
            ├── handleEmailChange()
            ├── validateForm()
            ├── handleSendEmail()
            └── saveEmailHistory()
```

---

## 🔐 Security Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└──────────────────────────────────────────────────────────────┘

Layer 1: Client-Side Authentication
    ↓
    Check if user is signed in (useAuth hook)
    ↓
    If not signed in → Show "Sign in required" message
    ↓
    If signed in → Allow access to dialog

Layer 2: Client-Side Validation
    ↓
    Validate email format (regex)
    ↓
    Validate required fields
    ↓
    Sanitize inputs

Layer 3: API Authentication
    ↓
    Verify user session
    ↓
    Extract user ID from session
    ↓
    If invalid → Return 401 Unauthorized

Layer 4: API Validation
    ↓
    Validate all inputs again
    ↓
    Check email format
    ↓
    Verify content exists

Layer 5: Database Security (RLS)
    ↓
    Row Level Security policies
    ↓
    User can only insert their own records
    ↓
    User can only view their own records

Layer 6: SMTP Security
    ↓
    Credentials stored in environment variables
    ↓
    TLS encryption for SMTP connection
    ↓
    No credentials exposed to client
```

---

## 📧 Email Generation Process

```
┌──────────────────────────────────────────────────────────────┐
│              EMAIL GENERATION PIPELINE                       │
└──────────────────────────────────────────────────────────────┘

Markdown Content
    ↓
┌─────────────────────┐
│  Parse Markdown     │
│  (marked library)   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Convert to HTML    │
│  (markdownToHTML)   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Apply CSS Styles   │
│  - Typography       │
│  - Colors           │
│  - Layout           │
│  - Responsive       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Add Metadata       │
│  - Title            │
│  - Timestamp        │
│  - Footer           │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Generate           │
│  Attachment         │
│  (if requested)     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Compose Email      │
│  - To: recipient    │
│  - Subject: title   │
│  - Body: HTML       │
│  - Attachments      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Send via SMTP      │
└─────────────────────┘
```

---

## 🎨 UI State Machine

```
┌──────────────────────────────────────────────────────────────┐
│                    DIALOG STATES                             │
└──────────────────────────────────────────────────────────────┘

        ┌─────────┐
        │  IDLE   │ ◄──────────────────┐
        └────┬────┘                    │
             │                         │
             │ User clicks "Send"      │
             ↓                         │
        ┌─────────┐                    │
        │VALIDATING│                   │
        └────┬────┘                    │
             │                         │
    ┌────────┴────────┐               │
    │                 │               │
    ↓                 ↓               │
┌─────────┐      ┌─────────┐         │
│ INVALID │      │  VALID  │         │
└────┬────┘      └────┬────┘         │
     │                │               │
     │                ↓               │
     │           ┌─────────┐          │
     │           │SENDING  │          │
     │           └────┬────┘          │
     │                │               │
     │        ┌───────┴───────┐       │
     │        │               │       │
     │        ↓               ↓       │
     │   ┌─────────┐     ┌─────────┐ │
     │   │ SUCCESS │     │  ERROR  │ │
     │   └────┬────┘     └────┬────┘ │
     │        │               │       │
     │        └───────┬───────┘       │
     │                │               │
     └────────────────┴───────────────┘
                      │
                      ↓
                 Close Dialog
```

---

## 📊 Monitoring Dashboard (Conceptual)

```
┌──────────────────────────────────────────────────────────────┐
│                EMAIL ANALYTICS DASHBOARD                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Total Emails Sent: 1,234                                   │
│  Success Rate: 98.5%                                         │
│  Failed: 18                                                  │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  Emails Over Time                              │         │
│  │  ▁▂▃▅▇█▇▅▃▂▁                                   │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Attachment Formats:                                         │
│  ├─ No Attachment: 45%                                      │
│  ├─ Markdown (.md): 30%                                     │
│  └─ HTML (.html): 25%                                       │
│                                                              │
│  Recent Emails:                                              │
│  ├─ user@example.com - "Project Update" - 2 min ago        │
│  ├─ team@company.com - "Weekly Report" - 1 hour ago        │
│  └─ client@domain.com - "Proposal" - 3 hours ago           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Error Handling Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                            │
└──────────────────────────────────────────────────────────────┘

Try to send email
    │
    ├─ Success
    │   ├─ Save to database (status: 'sent')
    │   ├─ Show success toast
    │   └─ Close dialog
    │
    └─ Error
        │
        ├─ Network Error
        │   ├─ Show "Connection failed" message
        │   ├─ Save to database (status: 'failed')
        │   └─ Keep dialog open for retry
        │
        ├─ SMTP Error
        │   ├─ Show "Email server error" message
        │   ├─ Save to database (status: 'failed')
        │   └─ Log error details
        │
        ├─ Validation Error
        │   ├─ Show specific field error
        │   ├─ Highlight invalid field
        │   └─ Keep dialog open
        │
        └─ Authentication Error
            ├─ Show "Please sign in" message
            ├─ Close dialog
            └─ Redirect to sign in
```

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  PRODUCTION SETUP                            │
└──────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   Vercel/       │
│   Netlify       │
│   (Frontend +   │
│    API Routes)  │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ↓                  ↓
┌─────────────────┐  ┌─────────────────┐
│   Supabase      │  │  SMTP Service   │
│   (Database)    │  │  (Gmail/SES)    │
│                 │  │                 │
│  - email_history│  │  - Send emails  │
│  - auth.users   │  │  - Track        │
│  - documents    │  │    delivery     │
└─────────────────┘  └─────────────────┘

Environment Variables (Vercel/Netlify):
  ├─ NEXT_PUBLIC_SUPABASE_URL
  ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY
  ├─ SMTP_HOST
  ├─ SMTP_PORT
  ├─ SMTP_USER
  ├─ SMTP_PASSWORD
  └─ SMTP_FROM
```

---

**Visual Guide Complete! 📊**

These diagrams help understand the email feature's architecture, data flow, and user experience.
