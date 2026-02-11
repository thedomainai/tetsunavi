import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    '転入届の手続き方法を教えて',
    'いつまでに何をすればいい？',
    'まとめて手続きできる窓口は？',
    'オンラインでできる手続きは？',
  ])

  const mutation = useMutation({
    mutationFn: (message: string) => apiClient.sendChatMessage(sessionId, message),
    onMutate: (message: string) => {
      setMessages((prev) => [...prev, { role: 'user', content: message }])
      setSuggestedQuestions([])
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      if (data.suggestedQuestions?.length > 0) {
        setSuggestedQuestions(data.suggestedQuestions)
      }
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '申し訳ございません。エラーが発生しました。もう一度お試しください。' },
      ])
    },
  })

  const sendMessage = useCallback(
    (message: string) => {
      if (message.trim()) {
        mutation.mutate(message.trim())
      }
    },
    [mutation]
  )

  return {
    messages,
    suggestedQuestions,
    sendMessage,
    isPending: mutation.isPending,
  }
}
