"""インタビュー関連 API エンドポイント"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from models.requests import InterviewAnswersRequest
from models.responses import (
    InterviewQuestionsResponse,
    InterviewQuestionsData,
    InterviewAnswersResponse,
    InterviewAnswersData,
)
from models.domain import Interview, AnswerRecord
from services.session_service import SessionService
from agents.root_agent import RootAgent
from api.dependencies import get_session_service, get_root_agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/sessions/{session_id}/interview", response_model=InterviewQuestionsResponse)
async def get_interview_questions(
    session_id: str,
    session_service: SessionService = Depends(get_session_service),
    root_agent: RootAgent = Depends(get_root_agent),
):
    """インタビュー質問を取得"""
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

        # Root Agent で質問生成
        questions = await root_agent.generate_questions(session)

        # 推定時間計算（1問あたり30秒）
        estimated_time = len(questions) * 30

        return InterviewQuestionsResponse(
            data=InterviewQuestionsData(
                questions=questions,
                estimated_time=estimated_time,
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to generate interview questions")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "AI_SERVICE_ERROR",
                "message": "質問生成に失敗しました",
            },
        )


@router.post("/sessions/{session_id}/interview", response_model=InterviewAnswersResponse)
async def save_interview_answers(
    session_id: str,
    request: InterviewAnswersRequest,
    session_service: SessionService = Depends(get_session_service),
):
    """インタビュー回答を保存"""
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

        # 回答から構造化データを抽出
        interview = Interview()
        answer_records = []

        for answer in request.answers:
            # AnswerRecord に変換
            answer_record = AnswerRecord(
                question_id=answer.question_id,
                question="",  # 質問文は省略（必要に応じて取得）
                value=answer.value,
            )
            answer_records.append(answer_record)

            # 構造化データの抽出（簡易版）
            if isinstance(answer.value, list):
                interview.family.extend(answer.value)
            elif isinstance(answer.value, bool):
                # ブール値の場合は質問IDで判定
                if "car" in answer.question_id.lower():
                    interview.has_car = answer.value
                elif "pet" in answer.question_id.lower():
                    interview.has_pet = answer.value
                elif "mynumber" in answer.question_id.lower() or "マイナンバー" in str(answer.value):
                    interview.has_my_number = answer.value

        interview.answers = answer_records

        # インタビュー情報を更新
        await session_service.update_interview(session_id, interview)

        return InterviewAnswersResponse(
            data=InterviewAnswersData(
                status="completed",
                next_step="procedures",
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to save interview answers")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "DATABASE_ERROR",
                "message": "回答の保存に失敗しました",
            },
        )
