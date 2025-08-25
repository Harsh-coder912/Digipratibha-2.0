import Head from 'next/head';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

function Accordion({ title, children }: { title: string; children: any }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded shadow">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-2 font-medium flex items-center justify-between">
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function AIAnalyzerPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ strengths: string[]; weaknesses: string[]; suggestions: string[] } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) window.location.href = '/login';
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.analyzeProject({ projectTitle: title, description: desc });
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>AI Project Analyzer - DigiPratibha</title>
      </Head>
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Project Idea Analyzer</h1>
          <form onSubmit={submit} className="bg-white rounded shadow p-4 grid gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className="w-full border rounded px-3 py-2" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={6} placeholder="Describe your project idea..." className="w-full border rounded px-3 py-2" />
            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Analyze</button>
              {loading && <LoadingSpinner />}
            </div>
          </form>

          {result && (
            <div className="mt-6 grid gap-4">
              <Accordion title="✅ Strengths">
                <ul className="list-disc pl-5 text-sm">
                  {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Accordion>
              <Accordion title="⚠️ Weaknesses">
                <ul className="list-disc pl-5 text-sm">
                  {result.weaknesses?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Accordion>
              <Accordion title="💡 Suggestions">
                <ul className="list-disc pl-5 text-sm">
                  {result.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </Accordion>
            </div>
          )}
        </div>
      </main>
    </>
  );
}



