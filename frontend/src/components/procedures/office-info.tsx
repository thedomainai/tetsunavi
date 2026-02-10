import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Clock, Train, ExternalLink } from 'lucide-react'
import type { Office } from '@/types/models'

interface OfficeInfoProps {
  office: Office
}

export function OfficeInfo({ office }: OfficeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          窓口情報
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">{office.name}</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{office.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{office.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{office.hours}</span>
            </div>
            {office.nearestStation && (
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 flex-shrink-0" />
                <span>最寄り駅: {office.nearestStation}</span>
              </div>
            )}
          </div>
        </div>

        {office.mapUrl && (
          <Button asChild variant="outline" className="w-full">
            <a href={office.mapUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Google マップで開く
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
