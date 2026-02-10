"""手続き関連 API エンドポイント"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from models.requests import UpdateProcedureRequest
from models.responses import (
    ProcedureListResponse,
    ProcedureListData,
    ProcedureDetailResponse,
    ProcedureUpdateResponse,
    ProcedureUpdateData,
)
from models.domain import ProcedureCategory, ProcedurePriority
from services.session_service import SessionService
from agents.root_agent import RootAgent
from api.dependencies import get_session_service, get_root_agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/sessions/{session_id}/procedures", response_model=ProcedureListResponse)
async def generate_procedures(
    session_id: str,
    session_service: SessionService = Depends(get_session_service),
    root_agent: RootAgent = Depends(get_root_agent),
):
    """手続きリストを生成"""
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

        # インタビューが完了していることを確認
        if not session.interview:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "INTERVIEW_NOT_COMPLETED",
                    "message": "インタビューが完了していません",
                },
            )

        # Root Agent で手続き生成
        procedures = await root_agent.generate_procedures(session)

        # 手続きをサブコレクションに保存
        await session_service.add_procedures(session_id, procedures)

        return ProcedureListResponse(
            data=ProcedureListData(
                procedures=procedures,
                total_count=len(procedures),
                completed_count=sum(1 for p in procedures if p.is_completed),
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to generate procedures")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "AI_SERVICE_ERROR",
                "message": "手続き生成に失敗しました",
            },
        )


@router.get("/sessions/{session_id}/procedures", response_model=ProcedureListResponse)
async def get_procedures(
    session_id: str,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    completed: Optional[bool] = None,
    session_service: SessionService = Depends(get_session_service),
):
    """手続きリストを取得"""
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

        # フィルタリング
        if category:
            procedures = [p for p in procedures if p.category.value == category]
        if priority:
            procedures = [p for p in procedures if p.priority.value == priority]
        if completed is not None:
            procedures = [p for p in procedures if p.is_completed == completed]

        return ProcedureListResponse(
            data=ProcedureListData(
                procedures=procedures,
                total_count=len(procedures),
                completed_count=sum(1 for p in procedures if p.is_completed),
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to get procedures")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "DATABASE_ERROR",
                "message": "手続き取得に失敗しました",
            },
        )


@router.get(
    "/sessions/{session_id}/procedures/{procedure_id}",
    response_model=ProcedureDetailResponse,
)
async def get_procedure_detail(
    session_id: str,
    procedure_id: str,
    session_service: SessionService = Depends(get_session_service),
    root_agent: RootAgent = Depends(get_root_agent),
):
    """手続き詳細を取得"""
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
        procedure = await session_service.get_procedure(session_id, procedure_id)
        if not procedure:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "PROCEDURE_NOT_FOUND",
                    "message": "手続きが見つかりません",
                },
            )

        # 詳細情報が未取得の場合は生成
        if not procedure.documents:
            procedure = await root_agent.get_procedure_detail(session, procedure)

            # 詳細情報を保存
            await session_service.firestore.save_procedure(session_id, procedure)

        return ProcedureDetailResponse(data=procedure)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to get procedure detail")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "INTERNAL_SERVER_ERROR",
                "message": "手続き詳細の取得に失敗しました",
            },
        )


@router.patch(
    "/sessions/{session_id}/procedures/{procedure_id}",
    response_model=ProcedureUpdateResponse,
)
async def update_procedure(
    session_id: str,
    procedure_id: str,
    request: UpdateProcedureRequest,
    session_service: SessionService = Depends(get_session_service),
):
    """手続きの完了状態を更新"""
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
        procedure = await session_service.get_procedure(session_id, procedure_id)
        if not procedure:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "PROCEDURE_NOT_FOUND",
                    "message": "手続きが見つかりません",
                },
            )

        # 完了状態を更新
        await session_service.update_procedure_completion(
            session_id, procedure_id, request.is_completed
        )

        # 更新後の手続きを取得
        updated_procedure = await session_service.get_procedure(session_id, procedure_id)

        return ProcedureUpdateResponse(
            data=ProcedureUpdateData(
                id=updated_procedure.id,
                is_completed=updated_procedure.is_completed,
                completed_at=updated_procedure.completed_at,
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to update procedure")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "DATABASE_ERROR",
                "message": "手続き更新に失敗しました",
            },
        )
