// Mermaid diagram rendering module
export interface MermaidRenderOptions {
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  themeVariables?: Record<string, string>;
}

// Check if Mermaid is available
export const isMermaidAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'mermaid' in window;
};

// Initialize Mermaid with configuration
export const initializeMermaid = (theme: 'default' | 'dark' = 'default'): void => {
  if (!isMermaidAvailable()) return;

  const mermaid = (window as any).mermaid;
  
  // Determine if dark mode
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#ffffff' : '#333333';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  
  mermaid.initialize({
    startOnLoad: false,
    theme: theme,
    securityLevel: 'loose',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    htmlLabels: true,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
      padding: 20,
      nodeSpacing: 50,
      rankSpacing: 50,
    },
    sequence: {
      useMaxWidth: true,
      diagramMarginX: 50,
      diagramMarginY: 10,
      actorMargin: 50,
      width: 150,
      height: 65,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
      htmlLabels: true,
    },
    class: {
      useMaxWidth: true,
      htmlLabels: true,
      padding: 20,
    },
    state: {
      useMaxWidth: true,
      htmlLabels: true,
      padding: 20,
    },
    gantt: {
      useMaxWidth: true,
      titleTopMargin: 25,
      barHeight: 20,
      barGap: 4,
      topPadding: 50,
      leftPadding: 75,
      gridLineStartPadding: 35,
      fontSize: 11,
      numberSectionStyles: 4,
      axisFormat: '%Y-%m-%d',
    },
    themeVariables: {
      primaryColor: '#667eea',
      primaryTextColor: textColor,
      primaryBorderColor: '#667eea',
      lineColor: '#667eea',
      secondaryColor: '#764ba2',
      tertiaryColor: '#f8f9fa',
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      // Text colors for all diagram types
      textColor: textColor,
      nodeBorder: '#667eea',
      mainBkg: bgColor,
      labelTextColor: textColor,
      labelBackground: bgColor,
      nodeTextColor: textColor,
      classText: textColor,
      stateLabelColor: textColor,
      stateText: textColor,
      edgeLabelBackground: bgColor,
      edgeLabelText: textColor,
      // Ensure contrast
      noteBkgColor: bgColor,
      noteTextColor: textColor,
    },
  });
};

// Render a single Mermaid diagram
export const renderMermaidDiagram = async (
  code: string,
  elementId: string
): Promise<string> => {
  if (!isMermaidAvailable()) {
    return '<div class="mermaid-error">Mermaid not loaded</div>';
  }

  try {
    const mermaid = (window as any).mermaid;
    const { svg } = await mermaid.render(elementId, code);
    return svg;
  } catch (error) {
    console.error('Mermaid rendering error:', error);
    return `<div class="mermaid-error">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
  }
};

// Process markdown with Mermaid diagrams
export const processMermaidInMarkdown = async (
  markdown: string
): Promise<string> => {
  if (!markdown) return markdown;

  // Find all mermaid code blocks
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  const matches = Array.from(markdown.matchAll(mermaidRegex));

  if (matches.length === 0) return markdown;

  let processedMarkdown = markdown;
  
  // Process each mermaid block in reverse order to maintain indices
  const replacements: Array<{ match: RegExpMatchArray; svg: string }> = [];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const code = match[1].trim();
    const elementId = `mermaid-diagram-${Date.now()}-${i}`;
    
    try {
      const svg = await renderMermaidDiagram(code, elementId);
      const replacement = `\n<div class="mermaid-container">${svg}</div>\n`;
      replacements.push({ match, svg: replacement });
    } catch (error) {
      console.error('Failed to render mermaid diagram:', error);
      const errorMsg = `\n<div class="mermaid-error">Failed to render diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>\n`;
      replacements.push({ match, svg: errorMsg });
    }
  }
  
  // Replace in reverse order to maintain string indices
  for (let i = replacements.length - 1; i >= 0; i--) {
    const { match, svg } = replacements[i];
    const index = match.index!;
    processedMarkdown = 
      processedMarkdown.substring(0, index) + 
      svg + 
      processedMarkdown.substring(index + match[0].length);
  }

  return processedMarkdown;
};

// Load Mermaid dynamically
export const loadMermaid = async (): Promise<boolean> => {
  if (isMermaidAvailable()) {
    return true;
  }

  try {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
    script.type = 'text/javascript';

    return new Promise((resolve) => {
      script.onload = () => {
        initializeMermaid();
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Mermaid');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Failed to load Mermaid:', error);
    return false;
  }
};

// Mermaid diagram templates
export const mermaidTemplates = {
  flowchart: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E`,

  sequenceDiagram: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B->>A: Hello Alice!
    A->>B: How are you?
    B->>A: I'm good, thanks!`,

  classDiagram: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    Animal <|-- Dog`,

  stateDiagram: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Error: Fail
    Success --> [*]
    Error --> Idle: Retry`,

  erDiagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date orderDate
    }`,

  ganttChart: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Research           :a1, 2024-01-01, 30d
    Design             :a2, after a1, 20d
    section Development
    Implementation     :a3, after a2, 45d
    Testing            :a4, after a3, 15d`,

  pieChart: `pie title Project Distribution
    "Planning" : 20
    "Development" : 50
    "Testing" : 20
    "Deployment" : 10`,

  gitGraph: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`,

  mindmap: `mindmap
  root((Project))
    Planning
      Research
      Design
    Development
      Frontend
      Backend
    Testing
      Unit Tests
      Integration
    Deployment
      Staging
      Production`,

  timeline: `timeline
    title History of Technology
    2000 : Internet Boom
    2007 : iPhone Released
    2010 : iPad Launched
    2015 : AI Revolution
    2020 : Remote Work Era`,
};

// Get template by name
export const getMermaidTemplate = (
  name: keyof typeof mermaidTemplates
): string => {
  return mermaidTemplates[name] || '';
};

// Detect diagram type from code
export const detectDiagramType = (code: string): string => {
  const trimmed = code.trim();
  
  if (trimmed.startsWith('graph') || trimmed.startsWith('flowchart')) {
    return 'Flowchart';
  } else if (trimmed.startsWith('sequenceDiagram')) {
    return 'Sequence Diagram';
  } else if (trimmed.startsWith('classDiagram')) {
    return 'Class Diagram';
  } else if (trimmed.startsWith('stateDiagram')) {
    return 'State Diagram';
  } else if (trimmed.startsWith('erDiagram')) {
    return 'ER Diagram';
  } else if (trimmed.startsWith('gantt')) {
    return 'Gantt Chart';
  } else if (trimmed.startsWith('pie')) {
    return 'Pie Chart';
  } else if (trimmed.startsWith('gitGraph')) {
    return 'Git Graph';
  } else if (trimmed.startsWith('mindmap')) {
    return 'Mind Map';
  } else if (trimmed.startsWith('timeline')) {
    return 'Timeline';
  }
  
  return 'Diagram';
};
