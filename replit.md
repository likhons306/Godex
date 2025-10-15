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
- **Build Tool**: Vite 7
- **AI Model**: Google Gemini 2.5 Pro
- **Styling**: Custom CSS with modern design patterns
- **Code Highlighting**: react-syntax-highlighter with Prism
- **Markdown**: react-markdown for rich text rendering

## Project Structure

```
├── src/
│   ├── lib/
│   │   └── gemini.ts          # Gemini API integration
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
├── public/                     # Static assets
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies
```

## Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (get it from https://ai.google.dev/)

## Key Capabilities

### Gemini 2.5 Pro Features Used
- **Advanced Reasoning**: Complex problem-solving in code, math, and STEM
- **Long Context**: Up to 1,048,576 input tokens
- **Code Execution**: Built-in code execution capabilities
- **Function Calling**: Structured API interactions
- **Thinking Mode**: Enhanced reasoning for complex tasks

### Application Features
- Chat interface with message history
- Syntax highlighting for 100+ programming languages
- Markdown formatting for rich responses
- Responsive design for all screen sizes
- Error handling and loading states
- Quick suggestion prompts

## Recent Changes

**October 15, 2025**
- Initial project setup with Vite + React + TypeScript
- Integrated Gemini 2.5 Pro API
- Created modern UI inspired by OpenAI Codex
- Added markdown and syntax highlighting support
- Configured for Replit deployment

## Development

The application runs on port 5000 with Vite's dev server configured for the Replit environment.

## Architecture Notes

- Uses `@google/genai` SDK for Gemini API integration
- Implements conversation history management
- Custom markdown renderer with code syntax highlighting
- Responsive CSS design with CSS custom properties
- Environment-aware configuration (Vite env vars)
