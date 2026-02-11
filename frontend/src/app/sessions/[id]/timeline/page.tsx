'use client'

import { use } from 'react'
import Link from 'next/link'
import { useTimeline } from '@/hooks/use-timeline'
import { TimelineItem } from '@/components/timeline/timeline-item'
import { MilestoneMarker } from '@/components/timeline/milestone-marker'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ErrorMessage } from '@/components/shared/error-message'
import { EmptyState } from '@/components/shared/empty-state'
import { ArrowLeft, Download } from 'lucide-react'
import { downloadICS } from '@/lib/ics-generator'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TimelinePage({ params }: PageProps) {
  const { id: sessionId } = use(params)
  const { data, isLoading, error, refetch } = useTimeline(sessionId)

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <LoadingSpinner size="lg" className="py-12" />
          <p className="text-center text-muted-foreground mt-4">タイムラインを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage error={error} onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  // タイムラインとマイルストーンを日付順にマージ
  const mergedItems = [
    ...data.timeline.map((item) => ({ type: 'timeline' as const, date: item.date, item })),
    ...data.milestones.map((milestone) => ({
      type: 'milestone' as const,
      date: milestone.date,
      item: milestone,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">タイムライン</h1>
            <p className="text-muted-foreground">
              引越し日を基準に、いつ何をすべきかを時系列で確認できます。
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => downloadICS(data)}
            >
              <Download className="mr-2 h-4 w-4" />
              カレンダーに追加
            </Button>
            <Button asChild variant="outline">
              <Link href={`/sessions/${sessionId}/procedures`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                手続きリスト
              </Link>
            </Button>
          </div>
        </div>

        {mergedItems.length === 0 ? (
          <EmptyState
            title="タイムラインがありません"
            description="手続きリストを生成すると、タイムラインが表示されます。"
          />
        ) : (
          <div className="relative space-y-6">
            {mergedItems.map((item, index) => {
              if (item.type === 'milestone') {
                return <MilestoneMarker key={`milestone-${index}`} milestone={item.item} />
              } else {
                return (
                  <TimelineItem
                    key={`timeline-${index}`}
                    item={item.item}
                    sessionId={sessionId}
                  />
                )
              }
            })}
          </div>
        )}
      </div>
    </div>
  )
}
