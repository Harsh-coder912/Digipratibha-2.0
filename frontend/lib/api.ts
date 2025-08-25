const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getAuthHeaders() {
  if (typeof window === 'undefined') return {} as Record<string, string>;
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error('Request failed');
  return (await res.json()) as T;
}

export const api = {
  // Health
  health: async (): Promise<boolean> => {
    try {
      const data = await request<{ ok: boolean }>('/health');
      return data.ok;
    } catch {
      return false;
    }
  },

  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(body) }
    ),
  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(body) }
    ),

  // User profile
  getMe: () =>
    request<{ user: any }>('/users/me', { headers: { ...getAuthHeaders() } }),
  updateProfile: (body: {
    bio?: string;
    skills?: string[];
    socialLinks?: { github?: string; linkedin?: string; portfolio?: string };
  }) =>
    request<{ user: any }>('/users/me', {
      method: 'PUT',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  uploadAvatar: (fileBase64: string) =>
    request<{ url: string }>('/users/me/avatar', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify({ file: fileBase64 }),
    }),

  // Uploads
  uploadDocument: (params: { file: string; fileName?: string; mimeType?: string; folder?: string }) =>
    request<{ url: string; public_id: string }>('/uploads/documents', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(params),
    }),

  // Portfolio CRUD helpers
  listEducation: () => request<{ items: any[] }>(
    '/portfolio/education',
    { headers: { ...getAuthHeaders() } }
  ),
  createEducation: (body: any) =>
    request<{ item: any }>('/portfolio/education', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  updateEducation: (id: string, body: any) =>
    request<{ item: any }>(`/portfolio/education/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  deleteEducation: (id: string) =>
    request<{ ok: boolean }>(`/portfolio/education/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  listProjects: () => request<{ items: any[] }>(
    '/portfolio/projects',
    { headers: { ...getAuthHeaders() } }
  ),
  createProject: (body: any) =>
    request<{ item: any }>('/portfolio/projects', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  updateProject: (id: string, body: any) =>
    request<{ item: any }>(`/portfolio/projects/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  deleteProject: (id: string) =>
    request<{ ok: boolean }>(`/portfolio/projects/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  listCertifications: () => request<{ items: any[] }>(
    '/portfolio/certifications',
    { headers: { ...getAuthHeaders() } }
  ),
  createCertification: (body: any) =>
    request<{ item: any }>('/portfolio/certifications', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  updateCertification: (id: string, body: any) =>
    request<{ item: any }>(`/portfolio/certifications/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  deleteCertification: (id: string) =>
    request<{ ok: boolean }>(`/portfolio/certifications/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  listSkills: () => request<{ items: any[] }>(
    '/portfolio/skills',
    { headers: { ...getAuthHeaders() } }
  ),
  createSkill: (body: any) =>
    request<{ item: any }>('/portfolio/skills', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  deleteSkill: (id: string) =>
    request<{ ok: boolean }>(`/portfolio/skills/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  listAchievements: () => request<{ items: any[] }>(
    '/portfolio/achievements',
    { headers: { ...getAuthHeaders() } }
  ),
  createAchievement: (body: any) =>
    request<{ item: any }>('/portfolio/achievements', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  updateAchievement: (id: string, body: any) =>
    request<{ item: any }>(`/portfolio/achievements/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders() },
      body: JSON.stringify(body),
    }),
  deleteAchievement: (id: string) =>
    request<{ ok: boolean }>(`/portfolio/achievements/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  // Public profile and search
  getPublicProfile: (username: string) =>
    request<{ user: any; portfolio: any }>(`/users/${username}/public`),
  searchUsers: (skill: string) => request<{ users: any[] }>(`/search?skill=${encodeURIComponent(skill)}`),

  // Admin
  getUsers: () => request<{ users: any[]; stats: any }>(
    '/admin/users',
    { headers: { ...getAuthHeaders() } }
  ),
  deleteUser: (id: string) =>
    request<{ ok: boolean }>(`/admin/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  // AI features
  careerRecommendation: (body: { skills: string[]; interests: string[]; educationLevel: string }) =>
    request<{ recommendedCareers: Array<{ title: string; description: string; requiredSkills: string[]; learningPath: string[] }> }>(
      '/ai/career-recommendation',
      { method: 'POST', headers: { ...getAuthHeaders() }, body: JSON.stringify(body) }
    ),
  aiSearch: (query: string) =>
    request<{ results: any[] }>(`/ai/search?query=${encodeURIComponent(query)}`, { headers: { ...getAuthHeaders() } }),
  chatbot: (question: string) =>
    request<{ answer: string }>(
      '/ai/chatbot',
      { method: 'POST', body: JSON.stringify({ question }), headers: { 'Content-Type': 'application/json' } }
    ),
  analyzeProject: (body: { projectTitle: string; description: string }) =>
    request<{ strengths: string[]; weaknesses: string[]; suggestions: string[] }>(
      '/ai/analyze-project',
      { method: 'POST', headers: { ...getAuthHeaders() }, body: JSON.stringify(body) }
    ),
  adminAISummary: () => request<{ summary: string }>(
    '/admin/ai-summary',
    { headers: { ...getAuthHeaders() } }
  ),
};


