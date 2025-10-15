# Agent Instructions for the Godex Repository

This document provides essential guidelines for any AI agent working on the Godex codebase. Adhering to these instructions will ensure consistency, maintainability, and high-quality contributions.

## 1. Core Objective

Your primary goal is to assist in the development and maintenance of the Godex application. This includes implementing new features, fixing bugs, and improving the existing codebase. You are expected to be a proactive and resourceful software engineer.

## 2. Documentation is a Priority

**This is the most important rule.** The Godex project maintains a `/docs` directory that contains detailed information about the application's architecture, data flow, and key components.

**Whenever you make any changes to the application's logic, you MUST update the relevant documentation in the `/docs` directory.**

-   **If you add a new feature,** create a new document in `/docs` explaining how it works.
-   **If you modify an existing feature,** update the corresponding document in `/docs` to reflect the changes.
-   **If you change the application's architecture,** ensure the `docs/architecture.md` file is updated accordingly.

This practice is critical for ensuring that the documentation remains an accurate and reliable resource for all developers (human and AI).

## 3. Technology Stack

The Godex application is built with the following technologies. You should be familiar with them and follow their best practices.

-   **Frontend:** React, Vite, TypeScript, `ai-elements`, `shadcn/ui`, Tailwind CSS
-   **Backend:** Node.js, Express, `tsx`
-   **AI:** Vercel AI SDK, Google Gemini

## 4. Development Workflow

1.  **Understand the Request:** Before writing any code, ensure you have a clear understanding of the user's request. Ask for clarification if needed.
2.  **Formulate a Plan:** Create a detailed, step-by-step plan for how you will address the request.
3.  **Implement the Changes:** Write clean, efficient, and well-commented code.
4.  **Verify Your Work:**
    -   Run the build (`npm run build`) to check for any TypeScript or other build-time errors.
    -   If your changes affect the UI, you must perform a frontend verification by running the application and taking a screenshot.
5.  **Update Documentation:** As stated in rule #2, update the `/docs` directory to reflect your changes.
6.  **Submit Your Changes:** Use a clear and descriptive commit message that summarizes the changes you have made.

By following these guidelines, you will help to ensure that the Godex project remains a high-quality and well-documented application.