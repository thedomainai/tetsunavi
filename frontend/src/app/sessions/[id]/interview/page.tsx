'use client'

import { useState } from 'react'
import { use } from 'react'
import { useInterviewQuestions, useSubmitInterviewAnswers } from '@/hooks/use-session'
import { QuestionCard } from '@/components/interview/question-card'
import { ProgressIndicator } from '@/components/interview/progress-indicator'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ErrorMessage } from '@/components/shared/error-message'
import { AlertCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function InterviewPage({ params }: PageProps) {
  const { id: sessionId } = use(params)
  const { data, isLoading, error, refetch } = useInterviewQuestions(sessionId)
  const { mutate: submitAnswers, isPending } = useSubmitInterviewAnswers(sessionId)

  const [answers, setAnswers] = useState<Record<string, string | string[] | boolean>>({})
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleAnswerChange = (questionId: string, value: string | string[] | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    setValidationError(null)
  }

  const handleSubmit = () => {
    if (!data) return

    // 必須質問の回答チェック
    const unansweredRequired = data.questions.filter(
      (q) => q.required && !answers[q.id]
    )

    if (unansweredRequired.length > 0) {
      setValidationError('全ての必須項目に回答してください')
      return
    }

    const formattedAnswers = data.questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({
        questionId: q.id,
        value: answers[q.id],
      }))

    submitAnswers(formattedAnswers)
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <LoadingSpinner size="lg" className="py-12" />
          <p className="text-center text-muted-foreground mt-4">質問を準備しています...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <ErrorMessage error={error} onRetry={() => refetch()} />
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const answeredCount = data.questions.filter((q) => answers[q.id] !== undefined).length

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">詳細な情報をお聞かせください</h1>
          <p className="text-muted-foreground">
            あなたの状況に合わせた手続きリストを作成するため、いくつか質問にお答えください。
          </p>
        </div>

        <ProgressIndicator current={answeredCount} total={data.questions.length} />

        <div className="space-y-4">
          {data.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              value={answers[question.id] || (question.type === 'multiple_choice' ? [] : '')}
              onChange={(value) => handleAnswerChange(question.id, value)}
            />
          ))}
        </div>

        {validationError && (
          <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive rounded-md">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{validationError}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isPending || answeredCount === 0}
            className="flex-1"
            size="lg"
          >
            {isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                送信中...
              </>
            ) : (
              '回答を送信して手続きリストを生成'
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          推定回答時間: 約{data.estimatedTime}秒
        </p>
      </div>
    </div>
  )
}
