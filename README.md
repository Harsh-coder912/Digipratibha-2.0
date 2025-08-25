## DigiPratibha - Phase 1 Scaffold

Monorepo for a student digital-portfolio platform.

### Structure
- `frontend/`: Next.js + TypeScript + Tailwind
- `backend/`: Express + TypeScript + MongoDB (Mongoose)

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)
- MongoDB (local or Atlas)

### Quick Start (two terminals)
1) Backend
```
cd backend
npm install
cp .env.example .env
npm run dev
```

2) Frontend
```
cd frontend
npm install
cp .env.example .env
npm run dev
```

Optional single-line concurrently example (from repo root, if you have `concurrently` installed):
```
npx concurrently -k -n back,front -c green,blue "cd backend && npm run dev" "cd frontend && npm run dev"
```

### Environment Variables
- See `backend/.env.example` and `frontend/.env.example` for required keys.

### Sample Requests (Auth)
Register:
```
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Passw0rd!"}'
```

Login:
```
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Passw0rd!"}'
```

Health Check:
```
curl http://localhost:4000/api/health
```

### Acceptance Tests
- [ ] Backend boots on `http://localhost:4000` and `GET /api/health` returns `{ ok: true }`.
- [ ] Can register via `POST /api/auth/register` and receive JWT token.
- [ ] Can login via `POST /api/auth/login` and receive JWT token.
- [ ] Frontend boots on `http://localhost:3000` and landing shows health `OK`.
- [ ] Frontend login/signup pages submit and store token in `localStorage`.
- [ ] ESLint runs successfully in both `frontend` and `backend`.

### Notes
- TODO: add password reset, email verification, and profile endpoints.
- TODO: migrate to production-ready session/token storage and logging.

---

## Phase 2 Additions

### New Backend Endpoints
- `GET /api/users/me` – get current user (JWT)
- `PUT /api/users/me` – update profile (bio, skills, socialLinks)
- `POST /api/users/me/avatar` – upload avatar to Cloudinary
- `GET|POST|PUT|DELETE /api/portfolio/*` – CRUD for education, projects, certifications, skills, achievements
- `GET /api/users/:username/public` – public profile + portfolio (no secrets)
- `GET /api/search?skill=JavaScript` – search by skill
- `GET /api/admin/users` – admin list + stats (JWT admin)
- `DELETE /api/admin/users/:id` – admin delete user

### Env (Backend)
Add to `backend/.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Sample Requests (Phase 2)
- Me:
```
curl -H "Authorization: Bearer <TOKEN>" http://localhost:4000/api/users/me | jq
```
- Update profile:
```
curl -X PUT http://localhost:4000/api/users/me \
 -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
 -d '{"bio":"Hi","skills":["JS","TS"],"socialLinks":{"github":"https://github.com/me"}}'
```
- Upload avatar (base64):
```
curl -X POST http://localhost:4000/api/users/me/avatar \
 -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
 -d '{"file":"data:image/png;base64,<BASE64>"}'
```
- Portfolio create (project):
```
curl -X POST http://localhost:4000/api/portfolio/projects \
 -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
 -d '{"title":"My App","description":"...","techStack":["Next.js","Node"]}'
```
- Public profile:
```
curl http://localhost:4000/api/users/<username>/public | jq
```
- Search:
```
curl "http://localhost:4000/api/search?skill=JavaScript" | jq
```
- Admin list:
```
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:4000/api/admin/users | jq
```

### Phase-2 Acceptance Tests
- [ ] Can get/update profile via `/api/users/me` with JWT.
- [ ] Can upload avatar and receive URL.
- [ ] CRUD works for portfolio sections under `/api/portfolio/*`.
- [ ] Public profile endpoint returns non-sensitive data.
- [ ] Search by skill returns users.
- [ ] Admin routes protected by role and operable.


