# LeetCode AI Assistant - Installation Guide

## Overview

LeetCode AI Assistant is an interactive web application that helps users understand and solve LeetCode coding problems with the assistance of an AI. This document provides detailed installation instructions, explains the system architecture, and offers usage guidelines.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or later)
- npm (v7 or later) or yarn
- Python 3.8+ (for backend)
- Git

## Setup Instructions

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory with:

   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/
   ```

   Replace the URL with your actual backend API endpoint.

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd ../backend
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Create a `.env` file with:

   ```
   DATABASE_URL=sqlite:///database.db
   AI_API_KEY=your_openai_api_key
   ```

5. **Start the backend server**

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## System Architecture

### Frontend Architecture

The frontend is built with:

- **Next.js**: React framework providing server-side rendering and routing
- **React**: UI component library
- **Axios**: HTTP client for API requests

Key components:

- `app/page.js`: Main application page with conversation history
- `components/ui/chat/chat-box.js`: Chat interface component
- `hooks/use-ai.js`: Custom React hook that manages chat state and API communication

### Backend Architecture

The backend API is built with:

- **FastAPI**: Python web framework for building APIs
- **SQLAlchemy**: ORM for database interactions
- **LLM Integration**: Connection to AI model for problem-solving assistance

API Endpoints:

- `POST /chat`: Send user messages and receive AI responses
- `POST /get-prev-conversations`: Retrieve conversation history
- `POST /get-prev-messages`: Retrieve messages for a specific problem

### Data Flow

1. User enters a LeetCode problem URL
2. Application extracts the problem slug
3. User sends questions through the chat interface
4. Frontend passes messages to backend API
5. Backend processes the message with the AI model
6. Response is returned to frontend and displayed to the user
7. Conversation history is stored in the database

## Usage Guidelines

### Starting a New Conversation

1. Open the application in your browser
2. Enter a LeetCode problem URL in the input field (e.g., `https://leetcode.com/problems/two-sum/`)
3. Click "Submit" to initialize the conversation about this problem

### Chatting with the AI Assistant

1. Type your question about the problem in the input field at the bottom of the chat box
2. Press "Send" or hit Enter to submit your question
3. Wait for the AI to respond with guidance on the problem
4. Continue the conversation by asking follow-up questions

### Managing Conversations

1. View your conversation history in the sidebar on the left
2. Click on any previous conversation to resume it
3. Use the "New Chat" button to start a fresh conversation about a different problem

### Best Practices

- Be specific with your questions for better guidance
- Break down complex problems into smaller parts
- Ask for explanations when you don't understand the AI's solution
- Use the conversation history to revisit previous explanations

## Troubleshooting

### Common Issues

1. **Backend connection failure**

   - Ensure the backend server is running
   - Check that the `NEXT_PUBLIC_BACKEND_URL` in `.env.local` is correct

2. **Messages not loading**

   - Verify you're connected to the internet
   - Check browser console for errors
   - Ensure the problem slug is correctly extracted from the URL

3. **AI responses are incomplete**
   - The AI might have a response length limit
   - Try breaking down your questions into smaller chunks

### Getting Help

If you encounter issues not covered in this guide:

1. Check the issue tracker on the GitHub repository
2. Create a new issue with details about your problem
3. Include error messages and steps to reproduce the issue

## License

This project is licensed under the MIT License.
