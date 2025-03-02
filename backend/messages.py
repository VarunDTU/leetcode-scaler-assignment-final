from fireDB import FirestoreChat

async def get_prev_messsages_from_conversation_id(problem_slug, userId):
    try:
        conversation_id=f"leetcode-session-{problem_slug}-{userId}"
        print(conversation_id)
        chat_history = await FirestoreChat.get_conversation_history(conversation_id)
        return chat_history
    except Exception as e:
        print(f"Error getting previous messages: {e}")
        raise e

    
async def get_prev_conversations_for_user(user_id):
    try:
        conversations = await FirestoreChat.get_user_conversations(user_id)
        return conversations
    except Exception as e:
        print(f"Error getting previous conversations: {e}")
        raise e
    