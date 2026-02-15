'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageSquare, Brain, ListChecks, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: '状況をヒアリング',
    description: '家族構成、車の有無、ペット、子供の学年...AIが5問ほどの質問であなたの状況を把握します。',
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-500/20',
    demo: [
      { role: 'ai', text: 'ご家族構成を教えてください' },
      { role: 'user', text: '夫婦 + 小学生の子供1人' },
      { role: 'ai', text: 'お車はお持ちですか？' },
      { role: 'user', text: 'はい' },
    ],
  },
  {
    number: '02',
    icon: Brain,
    title: 'AIが手続きを特定',
    description: 'マルチエージェントが連携して、あなたに必要な20〜30件の手続きを自動で洗い出します。',
    color: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-500',
    borderColor: 'border-violet-500/20',
    demo: [
      { role: 'agent', text: 'Interview Agent → 状況把握完了' },
      { role: 'agent', text: 'Procedure Agent → 24件の手続きを特定' },
      { role: 'agent', text: 'Document Agent → 必要書類を整理' },
      { role: 'agent', text: 'Schedule Agent → タイムライン生成' },
    ],
  },
  {
    number: '03',
    icon: ListChecks,
    title: 'ロードマップ＋書類作成',
    description: '期限・窓口情報を含むロードマップと、提出書類をAIが自動作成。印刷してそのまま窓口へ。',
    color: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-500',
    borderColor: 'border-cyan-500/20',
    demo: [
      { role: 'task', text: '転出届の提出 → 書類も自動作成', status: 'done' },
      { role: 'task', text: '転入届の提出', status: 'done' },
      { role: 'task', text: '運転免許証の住所変更', status: 'pending' },
      { role: 'task', text: '児童手当の住所変更', status: 'pending' },
    ],
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-24 md:py-32">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            たった<span className="text-gradient">3ステップ</span>で完了
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            複雑な引越し手続きの全体像を、AIが2分で整理します。
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12 lg:space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              {/* Text */}
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-muted-foreground/20">{step.number}</span>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex items-center gap-2 mt-6 text-muted-foreground/40">
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-sm">次のステップへ</span>
                  </div>
                )}
              </div>

              {/* Demo card */}
              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className={`rounded-2xl border ${step.borderColor} bg-muted/30 p-6 space-y-3`}>
                  {step.demo.map((item, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: item.role === 'user' ? 20 : -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.2 + j * 0.1 }}
                    >
                      {item.role === 'ai' && (
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Brain className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          <div className="bg-background rounded-xl rounded-tl-sm px-4 py-2.5 text-sm">
                            {item.text}
                          </div>
                        </div>
                      )}
                      {item.role === 'user' && (
                        <div className="flex items-start gap-3 justify-end">
                          <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-4 py-2.5 text-sm">
                            {item.text}
                          </div>
                        </div>
                      )}
                      {item.role === 'agent' && (
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-background">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-soft" />
                          <span className="text-sm text-muted-foreground font-mono">{item.text}</span>
                        </div>
                      )}
                      {item.role === 'task' && (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            (item as { status: string }).status === 'done'
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground/30'
                          }`}>
                            {(item as { status: string }).status === 'done' && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${
                            (item as { status: string }).status === 'done'
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }`}>
                            {item.text}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
