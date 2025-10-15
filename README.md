# Godex: Your AI Coding Assistant

Godex is a state-of-the-art AI coding assistant designed to help developers with complex reasoning tasks in code, math, and STEM. It features a modern, real-time chat interface powered by Google's Gemini 2.5 Pro model.

This project serves as a powerful demonstration of how to build AI-native applications using the latest web technologies.

![Godex Screenshot](jules-scratch/verification/verification.png)

## ✨ Features

-   **Real-time, Streaming Responses:** Get answers from the AI as they are being generated.
-   **Persistent Chat History:** Your conversations are saved locally, so you can pick up where you left off.
-   **Modern UI:** A clean and intuitive user interface built with `ai-elements` and `shadcn/ui`.
-   **Extensible Architecture:** A clear and well-documented codebase that is easy to extend and build upon.

## 🚀 Technology Stack

Godex is built with a modern and powerful technology stack:

-   **Frontend:**
    -   **Framework:** React 19
    -   **Build Tool:** Vite
    -   **Language:** TypeScript
    -   **UI Components:** `ai-elements` on top of `shadcn/ui`
    -   **Styling:** Tailwind CSS
    -   **AI SDK:** Vercel AI SDK (`@ai-sdk/react`)
-   **Backend:**
    -   **Framework:** Express.js
    -   **Runtime:** Node.js (with `tsx`)
    -   **AI Provider:** Google Gemini (`@ai-sdk/google`)

For a more detailed breakdown of the architecture, please see the [architecture documentation](./docs/architecture.md).

## 📦 Getting Started

To get a local copy of Godex up and running, follow these simple steps.

### Prerequisites

-   Node.js v18 or later
-   npm (or your favorite package manager)
-   A Google Generative AI API key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/godex.git
    cd godex
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**

    Create a `.env` file in the root of the project and add your Google Generative AI API key:
    ```
    GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
    ```

4.  **Run the development servers:**

    This command will start both the frontend and backend servers in parallel:
    ```bash
    npm run dev:all
    ```

    The application will be available at `http://localhost:5000`.

## scripts

-   `npm run dev`: Starts the frontend development server.
-   `npm run dev:api`: Starts the backend API server.
-   `npm run dev:all`: Starts both the frontend and backend servers.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the codebase.
-   `npm run preview`: Previews the production build.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/godex/issues).

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.