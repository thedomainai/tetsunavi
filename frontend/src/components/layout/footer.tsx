import { APP_NAME } from '@/lib/constants'
import { Compass, Zap } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">{APP_NAME}</span>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-background">
              <Zap className="h-3 w-3" />
              Google ADK
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-background">
              <Zap className="h-3 w-3" />
              Gemini 2.0 Flash
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-background">
              <Zap className="h-3 w-3" />
              Cloud Run
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {APP_NAME}
          </p>
        </div>
      </div>
    </footer>
  )
}
