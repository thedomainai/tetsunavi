"""カスタム例外クラス"""


class AppError(Exception):
    """アプリケーション基底エラー"""

    def __init__(self, message: str, code: str = "APP_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class ValidationError(AppError):
    """バリデーションエラー"""

    def __init__(self, message: str = "入力内容に誤りがあります"):
        super().__init__(message, code="VALIDATION_ERROR")


class NotFoundError(AppError):
    """リソースが見つからない"""

    def __init__(self, message: str = "リソースが見つかりません"):
        super().__init__(message, code="NOT_FOUND")


class AIServiceError(AppError):
    """AI サービスエラー"""

    def __init__(self, message: str = "AI処理でエラーが発生しました"):
        super().__init__(message, code="AI_SERVICE_ERROR")


class DatabaseError(AppError):
    """データベースエラー"""

    def __init__(self, message: str = "データベースエラーが発生しました"):
        super().__init__(message, code="DATABASE_ERROR")


class TimeoutError(AppError):
    """タイムアウトエラー"""

    def __init__(self, message: str = "処理に時間がかかりすぎました"):
        super().__init__(message, code="TIMEOUT_ERROR")
