'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@/components/editor';
import { DocumentSidebar } from '@/components/document-sidebar';
import { LoadingScreen } from '@/components/loading-screen';
import { ErrorBoundary } from '@/components/error-boundary';
import { supabaseStorage, Document } from '@/lib/supabase-storage';
import { useAuth } from '@/contexts/auth-context';
import { UserMenu } from '@/components/auth/user-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { WordCountDisplay } from '@/components/word-count-display';
import { WordCloudDialog } from '@/components/word-cloud-dialog';
import { DocumentChatbotPanel } from '@/components/document-chatbot-panel';
import { Button } from '@/components/ui/button';
import { FileText, Cloud } from 'lucide-react';

export default function EditorPage() {
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage with user ID if authenticated
        await supabaseStorage.initialize(user?.id);
        
        const docs = await supabaseStorage.getAllDocuments();

        if (docs.length === 0) {
          const newDoc = await supabaseStorage.createDocument();
          setDocuments([newDoc]);
          setCurrentDoc(newDoc);
          supabaseStorage.setCurrentDocumentId(newDoc.id);
        } else {
          setDocuments(docs);
          const currentId = supabaseStorage.getCurrentDocumentId();
          const doc = currentId ? await supabaseStorage.getDocument(currentId) : docs[0];
          setCurrentDoc(doc || docs[0]);
        }
      } catch (err) {
        console.error('App initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize app');
      }
    };

    if (!authLoading) {
      initializeApp();
    }
  }, [user, authLoading]);

  const handleContentChange = async (content: string) => {
    if (!currentDoc) return;

    const updatedDoc = { ...currentDoc, content };
    setCurrentDoc(updatedDoc);
    await supabaseStorage.saveDocument(updatedDoc);
    const docs = await supabaseStorage.getAllDocuments();
    setDocuments(docs);
  };

  const handleTitleChange = async (title: string) => {
    if (!currentDoc) return;

    const updatedDoc = { ...currentDoc, title };
    setCurrentDoc(updatedDoc);
    await supabaseStorage.saveDocument(updatedDoc);
    const docs = await supabaseStorage.getAllDocuments();
    setDocuments(docs);
  };

  const handleSelectDoc = async (id: string) => {
    const doc = await supabaseStorage.getDocument(id);
    if (doc) {
      setCurrentDoc(doc);
      supabaseStorage.setCurrentDocumentId(id);
    }
  };

  const handleNewDoc = async () => {
    const newDoc = await supabaseStorage.createDocument();
    const docs = await supabaseStorage.getAllDocuments();
    setDocuments(docs);
    setCurrentDoc(newDoc);
    supabaseStorage.setCurrentDocumentId(newDoc.id);
  };

  const handleDeleteDoc = async (id: string) => {
    await supabaseStorage.deleteDocument(id);
    const remainingDocs = await supabaseStorage.getAllDocuments();
    setDocuments(remainingDocs);

    if (currentDoc?.id === id) {
      if (remainingDocs.length > 0) {
        setCurrentDoc(remainingDocs[0]);
        supabaseStorage.setCurrentDocumentId(remainingDocs[0].id);
      } else {
        const newDoc = await supabaseStorage.createDocument();
        setDocuments([newDoc]);
        setCurrentDoc(newDoc);
        supabaseStorage.setCurrentDocumentId(newDoc.id);
      }
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex flex-col items-center space-y-4 animate-fade-in-up max-w-md text-center p-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-destructive to-destructive/60 flex items-center justify-center">
            <FileText className="w-8 h-8 text-destructive-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Initialization Error</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDoc) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-muted to-muted/50 flex items-center justify-center">
            <FileText className="w-8 h-8 opacity-40" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">No documents found</h2>
            <p className="text-sm text-muted-foreground">Creating a new document...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
        <DocumentSidebar
          documents={documents}
          currentDocId={currentDoc.id}
          onSelectDoc={handleSelectDoc}
          onNewDoc={handleNewDoc}
          onDeleteDoc={handleDeleteDoc}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-sm font-medium text-muted-foreground">Markdown Editor</h1>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex-1 max-w-2xl">
                  <Input
                    value={currentDoc.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Untitled Document"
                    className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-1 bg-transparent placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <WordCountDisplay content={currentDoc.content} />
                <WordCloudDialog content={currentDoc.content}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-accent/50 transition-all duration-200"
                    title="Word Cloud"
                  >
                    <Cloud className="h-4 w-4" />
                  </Button>
                </WordCloudDialog>
                <UserMenu />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            <Editor
              content={currentDoc.content}
              onChange={handleContentChange}
              title={currentDoc.title}
            />
          </div>
        </main>

        {/* Document Chatbot */}
        <DocumentChatbotPanel
          documentId={currentDoc.id}
          documentContent={currentDoc.content}
          documentTitle={currentDoc.title}
          isOpen={chatbotOpen}
          onToggle={() => setChatbotOpen(!chatbotOpen)}
        />
      </div>
    </ErrorBoundary>
  );
}
