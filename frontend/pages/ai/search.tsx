import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AISemanticSearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  // simple protection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    const id = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.aiSearch(q.trim());
        setResults(res.results || []);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  const content = useMemo(() => {
    if (loading) return <LoadingSpinner className="mt-6" />;
    if (!results) return null;
    if (results.length === 0)
      return <div className="mt-6 text-gray-600 animate-fadeIn">No similar resources found</div>;
    return (
      <ul className="mt-4 space-y-3">
        {results.map((r: any, idx) => (
          <li key={idx} className="bg-white rounded shadow p-4 hover:shadow-md transition-shadow">
            <div className="font-semibold">{r.title || r.link}</div>
            {r.link && (
              <a className="text-sm text-blue-600" href={r.link} target="_blank" rel="noreferrer">{r.link}</a>
            )}
            <div className="text-xs text-gray-500 mt-1">score: {r.score?.toFixed(3)}</div>
          </li>
        ))}
      </ul>
    );
  }, [loading, results]);

  return (
    <>
      <Head>
        <title>AI Smart Search - DigiPratibha</title>
      </Head>
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Smart Resource Search</h1>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search resources smartly..." className="w-full border rounded px-3 py-2" />
          {content}
        </div>
      </main>
    </>
  );
}



