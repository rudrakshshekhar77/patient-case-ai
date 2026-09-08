'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DOCTOR_EMAIL = 'doctor@swasthyasathi.com'
const DOCTOR_PASSWORD = 'doctor123'

export default function DoctorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === DOCTOR_EMAIL && password === DOCTOR_PASSWORD) {
      localStorage.setItem('doctor_logged_in', 'true')
      router.push('/doctor/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] grid md:grid-cols-2">
      <div
        className="relative hidden md:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6, 78, 74, 0.88), rgba(15, 23, 42, 0.92)), url('https://images.unsplash.com/photo-1631507623289-8127b3d61e50?q=80&w=1200&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center font-bold text-lg">
            S
          </span>
          <span className="text-2xl font-bold tracking-tight">SwasthyaSathi</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Every case,<br />reviewed with clarity.
          </h2>
          <p className="text-teal-50/80 text-base max-w-sm">
            AI-prepared summaries, ready for your review — so you can focus
            on the patient, not the paperwork.
          </p>
        </div>

        <p className="text-xs text-teal-50/60">
          © 2026 SwasthyaSathi. Built for better healthcare access.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="md:hidden text-center mb-6">
            <span className="text-2xl font-bold text-slate-900">SwasthyaSathi</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Doctor Login</h1>
          <p className="text-slate-500 text-sm mb-6">
            Sign in to access your patient case dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="doctor@swasthyasathi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-teal-700 hover:bg-teal-800 text-white p-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              Log In
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-6 text-center">
            Demo credentials: doctor@swasthyasathi.com / doctor123
          </p>
        </div>
      </div>
    </div>
  )
}