'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  MapPin,
  MessageCircle,
  CalendarCheck,
  ListChecks,
  Brain,
  Clock,
  CheckCircle2,
  FileText,
  Navigation,
  FilePen,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI が自動で洗い出し',
    description:
      '家族構成・車の有無・ペットなど、あなたの状況をAIが理解して必要な手続きを20〜30件自動特定。',
    size: 'large',
    gradient: 'from-blue-500/10 via-transparent to-transparent',
    iconColor: 'text-blue-500',
    visual: (
      <div className="mt-4 space-y-2">
        {['転出届の提出', '転入届の提出', '国民健康保険', '運転免許証', '児童手当'].map(
          (item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span>{item}</span>
            </motion.div>
          )
        )}
        <div className="text-xs text-muted-foreground/60 pl-5">...他 19 件</div>
      </div>
    ),
  },
  {
    icon: FilePen,
    title: 'AI 書類自動作成',
    description:
      '転出届などの書類をAIが自動生成。住所・日付はセッション情報から自動入力済み。印刷してそのまま提出。',
    size: 'large',
    gradient: 'from-amber-500/10 via-transparent to-transparent',
    iconColor: 'text-amber-500',
    visual: (
      <div className="mt-4 rounded-lg border bg-white p-3 text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-amber-600 font-medium">
          <Sparkles className="h-3 w-3" />
          AI自動入力済み
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
          <div>転出先: <span className="text-blue-600">大阪府大阪市北区</span></div>
          <div>転出元: <span className="text-blue-600">東京都品川区</span></div>
          <div>転出日: <span className="text-blue-600">2026年3月10日</span></div>
          <div>届出先: <span className="text-blue-600">品川区長 殿</span></div>
        </div>
      </div>
    ),
  },
  {
    icon: MapPin,
    title: '窓口別グルーピング',
    description: '「どこに行けばいいか」で整理。1回の訪問でまとめて対応。',
    size: 'small',
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
    iconColor: 'text-emerald-500',
  },
  {
    icon: MessageCircle,
    title: 'AI チャットで即回答',
    description: '「転入届に何が必要？」「期限はいつ？」手続きの疑問にAIが即座に回答。',
    size: 'small',
    gradient: 'from-violet-500/10 via-transparent to-transparent',
    iconColor: 'text-violet-500',
  },
  {
    icon: Clock,
    title: 'タイムライン表示',
    description: '引越し日を基準に「いつ何をすべきか」を時系列で可視化。手続き忘れを防止。',
    size: 'small',
    gradient: 'from-orange-500/10 via-transparent to-transparent',
    iconColor: 'text-orange-500',
  },
  {
    icon: ListChecks,
    title: '進捗チェックリスト',
    description: '完了した手続きをチェックして進捗管理。残りのタスクと優先度が一目瞭然。',
    size: 'small',
    gradient: 'from-cyan-500/10 via-transparent to-transparent',
    iconColor: 'text-cyan-500',
  },
  {
    icon: FileText,
    title: '必要書類・手順まで',
    description:
      '各手続きの必要書類、手順、窓口の住所・営業時間・最寄駅まで。もう何度も足を運ぶ必要なし。',
    size: 'large',
    gradient: 'from-rose-500/10 via-transparent to-transparent',
    iconColor: 'text-rose-500',
    visual: (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { icon: FileText, label: '必要書類', count: '3点' },
          { icon: Navigation, label: '最寄駅', count: '徒歩5分' },
          { icon: Clock, label: '所要時間', count: '約30分' },
          { icon: CalendarCheck, label: '期限', count: '14日以内' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs"
          >
            <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-muted-foreground">{item.count}</div>
            </div>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    icon: CalendarCheck,
    title: 'カレンダー連携',
    description: 'スケジュールをGoogle Calendar・Apple Calendarにワンクリックで追加。',
    size: 'full',
    gradient: 'from-indigo-500/10 via-transparent to-transparent',
    iconColor: 'text-indigo-500',
  },
]

export function FeatureList() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-24 md:py-32 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            「リスト」ではなく「<span className="text-gradient">行動</span>」を支援する
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            手続きを羅列するだけでなく、具体的な行動につながる情報を提供します。
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const colSpan =
              feature.size === 'large'
                ? 'lg:col-span-2'
                : feature.size === 'full'
                  ? 'md:col-span-2 lg:col-span-4'
                  : 'lg:col-span-1'

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className={`${colSpan} group relative overflow-hidden rounded-2xl border bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5`}
              >
                {/* Gradient accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.visual}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
