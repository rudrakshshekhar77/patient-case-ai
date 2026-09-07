'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type CaseSummary = {
  id: string
  status: string
  created_at: string
  case_records: {
    patients: {
      full_name: string
    }
  }
}

export default function DoctorDashboard() {
  const [cases, setCases] = useState<CaseSummary[]>([])

  useEffect(() => {
    const fetchCases = async () => {
      const { data } = await supabase
        .from('case_summaries')
        .select('*, case_records(*, patients(*))')
        .order('created_at', { ascending: false })
      setCases((data as any) || [])
    }
    fetchCases()
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <div className="space-y-3">
        {cases.map((c) => (
          <Link key={c.id} href={`/doctor/case/${c.id}`}
            className="block border p-4 rounded hover:bg-gray-50">
            <p className="font-semibold">{c.case_records?.patients?.full_name || 'Unknown Patient'}</p>
            <p className="text-sm text-gray-500">Status: {c.status}</p>
            <p className="text-sm text-gray-500">
              {new Date(c.created_at).toLocaleString()}
            </p>
          </Link>
        ))}
        {cases.length === 0 && <p className="text-gray-500">No cases yet.</p>}
      </div>
    </div>
  )
}