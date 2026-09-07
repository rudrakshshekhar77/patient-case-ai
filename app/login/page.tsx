'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)
    else router.push('/patient-details')
  }

  return (
    <div className="min-h-[calc(100vh-73px)] grid md:grid-cols-2">
      {/* Left branding panel */}
      <div
        className="relative hidden md:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6, 78, 74, 0.88), rgba(15, 23, 42, 0.92)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop')",
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
            Your case history,<br />captured with care.
          </h2>
          <p className="text-teal-50/80 text-base max-w-sm">
            Speak your symptoms, upload your reports, and let AI prepare a
            clear summary for your doctor — before you even walk in.
          </p>
        </div>

        <p className="text-xs text-teal-50/60">
          © 2026 SwasthyaSathi. Built for better healthcare access.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="md:hidden text-center mb-6">
            <span className="text-2xl font-bold text-slate-900">SwasthyaSathi</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {isSignUp ? 'Sign up to start your case intake' : 'Log in to continue to your health record'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
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
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-teal-700 hover:text-teal-800 mt-5 block mx-auto font-medium"
          >
            {isSignUp ? 'Already have an account? Log in' : 'New here? Create an account'}
          </button>
        </div>
      </div>
    </div>
  )
}