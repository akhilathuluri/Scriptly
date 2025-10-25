// Supabase storage for documents with fallback to localStorage
import { 
  getDocuments, 
  getDocument, 
  createDocument, 
  updateDocument, 
  deleteDocument 
} from './database';
import type { Document as SupabaseDocument } from './supabase';

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  userId?: string;
}

const STORAGE_KEYS = {
  DOCUMENTS: 'markdown-documents',
  CURRENT_DOCUMENT: 'markdown-current-document',
} as const;

// Convert Supabase document to local format
function toLocalDocument(doc: SupabaseDocument): Document {
  return {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    createdAt: new Date(doc.created_at).getTime(),
    updatedAt: new Date(doc.updated_at).getTime(),
    userId: doc.user_id,
  };
}

// Convert local document to Supabase format
function toSupabaseDocument(doc: Document, userId: string): Partial<SupabaseDocument> {
  return {
    title: doc.title,
    content: doc.content,
  };
}

class SupabaseStorageManager {
  private cache = new Map<string, Document>();
  private isInitialized = false;
  private userId: string | null = null;
  private useSupabase = false;

  // Initialize with user ID
  async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) return;

    this.userId = userId || null;
    this.useSupabase = !!userId;

    if (this.useSupabase && userId) {
      try {
        // Load documents from Supabase
        const docs = await getDocuments(userId);
        docs.forEach(doc => {
          const localDoc = toLocalDocument(doc);
          this.cache.set(localDoc.id, localDoc);
        });
      } catch (error) {
        console.error('Failed to load from Supabase, falling back to localStorage:', error);
        this.useSupabase = false;
        await this.loadFromLocalStorage();
      }
    } else {
      await this.loadFromLocalStorage();
    }

    this.isInitialized = true;
  }

  // Load from localStorage
  private async loadFromLocalStorage(): Promise<void> {
    try {
      const documentsData = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (documentsData) {
        const documents = JSON.parse(documentsData) as Document[];
        documents.forEach(doc => this.cache.set(doc.id, doc));
      }
    } catch (error) {
      console.error('localStorage load error:', error);
      this.clearLocalStorage();
    }
  }

  // Save to localStorage
  private saveToLocalStorage(): void {
    try {
      const documents = Array.from(this.cache.values());
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (error) {
      console.error('localStorage save error:', error);
    }
  }

  // Clear localStorage
  private clearLocalStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_DOCUMENT);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // Get all documents
  async getAllDocuments(): Promise<Document[]> {
    await this.initialize();
    return Array.from(this.cache.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // Get single document
  async getDocument(id: string): Promise<Document | null> {
    await this.initialize();

    if (this.useSupabase && this.userId) {
      try {
        const doc = await getDocument(id);
        if (doc) {
          const localDoc = toLocalDocument(doc);
          this.cache.set(localDoc.id, localDoc);
          return localDoc;
        }
      } catch (error) {
        console.error('Failed to get document from Supabase:', error);
      }
    }

    return this.cache.get(id) || null;
  }

  // Create new document
  async createDocument(title: string = 'Untitled Document', content: string = ''): Promise<Document> {
    await this.initialize();

    if (this.useSupabase && this.userId) {
      try {
        const supabaseDoc = await createDocument(this.userId, title, content);
        const localDoc = toLocalDocument(supabaseDoc);
        this.cache.set(localDoc.id, localDoc);
        return localDoc;
      } catch (error) {
        console.error('Failed to create document in Supabase:', error);
        // Fall through to localStorage
      }
    }

    // Fallback to localStorage
    const newDoc: Document = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.cache.set(newDoc.id, newDoc);
    this.saveToLocalStorage();
    return newDoc;
  }

  // Save/update document
  async saveDocument(doc: Document): Promise<void> {
    await this.initialize();

    const updatedDoc = {
      ...doc,
      updatedAt: Date.now(),
    };

    if (this.useSupabase && this.userId) {
      try {
        await updateDocument(doc.id, toSupabaseDocument(updatedDoc, this.userId));
      } catch (error) {
        console.error('Failed to save document to Supabase:', error);
        // Continue to save in cache/localStorage
      }
    }

    this.cache.set(updatedDoc.id, updatedDoc);
    this.saveToLocalStorage();
  }

  // Delete document
  async deleteDocument(id: string): Promise<void> {
    await this.initialize();

    if (this.useSupabase && this.userId) {
      try {
        await deleteDocument(id);
      } catch (error) {
        console.error('Failed to delete document from Supabase:', error);
      }
    }

    this.cache.delete(id);
    this.saveToLocalStorage();
  }

  // Get current document ID
  getCurrentDocumentId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_DOCUMENT);
    } catch (error) {
      console.error('Failed to get current document ID:', error);
      return null;
    }
  }

  // Set current document ID
  setCurrentDocumentId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_DOCUMENT, id);
    } catch (error) {
      console.error('Failed to set current document ID:', error);
    }
  }

  // Sync localStorage documents to Supabase (for migration)
  async syncToSupabase(userId: string): Promise<void> {
    if (!userId) return;

    try {
      const localDocs = Array.from(this.cache.values());
      
      for (const doc of localDocs) {
        if (!doc.userId) {
          // This is a localStorage-only document, create it in Supabase
          try {
            const supabaseDoc = await createDocument(userId, doc.title, doc.content);
            const localDoc = toLocalDocument(supabaseDoc);
            this.cache.set(localDoc.id, localDoc);
          } catch (error) {
            console.error('Failed to sync document to Supabase:', error);
          }
        }
      }

      this.userId = userId;
      this.useSupabase = true;
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Failed to sync to Supabase:', error);
    }
  }
}

// Singleton instance
export const supabaseStorage = new SupabaseStorageManager();
