'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const STEPS = [
  'Reviewing your questionnaire...',
  'Reading uploaded documents...',
  'Preparing clinical summary...',
  'Almost done...',
]

export default function GenerateSummary() {
  const [stepIndex, setStepIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 1500)

    const run = async () => {
      const caseRecordId = localStorage.getItem('case_record_id')
      const patientId = localStorage.getItem('patient_id')

      if (!caseRecordId || !patientId) {
        router.push('/patient-details')
        return
      }

      const { data: caseRecord } = await supabase
        .from('case_records')
        .select('*')
        .eq('id', caseRecordId)
        .single()

      const { data: docs } = await supabase
        .from('medical_documents')
        .select('ai_extracted_text')
        .eq('patient_id', patientId)

      const documentTexts = docs?.map((d) => d.ai_extracted_text).join('\n\n') || ''

      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseRecord, documentTexts }),
      })
      const result = await res.json()

      await supabase.from('case_summaries').insert({
        case_record_id: caseRecordId,
        ai_summary: result.summary,
        status: 'pending',
      })

      clearInterval(interval)
      router.push('/thank-you')
    }
    run()

    return () => clearInterval(interval)
  }, [router])

  return (
    <div
      className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage:
          "linear-gradient(rgba(248, 250, 252, 0.94), rgba(248, 250, 252, 0.97)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">✓</div>
            <span className="text-sm text-slate-500">Your Details</span>
          </div>
          <div className="flex-1 h-px bg-teal-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">✓</div>
            <span className="text-sm text-slate-500">Case Details</span>
          </div>
          <div className="flex-1 h-px bg-teal-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">✓</div>
            <span className="text-sm text-slate-500">Documents</span>
          </div>
          <div className="flex-1 h-px bg-teal-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">4</div>
            <span className="text-sm font-medium text-teal-700">Summary</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-teal-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-xl">🩺</div>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Preparing your case summary
          </h1>
          <p className="text-slate-500 text-sm min-h-[1.5rem]">
            {STEPS[stepIndex]}
          </p>

          <div className="flex justify-center gap-1.5 mt-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= stepIndex ? 'bg-teal-700 w-6' : 'bg-slate-200 w-1.5'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 italic mt-6 max-w-md mx-auto">
          &quot;It is much more important to know what sort of patient has a disease
          than what sort of disease a patient has.&quot;
          <span className="block not-italic text-xs text-slate-400 mt-1">— William Osler</span>
        </p>
      </div>
    </div>
  )
}