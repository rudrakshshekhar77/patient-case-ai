'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PatientDetails() {
  const [form, setForm] = useState({ full_name: '', age: '', gender: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Please log in first')
      router.push('/login')
      return
    }

    const { data, error } = await supabase.from('patients').insert({
      auth_id: user.id,
      full_name: form.full_name,
      age: parseInt(form.age),
      gender: form.gender,
      phone: form.phone,
    }).select().single()

    setLoading(false)
    if (!error && data) {
      localStorage.setItem('patient_id', data.id)
      router.push('/questionnaire')
    } else {
      alert(error?.message || 'Something went wrong')
    }
  }

  return (
    <div
  className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12"
  style={{
    backgroundImage:
      "linear-gradient(rgba(30, 41, 59, 0.55), rgba(30, 41, 59, 0.65)), url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=1600&auto=format&fit=crop')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold">1</div>
            <span className="text-sm font-medium text-teal-700">Your Details</span>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-semibold">2</div>
            <span className="text-sm text-slate-400">Case Details</span>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-semibold">3</div>
            <span className="text-sm text-slate-400">Documents</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Tell us about yourself</h1>
          <p className="text-slate-500 text-sm mb-6">
            This helps your doctor understand who they&apos;re treating.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                name="full_name"
                placeholder="e.g. Priya Sharma"
                onChange={handleChange}
                className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input
                  name="age"
                  type="number"
                  placeholder="e.g. 32"
                  onChange={handleChange}
                  className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  onChange={handleChange}
                  defaultValue=""
                  className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                name="phone"
                placeholder="e.g. 9876543210"
                onChange={handleChange}
                className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white p-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}