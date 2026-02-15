'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'

const floatingCards = [
  { text: '転出届', emoji: '📋', x: '10%', y: '20%', delay: 0 },
  { text: '転入届', emoji: '🏠', x: '75%', y: '15%', delay: 0.5 },
  { text: '免許証', emoji: '🚗', x: '85%', y: '55%', delay: 1.0 },
  { text: '転校届', emoji: '🎒', x: '5%', y: '65%', delay: 1.5 },
  { text: '銀行届', emoji: '🏦', x: '70%', y: '75%', delay: 2.0 },
  { text: 'ガス水道', emoji: '💡', x: '15%', y: '80%', delay: 0.8 },
]

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-hero">
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-mesh-gradient" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating procedure cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:flex items-center gap-2 glass-card px-3 py-2 text-white/40 text-sm select-none pointer-events-none"
          style={{ left: card.x, top: card.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: card.delay + 0.8, duration: 0.6, ease: 'easeOut' }}
        >
          <span className={i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}>
            <span className="text-base">{card.emoji}</span>
            <span className="ml-1.5">{card.text}</span>
          </span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 container flex flex-col items-center text-center px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/70">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Powered by Google ADK + Gemini 2.0 Flash</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-white">知らないことは</span>
          <br />
          <span className="text-gradient-hero">検索できない。</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl text-white/50 max-w-2xl mb-10 leading-relaxed"
        >
          AIエージェントが、あなたの代わりに考えます。
          <br className="hidden sm:block" />
          手続きの洗い出しから
          <span className="text-blue-300/80">書類の作成</span>
          まで、全てを自動化。
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <a
            href="#start"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-105"
          >
            手続きナビを始める
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
              <ArrowDown className="h-3.5 w-3.5 -rotate-90" />
            </span>
          </a>
          <p className="mt-4 text-sm text-white/30">
            約2分で完了 / 会員登録不要
          </p>
        </motion.div>

      </div>
    </section>
  )
}
