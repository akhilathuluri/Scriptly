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
import { Sigma } from 'lucide-react';
import { mathTemplates, getMathTemplate } from '@/lib/math-renderer';

interface MathToolbarProps {
  onInsertMath: (latex: string, inline?: boolean) => void;
}

export function MathToolbar({ onInsertMath }: MathToolbarProps) {
  const handleInsert = (template: keyof typeof mathTemplates, inline: boolean = false) => {
    const latex = getMathTemplate(template);
    onInsertMath(latex, inline);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-accent/50 transition-all duration-200"
          title="Insert Math Equation"
        >
          <Sigma className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Insert Math Equation</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleInsert('fraction', true)}>
          <span className="font-mono text-xs">Fraction: a/b</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('sqrt', true)}>
          <span className="font-mono text-xs">Square Root: √x</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('power', true)}>
          <span className="font-mono text-xs">Power: x^n</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('subscript', true)}>
          <span className="font-mono text-xs">Subscript: x_n</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Advanced</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => handleInsert('sum', false)}>
          <span className="font-mono text-xs">Summation: Σ</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('integral', false)}>
          <span className="font-mono text-xs">Integral: ∫</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('limit', false)}>
          <span className="font-mono text-xs">Limit: lim</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('matrix', false)}>
          <span className="font-mono text-xs">Matrix</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleInsert('greek', true)}>
          <span className="font-mono text-xs">Greek Letters: α β γ</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleInsert('operators', true)}>
          <span className="font-mono text-xs">Operators: × ÷ ± ≤ ≥</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
