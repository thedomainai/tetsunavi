"""日付計算ユーティリティ"""

from datetime import datetime, timedelta
from models.domain import DeadlineType


def calculate_deadline(
    move_date: datetime, deadline_type: DeadlineType, days_after: int | None = None
) -> datetime:
    """
    引越し日から期限を計算します。

    Args:
        move_date: 引越し日
        deadline_type: 期限タイプ
        days_after: 引越し後の日数（AFTER_MOVE の場合に指定）

    Returns:
        計算された期限日時
    """
    if deadline_type == DeadlineType.BEFORE_MOVE:
        # 引越し前の場合は引越し日の前日
        return move_date - timedelta(days=1)
    elif deadline_type == DeadlineType.ON_MOVE_DATE:
        # 引越し当日
        return move_date
    elif deadline_type == DeadlineType.AFTER_MOVE:
        # 引越し後の場合は指定日数後
        if days_after is None:
            raise ValueError("AFTER_MOVE の場合は days_after が必要です")
        return move_date + timedelta(days=days_after)
    else:
        raise ValueError(f"不明な期限タイプ: {deadline_type}")
