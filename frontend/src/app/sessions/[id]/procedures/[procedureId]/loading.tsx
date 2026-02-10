import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function Loading() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <LoadingSpinner size="lg" className="py-12" />
        <p className="text-center text-muted-foreground mt-4">読み込み中...</p>
      </div>
    </div>
  )
}
