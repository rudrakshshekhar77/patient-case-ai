'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type CaseData = {
  id: string
  status: string
  ai_summary: string
  doctor_edited_summary: string | null
  created_at: string
  case_records: {
    chief_complaint: string
    duration: string
    patients: {
      full_name: string
      age: number
      gender: string
      phone: string
    }
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function renderInline(line: string, keyPrefix: string) {
  const parts = line.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>
  })
}

function FormattedSummary({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-2.5">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim()
        if (!line) return <div key={idx} className="h-1" />

        if (line.startsWith('###') || line.startsWith('##')) {
          const heading = line.replace(/^#+\s*/, '').replace(/\*\*/g, '')
          return (
            <h3 key={idx} className="text-base font-bold text-teal-800 mt-5 first:mt-0 pb-1 border-b border-teal-100">
              {heading}
            </h3>
          )
        }

        if (/^\*\*[^*]+\*\*:?$/.test(line)) {
          return (
            <h3 key={idx} className="text-base font-bold text-teal-800 mt-5 first:mt-0 pb-1 border-b border-teal-100">
              {line.replace(/\*\*/g, '')}
            </h3>
          )
        }

        if (line.startsWith('* ') || line.startsWith('- ')) {
          return (
            <div key={idx} className="flex gap-2 pl-1">
              <span className="text-teal-600 mt-1.5 shrink-0">•</span>
              <p className="text-slate-700 leading-relaxed">{renderInline(line.slice(2), `l${idx}`)}</p>
            </div>
          )
        }

        return (
          <p key={idx} className="text-slate-700 leading-relaxed">
            {renderInline(line, `l${idx}`)}
          </p>
        )
      })}
    </div>
  )
}

export default function CaseReview() {
  const { id } = useParams()
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [editedSummary, setEditedSummary] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchCase = async () => {
      const { data } = await supabase
        .from('case_summaries')
        .select('*, case_records(*, patients(*))')
        .eq('id', id)
        .single()
      setCaseData(data as any)
      setEditedSummary((data as any)?.doctor_edited_summary || (data as any)?.ai_summary || '')
    }
    fetchCase()
  }, [id])

  const handleConfirm = async () => {
    setSaving(true)
    await supabase.from('case_summaries')
      .update({ doctor_edited_summary: editedSummary, status: 'confirmed' })
      .eq('id', id)
    setSaving(false)
    setSaved(true)
    setIsEditing(false)
    setCaseData((prev) => (prev ? { ...prev, status: 'confirmed' } : prev))
    setTimeout(() => setSaved(false), 2500)
  }

  if (!caseData) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Loading case...</p>
      </div>
    )
  }

  const patient = caseData.case_records?.patients
  const record = caseData.case_records

  return (
    <div
      className="min-h-[calc(100vh-73px)] py-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(248, 250, 252, 0.95), rgba(248, 250, 252, 0.98)), url('https://images.unsplash.com/photo-1631507623289-8127b3d61e50?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/doctor/dashboard" className="text-sm text-teal-700 hover:text-teal-800 font-medium mb-4 inline-flex items-center gap-1">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-3 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg shrink-0">
                {getInitials(patient?.full_name || '?')}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{patient?.full_name}</h1>
                <p className="text-sm text-slate-500">
                  {patient?.age} years old · {patient?.gender} · {patient?.phone}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                caseData.status === 'confirmed'
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {caseData.status === 'confirmed' ? '✓ Confirmed' : 'Pending Review'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Chief Complaint</p>
              <p className="text-sm text-slate-700 line-clamp-2">{record?.chief_complaint || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Duration</p>
              <p className="text-sm text-slate-700">{record?.duration || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Submitted</p>
              <p className="text-sm text-slate-700">
                {new Date(caseData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-teal-600">✨</span> Clinical Case Summary
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-teal-700 hover:text-teal-800 font-medium"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            AI-prepared from the patient&apos;s questionnaire and documents. Review before confirming.
          </p>

          <div
            className="border border-slate-200 rounded-xl p-6 bg-white"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {isEditing ? (
              <textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                rows={16}
                className="w-full text-slate-800 leading-relaxed focus:outline-none resize-none"
                style={{ fontFamily: 'inherit', fontSize: '15px' }}
              />
            ) : (
              <FormattedSummary text={editedSummary} />
            )}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Confirm & Save'}
            </button>
            {saved && (
              <span className="text-teal-700 text-sm font-medium">✓ Case confirmed successfully</span>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 italic mt-8 max-w-md mx-auto">
          &quot;The art of medicine consists of amusing the patient while nature cures the disease.&quot;
          <span className="block not-italic text-xs text-slate-400 mt-1">— Voltaire</span>
        </p>
      </div>
    </div>
  )
}