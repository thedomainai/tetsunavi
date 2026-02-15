'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cpu, MessageSquare, FileSearch, FileText, Calendar, MapPin, Zap } from 'lucide-react'

const agents = [
  {
    name: 'Interview',
    role: '状況把握',
    icon: MessageSquare,
    color: 'bg-blue-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'Procedure',
    role: '手続き特定',
    icon: FileSearch,
    color: 'bg-violet-500',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
  },
  {
    name: 'Document',
    role: '書類整理',
    icon: FileText,
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
  },
  {
    name: 'Schedule',
    role: '期限管理',
    icon: Calendar,
    color: 'bg-orange-500',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
  },
  {
    name: 'Location',
    role: '窓口案内',
    icon: MapPin,
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
  },
]

const techStack = [
  { name: 'Google ADK', category: 'Agent Framework' },
  { name: 'Gemini 2.0 Flash', category: 'AI Model' },
  { name: 'Vertex AI Search', category: 'RAG / Knowledge' },
  { name: 'Cloud Firestore', category: 'Database' },
  { name: 'Cloud Run', category: 'Infrastructure' },
  { name: 'Next.js + React', category: 'Frontend' },
]

export function ArchitectureSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="w-full py-24 md:py-32 overflow-hidden">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Architecture
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            5つの<span className="text-gradient">AIエージェント</span>が連携
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Google ADK によるマルチエージェント構成で、
            各エージェントが専門領域を担当します。
          </p>
        </motion.div>

        {/* Agent architecture diagram */}
        <div className="max-w-4xl mx-auto mb-20">
          {/* Root Agent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-fit mb-8"
          >
            <div className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-primary/30 bg-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-lg">Root Agent</div>
                <div className="text-sm text-muted-foreground">オーケストレーター</div>
              </div>
            </div>
          </motion.div>

          {/* Connection lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex justify-center mb-4"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-px h-8 bg-gradient-to-b from-primary/30 to-muted-foreground/20"
                  style={{ marginLeft: i === 0 ? 0 : '3.5rem' }}
                />
              ))}
            </div>
          </motion.div>

          {/* Sub agents */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {agents.map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className={`flex flex-col items-center p-4 rounded-xl border ${agent.borderColor} ${agent.bgColor} text-center`}
              >
                <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center mb-3`}>
                  <agent.icon className="h-5 w-5 text-white" />
                </div>
                <div className="font-semibold text-sm">{agent.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{agent.role}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 1.0 + i * 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm"
              >
                <Zap className="h-3 w-3 text-primary" />
                <span className="font-medium">{tech.name}</span>
                <span className="text-muted-foreground text-xs hidden sm:inline">
                  {tech.category}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
