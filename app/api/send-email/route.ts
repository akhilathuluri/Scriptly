import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { markdownToHTML } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientEmail, subject, content, attachmentFormat, documentTitle } = body;

    // Validate required fields
    if (!recipientEmail || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Convert markdown to HTML for email body
    const htmlBody = markdownToHTML(content, documentTitle || 'Document');

    // Prepare email options
    const mailOptions: any = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipientEmail,
      subject: subject,
      html: htmlBody,
      attachments: [],
    };

    // Add attachment if requested
    if (attachmentFormat) {
      const filename = (documentTitle || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      if (attachmentFormat === 'md') {
        mailOptions.attachments.push({
          filename: `${filename}.md`,
          content: content,
          contentType: 'text/markdown',
        });
      } else if (attachmentFormat === 'html') {
        // Generate standalone HTML file
        const htmlContent = markdownToHTML(content, documentTitle || 'Document');
        mailOptions.attachments.push({
          filename: `${filename}.html`,
          content: htmlContent,
          contentType: 'text/html',
        });
      } else if (attachmentFormat === 'pdf') {
        // Note: PDF generation in server-side requires different approach
        // For now, we'll send a note that PDF attachment is not available in email
        // In production, you'd use a service like Puppeteer or a PDF API
        return NextResponse.json(
          { error: 'PDF attachments are not yet supported for email. Please use .md or .html format.' },
          { status: 400 }
        );
      }
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
