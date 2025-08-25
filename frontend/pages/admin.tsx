import Head from 'next/head';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { api } from '../lib/api';
import dynamic from 'next/dynamic';

const AdminUserGrowthChart = dynamic(() => import('../components/AdminUserGrowthChart'), { ssr: false });

export default function AdminPage() {
  const { data, mutate, isLoading, error } = useSWR('admin-users', api.getUsers);
  const [tab, setTab] = useState<'users' | 'analytics'>('users');

  const users = data?.users || [];
  const stats = data?.stats || {};

  async function removeUser(id: string) {
    await api.deleteUser(id);
    await mutate();
  }

  const chartData = useMemo(() => {
    // Placeholder synthetic chart data; backend can later provide real series
    return Array.from({ length: 6 }).map((_, i) => ({ month: `M${i + 1}`, users: (stats.usersCount || 0) * (i + 1) / 10 + i }));
  }, [stats.usersCount]);

  return (
    <>
      <Head>
        <title>Admin - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              <button onClick={() => setTab('users')} className={`px-3 py-1 rounded ${tab==='users' ? 'bg-gray-900 text-white' : 'bg-white'}`}>Users</button>
              <button onClick={() => setTab('analytics')} className={`px-3 py-1 rounded ${tab==='analytics' ? 'bg-gray-900 text-white' : 'bg-white'}`}>Analytics</button>
            </div>
          </div>

          {error && <div className="text-red-600">Access denied or error loading admin data.</div>}

          {tab === 'users' && (
            <div className="bg-white rounded shadow overflow-x-auto">
              {isLoading ? (
                <div className="animate-pulse h-24" />
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-3">ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u._id} className="border-b">
                        <td className="p-3 text-xs text-gray-500">{u._id}</td>
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{u.role}</td>
                        <td className="p-3">
                          <button onClick={() => removeUser(u._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === 'analytics' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded shadow p-4">
                <div className="font-semibold mb-2">User Growth</div>
                <div className="h-64">
                  <AdminUserGrowthChart data={chartData} />
                </div>
              </div>
              <div className="bg-white rounded shadow p-4">
                <div className="font-semibold mb-2">Top Skills (placeholder)</div>
                <ul className="text-sm text-gray-600 list-disc pl-5">
                  <li>React</li>
                  <li>Node.js</li>
                  <li>Python</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}


