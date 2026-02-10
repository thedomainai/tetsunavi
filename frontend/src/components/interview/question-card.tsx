'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Question } from '@/types/models'

interface QuestionCardProps {
  question: Question
  value: string | string[] | boolean
  onChange: (value: string | string[] | boolean) => void
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder="回答を入力してください"
            className="w-full"
          />
        )

      case 'boolean':
        return (
          <div className="flex gap-4">
            <Button
              type="button"
              variant={value === true ? 'default' : 'outline'}
              onClick={() => onChange(true)}
              className="flex-1"
            >
              はい
            </Button>
            <Button
              type="button"
              variant={value === false ? 'default' : 'outline'}
              onClick={() => onChange(false)}
              className="flex-1"
            >
              いいえ
            </Button>
          </div>
        )

      case 'single_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <Button
                key={option}
                type="button"
                variant={value === option ? 'default' : 'outline'}
                onClick={() => onChange(option)}
                className="w-full justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        )

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${question.id}-${option}`}
                  checked={(value as string[])?.includes(option)}
                  onChange={(e) => {
                    const currentValues = (value as string[]) || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option)
                    onChange(newValues)
                  }}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <label
                  htmlFor={`${question.id}-${option}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {question.text}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderInput()}</CardContent>
    </Card>
  )
}
