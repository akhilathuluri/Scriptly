// AI Writing Assistant using Google Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIConfig {
    apiKey: string;
    model?: string;
}

export type AIAction =
    | 'improve'
    | 'summarize'
    | 'expand'
    | 'simplify'
    | 'fix-grammar'
    | 'change-tone'
    | 'translate'
    | 'complete';

export interface AIRequest {
    action: AIAction;
    text: string;
    context?: string;
    options?: {
        tone?: 'professional' | 'casual' | 'friendly' | 'formal';
        language?: string;
        length?: 'short' | 'medium' | 'long';
    };
}

export interface AIResponse {
    success: boolean;
    result?: string;
    error?: string;
}

class AIAssistant {
    private genAI: GoogleGenerativeAI | null = null;
    private apiKey: string | null = null;

    // Initialize with API key
    initialize(apiKey: string): void {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    // Check if initialized
    isInitialized(): boolean {
        return this.genAI !== null && this.apiKey !== null;
    }

    // Get prompt based on action
    private getPrompt(request: AIRequest): string {
        const { action, text, options } = request;

        const prompts: Record<AIAction, string> = {
            improve: `Improve the following text while maintaining its meaning and style. Make it more clear, concise, and engaging:\n\n${text}`,

            summarize: `Summarize the following text in a ${options?.length || 'medium'} length summary. Keep the key points:\n\n${text}`,

            expand: `Expand the following text with more details, examples, and explanations. Make it more comprehensive:\n\n${text}`,

            simplify: `Simplify the following text to make it easier to understand. Use simpler words and shorter sentences:\n\n${text}`,

            'fix-grammar': `Fix all grammar, spelling, and punctuation errors in the following text. Return only the corrected text:\n\n${text}`,

            'change-tone': `Rewrite the following text in a ${options?.tone || 'professional'} tone:\n\n${text}`,

            translate: `Translate the following text to ${options?.language || 'Spanish'}:\n\n${text}`,

            complete: `Complete the following text naturally and coherently. Continue from where it ends:\n\n${text}`,
        };

        return prompts[action];
    }

    // Process AI request
    async processRequest(request: AIRequest): Promise<AIResponse> {
        if (!this.isInitialized()) {
            return {
                success: false,
                error: 'AI Assistant not initialized. Please add your API key in settings.',
            };
        }

        try {
            const model = this.genAI!.getGenerativeModel({
                model: 'gemini-2.0-flash-lite',
            });

            const prompt = this.getPrompt(request);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                success: true,
                result: text.trim(),
            };
        } catch (error) {
            console.error('AI Assistant error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to process AI request',
            };
        }
    }

    // Stream response for real-time feedback
    async *streamRequest(request: AIRequest): AsyncGenerator<string, void, unknown> {
        if (!this.isInitialized()) {
            throw new Error('AI Assistant not initialized');
        }

        try {
            const model = this.genAI!.getGenerativeModel({
                model: 'gemini-2.0-flash-lite',
            });

            const prompt = this.getPrompt(request);
            const result = await model.generateContentStream(prompt);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                yield chunkText;
            }
        } catch (error) {
            console.error('AI streaming error:', error);
            throw error;
        }
    }
}

// Singleton instance
export const aiAssistant = new AIAssistant();

// Storage keys
const STORAGE_KEYS = {
    API_KEY: 'ai-assistant-api-key',
    AUTO_COMPLETE_ENABLED: 'ai-assistant-auto-complete-enabled',
} as const;

// API Key management
export const saveAPIKey = (apiKey: string): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
        aiAssistant.initialize(apiKey);
    } catch (error) {
        console.error('Failed to save API key:', error);
    }
};

export const getAPIKey = (): string | null => {
    try {
        return localStorage.getItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
        console.error('Failed to get API key:', error);
        return null;
    }
};

export const removeAPIKey = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
        console.error('Failed to remove API key:', error);
    }
};

// Auto-complete settings
export const setAutoCompleteEnabled = (enabled: boolean): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.AUTO_COMPLETE_ENABLED, enabled.toString());
    } catch (error) {
        console.error('Failed to save auto-complete preference:', error);
    }
};

export const getAutoCompleteEnabled = (): boolean => {
    try {
        const value = localStorage.getItem(STORAGE_KEYS.AUTO_COMPLETE_ENABLED);
        return value === 'true';
    } catch (error) {
        console.error('Failed to get auto-complete preference:', error);
        return false;
    }
};

// Auto-complete suggestion
export const getAutoCompleteSuggestion = async (text: string, cursorPosition: number): Promise<string | null> => {
    if (!aiAssistant.isInitialized()) {
        return null;
    }

    try {
        // Get context around cursor (last 200 chars for faster processing)
        const contextStart = Math.max(0, cursorPosition - 200);
        const context = text.substring(contextStart, cursorPosition);

        // Don't suggest if user just typed a space or newline
        const lastChar = context[context.length - 1];
        if (lastChar === ' ' || lastChar === '\n') {
            return null;
        }

        // Get the current line being typed
        const lines = context.split('\n');
        const currentLine = lines[lines.length - 1] || '';

        // Need at least some content on current line
        if (currentLine.trim().length < 5) {
            return null;
        }

        const model = aiAssistant['genAI']!.getGenerativeModel({
            model: 'gemini-2.0-flash-lite',
            generationConfig: {
                maxOutputTokens: 50, // Limit output for faster response
                temperature: 0.7, // Balanced creativity
                topP: 0.8,
                topK: 40,
            },
        });

        // Optimized prompt for faster, more focused responses
        const prompt = `Continue this text naturally (5-15 words only):

${context}`;


        const result = await model.generateContent(prompt);
        const response = result.response;
        const suggestion = response.text().trim();

        // Clean up the suggestion more aggressively
        let cleaned = suggestion
            .replace(/^["'`]+|["'`]+$/g, '') // Remove quotes
            .replace(/^(Continue with:|Continuation:|Complete with:)/i, '') // Remove prompt echoes
            .replace(/^\s+|\s+$/g, '') // Trim whitespace
            .split('\n')[0] // Take only first line
            .trim();

        // Remove any markdown formatting that might have been added
        cleaned = cleaned.replace(/^\*\*|\*\*$/g, '').replace(/^__?|__?$/g, '');

        // Ensure it doesn't start with the last word of the context
        const lastWord = context.trim().split(/\s+/).pop() || '';
        if (cleaned.toLowerCase().startsWith(lastWord.toLowerCase())) {
            cleaned = cleaned.substring(lastWord.length).trim();
        }

        // Must have actual content
        if (cleaned.length < 3) {
            return null;
        }

        return cleaned;
    } catch (error) {
        console.error('Auto-complete error:', error);
        return null;
    }
};

// Initialize on load
export const initializeAIAssistant = (): void => {
    const userKey = getAPIKey();
    if (userKey) {
        aiAssistant.initialize(userKey);
    }
};
