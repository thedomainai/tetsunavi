import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import type { Procedure } from '@/types/models'

export function useProcedures(
  sessionId: string,
  filters?: {
    category?: string
    priority?: string
    completed?: boolean
  }
) {
  return useQuery({
    queryKey: ['procedures', sessionId, filters],
    queryFn: () => apiClient.getProcedures(sessionId, filters),
    staleTime: 1 * 60 * 1000,
  })
}

export function useGenerateProcedures(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiClient.generateProcedures(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures', sessionId] })
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}

export function useProcedureDetail(sessionId: string, procedureId: string) {
  return useQuery({
    queryKey: ['procedure', sessionId, procedureId],
    queryFn: () => apiClient.getProcedureDetail(sessionId, procedureId),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateProcedure(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      isCompleted,
    }: {
      procedureId: string
      isCompleted: boolean
    }) => apiClient.updateProcedureCompletion(sessionId, procedureId, { isCompleted }),

    // 楽観的更新
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['procedures', sessionId] })

      const previousProcedures = queryClient.getQueryData<{
        procedures: Procedure[]
        totalCount: number
        completedCount: number
      }>(['procedures', sessionId])

      queryClient.setQueryData<{
        procedures: Procedure[]
        totalCount: number
        completedCount: number
      }>(['procedures', sessionId], (old) => {
        if (!old) return old

        const updatedProcedures = old.procedures.map((p) =>
          p.id === variables.procedureId ? { ...p, isCompleted: variables.isCompleted } : p
        )

        return {
          procedures: updatedProcedures,
          totalCount: old.totalCount,
          completedCount: updatedProcedures.filter((p) => p.isCompleted).length,
        }
      })

      return { previousProcedures }
    },

    // エラー時はロールバック
    onError: (err, variables, context) => {
      if (context?.previousProcedures) {
        queryClient.setQueryData(['procedures', sessionId], context.previousProcedures)
      }
    },

    // 完了後は再取得
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures', sessionId] })
      queryClient.invalidateQueries({ queryKey: ['session', sessionId, 'timeline'] })
    },
  })
}
