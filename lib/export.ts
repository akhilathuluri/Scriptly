// Modular export utilities with enhanced HTML and premium PDF export
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { parseMarkdown } from './markdown';

export interface ExportOptions {
  filename: string;
  includeMetadata?: boolean;
  includeTimestamp?: boolean;
  includeTableOfContents?: boolean;
  customStyles?: string;
}

export interface PDFExportOptions extends ExportOptions {
  pageSize?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  fontSize?: number;
  fontFamily?: string;
  includeHeader?: boolean;
  includeFooter?: boolean;
  watermark?: string;
  skipMermaid?: boolean; // Skip Mermaid rendering for faster export
}

// Enhanced HTML export with premium styling
export const exportToHTML = (content: string, options: ExportOptions): void => {
  const html = parseMarkdown(content);
  const timestamp = options.includeTimestamp ? new Date().toLocaleString() : '';
  
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.filename}</title>
  <style>
    ${getEnhancedHTMLStyles()}
    ${options.customStyles || ''}
  </style>
</head>
<body>
  <div class="document-container">
    ${options.includeMetadata ? getDocumentMetadata(options.filename, timestamp) : ''}
    ${options.includeTableOfContents ? generateTableOfContents(html) : ''}
    <main class="content">
      ${html}
    </main>
    ${options.includeTimestamp ? `<footer class="document-footer">Generated on ${timestamp}</footer>` : ''}
  </div>
</body>
</html>`;

  downloadFile(fullHtml, `${options.filename}.html`, 'text/html');
};

// Process Mermaid diagrams for PDF export
const processMermaidForPDF = async (html: string): Promise<string> => {
  try {
    // Check if there are any Mermaid diagrams
    if (!html.includes('language-mermaid')) {
      return html; // No Mermaid diagrams, return as is
    }

    // Load Mermaid if not already loaded
    if (typeof window !== 'undefined' && !(window as any).mermaid) {
      console.log('Loading Mermaid library...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
      script.type = 'module';
      
      const loadPromise = new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Timeout after 10 seconds
      await Promise.race([
        loadPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Mermaid load timeout')), 10000))
      ]);
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Check if Mermaid is available
    if (!(window as any).mermaid) {
      console.warn('Mermaid not available, skipping diagram rendering');
      return html;
    }
    
    console.log('Initializing Mermaid...');
    // Initialize Mermaid with light theme for PDF
    (window as any).mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#e0e0e0',
        primaryTextColor: '#000000',
        primaryBorderColor: '#000000',
        lineColor: '#000000',
        secondaryColor: '#f0f0f0',
        tertiaryColor: '#f5f5f5',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondaryBkg: '#f5f5f5',
        textColor: '#000000',
        fontSize: '16px',
        fontFamily: 'Georgia, serif',
        // Node-specific colors
        nodeTextColor: '#000000',
        nodeBorder: '#000000',
        // Class diagram
        classText: '#000000',
        // State diagram
        labelColor: '#000000',
        // Flowchart
        edgeLabelBackground: '#ffffff',
        edgeLabelText: '#000000',
        // Sequence diagram
        actorTextColor: '#000000',
        labelTextColor: '#000000',
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        useMaxWidth: true,
        actorFontWeight: 700,
        noteFontWeight: 700,
        messageFontWeight: 700,
      },
      gantt: {
        useMaxWidth: true,
        fontSize: 16,
        fontFamily: 'Georgia, serif',
      },
      class: {
        useMaxWidth: true,
      },
      state: {
        useMaxWidth: true,
      },
    });
  
  // Find all mermaid code blocks and replace with rendered SVG
  const mermaidRegex = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
  let processedHtml = html;
  let match;
  let index = 0;
  
  const matches: Array<{ original: string; code: string }> = [];
  while ((match = mermaidRegex.exec(html)) !== null) {
    matches.push({
      original: match[0],
      code: match[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim(),
    });
  }
  
  console.log(`Found ${matches.length} Mermaid diagrams to render`);
  
  // Render each diagram with timeout
  for (const { original, code } of matches) {
    try {
      const id = `mermaid-pdf-${Date.now()}-${index++}`;
      
      // Add timeout for each diagram render
      const renderPromise = (window as any).mermaid.render(id, code);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Diagram render timeout')), 5000)
      );
      
      const { svg } = await Promise.race([renderPromise, timeoutPromise]);
      
      // Wrap SVG in a container for better styling
      const svgContainer = `
        <div class="mermaid-container" style="
          margin: 20px 0;
          padding: 20px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
          <div style="max-width: 100%; overflow: visible;">${svg}</div>
        </div>
      `;
      
      processedHtml = processedHtml.replace(original, svgContainer);
      console.log(`Rendered diagram ${index}`);
    } catch (error) {
      console.error('Failed to render Mermaid diagram:', error);
      // Keep original code block if rendering fails
    }
  }
  
  return processedHtml;
  
  } catch (error) {
    console.error('Error in processMermaidForPDF:', error);
    // Return original HTML if processing fails
    return html;
  }
};

// Preload all images in the container
const preloadImages = async (container: HTMLElement): Promise<void> => {
  const images = Array.from(container.querySelectorAll('img'));
  
  const imagePromises = images.map((img) => {
    return new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error
        
        // Set crossOrigin to allow CORS
        if (!img.src.startsWith('data:')) {
          img.crossOrigin = 'anonymous';
        }
      }
    });
  });
  
  await Promise.all(imagePromises);
};

// Premium PDF export with advanced features and proper page handling
export const exportToPDF = async (content: string, options: PDFExportOptions): Promise<void> => {
  let tempDiv: HTMLDivElement | null = null;
  
  try {
    // Calculate proper width based on page size
    const pageWidthPx = options.pageSize === 'A3' ? 1200 : 
                        options.pageSize === 'Letter' ? 850 : 
                        900; // A4 default
    
    // Create temporary HTML container for rendering
    tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: ${pageWidthPx}px;
      padding: 60px;
      background: #ffffff;
      font-family: ${options.fontFamily || 'Georgia'}, serif;
      font-size: ${options.fontSize || 12}px;
      line-height: 1.8;
      color: #000000;
      overflow-wrap: break-word;
      word-wrap: break-word;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    `;
    
    // Parse markdown to HTML
    let html = parseMarkdown(content);
    
    // Process Mermaid diagrams BEFORE adding to DOM with timeout (unless skipped)
    if (!options.skipMermaid && html.includes('language-mermaid')) {
      console.log('Starting Mermaid processing...');
      try {
        const mermaidPromise = processMermaidForPDF(html);
        const timeoutPromise = new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Mermaid processing timeout (15s)')), 15000)
        );
        
        html = await Promise.race([mermaidPromise, timeoutPromise]);
        console.log('Mermaid processing complete');
      } catch (error) {
        console.error('Mermaid processing failed, continuing without diagrams:', error);
        alert('Mermaid diagram rendering timed out. Exporting without diagrams. Try again or use simpler diagrams.');
        // Continue with original HTML if Mermaid processing fails
      }
    } else {
      console.log('Skipping Mermaid processing (skipMermaid=true or no diagrams found)');
    }
    
    // Add styled content
    tempDiv.innerHTML = `
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
          color: #000000;
        }
        body {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          color: #000000;
          background: #ffffff;
        }
        h1, h2, h3, h4, h5, h6 { 
          margin: 24px 0 12px 0; 
          font-weight: 700;
          color: #000000;
          page-break-after: avoid;
          line-height: 1.3;
        }
        h1 { 
          font-size: 32px; 
          border-bottom: 3px solid #000; 
          padding-bottom: 10px; 
          margin-top: 0;
          color: #000000;
        }
        h2 { 
          font-size: 26px; 
          border-bottom: 2px solid #333; 
          padding-bottom: 8px;
          color: #000000;
        }
        h3 { font-size: 22px; color: #000000; font-weight: 700; }
        h4 { font-size: 19px; color: #000000; font-weight: 600; }
        h5 { font-size: 16px; color: #000000; font-weight: 600; }
        h6 { font-size: 14px; color: #000000; font-weight: 600; }
        p { 
          margin: 14px 0; 
          text-align: justify;
          line-height: 1.8;
          overflow-wrap: break-word;
          word-wrap: break-word;
          color: #000000;
        }
        p, span, div, li, td, th {
          color: #000000 !important;
        }
        ul, ol { 
          margin: 14px 0; 
          padding-left: 35px; 
        }
        li { 
          margin: 8px 0; 
          line-height: 1.7;
        }
        code { 
          background: #f0f0f0; 
          padding: 3px 8px; 
          border-radius: 4px; 
          font-family: 'Courier New', 'Consolas', monospace;
          font-size: 0.9em;
          color: #d63384;
          border: 1px solid #e0e0e0;
        }
        pre { 
          background: #f5f5f5; 
          padding: 18px; 
          border-radius: 6px; 
          overflow-x: auto; 
          margin: 18px 0;
          border: 1px solid #ddd;
          line-height: 1.5;
        }
        pre code { 
          background: none; 
          padding: 0; 
          border: none;
          color: #000000;
        }
        blockquote { 
          border-left: 5px solid #000; 
          padding: 12px 18px; 
          margin: 18px 0; 
          background: #f0f0f0;
          font-style: italic;
          color: #000000;
          border-radius: 0 4px 4px 0;
        }
        blockquote * {
          color: #000000 !important;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 18px 0;
          page-break-inside: avoid;
          font-size: 0.95em;
        }
        th, td { 
          border: 1px solid #ccc; 
          padding: 12px 14px; 
          text-align: left;
          vertical-align: top;
        }
        th { 
          background: #e0e0e0; 
          font-weight: 700;
          color: #000000;
        }
        tr:nth-child(even) { 
          background: #f5f5f5; 
        }
        td {
          color: #000000;
        }
        img { 
          max-width: 100%; 
          height: auto; 
          margin: 18px 0;
          border-radius: 4px;
          display: block;
        }
        /* Mermaid diagram styling for PDF */
        .mermaid-container {
          margin: 20px 0;
          padding: 20px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          page-break-inside: avoid;
        }
        .mermaid-container svg {
          max-width: 100%;
          height: auto;
          display: block;
        }
        /* Ensure SVG text is visible - CRITICAL FOR MERMAID */
        svg text {
          fill: #000000 !important;
          font-family: ${options.fontFamily || 'Georgia'}, serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
        }
        svg .nodeLabel, 
        svg .edgeLabel,
        svg .cluster-label text,
        svg .label {
          color: #000000 !important;
          fill: #000000 !important;
        }
        svg foreignObject {
          color: #000000 !important;
        }
        svg foreignObject * {
          color: #000000 !important;
          font-weight: 600 !important;
        }
        svg foreignObject div,
        svg foreignObject span,
        svg foreignObject p {
          color: #000000 !important;
          font-weight: 600 !important;
        }
        /* Additional text elements */
        svg tspan {
          fill: #000000 !important;
        }
        hr { 
          border: none; 
          border-top: 2px solid #ddd; 
          margin: 24px 0; 
        }
        strong, b { font-weight: 600; }
        em, i { font-style: italic; }
        a { 
          color: #667eea; 
          text-decoration: underline;
          text-decoration-color: rgba(102, 126, 234, 0.3);
        }
        /* Emoji and icon support */
        .emoji {
          font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        }
      </style>
      ${options.includeMetadata ? `<h1 style="text-align: center; margin-bottom: 5px;">${sanitizeTextForPDF(options.filename)}</h1>` : ''}
      ${options.includeTimestamp ? `<p style="text-align: center; color: #666; font-size: 12px; margin-bottom: 30px;">${new Date().toLocaleString()}</p>` : ''}
      ${html}
    `;
    
    document.body.appendChild(tempDiv);
    
    // Wait for Mermaid diagrams to render and fonts to load
    console.log('Waiting for content to render...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Process all images to ensure they're loaded
    console.log('Preloading images...');
    await preloadImages(tempDiv);
    
    // Allow UI to update before heavy canvas operation
    console.log('Preparing canvas rendering...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Use html2canvas to render with proper dimensions and high quality
    console.log('Starting html2canvas rendering (this may take 10-30 seconds)...');
    
    // Create a timeout promise to prevent infinite hanging
    const canvasTimeout = new Promise<HTMLCanvasElement>((_, reject) => {
      setTimeout(() => reject(new Error('Canvas rendering timeout (30s)')), 30000);
    });
    
    const canvasPromise = html2canvas(tempDiv, {
      scale: 2, // Reduced from 4 to 2 for better performance
      useCORS: true,
      allowTaint: true, // Allow cross-origin images
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: pageWidthPx,
      windowHeight: tempDiv.scrollHeight,
      scrollY: 0,
      scrollX: 0,
      width: pageWidthPx,
      height: tempDiv.scrollHeight,
      imageTimeout: 15000,
      removeContainer: true,
      onclone: (clonedDoc) => {
        // Ensure all SVG elements are visible in the clone
        const svgElements = clonedDoc.querySelectorAll('svg');
        svgElements.forEach((svg) => {
          svg.style.display = 'block';
          svg.style.maxWidth = '100%';
          // Force all text to be black
          const textElements = svg.querySelectorAll('text, tspan, foreignObject, .nodeLabel, .edgeLabel');
          textElements.forEach((el: any) => {
            if (el.style) {
              el.style.fill = '#000000';
              el.style.color = '#000000';
            }
            if (el.setAttribute) {
              el.setAttribute('fill', '#000000');
            }
          });
        });
        
        // Force all text elements to black
        const allText = clonedDoc.querySelectorAll('p, span, div, li, td, th, h1, h2, h3, h4, h5, h6');
        allText.forEach((el: any) => {
          if (el.style) {
            el.style.color = '#000000';
          }
        });
      },
    });
    
    let canvas: HTMLCanvasElement;
    try {
      canvas = await Promise.race([canvasPromise, canvasTimeout]);
      console.log('Canvas rendering complete!');
    } catch (error) {
      console.error('Canvas rendering failed or timed out:', error);
      document.body.removeChild(tempDiv);
      throw new Error('PDF generation timed out after 30 seconds. Try reducing content or simplifying Mermaid diagrams.');
    }
    
    // Remove temp div
    document.body.removeChild(tempDiv);
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.pageSize || 'A4',
      compress: true,
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = options.margin || 12;
    
    // Calculate image dimensions to fit page properly
    const imgWidth = pageWidth - (2 * margin);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Use PNG for better quality with text
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    let heightLeft = imgHeight;
    let position = margin;
    let page = 1;
    
    // Add header to first page
    if (options.includeHeader) {
      addSimplePDFHeader(pdf, options.filename, page);
      position = margin + 15;
    }
    
    // Add watermark if specified
    if (options.watermark) {
      addPDFWatermark(pdf, options.watermark);
    }
    
    // Add first page content
    const availableHeight = pageHeight - position - margin - (options.includeFooter ? 15 : 0);
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, Math.min(imgHeight, availableHeight));
    heightLeft -= availableHeight;
    
    // Add footer to first page
    if (options.includeFooter) {
      addSimplePDFFooter(pdf);
    }
    
    // Add remaining pages
    while (heightLeft > 0) {
      pdf.addPage();
      page++;
      position = margin;
      
      if (options.includeHeader) {
        addSimplePDFHeader(pdf, options.filename, page);
        position = margin + 15;
      }
      
      if (options.watermark) {
        addPDFWatermark(pdf, options.watermark);
      }
      
      const sourceY = imgHeight - heightLeft;
      const availablePageHeight = pageHeight - position - margin - (options.includeFooter ? 15 : 0);
      
      // Create a new canvas for this page section
      const pageCanvas = document.createElement('canvas');
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvas.height - (sourceY * canvas.width / imgWidth), canvas.height);
        
        ctx.drawImage(
          canvas,
          0, sourceY * canvas.width / imgWidth,
          canvas.width, pageCanvas.height,
          0, 0,
          canvas.width, pageCanvas.height
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        const pageImgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;
        
        pdf.addImage(pageImgData, 'PNG', margin, position, imgWidth, Math.min(pageImgHeight, availablePageHeight));
        heightLeft -= availablePageHeight;
      }
      
      if (options.includeFooter) {
        addSimplePDFFooter(pdf);
      }
    }
    
    // Add page numbers
    if (options.includeFooter) {
      addPageNumbers(pdf, page);
    }
    
    // Save PDF
    console.log('Saving PDF file...');
    pdf.save(`${options.filename}.pdf`);
    console.log('PDF saved successfully!');
  } catch (error) {
    console.error('PDF export error:', error);
    
    // Ensure cleanup of temp div
    if (tempDiv && document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
      console.log('Cleaned up temp div after error');
    }
    
    // Throw descriptive error
    const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF. Please try again.';
    throw new Error(errorMessage);
  } finally {
    // Final cleanup check
    if (tempDiv && document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
      console.log('Final cleanup of temp div');
    }
  }
};

// Content block interface for structured PDF generation
interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'blockquote' | 'table' | 'image' | 'hr';
  level?: number;
  content?: string;
  items?: string[];
  language?: string;
  rows?: string[][];
  headers?: string[];
  src?: string;
  alt?: string;
}

// Parse markdown to structured content blocks
const parseMarkdownToStructuredContent = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (!line) {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, '');
      blocks.push({ type: 'heading', level, content: text });
      i++;
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const language = line.replace('```', '').trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', content: codeLines.join('\n'), language });
      i++;
    }
    // Blockquotes
    else if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s*/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join('\n') });
    }
    // Lists
    else if (line.match(/^[\-\*\+]\s/) || line.match(/^\d+\.\s/)) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().match(/^[\-\*\+]\s/) || lines[i].trim().match(/^\d+\.\s/))) {
        items.push(lines[i].trim().replace(/^[\-\*\+\d\.]\s*/, ''));
        i++;
      }
      blocks.push({ type: 'list', items, content: '' });
    }
    // Horizontal rules
    else if (line.match(/^[\-\*_]{3,}$/)) {
      blocks.push({ type: 'hr', content: '' });
      i++;
    }
    // Images
    else if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        blocks.push({ type: 'image', alt: match[1], src: match[2], content: match[1] });
      }
      i++;
    }
    // Tables (simplified detection)
    else if (line.includes('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().includes('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length > 0) {
        const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
        const rows = tableLines.slice(2).map(row => 
          row.split('|').map(cell => cell.trim()).filter(cell => cell)
        );
        blocks.push({ type: 'table', headers, rows, content: '' });
      }
    }
    // Regular paragraphs
    else {
      const paragraphLines: string[] = [];
      while (i < lines.length && lines[i].trim() && !isSpecialLine(lines[i])) {
        paragraphLines.push(lines[i].trim());
        i++;
      }
      if (paragraphLines.length > 0) {
        blocks.push({ type: 'paragraph', content: paragraphLines.join(' ') });
      }
    }
  }

  return blocks;
};

// Check if line is a special markdown line
const isSpecialLine = (line: string): boolean => {
  const trimmed = line.trim();
  return trimmed.startsWith('#') || 
         trimmed.startsWith('```') || 
         trimmed.startsWith('>') || 
         trimmed.match(/^[\-\*\+]\s/) !== null ||
         trimmed.match(/^\d+\.\s/) !== null ||
         trimmed.match(/^[\-\*_]{3,}$/) !== null ||
         trimmed.includes('|');
};

// Enhanced HTML styles
const getEnhancedHTMLStyles = (): string => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.7;
    color: #2c3e50;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    padding: 2rem;
  }

  .document-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .document-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
  }

  .document-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .document-meta {
    font-size: 1rem;
    opacity: 0.9;
  }

  .table-of-contents {
    background: #f8f9fa;
    padding: 2rem;
    border-bottom: 1px solid #e9ecef;
  }

  .toc-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #495057;
  }

  .toc-list {
    list-style: none;
  }

  .toc-item {
    margin: 0.5rem 0;
  }

  .toc-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .toc-link:hover {
    color: #764ba2;
  }

  .content {
    padding: 3rem;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #2c3e50;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    line-height: 1.3;
  }

  h1 {
    font-size: 2.5rem;
    border-bottom: 3px solid #667eea;
    padding-bottom: 0.5rem;
  }

  h2 {
    font-size: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 0.3rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #667eea;
  }

  p {
    margin: 1.5rem 0;
    text-align: justify;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
  }

  a:hover {
    border-bottom-color: #667eea;
    text-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
  }

  code {
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
    border: 1px solid #e9ecef;
    color: #e83e8c;
  }

  pre {
    background: #2c3e50;
    color: #ecf0f1;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  pre code {
    background: none;
    border: none;
    color: inherit;
    padding: 0;
  }

  blockquote {
    border-left: 4px solid #667eea;
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    background: #f8f9fa;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #6c757d;
    position: relative;
  }

  blockquote::before {
    content: '"';
    font-size: 4rem;
    color: #667eea;
    position: absolute;
    top: -0.5rem;
    left: 0.5rem;
    opacity: 0.3;
  }

  ul, ol {
    padding-left: 2rem;
    margin: 1.5rem 0;
  }

  li {
    margin: 0.5rem 0;
  }

  ul li::marker {
    color: #667eea;
  }

  ol li::marker {
    color: #667eea;
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    border: 1px solid #e9ecef;
    padding: 1rem;
    text-align: left;
  }

  th {
    background: #667eea;
    color: white;
    font-weight: 600;
  }

  tr:nth-child(even) {
    background: #f8f9fa;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 2rem 0;
  }

  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    margin: 3rem 0;
  }

  .document-footer {
    background: #f8f9fa;
    padding: 1rem 3rem;
    text-align: center;
    color: #6c757d;
    font-size: 0.9rem;
    border-top: 1px solid #e9ecef;
  }

  @media print {
    body {
      background: white;
      padding: 0;
    }
    
    .document-container {
      box-shadow: none;
      border-radius: 0;
    }
  }
`;



// Generate table of contents from HTML
const generateTableOfContents = (html: string): string => {
  const headingRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, ''); // Remove any HTML tags
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    headings.push({ level, text, id });
  }

  if (headings.length === 0) return '';

  const tocItems = headings.map(heading => {
    const indent = '  '.repeat(heading.level - 1);
    return `${indent}<li class="toc-item"><a href="#${heading.id}" class="toc-link">${heading.text}</a></li>`;
  }).join('');

  return `
    <div class="table-of-contents">
      <h2 class="toc-title">Table of Contents</h2>
      <ul class="toc-list">${tocItems}</ul>
    </div>
  `;
};

// Get document metadata
const getDocumentMetadata = (filename: string, timestamp: string): string => `
  <header class="document-header">
    <h1 class="document-title">${filename}</h1>
    ${timestamp ? `<div class="document-meta">Generated on ${timestamp}</div>` : ''}
  </header>
`;

// Setup PDF styles and fonts with proper encoding
const setupPDFStyles = (pdf: jsPDF, options: PDFExportOptions): void => {
  // Map font family names to jsPDF supported fonts
  const fontMap: { [key: string]: string } = {
    'Georgia': 'times',
    'Helvetica': 'helvetica', 
    'Times': 'times',
    'Courier': 'courier'
  };
  
  const fontFamily = fontMap[options.fontFamily || 'Helvetica'] || 'helvetica';
  
  // Set font with proper encoding
  pdf.setFont(fontFamily, 'normal');
  pdf.setFontSize(options.fontSize || 11);
  pdf.setTextColor(40, 40, 40);
};

// Calculate block height for pagination
const calculateBlockHeight = (pdf: jsPDF, block: ContentBlock, contentWidth: number, options: PDFExportOptions): number => {
  const fontSize = options.fontSize || 11;
  const lineHeight = fontSize * 0.35; // Convert to mm
  
  switch (block.type) {
    case 'heading':
      const headingSize = fontSize + (6 - (block.level || 1)) * 2;
      return headingSize * 0.35 + 8; // Extra spacing for headings
    
    case 'paragraph':
      const lines = pdf.splitTextToSize(block.content || '', contentWidth);
      return lines.length * lineHeight + 4;
    
    case 'list':
      return (block.items?.length || 0) * lineHeight + 4;
    
    case 'code':
      const codeLines = (block.content || '').split('\n');
      return codeLines.length * (lineHeight * 0.9) + 8; // Smaller line height for code
    
    case 'blockquote':
      const quoteLines = pdf.splitTextToSize(block.content || '', contentWidth - 10);
      return quoteLines.length * lineHeight + 8;
    
    case 'table':
      const rowCount = (block.rows?.length || 0) + 1; // +1 for header
      return rowCount * (lineHeight + 4) + 8;
    
    case 'hr':
      return 8;
    
    case 'image':
      return 40; // Fixed height for images
    
    default:
      return lineHeight + 4;
  }
};

// Clean and sanitize text for PDF rendering
const sanitizeTextForPDF = (text: string): string => {
  if (!text) return '';
  
  // Replace problematic characters with safe alternatives
  return text
    .replace(/[""]/g, '"')  // Smart quotes to regular quotes
    .replace(/['']/g, "'")  // Smart apostrophes to regular apostrophes
    .replace(/[–—]/g, '-')  // Em/en dashes to hyphens
    .replace(/…/g, '...')   // Ellipsis to three dots
    .replace(/[^\x00-\x7F]/g, '?') // Replace non-ASCII characters with ?
    .trim();
};

// Render content block with proper text encoding
const renderContentBlock = (pdf: jsPDF, block: ContentBlock, x: number, y: number, contentWidth: number, options: PDFExportOptions): number => {
  const fontSize = options.fontSize || 11;
  let currentY = y;
  
  // Map font family names to jsPDF supported fonts
  const fontMap: { [key: string]: string } = {
    'Georgia': 'times',
    'Helvetica': 'helvetica', 
    'Times': 'times',
    'Courier': 'courier'
  };
  
  const fontFamily = fontMap[options.fontFamily || 'Helvetica'] || 'helvetica';

  switch (block.type) {
    case 'heading':
      const headingSize = fontSize + (6 - (block.level || 1)) * 2;
      pdf.setFontSize(headingSize);
      pdf.setFont(fontFamily, 'bold');
      pdf.setTextColor(30, 30, 30);
      
      // Add some spacing before heading
      currentY += 4;
      const cleanHeading = sanitizeTextForPDF(block.content || '');
      pdf.text(cleanHeading, x, currentY);
      currentY += headingSize * 0.35 + 4;
      
      // Add underline for h1 and h2
      if ((block.level || 1) <= 2) {
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.5);
        pdf.line(x, currentY - 2, x + contentWidth, currentY - 2);
        currentY += 2;
      }
      
      // Reset font
      pdf.setFontSize(fontSize);
      pdf.setFont(fontFamily, 'normal');
      pdf.setTextColor(40, 40, 40);
      break;

    case 'paragraph':
      const lines = pdf.splitTextToSize(block.content || '', contentWidth);
      pdf.text(lines, x, currentY);
      currentY += lines.length * (fontSize * 0.35) + 4;
      break;

    case 'list':
      block.items?.forEach((item) => {
        const bullet = '• ';
        const cleanItem = sanitizeTextForPDF(item);
        const itemText = pdf.splitTextToSize(cleanItem, contentWidth - 10);
        pdf.text(bullet, x, currentY);
        pdf.text(itemText, x + 5, currentY);
        currentY += Math.max(1, itemText.length) * (fontSize * 0.35) + 2;
      });
      currentY += 2;
      break;

    case 'code':
      // Code block background
      pdf.setFillColor(245, 245, 245);
      const cleanCode = sanitizeTextForPDF(block.content || '');
      const codeLines = cleanCode.split('\n');
      const codeHeight = codeLines.length * (fontSize * 0.3) + 6;
      pdf.rect(x, currentY - 2, contentWidth, codeHeight, 'F');
      
      // Code text
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(fontSize - 1);
      pdf.setTextColor(60, 60, 60);
      
      codeLines.forEach((line, lineIndex) => {
        pdf.text(line, x + 3, currentY + (lineIndex * fontSize * 0.3) + 3);
      });
      
      currentY += codeHeight + 4;
      
      // Reset font
      pdf.setFont(fontFamily, 'normal');
      pdf.setFontSize(fontSize);
      pdf.setTextColor(40, 40, 40);
      break;

    case 'blockquote':
      // Quote border
      pdf.setDrawColor(100, 150, 200);
      pdf.setLineWidth(2);
      const cleanQuote = sanitizeTextForPDF(block.content || '');
      const quoteLines = pdf.splitTextToSize(cleanQuote, contentWidth - 10);
      const quoteHeight = quoteLines.length * (fontSize * 0.35) + 4;
      pdf.line(x, currentY, x, currentY + quoteHeight);
      
      // Quote background
      pdf.setFillColor(248, 249, 250);
      pdf.rect(x + 3, currentY - 2, contentWidth - 3, quoteHeight, 'F');
      
      // Quote text
      pdf.setFont(fontFamily, 'italic');
      pdf.setTextColor(80, 80, 80);
      pdf.text(quoteLines, x + 8, currentY + 2);
      currentY += quoteHeight + 4;
      
      // Reset font
      pdf.setFont(fontFamily, 'normal');
      pdf.setTextColor(40, 40, 40);
      break;

    case 'table':
      if (block.headers && block.rows) {
        const colWidth = contentWidth / block.headers.length;
        
        // Table header
        pdf.setFillColor(230, 230, 230);
        pdf.rect(x, currentY, contentWidth, fontSize * 0.5, 'F');
        pdf.setFont(fontFamily, 'bold');
        
        block.headers.forEach((header, headerIndex) => {
          const cleanHeader = sanitizeTextForPDF(header);
          pdf.text(cleanHeader, x + (headerIndex * colWidth) + 2, currentY + fontSize * 0.35);
        });
        
        currentY += fontSize * 0.5 + 2;
        pdf.setFont(fontFamily, 'normal');
        
        // Table rows
        block.rows.forEach((row, rowIndex) => {
          if (rowIndex % 2 === 0) {
            pdf.setFillColor(248, 248, 248);
            pdf.rect(x, currentY, contentWidth, fontSize * 0.4, 'F');
          }
          
          row.forEach((cell, cellIndex) => {
            if (cellIndex < block.headers!.length) {
              const cleanCell = sanitizeTextForPDF(cell);
              pdf.text(cleanCell, x + (cellIndex * colWidth) + 2, currentY + fontSize * 0.3);
            }
          });
          
          currentY += fontSize * 0.4 + 1;
        });
        
        currentY += 4;
      }
      break;

    case 'hr':
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.5);
      pdf.line(x, currentY + 4, x + contentWidth, currentY + 4);
      currentY += 8;
      break;

    case 'image':
      // Placeholder for images
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(250, 250, 250);
      pdf.rect(x, currentY, contentWidth, 30, 'FD');
      pdf.setTextColor(120, 120, 120);
      const cleanAlt = sanitizeTextForPDF(block.alt || 'Image');
      pdf.text(`[Image: ${cleanAlt}]`, x + contentWidth / 2, currentY + 15, { align: 'center' });
      pdf.setTextColor(40, 40, 40);
      currentY += 35;
      break;
  }

  return currentY;
};

// Add simple PDF header
const addSimplePDFHeader = (pdf: jsPDF, filename: string, page: number): void => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header background
  pdf.setFillColor(248, 249, 250);
  pdf.rect(0, 0, pageWidth, 12, 'F');
  
  // Header border
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(0, 12, pageWidth, 12);
  
  // Title
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 60, 60);
  const cleanFilename = sanitizeTextForPDF(filename);
  pdf.text(cleanFilename, pageWidth / 2, 8, { align: 'center' });
};

// Add simple PDF footer
const addSimplePDFFooter = (pdf: jsPDF): void => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Footer border
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(0, pageHeight - 10, pageWidth, pageHeight - 10);
  
  // Footer background
  pdf.setFillColor(248, 249, 250);
  pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  
  // Footer text
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(120, 120, 120);
  pdf.text('Generated by Markdown Editor', 10, pageHeight - 5);
};

// Add page numbers to all pages
const addPageNumbers = (pdf: jsPDF, totalPages: number): void => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 10, pageHeight - 4, { align: 'right' });
  }
};

// Add PDF watermark
const addPDFWatermark = (pdf: jsPDF, watermark: string): void => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  pdf.setFontSize(48);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(200, 200, 200);
  const cleanWatermark = sanitizeTextForPDF(watermark);
  pdf.text(cleanWatermark, pageWidth / 2, pageHeight / 2, { 
    align: 'center',
    angle: 45 
  });
  pdf.setTextColor(40, 40, 40); // Reset color
};

// Generic file download utility
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Legacy functions for backward compatibility
export const downloadMarkdown = (content: string, filename: string): void => {
  downloadFile(content, `${filename}.md`, 'text/markdown');
};

export const downloadHTML = (content: string, filename: string): void => {
  exportToHTML(content, { filename });
};
