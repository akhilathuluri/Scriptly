// Modular storage utilities with performance optimizations
export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEYS = {
  DOCUMENTS: 'markdown-documents',
  CURRENT_DOCUMENT: 'markdown-current-document',
} as const;

// Performance-optimized storage operations
class StorageManager {
  private cache = new Map<string, Document>();
  private isInitialized = false;

  // Initialize with error handling and performance optimization
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const documentsData = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (documentsData) {
        const documents = JSON.parse(documentsData) as Document[];
        // Cache documents for faster access
        documents.forEach(doc => this.cache.set(doc.id, doc));
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Storage initialization error:', error);
      // Clear corrupted data
      this.clearCorruptedData();
      this.isInitialized = true;
    }
  }

  // Clear corrupted localStorage data
  private clearCorruptedData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_DOCUMENT);
    } catch (error) {
      console.error('Failed to clear corrupted data:', error);
    }
  }

  // Debounced save to prevent excessive localStorage writes
  private saveTimeout: NodeJS.Timeout | null = null;
  private pendingDocuments: Document[] | null = null;

  private debouncedSave(documents: Document[]): void {
    this.pendingDocuments = documents;
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(this.pendingDocuments));
        this.pendingDocuments = null;
      } catch (error) {
        console.error('Failed to save documents:', error);
        // Handle quota exceeded error
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          this.handleQuotaExceeded();
        }
      }
    }, 100); // 100ms debounce
  }

  // Handle localStorage quota exceeded
  private handleQuotaExceeded(): void {
    console.warn('localStorage quota exceeded, clearing old documents');
    const documents = Array.from(this.cache.values());
    // Keep only the 10 most recent documents
    const recentDocs = documents
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10);
    
    this.cache.clear();
    recentDocs.forEach(doc => this.cache.set(doc.id, doc));
    
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(recentDocs));
    } catch (error) {
      console.error('Failed to save reduced documents:', error);
    }
  }

  // Get all documents with caching
  async getAllDocuments(): Promise<Document[]> {
    await this.initialize();
    return Array.from(this.cache.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // Get single document with caching
  async getDocument(id: string): Promise<Document | null> {
    await this.initialize();
    return this.cache.get(id) || null;
  }

  // Save document with performance optimization
  async saveDocument(document: Document): Promise<void> {
    await this.initialize();
    
    const updatedDoc = {
      ...document,
      updatedAt: Date.now(),
    };
    
    this.cache.set(updatedDoc.id, updatedDoc);
    const allDocuments = Array.from(this.cache.values());
    this.debouncedSave(allDocuments);
  }

  // Delete document
  async deleteDocument(id: string): Promise<void> {
    await this.initialize();
    
    this.cache.delete(id);
    const allDocuments = Array.from(this.cache.values());
    this.debouncedSave(allDocuments);
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

  // Create new document
  async createDocument(): Promise<Document> {
    await this.initialize();
    
    const newDoc: Document = {
      id: crypto.randomUUID(),
      title: 'Untitled Document',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.cache.set(newDoc.id, newDoc);
    const allDocuments = Array.from(this.cache.values());
    this.debouncedSave(allDocuments);
    
    return newDoc;
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }
      
      // Estimate available space (most browsers have 5-10MB limit)
      const estimatedLimit = 5 * 1024 * 1024; // 5MB
      const available = Math.max(0, estimatedLimit - used);
      const percentage = (used / estimatedLimit) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Create singleton instance
const storageManager = new StorageManager();

// Export the storage interface
export const storage = {
  getAllDocuments: () => storageManager.getAllDocuments(),
  getDocument: (id: string) => storageManager.getDocument(id),
  saveDocument: (document: Document) => storageManager.saveDocument(document),
  deleteDocument: (id: string) => storageManager.deleteDocument(id),
  getCurrentDocumentId: () => storageManager.getCurrentDocumentId(),
  setCurrentDocumentId: (id: string) => storageManager.setCurrentDocumentId(id),
  createDocument: () => storageManager.createDocument(),
  getStorageInfo: () => storageManager.getStorageInfo(),
};