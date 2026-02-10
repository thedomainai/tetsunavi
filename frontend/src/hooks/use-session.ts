import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { CreateSessionRequest } from '@/types/api'
import { useRouter } from 'next/navigation'

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => apiClient.getSession(sessionId),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateSession() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSessionRequest) => apiClient.createSession(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['session', data.sessionId], data)
      router.push(`/sessions/${data.sessionId}/interview`)
    },
  })
}

export function useInterviewQuestions(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId, 'interview'],
    queryFn: () => apiClient.getInterviewQuestions(sessionId),
    staleTime: 10 * 60 * 1000,
  })
}

export function useSubmitInterviewAnswers(sessionId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (answers: { questionId: string; value: string | string[] | boolean }[]) =>
      apiClient.submitInterviewAnswers(sessionId, { answers }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
      router.push(`/sessions/${sessionId}/procedures`)
    },
  })
}
