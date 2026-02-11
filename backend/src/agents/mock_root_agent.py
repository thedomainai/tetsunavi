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
                visit_location=f"{from_city}役所",
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
                visit_location=f"{from_city}役所",
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
                visit_location=f"{from_city}役所",
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
                visit_location=f"{from_city}役所",
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
                visit_location=f"{to_city}役所",
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
                visit_location=f"{to_city}役所",
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
                visit_location=f"{to_city}役所",
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
                visit_location=f"{to_city}役所",
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
                visit_location=f"{to_city}役所",
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
                visit_location=f"{to_city}役所",
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
                visit_location="警察署・運転免許センター",
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
                visit_location="管轄警察署",
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
                visit_location="管轄の運輸支局",
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
                visit_location=f"{to_city}役所",
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
                visit_location="オンライン・電話",
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
                visit_location="オンライン・電話",
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
                visit_location="オンライン・電話",
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
                visit_location="オンライン・電話",
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
                visit_location="オンライン・電話",
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
                visit_location="オンライン・電話",
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
                visit_location="オンライン・電話",
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

    async def generate_chat_reply(
        self, session: Session, message: str, procedures: List[Procedure]
    ) -> dict:
        """モックチャット回答を返す"""
        logger.info(f"[MOCK] Chat message: {message}")
        to_city = session.move_to.city
        from_city = session.move_from.city

        reply = ""
        suggested = []

        msg_lower = message.lower()

        if "転入届" in message:
            reply = (
                f"転入届は、{to_city}役所の市民課窓口で手続きできます。\n\n"
                "【必要なもの】\n"
                "- 転出証明書（前の市区町村で発行）\n"
                "- 本人確認書類（運転免許証、マイナンバーカード等）\n"
                "- 印鑑（認印可）\n\n"
                "【期限】引越し後14日以内\n\n"
                "転入届を出すときに、国民健康保険・国民年金・マイナンバーカードの住所変更もまとめて手続きすると効率的です。"
            )
            suggested = ["転出届はどうすればいい？", "転入届と一緒にできる手続きは？", "住民票はすぐもらえる？"]
        elif "転出届" in message:
            reply = (
                f"転出届は、{from_city}役所の市民課窓口で手続きできます。\n\n"
                "【必要なもの】\n"
                "- 本人確認書類（運転免許証、マイナンバーカード等）\n"
                "- 印鑑（認印可）\n"
                "- 国民健康保険証（加入者のみ）\n\n"
                "【期限】引越し14日前〜当日まで\n\n"
                "転出届を出すと「転出証明書」がもらえます。これは転入届に必要なので紛失しないようにしてください。"
            )
            suggested = ["転入届はどうすればいい？", "マイナンバーカードの手続きは？", "印鑑登録はどうなる？"]
        elif "免許" in message or "運転" in message:
            reply = (
                "運転免許証の住所変更は、新住所の管轄警察署または運転免許センターで手続きできます。\n\n"
                "【必要なもの】\n"
                "- 運転免許証\n"
                "- 新住所が確認できる書類（住民票、マイナンバーカード等）\n\n"
                "【手数料】無料\n\n"
                "警察署は平日のみですが、運転免許センターは日曜日も受付している場合があります。"
            )
            suggested = ["車庫証明も必要？", "車検証の住所変更は？", "他に警察署で必要な手続きは？"]
        elif "期限" in message or "いつまで" in message or "スケジュール" in message:
            before_count = sum(1 for p in procedures if p.deadline.type.value == "引越し前" and not p.is_completed)
            after_count = sum(1 for p in procedures if p.deadline.type.value == "引越し後" and not p.is_completed)
            reply = (
                f"あなたの手続きスケジュールをまとめます。\n\n"
                f"【引越し前】残り{before_count}件\n"
                "- 転出届: 引越し14日前〜当日\n"
                "- ライフライン: 1〜2週間前\n"
                "- 郵便転送届: 1週間前\n\n"
                f"【引越し後】残り{after_count}件\n"
                "- 転入届: 14日以内（最優先）\n"
                "- 運転免許証: 速やかに\n"
                "- 車関連: 15日以内\n\n"
                "タイムライン表示で詳細な日程を確認できます。"
            )
            suggested = ["最初にやるべきことは？", "転入届の詳しい手続きは？", "オンラインでできる手続きは？"]
        elif "オンライン" in message or "ネット" in message or "web" in msg_lower:
            online_procs = [p for p in procedures if p.visit_location == "オンライン・電話"]
            names = "、".join(p.title for p in online_procs[:5])
            reply = (
                f"オンラインまたは電話で完結できる手続きは{len(online_procs)}件あります。\n\n"
                f"【対象手続き】\n{names}\n\n"
                "これらは窓口に行く必要がなく、各事業者のWebサイトやコールセンターから手続きできます。"
            )
            suggested = ["窓口に行く必要がある手続きは？", "電気の手続きの詳細は？", "郵便転送届の方法は？"]
        elif "まとめ" in message or "一緒" in message or "同時" in message:
            reply = (
                f"窓口ごとにまとめると効率的です。\n\n"
                f"【{from_city}役所（引越し前）】\n"
                "転出届 + 国民健康保険資格喪失届 + 印鑑登録廃止 + 児童手当消滅届\n"
                "→ 1回の訪問で約1時間\n\n"
                f"【{to_city}役所（引越し後）】\n"
                "転入届 + 国保加入 + 年金変更 + マイナンバー変更 + 印鑑登録 + 児童手当認定\n"
                "→ 1回の訪問で約2時間\n\n"
                "【警察署】\n"
                "運転免許証変更 + 車庫証明\n"
                "→ 車庫証明は数日かかるので2回訪問が必要です\n\n"
                "手続きリストの「窓口別」表示で詳しく確認できます。"
            )
            suggested = ["持ち物リストを教えて", "平日に行けない場合は？", "混雑を避けるコツは？"]
        else:
            completed = sum(1 for p in procedures if p.is_completed)
            total = len(procedures)
            reply = (
                f"現在の進捗は {completed}/{total}件 完了です。\n\n"
                "引越し手続きについて、以下のような質問にお答えできます：\n"
                "- 各手続きの詳細（必要書類・期限・手順）\n"
                "- スケジュールの確認\n"
                "- 窓口でまとめて対応する方法\n"
                "- オンラインで完結する手続き\n\n"
                "お気軽にご質問ください。"
            )
            suggested = ["転入届の手続き方法を教えて", "いつまでに何をすればいい？", "まとめて手続きできる窓口は？", "オンラインでできる手続きは？"]

        return {"reply": reply, "suggested_questions": suggested}

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
