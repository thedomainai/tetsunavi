"""FastAPI アプリケーションエントリーポイント"""

import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from core.config import settings
from core.logging import setup_logging
from core.middleware import RequestLoggingMiddleware
from core.exceptions import AppError
from api.v1 import sessions, interview, procedures, timeline, chat

# ロギング設定
setup_logging(log_level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

# FastAPI アプリケーション
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="ライフイベント×行政手続きAIエージェント",
    debug=settings.DEBUG,
)

# レート制限
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS ミドルウェア
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["*"],
)

# リクエストログミドルウェア
app.add_middleware(RequestLoggingMiddleware)


# エラーハンドラー
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """HTTPExceptionを統一フォーマットで返す"""
    detail = exc.detail
    if isinstance(detail, dict):
        code = detail.get("code", "UNKNOWN_ERROR")
        message = detail.get("message", str(detail))
    else:
        code = "UNKNOWN_ERROR"
        message = str(detail)

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "request_id": getattr(request.state, "request_id", None),
            }
        },
    )


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    """アプリケーションエラーハンドラー"""
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "request_id": getattr(request.state, "request_id", None),
            }
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """一般的な例外ハンドラー"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "システムエラーが発生しました",
                "request_id": getattr(request.state, "request_id", None),
            }
        },
    )


# ルーター登録
app.include_router(sessions.router, prefix="/api/v1", tags=["sessions"])
app.include_router(interview.router, prefix="/api/v1", tags=["interview"])
app.include_router(procedures.router, prefix="/api/v1", tags=["procedures"])
app.include_router(timeline.router, prefix="/api/v1", tags=["timeline"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])


# ヘルスチェック
@app.get("/health")
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "ok", "service": settings.APP_NAME}


# ルート
@app.get("/")
async def root():
    """ルートエンドポイント"""
    return {
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
