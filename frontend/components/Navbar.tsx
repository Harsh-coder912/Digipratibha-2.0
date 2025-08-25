import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const user = JSON.parse(raw);
        setIsAdmin(user?.role === 'admin');
      }
    } catch {}
  }, []);

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="font-semibold">DigiPratibha</Link>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="px-3 py-1 rounded hover:bg-gray-100">AI Tools</button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow border z-10">
                <Link href="/ai/career" className="block px-4 py-2 hover:bg-gray-50">Career Recommendation</Link>
                <Link href="/ai/search" className="block px-4 py-2 hover:bg-gray-50">Smart Search</Link>
                <Link href="/ai/chatbot" className="block px-4 py-2 hover:bg-gray-50">Chatbot</Link>
                <Link href="/ai/analyzer" className="block px-4 py-2 hover:bg-gray-50">Project Analyzer</Link>
              </div>
            )}
          </div>
          {isAdmin && (
            <Link href="/admin/ai-summary" className="px-3 py-1 rounded bg-gray-900 text-white">AI Summary</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

