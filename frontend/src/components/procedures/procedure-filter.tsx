'use client'

import { Select } from '@/components/ui/select'
import { PROCEDURE_CATEGORIES, PROCEDURE_PRIORITIES } from '@/lib/constants'

interface ProcedureFilterProps {
  category?: string
  priority?: string
  completed?: boolean
  onFilterChange: (filters: { category?: string; priority?: string; completed?: boolean }) => void
}

export function ProcedureFilter({
  category,
  priority,
  completed,
  onFilterChange,
}: ProcedureFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="category-filter" className="text-sm font-medium mb-1 block">
          カテゴリ
        </label>
        <Select
          id="category-filter"
          value={category || ''}
          onChange={(e) =>
            onFilterChange({
              category: e.target.value || undefined,
              priority,
              completed,
            })
          }
        >
          <option value="">全て</option>
          {PROCEDURE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex-1">
        <label htmlFor="priority-filter" className="text-sm font-medium mb-1 block">
          優先度
        </label>
        <Select
          id="priority-filter"
          value={priority || ''}
          onChange={(e) =>
            onFilterChange({
              category,
              priority: e.target.value || undefined,
              completed,
            })
          }
        >
          <option value="">全て</option>
          {PROCEDURE_PRIORITIES.map((prio) => (
            <option key={prio} value={prio}>
              {prio}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex-1">
        <label htmlFor="completed-filter" className="text-sm font-medium mb-1 block">
          完了状態
        </label>
        <Select
          id="completed-filter"
          value={completed === undefined ? '' : String(completed)}
          onChange={(e) =>
            onFilterChange({
              category,
              priority,
              completed: e.target.value === '' ? undefined : e.target.value === 'true',
            })
          }
        >
          <option value="">全て</option>
          <option value="false">未完了のみ</option>
          <option value="true">完了済みのみ</option>
        </Select>
      </div>
    </div>
  )
}
