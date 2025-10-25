'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Mail, Send, Paperclip, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sendEmail, isValidEmail, saveEmailHistory } from '@/lib/email';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface SendEmailDialogProps {
  content: string;
  title: string;
  documentId?: string;
  children: React.ReactNode;
}

export function SendEmailDialog({ content, title, documentId, children }: SendEmailDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState(title || 'Shared Document');
  const [attachmentFormat, setAttachmentFormat] = useState<'none' | 'md' | 'html' | 'pdf'>('none');
  const [emailError, setEmailError] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleEmailChange = (email: string) => {
    setRecipientEmail(email);
    setEmailError('');
    setSendStatus('idle');
  };

  const validateForm = (): boolean => {
    if (!recipientEmail.trim()) {
      setEmailError('Email address is required');
      return false;
    }

    if (!isValidEmail(recipientEmail)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    if (!subject.trim()) {
      toast.error('Subject is required');
      return false;
    }

    if (!content.trim()) {
      toast.error('Document content is empty');
      return false;
    }

    return true;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSending(true);
    setSendStatus('idle');

    try {
      const result = await sendEmail({
        recipientEmail: recipientEmail.trim(),
        subject: subject.trim(),
        content: content,
        attachmentFormat: attachmentFormat === 'none' ? null : attachmentFormat,
        documentId: documentId,
        documentTitle: title,
      });

      if (result.success) {
        setSendStatus('success');
        toast.success('Email sent successfully!');

        // Save to email history
        if (user) {
          await saveEmailHistory(
            user.id,
            recipientEmail.trim(),
            subject.trim(),
            attachmentFormat === 'none' ? null : attachmentFormat,
            documentId || null,
            'sent',
            null
          );
        }

        // Reset form and close after a short delay
        setTimeout(() => {
          setIsOpen(false);
          setRecipientEmail('');
          setSubject(title || 'Shared Document');
          setAttachmentFormat('none');
          setSendStatus('idle');
        }, 1500);
      } else {
        setSendStatus('error');
        toast.error(result.error || 'Failed to send email');

        // Save failed attempt to history
        if (user) {
          await saveEmailHistory(
            user.id,
            recipientEmail.trim(),
            subject.trim(),
            attachmentFormat === 'none' ? null : attachmentFormat,
            documentId || null,
            'failed',
            result.error || 'Unknown error'
          );
        }
      }
    } catch (error) {
      setSendStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(errorMessage);

      // Save failed attempt to history
      if (user) {
        await saveEmailHistory(
          user.id,
          recipientEmail.trim(),
          subject.trim(),
          attachmentFormat === 'none' ? null : attachmentFormat,
          documentId || null,
          'failed',
          errorMessage
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send Document via Email</span>
          </DialogTitle>
          <DialogDescription>
            Share your markdown document as a beautifully formatted email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="recipient-email">
              Recipient Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="recipient-email"
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={emailError ? 'border-red-500' : ''}
            />
            {emailError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {emailError}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="email-subject">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email-subject"
              type="text"
              placeholder="Document subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <Separator />

          {/* Attachment Format */}
          <div className="space-y-2">
            <Label htmlFor="attachment-format" className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attach Document As
            </Label>
            <Select
              value={attachmentFormat}
              onValueChange={(value: 'none' | 'md' | 'html' | 'pdf') => setAttachmentFormat(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Attachment (Email Only)</SelectItem>
                <SelectItem value="md">Markdown (.md)</SelectItem>
                <SelectItem value="html">HTML (.html)</SelectItem>
                <SelectItem value="pdf" disabled>PDF (.pdf) - Coming Soon</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The document will be sent as formatted HTML in the email body. 
              {attachmentFormat !== 'none' && ' An attachment will also be included.'}
            </p>
          </div>

          {/* Preview Info */}
          <div className="bg-muted/50 p-3 rounded-md space-y-1">
            <p className="text-sm font-medium">Email Preview:</p>
            <p className="text-xs text-muted-foreground">
              • Formatted HTML email body
            </p>
            {attachmentFormat !== 'none' && (
              <p className="text-xs text-muted-foreground">
                • Attachment: {title || 'document'}.{attachmentFormat}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              • Professional styling with your branding
            </p>
          </div>

          {/* Status Messages */}
          {sendStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Email sent successfully!</span>
            </div>
          )}

          {sendStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Failed to send email. Please try again.</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending || sendStatus === 'success'}
            className="min-w-[120px]"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
