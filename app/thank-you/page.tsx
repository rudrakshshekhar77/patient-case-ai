import Link from 'next/link'

export default function ThankYou() {
  return (
    <div
      className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage:
          "linear-gradient(rgba(248, 250, 252, 0.94), rgba(248, 250, 252, 0.97)), url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          {['Your Details', 'Case Details', 'Documents', 'Summary'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-semibold shrink-0">✓</div>
                <span className="text-sm text-slate-500 whitespace-nowrap">{label}</span>
              </div>
              {i < 3 && <div className="flex-1 h-px bg-teal-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Case Submitted</h1>
          <p className="text-slate-500 text-sm mb-6">
            Thank you. Your case history and any uploaded documents have been
            recorded and summarized. Your doctor will review it shortly before
            your visit.
          </p>

          <div className="bg-slate-50 rounded-lg p-4 text-left text-sm text-slate-600 space-y-2 mb-6">
            <p className="flex items-center gap-2">
              <span className="text-teal-600 font-semibold">✓</span> Case details recorded
            </p>
            <p className="flex items-center gap-2">
              <span className="text-teal-600 font-semibold">✓</span> Documents processed by AI
            </p>
            <p className="flex items-center gap-2">
              <span className="text-teal-600 font-semibold">✓</span> Summary sent to your doctor
            </p>
          </div>

          <Link
            href="/"
            className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-center text-sm text-slate-500 italic mt-6 max-w-md mx-auto">
          &quot;To cure sometimes, to relieve often, to comfort always.&quot;
        </p>
      </div>
    </div>
  )
}