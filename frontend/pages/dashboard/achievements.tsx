import Head from 'next/head';
import { useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { api } from '../../lib/api';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function AchievementsPage() {
  const { data, mutate, isLoading } = useSWR('achievements', api.listAchievements);
  const items = data?.items || [];
  const [form, setForm] = useState<any>({ title: '', date: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      if (editingId) await api.updateAchievement(editingId, form);
      else await api.createAchievement(form);
      setForm({ title: '', date: '', description: '' });
      setEditingId(null);
      await mutate();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await api.deleteAchievement(id);
    await mutate();
  }

  return (
    <>
      <Head>
        <title>Achievements - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">{editingId ? 'Edit' : 'Add'} Achievement</h2>
            <div className="space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border rounded px-3 py-2" />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border rounded px-3 py-2" />
              <ReactQuill theme="snow" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
              <div className="flex gap-3">
                <button onClick={submit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
                {editingId && (
                  <button onClick={() => { setEditingId(null); setForm({ title: '', date: '', description: '' }); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Your Achievements</h2>
            {isLoading ? (
              <div className="animate-pulse h-24 bg-gray-200 rounded" />
            ) : (
              <div className="space-y-3">
                {items.map((it: any) => (
                  <div key={it._id} className="bg-white rounded shadow p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{it.title}</div>
                        <div className="text-sm text-gray-600">{(it.date || '').slice(0,10)}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(it._id); setForm({ title: it.title || '', date: (it.date || '').slice(0,10), description: it.description || '' }); }} className="px-3 py-1 text-sm bg-gray-100 rounded">Edit</button>
                        <button onClick={() => remove(it._id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
                      </div>
                    </div>
                    <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: it.description || '' }} />
                  </div>
                ))}
                {items.length === 0 && <div className="text-sm text-gray-600">No achievements yet.</div>}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}


