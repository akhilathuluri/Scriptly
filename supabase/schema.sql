-- =====================================================
-- MARKDOWN EDITOR DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS PROFILE TABLE
-- Extends Supabase auth.users with additional profile data
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- FOLDERS TABLE
-- Organize documents into folders (created first for foreign key)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can view their own folders"
    ON public.folders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders"
    ON public.folders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
    ON public.folders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
    ON public.folders FOR DELETE
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON public.folders(parent_id);

-- =====================================================
-- DOCUMENTS TABLE
-- Stores markdown documents
-- =====================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Document',
    content TEXT DEFAULT '',
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can view their own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents"
    ON public.documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON public.documents FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
    ON public.documents FOR DELETE
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_folder_id ON public.documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_is_favorite ON public.documents(is_favorite) WHERE is_favorite = TRUE;

-- =====================================================
-- CHAT HISTORY TABLE
-- Store document chatbot conversations
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Chat history policies
CREATE POLICY "Users can view their own chat history"
    ON public.chat_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat history"
    ON public.chat_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history"
    ON public.chat_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
    ON public.chat_history FOR DELETE
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_document_id ON public.chat_history(document_id);

-- =====================================================
-- USER SETTINGS TABLE
-- Store user preferences and settings
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    theme TEXT DEFAULT 'system',
    auto_save BOOLEAN DEFAULT TRUE,
    auto_complete_enabled BOOLEAN DEFAULT FALSE,
    editor_font_size INTEGER DEFAULT 14,
    editor_line_height DECIMAL DEFAULT 1.6,
    show_preview BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- User settings policies
CREATE POLICY "Users can view their own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- =====================================================
-- DOCUMENT VERSIONS TABLE (Optional - for version history)
-- Store document version history
-- =====================================================
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- Document versions policies
CREATE POLICY "Users can view their own document versions"
    ON public.document_versions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own document versions"
    ON public.document_versions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_at ON public.document_versions(created_at DESC);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON public.folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_history_updated_at
    BEFORE UPDATE ON public.chat_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STORAGE BUCKETS (for avatars and file uploads)
-- =====================================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- You can uncomment this to create sample data after signup
-- INSERT INTO public.folders (user_id, name, color)
-- VALUES 
--     (auth.uid(), 'Personal', '#3B82F6'),
--     (auth.uid(), 'Work', '#10B981'),
--     (auth.uid(), 'Projects', '#F59E0B');

-- =====================================================
-- VIEWS (Optional - for analytics)
-- =====================================================

-- View for document statistics
CREATE OR REPLACE VIEW public.user_document_stats AS
SELECT 
    user_id,
    COUNT(*) as total_documents,
    COUNT(*) FILTER (WHERE is_favorite = TRUE) as favorite_count,
    COUNT(*) FILTER (WHERE is_archived = TRUE) as archived_count,
    SUM(LENGTH(content)) as total_characters,
    MAX(updated_at) as last_updated
FROM public.documents
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.user_document_stats TO authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- If you see this message, the schema was created successfully!
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📝 Tables created: profiles, documents, folders, chat_history, user_settings, document_versions';
    RAISE NOTICE '🔒 Row Level Security enabled on all tables';
    RAISE NOTICE '🪝 Triggers created for auto-updating timestamps';
    RAISE NOTICE '👤 Auto-profile creation on signup enabled';
    RAISE NOTICE '📦 Storage bucket for avatars created';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 You can now use the authentication system!';
END $$;
