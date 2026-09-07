'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function GenerateSummary() {
  const [status, setStatus] = useState('Generating summary...')
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const caseRecordId = localStorage.getItem('case_record_id')
      const patientId = localStorage.getItem('patient_id')

      if (!caseRecordId || !patientId) {
        setStatus('Missing patient data. Redirecting...')
        setTimeout(() => router.push('/patient-details'), 1500)
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

      setStatus('Done! Redirecting...')
      setTimeout(() => router.push('/thank-you'), 1000)
    }
    run()
  }, [router])

  return <div className="text-center mt-20 text-xl">{status}</div>
}