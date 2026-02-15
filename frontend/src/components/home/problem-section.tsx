'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { AlertTriangle, Search, Clock, MapPin } from 'lucide-react'

function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) => Math.round(v))
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, target, { duration, ease: 'easeOut' })
    }
  }, [isInView, motionValue, target, duration])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = v.toLocaleString() + suffix
      }
    })
    return unsubscribe
  }, [rounded, suffix])

  return <span ref={ref}>0{suffix}</span>
}

const stats = [
  { value: 700, suffix: '万人', label: '年間の引越し者数', icon: MapPin },
  { value: 30, suffix: '種類', label: '平均的な手続き数', icon: AlertTriangle },
  { value: 10, suffix: '箇所+', label: '訪問が必要な窓口', icon: Clock },
]

const painPoints = [
  {
    icon: Search,
    title: '存在を知らない手続き',
    description: '犬の登録変更、マイナンバー住所変更...知らなければ検索すらできない',
  },
  {
    icon: Clock,
    title: '複雑な期限と順序',
    description: '転出届は引越し前、転入届は14日以内、免許証は速やかに...いつ何をすべき？',
  },
  {
    icon: MapPin,
    title: '分散した窓口情報',
    description: '市役所、警察署、運輸支局、各種企業...それぞれの場所・営業時間・必要書類',
  },
]

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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
            Problem
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            見えない迷路を、手探りで歩いている
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            引越しの手続きは、個人の状況によって全く異なります。
            <br className="hidden sm:block" />
            静的なチェックリストでは対応できません。
          </p>
        </motion.div>

        {/* Animated stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              className="text-center p-8 rounded-2xl bg-background border shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pain points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
              className="relative p-6 rounded-2xl border bg-background group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <point.icon className="h-5 w-5 text-destructive/70" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
