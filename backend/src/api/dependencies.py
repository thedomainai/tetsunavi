"""FastAPI 依存性注入"""

from services.firestore_service import FirestoreService
from services.session_service import SessionService
from agents.root_agent import RootAgent
from core.config import settings


def get_firestore_service() -> FirestoreService:
    """Firestore サービスを取得"""
    return FirestoreService(collection_name=settings.FIRESTORE_COLLECTION)


def get_session_service() -> SessionService:
    """セッションサービスを取得"""
    firestore = get_firestore_service()
    return SessionService(firestore=firestore)


def get_root_agent() -> RootAgent:
    """Root Agent を取得"""
    return RootAgent()
