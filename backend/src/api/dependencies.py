"""FastAPI 依存性注入"""

from functools import lru_cache
from core.config import settings


@lru_cache()
def _get_firestore_service_singleton():
    """Firestore サービスのシングルトンを取得"""
    if settings.MOCK_MODE:
        from services.mock_firestore_service import InMemoryFirestoreService
        return InMemoryFirestoreService(collection_name=settings.FIRESTORE_COLLECTION)
    else:
        from services.firestore_service import FirestoreService
        return FirestoreService(collection_name=settings.FIRESTORE_COLLECTION)


def get_firestore_service():
    """Firestore サービスを取得"""
    return _get_firestore_service_singleton()


def get_session_service():
    """セッションサービスを取得"""
    from services.session_service import SessionService
    firestore = get_firestore_service()
    return SessionService(firestore=firestore)


def get_root_agent():
    """Root Agent を取得"""
    if settings.MOCK_MODE:
        from agents.mock_root_agent import MockRootAgent
        return MockRootAgent()
    else:
        from agents.root_agent import RootAgent
        return RootAgent()
