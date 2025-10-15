# Godex

A state-of-the-art AI coding assistant powered by Google's Gemini 2.5 Pro, inspired by OpenAI Codex.

## Overview

Godex is a modern web application that provides an intelligent coding assistant interface, capable of reasoning over complex problems in code, math, and STEM. Built with React, TypeScript, and Vite, it leverages Gemini 2.5 Pro's advanced capabilities including long context understanding and sophisticated reasoning.

## Features

- **Advanced AI Reasoning**: Powered by Gemini 2.5 Pro for complex code analysis and problem-solving
- **Rich Markdown Support**: Full markdown rendering with syntax-highlighted code blocks
- **Modern UI**: Clean, dark-themed interface inspired by OpenAI Codex
- **Real-time Chat**: Interactive conversation with the AI assistant
- **Code Analysis**: Analyze codebases, debug issues, and get optimization suggestions
- **Long Context**: Handle large documents and codebases with Gemini's 1M+ token context window

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Backend**: Express 5 with TypeScript (tsx)
- **Build Tool**: Vite 7
- **AI SDK**: Vercel AI SDK (@ai-sdk/google)
- **AI Model**: Google Gemini 2.5 Pro with thinking mode
- **UI Components**: AI Elements (optional)
- **Styling**: Custom CSS with modern design patterns
- **Code Highlighting**: react-syntax-highlighter with Prism
- **Markdown**: react-markdown for rich text rendering

## Project Structure

```
├── server/
│   └── api.js                  # Backend API server (Express)
├── src/
│   ├── lib/
│   │   ├── gemini.ts           # Gemini API integration
│   │   └── api-client.ts       # Frontend API client
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
├── public/                     # Static assets
├── test-godex.js               # Backend unit tests
├── test-integration.js         # Full stack integration tests
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies
```

## Architecture

### Secure Backend-Frontend Architecture

Godex uses a secure client-server architecture to protect API keys and enable production-ready deployment:

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │  HTTP   │   Backend    │   AI    │   Gemini     │
│  (React)    │ ◄────► │   API        │  SDK    │   2.5 Pro    │
│  Port 5000  │         │  Port 3001   │ ◄────► │  (Google)    │
└─────────────┘         └──────────────┘         └──────────────┘
```

**Benefits:**
- API keys never exposed to the browser
- Scalable backend for rate limiting and caching
- Clear separation of concerns
- Production-ready architecture

## Environment Variables

- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Gemini API key (get it from https://aistudio.google.com/app/apikey)

## Key Capabilities

### Gemini 2.5 Pro Features Used
- **Advanced Reasoning**: Complex problem-solving in code, math, and STEM with thinking mode
- **Long Context**: Up to 1,048,576 input tokens (1M+ tokens)
- **Thinking Mode**: Enhanced reasoning with configurable thinking budget (up to 24K tokens)
- **Vercel AI SDK**: Streaming support with `streamText` and `generateText`
- **Reasoning Display**: Shows AI's thinking process when available
- **Code Execution**: Built-in code execution capabilities
- **Function Calling**: Structured API interactions

### Application Features
- Chat interface with message history
- Syntax highlighting for 100+ programming languages
- Markdown formatting for rich responses
- Responsive design for all screen sizes
- Error handling and loading states
- Quick suggestion prompts

## Testing

Godex has comprehensive test coverage to ensure all features work correctly:

### Test Suites

1. **Backend Unit Tests** (`test-godex.js`)
   - Tests Gemini API integration
   - Verifies streaming functionality
   - Validates reasoning/thinking mode
   - Checks code analysis capabilities
   - Run with: `node test-godex.js`

2. **Integration Tests** (`test-integration.js`)
   - End-to-end testing of full stack
   - API health checks
   - Message streaming (SSE)
   - Code analysis endpoints
   - Run with: `node test-integration.js`

### Test Results
All tests passing (8/8) - See TEST_RESULTS.md for detailed report

## Recent Changes

**October 15, 2025 - v2.1 - Production Ready**
- **Security Enhancement**: Implemented secure backend-frontend architecture
- Created Express backend API server (port 3001)
- Updated frontend to use secure API client
- Added comprehensive testing suite (8 tests, all passing)
- Verified all AI SDK features working correctly
- Created detailed test results documentation

**October 15, 2025 - v2.0**
- **Major Upgrade**: Migrated to Vercel AI SDK for better streaming and integration
- Added Gemini 2.5 Pro thinking mode with configurable thinking budget
- Implemented reasoning/thinking display in the UI (collapsible sections)
- Enhanced error handling and response processing
- Added AI Elements package for potential future UI enhancements

**October 15, 2025 - v1.0**
- Initial project setup with Vite + React + TypeScript
- Integrated Gemini 2.5 Pro API
- Created modern UI inspired by OpenAI Codex
- Added markdown and syntax highlighting support
- Configured for Replit deployment

## Development

### Running the Application

Two workflows are configured and running:

1. **Godex (Frontend)** - Port 5000
   - Command: `npm run dev`
   - Vite dev server with HMR
   - Accessible via browser preview

2. **Backend API** - Port 3001
   - Command: `npm run dev:api`
   - Express server with AI SDK integration
   - Handles secure API requests

### API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/message` - Send message (non-streaming)
- `POST /api/stream` - Stream message (SSE)
- `POST /api/analyze` - Analyze code

## Architecture Notes

- Secure backend-frontend separation
- API keys protected on server side
- Server-Side Events (SSE) for streaming
- Implements conversation history management
- Custom markdown renderer with code syntax highlighting
- Responsive CSS design with CSS custom properties
- Production-ready deployment architecture
