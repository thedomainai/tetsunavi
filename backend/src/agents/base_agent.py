"""エージェント基底クラス"""

import logging
from typing import Any, Dict
from services.vertex_ai_service import VertexAIService

logger = logging.getLogger(__name__)


class BaseAgent:
    """エージェント基底クラス"""

    def __init__(self):
        self.vertex_ai = VertexAIService()

    async def generate(self, prompt: str, temperature: float = 0.7) -> str:
        """Vertex AI でテキスト生成"""
        return await self.vertex_ai.generate_text(prompt, temperature=temperature)

    async def parse_json_response(self, response: str) -> Dict[str, Any]:
        """JSON レスポンスをパース"""
        import json

        try:
            # レスポンスから JSON 部分を抽出
            start = response.find("{")
            end = response.rfind("}") + 1
            if start == -1 or end == 0:
                start = response.find("[")
                end = response.rfind("]") + 1

            json_str = response[start:end]
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Response: {response}")
            return {}
