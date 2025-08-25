import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api } from '../lib/api';

export default function Home() {
  const [health, setHealth] = useState<string>('checking...');

  useEffect(() => {
    api.health().then((ok) => setHealth(ok ? 'OK' : 'DOWN')).catch(() => setHealth('DOWN'));
  }, []);

  return (
    <>
      <Head>
        <title>DigiPratibha</title>
      </Head>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to DigiPratibha</h1>
            <p className="mb-4 text-gray-600">A student digital-portfolio platform.</p>
            <div className="flex justify-center gap-4 mb-8">
              <Link className="px-4 py-2 bg-blue-600 text-white rounded" href="/login">Login</Link>
              <Link className="px-4 py-2 bg-green-600 text-white rounded" href="/signup">Sign Up</Link>
              <Link className="px-4 py-2 bg-gray-800 text-white rounded" href="/dashboard">Dashboard</Link>
            </div>
            <p className="text-sm text-gray-500">Backend health: {health}</p>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Discover by Skill</h2>
            <SearchBySkill />
          </div>
        </div>
      </main>
    </>
  );
}

function SearchBySkill() {
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState<string | null>(null);
  const { data, isLoading } = useSWR(() => (skill ? `search:${skill}` : null), () => api.searchUsers(skill as string));
  const users = data?.users || [];

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., React" className="flex-1 border rounded px-3 py-2" />
        <button onClick={() => setSkill(q.trim() || null)} className="px-4 py-2 bg-gray-900 text-white rounded">Search</button>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <div className="animate-pulse h-24 bg-gray-200 rounded" />}
        {!isLoading && users.map((u: any) => (
          <Link key={u._id} href={`/u/${u.username}`} className="block bg-gray-50 rounded p-3 hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {u.profilePicture ? <img src={u.profilePicture} alt={u.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">NA</div>}
              </div>
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-gray-600 truncate">{(u.skills || []).join(', ')}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


