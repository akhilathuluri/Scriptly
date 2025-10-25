-- =====================================================
-- MIGRATION: Remove Company API Key Feature
-- Run this in Supabase SQL Editor if you already have the database set up
-- =====================================================

-- Remove use_company_key and api_key_encrypted columns from user_settings
ALTER TABLE public.user_settings 
DROP COLUMN IF EXISTS use_company_key,
DROP COLUMN IF EXISTS api_key_encrypted;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration complete!';
    RAISE NOTICE '📝 Removed company API key columns from user_settings';
    RAISE NOTICE '🔑 Users will now only use their own API keys stored locally';
END $$;
