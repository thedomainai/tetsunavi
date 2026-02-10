'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDuration } from '@/lib/utils'
import { Clock, Calendar } from 'lucide-react'
import type { Procedure } from '@/types/models'
import Link from 'next/link'

interface ProcedureCardProps {
  procedure: Procedure
  sessionId: string
  onToggleComplete: (procedureId: string, isCompleted: boolean) => void
}

export function ProcedureCard({ procedure, sessionId, onToggleComplete }: ProcedureCardProps) {
  return (
    <Card className={procedure.isCompleted ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              id={`procedure-${procedure.id}`}
              checked={procedure.isCompleted}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onToggleComplete(procedure.id, e.target.checked)
              }
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <Link href={`/sessions/${sessionId}/procedures/${procedure.id}`}>
                <CardTitle
                  className={`text-lg hover:text-primary cursor-pointer ${
                    procedure.isCompleted ? 'line-through' : ''
                  }`}
                >
                  {procedure.title}
                </CardTitle>
              </Link>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge type="category" value={procedure.category} />
                <StatusBadge type="priority" value={procedure.priority} />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{procedure.deadline.description || procedure.deadline.type}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>所要時間: 約{formatDuration(procedure.estimatedDuration)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
