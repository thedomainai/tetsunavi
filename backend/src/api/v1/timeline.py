"""タイムライン関連 API エンドポイント"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from models.responses import TimelineResponse, TimelineData
from services.session_service import SessionService
from agents.root_agent import RootAgent
from api.dependencies import get_session_service, get_root_agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/sessions/{session_id}/timeline", response_model=TimelineResponse)
async def get_timeline(
    session_id: str,
    session_service: SessionService = Depends(get_session_service),
    root_agent: RootAgent = Depends(get_root_agent),
):
    """タイムラインを取得"""
    try:
        # セッション取得
        session = await session_service.get_session(session_id)
        if not session:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "SESSION_NOT_FOUND",
                    "message": "セッションが見つかりません",
                },
            )

        # 手続き取得
        procedures = await session_service.get_procedures(session_id)

        if not procedures:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "PROCEDURES_NOT_GENERATED",
                    "message": "手続きが生成されていません",
                },
            )

        # Root Agent でタイムライン生成
        timeline = await root_agent.generate_timeline(session, procedures)

        return TimelineResponse(
            data=TimelineData(
                timeline=timeline.items,
                milestones=timeline.milestones,
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to generate timeline")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "INTERNAL_SERVER_ERROR",
                "message": "タイムライン生成に失敗しました",
            },
        )
