// Math equation rendering using KaTeX
// This module handles LaTeX math rendering in markdown

export interface MathRenderOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
}

// Check if KaTeX is available
export const isKaTeXAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'katex' in window;
};

// Render math equation
export const renderMath = (
  latex: string,
  options: MathRenderOptions = {}
): string => {
  if (!isKaTeXAvailable()) {
    return `<span class="math-error">KaTeX not loaded</span>`;
  }

  try {
    const katex = (window as any).katex;
    return katex.renderToString(latex, {
      displayMode: options.displayMode || false,
      throwOnError: options.throwOnError || false,
      errorColor: options.errorColor || '#cc0000',
      output: 'html',
    });
  } catch (error) {
    console.error('Math rendering error:', error);
    return `<span class="math-error">${latex}</span>`;
  }
};

// Process markdown with math equations
export const processMathInMarkdown = (markdown: string): string => {
  if (!markdown) return markdown;

  // Process display math ($$...$$)
  markdown = markdown.replace(
    /\$\$([\s\S]+?)\$\$/g,
    (match, latex) => {
      const rendered = renderMath(latex.trim(), { displayMode: true });
      return `<div class="math-display">${rendered}</div>`;
    }
  );

  // Process inline math ($...$)
  markdown = markdown.replace(
    /\$([^\$\n]+?)\$/g,
    (match, latex) => {
      const rendered = renderMath(latex.trim(), { displayMode: false });
      return `<span class="math-inline">${rendered}</span>`;
    }
  );

  return markdown;
};

// Load KaTeX dynamically
export const loadKaTeX = async (): Promise<boolean> => {
  if (isKaTeXAvailable()) {
    return true;
  }

  try {
    // Load KaTeX CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    cssLink.integrity = 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV';
    cssLink.crossOrigin = 'anonymous';
    document.head.appendChild(cssLink);

    // Load KaTeX JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.integrity = 'sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8';
    script.crossOrigin = 'anonymous';

    return new Promise((resolve) => {
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Failed to load KaTeX:', error);
    return false;
  }
};

// Common math symbols and templates
export const mathTemplates = {
  fraction: '\\frac{numerator}{denominator}',
  sqrt: '\\sqrt{x}',
  power: 'x^{n}',
  subscript: 'x_{n}',
  sum: '\\sum_{i=1}^{n} x_i',
  integral: '\\int_{a}^{b} f(x) dx',
  limit: '\\lim_{x \\to \\infty} f(x)',
  matrix: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
  greek: '\\alpha, \\beta, \\gamma, \\delta, \\theta, \\pi, \\sigma',
  operators: '\\times, \\div, \\pm, \\leq, \\geq, \\neq, \\approx',
};

// Get math template
export const getMathTemplate = (name: keyof typeof mathTemplates): string => {
  return mathTemplates[name] || '';
};
