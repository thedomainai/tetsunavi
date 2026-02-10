'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDate, formatDuration } from '@/lib/utils'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import type { TimelineItem as TimelineItemType } from '@/types/models'
import Link from 'next/link'

interface TimelineItemProps {
  item: TimelineItemType
  sessionId: string
}

export function TimelineItem({ item, sessionId }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
      <div className="relative pl-8">
        <div className="absolute left-[-4px] top-6 w-2.5 h-2.5 rounded-full bg-primary" />
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{item.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {item.procedures.length}件
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent className="space-y-3">
              {item.procedures.map((procedure) => (
                <Link
                  key={procedure.id}
                  href={`/sessions/${sessionId}/procedures/${procedure.id}`}
                  className="block p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium text-sm ${
                          procedure.isCompleted ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {procedure.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>約{formatDuration(procedure.estimatedDuration)}</span>
                      </div>
                    </div>
                    <StatusBadge type="priority" value={procedure.priority} />
                  </div>
                </Link>
              ))}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
