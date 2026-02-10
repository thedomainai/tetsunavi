import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListOrdered } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { Step } from '@/types/models'

interface StepListProps {
  steps: Step[]
}

export function StepList({ steps }: StepListProps) {
  if (steps.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ListOrdered className="h-5 w-5" />
          手続きの手順
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {steps.map((step) => (
            <li key={step.order} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {step.order}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm">{step.description}</p>
                {step.estimatedDuration && (
                  <p className="text-xs text-muted-foreground mt-1">
                    所要時間: 約{formatDuration(step.estimatedDuration)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
