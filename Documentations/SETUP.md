# Setup Guide for New Features

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

The `@google/generative-ai` package is already included in package.json.

### 2. Configure Environment Variables (Optional)

Create a `.env.local` file in the root directory:

```env
# Optional: Company API key for AI features
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Users can also add their own API keys through the UI, so this is optional.

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Feature Configuration

### Word Count Display
✅ **No configuration needed** - Works out of the box!

### Math Equations
✅ **No configuration needed** - KaTeX loads automatically from CDN

To use math equations:
- Inline: `$E = mc^2$`
- Display: `$$\int_{0}^{\infty} e^{-x^2} dx$$`

### AI Writing Assistant

#### Option 1: Company API Key (Recommended for Teams)
1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   ```
3. Users can toggle "Use Company API Key" in settings

#### Option 2: Personal API Keys (Recommended for Individual Users)
1. Users click Settings (⚙️) in the toolbar
2. Click "Open Google AI Studio" link
3. Create their own API key
4. Paste into the settings dialog
5. Click "Save Settings"

---

## Testing the Features

### Test Word Count
1. Open the editor
2. Type some text
3. Click the word count button in the toolbar
4. Verify statistics are accurate

### Test Math Equations
1. Type: `The formula $E = mc^2$ is famous`
2. Check preview shows rendered equation
3. Try display math:
   ```markdown
   $$
   x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
   $$
   ```
4. Use the Σ button to insert templates

### Test AI Assistant
1. Configure API key in settings
2. Type some text and select it
3. Click the AI button (✨)
4. Try different actions:
   - Improve
   - Summarize
   - Fix Grammar
   - Translate
5. Verify results are applied correctly

---

## File Structure

```
markdown-editor/
├── lib/
│   ├── word-count.ts           # Word counting logic
│   ├── math-renderer.ts        # Math equation rendering
│   ├── ai-assistant.ts         # AI assistant core
│   └── markdown.ts             # Enhanced markdown parser
├── components/
│   ├── word-count-display.tsx  # Word count UI
│   ├── math-toolbar.tsx        # Math toolbar
│   ├── ai-assistant-dialog.tsx # AI dialog
│   ├── ai-settings-dialog.tsx  # AI settings
│   ├── editor.tsx              # Updated editor
│   ├── editor-toolbar.tsx      # Updated toolbar
│   └── editor-textarea.tsx     # Updated textarea
├── app/
│   └── globals.css             # Updated styles
├── FEATURES.md                 # Feature documentation
├── SETUP.md                    # This file
└── package.json                # Dependencies
```

---

## API Key Management

### Getting a Google Gemini API Key

1. **Visit Google AI Studio**
   - URL: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Choose "Create API key in new project" or use existing project
   - Copy the generated key

3. **API Key Limits**
   - Free tier: 60 requests per minute
   - Check current limits at: https://ai.google.dev/pricing

### Security Best Practices

- ✅ **DO**: Store company keys in `.env.local` (not committed to git)
- ✅ **DO**: Use environment variables for production
- ✅ **DO**: Inform users their personal keys are stored locally
- ❌ **DON'T**: Commit API keys to version control
- ❌ **DON'T**: Share API keys publicly
- ❌ **DON'T**: Use personal keys in production for company apps

---

## Troubleshooting

### Build Errors

**Error**: `Module not found: @google/generative-ai`
```bash
npm install @google/generative-ai
```

**Error**: TypeScript errors
```bash
npm run typecheck
```

### Runtime Errors

**KaTeX not loading**
- Check internet connection (KaTeX loads from CDN)
- Check browser console for errors
- Verify no ad blockers blocking CDN

**AI Assistant not working**
- Verify API key is configured
- Check browser console for API errors
- Verify API key has not exceeded quota
- Check internet connection

### Performance Issues

**Slow word count**
- Word count is memoized and should be fast
- Check if document is extremely large (>100k words)

**Math rendering slow**
- KaTeX loads once and caches
- Complex equations may take longer to render

**AI requests slow**
- AI requests depend on Google's API response time
- Typically 2-5 seconds for most requests
- Check network tab in browser dev tools

---

## Development Tips

### Adding New AI Actions

Edit `lib/ai-assistant.ts`:

```typescript
export type AIAction = 
  | 'improve'
  | 'summarize'
  | 'your-new-action'; // Add here

// Add prompt in getPrompt method
private getPrompt(request: AIRequest): string {
  const prompts: Record<AIAction, string> = {
    // ... existing prompts
    'your-new-action': `Your prompt here: ${text}`,
  };
  return prompts[action];
}
```

### Adding New Math Templates

Edit `lib/math-renderer.ts`:

```typescript
export const mathTemplates = {
  // ... existing templates
  yourTemplate: '\\your{latex}',
};
```

### Customizing Word Count

Edit `lib/word-count.ts` to adjust:
- Reading speed (default: 200 words/minute)
- What counts as a word
- Markdown syntax to ignore

---

## Production Deployment

### Environment Variables
Set in your hosting platform:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_production_key
```

### Build Optimization
```bash
npm run build
```

### Static Export
The app is configured for static export:
```bash
npm run build
# Output in 'out' directory
```

---

## Support & Resources

- **Google Gemini API Docs**: https://ai.google.dev/docs
- **KaTeX Documentation**: https://katex.org/docs/supported.html
- **Next.js Documentation**: https://nextjs.org/docs

---

## License
Same as the main project.
