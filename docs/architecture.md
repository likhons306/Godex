# Godex Application Architecture

This document provides a detailed overview of the Godex application's architecture, including the frontend, backend, and data flow.

## 1. High-Level Overview

Godex is a web-based AI coding assistant. It features a chat interface where users can ask questions and receive responses from a powerful AI model. The application is designed to be a modern, state-of-the-art tool for developers, leveraging advanced AI for complex reasoning in code, math, and STEM fields.

The application is architected as a standard client-server model:
-   A **frontend** built with React, Vite, and TypeScript, responsible for the user interface and user interactions.
-   A **backend** built with Node.js and Express, responsible for communicating with the external Google Gemini AI service.

## 2. Technology Stack

The project utilizes a modern and robust technology stack:

-   **Frontend:**
    -   **Framework:** React 19
    -   **Build Tool:** Vite
    -   **Language:** TypeScript
    -   **UI Components:** `ai-elements` on top of `shadcn/ui`
    -   **Styling:** Tailwind CSS
    -   **AI SDK:** Vercel AI SDK (`@ai-sdk/react`) for managing chat state.
-   **Backend:**
    -   **Framework:** Express.js
    -   **Runtime:** Node.js (run with `tsx` for TypeScript support)
    -   **AI Provider:** Google Gemini (`@ai-sdk/google`)
-   **Development:**
    -   **Package Manager:** npm
    -   **Linting:** ESLint

## 3. Project Structure

The repository is organized into several key directories:

```
.
├── docs/                # Project documentation (you are here)
├── public/              # Static assets served directly
├── server/              # Backend Express.js application
│   └── api.js           # The main backend API file
├── src/                 # Frontend React application source code
│   ├── assets/          # Static assets for the frontend (images, etc.)
│   ├── components/      # Reusable UI components
│   │   ├── ai-elements/ # AI-specific components from the ai-elements library
│   │   └── ui/          # Base UI components from shadcn/ui
│   ├── lib/             # Utility functions and client-side libraries
│   │   ├── api-client.ts# Client-side function for streaming from the API
│   │   └── gemini.ts    # Type definitions for Gemini
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global CSS and Tailwind directives
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## 4. Frontend Architecture

The frontend is a single-page application (SPA) built with React.

-   **`App.tsx`:** This is the core component of the application. It manages the entire chat state, including the list of messages, the user's input, and the loading status.
-   **Component Library:** The UI is built using `ai-elements`, a library specifically designed for AI applications. This provides pre-built components like `Conversation`, `Message`, and `PromptInput`, which are used to structure the chat interface. These components are based on `shadcn/ui` and are highly customizable.
-   **Styling:** All styling is handled by Tailwind CSS, which allows for rapid development of a modern and responsive UI.
-   **State Management:** The application uses React's built-in `useState` and `useEffect` hooks for state management. There is no external state management library like Redux or Zustand.

## 5. Backend Architecture

The backend is a lightweight Express.js server.

-   **`server/api.js`:** This file defines a single API endpoint: `/api/stream`.
-   **`/api/stream` Endpoint:** This endpoint receives the user's prompt and the conversation history from the frontend. It then uses the Vercel AI SDK (`@ai-sdk/google`) to make a streaming request to the Google Gemini API. The response from Gemini is then streamed back to the frontend in real-time.
-   **Environment Variables:** The backend requires a `GOOGLE_GENERATIVE_AI_API_KEY` environment variable to authenticate with the Gemini API.

## 6. Data Flow & Chat Logic

The chat functionality follows a clear and simple data flow:

1.  The user types a message into the `PromptInput` component in the UI.
2.  When the user submits the form, the `handleSubmit` function in `App.tsx` is called.
3.  A new user message object is created and added to the `messages` state array, which immediately updates the UI.
4.  The `streamMessageFromAPI` function is called, which sends a `POST` request to the backend's `/api/stream` endpoint with the current chat history.
5.  The backend server receives the request and forwards it to the Google Gemini API.
6.  As the Gemini API generates the response, the backend streams it back to the frontend.
7.  The `streamMessageFromAPI` function on the client receives these chunks and continuously updates the content of the last (assistant) message in the `messages` state.
8.  The UI re-renders in real-time, showing the assistant's response as it's being generated.

## 7. Chat History Persistence

-   The chat history is persisted in the browser's `localStorage`.
-   A `useEffect` hook in `App.tsx` saves the entire `messages` array to `localStorage` whenever it changes.
-   Another `useEffect` hook loads the history from `localStorage` when the application first mounts, allowing conversations to be restored across sessions.