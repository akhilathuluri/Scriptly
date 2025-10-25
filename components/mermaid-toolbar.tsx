'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Network } from 'lucide-react';
import { mermaidTemplates, getMermaidTemplate } from '@/lib/mermaid-renderer';

interface MermaidToolbarProps {
  onInsertDiagram: (code: string) => void;
}

export function MermaidToolbar({ onInsertDiagram }: MermaidToolbarProps) {
  const handleInsert = (template: keyof typeof mermaidTemplates) => {
    const code = getMermaidTemplate(template);
    onInsertDiagram(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-accent/50 transition-all duration-200"
          title="Insert Diagram"
        >
          <Network className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Insert Mermaid Diagram</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleInsert('flowchart')}>
          <span className="font-medium">Flowchart</span>
          <span className="ml-auto text-xs text-muted-foreground">Decision flow</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('sequenceDiagram')}>
          <span className="font-medium">Sequence Diagram</span>
          <span className="ml-auto text-xs text-muted-foreground">Interactions</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('classDiagram')}>
          <span className="font-medium">Class Diagram</span>
          <span className="ml-auto text-xs text-muted-foreground">OOP structure</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('stateDiagram')}>
          <span className="font-medium">State Diagram</span>
          <span className="ml-auto text-xs text-muted-foreground">State machine</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Data & Charts</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => handleInsert('erDiagram')}>
          <span className="font-medium">ER Diagram</span>
          <span className="ml-auto text-xs text-muted-foreground">Database</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('ganttChart')}>
          <span className="font-medium">Gantt Chart</span>
          <span className="ml-auto text-xs text-muted-foreground">Timeline</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('pieChart')}>
          <span className="font-medium">Pie Chart</span>
          <span className="ml-auto text-xs text-muted-foreground">Distribution</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Other</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => handleInsert('gitGraph')}>
          <span className="font-medium">Git Graph</span>
          <span className="ml-auto text-xs text-muted-foreground">Version control</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('mindmap')}>
          <span className="font-medium">Mind Map</span>
          <span className="ml-auto text-xs text-muted-foreground">Ideas</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('timeline')}>
          <span className="font-medium">Timeline</span>
          <span className="ml-auto text-xs text-muted-foreground">Events</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
