'use client'

import { use, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useChat } from '@/hooks/use-chat'
import { ChatMessage } from '@/components/chat/chat-message'
import { ChatInput } from '@/components/chat/chat-input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ArrowLeft, Bot } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ChatPage({ params }: PageProps) {
  const { id: sessionId } = use(params)
  const { messages, suggestedQuestions, sendMessage, isPending } = useChat(sessionId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="container py-6">
      <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">AIアシスタント</h1>
            <p className="text-sm text-muted-foreground">引越し手続きについて何でも質問できます</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/sessions/${sessionId}/procedures`}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              手続きリスト
            </Link>
          </Button>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-2">手続きについて質問してみましょう</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                必要書類、期限、手続きの流れなど、引越しに関する疑問にお答えします。
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {isPending && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <LoadingSpinner size="sm" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* サジェスト質問 */}
        {suggestedQuestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-3">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => sendMessage(question)}
                disabled={isPending}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* 入力エリア */}
        <div className="border-t pt-4">
          <ChatInput onSend={sendMessage} disabled={isPending} />
        </div>
      </div>
    </div>
  )
}
