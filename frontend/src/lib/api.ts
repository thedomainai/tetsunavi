// API クライアント

import type {
  APIResponse,
  APIError,
  CreateSessionRequest,
  CreateSessionResponse,
  InterviewQuestionsResponse,
  InterviewAnswersRequest,
  InterviewAnswersResponse,
  ProcedureListResponse,
  UpdateProcedureRequest,
  UpdateProcedureResponse,
} from '@/types/api'
import type { Session, ProcedureDetail, Timeline } from '@/types/models'

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error: APIError = await response.json()
      throw new Error(error.error.message)
    }

    const data: APIResponse<T> = await response.json()
    return data.data
  }

  // セッション関連
  async createSession(data: CreateSessionRequest): Promise<CreateSessionResponse> {
    return this.request<CreateSessionResponse>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSession(sessionId: string): Promise<Session> {
    return this.request<Session>(`/sessions/${sessionId}`)
  }

  // インタビュー関連
  async getInterviewQuestions(sessionId: string): Promise<InterviewQuestionsResponse> {
    return this.request<InterviewQuestionsResponse>(`/sessions/${sessionId}/interview`)
  }

  async submitInterviewAnswers(
    sessionId: string,
    data: InterviewAnswersRequest
  ): Promise<InterviewAnswersResponse> {
    return this.request<InterviewAnswersResponse>(`/sessions/${sessionId}/interview`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 手続き関連
  async generateProcedures(sessionId: string): Promise<ProcedureListResponse> {
    return this.request<ProcedureListResponse>(`/sessions/${sessionId}/procedures`, {
      method: 'POST',
    })
  }

  async getProcedures(
    sessionId: string,
    params?: {
      category?: string
      priority?: string
      completed?: boolean
    }
  ): Promise<ProcedureListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append('category', params.category)
    if (params?.priority) searchParams.append('priority', params.priority)
    if (params?.completed !== undefined)
      searchParams.append('completed', String(params.completed))

    const query = searchParams.toString()
    const endpoint = `/sessions/${sessionId}/procedures${query ? `?${query}` : ''}`

    return this.request<ProcedureListResponse>(endpoint)
  }

  async getProcedureDetail(sessionId: string, procedureId: string): Promise<ProcedureDetail> {
    return this.request<ProcedureDetail>(`/sessions/${sessionId}/procedures/${procedureId}`)
  }

  async updateProcedureCompletion(
    sessionId: string,
    procedureId: string,
    data: UpdateProcedureRequest
  ): Promise<UpdateProcedureResponse> {
    return this.request<UpdateProcedureResponse>(
      `/sessions/${sessionId}/procedures/${procedureId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    )
  }

  // タイムライン関連
  async getTimeline(sessionId: string): Promise<Timeline> {
    return this.request<Timeline>(`/sessions/${sessionId}/timeline`)
  }
}

export const apiClient = new APIClient()
