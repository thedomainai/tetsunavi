"""Location Agent - 窓口情報エージェント"""

import logging
from typing import Optional
from agents.base_agent import BaseAgent
from models.domain import Session, Procedure, Office

logger = logging.getLogger(__name__)


class LocationAgent(BaseAgent):
    """窓口情報エージェント"""

    async def get_office_info(self, session: Session, procedure: Procedure) -> Optional[Office]:
        """
        Google Maps API で窓口を検索します。

        MVP では Gemini で窓口情報を生成（Maps API 連携は将来拡張）。

        Args:
            session: セッション情報
            procedure: 手続き情報

        Returns:
            窓口情報
        """
        # 手続きカテゴリが民間の場合は窓口情報なし
        if procedure.category.value == "民間":
            return None

        prompt = f"""
あなたは行政手続きの専門家です。以下の手続きの窓口情報を教えてください。

## 手続き情報
- 手続き名: {procedure.title}
- 場所: {session.move_to.prefecture}{session.move_to.city}

## 出力形式（JSON）
{{
  "name": "{session.move_to.city}役所",
  "address": "{session.move_to.prefecture}{session.move_to.city}〇〇1-2-3",
  "phone": "03-1234-5678",
  "hours": "平日 8:30-17:15",
  "nearestStation": "〇〇駅から徒歩5分",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query={session.move_to.city}役所"
}}

JSONのみを出力してください。実在する情報に基づいて回答してください。
"""

        response = await self.generate(prompt, temperature=0.3)
        data = await self.parse_json_response(response)

        # Office モデルに変換
        try:
            office = Office(
                name=data.get("name", f"{session.move_to.city}役所"),
                address=data.get("address", ""),
                phone=data.get("phone", ""),
                hours=data.get("hours", "平日 8:30-17:15"),
                nearest_station=data.get("nearestStation"),
                map_url=data.get("mapUrl"),
            )
            return office
        except Exception as e:
            logger.error(f"Failed to parse office info: {e}")
            # フォールバック
            return Office(
                name=f"{session.move_to.city}役所",
                address=f"{session.move_to.prefecture}{session.move_to.city}",
                phone="お問い合わせください",
                hours="平日 8:30-17:15",
            )
