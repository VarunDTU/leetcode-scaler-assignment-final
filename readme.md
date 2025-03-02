# LeetCode Helper Bot

A sophisticated AI-powered assistant that helps you understand and solve LeetCode problems by providing personalized guidance, hints, and explanations.

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+ installed
- A Google API key for Gemini AI access
- Node.js 14+ (for frontend)
- Firebase service credentials 

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

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/leetcode-bot.git
   cd leetcode-bot
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv .venv
   # On Windows
   .\.venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a .env file in the root directory with:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   FRONTEND_URL=http://localhost:3000
   ```
5.
**Get your Firestore Service key credentials**

   ```bash
   Save them as firebase_service_key.json at root
   ```

   The application will be available at `http://localhost:3000`
6. **Start the FastAPI server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```



## 🏛️ Architecture

### System Architecture

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│            │     │            │     │            │
│  Frontend  │◄───►│  Backend   │◄───►│  LeetCode  │
│  (Next.js) │     │  (FastAPI) │     │   API      │
│            │     │            │     │            │
└────────────┘     └─────┬──────┘     └────────────┘
                         │
                         ▼
                   ┌────────────┐     ┌────────────┐
                   │            │     │            │
                   │  Gemini   │◄───►│  Firestore │
                   │  AI Model │     │  Database  │
                   │            │     │            │
                   └────────────┘     └────────────┘
```

### Component Breakdown

1. **Frontend (Next.js)**
   - User interface for problem selection and chat interaction
   - Real-time messaging with the AI assistant
   - Chat history display
   - Problem description viewer

2. **Backend (FastAPI)**
   - RESTful API endpoints for chat functionality
   - LeetCode problem fetching
   - AI model integration
   - Conversation management

3. **LeetCode Integration (scrape.py)**
   - Fetches problem descriptions
   - Retrieves top-rated community solutions
   - Parses and structures LeetCode data

4. **AI Integration (llm.py)**
   - Integrates with Google's Gemini model
   - Manages conversation context
   - Provides personalized problem-solving guidance
   - Maintains conversation history

5. **Database (FirestoreChat)**
   - Stores conversation history
   - Enables persistent user sessions
   - Manages user-specific data

## 📝 Usage Guidelines

### Getting Started

1. **Select a Problem**: Browse or search for a LeetCode problem.
2. **Start a Conversation**: Ask questions about the selected problem.

### Using the AI Assistant

The AI assistant can help you in several ways:

- **Problem Understanding**: Ask for clarification on problem statements
- **Hints**: Request progressive hints without full solutions
- **Algorithmic Guidance**: Learn about relevant algorithms and data structures
- **Code Improvement**: Get feedback on your approach or implementation

### Example Prompts


```
You are a teacher helping students understand LeetCode problems.
        
Problem: {leetcode_problem}

You have access to the following solutions: {submitted_solutions}

Explain concepts step-by-step. Give hints rather than complete solutions when students are stuck.
Help the student develop their own approach to solving the problem.
```

### Example Interactions

```
You: Can you explain the two-pointer approach for this problem?

AI: The two-pointer approach works well for this problem because...
```

```
You: I'm stuck with the edge cases. Can you give me a hint?

AI: Consider what happens when the array is empty or contains duplicates...
```

```
You: Is my recursive approach efficient enough?

AI: Your recursive approach has a time complexity of O(2^n), which might lead 
to timeout for larger inputs. Consider using dynamic programming to optimize...
```

## 🤖 GPT Integration Details

### How the AI Integration Works

The LeetCode Helper Bot leverages Google's Gemini model to provide intelligent assistance:

1. **Context Building**:
   - The system fetches the complete LeetCode problem description
   - Top community solutions are analyzed for insights
   - The user's conversation history is retrieved
   - All these elements are combined into a rich context prompt

2. **Prompt Engineering**:
   - A carefully crafted system prompt instructs the AI to:
     - Act as a helpful teacher
     - Provide step-by-step explanations
     - Give hints rather than complete solutions
     - Guide users toward their own understanding

3. **Conversation Management**:
   - Conversations are organized by problem and user ID
   - A global memory store maintains conversation context between requests
   - The system limits context to the most recent messages to prevent token overflow
   - Conversations are persisted in Firestore for long-term storage

4. **Response Generation**:
   - The AI analyzes the problem, available solutions, and user question
   - It generates personalized responses targeting the user's specific needs
   - Code snippets and explanations are provided in a clear, educational format

### Performance Optimization

- In-memory caching for problem data to reduce LeetCode API requests
- Conversation trimming to maintain reasonable context windows
- Batched database operations for efficient history retrieval


