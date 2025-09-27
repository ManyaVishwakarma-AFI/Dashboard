from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database, services

router = APIRouter()

@router.post("/chat")
def post_chat_message(
    message: schemas.ChatMessageCreate,
    db: Session = Depends(database.get_db)
):
    # In a real app, user context would be derived from authentication
    user_context = {"location": "Mumbai", "subscriptionTier": "free"}
    ai_response = services.chatbot_response(message.message, user_context)

    chat_message = crud.create_chat_message(
        db=db,
        message=message,
        response=ai_response["message"]
    )

    return {
        "message": ai_response["message"],
        "suggestions": ai_response.get("suggestions", []),
        "chatId": chat_message.id
    }

@router.get("/chat/history/{user_id}", response_model=List[schemas.ChatMessage])
def get_chat_history(user_id: str, limit: int = 50, db: Session = Depends(database.get_db)):
    messages = crud.get_chat_messages(db, user_id=user_id, limit=limit)
    return messages