import Link from 'next/link'

export default function Home() {
  return (
    <div
      className="min-h-[calc(100vh-73px)] flex items-center justify-center relative text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(6, 78, 74, 0.90), rgba(15, 23, 42, 0.94)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-teal-50 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/10">
          AI-Powered Healthcare
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-12 h-12 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center font-bold text-xl">
            S
          </span>
          <h1 className="text-5xl font-bold tracking-tight">
            SwasthyaSathi
          </h1>
        </div>
        <p className="text-lg text-teal-50/80 mb-10 max-w-xl mx-auto">
          Streamlined patient case-taking with voice input, AI document reading,
          and instant clinical summaries for doctors.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-white text-teal-800 hover:bg-teal-50 px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
          >
            Patient Login
          </Link>
          <Link
            href="/doctor/login"
            className="bg-white/10 backdrop-blur hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium border border-white/20 transition-colors"
          >
            Doctor Dashboard
          </Link>
        </div>

        <p className="text-xs text-teal-50/50 mt-16">
          © 2026 SwasthyaSathi. Built for better healthcare access.
        </p>
      </div>
    </div>
  )
}