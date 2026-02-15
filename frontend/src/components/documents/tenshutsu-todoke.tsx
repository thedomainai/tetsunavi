'use client'

import { useRef } from 'react'
import type { Session } from '@/types/models'
import { Button } from '@/components/ui/button'
import { Printer, Sparkles, Download } from 'lucide-react'

interface TenshutsuTodokeProps {
  session: Session
}

export function TenshutsuTodoke({ session }: TenshutsuTodokeProps) {
  const formRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  const moveDate = new Date(session.moveDate)
  const moveDateStr = `${moveDate.getFullYear()}年${moveDate.getMonth() + 1}月${moveDate.getDate()}日`

  const handlePrint = () => {
    const printContent = formRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>転出届</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif; margin: 0; padding: 20px; color: #1a1a1a; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px 10px; font-size: 13px; }
          th { background: #f5f5f5; font-weight: 600; text-align: left; white-space: nowrap; width: 140px; }
          .form-title { text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 8px; margin-bottom: 24px; }
          .form-subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
          .ai-filled { color: #2563eb; }
          .placeholder { color: #999; border-bottom: 1px dashed #ccc; display: inline-block; min-width: 120px; }
          .section-label { font-weight: 700; font-size: 14px; padding: 6px 10px; background: #e8e8e8; }
          .note { font-size: 11px; color: #666; margin-top: 16px; }
          .stamp-area { width: 60px; height: 60px; border: 1px dashed #999; display: inline-block; text-align: center; line-height: 60px; font-size: 10px; color: #999; }
          .ai-badge { display: inline-flex; align-items: center; gap: 4px; background: #eff6ff; border: 1px solid #bfdbfe; color: #2563eb; font-size: 11px; padding: 2px 8px; border-radius: 4px; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-muted-foreground">
            セッション情報から<span className="text-blue-600 font-medium">自動入力済み</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1.5 h-4 w-4" />
            印刷
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Download className="mr-1.5 h-4 w-4" />
            PDF保存
          </Button>
        </div>
      </div>

      {/* Form preview */}
      <div
        ref={formRef}
        className="bg-white text-gray-900 rounded-xl border shadow-sm p-8 md:p-12 max-w-[800px] mx-auto"
        style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
      >
        {/* AI badge */}
        <div className="ai-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#2563eb',
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '4px',
          marginBottom: '16px',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
          </svg>
          AI自動入力
        </div>

        {/* Title */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '12px',
          marginBottom: '8px',
          paddingLeft: '12px',
        }}>
          転出届
        </h1>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '28px' }}>
          住民基本台帳法第24条の規定により届出します
        </p>

        {/* Main form table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <tbody>
            {/* 届出日 */}
            <tr>
              <th style={thStyle}>届出日</th>
              <td style={tdStyle} colSpan={3}>
                <span style={aiFilledStyle}>{todayStr}</span>
              </td>
            </tr>

            {/* 届出先 */}
            <tr>
              <th style={thStyle}>届出先</th>
              <td style={tdStyle} colSpan={3}>
                <span style={aiFilledStyle}>{session.moveFrom.city}</span> 長 殿
              </td>
            </tr>

            {/* 転出先住所 */}
            <tr>
              <th style={thStyle}>転出先住所</th>
              <td style={tdStyle} colSpan={3}>
                <span style={aiFilledStyle}>
                  {session.moveTo.prefecture}{session.moveTo.city}
                </span>
                <span style={placeholderStyle}>（以降の住所を記入）</span>
              </td>
            </tr>

            {/* 転出元住所 */}
            <tr>
              <th style={thStyle}>現住所<br /><span style={{ fontSize: '10px', fontWeight: 400 }}>（転出元）</span></th>
              <td style={tdStyle} colSpan={3}>
                <span style={aiFilledStyle}>
                  {session.moveFrom.prefecture}{session.moveFrom.city}
                </span>
                <span style={placeholderStyle}>（以降の住所を記入）</span>
              </td>
            </tr>

            {/* 転出予定日 */}
            <tr>
              <th style={thStyle}>転出予定日</th>
              <td style={tdStyle}>
                <span style={aiFilledStyle}>{moveDateStr}</span>
              </td>
              <th style={thStyle}>転出届出日</th>
              <td style={tdStyle}>
                <span style={aiFilledStyle}>{todayStr}</span>
              </td>
            </tr>

            {/* セクション: 届出人 */}
            <tr>
              <td colSpan={4} style={sectionStyle}>届出人（異動する方）</td>
            </tr>

            {/* 世帯主 */}
            <tr>
              <th style={thStyle}>世帯主氏名</th>
              <td style={tdStyle}>
                <span style={placeholderStyle}>（氏名を記入）</span>
              </td>
              <th style={thStyle}>届出人との続柄</th>
              <td style={tdStyle}>
                <span style={placeholderStyle}>本人 / 世帯主 / その他</span>
              </td>
            </tr>

            {/* 異動者1 */}
            <tr>
              <th style={thStyle} rowSpan={2}>異動者①</th>
              <td style={tdStyle}>
                氏名: <span style={placeholderStyle}>（氏名を記入）</span>
              </td>
              <td style={tdStyle}>
                生年月日: <span style={placeholderStyle}>（年/月/日）</span>
              </td>
              <td style={tdStyle}>
                性別: <span style={placeholderStyle}>男 / 女</span>
              </td>
            </tr>
            <tr>
              <td style={tdStyle} colSpan={3}>
                続柄: <span style={placeholderStyle}>本人</span>
                　マイナンバーカード: <span style={placeholderStyle}>有 / 無</span>
                　国保加入: <span style={placeholderStyle}>有 / 無</span>
              </td>
            </tr>

            {/* 異動者2 */}
            <tr>
              <th style={thStyle} rowSpan={2}>異動者②</th>
              <td style={tdStyle}>
                氏名: <span style={placeholderStyle}>（氏名を記入）</span>
              </td>
              <td style={tdStyle}>
                生年月日: <span style={placeholderStyle}>（年/月/日）</span>
              </td>
              <td style={tdStyle}>
                性別: <span style={placeholderStyle}>男 / 女</span>
              </td>
            </tr>
            <tr>
              <td style={tdStyle} colSpan={3}>
                続柄: <span style={placeholderStyle}>（続柄を記入）</span>
                　マイナンバーカード: <span style={placeholderStyle}>有 / 無</span>
                　国保加入: <span style={placeholderStyle}>有 / 無</span>
              </td>
            </tr>

            {/* 異動者3 */}
            <tr>
              <th style={thStyle} rowSpan={2}>異動者③</th>
              <td style={tdStyle}>
                氏名: <span style={placeholderStyle}>（氏名を記入）</span>
              </td>
              <td style={tdStyle}>
                生年月日: <span style={placeholderStyle}>（年/月/日）</span>
              </td>
              <td style={tdStyle}>
                性別: <span style={placeholderStyle}>男 / 女</span>
              </td>
            </tr>
            <tr>
              <td style={tdStyle} colSpan={3}>
                続柄: <span style={placeholderStyle}>（続柄を記入）</span>
                　マイナンバーカード: <span style={placeholderStyle}>有 / 無</span>
                　国保加入: <span style={placeholderStyle}>有 / 無</span>
              </td>
            </tr>

            {/* 届出人連絡先 */}
            <tr>
              <td colSpan={4} style={sectionStyle}>届出人連絡先</td>
            </tr>
            <tr>
              <th style={thStyle}>届出人氏名</th>
              <td style={tdStyle}>
                <span style={placeholderStyle}>（氏名を記入）</span>
              </td>
              <th style={thStyle}>電話番号</th>
              <td style={tdStyle}>
                <span style={placeholderStyle}>（電話番号を記入）</span>
              </td>
            </tr>

            {/* 届出人印 */}
            <tr>
              <th style={thStyle}>届出人印</th>
              <td style={tdStyle} colSpan={3}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    border: '1px dashed #999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#999',
                    borderRadius: '50%',
                  }}>
                    印
                  </div>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    ※ 届出人本人が自署する場合は押印不要
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        <div style={{ marginTop: '20px', fontSize: '11px', color: '#666', lineHeight: 1.8 }}>
          <p>【注意事項】</p>
          <ul style={{ paddingLeft: '16px', margin: '4px 0' }}>
            <li>転出届は引越し日の14日前から届出できます。</li>
            <li>届出には本人確認書類（運転免許証、マイナンバーカード等）が必要です。</li>
            <li>印鑑登録をしている方は、転出届と同時に印鑑登録が廃止されます。</li>
            <li>
              <span style={{ color: '#2563eb' }}>青色の項目</span>
              はAIがセッション情報から自動入力した項目です。内容をご確認ください。
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  border: '1px solid #d1d5db',
  padding: '8px 12px',
  fontSize: '13px',
  fontWeight: 600,
  backgroundColor: '#f9fafb',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  width: '120px',
  verticalAlign: 'top',
}

const tdStyle: React.CSSProperties = {
  border: '1px solid #d1d5db',
  padding: '8px 12px',
  fontSize: '13px',
  verticalAlign: 'top',
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid #d1d5db',
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: 700,
  backgroundColor: '#e5e7eb',
}

const aiFilledStyle: React.CSSProperties = {
  color: '#2563eb',
  fontWeight: 500,
}

const placeholderStyle: React.CSSProperties = {
  color: '#9ca3af',
  borderBottom: '1px dashed #d1d5db',
  display: 'inline-block',
  minWidth: '100px',
  fontSize: '12px',
}
