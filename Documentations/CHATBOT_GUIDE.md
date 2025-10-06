# Document Chatbot Guide

## Overview
The Document Chatbot is an AI-powered assistant that can answer questions about your current document, provide insights, and help you understand your content better. It remembers your conversation history for context-aware responses.

---

## How to Access

Click the **floating chat button** (💬) in the bottom-right corner of the screen to open the chatbot panel.

---

## Features

### 1. **Document-Aware Conversations** 📄
- Chatbot has full access to your current document
- Can reference specific parts of your content
- Understands document structure and context
- Provides relevant, accurate answers

### 2. **Conversation Memory** 🧠
- Remembers all previous messages in the conversation
- Maintains context across multiple questions
- Can reference earlier parts of the conversation
- Separate history for each document

### 3. **Suggested Questions** 💡
- Smart suggestions based on document content
- Quick-start questions for new conversations
- One-click to ask common questions
- Adapts to document type

### 4. **Export & Management** 💾
- Export chat history as text file
- Clear conversation history
- Persistent storage (survives page refresh)
- Per-document conversation tracking

---

## How to Use

### Starting a Conversation

1. **Open the chatbot** - Click the 💬 button
2. **Type your question** - Ask anything about your document
3. **Press Enter** - Send your message
4. **Get AI response** - Wait for the assistant's answer

### Example Questions

**General Understanding:**
- "What is this document about?"
- "Can you summarize the main points?"
- "What are the key takeaways?"

**Specific Content:**
- "Explain the code in section 3"
- "What does the author mean by [concept]?"
- "Can you elaborate on [topic]?"

**Analysis:**
- "What are the strengths of this argument?"
- "Are there any gaps in this content?"
- "What could be improved?"

**Tasks & Actions:**
- "What tasks are mentioned in this document?"
- "What are the next steps?"
- "What deadlines are mentioned?"

**Technical Help:**
- "Explain this code snippet"
- "What does this function do?"
- "How does this algorithm work?"

---

## Suggested Questions

The chatbot automatically generates relevant questions based on your document:

### For Code-Heavy Documents
- "Can you explain the code in this document?"
- "What programming concepts are used here?"

### For Long Documents
- "Can you summarize this document?"
- "What are the main sections?"

### For Documents with TODOs
- "What tasks or issues are mentioned?"
- "What needs to be completed?"

### Always Available
- "What is this document about?"
- "Can you highlight the key points?"
- "Are there any important details I should know?"

---

## Features in Detail

### Context-Aware Responses
The chatbot understands:
- **Document structure** - Headings, sections, lists
- **Code blocks** - Programming languages, syntax
- **Links and references** - External resources
- **Formatting** - Bold, italic, emphasis
- **Previous messages** - Your conversation history

### Conversation Memory
Each document has its own conversation:
- **Persistent** - Saved across sessions
- **Contextual** - References earlier messages
- **Organized** - Separate per document
- **Exportable** - Download for records

### Smart Suggestions
Suggestions adapt to:
- **Document length** - Different for short vs long
- **Content type** - Code, text, mixed
- **Special markers** - TODOs, FIXMEs, notes
- **Structure** - Headings, sections, organization

---

## Use Cases

### 1. **Understanding Complex Content**
```
You: "This document has a lot of technical terms. Can you explain them?"
Bot: "I'll explain the key technical terms:
1. API - Application Programming Interface...
2. REST - Representational State Transfer...
[detailed explanations]"
```

### 2. **Code Review**
```
You: "Review the code in this document"
Bot: "I've analyzed the code. Here are my observations:
✅ Good practices: Clear variable names, proper error handling
⚠️ Suggestions: Consider adding comments, extract repeated logic
[detailed review]"
```

### 3. **Content Summarization**
```
You: "Summarize this in 3 bullet points"
Bot: "Here's a summary:
• Main topic: [topic]
• Key argument: [argument]
• Conclusion: [conclusion]"
```

### 4. **Learning & Research**
```
You: "I don't understand section 2. Can you explain it differently?"
Bot: "Let me explain section 2 in simpler terms:
[simplified explanation with examples]"
```

### 5. **Task Extraction**
```
You: "What do I need to do based on this document?"
Bot: "Based on the document, here are your action items:
1. [Task 1] - Priority: High
2. [Task 2] - Deadline: [date]
[complete task list]"
```

---

## Tips & Best Practices

### 1. **Be Specific**
❌ "Tell me about this"
✅ "Explain the authentication flow in section 3"

### 2. **Use Follow-ups**
The chatbot remembers context:
```
You: "What's the main algorithm?"
Bot: [explains algorithm]
You: "Can you show an example?" ← References previous answer
Bot: [provides example of the algorithm]
```

### 3. **Ask for Different Formats**
- "Explain this as a list"
- "Summarize in one paragraph"
- "Break this down step-by-step"
- "Give me examples"

### 4. **Request Clarification**
- "Can you explain that more simply?"
- "What do you mean by [term]?"
- "Can you elaborate on [point]?"

### 5. **Use for Different Purposes**
- **Learning** - "Teach me about [concept]"
- **Review** - "Check this for errors"
- **Planning** - "What should I do next?"
- **Analysis** - "What's missing from this?"

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Send message | Enter |
| New line | Shift + Enter |
| Close chatbot | ESC or click X |
| Focus input | Click in chat panel |

---

## Managing Conversations

### Export Chat History
1. Click the **Download icon** (⬇️) in the header
2. Saves as `.txt` file
3. Includes timestamps and full conversation
4. Named with document title and date

### Clear Chat History
1. Click the **Refresh icon** (🔄) in the header
2. Confirms before clearing
3. Removes all messages for current document
4. Starts fresh conversation

### Automatic Saving
- Conversations saved automatically
- Persists across page refreshes
- Separate history per document
- Stored locally in browser

---

## Privacy & Security

### Data Storage
- **Local only** - Conversations stored in browser
- **Not on servers** - No data sent to our servers
- **Per device** - Not synced across devices
- **Clearable** - You can delete anytime

### API Communication
- **Direct to Google** - Messages sent to Google Gemini API
- **Your API key** - Uses your configured key
- **No intermediary** - No third-party access
- **Encrypted** - HTTPS communication

### What the Bot Knows
✅ **Has access to**:
- Current document content
- Your conversation history
- Document structure

❌ **Does NOT have access to**:
- Other documents
- Your personal information
- Files on your computer
- Other browser tabs

---

## Troubleshooting

### Chatbot Not Responding
**Causes**:
- API key not configured
- No internet connection
- API quota exceeded
- Invalid API key

**Solutions**:
1. Check API key in Settings (⚙️)
2. Verify internet connection
3. Check Google AI Studio for quota
4. Try refreshing the page

### Incorrect or Irrelevant Answers
**Causes**:
- Document content unclear
- Question too vague
- Context misunderstood

**Solutions**:
1. Be more specific in your question
2. Provide more context
3. Rephrase your question
4. Break complex questions into parts

### Conversation Not Saving
**Causes**:
- Browser storage disabled
- Private/incognito mode
- Storage quota exceeded

**Solutions**:
1. Enable localStorage in browser
2. Use normal browsing mode
3. Clear old chat histories
4. Check browser settings

### Slow Responses
**Causes**:
- Large document
- Complex question
- API server load

**Solutions**:
1. Wait patiently (usually 2-5 seconds)
2. Simplify your question
3. Break into smaller questions
4. Check internet speed

---

## Advanced Features

### Multi-Turn Conversations
The chatbot maintains context:
```
Turn 1: "What's the main topic?"
Turn 2: "Can you explain it more?" ← Knows "it" = main topic
Turn 3: "Give me an example" ← Knows what to exemplify
```

### Document Updates
- Chatbot always uses latest document content
- Edit document and ask about changes
- No need to restart conversation

### Smart Context
The bot understands:
- **References** - "the code above", "that section"
- **Pronouns** - "it", "this", "that"
- **Implicit context** - From previous messages
- **Document structure** - Sections, headings

---

## Best Practices Summary

✅ **Do**:
- Ask specific questions
- Use follow-up questions
- Export important conversations
- Clear old chats periodically
- Be patient with responses

❌ **Don't**:
- Ask about other documents
- Expect instant responses
- Share sensitive information
- Rely solely on AI answers
- Forget to verify information

---

## Example Conversations

### Learning Session
```
You: What is this document about?
Bot: This document is a technical guide about REST APIs...

You: What's a REST API?
Bot: REST API stands for Representational State Transfer...

You: Can you give me an example?
Bot: Sure! Here's a simple example: [example]

You: How would I implement this?
Bot: To implement this, you would: [steps]
```

### Code Review
```
You: Review the code in this document
Bot: I've analyzed the code. Here are my findings: [review]

You: What about the error handling?
Bot: The error handling could be improved by: [suggestions]

You: Show me an example
Bot: Here's how you could improve it: [code example]
```

### Content Analysis
```
You: Summarize the key points
Bot: The key points are: [summary]

You: What's the main argument?
Bot: The main argument is: [argument]

You: Are there any weaknesses?
Bot: Some potential weaknesses include: [analysis]
```

---

## FAQ

**Q: Does the chatbot work offline?**
A: No, it requires internet to communicate with Google's AI API.

**Q: Can I use it with multiple documents?**
A: Yes! Each document has its own separate conversation history.

**Q: How long is the conversation history kept?**
A: Indefinitely, until you clear it or clear browser data.

**Q: Can others see my conversations?**
A: No, conversations are stored locally on your device only.

**Q: Does it cost money to use?**
A: It uses your Google Gemini API key. Check Google's pricing for details.

**Q: Can I customize the chatbot's behavior?**
A: Currently no, but this may be added in future updates.

**Q: What if the chatbot gives wrong information?**
A: Always verify important information. The AI can make mistakes.

---

## Future Enhancements

Coming soon:
- [ ] Streaming responses (real-time)
- [ ] Voice input/output
- [ ] Multi-document conversations
- [ ] Custom prompts/personalities
- [ ] Conversation search
- [ ] Message editing
- [ ] Conversation branching

---

**Chat with your documents intelligently! 💬**
