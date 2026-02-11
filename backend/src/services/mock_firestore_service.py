"""インメモリ Firestore サービス（モックモード用）"""

from datetime import datetime
from typing import Optional, List
import logging
from models.domain import Session, Procedure

logger = logging.getLogger(__name__)


class InMemoryFirestoreService:
    """インメモリ Firestore サービス（GCP 不要で動作）"""

    def __init__(self, collection_name: str = "sessions"):
        self._sessions: dict[str, dict] = {}
        self._procedures: dict[str, dict[str, dict]] = {}
        self.collection_name = collection_name
        logger.info("InMemoryFirestoreService initialized (mock mode)")

    async def save_session(self, session: Session) -> None:
        """セッションをメモリに保存"""
        session.updated_at = datetime.utcnow()
        session_dict = session.model_dump(by_alias=True, mode="json")
        self._sessions[session.session_id] = session_dict

    async def get_session(self, session_id: str) -> Optional[Session]:
        """セッションをメモリから取得"""
        session_data = self._sessions.get(session_id)
        if not session_data:
            return None
        return Session(**session_data)

    async def update_session(self, session_id: str, updates: dict) -> None:
        """セッションを部分的に更新"""
        if session_id not in self._sessions:
            return
        updates["updatedAt"] = datetime.utcnow().isoformat()
        self._sessions[session_id].update(updates)

    async def save_procedure(self, session_id: str, procedure: Procedure) -> None:
        """手続きをメモリに保存"""
        procedure.updated_at = datetime.utcnow()
        if session_id not in self._procedures:
            self._procedures[session_id] = {}
        procedure_dict = procedure.model_dump(by_alias=True, mode="json")
        self._procedures[session_id][procedure.id] = procedure_dict

    async def save_procedures_batch(self, session_id: str, procedures: List[Procedure]) -> None:
        """複数の手続きを一括でメモリに保存"""
        if session_id not in self._procedures:
            self._procedures[session_id] = {}
        for procedure in procedures:
            procedure.updated_at = datetime.utcnow()
            procedure_dict = procedure.model_dump(by_alias=True, mode="json")
            self._procedures[session_id][procedure.id] = procedure_dict

    async def get_procedure(self, session_id: str, procedure_id: str) -> Optional[Procedure]:
        """特定の手続きをメモリから取得"""
        procs = self._procedures.get(session_id, {})
        proc_data = procs.get(procedure_id)
        if not proc_data:
            return None
        return Procedure(**proc_data)

    async def get_all_procedures(self, session_id: str) -> List[Procedure]:
        """セッションの全手続きをメモリから取得"""
        procs = self._procedures.get(session_id, {})
        return [Procedure(**data) for data in procs.values()]

    async def update_procedure(self, session_id: str, procedure_id: str, updates: dict) -> None:
        """手続きを更新"""
        procs = self._procedures.get(session_id, {})
        if procedure_id not in procs:
            return
        updates["updatedAt"] = datetime.utcnow().isoformat()
        procs[procedure_id].update(updates)

    def validate_dependencies(self, procedures: List[Procedure]) -> bool:
        """依存関係を検証（FirestoreService と同じロジック）"""
        procedure_ids = {p.id for p in procedures}
        visited = set()
        rec_stack = set()

        def has_cycle(proc_id: str) -> bool:
            visited.add(proc_id)
            rec_stack.add(proc_id)
            proc = next((p for p in procedures if p.id == proc_id), None)
            if proc:
                for dep_id in proc.dependencies:
                    if dep_id not in procedure_ids:
                        continue
                    if dep_id not in visited:
                        if has_cycle(dep_id):
                            return True
                    elif dep_id in rec_stack:
                        return True
            rec_stack.remove(proc_id)
            return False

        for procedure in procedures:
            if procedure.id not in visited:
                if has_cycle(procedure.id):
                    return False
        return True
