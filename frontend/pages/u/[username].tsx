import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { api } from '../../lib/api';

export default function PublicProfilePage() {
  const router = useRouter();
  const username = (router.query.username as string) || '';
  const { data, isLoading } = useSWR(() => (username ? `public:${username}` : null), () => api.getPublicProfile(username));
  const user = data?.user;
  const portfolio = data?.portfolio;

  return (
    <>
      <Head>
        <title>{user ? `${user.name} - Portfolio` : 'Portfolio'} - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse h-40 bg-gray-200 rounded" />
          ) : user ? (
            <>
              <div className="bg-white rounded shadow p-6 flex items-start gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {user.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No avatar</div>}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-600 mt-1">{user.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(user.skills || []).map((s: string) => (
                      <span key={s} className="px-2 py-1 bg-gray-100 rounded text-sm">{s}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-4 text-sm">
                    {user.socialLinks?.github && (<a className="text-blue-600" href={user.socialLinks.github} target="_blank" rel="noreferrer">GitHub</a>)}
                    {user.socialLinks?.linkedin && (<a className="text-blue-600" href={user.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>)}
                    {user.socialLinks?.portfolio && (<a className="text-blue-600" href={user.socialLinks.portfolio} target="_blank" rel="noreferrer">Website</a>)}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6">
                <Section title="Education">
                  {(portfolio?.education || []).map((it: any) => (
                    <Card key={it._id} title={it.school} subtitle={it.degree} description={it.description} />
                  ))}
                </Section>
                <Section title="Projects">
                  {(portfolio?.projects || []).map((it: any) => (
                    <Card key={it._id} title={it.title} subtitle={it.link} description={it.description} />
                  ))}
                </Section>
                <Section title="Certifications">
                  {(portfolio?.certifications || []).map((it: any) => (
                    <Card key={it._id} title={it.name} subtitle={it.issuer} description={it.description} />
                  ))}
                </Section>
                <Section title="Achievements">
                  {(portfolio?.achievements || []).map((it: any) => (
                    <Card key={it._id} title={it.title} subtitle={(it.date || '').slice(0,10)} description={it.description} />
                  ))}
                </Section>
              </div>
            </>
          ) : (
            <div className="text-gray-600">User not found.</div>
          )}
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Card({ title, subtitle, description }: { title: string; subtitle?: string; description?: string }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
      {description && <div className="prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: description }} />}
    </div>
  );
}


