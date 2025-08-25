import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - DigiPratibha</title>
      </Head>
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {!token && (
              <p className="text-red-700">Not logged in. <Link className="text-blue-600" href="/login">Login</Link></p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/profile" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Profile</div>
              <div className="text-sm text-gray-600">Edit your name, bio, skills, and avatar.</div>
            </Link>
            <Link href="/dashboard/education" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Education</div>
              <div className="text-sm text-gray-600">Manage your education entries.</div>
            </Link>
            <Link href="/dashboard/projects" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Projects</div>
              <div className="text-sm text-gray-600">Showcase projects with rich descriptions.</div>
            </Link>
            <Link href="/dashboard/certifications" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Certifications</div>
              <div className="text-sm text-gray-600">Add certificates and issuers.</div>
            </Link>
            <Link href="/dashboard/skills" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Skills</div>
              <div className="text-sm text-gray-600">Manage skill tags.</div>
            </Link>
            <Link href="/dashboard/achievements" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Achievements</div>
              <div className="text-sm text-gray-600">Add awards and milestones.</div>
            </Link>
            <Link href="/dashboard/uploads" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Uploads</div>
              <div className="text-sm text-gray-600">Upload images and documents.</div>
            </Link>
            <Link href="/admin" className="block p-4 bg-white rounded shadow hover:shadow-md">
              <div className="font-semibold mb-1">Admin</div>
              <div className="text-sm text-gray-600">User management and analytics.</div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}


