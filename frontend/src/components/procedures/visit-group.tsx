'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProcedureCard } from '@/components/procedures/procedure-card'
import { formatDuration } from '@/lib/utils'
import { MapPin, Clock, CheckCircle2 } from 'lucide-react'
import type { Procedure } from '@/types/models'

interface VisitGroupProps {
  location: string
  procedures: Procedure[]
  sessionId: string
  onToggleComplete: (procedureId: string, isCompleted: boolean) => void
}

export function VisitGroup({ location, procedures, sessionId, onToggleComplete }: VisitGroupProps) {
  const totalDuration = procedures.reduce((sum, p) => sum + p.estimatedDuration, 0)
  const completedCount = procedures.filter((p) => p.isCompleted).length
  const allCompleted = completedCount === procedures.length

  return (
    <div className="space-y-3">
      <Card className={allCompleted ? 'border-primary/30 bg-primary/5' : 'border-l-4 border-l-primary'}>
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{location}</CardTitle>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                {completedCount}/{procedures.length}件
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                合計 {formatDuration(totalDuration)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3 pt-0">
          <p className="text-sm text-muted-foreground">
            {procedures.length}件の手続きをまとめて対応できます
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3 pl-4 border-l-2 border-muted ml-2">
        {procedures.map((procedure) => (
          <ProcedureCard
            key={procedure.id}
            procedure={procedure}
            sessionId={sessionId}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  )
}
