# Aura Chat

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/alexandergillie/aura-minimalist-edge-chat)]](https://deploy.workers.cloudflare.com/?url=${repositoryUrl})

A full-stack, real-time chat application powered by Cloudflare Workers. Features user management, chat boards, and message persistence using Durable Objects for scalable, zero-cold-start state management. Built with modern React frontend and type-safe TypeScript throughout.

## ✨ Features

- **User Management**: Create, list, update, and delete users via REST API.
- **Chat Boards**: Create chat rooms with titles; list, delete, and manage multiple boards.
- **Real-time Messaging**: Send and retrieve messages per chat board with timestamp support.
- **Indexed Listing**: Efficient pagination for users and chats using prefix indexes.
- **Responsive UI**: Modern, accessible design with shadcn/ui components, Tailwind CSS, and dark mode.
- **Type-Safe API**: Shared types between frontend and backend; optimistic updates with TanStack Query.
- **Production-Ready**: CORS, error handling, logging, health checks, and client error reporting.
- **Scalable Storage**: All data in a single Durable Object namespace (GlobalDurableObject) with CAS for concurrency.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router, Zustand, Framer Motion, Sonner (toasts), Lucide icons.
- **Backend**: Cloudflare Workers, Hono (routing), Durable Objects (storage & indexes), Workers Types.
- **Build Tools**: Bun (fast installs/scripts), Wrangler (deployment), Vitest-ready.
- **UI/UX**: Headless UI (Radix), Class Variance Authority (CVA), Tailwind Merge, Immer.
- **Data**: Shared TypeScript types, mock seed data for instant demos.

## 🚀 Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh) installed.
   - [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/install/) CLI logged in (`wrangler login`).

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Run Locally**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`). Backend APIs at `/api/*`.

4. **Type Generation** (for IntelliSense):
   ```bash
   bun cf-typegen
   ```

## 🧪 Development

- **Development Server**: `bun dev` (frontend + worker proxy).
- **Build for Production**: `bun build` (outputs to `dist/`).
- **Preview Build**: `bun preview`.
- **Lint**: `bun lint`.
- **API Endpoints** (all `/api/*`):
  | Endpoint | Method | Description |
  |----------|--------|-------------|
  | `/api/users` | GET | List users (paginated) |
  | `/api/users` | POST | Create user `{ name: string }` |
  | `/api/users/:id` | DELETE | Delete user |
  | `/api/users/deleteMany` | POST | Delete multiple `{ ids: string[] }` |
  | `/api/chats` | GET/POST | List/create chats |
  | `/api/chats/:chatId/messages` | GET/POST | List/send messages |
  | `/api/chats/deleteMany` | POST | Delete multiple chats |
  | `/api/health` | GET | Health check |
  | `/api/client-errors` | POST | Report frontend errors |

- **Frontend Data Fetching**: Uses `api()` utility from `@/lib/api-client.ts` with TanStack Query.
- **Backend Customization**: Add routes in `worker/user-routes.ts`; entities in `worker/entities.ts`. Core utils (`worker/core-utils.ts`) handle storage/indexing.
- **Seed Data**: Auto-seeds users/chats on first API call.

Example API usage (curl):
```bash
# List users
curl http://localhost:3000/api/users

# Create chat
curl -X POST http://localhost:3000/api/chats -H "Content-Type: application/json" -d '{"title": "My Chat"}'

# Send message
curl -X POST http://localhost:3000/api/chats/c1/messages -H "Content-Type: application/json" -d '{"userId": "u1", "text": "Hello!"}'
```

## ☁️ Deployment

Deploy to Cloudflare Workers in one click:

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/alexandergillie/aura-minimalist-edge-chat)]](https://deploy.workers.cloudflare.com/?url=${repositoryUrl})

Or manually:

1. **Configure** `wrangler.jsonc` (name, bindings auto-set).
2. **Deploy**:
   ```bash
   bun deploy
   ```
   Deploys worker + static assets (SPA fallback for frontend).

3. **Custom Domain** (optional):
   ```bash
   wrangler pages domain add yourdomain.com
   ```

- **Observability**: Enabled by default (logs, metrics).
- **Migrations**: Durable Objects auto-migrate via `wrangler.jsonc`.
- **Costs**: Free tier generous; Durable Objects billed per GB-read/write.

## 🏗 Architecture

```
Frontend (React/Vite) → Worker (Hono) → GlobalDurableObject (Durable Object)
  ↓                           ↓                 ↓
SPA Assets             REST API          Storage/Index (SQLite-backed)
                       (Users/Chats)        per Entity (CAS + Prefix List)
```

- **Entities**: Extend `IndexedEntity` for auto-indexing/listing/deletes.
- **Concurrency**: CAS loops prevent races.
- **Single DO Namespace**: Efficient for many small entities.

## 🤝 Contributing

1. Fork & clone.
2. `bun install && bun dev`.
3. Add routes/entities/UI.
4. Test APIs; `bun lint`.
5. PR with clear description.

## 📄 License

MIT. See [LICENSE](LICENSE) (or create one).