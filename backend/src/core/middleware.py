"""ミドルウェア"""

import logging
import uuid
from datetime import datetime
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """リクエストログ出力とリクエストID付与"""

    async def dispatch(self, request: Request, call_next):
        # リクエストID生成
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id

        # リクエスト開始時刻
        start_time = datetime.utcnow()

        # ログ出力（構造化）
        logger.info(
            f"{request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
            },
        )

        try:
            # リクエスト処理
            response: Response = await call_next(request)

            # レスポンスヘッダーにリクエストIDを追加
            response.headers["X-Request-ID"] = request_id

            # レスポンス時間計算
            duration = (datetime.utcnow() - start_time).total_seconds()

            # レスポンスログ
            logger.info(
                f"Response {response.status_code}",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "duration_seconds": duration,
                },
            )

            return response

        except Exception as e:
            # エラーログ
            duration = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                f"Request failed: {str(e)}",
                extra={
                    "request_id": request_id,
                    "duration_seconds": duration,
                },
                exc_info=True,
            )
            raise
