import { FormEvent, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '../lib/api';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.register({ name, email, password });
      setMessage(`Registered as ${res.user.email}`);
      localStorage.setItem('token', res.token);
    } catch (err) {
      setMessage('Signup failed');
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - DigiPratibha</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-semibold">Sign Up</h1>
          <input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-green-600 text-white p-2 rounded" type="submit">Create account</button>
          <p className="text-sm text-gray-600">Have an account? <Link className="text-blue-600" href="/login">Login</Link></p>
          {message && <p className="text-sm">{message}</p>}
        </form>
      </main>
    </>
  );
}


