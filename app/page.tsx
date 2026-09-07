import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto mt-32 p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">SwasthyaSathi</h1>
      <p className="text-gray-600 mb-8">AI-Powered Patient Case-Taking System</p>
      <div className="flex gap-4 justify-center">
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded">
          Patient Login
        </Link>
        <Link href="/doctor/dashboard" className="bg-green-600 text-white px-6 py-3 rounded">
          Doctor Dashboard
        </Link>
      </div>
    </div>
  )
}