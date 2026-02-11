"""チャット API エンドポイント"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from models.requests import ChatRequest
from models.responses import ChatResponse, ChatResponseData
from services.session_service import SessionService
from agents.root_agent import RootAgent
from api.dependencies import get_session_service, get_root_agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/sessions/{session_id}/chat", response_model=ChatResponse)
async def chat(
    session_id: str,
    request: ChatRequest,
    session_service: SessionService = Depends(get_session_service),
    root_agent: RootAgent = Depends(get_root_agent),
):
    """チャットメッセージを送信して回答を取得"""
    try:
        session = await session_service.get_session(session_id)
        if not session:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "SESSION_NOT_FOUND",
                    "message": "セッションが見つかりません",
                },
            )

        procedures = await session_service.get_procedures(session_id)

        result = await root_agent.generate_chat_reply(
            session, request.message, procedures
        )

        return ChatResponse(
            data=ChatResponseData(
                reply=result["reply"],
                suggested_questions=result.get("suggested_questions", []),
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to generate chat reply")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "CHAT_ERROR",
                "message": "チャット応答の生成に失敗しました",
            },
        )
