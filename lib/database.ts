import { supabase, type Document, type Folder, type ChatHistory, type UserSettings } from './supabase';

// =====================================================
// DOCUMENTS
// =====================================================

export async function getDocuments(userId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as Document[];
}

export async function getDocument(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Document;
}

export async function createDocument(userId: string, title: string = 'Untitled Document', content: string = '') {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      title,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

export async function updateDocument(id: string, updates: Partial<Document>) {
  const { data, error } = await supabase
    .from('documents')
    .update({
      ...updates,
      last_edited_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  return updateDocument(id, { is_favorite: isFavorite });
}

export async function archiveDocument(id: string) {
  return updateDocument(id, { is_archived: true });
}

// =====================================================
// FOLDERS
// =====================================================

export async function getFolders(userId: string) {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw error;
  return data as Folder[];
}

export async function createFolder(userId: string, name: string, parentId?: string) {
  const { data, error } = await supabase
    .from('folders')
    .insert({
      user_id: userId,
      name,
      parent_id: parentId || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Folder;
}

export async function updateFolder(id: string, updates: Partial<Folder>) {
  const { data, error } = await supabase
    .from('folders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Folder;
}

export async function deleteFolder(id: string) {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// CHAT HISTORY
// =====================================================

export async function getChatHistory(documentId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('document_id', documentId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
  return data as ChatHistory | null;
}

export async function saveChatHistory(
  userId: string,
  documentId: string,
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>
) {
  // Convert messages to Supabase format (timestamp as string)
  const supabaseMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.timestamp).toISOString(),
  }));

  // Check if chat history exists
  const existing = await getChatHistory(documentId);

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('chat_history')
      .update({ messages: supabaseMessages })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data as ChatHistory;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        document_id: documentId,
        messages: supabaseMessages,
      })
      .select()
      .single();

    if (error) throw error;
    return data as ChatHistory;
  }
}

export async function deleteChatHistory(documentId: string) {
  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('document_id', documentId);

  if (error) throw error;
}

// =====================================================
// USER SETTINGS
// =====================================================

export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as UserSettings | null;
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>) {
  // Check if settings exist
  const existing = await getUserSettings(userId);

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        ...settings,
      })
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  }
}

// =====================================================
// PROFILE
// =====================================================

export async function updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// SEARCH
// =====================================================

export async function searchDocuments(userId: string, query: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as Document[];
}

// =====================================================
// STATISTICS
// =====================================================

export async function getDocumentStats(userId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('id, is_favorite, is_archived, content')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    total: data.length,
    favorites: data.filter((d) => d.is_favorite).length,
    archived: data.filter((d) => d.is_archived).length,
    totalCharacters: data.reduce((sum, d) => sum + (d.content?.length || 0), 0),
  };

  return stats;
}
