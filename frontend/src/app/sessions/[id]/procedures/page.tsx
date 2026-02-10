'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useProcedures, useGenerateProcedures, useUpdateProcedure } from '@/hooks/use-procedures'
import { ProcedureCard } from '@/components/procedures/procedure-card'
import { ProcedureFilter } from '@/components/procedures/procedure-filter'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ErrorMessage } from '@/components/shared/error-message'
import { EmptyState } from '@/components/shared/empty-state'
import { Calendar, CheckCircle2 } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProceduresPage({ params }: PageProps) {
  const { id: sessionId } = use(params)
  const [filters, setFilters] = useState<{
    category?: string
    priority?: string
    completed?: boolean
  }>({})

  const { data, isLoading, error, refetch } = useProcedures(sessionId, filters)
  const { mutate: generateProcedures, isPending: isGenerating } = useGenerateProcedures(sessionId)
  const { mutate: updateProcedure } = useUpdateProcedure(sessionId)

  // 初回アクセス時に手続きが0件の場合、自動生成を試みる
  useEffect(() => {
    if (data && data.procedures.length === 0 && !isGenerating) {
      generateProcedures()
    }
  }, [data, isGenerating, generateProcedures])

  const handleToggleComplete = (procedureId: string, isCompleted: boolean) => {
    updateProcedure({ procedureId, isCompleted })
  }

  if (isLoading || isGenerating) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <LoadingSpinner size="lg" className="py-12" />
          <p className="text-center text-muted-foreground mt-4">
            {isGenerating ? '手続きリストを生成しています...' : '読み込み中...'}
          </p>
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

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">あなたの手続きリスト</h1>
            <p className="text-muted-foreground">
              完了した手続きにチェックを入れて、進捗を管理しましょう。
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/sessions/${sessionId}/timeline`}>
              <Calendar className="mr-2 h-4 w-4" />
              タイムライン表示
            </Link>
          </Button>
        </div>

        {data.totalCount > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                進捗: {data.completedCount} / {data.totalCount} 完了
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.round((data.completedCount / data.totalCount) * 100)}%
            </span>
          </div>
        )}

        <ProcedureFilter
          category={filters.category}
          priority={filters.priority}
          completed={filters.completed}
          onFilterChange={setFilters}
        />

        {data.procedures.length === 0 ? (
          <EmptyState
            title="手続きが見つかりません"
            description="フィルター条件を変更するか、別の条件でお試しください。"
          />
        ) : (
          <div className="space-y-4">
            {data.procedures.map((procedure) => (
              <ProcedureCard
                key={procedure.id}
                procedure={procedure}
                sessionId={sessionId}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
