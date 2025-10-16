# Playwright Workflow

This document outlines the automated Playwright testing workflow implemented in this repository.

## Overview

The workflow is defined in the `.github/workflows/playwright.yml` file and is designed to automate the process of running tests and generating reports that are easy for both humans and AI to consume.

## Triggers

The workflow is triggered by the following events:

-   A `push` to the `main` or `dev` branches.
-   A `pull_request` targeting the `main` or `dev` branches.
-   A manual trigger (`workflow_dispatch`).

## Workflow Steps

1.  **Checkout Code:** The workflow begins by checking out the latest version of the repository.
2.  **Set up Node.js:** It sets up a Node.js environment.
3.  **Install Dependencies:** It installs all the necessary project dependencies by running `npm install`.
4.  **Install Playwright Browsers:** It installs the browsers required by Playwright.
5.  **Run Playwright Tests:** The workflow executes the Playwright tests and generates a JSON report.
6.  **Create Maintainable Artifacts:** It creates a `/maintainable` directory and the following files:
    -   `todo.md`: A list of actionable tasks for developers, such as fixing failed or skipped tests.
    -   `error.md`: A detailed report of any test failures, including stack traces.
    -   `DO_NOT_ADD_ANYTHING_HERE_FOR_HUMAN.md`: A marker file to indicate that the directory is managed by AI.
7.  **Parse Test Results:** The workflow parses the JSON report from the test run and populates the `todo.md` and `error.md` files with relevant information.
8.  **Commit Artifacts:** Finally, the workflow automatically commits the updated `todo.md` and `error.md` files to a new branch with the `-bot` suffix. This ensures that the main branch remains clean while still providing a clear record of test results.