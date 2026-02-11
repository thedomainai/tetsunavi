import type { Timeline } from '@/types/models'

function formatICSDate(dateStr: string): string {
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

function formatICSDateTime(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}${m}${d}T${h}${min}${s}`
}

function escapeICS(text: string): string {
  return text.replace(/[\\;,]/g, (match) => `\\${match}`).replace(/\n/g, '\\n')
}

export function generateICS(timeline: Timeline): string {
  const now = formatICSDateTime(new Date())
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//tetsunavi//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:テツナビ - 引越し手続きスケジュール',
    'X-WR-TIMEZONE:Asia/Tokyo',
  ]

  for (const item of timeline.timeline) {
    const dateStr = formatICSDate(item.date)

    for (const proc of item.procedures) {
      const uid = `${proc.id}@tetsunavi`
      lines.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${escapeICS(proc.title)}`,
        `DESCRIPTION:${escapeICS(`${item.label} / 所要時間: 約${proc.estimatedDuration}分 / 優先度: ${proc.priority}`)}`,
        `STATUS:${proc.isCompleted ? 'COMPLETED' : 'NEEDS-ACTION'}`,
        'END:VEVENT'
      )
    }
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadICS(timeline: Timeline) {
  const icsContent = generateICS(timeline)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'tetsunavi-schedule.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
