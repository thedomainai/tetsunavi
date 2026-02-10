// API レスポンス型定義

import type { Question, Procedure } from './models'

// 共通型
export interface APIResponse<T> {
  data: T
  meta?: {
    requestId: string
    timestamp: string
  }
}

export interface APIError {
  error: {
    code: string
    message: string
    details?: unknown
    requestId?: string
  }
}

// セッション関連
export interface CreateSessionRequest {
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

export interface CreateSessionResponse {
  sessionId: string
  createdAt: string
  status: 'created'
}

// インタビュー関連
export interface InterviewQuestionsResponse {
  questions: Question[]
  estimatedTime: number
}

export interface InterviewAnswersRequest {
  answers: Array<{
    questionId: string
    value: string | string[] | boolean
  }>
}

export interface InterviewAnswersResponse {
  status: 'completed'
  nextStep: 'procedures'
}

// 手続き関連
export interface ProcedureListResponse {
  procedures: Procedure[]
  totalCount: number
  completedCount: number
}

export interface UpdateProcedureRequest {
  isCompleted: boolean
}

export interface UpdateProcedureResponse {
  id: string
  isCompleted: boolean
  completedAt?: string
}

// ストリーミング型
export type StreamEventType = 'progress' | 'procedure' | 'complete' | 'error'

export interface StreamEvent {
  type: StreamEventType
  message?: string
  progress?: number
  data?: Procedure
  totalCount?: number
  error?: APIError['error']
}
