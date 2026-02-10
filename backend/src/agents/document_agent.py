"""Document Agent - 書類情報エージェント"""

import logging
from typing import List
from agents.base_agent import BaseAgent
from models.domain import Session, Procedure, Document, Step

logger = logging.getLogger(__name__)


class DocumentAgent(BaseAgent):
    """書類情報エージェント"""

    async def get_documents(self, session: Session, procedure: Procedure) -> List[Document]:
        """
        手続きの必要書類を特定します。

        Args:
            session: セッション情報
            procedure: 手続き情報

        Returns:
            必要書類のリスト
        """
        prompt = f"""
あなたは行政手続きの専門家です。以下の手続きに必要な書類と手順を詳細に教えてください。

## 手続き情報
- 手続き名: {procedure.title}
- カテゴリ: {procedure.category.value}
- 引越し元: {session.move_from.prefecture}{session.move_from.city}
- 引越し先: {session.move_to.prefecture}{session.move_to.city}

## 出力形式（JSON）
{{
  "documents": [
    {{
      "name": "本人確認書類",
      "description": "運転免許証、パスポート、マイナンバーカードなど",
      "required": true,
      "obtainMethod": "既に所持"
    }},
    {{
      "name": "印鑑",
      "description": "認印可",
      "required": false,
      "obtainMethod": null
    }}
  ],
  "steps": [
    {{
      "order": 1,
      "description": "必要書類を準備する",
      "estimatedDuration": 10
    }},
    {{
      "order": 2,
      "description": "市役所の窓口で申請書を記入する",
      "estimatedDuration": 15
    }}
  ],
  "notes": [
    "平日のみ受付",
    "混雑する時間帯は午前中です"
  ]
}}

JSONのみを出力してください。
"""

        response = await self.generate(prompt, temperature=0.5)
        data = await self.parse_json_response(response)

        # Document モデルに変換
        documents = []
        if isinstance(data.get("documents"), list):
            for doc_data in data["documents"]:
                try:
                    document = Document(
                        name=doc_data["name"],
                        description=doc_data["description"],
                        required=doc_data.get("required", True),
                        obtain_method=doc_data.get("obtainMethod"),
                    )
                    documents.append(document)
                except Exception as e:
                    logger.error(f"Failed to parse document: {e}")
                    continue

        # Step も返す（手続き詳細で使用）
        steps = []
        if isinstance(data.get("steps"), list):
            for step_data in data["steps"]:
                try:
                    step = Step(
                        order=step_data["order"],
                        description=step_data["description"],
                        estimated_duration=step_data.get("estimatedDuration"),
                    )
                    steps.append(step)
                except Exception as e:
                    logger.error(f"Failed to parse step: {e}")
                    continue

        # notes も返す
        notes = data.get("notes", [])

        # 手続きに詳細情報を設定
        procedure.documents = documents
        procedure.steps = steps
        procedure.notes = notes

        return documents

    async def get_procedure_details(
        self, session: Session, procedure: Procedure
    ) -> Procedure:
        """
        手続きの詳細情報（書類、手順、注意事項）を取得します。

        Args:
            session: セッション情報
            procedure: 手続き情報

        Returns:
            詳細情報が追加された手続き
        """
        await self.get_documents(session, procedure)
        return procedure
