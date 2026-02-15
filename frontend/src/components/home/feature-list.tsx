import { MapPin, MessageCircle, CalendarCheck, ListChecks, Brain, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Brain,
    title: 'AIが自動で整理',
    description:
      'あなたの家族構成・車の有無・ペットなどの状況を理解し、必要な手続きを自動で洗い出します。',
  },
  {
    icon: MapPin,
    title: '窓口別グルーピング',
    description:
      '20件以上の手続きを「どこに行けばいいか」で整理。1回の訪問でまとめて対応できます。',
  },
  {
    icon: MessageCircle,
    title: 'AIチャットで質問',
    description:
      '「転入届に何が必要？」「期限はいつ？」など、手続きの疑問にAIがすぐに回答します。',
  },
  {
    icon: ListChecks,
    title: '進捗チェックリスト',
    description:
      '完了した手続きにチェックを入れて進捗管理。残りの手続きと優先度が一目でわかります。',
  },
  {
    icon: Clock,
    title: 'タイムライン表示',
    description:
      '引越し日を基準に、いつ何をすべきかを時系列で表示。手続き忘れを防ぎます。',
  },
  {
    icon: CalendarCheck,
    title: 'カレンダー連携',
    description:
      'スケジュールを.icsファイルでエクスポート。Google CalendarやApple Calendarに追加できます。',
  },
]

export function FeatureList() {
  return (
    <section className="w-full py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">テツナビの特徴</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            「手続きリストを作る」だけでなく、「行動を支援する」ことにフォーカスしています。
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
