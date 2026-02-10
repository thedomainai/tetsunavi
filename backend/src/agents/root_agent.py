"""Root Agent - オーケストレーションエージェント"""

import logging
import asyncio
from typing import List
from agents.interview_agent import InterviewAgent
from agents.procedure_agent import ProcedureAgent
from agents.document_agent import DocumentAgent
from agents.location_agent import LocationAgent
from agents.schedule_agent import ScheduleAgent
from models.domain import Session, Procedure, Question, Timeline

logger = logging.getLogger(__name__)


class RootAgent:
    """マルチエージェントシステムのオーケストレーター"""

    def __init__(self):
        self.interview_agent = InterviewAgent()
        self.procedure_agent = ProcedureAgent()
        self.document_agent = DocumentAgent()
        self.location_agent = LocationAgent()
        self.schedule_agent = ScheduleAgent()

    async def generate_questions(self, session: Session) -> List[Question]:
        """
        インタビュー質問を生成します。

        Args:
            session: セッション情報

        Returns:
            質問のリスト
        """
        return await self.interview_agent.generate_questions(session)

    async def generate_procedures(self, session: Session) -> List[Procedure]:
        """
        手続きリストを生成します（最小限の情報のみ）。

        Procedure Agent のみ使用。

        Args:
            session: セッション情報

        Returns:
            手続きのリスト
        """
        logger.info(f"Generating procedures for session {session.session_id}")

        # Procedure Agent で手続きを特定
        procedures = await self.procedure_agent.identify_procedures(session)

        logger.info(f"Generated {len(procedures)} procedures")

        return procedures

    async def get_procedure_detail(self, session: Session, procedure: Procedure) -> Procedure:
        """
        手続きの詳細情報を取得します。

        Document Agent + Location Agent を並列実行。

        Args:
            session: セッション情報
            procedure: 手続き情報

        Returns:
            詳細情報が追加された手続き
        """
        logger.info(f"Getting details for procedure {procedure.id}")

        # Document Agent と Location Agent を並列実行（エラーハンドリング付き）
        document_task = self.document_agent.get_procedure_details(session, procedure)
        location_task = self.location_agent.get_office_info(session, procedure)

        results = await asyncio.gather(document_task, location_task, return_exceptions=True)

        # 結果を安全に取得
        if not isinstance(results[0], Exception):
            procedure = results[0]
        else:
            logger.error(f"Document Agent failed: {results[0]}")

        if not isinstance(results[1], Exception):
            procedure.office = results[1]
        else:
            logger.error(f"Location Agent failed: {results[1]}")

        return procedure

    async def generate_timeline(self, session: Session, procedures: List[Procedure]) -> Timeline:
        """
        タイムラインを生成します。

        Schedule Agent を使用。

        Args:
            session: セッション情報
            procedures: 手続きリスト

        Returns:
            タイムライン
        """
        logger.info(f"Generating timeline for session {session.session_id}")

        timeline = await self.schedule_agent.generate_timeline(session, procedures)

        logger.info(f"Generated timeline with {len(timeline.items)} items")

        return timeline
