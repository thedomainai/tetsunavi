"""セッション関連 API エンドポイント"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from models.requests import CreateSessionRequest
from models.responses import CreateSessionResponse, CreateSessionData
from services.session_service import SessionService
from api.dependencies import get_session_service
from core.exceptions import NotFoundError

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/sessions", response_model=CreateSessionResponse, status_code=201)
async def create_session(
    request: CreateSessionRequest,
    session_service: SessionService = Depends(get_session_service),
):
    """新規セッションを作成"""
    try:
        session = await session_service.create_session(request)

        return CreateSessionResponse(
            data=CreateSessionData(
                session_id=session.session_id,
                created_at=session.created_at,
                status=session.status,
            )
        )
    except Exception as e:
        logger.exception("Failed to create session")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "INTERNAL_SERVER_ERROR",
                "message": "セッション作成に失敗しました",
            },
        )


@router.get("/sessions/{session_id}")
async def get_session(
    session_id: str,
    session_service: SessionService = Depends(get_session_service),
):
    """セッションを取得"""
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

        return {"data": session.model_dump(by_alias=True, mode="json")}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to get session")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "INTERNAL_SERVER_ERROR",
                "message": "セッション取得に失敗しました",
            },
        )
