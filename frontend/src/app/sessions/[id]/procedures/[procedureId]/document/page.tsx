'use client'

import { use } from 'react'
import Link from 'next/link'
import { useSession } from '@/hooks/use-session'
import { useProcedureDetail } from '@/hooks/use-procedures'
import { TenshutsuTodoke } from '@/components/documents/tenshutsu-todoke'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ErrorMessage } from '@/components/shared/error-message'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string; procedureId: string }>
}

export default function DocumentPage({ params }: PageProps) {
  const { id: sessionId, procedureId } = use(params)
  const { data: session, isLoading: sessionLoading, error: sessionError } = useSession(sessionId)
  const { data: procedure, isLoading: procedureLoading, error: procedureError } = useProcedureDetail(sessionId, procedureId)

  const isLoading = sessionLoading || procedureLoading
  const error = sessionError || procedureError

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <LoadingSpinner size="lg" className="py-12" />
          <p className="text-muted-foreground mt-4">書類を準備しています...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage error={error} />
        </div>
      </div>
    )
  }

  if (!session || !procedure) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/sessions/${sessionId}/procedures/${procedureId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              手続き詳細に戻る
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI書類作成
          </div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            {procedure.title}
          </h1>
          <p className="text-muted-foreground">
            セッション情報をもとに、AIが書類の記入項目を自動入力しました。
            <br />
            <span className="text-blue-600">青色の項目</span>がAI入力箇所です。残りの項目を手書きで記入してください。
          </p>
        </div>

        {/* Document form */}
        <TenshutsuTodoke session={session} />

        {/* Bottom note */}
        <p className="text-xs text-muted-foreground text-center py-4">
          ※ この書類はAIが生成したテンプレートです。自治体によって書式が異なる場合があります。
          正式な届出用紙は窓口で入手してください。
        </p>
      </div>
    </div>
  )
}
