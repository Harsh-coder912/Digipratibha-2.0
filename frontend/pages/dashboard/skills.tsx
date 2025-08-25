import Head from 'next/head';
import { useState } from 'react';
import useSWR from 'swr';
import { api } from '../../lib/api';

export default function SkillsPage() {
  const { data, mutate, isLoading } = useSWR('skills', api.listSkills);
  const items = data?.items || [];
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.createSkill({ name: name.trim() });
      setName('');
      await mutate();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await api.deleteSkill(id);
    await mutate();
  }

  return (
    <>
      <Head>
        <title>Skills - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">Add Skill</h2>
            <div className="flex gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., React" className="flex-1 border rounded px-3 py-2" />
              <button onClick={add} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Adding...' : 'Add'}</button>
            </div>
          </div>

          <h2 className="font-semibold mt-6 mb-3">Your Skills</h2>
          {isLoading ? (
            <div className="animate-pulse h-16 bg-gray-200 rounded" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map((it: any) => (
                <span key={it._id} className="inline-flex items-center px-3 py-1 bg-white rounded shadow text-sm">
                  {it.name}
                  <button onClick={() => remove(it._id)} className="ml-2 text-red-600">×</button>
                </span>
              ))}
              {items.length === 0 && <div className="text-sm text-gray-600">No skills yet.</div>}
            </div>
          )}
        </div>
      </main>
    </>
  );
}


