"""API レスポンスモデル"""

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Generic, TypeVar, Optional, List
from models.domain import (
    SessionStatus,
    Question,
    Procedure,
    TimelineItem,
    Milestone,
)

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """API レスポンス"""

    data: T
    meta: Optional[dict] = None


class ErrorResponse(BaseModel):
    """エラーレスポンス"""

    error: dict


class CreateSessionData(BaseModel):
    """セッション作成データ"""

    session_id: str = Field(alias="sessionId")
    created_at: datetime = Field(alias="createdAt")
    status: SessionStatus

    model_config = ConfigDict(populate_by_name=True)


class CreateSessionResponse(BaseModel):
    """セッション作成レスポンス"""

    data: CreateSessionData


class InterviewQuestionsData(BaseModel):
    """インタビュー質問データ"""

    questions: List[Question]
    estimated_time: int = Field(alias="estimatedTime")

    model_config = ConfigDict(populate_by_name=True)


class InterviewQuestionsResponse(BaseModel):
    """インタビュー質問レスポンス"""

    data: InterviewQuestionsData


class InterviewAnswersData(BaseModel):
    """インタビュー回答データ"""

    status: str
    next_step: str = Field(alias="nextStep")

    model_config = ConfigDict(populate_by_name=True)


class InterviewAnswersResponse(BaseModel):
    """インタビュー回答レスポンス"""

    data: InterviewAnswersData


class ProcedureListData(BaseModel):
    """手続きリストデータ"""

    procedures: List[Procedure]
    total_count: int = Field(alias="totalCount")
    completed_count: int = Field(alias="completedCount")

    model_config = ConfigDict(populate_by_name=True)


class ProcedureListResponse(BaseModel):
    """手続きリストレスポンス"""

    data: ProcedureListData


class ProcedureDetailResponse(BaseModel):
    """手続き詳細レスポンス"""

    data: Procedure


class ProcedureUpdateData(BaseModel):
    """手続き更新データ"""

    id: str
    is_completed: bool = Field(alias="isCompleted")
    completed_at: Optional[datetime] = Field(alias="completedAt", default=None)

    model_config = ConfigDict(populate_by_name=True)


class ProcedureUpdateResponse(BaseModel):
    """手続き更新レスポンス"""

    data: ProcedureUpdateData


class TimelineData(BaseModel):
    """タイムラインデータ"""

    timeline: List[TimelineItem]
    milestones: List[Milestone]


class TimelineResponse(BaseModel):
    """タイムラインレスポンス"""

    data: TimelineData


class ChatResponseData(BaseModel):
    """チャットレスポンスデータ"""

    reply: str
    suggested_questions: List[str] = Field(alias="suggestedQuestions", default_factory=list)

    model_config = ConfigDict(populate_by_name=True)


class ChatResponse(BaseModel):
    """チャットレスポンス"""

    data: ChatResponseData
