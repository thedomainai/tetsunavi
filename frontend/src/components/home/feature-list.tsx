import { Brain, ListChecks, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Brain,
    title: 'AIが自動で整理',
    description:
      'あなたの状況を理解し、必要な手続きを自動的に洗い出します。検索する必要はありません。',
  },
  {
    icon: ListChecks,
    title: 'パーソナライズされたチェックリスト',
    description:
      '家族構成や車の有無など、あなたの状況に合わせたチェックリストを作成します。',
  },
  {
    icon: Calendar,
    title: 'タイムライン管理',
    description:
      '引越し日を基準に、いつ何をすべきかを時系列で表示。手続きの優先順位も自動で設定します。',
  },
]

export function FeatureList() {
  return (
    <section className="w-full py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8 md:text-3xl">サービスの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
