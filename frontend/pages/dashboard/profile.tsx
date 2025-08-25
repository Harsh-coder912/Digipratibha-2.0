import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { api } from '../../lib/api';

function dataUrlFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileEditorPage() {
  const { data, mutate, isLoading } = useSWR('me', api.getMe);
  const user = data?.user;
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [social, setSocial] = useState<{ github?: string; linkedin?: string; portfolio?: string }>(
    {}
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setSkills(user.skills || []);
      setSocial(user.socialLinks || {});
      setAvatarPreview(user.profilePicture || null);
    }
  }, [user]);

  async function onSave() {
    try {
      setSaving(true);
      await api.updateProfile({ bio, skills, socialLinks: social });
      await mutate();
      setMessage('Profile updated');
      setTimeout(() => setMessage(null), 2000);
    } catch (e) {
      setMessage('Failed to save');
      setTimeout(() => setMessage(null), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function onAvatarChange(file: File) {
    try {
      const dataUrl = await dataUrlFromFile(file);
      setAvatarPreview(dataUrl);
      const res = await api.uploadAvatar(dataUrl);
      setAvatarPreview(res.url);
      await mutate();
      setMessage('Avatar updated');
      setTimeout(() => setMessage(null), 2000);
    } catch (e) {
      setMessage('Avatar upload failed');
      setTimeout(() => setMessage(null), 2500);
    }
  }

  const skillChips = useMemo(
    () =>
      skills.map((s) => (
        <span key={s} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-sm mr-2 mb-2">
          {s}
          <button
            onClick={() => setSkills(skills.filter((x) => x !== s))}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </span>
      )),
    [skills]
  );

  return (
    <>
      <Head>
        <title>Profile - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
          {isLoading ? (
            <div className="animate-pulse h-32 bg-gray-200 rounded" />
          ) : (
            <div className="bg-white rounded shadow p-4">
              <div className="flex items-start gap-4">
                <div>
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No avatar</div>
                    )}
                  </div>
                  <label className="text-sm block">
                    <span className="sr-only">Choose avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && onAvatarChange(e.target.files[0])}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      value={user?.name || ''}
                      readOnly
                      className="w-full border rounded px-3 py-2 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Name is currently read-only.</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Skills</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && skillInput.trim()) {
                            e.preventDefault();
                            if (!skills.includes(skillInput.trim()))
                              setSkills([...skills, skillInput.trim()]);
                            setSkillInput('');
                          }
                        }}
                        placeholder="Type a skill and press Enter"
                        className="flex-1 border rounded px-3 py-2"
                      />
                      <button
                        onClick={() => {
                          if (!skillInput.trim()) return;
                          if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
                          setSkillInput('');
                        }}
                        className="px-3 py-2 bg-gray-800 text-white rounded"
                      >
                        Add
                      </button>
                    </div>
                    <div>{skillChips}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub</label>
                      <input
                        value={social.github || ''}
                        onChange={(e) => setSocial({ ...social, github: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn</label>
                      <input
                        value={social.linkedin || ''}
                        onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Portfolio</label>
                      <input
                        value={social.portfolio || ''}
                        onChange={(e) => setSocial({ ...social, portfolio: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onSave}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save changes'}
                    </button>
                    {message && <span className="text-sm text-gray-600">{message}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}


