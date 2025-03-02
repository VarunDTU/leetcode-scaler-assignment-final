from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage
from scrape import get_solutions
from fireDB import FirestoreChat
import asyncio
import os

# Load environment variables
load_dotenv()

# Global LeetCode data store to avoid refetching
leetcode_data_cache = {}

# Initialize the model once
model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

def initialize_leetcode_bot(problem_slug):
    if problem_slug in leetcode_data_cache:
        print(f"Using cached data for problem: {problem_slug}")
        return leetcode_data_cache[problem_slug]
    
    # Fetch the LeetCode problem and solutions
    print(f"Fetching data for problem: {problem_slug}...")
    leetcode_data = get_solutions(problem_slug)
    print("Data fetched successfully!")
    
    # Cache the data
    leetcode_data_cache[problem_slug] = leetcode_data
    
    return leetcode_data

async def chat_with_leetcode_bot_async(problem_slug, userId, message):
    conversation_id = f"leetcode-session-{problem_slug}-{userId}"
    
    # Get or initialize LeetCode data
    leetcode_data = initialize_leetcode_bot(problem_slug)
    
    # Display problem info for logging
    print("\n=== LeetCode Problem Helper ===")
    print(f"Problem: {leetcode_data['leetcode_problem']['title']}")
    print(f"Difficulty: {leetcode_data['leetcode_problem']['difficulty']}")
    print(f"User ID: {userId}")
    
    # Save the user message to Firestore
    await FirestoreChat.save_message(
        conversation_id=conversation_id,
        role="user",
        content=message
    )
    
    # Get conversation history from Firestore
    chat_history = await FirestoreChat.get_conversation_history(conversation_id, limit=10)
    
    # Create the system message
    system_message = f"""You are a teacher helping students understand LeetCode problems.
        
Problem: {leetcode_data['leetcode_problem']}

You have access to the following solutions: {leetcode_data['submitted_solutions']}

Explain concepts step-by-step. Prefer to give hints rather than complete solutions when students are stuck.
Help the student develop their own approach to solving the problem."""

    # Create the full prompt template with context and chat history
    prompt_messages = [
        {"role": "system", "content": system_message}
    ]
    
    # Add conversation history
    for msg in chat_history:
        prompt_messages.append({"role": msg['role'], "content": msg['content']})
    
    # Get response from model
    response = model.invoke(prompt_messages)
    
    # Save the assistant's response to Firestore
    await FirestoreChat.save_message(
        conversation_id=conversation_id,
        role="assistant",
        content=response.content,
    )
    
    # Log for debugging
    print(f"Chat history length for {conversation_id}: {len(chat_history) + 1}")
    print(f"Last user message: {message[:50]}..." if len(message) > 50 else f"Last user message: {message}")
    print(f"Response: {response.content[:50]}..." if len(response.content) > 50 else f"Response: {response.content}")
    
    return response.content

async def chat_with_leetcode_bot(problem_slug, userId, message):

    res=await chat_with_leetcode_bot_async(problem_slug, userId, message)
    return res





