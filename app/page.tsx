import Link from 'next/link'

export default function Home() {
  return (
    <div
      className="min-h-[calc(100vh-73px)] flex items-center justify-center relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(248, 250, 252, 0.93), rgba(248, 250, 252, 0.97)), url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-block bg-teal-50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-100">
          AI-Powered Healthcare
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          SwasthyaSathi
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          Streamlined patient case-taking with voice input, AI document reading,
          and instant clinical summaries for doctors.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
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
    </div>
  )
}