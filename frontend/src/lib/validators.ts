import { z } from 'zod'

// Location スキーマ
export const LocationSchema = z.object({
  prefecture: z.string().min(1, '都道府県を入力してください').max(10),
  city: z.string().min(1, '市区町村を入力してください').max(50),
})

// Session 作成スキーマ
export const CreateSessionSchema = z.object({
  moveFrom: LocationSchema,
  moveTo: LocationSchema,
  moveDate: z.string().refine(
    (date) => {
      // 日付文字列のみで比較（タイムゾーン影響を排除）
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      return date >= todayStr
    },
    { message: '引越し日は今日以降の日付を入力してください' }
  ),
})

// Interview 回答スキーマ
export const AnswerSchema = z.object({
  questionId: z.string().min(1),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
})

export const InterviewAnswersSchema = z.object({
  answers: z.array(AnswerSchema).min(1, '少なくとも1つの回答が必要です'),
})

// Procedure 更新スキーマ
export const UpdateProcedureSchema = z.object({
  isCompleted: z.boolean(),
})

// バリデーション関数
export function validateCreateSession(data: unknown) {
  return CreateSessionSchema.parse(data)
}

export function validateInterviewAnswers(data: unknown) {
  return InterviewAnswersSchema.parse(data)
}

export function validateUpdateProcedure(data: unknown) {
  return UpdateProcedureSchema.parse(data)
}
