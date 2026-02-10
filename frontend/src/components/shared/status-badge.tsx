import { Badge } from '@/components/ui/badge'
import type { ProcedureCategory, ProcedurePriority } from '@/types/models'

interface StatusBadgeProps {
  type: 'category' | 'priority' | 'completed'
  value: ProcedureCategory | ProcedurePriority | boolean
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === 'category') {
    return (
      <Badge variant={value === '行政' ? 'default' : 'secondary'}>
        {value as ProcedureCategory}
      </Badge>
    )
  }

  if (type === 'priority') {
    const priorityVariants = {
      高: 'destructive',
      中: 'default',
      低: 'secondary',
    } as const

    return (
      <Badge variant={priorityVariants[value as ProcedurePriority]}>
        優先度: {value as ProcedurePriority}
      </Badge>
    )
  }

  if (type === 'completed') {
    return (
      <Badge variant={value ? 'secondary' : 'outline'}>
        {value ? '完了' : '未完了'}
      </Badge>
    )
  }

  return null
}
