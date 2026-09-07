import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white border-b p-4 shadow-sm">
          <a href="/" className="text-xl font-bold text-blue-600">SwasthyaSathi</a>
        </nav>
        {children}
      </body>
    </html>
  );
}