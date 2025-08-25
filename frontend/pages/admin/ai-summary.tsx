import Head from 'next/head';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminAISummaryPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const res = await api.adminAISummary();
        setSummary(res.summary);
      } catch (e) {
        setError('Not authorized or failed to load summary');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function copy() {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
  }

  return (
    <>
      <Head>
        <title>Admin AI Summary - DigiPratibha</title>
      </Head>
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">AI Analytics Assistant</h1>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="bg-white rounded shadow p-4">
              <div className="whitespace-pre-wrap text-gray-800">{summary}</div>
              <div className="mt-3">
                <button onClick={copy} className="px-3 py-2 bg-gray-900 text-white rounded">Copy</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}



