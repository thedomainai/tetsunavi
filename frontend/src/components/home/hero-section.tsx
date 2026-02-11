import { MapPin, MessageCircle, CalendarCheck } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-b from-primary/5 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
            Powered by Gemini 2.0 Flash
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              知らないことは
              <br />
              <span className="text-primary">検索できない</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              AIエージェントが、あなたの代わりに考えます。
              <br />
              引越しに必要な手続きを、状況に合わせて自動で整理。
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              窓口別にまとめて表示
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm">
              <MessageCircle className="h-4 w-4 text-primary" />
              AIに手続きを質問
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm">
              <CalendarCheck className="h-4 w-4 text-primary" />
              カレンダーにエクスポート
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
