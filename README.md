# Hapas Admin Dashboard

Welcome to the Hapas Admin Dashboard. This is a Next.js application for managing your handbag store.

## Quick Start

1. Install dependencies:
```bash
pnpm install
```

2. Set up your database:
- Create a PostgreSQL database
- Update DATABASE_URL in .env.local

3. Run migrations:
```bash
pnpm prisma migrate dev
```

4. Start the development server:
```bash
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma generate` - Generate Prisma client

## Folder Structure

- `app/` - Next.js app router pages
- `components/` - Reusable UI components
- `lib/` - Utility functions and libraries
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets

## Environment Variables

Create a `.env.local` file with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/hapas?schema=public
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## API Authentication

All API routes are protected with JWT authentication. There are two types of users:
1. Admin users (store administrators)
2. Customer users (store customers)

See [API Authentication Documentation](./docs/api-auth.md) for details on how to implement and use JWT protection for API routes.