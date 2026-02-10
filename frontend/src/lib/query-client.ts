import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分間フレッシュ
      gcTime: 10 * 60 * 1000, // 10分後にGC
      refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得無効
      refetchOnReconnect: true, // 再接続時は再取得
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
