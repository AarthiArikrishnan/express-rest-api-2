# CRUD-TypeScript

Small Express + TypeScript REST API example.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URL` and optional `PORT` and `AUTH_SECRET`.
2. Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Notes

- Secrets should be provided via environment variables in production.
- The project uses Mongoose for MongoDB models.
- Authentication uses HMAC-based hashing; consider switching to bcrypt/argon2 for production.

Project structure (important files)

- `src/index.ts` - app bootstrap and middleware wiring
- `src/config/db.ts` - MongoDB connection
- `src/models/` - Mongoose schemas (`user.model.ts`)
- `src/services/` - business logic / DB access (`user.service.ts`, `auth.service.ts`)
- `src/controllers/` - HTTP handlers
- `src/router/` - route registration
- `src/middlewares/` - auth, validation, error handling, logging
- `src/validation/` - Zod schemas for request validation

Environment variables

- `MONGO_URL` (required) - MongoDB connection string
- `PORT` (optional) - port to run the server (default `4000`)
- `AUTH_SECRET` (optional) - secret used in HMAC hashing (provide in production)
- `LOG_LEVEL` (optional) - pino log level (`info` by default)

API examples

- Register:

```bash
curl -i -X POST http://localhost:4000/auth/register \
	-H "Content-Type: application/json" \
	-d '{"email":"a@b.com","username":"alice","password":"secret12"}'
```

- Login (returns cookie `ANTONIO-AUTH`):

```bash
curl -i -X POST http://localhost:4000/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"a@b.com","password":"secret12"}'
```

- Get current user (`/me`) — requires cookie from login:

```bash
curl -i http://localhost:4000/me --cookie "ANTONIO-AUTH=THE_COOKIE_VALUE"
```

Validation & Logging

- Request validation is implemented with `zod`; validation middleware is in `src/middlewares/validate.middleware.ts`.
- Structured logging uses `pino` and request logging is handled by `pino-http`.

Next steps / Suggestions

- Replace HMAC-based password storage with `bcrypt` or `argon2` for production.
- Add integration tests and CI pipeline.
- Add role-based access or token-based auth (JWT) if needed.
