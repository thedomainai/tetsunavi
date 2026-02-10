"""ドメインモデル"""

from pydantic import BaseModel, Field, field_validator, ConfigDict
from datetime import datetime
from typing import Optional, List
from enum import Enum
import uuid


# 共通型
class Location(BaseModel):
    """所在地"""

    prefecture: str = Field(..., min_length=1, max_length=10)
    city: str = Field(..., min_length=1, max_length=50)


# セッション型
class SessionStatus(str, Enum):
    """セッション状態"""

    CREATED = "created"
    INTERVIEW_COMPLETED = "interview_completed"
    PROCEDURES_GENERATED = "procedures_generated"


class SessionMeta(BaseModel):
    """セッションメタデータ"""

    version: str = "1.0"
    user_agent: Optional[str] = Field(alias="userAgent", default=None)
    ip_address: Optional[str] = Field(alias="ipAddress", default=None)

    model_config = ConfigDict(populate_by_name=True)


class Session(BaseModel):
    """セッション"""

    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="sessionId")
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")
    status: SessionStatus = SessionStatus.CREATED

    move_from: Location = Field(alias="moveFrom")
    move_to: Location = Field(alias="moveTo")
    move_date: datetime = Field(alias="moveDate")

    interview: Optional["Interview"] = None

    meta: SessionMeta = Field(default_factory=SessionMeta)

    model_config = ConfigDict(populate_by_name=True)

    @field_validator("move_date")
    @classmethod
    def validate_move_date(cls, v: datetime) -> datetime:
        """引越し日は未来日付である必要がある"""
        if v < datetime.utcnow():
            raise ValueError("引越し日は未来の日付である必要があります")
        return v


# インタビュー型
class QuestionType(str, Enum):
    """質問タイプ"""

    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    TEXT = "text"
    BOOLEAN = "boolean"


class Question(BaseModel):
    """質問"""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    type: QuestionType
    options: Optional[List[str]] = None
    required: bool = True

    @field_validator("options")
    @classmethod
    def validate_options(cls, v: Optional[List[str]], info) -> Optional[List[str]]:
        """選択肢のバリデーション"""
        question_type = info.data.get("type")
        if question_type in [QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE]:
            if not v or len(v) < 2:
                raise ValueError("選択肢は2つ以上必要です")
        return v


class AnswerRecord(BaseModel):
    """回答記録"""

    question_id: str = Field(alias="questionId")
    question: str
    value: str | List[str] | bool

    model_config = ConfigDict(populate_by_name=True)


class Interview(BaseModel):
    """インタビュー"""

    completed_at: Optional[datetime] = Field(alias="completedAt", default=None)
    answers: List[AnswerRecord] = []

    # 構造化データ
    family: List[str] = []
    has_car: bool = Field(alias="hasCar", default=False)
    has_pet: bool = Field(alias="hasPet", default=False)
    pet_type: Optional[str] = Field(alias="petType", default=None)
    has_my_number: bool = Field(alias="hasMyNumber", default=False)

    model_config = ConfigDict(populate_by_name=True)


# 手続き型
class ProcedureCategory(str, Enum):
    """手続きカテゴリ"""

    ADMINISTRATIVE = "行政"
    PRIVATE = "民間"


class ProcedurePriority(str, Enum):
    """手続き優先度"""

    HIGH = "高"
    MEDIUM = "中"
    LOW = "低"


class DeadlineType(str, Enum):
    """期限タイプ"""

    BEFORE_MOVE = "引越し前"
    AFTER_MOVE = "引越し後"
    ON_MOVE_DATE = "引越し当日"


class Deadline(BaseModel):
    """期限"""

    type: DeadlineType
    days_after: Optional[int] = Field(alias="daysAfter", default=None)
    absolute_date: Optional[datetime] = Field(alias="absoluteDate", default=None)
    description: str

    model_config = ConfigDict(populate_by_name=True)

    @field_validator("days_after")
    @classmethod
    def validate_days_after(cls, v: Optional[int]) -> Optional[int]:
        """days_after は0以上である必要がある"""
        if v is not None and v < 0:
            raise ValueError("days_after は0以上である必要があります")
        return v


class Document(BaseModel):
    """必要書類"""

    name: str
    description: str
    required: bool = True
    obtain_method: Optional[str] = Field(alias="obtainMethod", default=None)

    model_config = ConfigDict(populate_by_name=True)


class Office(BaseModel):
    """窓口情報"""

    name: str
    address: str
    phone: str
    hours: str
    nearest_station: Optional[str] = Field(alias="nearestStation", default=None)
    map_url: Optional[str] = Field(alias="mapUrl", default=None)

    model_config = ConfigDict(populate_by_name=True)


class Step(BaseModel):
    """手順"""

    order: int = Field(..., ge=1)
    description: str
    estimated_duration: Optional[int] = Field(alias="estimatedDuration", ge=0, default=None)

    model_config = ConfigDict(populate_by_name=True)


class RelatedLink(BaseModel):
    """関連リンク"""

    title: str
    url: str


class Procedure(BaseModel):
    """手続き"""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: ProcedureCategory
    priority: ProcedurePriority
    deadline: Deadline
    estimated_duration: int = Field(alias="estimatedDuration", ge=0)

    # 詳細情報（lazy load）
    documents: Optional[List[Document]] = None
    office: Optional[Office] = None
    steps: Optional[List[Step]] = None
    notes: Optional[List[str]] = None
    related_links: Optional[List[RelatedLink]] = Field(alias="relatedLinks", default=None)

    dependencies: List[str] = []

    is_completed: bool = Field(alias="isCompleted", default=False)
    completed_at: Optional[datetime] = Field(alias="completedAt", default=None)

    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    model_config = ConfigDict(populate_by_name=True)


# タイムライン型
class TimelineProcedure(BaseModel):
    """タイムライン用手続き"""

    id: str
    title: str
    priority: ProcedurePriority
    estimated_duration: int = Field(alias="estimatedDuration")
    is_completed: bool = Field(alias="isCompleted")

    model_config = ConfigDict(populate_by_name=True)


class TimelineItem(BaseModel):
    """タイムライン項目"""

    date: datetime
    label: str
    procedures: List[TimelineProcedure]


class MilestoneType(str, Enum):
    """マイルストーンタイプ"""

    MOVE_DATE = "moveDate"
    DEADLINE = "deadline"
    CUSTOM = "custom"


class Milestone(BaseModel):
    """マイルストーン"""

    date: datetime
    label: str
    type: MilestoneType


class Timeline(BaseModel):
    """タイムライン"""

    items: List[TimelineItem] = Field(alias="timeline")
    milestones: List[Milestone]

    model_config = ConfigDict(populate_by_name=True)
