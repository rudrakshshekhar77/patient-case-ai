import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 text-center">
      <div className="inline-block bg-teal-50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
        AI-Powered Healthcare
      </div>
      <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
        SwasthyaSathi
      </h1>
      <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
        Streamlined patient case-taking with voice input, AI document reading,
        and instant clinical summaries for doctors.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/login"
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
        >
          Patient Login
        </Link>
        <Link
          href="/doctor/dashboard"
          className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-lg font-medium border border-slate-300 transition-colors"
        >
          Doctor Dashboard
        </Link>
      </div>
    </div>
  )
}