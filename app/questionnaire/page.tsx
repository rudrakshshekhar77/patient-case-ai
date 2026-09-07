'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Questionnaire() {
  const [form, setForm] = useState({
    chief_complaint: '',
    symptoms: '',
    duration: '',
    medical_history: ''
  })
  const [isListening, setIsListening] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const startVoiceInput = (fieldName: keyof typeof form) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Please use Chrome.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setForm((prev) => ({ ...prev, [fieldName]: prev[fieldName] + ' ' + transcript }))
    }
    recognition.start()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const patientId = localStorage.getItem('patient_id')

    if (!patientId) {
      alert('Patient details not found. Please fill patient details first.')
      router.push('/patient-details')
      return
    }

    const { data, error } = await supabase.from('case_records').insert({
      patient_id: patientId,
      ...form,
    }).select().single()

    if (!error && data) {
      localStorage.setItem('case_record_id', data.id)
      router.push('/upload-documents')
    } else {
      alert(error?.message || 'Something went wrong')
    }
  }

  const fields: { name: keyof typeof form; label: string }[] = [
    { name: 'chief_complaint', label: 'What is the main problem/complaint?' },
    { name: 'symptoms', label: 'Describe your symptoms' },
    { name: 'duration', label: 'How long have you had this?' },
    { name: 'medical_history', label: 'Any past medical history / medications?' },
  ]

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Case-Taking Questionnaire</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block font-medium mb-1">{f.label}</label>
            <div className="flex gap-2">
              <textarea name={f.name} value={form[f.name]} onChange={handleChange}
                className="w-full border p-2 rounded" rows={2} required />
              <button type="button" onClick={() => startVoiceInput(f.name)}
                className={`px-3 rounded ${isListening ? 'bg-red-500' : 'bg-gray-200'}`}>
                🎤
              </button>
            </div>
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Continue</button>
      </form>
    </div>
  )
}