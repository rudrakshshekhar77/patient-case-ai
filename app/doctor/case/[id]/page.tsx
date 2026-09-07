'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type CaseData = {
  id: string
  ai_summary: string
  doctor_edited_summary: string | null
  case_records: {
    patients: {
      full_name: string
      age: number
      gender: string
    }
  }
}

export default function CaseReview() {
  const { id } = useParams()
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [editedSummary, setEditedSummary] = useState('')

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
    await supabase.from('case_summaries')
      .update({ doctor_edited_summary: editedSummary, status: 'confirmed' })
      .eq('id', id)
    alert('Case confirmed!')
  }

  if (!caseData) return <p className="text-center mt-20">Loading...</p>

  const patient = caseData.case_records?.patients

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-2">{patient?.full_name}</h1>
      <p className="text-gray-500 mb-4">Age: {patient?.age} | Gender: {patient?.gender}</p>

      <h2 className="font-semibold mb-2">AI-Generated Summary (editable)</h2>
      <textarea
        value={editedSummary}
        onChange={(e) => setEditedSummary(e.target.value)}
        rows={14}
        className="w-full border p-3 rounded font-mono text-sm"
      />
      <button onClick={handleConfirm}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Confirm & Save
      </button>
    </div>
  )
}