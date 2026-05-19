# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Start Commands

```bash
# Root: start both frontend (port 3000) and backend (port 4000) concurrently
npm run dev

# Frontend only
npm run dev --workspace=frontend

# Backend only
npm run dev --workspace=backend

# Build everything
npm run build

# Seed database with initial data
npm run seed --workspace=backend

# Format/lint
npm run lint --workspace=frontend
```

---

## Architecture Overview

### Monorepo Structure

**Root `package.json`** defines workspaces (`frontend`, `backend`) and uses `concurrently` to run both dev servers.

```
Western-Lodge-Website/
├── frontend/           # Next.js 16.2.6 App Router + TypeScript + Tailwind v4
├── backend/            # Express 5 + TypeScript + Prisma + Resend
├── package.json        # Workspaces + concurrently
└── .env.example        # All environment variables documented
```

### Frontend Architecture

**Tech Stack**: Next.js 16 (App Router) | React 19 | TypeScript | Tailwind v4 | Framer Motion | shadcn/ui

**Data Flow**:
1. Server Component (`page.tsx`) fetches data from backend via `api.ts` wrappers
2. Data passed as props to Client Component section components
3. Each section is a Client Component (marked with `"use client"`) for interactivity
4. `useBookingModal` context handles modal state (open/close triggered from multiple sections)

**File Organization**:
- `src/app/` — Pages, root layout (fonts), globals.css
- `src/components/sections/` — Major page sections (Hero, About, Rooms, Gallery, etc.) — all Client Components
- `src/components/layout/` — Navbar, Footer
- `src/components/booking/` — BookingForm, BookingModal, BookingSuccess
- `src/components/animations/` — Framer Motion wrappers
- `src/components/ui/` — Reusable cards (RoomCard, TestimonialCard, AttractionCard, AmenityItem, GalleryGrid, SectionHeading)
- `src/lib/` — API wrapper functions, constants, utilities, custom hooks
- `src/types/` — TypeScript interfaces + Zod schemas

### Backend Architecture

**Tech Stack**: Express 5 | TypeScript | Prisma ORM | PostgreSQL | Resend (email)

**API Structure**:
- `src/routes/` — 6 endpoint groups (inquiries, rooms, gallery, testimonials, contact, plus health check)
- `src/services/` — email, inquiry, contact logic
- `src/middleware/` — validation, auth (x-admin-secret header), error handling
- `src/types/` — Zod schemas and TypeScript types
- `prisma/schema.prisma` — 5 models (BookingInquiry, Room, GalleryItem, Testimonial, ContactSubmission)
- `prisma/seed.ts` — Upsert seed data for development/testing

---

## Critical Implementation Details

### 1. **Tailwind CSS v4 — CSS-first with @theme**

Tailwind v4 moved to CSS-first configuration. **All design tokens are defined in `frontend/src/app/globals.css` inside an `@theme` block**, not in a `tailwind.config.ts`:

```css
@import "tailwindcss";

@theme {
  /* Color scales, fonts, shadows, animations, etc. */
  --font-weight-500: 500;
  --font-weight-600: 600;
  --font-weight-700: 700;
  --font-weight-800: 800;
  /* ... more tokens ... */
}
```

**Important**: Font weights MUST be explicitly defined in `@theme` for utilities like `font-600`, `font-700`, `font-800` to work. This is non-obvious and was a critical bug in earlier iterations.

**Do NOT create or modify `tailwind.config.ts`** — it will be ignored. All configuration goes in `globals.css`.

### 2. **Zod v3 — Locked in Frontend**

Frontend `package.json` pins `"zod": "3"` (exact version). This is because `@hookform/resolvers@5.2.2` is incompatible with Zod v4.

**Do NOT upgrade Zod in frontend.** Backend uses `zod@^3.23.8`, which is fine (semver). Frontend must stay at exact v3.

### 3. **Server Components by Default, "use client" for Interactivity**

- `page.tsx` is a Server Component — fetches data asynchronously, no `"use client"`
- Section components (Hero, Rooms, Gallery, Contact, Booking sections) are Client Components — marked with `"use client"` at top
- UI components (cards, buttons, modals) are also Client Components
- This hybrid approach lets us fetch data server-side and hydrate client-side components

### 4. **useBookingModal Context**

Booking modal state is managed via React Context (`useBookingModal` hook). Triggered from:
- Navbar "Book Now" button
- Hero CTA buttons
- RoomCard "Book This Room"
- BookingCtaSection "Reserve Now"
- ContactSection link

Location: `frontend/src/lib/hooks/useBookingModal.ts` — wraps page.tsx with `<BookingModalProvider>`.

### 5. **API Wrapper Functions**

`frontend/src/lib/api.ts` provides typed fetch wrappers for all backend endpoints. Includes error handling and static fallbacks:

```typescript
export const api = {
  getRooms: () => fetch(...).then(...).catch(() => STATIC_ROOMS),
  getGallery: () => fetch(...).catch(() => STATIC_GALLERY),
  submitInquiry: (data) => fetch("POST /api/inquiries", ...),
  // ... etc
};
```

**If backend is offline**, page.tsx catches errors and uses `STATIC_ROOMS`, `STATIC_GALLERY` from `constants.ts`. Site remains functional without backend.

### 6. **Images — Local Only, No External URLs**

All images are stored in `frontend/public/` and referenced as public URLs `/filename.png`.

**Do NOT use Unsplash or external CDNs.** Current seed data uses `/western-lodge.png` for all placeholder images. When real images are available, replace in:
- `frontend/src/lib/constants.ts` — `STATIC_ROOMS` image arrays, `STATIC_GALLERY` URLs
- Backend `prisma/seed.ts` — Room.images and GalleryItem.url

### 7. **Email Service — Resend**

Backend uses Resend for transactional emails. Two emails per booking inquiry:
1. Guest confirmation (branded HTML, teal header, terracotta CTA)
2. Hotel notification (structured summary)

Email templates are in `backend/src/services/email.service.ts`. Requires `RESEND_API_KEY` in backend `.env`.

### 8. **Admin Secret Auth**

GET `/api/inquiries` requires `x-admin-secret` header. Set in `ADMIN_SECRET` env var. Checked in `backend/src/middleware/auth.middleware.ts`.

---

## Component Hierarchy & Patterns

### Sections (Client Components)
Each page section is a Client Component that receives data as props:

- **HeroSection** — Full-screen hero with video background + overlays + dual CTAs
- **AboutSection** — Asymmetric 2-column (parallax image + story)
- **RoomsSection** — Grid of RoomCards, staggered animation
- **AmenitiesSection** — 6-item glassmorphic grid
- **GallerySection** — Bento grid (6 items with varied aspect ratios + lightbox)
- **TestimonialsSection** — Carousel (Embla) of TestimonialCards
- **AttractionsSection** — 4 AttractionCards grid
- **BookingCtaSection** — Full-width CTA with parallax image
- **ContactSection** — 2-column (contact info + contact form)

### UI Components
Reusable, props-driven components:
- **RoomCard** — Room image, amenities, price badge, type badge, CTA button
- **TestimonialCard** — Star rating, quote, guest avatar, name/location
- **AttractionCard** — Icon, name, description, distance badge
- **AmenityItem** — Icon + label
- **GalleryGrid** — 6-item bento layout with Framer Motion + lightbox
- **SectionHeading** — Eyebrow (with decorative lines) + title + subtitle
- **MapEmbed** — Google Maps iframe wrapper

### Animations
All Framer Motion variants are centralized in `frontend/src/components/animations/variants.ts`:
- `fadeInUp`, `fadeInLeft`, `fadeInRight` — scroll-triggered via `whileInView`
- `staggerContainer` + `staggerItem` — for grids/lists
- `cardHover` — scale + shadow on hover
- `modalBackdrop` + `modalPanel` — backdrop blur + spring entrance
- `successCheck` — SVG pathLength animation for success confirmation

Wrappers: `FadeInUp`, `StaggerContainer`, `ParallaxWrapper` for common patterns.

---

## Data Models & Validation

### Frontend Zod Schemas
`frontend/src/types/index.ts`:
- `BookingInquiryClientSchema` — Form validation (name, email, phone, checkIn, checkOut, roomType, guests, specialRequests)

### Backend Prisma Models
`backend/prisma/schema.prisma`:
- **BookingInquiry** — Stores guest booking inquiries (status: PENDING/CONFIRMED/CANCELLED)
- **Room** — Hotel rooms (type: STANDARD/DELUXE/SUITE)
- **GalleryItem** — Gallery photos (category: ROOMS/AMENITIES/EXTERIOR/DINING/SURROUNDINGS)
- **Testimonial** — Guest reviews (featured flag for homepage carousel)
- **ContactSubmission** — Contact form submissions

Enums: `RoomType`, `InquiryStatus`, `GalleryCategory`

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/western_lodge
PORT=4000
NODE_ENV=development
ADMIN_SECRET=your-secret-key-here
RESEND_API_KEY=re_xxxxxxxxxxxxx
HOTEL_EMAIL=info@westernhighwaylodge.com
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=optional-for-maps
```

All vars documented in root `.env.example`.

---

## Testing & Verification

### Backend Health Check
```bash
curl http://localhost:4000/health
```

### API Endpoints
```bash
# Get all rooms
curl http://localhost:4000/api/rooms

# Get gallery items
curl http://localhost:4000/api/gallery

# Get featured testimonials
curl http://localhost:4000/api/testimonials?featured=true

# Submit booking inquiry
curl -X POST http://localhost:4000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"09123456789","checkIn":"2025-06-01","checkOut":"2025-06-05","roomType":"STANDARD","guests":2}'

# Get inquiries (requires admin secret)
curl -H "x-admin-secret: your-secret" http://localhost:4000/api/inquiries
```

### Frontend Checks
- Visit `http://localhost:3000` — all sections render
- Scroll — navbar transitions from transparent to opaque
- Click "Reserve Now" — BookingModal opens with animation
- Submit booking form — success state shows animated checkmark
- Click gallery images — lightbox opens with full-screen image (no captions)
- Testimonials carousel — drag/swipe works on mobile
- Contact form — submit triggers toast notification
- Responsive breakpoints — test at 375px (mobile), 768px (tablet), 1280px (desktop), 1920px+ (ultrawide)

---

## Common Workflows

### Adding a New Section
1. Create Client Component in `frontend/src/components/sections/SectionName.tsx` with `"use client"` directive
2. Accept data as prop from `page.tsx`
3. Use `FadeInUp`, `StaggerContainer`, Framer Motion for animations
4. Import and render in `page.tsx`

### Updating Gallery
1. Add images to `frontend/public/`
2. Update `STATIC_GALLERY` in `frontend/src/lib/constants.ts`
3. Seed database: update `backend/prisma/seed.ts` with real gallery URLs
4. Backend endpoint returns data; frontend falls back to STATIC_GALLERY if backend offline

### Adding a New API Route
1. Create Zod schema in `backend/src/types/index.ts`
2. Create route handler in `backend/src/routes/newfeature.route.ts`
3. Import and register in `backend/src/routes/index.ts`
4. Add API wrapper in `frontend/src/lib/api.ts`
5. Use in frontend components

### Updating Design Tokens
1. Edit `frontend/src/app/globals.css` — add/modify colors, fonts, shadows in `@theme` block
2. Use new tokens via Tailwind utilities (e.g., `text-teal-500`, `shadow-glow-teal`)
3. No `tailwind.config.ts` changes needed

---

## Known Constraints

- **Zod v3 locked in frontend** — do not upgrade (hookform resolver incompatibility)
- **Font weights in globals.css** — must be explicitly defined in `@theme` for utilities to work
- **No external image CDNs** — all images local to `frontend/public/`
- **Tailwind v4 CSS-first** — configuration goes in `globals.css`, not config file
- **Backend offline gracefully** — frontend uses static fallbacks in `constants.ts`
- **Admin endpoints require header** — GET `/api/inquiries` requires `x-admin-secret`

---

## Deployment Notes

**Frontend → Vercel:**
- Connect GitHub repo
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Auto-deploys on push

**Backend → Railway / Render:**
- Add PostgreSQL addon
- Set all environment variables
- Build: `npm run build`
- Start: `npm start`
- Run migrations: `npx prisma migrate deploy`
- Seed: `npm run seed` (optional, for initial data)

---

## Key Files to Know

| File | Purpose |
|---|---|
| `frontend/src/app/globals.css` | Design tokens (@theme), keyframes |
| `frontend/src/app/page.tsx` | Server Component, fetches data, renders sections |
| `frontend/src/lib/api.ts` | Typed API wrapper functions |
| `frontend/src/lib/constants.ts` | Static fallback data (rooms, gallery) |
| `frontend/src/lib/hooks/useBookingModal.ts` | Modal state context |
| `backend/src/app.ts` | Express app setup (middleware, routes) |
| `backend/src/index.ts` | Server startup |
| `backend/prisma/schema.prisma` | Database models |
| `backend/prisma/seed.ts` | Development data seed |

---

## Quick References

- **Next.js 16 Docs**: Read `/node_modules/next/dist/docs/` — breaking changes from prior versions
- **Tailwind v4 CSS-first**: https://tailwindcss.com/docs/v4 — all config in CSS
- **Framer Motion**: Variants defined in `frontend/src/components/animations/variants.ts`
- **shadcn/ui**: Pre-installed components: button, input, textarea, select, dialog, etc.
- **Resend Email**: https://resend.com/docs — email service API docs
