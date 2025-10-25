// Document-aware chatbot using Google Gemini AI
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  documentId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

class DocumentChatbot {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string | null = null;
  private sessions: Map<string, ChatSession> = new Map();

  // Initialize with API key
  initialize(apiKey: string): void {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.loadSessions();
  }

  // Check if initialized
  isInitialized(): boolean {
    return this.genAI !== null && this.apiKey !== null;
  }

  // Get or create chat session for a document
  getSession(documentId: string): ChatSession {
    if (!this.sessions.has(documentId)) {
      this.sessions.set(documentId, {
        documentId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    return this.sessions.get(documentId)!;
  }

  // Clear session for a document
  clearSession(documentId: string): void {
    this.sessions.delete(documentId);
    this.saveSessions().catch(err => console.error('Failed to save:', err));
  }

  // Clear all sessions
  clearAllSessions(): void {
    this.sessions.clear();
    this.saveSessions().catch(err => console.error('Failed to save:', err));
  }

  // Build context from document and chat history
  private buildContext(documentContent: string, messages: ChatMessage[]): string {
    let context = `You are a helpful AI assistant analyzing a markdown document. Here is the document content:\n\n`;
    context += `--- DOCUMENT START ---\n${documentContent}\n--- DOCUMENT END ---\n\n`;
    context += `Please answer questions about this document, provide insights, and help the user understand the content. `;
    context += `You can reference specific parts of the document in your responses.\n\n`;

    if (messages.length > 0) {
      context += `Previous conversation:\n`;
      messages.forEach(msg => {
        context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      context += `\n`;
    }

    return context;
  }

  // Send a message and get response
  async sendMessage(
    documentId: string,
    documentContent: string,
    userMessage: string
  ): Promise<ChatMessage> {
    if (!this.isInitialized()) {
      throw new Error('Chatbot not initialized. Please configure API key.');
    }

    const session = this.getSession(documentId);

    // Add user message to history
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    session.messages.push(userMsg);

    try {
      const model = this.genAI!.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

      // Build context with document and chat history
      const context = this.buildContext(documentContent, session.messages.slice(0, -1));
      const prompt = `${context}\nUser: ${userMessage}\nAssistant:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Add assistant response to history
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: text.trim(),
        timestamp: Date.now(),
      };
      session.messages.push(assistantMsg);

      // Update session timestamp
      session.updatedAt = Date.now();
      this.saveSessions().catch(err => console.error('Failed to save:', err));

      return assistantMsg;
    } catch (error) {
      // Remove user message if request failed
      session.messages.pop();
      console.error('Chatbot error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get response');
    }
  }

  // Stream response (for future enhancement)
  async *streamMessage(
    documentId: string,
    documentContent: string,
    userMessage: string
  ): AsyncGenerator<string, void, unknown> {
    if (!this.isInitialized()) {
      throw new Error('Chatbot not initialized');
    }

    const session = this.getSession(documentId);

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    session.messages.push(userMsg);

    try {
      const model = this.genAI!.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
      const context = this.buildContext(documentContent, session.messages.slice(0, -1));
      const prompt = `${context}\nUser: ${userMessage}\nAssistant:`;

      const result = await model.generateContentStream(prompt);
      let fullResponse = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        yield chunkText;
      }

      // Add complete response to history
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: fullResponse.trim(),
        timestamp: Date.now(),
      };
      session.messages.push(assistantMsg);
      session.updatedAt = Date.now();
      this.saveSessions().catch(err => console.error('Failed to save:', err));
    } catch (error) {
      session.messages.pop();
      throw error;
    }
  }

  // Get chat history for a document
  getChatHistory(documentId: string): ChatMessage[] {
    const session = this.sessions.get(documentId);
    return session ? [...session.messages] : [];
  }

  // Delete a specific message
  deleteMessage(documentId: string, messageId: string): void {
    const session = this.sessions.get(documentId);
    if (session) {
      session.messages = session.messages.filter(msg => msg.id !== messageId);
      session.updatedAt = Date.now();
      this.saveSessions().catch(err => console.error('Failed to save:', err));
    }
  }

  // Save sessions to localStorage and Supabase
  private async saveSessions(): Promise<void> {
    try {
      // Save to localStorage for offline access
      const sessionsArray: Array<[string, ChatSession]> = [];
      this.sessions.forEach((value, key) => {
        sessionsArray.push([key, value]);
      });
      localStorage.setItem('chatbot-sessions', JSON.stringify(sessionsArray));

      // Save to Supabase if user is authenticated
      await this.saveToSupabase();
    } catch (error) {
      console.error('Failed to save chat sessions:', error);
    }
  }

  // Save to Supabase
  private async saveToSupabase(): Promise<void> {
    try {
      const { saveChatHistory } = await import('./database');
      const { getCurrentUser } = await import('./auth');
      
      const user = await getCurrentUser();
      if (!user) return;

      // Save each session to Supabase
      const promises: Promise<any>[] = [];
      this.sessions.forEach((session, documentId) => {
        if (session.messages.length > 0) {
          promises.push(saveChatHistory(user.id, documentId, session.messages));
        }
      });
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
    }
  }

  // Load sessions from localStorage and Supabase
  private async loadSessions(): Promise<void> {
    try {
      // First load from localStorage
      const data = localStorage.getItem('chatbot-sessions');
      if (data) {
        const sessionsData = JSON.parse(data) as Array<[string, ChatSession]>;
        this.sessions = new Map(sessionsData);
      }

      // Then try to load from Supabase
      await this.loadFromSupabase();
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  }

  // Load from Supabase
  private async loadFromSupabase(): Promise<void> {
    try {
      const { getChatHistory } = await import('./database');
      const { getCurrentUser } = await import('./auth');
      
      const user = await getCurrentUser();
      if (!user) return;

      // Load chat history for current documents
      const documentIds: string[] = [];
      this.sessions.forEach((_, documentId) => {
        documentIds.push(documentId);
      });

      for (const documentId of documentIds) {
        const history = await getChatHistory(documentId);
        if (history && history.messages.length > 0) {
          // Convert Supabase messages to ChatMessage format
          const chatMessages: ChatMessage[] = history.messages.map((msg, index) => ({
            id: `msg-${new Date(msg.timestamp).getTime()}-${msg.role}-${index}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).getTime(),
          }));

          this.sessions.set(documentId, {
            documentId,
            messages: chatMessages,
            createdAt: new Date(history.created_at).getTime(),
            updatedAt: new Date(history.updated_at).getTime(),
          });
        }
      }
    } catch (error) {
      console.error('Failed to load from Supabase:', error);
    }
  }

  // Export chat history
  exportChatHistory(documentId: string): string {
    const session = this.sessions.get(documentId);
    if (!session || session.messages.length === 0) {
      return 'No chat history available.';
    }

    let output = `Chat History\n`;
    output += `Document ID: ${documentId}\n`;
    output += `Created: ${new Date(session.createdAt).toLocaleString()}\n`;
    output += `Updated: ${new Date(session.updatedAt).toLocaleString()}\n`;
    output += `Messages: ${session.messages.length}\n`;
    output += `${'='.repeat(60)}\n\n`;

    session.messages.forEach((msg, index) => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      output += `[${time}] ${msg.role === 'user' ? 'You' : 'Assistant'}:\n`;
      output += `${msg.content}\n\n`;
    });

    return output;
  }
}

// Singleton instance
export const documentChatbot = new DocumentChatbot();

// Initialize chatbot with API key
export const initializeChatbot = (): void => {
  // Try to get API key from user settings or company key
  const userKey = localStorage.getItem('ai-assistant-api-key');
  const useCompanyKey = localStorage.getItem('ai-assistant-use-company-key') === 'true';

  if (useCompanyKey) {
    const companyKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (companyKey) {
      documentChatbot.initialize(companyKey);
    }
  } else if (userKey) {
    documentChatbot.initialize(userKey);
  }
};

// Suggested questions based on document content
export const generateSuggestedQuestions = (content: string): string[] => {
  const questions: string[] = [];

  // Check document type and suggest relevant questions
  if (content.includes('```')) {
    questions.push('Can you explain the code in this document?');
  }

  if (content.match(/^#+\s/m)) {
    questions.push('What are the main topics covered in this document?');
  }

  if (content.length > 1000) {
    questions.push('Can you summarize this document?');
  }

  if (content.includes('TODO') || content.includes('FIXME')) {
    questions.push('What tasks or issues are mentioned in this document?');
  }

  // Always include these generic questions
  questions.push(
    'What is this document about?',
    'Can you highlight the key points?',
    'Are there any important details I should know?'
  );

  return questions.slice(0, 5); // Return max 5 suggestions
};
