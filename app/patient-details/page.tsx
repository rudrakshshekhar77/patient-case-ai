'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PatientDetails() {
  const [form, setForm] = useState({ full_name: '', age: '', gender: '', phone: '' })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

    if (!error && data) {
      localStorage.setItem('patient_id', data.id)
      router.push('/questionnaire')
    } else {
      alert(error?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="full_name" placeholder="Full Name" onChange={handleChange}
          className="w-full border p-2 rounded" required />
        <input name="age" type="number" placeholder="Age" onChange={handleChange}
          className="w-full border p-2 rounded" required />
        <select name="gender" onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input name="phone" placeholder="Phone Number" onChange={handleChange}
          className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Continue</button>
      </form>
    </div>
  )
}