'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type CaseSummary = {
  id: string
  status: string
  created_at: string
  case_records: {
    chief_complaint: string
    patients: {
      full_name: string
      age: number
      gender: string
    }
  }
}

const AVATAR_COLORS = [
  'bg-teal-100 text-teal-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-rose-100 text-rose-700',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all')
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('doctor_logged_in')
    if (!isLoggedIn) {
      router.push('/doctor/login')
      return
    }
    setAuthChecked(true)
  }, [router])

  useEffect(() => {
    if (!authChecked) return
    const fetchCases = async () => {
      const { data } = await supabase
        .from('case_summaries')
        .select('*, case_records(*, patients(*))')
        .order('created_at', { ascending: false })
      setCases((data as any) || [])
      setLoading(false)
    }
    fetchCases()
  }, [authChecked])

  const handleLogout = () => {
    localStorage.removeItem('doctor_logged_in')
    router.push('/doctor/login')
  }

  if (!authChecked) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Checking access...</p>
      </div>
    )
  }

  const pendingCount = cases.filter((c) => c.status === 'pending').length
  const confirmedCount = cases.filter((c) => c.status === 'confirmed').length

  const filteredCases = cases.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter
    const name = c.case_records?.patients?.full_name?.toLowerCase() || ''
    const matchesSearch = name.includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50">
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-teal-100 text-sm font-medium mb-1">Welcome back, Dr. Sharma</p>
            <h1 className="text-3xl font-bold">Patient Case Dashboard</h1>
            <p className="text-teal-100/80 text-sm mt-1">
              Review AI-prepared case summaries before each consultation
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-teal-50 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Total Cases</p>
            <p className="text-3xl font-bold text-slate-800">{cases.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-orange-500">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-teal-600">{confirmedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search patient by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
          <div className="flex gap-2">
            {(['all', 'pending', 'confirmed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-slate-400">Loading cases...</div>
        )}

        <div className="space-y-3 pb-12">
          {filteredCases.map((c, i) => {
            const patient = c.case_records?.patients
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
            return (
              <Link
                key={c.id}
                href={`/doctor/case/${c.id}`}
                className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${avatarColor}`}>
                  {getInitials(patient?.full_name || '?')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800">
                      {patient?.full_name || 'Unknown Patient'}
                    </p>
                    <span className="text-xs text-slate-400">
                      {patient?.age} yrs · {patient?.gender}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-0.5">
                    {c.case_records?.chief_complaint || 'No complaint recorded'}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      c.status === 'confirmed'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-xs text-slate-400">{timeAgo(c.created_at)}</span>
                </div>
              </Link>
            )
          })}

          {!loading && filteredCases.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">No cases match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}