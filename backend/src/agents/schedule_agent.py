"""Schedule Agent - タイムライン生成エージェント"""

import logging
from typing import List, Dict
from datetime import datetime, timedelta
from agents.base_agent import BaseAgent
from models.domain import (
    Session,
    Procedure,
    Timeline,
    TimelineItem,
    Milestone,
    MilestoneType,
    TimelineProcedure,
)

logger = logging.getLogger(__name__)


class ScheduleAgent(BaseAgent):
    """タイムライン生成エージェント"""

    async def generate_timeline(self, session: Session, procedures: List[Procedure]) -> Timeline:
        """
        依存関係を考慮したタイムラインを生成します。

        Args:
            session: セッション情報
            procedures: 手続きリスト

        Returns:
            タイムライン
        """
        # 手続きを日付ごとにグループ化
        date_groups: Dict[str, List[Procedure]] = {}

        for procedure in procedures:
            if procedure.deadline.absolute_date:
                date_key = procedure.deadline.absolute_date.strftime("%Y-%m-%d")
                if date_key not in date_groups:
                    date_groups[date_key] = []
                date_groups[date_key].append(procedure)

        # TimelineItem を作成
        timeline_items = []
        for date_key, procs in sorted(date_groups.items()):
            date = datetime.fromisoformat(date_key)

            # ラベルを生成
            label = self._generate_label(session.move_date, date)

            # TimelineProcedure に変換
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

            timeline_items.append(
                TimelineItem(date=date, label=label, procedures=timeline_procs)
            )

        # マイルストーンを作成
        milestones = [
            Milestone(
                date=session.move_date,
                label="引越し当日",
                type=MilestoneType.MOVE_DATE,
            )
        ]

        # 重要な期限をマイルストーンに追加
        for procedure in procedures:
            if procedure.priority.value == "高" and procedure.deadline.absolute_date:
                milestone = Milestone(
                    date=procedure.deadline.absolute_date,
                    label=f"{procedure.title}の期限",
                    type=MilestoneType.DEADLINE,
                )
                milestones.append(milestone)

        # マイルストーンを日付順にソート
        milestones.sort(key=lambda m: m.date)

        return Timeline(items=timeline_items, milestones=milestones)

    def _generate_label(self, move_date: datetime, target_date: datetime) -> str:
        """日付ラベルを生成"""
        delta = (target_date - move_date).days

        if delta == 0:
            return "引越し当日"
        elif delta > 0:
            return f"引越し後{delta}日"
        else:
            return f"引越し{abs(delta)}日前"

    def _topological_sort(self, procedures: List[Procedure]) -> List[Procedure]:
        """
        トポロジカルソートで依存関係を解決します。

        Args:
            procedures: 手続きリスト

        Returns:
            ソート済みの手続きリスト
        """
        # 手続きIDからProcedureへのマッピング
        proc_map = {p.id: p for p in procedures}

        # 入次数を計算
        in_degree = {p.id: 0 for p in procedures}
        for proc in procedures:
            for dep_id in proc.dependencies:
                if dep_id in in_degree:
                    in_degree[proc.id] += 1

        # 入次数が0のノードをキューに追加
        queue = [p.id for p in procedures if in_degree[p.id] == 0]
        sorted_procedures = []

        while queue:
            # キューから取り出し
            proc_id = queue.pop(0)
            sorted_procedures.append(proc_map[proc_id])

            # 依存している手続きの入次数を減らす
            for proc in procedures:
                if proc_id in proc.dependencies:
                    in_degree[proc.id] -= 1
                    if in_degree[proc.id] == 0:
                        queue.append(proc.id)

        # 循環依存がある場合
        if len(sorted_procedures) != len(procedures):
            logger.warning("Circular dependency detected, returning original order")
            return procedures

        return sorted_procedures
