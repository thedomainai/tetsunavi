'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateSessionSchema } from '@/lib/validators'
import { useCreateSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { PREFECTURES } from '@/lib/constants'
import { AlertCircle, ArrowRight } from 'lucide-react'

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
  const { mutate: createSession, isPending, error } = useCreateSession()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateSessionSchema),
  })

  const onSubmit = (data: FormData) => {
    createSession(data)
  }

  // 明日の日付を取得（最小値として設定）
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">引越し情報を入力</CardTitle>
            <CardDescription className="text-base">
              3つの情報を入力するだけで、あなた専用の手続きリストを作成します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 引越し元 */}
              <div className="space-y-4">
                <h3 className="font-semibold">引越し元</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="moveFrom.prefecture" className="text-sm font-medium">
                      都道府県
                    </label>
                    <Select {...register('moveFrom.prefecture')} id="moveFrom.prefecture">
                      <option value="">選択してください</option>
                      {PREFECTURES.map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </Select>
                    {errors.moveFrom?.prefecture && (
                      <p className="text-sm text-destructive">
                        {errors.moveFrom.prefecture.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="moveFrom.city" className="text-sm font-medium">
                      市区町村
                    </label>
                    <Input
                      {...register('moveFrom.city')}
                      id="moveFrom.city"
                      placeholder="例: 渋谷区"
                    />
                    {errors.moveFrom?.city && (
                      <p className="text-sm text-destructive">{errors.moveFrom.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 引越し先 */}
              <div className="space-y-4">
                <h3 className="font-semibold">引越し先</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="moveTo.prefecture" className="text-sm font-medium">
                      都道府県
                    </label>
                    <Select {...register('moveTo.prefecture')} id="moveTo.prefecture">
                      <option value="">選択してください</option>
                      {PREFECTURES.map((pref) => (
                        <option key={pref} value={pref}>
                          {pref}
                        </option>
                      ))}
                    </Select>
                    {errors.moveTo?.prefecture && (
                      <p className="text-sm text-destructive">{errors.moveTo.prefecture.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="moveTo.city" className="text-sm font-medium">
                      市区町村
                    </label>
                    <Input {...register('moveTo.city')} id="moveTo.city" placeholder="例: 新宿区" />
                    {errors.moveTo?.city && (
                      <p className="text-sm text-destructive">{errors.moveTo.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 引越し予定日 */}
              <div className="space-y-2">
                <label htmlFor="moveDate" className="text-sm font-medium">
                  引越し予定日
                </label>
                <Input {...register('moveDate')} id="moveDate" type="date" min={minDate} />
                {errors.moveDate && (
                  <p className="text-sm text-destructive">{errors.moveDate.message}</p>
                )}
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive rounded-md">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{error.message}</p>
                </div>
              )}

              {/* 送信ボタン */}
              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
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
              <p className="text-xs text-center text-muted-foreground">
                約2分で完了 / 会員登録不要
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
