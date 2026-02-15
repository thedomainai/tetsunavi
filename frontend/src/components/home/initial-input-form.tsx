'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useInView } from 'framer-motion'
import { CreateSessionSchema } from '@/lib/validators'
import { useCreateSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { PREFECTURES } from '@/lib/constants'
import { MUNICIPALITIES } from '@/lib/municipalities'
import { AlertCircle, ArrowRight, Shield, Zap, Clock } from 'lucide-react'

interface FormData {
  moveFrom: {
    prefecture: string
    city: string
  }
  moveTo: {
    prefecture: string
    city: string
  }
  moveDate: string
}

export function InitialInputForm() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { mutate: createSession, isPending, error } = useCreateSession()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: {
      moveFrom: { prefecture: '', city: '' },
      moveTo: { prefecture: '', city: '' },
      moveDate: '',
    },
  })

  const moveFromPrefecture = watch('moveFrom.prefecture')
  const moveToPrefecture = watch('moveTo.prefecture')

  useEffect(() => {
    setValue('moveFrom.city', '')
  }, [moveFromPrefecture, setValue])

  useEffect(() => {
    setValue('moveTo.city', '')
  }, [moveToPrefecture, setValue])

  const moveFromCities = moveFromPrefecture ? MUNICIPALITIES[moveFromPrefecture] ?? [] : []
  const moveToCities = moveToPrefecture ? MUNICIPALITIES[moveToPrefecture] ?? [] : []

  const onSubmit = (data: FormData) => {
    createSession(data)
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <section id="start" ref={ref} className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero" />
      <div className="absolute inset-0 bg-mesh-gradient" />

      <div className="relative z-10 container">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left: CTA text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 lg:sticky lg:top-32"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                さあ、始めましょう
              </h2>
              <p className="text-white/50 text-lg mb-8 leading-relaxed">
                3つの情報を入力するだけで、あなた専用の手続きロードマップを作成します。
              </p>

              {/* Trust badges */}
              <div className="space-y-4">
                {[
                  { icon: Clock, text: '約2分で完了' },
                  { icon: Shield, text: '会員登録不要' },
                  { icon: Zap, text: '完全無料' },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 text-white/40"
                  >
                    <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                      <badge.icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-sm">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Form card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass rounded-2xl p-6 md:p-8 glow-blue">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* 引越し元 */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white/80 text-sm tracking-wide">
                      引越し元
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="moveFrom.prefecture" className="text-xs text-white/40">
                          都道府県
                        </label>
                        <Select
                          {...register('moveFrom.prefecture')}
                          id="moveFrom.prefecture"
                          className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30 focus:border-blue-400/50"
                        >
                          <option value="" className="bg-gray-900">
                            選択してください
                          </option>
                          {PREFECTURES.map((pref) => (
                            <option key={pref} value={pref} className="bg-gray-900">
                              {pref}
                            </option>
                          ))}
                        </Select>
                        {errors.moveFrom?.prefecture && (
                          <p className="text-xs text-red-400">
                            {errors.moveFrom.prefecture.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="moveFrom.city" className="text-xs text-white/40">
                          市区町村
                        </label>
                        <Select
                          {...register('moveFrom.city')}
                          id="moveFrom.city"
                          disabled={!moveFromPrefecture}
                          className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30 focus:border-blue-400/50 disabled:opacity-40"
                        >
                          <option value="" className="bg-gray-900">
                            {moveFromPrefecture ? '選択してください' : '都道府県を先に選択'}
                          </option>
                          {moveFromCities.map((city) => (
                            <option key={city} value={city} className="bg-gray-900">
                              {city}
                            </option>
                          ))}
                        </Select>
                        {errors.moveFrom?.city && (
                          <p className="text-xs text-red-400">{errors.moveFrom.city.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider with arrow */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-white/40 rotate-90" />
                    </div>
                  </div>

                  {/* 引越し先 */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white/80 text-sm tracking-wide">
                      引越し先
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="moveTo.prefecture" className="text-xs text-white/40">
                          都道府県
                        </label>
                        <Select
                          {...register('moveTo.prefecture')}
                          id="moveTo.prefecture"
                          className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30 focus:border-blue-400/50"
                        >
                          <option value="" className="bg-gray-900">
                            選択してください
                          </option>
                          {PREFECTURES.map((pref) => (
                            <option key={pref} value={pref} className="bg-gray-900">
                              {pref}
                            </option>
                          ))}
                        </Select>
                        {errors.moveTo?.prefecture && (
                          <p className="text-xs text-red-400">
                            {errors.moveTo.prefecture.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="moveTo.city" className="text-xs text-white/40">
                          市区町村
                        </label>
                        <Select
                          {...register('moveTo.city')}
                          id="moveTo.city"
                          disabled={!moveToPrefecture}
                          className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30 focus:border-blue-400/50 disabled:opacity-40"
                        >
                          <option value="" className="bg-gray-900">
                            {moveToPrefecture ? '選択してください' : '都道府県を先に選択'}
                          </option>
                          {moveToCities.map((city) => (
                            <option key={city} value={city} className="bg-gray-900">
                              {city}
                            </option>
                          ))}
                        </Select>
                        {errors.moveTo?.city && (
                          <p className="text-xs text-red-400">{errors.moveTo.city.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 引越し予定日 */}
                  <div className="space-y-1.5">
                    <label htmlFor="moveDate" className="text-xs text-white/40">
                      引越し予定日
                    </label>
                    <Input
                      {...register('moveDate')}
                      id="moveDate"
                      type="date"
                      min={minDate}
                      className="bg-white/[0.06] border-white/[0.1] text-white focus:border-blue-400/50 [color-scheme:dark]"
                    />
                    {errors.moveDate && (
                      <p className="text-xs text-red-400">{errors.moveDate.message}</p>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error.message}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white border-0 h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                  >
                    {isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        処理中...
                      </>
                    ) : (
                      <>
                        手続きナビを開始する
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
