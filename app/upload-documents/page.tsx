'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UploadDocuments() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const router = useRouter()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadAll = async () => {
    setProcessing(true)
    const patientId = localStorage.getItem('patient_id')

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setCurrentStep(`Processing ${i + 1} of ${files.length}: ${file.name}`)

      const fileName = `${patientId}-${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) {
        alert(`Failed to upload ${file.name}: ${uploadError.message}`)
        continue
      }

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
      const fileUrl = urlData.publicUrl

      const res = await fetch('/api/process-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl }),
      })
      const result = await res.json()

      await supabase.from('medical_documents').insert({
        patient_id: patientId,
        file_url: fileUrl,
        ai_extracted_text: result.extractedText,
      })
    }

    setCurrentStep('Generating your case summary...')
    router.push('/generate-summary')
  }

  return (
    <div
      className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage:
          "linear-gradient(rgba(248, 250, 252, 0.94), rgba(248, 250, 252, 0.97)), url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-xl">
        {/* Progress indicator */}
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
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">3</div>
            <span className="text-sm font-medium text-teal-700">Documents</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Upload Medical Documents</h1>
          <p className="text-slate-500 text-sm mb-6">
            Add prescriptions, lab reports, or scans. Our AI will read and summarize them for your doctor.
          </p>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-teal-400 hover:bg-teal-50/40 transition-colors">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-2xl mb-3">
              📄
            </div>
            <p className="text-sm font-medium text-slate-700">Click to add a document</p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG or PDF · you can add more than one</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-5 space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-teal-600">📎</span>
                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                  </div>
                  {!processing && (
                    <button
                      onClick={() => removeFile(i)}
                      className="text-slate-400 hover:text-red-500 text-sm shrink-0 ml-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {processing && (
            <p className="text-sm text-teal-700 bg-teal-50 rounded-lg px-4 py-2.5 mt-4 animate-pulse">
              {currentStep}
            </p>
          )}

          <button
            onClick={handleUploadAll}
            disabled={processing || files.length === 0}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white p-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-40 mt-6"
          >
            {processing ? 'Processing...' : `Upload & Continue${files.length > 0 ? ` (${files.length})` : ''}`}
          </button>

          <button
            onClick={() => router.push('/generate-summary')}
            disabled={processing}
            className="text-sm text-slate-500 hover:text-slate-700 mt-3 block mx-auto disabled:opacity-40"
          >
            Skip — I don&apos;t have documents to upload
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 italic mt-6 max-w-md mx-auto">
          &quot;Wherever the art of medicine is loved, there is also a love of humanity.&quot;
          <span className="block not-italic text-xs text-slate-400 mt-1">— Hippocrates</span>
        </p>
      </div>
    </div>
  )
}