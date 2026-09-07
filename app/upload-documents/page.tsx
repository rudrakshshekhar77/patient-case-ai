'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UploadDocuments() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const handleUpload = async () => {
    if (!file) return
    setProcessing(true)
    const patientId = localStorage.getItem('patient_id')
    const fileName = `${patientId}-${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file)

    if (uploadError) {
      alert(uploadError.message)
      setProcessing(false)
      return
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

    setProcessing(false)
    router.push('/generate-summary')
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Upload Medical Documents</h1>
      <input type="file" accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="mb-4" />
      <button onClick={handleUpload} disabled={processing || !file}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50">
        {processing ? 'Processing...' : 'Upload & Process'}
      </button>
      <button onClick={() => router.push('/generate-summary')} className="text-sm text-gray-500 mt-3">
        Skip (no documents to upload)
      </button>
    </div>
  )
}