'use client';

import { Document } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Plus,
  Trash2,
  Search,
  Menu,
  X,
  Clock,
  Sparkles,
  FolderOpen,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DocumentSidebarProps {
  documents: Document[];
  currentDocId: string | null;
  onSelectDoc: (id: string) => void;
  onNewDoc: () => void;
  onDeleteDoc: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function DocumentSidebar({
  documents,
  currentDocId,
  onSelectDoc,
  onNewDoc,
  onDeleteDoc,
  isOpen,
  onToggle,
}: DocumentSidebarProps) {
  const [search, setSearch] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.content.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDocs = [...filteredDocs].sort((a, b) => b.updatedAt - a.updatedAt);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 p-0 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/50 transition-all duration-200 hover:scale-105 shadow-premium"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-all duration-200"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed md:relative top-0 left-0 h-full w-80 border-r bg-background/95 backdrop-blur-sm z-40 flex flex-col transition-all duration-300 ease-in-out shadow-premium-lg',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-6 border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <FolderOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold gradient-text">Documents</h2>
            </div>
            <Button
              onClick={onNewDoc}
              size="sm"
              className="h-8 px-3 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-premium"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-background/50 border-border/50 focus:bg-background transition-all duration-200"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {sortedDocs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground animate-fade-in-up">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-muted to-muted/50 flex items-center justify-center">
                  <FileText className="h-8 w-8 opacity-40" />
                </div>
                <p className="text-sm font-medium mb-1">
                  {search ? 'No documents found' : 'No documents yet'}
                </p>
                <p className="text-xs opacity-70">
                  {search ? 'Try a different search term' : 'Create your first document to get started'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    className={cn(
                      'group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-accent/50 hover:shadow-premium border border-transparent hover:border-border/50',
                      currentDocId === doc.id && 'bg-accent border-primary/20 shadow-premium',
                      'animate-fade-in-up'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => {
                      onSelectDoc(doc.id);
                      if (window.innerWidth < 768) onToggle();
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"></div>
                          <h3 className="font-semibold text-sm truncate text-foreground">
                            {doc.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-2 leading-relaxed">
                          {doc.content.slice(0, 80) || 'Empty document'}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(doc.updatedAt)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this document?')) {
                            onDeleteDoc(doc.id);
                          }
                        }}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gradient-to-r from-muted/30 to-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground font-medium">
                {documents.length} {documents.length === 1 ? 'document' : 'documents'}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {sortedDocs.length} shown
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
