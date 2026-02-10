"""API リクエストモデル"""

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import List
from models.domain import Location


class CreateSessionRequest(BaseModel):
    """セッション作成リクエスト"""

    move_from: Location = Field(alias="moveFrom")
    move_to: Location = Field(alias="moveTo")
    move_date: datetime = Field(alias="moveDate")

    model_config = ConfigDict(populate_by_name=True)


class Answer(BaseModel):
    """回答"""

    question_id: str = Field(alias="questionId")
    value: str | List[str] | bool

    model_config = ConfigDict(populate_by_name=True)


class InterviewAnswersRequest(BaseModel):
    """インタビュー回答リクエスト"""

    answers: List[Answer]


class UpdateProcedureRequest(BaseModel):
    """手続き更新リクエスト"""

    is_completed: bool = Field(alias="isCompleted")

    model_config = ConfigDict(populate_by_name=True)
