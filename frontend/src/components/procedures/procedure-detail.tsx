import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDuration } from '@/lib/utils'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import type { ProcedureDetail } from '@/types/models'

interface ProcedureDetailProps {
  procedure: ProcedureDetail
}

export function ProcedureDetailComponent({ procedure }: ProcedureDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-2xl">{procedure.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="category" value={procedure.category} />
              <StatusBadge type="priority" value={procedure.priority} />
              <StatusBadge type="completed" value={procedure.isCompleted} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span>{procedure.deadline.description || procedure.deadline.type}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>所要時間: 約{formatDuration(procedure.estimatedDuration)}</span>
          </div>
        </CardContent>
      </Card>

      {procedure.notes && procedure.notes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              注意事項
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {procedure.notes.map((note, index) => (
                <li key={index} className="text-sm">
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
