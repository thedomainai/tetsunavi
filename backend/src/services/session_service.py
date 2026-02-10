"""セッション管理サービス"""

from typing import Optional, List
import logging
from datetime import datetime
from models.domain import Session, Procedure, Interview, SessionStatus
from models.requests import CreateSessionRequest
from services.firestore_service import FirestoreService

logger = logging.getLogger(__name__)


class SessionService:
    """セッション管理サービス"""

    def __init__(self, firestore: FirestoreService):
        self.firestore = firestore

    async def create_session(self, request: CreateSessionRequest) -> Session:
        """新規セッションを作成"""
        session = Session(
            move_from=request.move_from,
            move_to=request.move_to,
            move_date=request.move_date,
        )

        await self.firestore.save_session(session)
        return session

    async def get_session(self, session_id: str) -> Optional[Session]:
        """セッションを取得"""
        return await self.firestore.get_session(session_id)

    async def update_interview(self, session_id: str, interview: Interview) -> None:
        """インタビュー情報を更新"""
        interview.completed_at = datetime.utcnow()
        interview_dict = interview.model_dump(by_alias=True, mode="json")

        await self.firestore.update_session(
            session_id,
            {
                "interview": interview_dict,
                "status": SessionStatus.INTERVIEW_COMPLETED.value,
            },
        )

    async def add_procedures(self, session_id: str, procedures: List[Procedure]) -> None:
        """手続きリストを追加（サブコレクションに一括保存）"""
        # 依存関係の検証
        if not self.firestore.validate_dependencies(procedures):
            logger.error(f"Invalid dependencies in procedures for session {session_id}")
            # 循環依存がある場合でも、警告ログを出して続行

        # サブコレクションに一括保存
        await self.firestore.save_procedures_batch(session_id, procedures)

        # セッションステータスを更新
        await self.firestore.update_session(
            session_id,
            {
                "status": SessionStatus.PROCEDURES_GENERATED.value,
            },
        )

    async def get_procedures(self, session_id: str) -> List[Procedure]:
        """手続き一覧をサブコレクションから取得"""
        return await self.firestore.get_all_procedures(session_id)

    async def get_procedure(self, session_id: str, procedure_id: str) -> Optional[Procedure]:
        """手続きをサブコレクションから取得"""
        return await self.firestore.get_procedure(session_id, procedure_id)

    async def update_procedure_completion(
        self, session_id: str, procedure_id: str, is_completed: bool
    ) -> None:
        """手続きの完了状態を更新"""
        updates = {
            "isCompleted": is_completed,
            "completedAt": datetime.utcnow() if is_completed else None,
        }

        # サブコレクション構造のため、トランザクション不要
        await self.firestore.update_procedure(session_id, procedure_id, updates)
