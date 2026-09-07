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
  const [activeField, setActiveField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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
    recognition.onstart = () => {
      setIsListening(true)
      setActiveField(fieldName)
    }
    recognition.onend = () => {
      setIsListening(false)
      setActiveField(null)
    }
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setForm((prev) => ({ ...prev, [fieldName]: prev[fieldName] + ' ' + transcript }))
    }
    recognition.start()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
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

    setLoading(false)
    if (!error && data) {
      localStorage.setItem('case_record_id', data.id)
      router.push('/upload-documents')
    } else {
      alert(error?.message || 'Something went wrong')
    }
  }

  const fields: { name: keyof typeof form; label: string; hint: string }[] = [
    { name: 'chief_complaint', label: 'What is the main problem/complaint?', hint: 'e.g. Severe headache for the last 3 days' },
    { name: 'symptoms', label: 'Describe your symptoms', hint: 'e.g. Throbbing pain, nausea, light sensitivity' },
    { name: 'duration', label: 'How long have you had this?', hint: 'e.g. 3 days' },
    { name: 'medical_history', label: 'Any past medical history / medications?', hint: 'e.g. History of migraine, no current medication' },
  ]

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
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">✓</div>
            <span className="text-sm text-slate-500">Your Details</span>
          </div>
          <div className="flex-1 h-px bg-teal-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">2</div>
            <span className="text-sm font-medium text-teal-700">Case Details</span>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-semibold">3</div>
            <span className="text-sm text-slate-400">Documents</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Case-Taking Questionnaire</h1>
          <p className="text-slate-500 text-sm mb-6">
            Type your answers, or tap the mic to speak instead.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                <div className="flex gap-2 items-start">
                  <textarea
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.hint}
                    className={`w-full border p-2.5 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-colors ${
                      activeField === f.name ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-300'
                    }`}
                    rows={2}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput(f.name)}
                    title="Speak your answer"
                    className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-lg transition-all ${
                      isListening && activeField === f.name
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                  >
                    🎤
                  </button>
                </div>
                {isListening && activeField === f.name && (
                  <p className="text-xs text-red-500 mt-1">Listening... speak now</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white p-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 italic mt-6 max-w-md mx-auto">
          &quot;The good physician treats the disease; the great physician treats the patient who has the disease.&quot;
          <span className="block not-italic text-xs text-slate-400 mt-1">— William Osler</span>
        </p>
      </div>
    </div>
  )
}