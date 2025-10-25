-- =====================================================
-- EMAIL HISTORY TABLE
-- Store email sending history for verification
-- =====================================================

CREATE TABLE IF NOT EXISTS public.email_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    attachment_format TEXT, -- 'md', 'html', 'pdf', or NULL
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'pending'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.email_history ENABLE ROW LEVEL SECURITY;

-- Email history policies
CREATE POLICY "Users can view their own email history"
    ON public.email_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email history"
    ON public.email_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_history_user_id ON public.email_history(user_id);
CREATE INDEX IF NOT EXISTS idx_email_history_sent_at ON public.email_history(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_history_document_id ON public.email_history(document_id);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Email history table created successfully!';
    RAISE NOTICE '📧 Email sending feature is now ready';
END $$;
