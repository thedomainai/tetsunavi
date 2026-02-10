"""Vertex AI クライアント"""

import logging
from typing import Any, Dict
from google.cloud import aiplatform
from core.config import settings
from core.exceptions import AIServiceError
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)


class VertexAIService:
    """Vertex AI クライアント"""

    def __init__(self):
        aiplatform.init(
            project=settings.GOOGLE_CLOUD_PROJECT, location=settings.VERTEX_AI_LOCATION
        )
        self.model_name = settings.VERTEX_AI_MODEL

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def generate_text(
        self, prompt: str, temperature: float = 0.7, max_tokens: int = 2048
    ) -> str:
        """
        Gemini 2.0 Flash でテキスト生成します。

        Args:
            prompt: プロンプト
            temperature: 温度（0.0-1.0）
            max_tokens: 最大トークン数

        Returns:
            生成されたテキスト
        """
        try:
            from vertexai.generative_models import GenerativeModel

            model = GenerativeModel(self.model_name)

            response = await model.generate_content_async(
                prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )

            return response.text

        except Exception as e:
            logger.error(f"Vertex AI text generation failed: {e}", exc_info=True)
            raise AIServiceError(f"テキスト生成に失敗しました: {str(e)}")

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def search_knowledge(self, query: str, max_results: int = 10) -> list[Dict[str, Any]]:
        """
        Vertex AI Search で手続き情報を検索します。

        MVP では未実装（将来の拡張）。現在は Gemini で直接生成します。

        Args:
            query: 検索クエリ
            max_results: 最大結果数

        Returns:
            検索結果のリスト
        """
        # MVP では未実装
        logger.warning("Vertex AI Search is not implemented in MVP")
        return []
