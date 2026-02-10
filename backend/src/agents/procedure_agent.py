"""Procedure Agent - 手続き特定エージェント"""

import logging
from typing import List
from agents.base_agent import BaseAgent
from models.domain import (
    Session,
    Procedure,
    ProcedureCategory,
    ProcedurePriority,
    Deadline,
    DeadlineType,
)
from utils.date_utils import calculate_deadline

logger = logging.getLogger(__name__)


class ProcedureAgent(BaseAgent):
    """手続き特定エージェント"""

    async def identify_procedures(self, session: Session) -> List[Procedure]:
        """
        インタビュー結果から20-30の手続きを特定します。

        MVP では Gemini で手続きリストを直接生成（RAG は将来拡張）。

        Args:
            session: セッション情報

        Returns:
            手続きのリスト
        """
        # インタビュー情報を文字列化
        interview_info = ""
        if session.interview:
            interview_info = f"""
- 家族構成: {', '.join(session.interview.family) if session.interview.family else '本人のみ'}
- 車の所有: {'あり' if session.interview.has_car else 'なし'}
- ペット: {'あり' if session.interview.has_pet else 'なし'}
- ペットの種類: {session.interview.pet_type or 'なし'}
- マイナンバーカード: {'あり' if session.interview.has_my_number else 'なし'}
"""

        prompt = f"""
あなたは引越し手続きの専門家です。以下の状況に基づいて、必要な行政手続きと民間手続きを全て洗い出してください。

## 引越し情報
- 引越し元: {session.move_from.prefecture}{session.move_from.city}
- 引越し先: {session.move_to.prefecture}{session.move_to.city}
- 引越し日: {session.move_date.strftime('%Y年%m月%d日')}

## ユーザーの状況
{interview_info}

## 出力形式
以下のJSON配列形式で出力してください（20〜30項目）:
[
  {{
    "title": "転入届の提出",
    "category": "行政",
    "priority": "高",
    "deadline": {{
      "type": "引越し後",
      "daysAfter": 14,
      "description": "引越し後14日以内"
    }},
    "estimatedDuration": 30,
    "dependencies": []
  }},
  {{
    "title": "電気の契約変更",
    "category": "民間",
    "priority": "高",
    "deadline": {{
      "type": "引越し前",
      "description": "引越しの1週間前まで"
    }},
    "estimatedDuration": 15,
    "dependencies": []
  }}
]

注意:
- category は "行政" または "民間" のみ
- priority は "高"、"中"、"低" のみ
- deadline.type は "引越し前"、"引越し後"、"引越し当日" のみ
- estimatedDuration は分単位
- dependencies は依存する手続きのtitleの配列（初回は空配列）

JSON配列のみを出力してください。
"""

        response = await self.generate(prompt, temperature=0.7)
        procedures_data = await self.parse_json_response(response)

        # Procedure モデルに変換
        procedures = []
        if isinstance(procedures_data, list):
            for p_data in procedures_data:
                try:
                    # Deadline を構築
                    deadline_data = p_data.get("deadline", {})
                    deadline_type = DeadlineType(deadline_data.get("type", "引越し後"))
                    days_after = deadline_data.get("daysAfter")

                    # 絶対日付を計算
                    absolute_date = None
                    if deadline_type != DeadlineType.BEFORE_MOVE:
                        absolute_date = calculate_deadline(
                            session.move_date, deadline_type, days_after
                        )

                    deadline = Deadline(
                        type=deadline_type,
                        days_after=days_after,
                        absolute_date=absolute_date,
                        description=deadline_data.get("description", ""),
                    )

                    procedure = Procedure(
                        title=p_data["title"],
                        category=ProcedureCategory(p_data["category"]),
                        priority=ProcedurePriority(p_data["priority"]),
                        deadline=deadline,
                        estimated_duration=p_data.get("estimatedDuration", 30),
                        dependencies=p_data.get("dependencies", []),
                    )
                    procedures.append(procedure)
                except Exception as e:
                    logger.error(f"Failed to parse procedure: {e}")
                    logger.error(f"Procedure data: {p_data}")
                    continue

        # 最低限の手続きを保証
        if len(procedures) == 0:
            procedures = self._get_default_procedures(session)

        return procedures

    def _get_default_procedures(self, session: Session) -> List[Procedure]:
        """デフォルトの手続き（フォールバック用）"""
        return [
            Procedure(
                title="転入届の提出",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=14,
                    absolute_date=calculate_deadline(session.move_date, DeadlineType.AFTER_MOVE, 14),
                    description="引越し後14日以内",
                ),
                estimated_duration=30,
            ),
            Procedure(
                title="転出届の提出",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=session.move_date,
                    description="引越し前まで",
                ),
                estimated_duration=30,
            ),
        ]
