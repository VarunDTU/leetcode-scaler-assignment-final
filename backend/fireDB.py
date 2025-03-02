import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime
import json
import asyncio
from typing import List, Dict, Any, Optional


cred = credentials.Certificate("firebase_service_key.json")
app = firebase_admin.initialize_app(cred)

db = firestore.client()

class FirestoreChat:
    @staticmethod
    async def save_message(conversation_id: str, role: str, content: str, metadata: Dict = None) -> str:
        # Parse the conversation_id to extract problem_slug and userId
        parts = conversation_id.split('-')
        if len(parts) >= 4:
            problem_slug = parts[2]
            user_id = parts[-1]
        else:
            problem_slug = "unknown"
            user_id = "unknown"
            
        # Reference to the conversation document
        conversation_ref = db.collection('conversations').document(conversation_id)
        
        # Check if conversation exists, if not create it
        conversation = conversation_ref.get()
        if not conversation.exists:
            conversation_ref.set({
                'userId': user_id,
                'problemSlug': problem_slug,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP,
                'messageCount': 0
            })
        
        # Create the message document
        message_data = {
            'role': role,
            'content': content,
            'timestamp': firestore.SERVER_TIMESTAMP,
        }
        
        if metadata:
            message_data['metadata'] = metadata
            
        # Add to messages subcollection
        message_ref = conversation_ref.collection('messages').document()
        message_ref.set(message_data)
        
        # Update the conversation's updatedAt field
        conversation_ref.update({
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'messageCount': firestore.Increment(1)
        })
        
        return message_ref.id
    
    @staticmethod
    async def get_conversation_history(conversation_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        # Get messages ordered by timestamp
        print(conversation_id)
        messages_ref = db.collection('conversations').document(conversation_id).collection('messages')
        query = messages_ref.order_by('timestamp').limit(limit)
        
        # Get all messages
        messages = query.get()
        print(messages)
        # Format the results
        result = []
        for msg in messages:
            msg_data = msg.to_dict()
            # Convert timestamp to ISO format string for JSON serialization
            if 'timestamp' in msg_data and msg_data['timestamp']:
                msg_data['timestamp'] = msg_data['timestamp'].isoformat()
            result.append(msg_data)
            
        return result
    
    @staticmethod
    async def get_user_conversations(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        # Query conversations by userId
        query = db.collection('conversations').where('userId', '==', user_id).order_by('updatedAt', direction=firestore.Query.DESCENDING).limit(limit)
        
        conversations = query.get()
        
        # Format results
        result = []
        for conv in conversations:
            conv_data = conv.to_dict()
            conv_data['id'] = conv.id
            
            # Convert timestamps to strings
            if 'createdAt' in conv_data and conv_data['createdAt']:
                conv_data['createdAt'] = conv_data['createdAt'].isoformat()
            if 'updatedAt' in conv_data and conv_data['updatedAt']:
                conv_data['updatedAt'] = conv_data['updatedAt'].isoformat()
                
            result.append(conv_data)
            
        return result
    
    @staticmethod
    async def delete_conversation(conversation_id: str) -> bool:
        try:
            # Get all messages in the conversation
            messages_ref = db.collection('conversations').document(conversation_id).collection('messages')
            messages = messages_ref.get()
            
            # Delete each message
            for msg in messages:
                msg.reference.delete()
            
            # Delete the conversation document
            db.collection('conversations').document(conversation_id).delete()
            
            return True
        except Exception as e:
            print(f"Error deleting conversation: {e}")
            return False
