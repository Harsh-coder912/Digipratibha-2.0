import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const res = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding as unknown as number[];
}

export async function generateCareerRecommendations(input: {
  skills: string[];
  interests: string[];
  educationLevel: string;
}): Promise<Array<{ title: string; description: string; requiredSkills: string[]; learningPath: string[] }>> {
  const prompt = `Given the user's profile:\nSkills: ${input.skills.join(', ')}\nInterests: ${input.interests.join(', ')}\nEducation level: ${input.educationLevel}\nSuggest 5 relevant career paths in JSON with fields: title, description, requiredSkills[], learningPath[] (short, actionable).`;
  const chat = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful career advisor. Output valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });
  const content = chat.choices[0]?.message?.content || '[]';
  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return [];
  }
}

export async function analyzeProjectIdea(input: { projectTitle: string; description: string }): Promise<{ strengths: string[]; weaknesses: string[]; suggestions: string[] }> {
  const prompt = `Analyze the following project idea and return JSON with fields strengths[], weaknesses[], suggestions[]:\nTitle: ${input.projectTitle}\nDescription: ${input.description}`;
  const chat = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert software reviewer. Output valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
  });
  const content = chat.choices[0]?.message?.content || '{}';
  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return { strengths: [], weaknesses: [], suggestions: [] };
  }
}

export async function chatbotAnswer(question: string, kb: Array<{ q: string; a: string }>): Promise<string> {
  const found = kb.find((x) => question.toLowerCase().includes(x.q.toLowerCase()));
  if (found) return found.a;
  const chat = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful college information assistant.' },
      { role: 'user', content: question },
    ],
    temperature: 0.3,
  });
  return chat.choices[0]?.message?.content || 'Sorry, I do not have that information.';
}

export async function summarizeAdminStats(stats: { users: number; projects: number; feedback: number; last7Days?: { users: number; projects: number } }): Promise<string> {
  const text = `Users: ${stats.users}, Projects: ${stats.projects}, Feedback: ${stats.feedback}, Last7Days: users=${stats.last7Days?.users || 0}, projects=${stats.last7Days?.projects || 0}`;
  const chat = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You write one-paragraph concise analytics insights for admins.' },
      { role: 'user', content: `Summarize these platform stats in plain English: ${text}` },
    ],
    temperature: 0.2,
  });
  return chat.choices[0]?.message?.content || '';
}
