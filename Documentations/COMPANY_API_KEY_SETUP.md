# Company API Key Setup Guide

## Overview
The markdown editor supports a company-provided Google Gemini API key that can be used by all users. This eliminates the need for individual users to obtain and configure their own API keys.

## Benefits

### For Users
- **No Setup Required**: Users can start using AI features immediately after signing in
- **Free AI Features**: No need to pay for their own API key
- **Seamless Experience**: AI features work out of the box
- **Optional Personal Keys**: Users can still choose to use their own API key if preferred

### For Company
- **Centralized Billing**: All API usage goes through one account
- **Usage Control**: Monitor and control AI feature usage
- **Better Onboarding**: New users can try AI features immediately
- **Cost Management**: Set rate limits and quotas as needed

## Setup Instructions

### 1. Get a Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated API key

### 2. Add to Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyC...your_actual_key_here
```

**Important Notes:**
- The variable must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- Never commit `.env.local` to version control (it's in `.gitignore`)
- Keep your API key secure and rotate it periodically

### 3. Restart Development Server

After adding the environment variable:

```bash
npm run dev
```

The AI features will now use the company API key by default.

## How It Works

### Default Behavior
1. When a user signs in, the app checks for a company API key
2. If available, it's used automatically (no user configuration needed)
3. Users see "Use Company API Key" option in settings (enabled by default)
4. All AI features work immediately

### User Override
Users can still provide their own API key:
1. Go to Settings → AI Settings
2. Toggle off "Use Company API Key"
3. Enter their personal Google Gemini API key
4. Save settings

### Fallback Logic
```typescript
// Priority order:
1. If user chose company key → use company key
2. If user has personal key → use personal key
3. If no personal key and company key exists → use company key
4. Otherwise → show "configure API key" message
```

## Settings UI

### When Company Key is Available
- Shows green highlighted "Use Company API Key" option
- Marked as "Recommended"
- Enabled by default for new users
- Personal API key section hidden when company key is active

### When Company Key is Not Available
- Shows info message: "No Company API Key Available"
- Only personal API key option shown
- Users must provide their own key

## Security Considerations

### API Key Storage
- Company key: Stored in environment variables (server-side)
- User keys: Stored in browser localStorage (client-side only)
- Neither is sent to your backend servers

### Rate Limiting
Consider implementing rate limiting to prevent abuse:
- Per-user request limits
- Daily/monthly quotas
- Throttling for heavy usage

### Cost Management
Monitor your Google Cloud billing:
- Set up billing alerts
- Review usage regularly
- Consider implementing usage analytics

## Testing

### Verify Company Key is Working

1. **Check Environment Variable**:
   ```bash
   # In your terminal
   echo $NEXT_PUBLIC_GEMINI_API_KEY
   ```

2. **Test in Browser Console**:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'Key loaded' : 'No key');
   ```

3. **Test AI Features**:
   - Sign in to the app
   - Go to Settings → AI Settings
   - Verify "Use Company API Key" option is visible and enabled
   - Try using AI assistant, auto-complete, or document chat

### Troubleshooting

**AI Features Not Working**
- Check if `.env.local` file exists in project root
- Verify the variable name is exactly `NEXT_PUBLIC_GEMINI_API_KEY`
- Restart the development server after adding the variable
- Check browser console for any error messages

**"No Company API Key Available" Message**
- Environment variable not set or misspelled
- Development server not restarted after adding variable
- Using `.env` instead of `.env.local` (use `.env.local` for local development)

**API Key Invalid Error**
- Verify the API key is correct and active
- Check Google Cloud Console for key status
- Ensure billing is enabled on your Google Cloud project

## Production Deployment

### Vercel
```bash
# Add environment variable in Vercel dashboard
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

### Netlify
```bash
# Add in Netlify environment variables
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

### Docker
```dockerfile
# In docker-compose.yml
environment:
  - NEXT_PUBLIC_GEMINI_API_KEY=${GEMINI_API_KEY}
```

### Other Platforms
Add the environment variable through your platform's dashboard or CLI.

## Usage Analytics (Optional)

Consider tracking AI feature usage:

```typescript
// Example analytics tracking
const trackAIUsage = (userId: string, feature: string) => {
  // Log to your analytics service
  analytics.track('ai_feature_used', {
    userId,
    feature,
    timestamp: new Date(),
    apiKeyType: 'company',
  });
};
```

## Cost Estimation

Google Gemini API pricing (as of 2024):
- **Gemini 2.0 Flash Lite**: Very low cost per request
- **Free Tier**: Generous free quota available
- **Paid Tier**: Pay-as-you-go pricing

Monitor your usage in [Google Cloud Console](https://console.cloud.google.com/).

## Best Practices

1. **Rotate Keys Regularly**: Change your API key every 3-6 months
2. **Monitor Usage**: Set up alerts for unusual activity
3. **Set Quotas**: Limit requests per user/day to control costs
4. **Cache Results**: Reduce API calls by caching common requests
5. **Rate Limit**: Implement rate limiting to prevent abuse
6. **Audit Logs**: Keep logs of AI feature usage for security

## Support

If users encounter issues:
1. Check Settings → AI Settings for status indicator
2. Verify they're signed in (AI features require authentication)
3. Try toggling between company and personal API key
4. Clear browser cache and reload
5. Check browser console for error messages

## Future Enhancements

Consider implementing:
- Usage dashboards for admins
- Per-user usage limits
- Premium tiers with higher limits
- Custom AI model selection
- Usage reports and analytics
