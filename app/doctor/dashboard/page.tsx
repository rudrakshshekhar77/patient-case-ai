'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
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

export default function DoctorDashboard() {
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCases = async () => {
      const { data } = await supabase
        .from('case_summaries')
        .select('*, case_records(*, patients(*))')
        .order('created_at', { ascending: false })
      setCases((data as any) || [])
      setLoading(false)
    }
    fetchCases()
  }, [])

  const pendingCount = cases.filter((c) => c.status === 'pending').length
  const confirmedCount = cases.filter((c) => c.status === 'confirmed').length

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
        <p className="text-gray-500 mt-1">Review and manage patient cases</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Cases</p>
          <p className="text-2xl font-bold text-gray-800">{cases.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading cases...</p>}

      <div className="space-y-3">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`/doctor/case/${c.id}`}
            className="block bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {c.case_records?.patients?.full_name || 'Unknown Patient'}
                </p>
                <p className="text-sm text-gray-500">
                  {c.case_records?.patients?.age} yrs, {c.case_records?.patients?.gender}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                  {c.case_records?.chief_complaint}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  c.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {c.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {new Date(c.created_at).toLocaleString()}
            </p>
          </Link>
        ))}
        {!loading && cases.length === 0 && (
          <p className="text-gray-500 text-center py-10">No cases yet.</p>
        )}
      </div>
    </div>
  )
}