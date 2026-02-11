"""Mock Root Agent - モックモード用オーケストレーター"""

import logging
from typing import List
from datetime import datetime, timedelta
from models.domain import (
    Session,
    Procedure,
    Question,
    QuestionType,
    ProcedureCategory,
    ProcedurePriority,
    Deadline,
    DeadlineType,
    Document,
    Office,
    Step,
    Timeline,
    TimelineItem,
    TimelineProcedure,
    Milestone,
    MilestoneType,
)

logger = logging.getLogger(__name__)


class MockRootAgent:
    """モックモード用オーケストレーター（AI 呼び出しなし）"""

    async def generate_questions(self, session: Session) -> List[Question]:
        """モック質問を返す"""
        logger.info(f"[MOCK] Generating questions for session {session.session_id}")
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
                    "高齢者（65歳以上）",
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
                options=["会社員", "公務員", "自営業", "学生", "無職・主婦/主夫", "その他"],
                required=False,
            ),
        ]

    async def generate_procedures(self, session: Session) -> List[Procedure]:
        """モック手続きリストを返す（20項目）"""
        logger.info(f"[MOCK] Generating procedures for session {session.session_id}")
        move_date = session.move_date
        from_city = session.move_from.city
        to_city = session.move_to.city

        procedures = [
            # === 行政手続き（引越し前）===
            Procedure(
                title="転出届の提出",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date - timedelta(days=14),
                    description="引越し14日前〜当日まで",
                ),
                estimated_duration=30,
            ),
            Procedure(
                title="国民健康保険の資格喪失届",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date,
                    description="転出届と同時に手続き",
                ),
                estimated_duration=15,
            ),
            Procedure(
                title="印鑑登録の廃止届",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.MEDIUM,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date,
                    description="転出届と同時に手続き",
                ),
                estimated_duration=10,
            ),
            Procedure(
                title="児童手当の受給事由消滅届",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date,
                    description="転出届と同時に手続き",
                ),
                estimated_duration=15,
            ),
            # === 行政手続き（引越し後）===
            Procedure(
                title="転入届の提出",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=14,
                    absolute_date=move_date + timedelta(days=14),
                    description="引越し後14日以内",
                ),
                estimated_duration=30,
            ),
            Procedure(
                title="マイナンバーカードの住所変更",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=14,
                    absolute_date=move_date + timedelta(days=14),
                    description="転入届と同時に手続き",
                ),
                estimated_duration=15,
            ),
            Procedure(
                title="国民健康保険の加入手続き",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=14,
                    absolute_date=move_date + timedelta(days=14),
                    description="転入届と同時に手続き",
                ),
                estimated_duration=15,
            ),
            Procedure(
                title="国民年金の住所変更",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=14,
                    absolute_date=move_date + timedelta(days=14),
                    description="転入届と同時に手続き",
                ),
                estimated_duration=10,
            ),
            Procedure(
                title="印鑑登録",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.MEDIUM,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=30,
                    absolute_date=move_date + timedelta(days=30),
                    description="必要に応じて早めに",
                ),
                estimated_duration=15,
            ),
            Procedure(
                title="児童手当の認定請求",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=15,
                    absolute_date=move_date + timedelta(days=15),
                    description="転入日の翌日から15日以内",
                ),
                estimated_duration=20,
            ),
            Procedure(
                title="運転免許証の住所変更",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=30,
                    absolute_date=move_date + timedelta(days=30),
                    description="速やかに",
                ),
                estimated_duration=30,
            ),
            Procedure(
                title="車庫証明の申請",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.MEDIUM,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=15,
                    absolute_date=move_date + timedelta(days=15),
                    description="引越し後15日以内",
                ),
                estimated_duration=60,
            ),
            Procedure(
                title="自動車の変更登録",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.MEDIUM,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=15,
                    absolute_date=move_date + timedelta(days=15),
                    description="引越し後15日以内",
                ),
                estimated_duration=60,
            ),
            Procedure(
                title="犬の登録変更届",
                category=ProcedureCategory.ADMINISTRATIVE,
                priority=ProcedurePriority.MEDIUM,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=30,
                    absolute_date=move_date + timedelta(days=30),
                    description="引越し後30日以内",
                ),
                estimated_duration=15,
            ),
            # === 民間手続き（引越し前）===
            Procedure(
                title="電気の使用停止・開始手続き",
                category=ProcedureCategory.PRIVATE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date - timedelta(days=7),
                    description="引越しの1〜2週間前まで",
                ),
                estimated_duration=15,
            ),
            Procedure(
                title="ガスの使用停止・開始手続き",
                category=ProcedureCategory.PRIVATE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date - timedelta(days=7),
                    description="引越しの1〜2週間前まで",
                ),
                estimated_duration=15,
            ),
            Procedure(
                title="水道の使用停止・開始手続き",
                category=ProcedureCategory.PRIVATE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date - timedelta(days=7),
                    description="引越しの3〜4日前まで",
                ),
                estimated_duration=15,
            ),
            Procedure(
                title="インターネット回線の移転手続き",
                category=ProcedureCategory.PRIVATE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date - timedelta(days=14),
                    description="引越しの2〜4週間前（工事が必要な場合あり）",
                ),
                estimated_duration=30,
            ),
            Procedure(
                title="郵便物の転送届（e転居）",
                category=ProcedureCategory.PRIVATE,
                priority=ProcedurePriority.HIGH,
                deadline=Deadline(
                    type=DeadlineType.BEFORE_MOVE,
                    absolute_date=move_date - timedelta(days=7),
                    description="引越しの1週間前まで",
                ),
                estimated_duration=10,
            ),
            Procedure(
                title="銀行口座の住所変更",
                category=ProcedureCategory.PRIVATE,
                priority=ProcedurePriority.MEDIUM,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=30,
                    absolute_date=move_date + timedelta(days=30),
                    description="引越し後早めに",
                ),
                estimated_duration=20,
            ),
            Procedure(
                title="クレジットカードの住所変更",
                category=ProcedureCategory.PRIVATE,
                priority=ProcedurePriority.LOW,
                deadline=Deadline(
                    type=DeadlineType.AFTER_MOVE,
                    days_after=30,
                    absolute_date=move_date + timedelta(days=30),
                    description="引越し後早めに",
                ),
                estimated_duration=15,
            ),
        ]

        logger.info(f"[MOCK] Generated {len(procedures)} procedures")
        return procedures

    async def get_procedure_detail(self, session: Session, procedure: Procedure) -> Procedure:
        """モック手続き詳細を返す"""
        logger.info(f"[MOCK] Getting details for procedure {procedure.id}: {procedure.title}")
        to_city = session.move_to.city
        to_pref = session.move_to.prefecture

        # 手続きタイトルに応じたモックデータ
        detail_map = {
            "転入届の提出": {
                "documents": [
                    Document(name="転出証明書", description="前住所の市区町村で発行されたもの", required=True, obtain_method="転出届提出時に発行"),
                    Document(name="本人確認書類", description="運転免許証、マイナンバーカード等", required=True, obtain_method="既に所持"),
                    Document(name="印鑑", description="認印可", required=False),
                    Document(name="マイナンバーカード", description="お持ちの場合", required=False, obtain_method="既に所持"),
                ],
                "steps": [
                    Step(order=1, description="転出証明書と本人確認書類を準備する", estimated_duration=5),
                    Step(order=2, description=f"{to_city}役所の市民課窓口を訪問する", estimated_duration=10),
                    Step(order=3, description="転入届を記入・提出する", estimated_duration=10),
                    Step(order=4, description="住民票の写しを必要部数取得する（各種手続きに必要）", estimated_duration=5),
                ],
                "notes": ["平日 8:30〜17:15 のみ受付", "混雑する月曜・金曜は避けることをおすすめします", "転出届と転入届は同時にはできません"],
            },
            "転出届の提出": {
                "documents": [
                    Document(name="本人確認書類", description="運転免許証、マイナンバーカード等", required=True, obtain_method="既に所持"),
                    Document(name="印鑑", description="認印可", required=False),
                    Document(name="国民健康保険証", description="加入者のみ", required=False, obtain_method="既に所持"),
                ],
                "steps": [
                    Step(order=1, description="本人確認書類を準備する", estimated_duration=5),
                    Step(order=2, description=f"{session.move_from.city}役所の市民課窓口を訪問する", estimated_duration=10),
                    Step(order=3, description="転出届を記入・提出する", estimated_duration=10),
                    Step(order=4, description="転出証明書を受け取る（転入届に必要）", estimated_duration=5),
                ],
                "notes": ["引越し日の14日前から届出可能", "転出証明書は転入届に必要なので紛失しないよう注意"],
            },
        }

        # マッチするモックデータがあれば使用、なければ汎用データ
        if procedure.title in detail_map:
            data = detail_map[procedure.title]
            procedure.documents = data["documents"]
            procedure.steps = data["steps"]
            procedure.notes = data["notes"]
        else:
            procedure.documents = [
                Document(name="本人確認書類", description="運転免許証、マイナンバーカード等", required=True, obtain_method="既に所持"),
                Document(name="印鑑", description="認印可（手続きにより不要）", required=False),
            ]
            procedure.steps = [
                Step(order=1, description="必要書類を準備する", estimated_duration=10),
                Step(order=2, description="窓口またはオンラインで手続きを行う", estimated_duration=15),
                Step(order=3, description="完了確認を行う", estimated_duration=5),
            ]
            procedure.notes = ["詳細は各窓口にお問い合わせください"]

        # 行政手続きの場合は窓口情報を追加
        if procedure.category == ProcedureCategory.ADMINISTRATIVE:
            procedure.office = Office(
                name=f"{to_city}役所",
                address=f"{to_pref}{to_city}",
                phone="代表電話にお問い合わせください",
                hours="平日 8:30〜17:15",
                nearest_station=f"{to_city}の最寄り駅から徒歩圏内",
            )

        return procedure

    async def generate_timeline(self, session: Session, procedures: List[Procedure]) -> Timeline:
        """モックタイムラインを返す"""
        logger.info(f"[MOCK] Generating timeline for session {session.session_id}")
        move_date = session.move_date

        # 手続きを日付ごとにグループ化
        date_groups: dict[str, list[Procedure]] = {}
        for proc in procedures:
            if proc.deadline.absolute_date:
                date_key = proc.deadline.absolute_date.strftime("%Y-%m-%d")
                if date_key not in date_groups:
                    date_groups[date_key] = []
                date_groups[date_key].append(proc)

        timeline_items = []
        for date_key, procs in sorted(date_groups.items()):
            date = datetime.fromisoformat(date_key)
            delta = (date - move_date).days
            if delta == 0:
                label = "引越し当日"
            elif delta > 0:
                label = f"引越し後{delta}日"
            else:
                label = f"引越し{abs(delta)}日前"

            timeline_procs = [
                TimelineProcedure(
                    id=p.id,
                    title=p.title,
                    priority=p.priority,
                    estimated_duration=p.estimated_duration,
                    is_completed=p.is_completed,
                )
                for p in procs
            ]
            timeline_items.append(TimelineItem(date=date, label=label, procedures=timeline_procs))

        milestones = [
            Milestone(date=move_date, label="引越し当日", type=MilestoneType.MOVE_DATE),
        ]
        for proc in procedures:
            if proc.priority == ProcedurePriority.HIGH and proc.deadline.absolute_date:
                milestones.append(
                    Milestone(
                        date=proc.deadline.absolute_date,
                        label=f"{proc.title}の期限",
                        type=MilestoneType.DEADLINE,
                    )
                )

        milestones.sort(key=lambda m: m.date)

        return Timeline(items=timeline_items, milestones=milestones)
