# AI Assistant Setup Guide

The AI Quest Assistant requires an OpenAI API key to function properly. Here's how to set it up:

## 1. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the generated API key

## 2. Set Environment Variable

Create a `.env` file in the project root with:

```bash
OPENAI_API_KEY=your_api_key_here
```

## 3. Restart the Server

After adding the API key, restart the development server:

```bash
npm run dev
```

## 4. Test the AI Assistant

1. Navigate to any task detail page
2. Scroll down to the "AI Quest Assistant" section
3. Type a question like "How should I start this task?"
4. Click the send button or press Enter

## Features

- **Real-time chat interface** with proper scrolling
- **Suggested questions** for quick interaction
- **Context-aware responses** based on the specific task
- **Error handling** with helpful messages
- **Auto-scroll** to new messages

## Troubleshooting

If you see "AI assistance provided!" instead of actual responses:
- Check that your OpenAI API key is correctly set
- Verify the server is running with the environment variable
- Check the browser console for any error messages
- Ensure you have sufficient OpenAI credits

## Alternative: Mock Responses

If you don't want to set up OpenAI, you can modify the server to return mock responses for testing purposes.
