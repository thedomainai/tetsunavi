'use client'

import { use } from 'react'
import Link from 'next/link'
import { useProcedureDetail, useUpdateProcedure } from '@/hooks/use-procedures'
import { ProcedureDetailComponent } from '@/components/procedures/procedure-detail'
import { DocumentList } from '@/components/procedures/document-list'
import { OfficeInfo } from '@/components/procedures/office-info'
import { StepList } from '@/components/procedures/step-list'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ErrorMessage } from '@/components/shared/error-message'
import { ArrowLeft, ExternalLink, FileText, MessageCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string; procedureId: string }>
}

export default function ProcedureDetailPage({ params }: PageProps) {
  const { id: sessionId, procedureId } = use(params)
  const { data: procedure, isLoading, error, refetch } = useProcedureDetail(sessionId, procedureId)
  const { mutate: updateProcedure } = useUpdateProcedure(sessionId)

  const handleToggleComplete = (isCompleted: boolean) => {
    updateProcedure({ procedureId, isCompleted })
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <LoadingSpinner size="lg" className="py-12" />
          <p className="text-center text-muted-foreground mt-4">読み込み中...</p>
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

  if (!procedure) {
    return null
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/sessions/${sessionId}/procedures`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              手続きリストに戻る
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/sessions/${sessionId}/chat`}>
              <MessageCircle className="mr-1.5 h-4 w-4" />
              この手続きについて質問
            </Link>
          </Button>
        </div>

        <ProcedureDetailComponent procedure={procedure} />

        {/* 書類作成ボタン */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">AIで書類を作成</p>
                  <p className="text-xs text-muted-foreground">セッション情報から自動入力された書類を生成します</p>
                </div>
              </div>
              <Button asChild size="sm">
                <Link href={`/sessions/${sessionId}/procedures/${procedureId}/document`}>
                  書類を作成
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Checkbox
                id="procedure-complete"
                checked={procedure.isCompleted}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleToggleComplete(e.target.checked)
                }
              />
              <label
                htmlFor="procedure-complete"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                この手続きを完了済みにする
              </label>
            </div>
          </CardContent>
        </Card>

        {procedure.steps && procedure.steps.length > 0 && (
          <StepList steps={procedure.steps} />
        )}

        {procedure.documents && procedure.documents.length > 0 && (
          <DocumentList documents={procedure.documents} />
        )}

        {procedure.office && <OfficeInfo office={procedure.office} />}

        {procedure.relatedLinks && procedure.relatedLinks.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">関連リンク</h3>
              <ul className="space-y-2">
                {procedure.relatedLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {link.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground text-center py-4">
          ※ 表示内容は一般的なガイドです。詳細は転入先の自治体にご確認ください。
        </p>
      </div>
    </div>
  )
}
