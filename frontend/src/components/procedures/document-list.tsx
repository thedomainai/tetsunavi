import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle2, Circle } from 'lucide-react'
import type { Document } from '@/types/models'

interface DocumentListProps {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          必要書類
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {documents.map((doc, index) => (
            <li key={index} className="flex items-start gap-3">
              {doc.required ? (
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{doc.name}</span>
                  {doc.required && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      必須
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                {doc.obtainMethod && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">入手方法:</span> {doc.obtainMethod}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
