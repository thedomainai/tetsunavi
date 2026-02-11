'use client'

import { use, useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useProcedures, useGenerateProcedures, useUpdateProcedure } from '@/hooks/use-procedures'
import { ProcedureCard } from '@/components/procedures/procedure-card'
import { ProcedureFilter } from '@/components/procedures/procedure-filter'
import { VisitGroup } from '@/components/procedures/visit-group'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ErrorMessage } from '@/components/shared/error-message'
import { EmptyState } from '@/components/shared/empty-state'
import { Calendar, CheckCircle2, List, MapPin, MessageCircle } from 'lucide-react'
import type { Procedure } from '@/types/models'

interface PageProps {
  params: Promise<{ id: string }>
}

type ViewMode = 'list' | 'visit'

function groupByVisitLocation(procedures: Procedure[]): { location: string; procedures: Procedure[] }[] {
  const groups: Record<string, Procedure[]> = {}
  for (const proc of procedures) {
    const loc = proc.visitLocation || 'その他'
    if (!groups[loc]) groups[loc] = []
    groups[loc].push(proc)
  }

  // 訪問先の表示順序: 役所系 → 警察 → 運輸 → オンライン → その他
  const order = (loc: string) => {
    if (loc.includes('役所')) return 0
    if (loc.includes('警察') || loc.includes('免許')) return 1
    if (loc.includes('運輸')) return 2
    if (loc.includes('オンライン')) return 3
    return 4
  }

  return Object.entries(groups)
    .map(([location, procs]) => ({ location, procedures: procs }))
    .sort((a, b) => order(a.location) - order(b.location))
}

export default function ProceduresPage({ params }: PageProps) {
  const { id: sessionId } = use(params)
  const [filters, setFilters] = useState<{
    category?: string
    priority?: string
    completed?: boolean
  }>({})
  const [viewMode, setViewMode] = useState<ViewMode>('visit')

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

  const visitGroups = useMemo(() => {
    if (!data) return []
    return groupByVisitLocation(data.procedures)
  }, [data])

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
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/sessions/${sessionId}/chat`}>
                <MessageCircle className="mr-2 h-4 w-4" />
                AIに質問
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/sessions/${sessionId}/timeline`}>
                <Calendar className="mr-2 h-4 w-4" />
                タイムライン
              </Link>
            </Button>
          </div>
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

        {/* ビューモード切替 + フィルター */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('visit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'visit'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MapPin className="h-4 w-4" />
              窓口別
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-4 w-4" />
              リスト
            </button>
          </div>
          <ProcedureFilter
            category={filters.category}
            priority={filters.priority}
            completed={filters.completed}
            onFilterChange={setFilters}
          />
        </div>

        {viewMode === 'visit' && visitGroups.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <MapPin className="h-4 w-4 inline mr-1" />
              {data.procedures.length}件の手続きを
              <strong>{visitGroups.length}箇所</strong>にまとめました。
              同じ窓口の手続きは1回の訪問でまとめて対応できます。
            </p>
          </div>
        )}

        {data.procedures.length === 0 ? (
          <EmptyState
            title="手続きが見つかりません"
            description="フィルター条件を変更するか、別の条件でお試しください。"
          />
        ) : viewMode === 'list' ? (
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
        ) : (
          <div className="space-y-8">
            {visitGroups.map((group) => (
              <VisitGroup
                key={group.location}
                location={group.location}
                procedures={group.procedures}
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
