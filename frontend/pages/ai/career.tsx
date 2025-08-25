import Head from 'next/head';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function CareerRecommendationPage() {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [recs, setRecs] = useState<Array<{ title: string; description: string; requiredSkills: string[]; learningPath: string[] }> | null>(null);

  // simple protection: redirect if no token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) window.location.href = '/login';
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    setRecs(null);
    try {
      const payload = {
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
        educationLevel,
      };
      const res = await api.careerRecommendation(payload);
      setRecs(res.recommendedCareers || []);
    } catch (err: any) {
      setError('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>AI Career Recommendations - DigiPratibha</title>
      </Head>
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">AI Career Recommendations</h1>
          <form onSubmit={submit} className="bg-white rounded shadow p-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, Node.js, Python" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interests</label>
              <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., Web Dev, AI/ML, Design" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Education Level</label>
              <input value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} placeholder="e.g., Undergraduate" className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Get Recommendations</button>
              {loading && <LoadingSpinner />}
              <ErrorMessage message={error} />
            </div>
          </form>

          {recs && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {recs.map((r, idx) => (
                <div key={idx} className="bg-white rounded shadow p-4">
                  <div className="font-semibold text-lg">{r.title}</div>
                  <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                  <div className="mt-3">
                    <div className="text-sm font-medium">Required Skills</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {r.requiredSkills?.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium">Learning Path</div>
                    <ul className="list-disc text-sm pl-5 mt-1">
                      {r.learningPath?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}



