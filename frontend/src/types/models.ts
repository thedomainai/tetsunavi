// ドメインモデル型定義

// 共通型
export interface Location {
  prefecture: string
  city: string
}

// セッション型
export type SessionStatus = 'created' | 'interview_completed' | 'procedures_generated'

export interface Session {
  sessionId: string
  createdAt: string
  status: SessionStatus
  moveFrom: Location
  moveTo: Location
  moveDate: string
}

// インタビュー型
export type QuestionType = 'single_choice' | 'multiple_choice' | 'text' | 'boolean'

export interface Question {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  required: boolean
}

export interface Answer {
  questionId: string
  value: string | string[] | boolean
}

// 手続き型
export type ProcedureCategory = '行政' | '民間'
export type ProcedurePriority = '高' | '中' | '低'
export type DeadlineType = '引越し前' | '引越し後' | '引越し当日'

export interface Deadline {
  type: DeadlineType
  daysAfter?: number
  absoluteDate?: string
  description?: string
}

export interface Document {
  name: string
  description: string
  required: boolean
  obtainMethod?: string
}

export interface Office {
  name: string
  address: string
  phone: string
  hours: string
  nearestStation?: string
  mapUrl?: string
}

export interface Step {
  order: number
  description: string
  estimatedDuration?: number
}

export interface RelatedLink {
  title: string
  url: string
}

export interface Procedure {
  id: string
  title: string
  category: ProcedureCategory
  priority: ProcedurePriority
  deadline: Deadline
  estimatedDuration: number
  isCompleted: boolean
  completedAt?: string
}

export interface ProcedureDetail extends Procedure {
  documents?: Document[]
  office?: Office
  steps?: Step[]
  notes?: string[]
  relatedLinks?: RelatedLink[]
  dependencies?: string[]
}

// タイムライン型
export interface TimelineProcedure {
  id: string
  title: string
  priority: ProcedurePriority
  estimatedDuration: number
  isCompleted: boolean
}

export interface TimelineItem {
  date: string
  label: string
  procedures: TimelineProcedure[]
}

export type MilestoneType = 'moveDate' | 'deadline' | 'custom'

export interface Milestone {
  date: string
  label: string
  type: MilestoneType
}

export interface Timeline {
  timeline: TimelineItem[]
  milestones: Milestone[]
}
