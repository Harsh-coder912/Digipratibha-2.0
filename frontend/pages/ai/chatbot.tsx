import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

type Msg = { role: 'user' | 'bot'; content: string };

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('ai_chatbot_msgs');
      return raw ? (JSON.parse(raw) as Msg[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_chatbot_msgs', JSON.stringify(messages));
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }, { role: 'bot', content: '...' }]);
    setLoading(true);
    try {
      const res = await api.chatbot(text);
      // typing effect
      const answer = res.answer || 'Sorry, I do not have that information.';
      await typeInto(answer);
    } finally {
      setLoading(false);
    }
  }

  function typeInto(text: string): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        setMessages((prev) => {
          const copy = [...prev];
          // replace last bot placeholder
          const idx = copy.findIndex((x, j) => x.role === 'bot' && x.content === '...' && j === copy.length - 1);
          if (idx >= 0) copy[idx] = { role: 'bot', content: text.slice(0, i) };
          return copy;
        });
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, 10);
    });
  }

  return (
    <>
      <Head>
        <title>AI Chatbot - DigiPratibha</title>
      </Head>
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-3xl w-full mx-auto p-4 flex-1 flex flex-col">
          <h1 className="text-2xl font-bold mb-4">College Assistant</h1>
          <div className="flex-1 overflow-y-auto bg-white rounded shadow p-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`mb-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'} px-3 py-2 rounded max-w-[80%] whitespace-pre-wrap`}>{m.content}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="mt-3 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? send() : undefined} placeholder="Ask about admissions, courses, campus..." className="flex-1 border rounded px-3 py-2" />
            <button onClick={send} className="px-4 py-2 bg-gray-900 text-white rounded">Send</button>
            {loading && <LoadingSpinner />}
          </div>
        </div>
      </main>
    </>
  );
}



