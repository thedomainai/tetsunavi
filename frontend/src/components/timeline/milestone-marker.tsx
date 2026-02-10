import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Flag, Calendar, AlertCircle } from 'lucide-react'
import type { Milestone } from '@/types/models'

interface MilestoneMarkerProps {
  milestone: Milestone
}

export function MilestoneMarker({ milestone }: MilestoneMarkerProps) {
  const getIcon = () => {
    switch (milestone.type) {
      case 'moveDate':
        return <Calendar className="h-5 w-5" />
      case 'deadline':
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Flag className="h-5 w-5" />
    }
  }

  const getBgColor = () => {
    switch (milestone.type) {
      case 'moveDate':
        return 'bg-primary/10 border-primary/20'
      case 'deadline':
        return 'bg-destructive/10 border-destructive/20'
      default:
        return 'bg-muted border-border'
    }
  }

  return (
    <div className="relative pl-8 mb-6">
      <div className="absolute left-[-6px] top-4 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />
      <Card className={getBgColor()}>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{milestone.label}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{formatDate(milestone.date)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
