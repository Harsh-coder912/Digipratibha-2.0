import Head from 'next/head';
import { useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { api } from '../../lib/api';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EducationPage() {
  const { data, mutate, isLoading } = useSWR('education', api.listEducation);
  const items = data?.items || [];
  const [form, setForm] = useState<any>({ school: '', degree: '', startDate: '', endDate: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      if (editingId) await api.updateEducation(editingId, form);
      else await api.createEducation(form);
      setForm({ school: '', degree: '', startDate: '', endDate: '', description: '' });
      setEditingId(null);
      await mutate();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await api.deleteEducation(id);
    await mutate();
  }

  return (
    <>
      <Head>
        <title>Education - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="font-semibold mb-3">{editingId ? 'Edit' : 'Add'} Education</h2>
            <div className="space-y-3">
              <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="School" className="w-full border rounded px-3 py-2" />
              <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Degree" className="w-full border rounded px-3 py-2" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded px-3 py-2" />
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border rounded px-3 py-2" />
              </div>
              <ReactQuill theme="snow" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
              <div className="flex gap-3">
                <button onClick={submit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
                {editingId && (
                  <button onClick={() => { setEditingId(null); setForm({ school: '', degree: '', startDate: '', endDate: '', description: '' }); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Your Education</h2>
            {isLoading ? (
              <div className="animate-pulse h-24 bg-gray-200 rounded" />
            ) : (
              <div className="space-y-3">
                {items.map((it: any) => (
                  <div key={it._id} className="bg-white rounded shadow p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{it.school}</div>
                        <div className="text-sm text-gray-600">{it.degree}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(it._id); setForm({ school: it.school || '', degree: it.degree || '', startDate: (it.startDate || '').slice(0,10), endDate: (it.endDate || '').slice(0,10), description: it.description || '' }); }} className="px-3 py-1 text-sm bg-gray-100 rounded">Edit</button>
                        <button onClick={() => remove(it._id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
                      </div>
                    </div>
                    <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: it.description || '' }} />
                  </div>
                ))}
                {items.length === 0 && <div className="text-sm text-gray-600">No education added yet.</div>}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}


