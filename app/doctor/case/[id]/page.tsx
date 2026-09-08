'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
    symptoms: string
    duration: string
    medical_history: string
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

export default function CaseReview() {
  const { id } = useParams()
  const router = useRouter()
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [editedSummary, setEditedSummary] = useState('')
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
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link href="/doctor/dashboard" className="text-sm text-teal-700 hover:text-teal-800 font-medium mb-4 inline-flex items-center gap-1">
          ← Back to Dashboard
        </Link>

        {/* Patient header card */}
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

        {/* AI Summary card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-teal-600">✨</span> AI-Generated Clinical Summary
            </h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Review and edit as needed before confirming. Your edits will be saved as the final record.
          </p>

          <textarea
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            rows={16}
            className="w-full border border-slate-300 rounded-xl p-5 text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '15px' }}
          />

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Confirm & Save'}
            </button>
            {saved && (
              <span className="text-teal-700 text-sm font-medium flex items-center gap-1">
                ✓ Case confirmed successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}