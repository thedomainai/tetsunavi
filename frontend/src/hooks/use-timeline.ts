import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export function useTimeline(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId, 'timeline'],
    queryFn: () => apiClient.getTimeline(sessionId),
    staleTime: 5 * 60 * 1000,
  })
}
