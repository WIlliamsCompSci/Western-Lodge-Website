# Western Highway Lodge

Website for Western Highway Lodge in Samar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Validation | Zod |
| Email | Resend |

---

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- A [Resend](https://resend.com) account + API key

---

## Local Development Setup

### 1. Clone & install root dependencies

```bash
git clone <repo-url>
cd Western-Lodge-Website
npm install
```

### 2. Configure environment

```bash
# Backend
cp .env.example backend/.env
# Edit backend/.env with your database credentials, RESEND_API_KEY, etc.

# Frontend
cp .env.example frontend/.env.local
# Edit frontend/.env.local with NEXT_PUBLIC_API_URL etc.
```

### 3. Set up the database

```bash
cd backend
npx prisma migrate dev --name init
npm run seed
cd ..
```

### 4. Start both servers

```bash
# From the root directory — starts frontend (port 3000) and backend (port 4000) concurrently
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
Western-Lodge-Website/
├── frontend/              # Next.js App Router frontend
│   └── src/
│       ├── app/           # Pages, layout, globals.css
│       ├── components/    # sections/, layout/, booking/, animations/, ui/
│       ├── lib/           # api.ts, utils.ts, constants.ts, hooks/
│       └── types/         # TypeScript interfaces + Zod schemas
│
├── backend/               # Express + TypeScript API
│   ├── src/
│   │   ├── routes/        # inquiries, rooms, gallery, testimonials, contact
│   │   ├── middleware/    # validate, auth, errorHandler
│   │   ├── services/      # email, inquiry, contact
│   │   └── lib/           # prisma singleton
│   └── prisma/
│       ├── schema.prisma  # Database models
│       └── seed.ts        # Initial data seed
│
├── .env.example           # Environment variable template
├── .gitignore
└── README.md
```

---

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `PORT` | `backend/.env` | API server port (default: 4000) |
| `NODE_ENV` | `backend/.env` | `development` or `production` |
| `ADMIN_SECRET` | `backend/.env` | Header secret for admin endpoints |
| `RESEND_API_KEY` | `backend/.env` | Resend API key for emails |
| `HOTEL_EMAIL` | `backend/.env` | Hotel email for booking notifications |
| `CORS_ORIGIN` | `backend/.env` | Allowed frontend origin |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | `frontend/.env.local` | Frontend base URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | `frontend/.env.local` | Google Maps embed key (optional) |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | Health check |
| `GET` | `/api/rooms` | — | List all rooms |
| `GET` | `/api/gallery` | — | Gallery items (`?category=ROOMS`) |
| `GET` | `/api/testimonials` | — | Testimonials (`?featured=true`) |
| `POST` | `/api/inquiries` | — | Submit booking inquiry |
| `GET` | `/api/inquiries` | `x-admin-secret` | List booking inquiries |
| `POST` | `/api/contact` | — | Submit contact form |

---

## Deployment

**Frontend → Vercel**
1. Connect your GitHub repo to Vercel
2. Set `NEXT_PUBLIC_API_URL` to your production backend URL
3. Deploy

**Backend → Railway / Render**
1. Add PostgreSQL add-on
2. Set all backend environment variables
3. Add build command: `npm run build`
4. Add start command: `npm start`
5. Run migrations: `npx prisma migrate deploy`

---

## License

MIT
