# Troubleshooting Guide

## Build/Compile Errors

### ✅ FIXED: Module not found: '@/components/ui/use-toast'

**Error**:
```
Module not found: Can't resolve '@/components/ui/use-toast'
```

**Solution**: 
The toast hook is located in `@/hooks/use-toast`, not `@/components/ui/use-toast`.

**Fixed in**:
- `components/ai-assistant-dialog.tsx`
- `components/ai-settings-dialog.tsx`

---

## Common Issues

### 1. TypeScript Errors

**Issue**: TypeScript compilation errors
```bash
npm run typecheck
```

**Common fixes**:
- Ensure all dependencies are installed: `npm install`
- Check for missing type definitions
- Verify import paths are correct

### 2. Missing Dependencies

**Issue**: Module not found errors

**Solution**:
```bash
# Install all dependencies
npm install

# If specific package missing
npm install @google/generative-ai
```

### 3. Environment Variables

**Issue**: AI features not working

**Check**:
1. Is API key configured in settings?
2. Is `.env.local` file present (if using company key)?
3. Is the environment variable named correctly?

```env
# Correct format
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

### 4. KaTeX Not Loading

**Issue**: Math equations not rendering

**Possible causes**:
- No internet connection (KaTeX loads from CDN)
- Ad blocker blocking CDN
- Browser console shows errors

**Solution**:
1. Check browser console for errors
2. Verify internet connection
3. Try disabling ad blockers
4. Refresh the page

### 5. AI API Errors

**Issue**: AI requests failing

**Common causes**:
- Invalid API key
- API quota exceeded
- Network issues
- API key not initialized

**Solutions**:
1. Verify API key in settings (⚙️)
2. Check Google AI Studio for quota: https://makersuite.google.com
3. Check browser console for specific error
4. Try removing and re-adding API key

### 6. Word Count Not Updating

**Issue**: Word count stuck or incorrect

**Solution**:
- Refresh the page
- Check if content is actually changing
- Clear browser cache

### 7. Text Selection Not Working

**Issue**: AI button not enabling when text selected

**Solution**:
- Make sure you're selecting text in the editor (left pane)
- Try clicking the AI button after selection
- Refresh the page if issue persists

---

## Development Issues

### Hot Reload Not Working

**Issue**: Changes not reflecting

**Solution**:
```bash
# Stop the dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

### Port Already in Use

**Issue**: Port 3000 already in use

**Solution**:
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build Fails

**Issue**: Production build fails

**Solution**:
```bash
# Clean build
rm -rf .next out

# Try build again
npm run build
```

---

## Runtime Errors

### 1. "AI Assistant not initialized"

**Cause**: No API key configured

**Solution**:
1. Click Settings (⚙️) in toolbar
2. Add API key or enable company key
3. Click "Save Settings"

### 2. "KaTeX not loaded"

**Cause**: KaTeX failed to load from CDN

**Solution**:
1. Check internet connection
2. Wait a few seconds and try again
3. Refresh the page
4. Check browser console for errors

### 3. "Failed to process AI request"

**Cause**: API error or network issue

**Solution**:
1. Check API key is valid
2. Verify internet connection
3. Check API quota not exceeded
4. Try again in a few moments

---

## Browser-Specific Issues

### Safari

**Issue**: Some features not working

**Solution**:
- Ensure Safari is up to date (v17+)
- Check if localStorage is enabled
- Try disabling "Prevent Cross-Site Tracking"

### Firefox

**Issue**: Styling issues

**Solution**:
- Clear browser cache
- Ensure Firefox is up to date (v120+)
- Check if hardware acceleration is enabled

### Edge

**Issue**: Performance issues

**Solution**:
- Clear browser cache
- Disable unnecessary extensions
- Ensure Edge is up to date (v120+)

---

## Performance Issues

### Slow Rendering

**Possible causes**:
- Very large document (>50k words)
- Many math equations
- Complex markdown

**Solutions**:
- Split large documents into smaller ones
- Reduce number of math equations on screen
- Disable preview temporarily

### High Memory Usage

**Cause**: Large documents or many open tabs

**Solution**:
- Close unused browser tabs
- Refresh the page
- Clear browser cache

---

## API Key Issues

### Can't Save API Key

**Issue**: Settings not saving

**Solution**:
1. Check if localStorage is enabled in browser
2. Check browser console for errors
3. Try incognito/private mode
4. Clear browser data and try again

### API Key Not Working

**Issue**: Valid key but AI not working

**Solution**:
1. Remove API key from settings
2. Refresh the page
3. Re-add API key
4. Verify key at: https://makersuite.google.com/app/apikey

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check browser console for errors (F12)
3. ✅ Try refreshing the page
4. ✅ Try in incognito/private mode
5. ✅ Check if issue persists in different browser

### Information to Provide

When reporting issues, include:
- Browser and version
- Operating system
- Error message (exact text)
- Browser console errors
- Steps to reproduce
- Screenshots if applicable

### Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Clear all caches
npm cache clean --force
rm -rf node_modules .next
npm install

# Run type check
npm run typecheck

# Run linter
npm run lint
```

---

## Quick Fixes

### Nuclear Option (Reset Everything)

If nothing else works:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Remove everything
rm -rf node_modules .next out

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall
npm install

# 5. Restart
npm run dev
```

### Clear Browser Data

1. Open browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Select "Cookies and site data"
5. Clear data
6. Refresh the page

---

## Still Having Issues?

1. Check the documentation:
   - FEATURES.md
   - SETUP.md
   - QUICK_REFERENCE.md

2. Check browser console (F12) for errors

3. Try the nuclear option above

4. Contact support with:
   - Error details
   - Browser console logs
   - Steps to reproduce

---

## Known Limitations

1. **Math Equations**: Requires internet for KaTeX CDN
2. **AI Features**: Requires API key and internet
3. **Large Documents**: May be slow with >100k words
4. **Browser Support**: Requires modern browser (2023+)
5. **Mobile**: Some features optimized for desktop

---

## Success Checklist

After fixing issues, verify:

- [ ] App loads without errors
- [ ] Word count displays correctly
- [ ] Math equations render (try: `$x^2$`)
- [ ] AI settings accessible
- [ ] Can select text and use AI
- [ ] Export features work
- [ ] No console errors

---

**Last Updated**: After fixing toast import path issue
