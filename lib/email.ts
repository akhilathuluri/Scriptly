import { marked } from 'marked';
import { supabase } from './supabase';

export interface EmailOptions {
  recipientEmail: string;
  subject: string;
  content: string;
  attachmentFormat?: 'md' | 'html' | 'pdf' | null;
  documentId?: string;
  documentTitle?: string;
}

export interface EmailHistoryRecord {
  id: string;
  user_id: string;
  document_id: string | null;
  recipient_email: string;
  subject: string;
  attachment_format: string | null;
  sent_at: string;
  status: string;
  error_message: string | null;
}

/**
 * Convert markdown to HTML with styling
 */
export function markdownToHTML(markdown: string, title: string = 'Document'): string {
  const htmlContent = marked(markdown);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1, h2, h3, h4, h5, h6 {
            color: #1f2937;
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
        }
        h1 { font-size: 2em; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
        h3 { font-size: 1.25em; }
        p { margin-bottom: 16px; }
        a { color: #3b82f6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code {
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
        }
        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #3b82f6;
            margin: 16px 0;
            padding-left: 16px;
            color: #6b7280;
            font-style: italic;
        }
        ul, ol {
            margin-bottom: 16px;
            padding-left: 24px;
        }
        li { margin-bottom: 8px; }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: 600;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.875em;
        }
    </style>
</head>
<body>
    <div class="container">
        ${htmlContent}
        <div class="footer">
            <p>Sent from Markdown Editor</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Send email via API
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Save email history to database
 */
export async function saveEmailHistory(
  userId: string,
  recipientEmail: string,
  subject: string,
  attachmentFormat: string | null,
  documentId: string | null,
  status: 'sent' | 'failed' | 'pending',
  errorMessage: string | null = null
): Promise<void> {
  try {
    const { error } = await supabase.from('email_history').insert({
      user_id: userId,
      document_id: documentId,
      recipient_email: recipientEmail,
      subject: subject,
      attachment_format: attachmentFormat,
      status: status,
      error_message: errorMessage,
    });

    if (error) {
      console.error('Failed to save email history:', error);
    }
  } catch (error) {
    console.error('Error saving email history:', error);
  }
}

/**
 * Get email history for current user
 */
export async function getEmailHistory(userId: string): Promise<EmailHistoryRecord[]> {
  try {
    const { data, error } = await supabase
      .from('email_history')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Failed to fetch email history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching email history:', error);
    return [];
  }
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
