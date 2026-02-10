export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              知らないことは検索できない
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              AIエージェントが、あなたの代わりに考えます
            </p>
          </div>
          <div className="space-y-2">
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400">
              引越しに必要な手続きを、あなたの状況に合わせてAIが自動で整理。
              <br />
              複雑な行政手続きも、もう迷いません。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
