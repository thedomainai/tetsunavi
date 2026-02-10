"""Firestore データアクセスサービス"""

from google.cloud import firestore
from datetime import datetime
from typing import Optional, List
import logging
from models.domain import Session, Procedure

logger = logging.getLogger(__name__)


class FirestoreService:
    """Firestore データアクセスサービス"""

    def __init__(self, collection_name: str = "sessions"):
        self.db = firestore.AsyncClient()
        self.sessions_collection = self.db.collection(collection_name)

    async def save_session(self, session: Session) -> None:
        """セッションを Firestore に保存（procedures は除外）"""
        session.updated_at = datetime.utcnow()

        doc_ref = self.sessions_collection.document(session.session_id)

        # procedures は除外してセッション本体を保存
        session_dict = session.model_dump(by_alias=True, mode="json")
        await doc_ref.set(session_dict)

    async def get_session(self, session_id: str) -> Optional[Session]:
        """セッションを Firestore から取得"""
        doc_ref = self.sessions_collection.document(session_id)
        doc = await doc_ref.get()

        if not doc.exists:
            return None

        session_data = doc.to_dict()
        return Session(**session_data)

    async def update_session(self, session_id: str, updates: dict) -> None:
        """セッションを部分的に更新"""
        doc_ref = self.sessions_collection.document(session_id)
        updates["updatedAt"] = datetime.utcnow()
        await doc_ref.update(updates)

    async def save_procedure(self, session_id: str, procedure: Procedure) -> None:
        """手続きをサブコレクションに保存"""
        procedure.updated_at = datetime.utcnow()

        procedures_ref = self.sessions_collection.document(session_id).collection("procedures")
        doc_ref = procedures_ref.document(procedure.id)

        procedure_dict = procedure.model_dump(by_alias=True, mode="json")
        await doc_ref.set(procedure_dict)

    async def save_procedures_batch(self, session_id: str, procedures: List[Procedure]) -> None:
        """複数の手続きを一括でサブコレクションに保存"""
        batch = self.db.batch()
        procedures_ref = self.sessions_collection.document(session_id).collection("procedures")

        for procedure in procedures:
            procedure.updated_at = datetime.utcnow()
            doc_ref = procedures_ref.document(procedure.id)
            procedure_dict = procedure.model_dump(by_alias=True, mode="json")
            batch.set(doc_ref, procedure_dict)

        await batch.commit()

    async def get_procedure(self, session_id: str, procedure_id: str) -> Optional[Procedure]:
        """特定の手続きをサブコレクションから取得"""
        doc_ref = (
            self.sessions_collection.document(session_id)
            .collection("procedures")
            .document(procedure_id)
        )
        doc = await doc_ref.get()

        if not doc.exists:
            return None

        return Procedure(**doc.to_dict())

    async def get_all_procedures(self, session_id: str) -> List[Procedure]:
        """セッションの全手続きをサブコレクションから取得"""
        procedures_ref = self.sessions_collection.document(session_id).collection("procedures")
        docs = procedures_ref.stream()

        procedures = []
        async for doc in docs:
            procedures.append(Procedure(**doc.to_dict()))

        return procedures

    async def update_procedure(self, session_id: str, procedure_id: str, updates: dict) -> None:
        """手続きを更新（サブコレクション構造のため、トランザクション不要）"""
        doc_ref = (
            self.sessions_collection.document(session_id)
            .collection("procedures")
            .document(procedure_id)
        )

        updates["updatedAt"] = datetime.utcnow()
        await doc_ref.update(updates)

    def validate_dependencies(self, procedures: List[Procedure]) -> bool:
        """
        手続きの依存関係を検証し、循環依存がないことを確認します。
        トポロジカルソートを使用して有向非巡回グラフ（DAG）を検証します。

        Returns:
            bool: 依存関係が有効な場合は True、循環依存がある場合は False
        """
        # 手続きIDのセット
        procedure_ids = {p.id for p in procedures}

        # 依存関係の検証（参照先が存在しない場合は警告）
        for procedure in procedures:
            for dep_id in procedure.dependencies:
                if dep_id not in procedure_ids:
                    logger.warning(
                        f"Procedure {procedure.id} has invalid dependency: {dep_id}"
                    )

        # トポロジカルソートで循環依存をチェック
        visited = set()
        rec_stack = set()

        def has_cycle(proc_id: str) -> bool:
            visited.add(proc_id)
            rec_stack.add(proc_id)

            # 依存先を再帰的にチェック
            proc = next((p for p in procedures if p.id == proc_id), None)
            if proc:
                for dep_id in proc.dependencies:
                    if dep_id not in procedure_ids:
                        continue  # 存在しない依存関係はスキップ

                    if dep_id not in visited:
                        if has_cycle(dep_id):
                            return True
                    elif dep_id in rec_stack:
                        return True

            rec_stack.remove(proc_id)
            return False

        # 全ての手続きをチェック
        for procedure in procedures:
            if procedure.id not in visited:
                if has_cycle(procedure.id):
                    logger.error("Circular dependency detected in procedures")
                    return False

        return True
