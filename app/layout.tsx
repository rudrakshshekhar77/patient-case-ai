import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwasthyaSathi",
  description: "AI-Powered Patient Case-Taking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-800`}>
        <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                S
              </span>
              <span className="text-xl font-bold text-slate-800">SwasthyaSathi</span>
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}