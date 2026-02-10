"""Interview Agent - 質問生成エージェント"""

import logging
from typing import List
from agents.base_agent import BaseAgent
from models.domain import Session, Question, QuestionType

logger = logging.getLogger(__name__)


class InterviewAgent(BaseAgent):
    """質問生成エージェント"""

    async def generate_questions(self, session: Session) -> List[Question]:
        """
        セッション情報から5-6問の質問を生成します。

        Args:
            session: セッション情報

        Returns:
            質問のリスト
        """
        prompt = f"""
あなたは引越し手続きのアドバイザーです。以下の引越し情報に基づいて、必要な行政手続きと民間手続きを特定するための質問を5-6個生成してください。

## 引越し情報
- 引越し元: {session.move_from.prefecture}{session.move_from.city}
- 引越し先: {session.move_to.prefecture}{session.move_to.city}
- 引越し日: {session.move_date.strftime('%Y年%m月%d日')}

## 質問のガイドライン
- 家族構成、車の所有、ペット、マイナンバーカードの有無など、手続きに関係する情報を聞く
- 回答しやすいように、選択肢形式を優先する
- 必須の質問は4-5個程度にする

## 出力形式（JSON配列）
[
  {{
    "id": "q1",
    "text": "家族構成を教えてください",
    "type": "multiple_choice",
    "options": ["本人のみ", "配偶者", "子供（未就学児）", "子供（小学生）", "子供（中学生以上）", "高齢者"],
    "required": true
  }},
  {{
    "id": "q2",
    "text": "車を所有していますか？",
    "type": "boolean",
    "required": true
  }}
]

JSON配列のみを出力してください。
"""

        response = await self.generate(prompt, temperature=0.7)
        questions_data = await self.parse_json_response(response)

        # Question モデルに変換
        questions = []
        if isinstance(questions_data, list):
            for q_data in questions_data:
                try:
                    question = Question(
                        id=q_data.get("id", f"q{len(questions) + 1}"),
                        text=q_data["text"],
                        type=QuestionType(q_data["type"]),
                        options=q_data.get("options"),
                        required=q_data.get("required", True),
                    )
                    questions.append(question)
                except Exception as e:
                    logger.error(f"Failed to parse question: {e}")
                    continue

        # 最低限の質問を保証
        if len(questions) == 0:
            # フォールバック: デフォルトの質問を返す
            questions = self._get_default_questions()

        return questions

    def _get_default_questions(self) -> List[Question]:
        """デフォルトの質問（フォールバック用）"""
        return [
            Question(
                id="q1",
                text="家族構成を教えてください（複数選択可）",
                type=QuestionType.MULTIPLE_CHOICE,
                options=[
                    "本人のみ",
                    "配偶者",
                    "子供（未就学児）",
                    "子供（小学生）",
                    "子供（中学生以上）",
                ],
                required=True,
            ),
            Question(
                id="q2",
                text="車を所有していますか？",
                type=QuestionType.BOOLEAN,
                required=True,
            ),
            Question(
                id="q3",
                text="ペットを飼っていますか？",
                type=QuestionType.BOOLEAN,
                required=True,
            ),
            Question(
                id="q4",
                text="マイナンバーカードをお持ちですか？",
                type=QuestionType.BOOLEAN,
                required=True,
            ),
            Question(
                id="q5",
                text="現在の職業を教えてください",
                type=QuestionType.SINGLE_CHOICE,
                options=["会社員", "自営業", "学生", "無職", "その他"],
                required=False,
            ),
        ]
