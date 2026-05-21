# ESTORE Database Setup

This project currently uses **SQLite** for easy development and demonstration. To switch to **PostgreSQL** (as requested), follow these steps:

## 1. Update `schema.prisma`

Change the `datasource` block in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 2. Update `.env`

Replace the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/estore?schema=public"
```

If you are using a free provider like **Supabase**, **Neon**, or **Railway**, they will provide this URL for you.

## 3. Run Migrations

After changing the provider, run:

```bash
npx prisma migrate dev --name init
```

## 4. Seed Data (Optional)

To populate your PostgreSQL database with the initial product data:

```bash
node prisma/seed.js
```

---

## Backend API

The project includes API routes located in `src/app/api/products/route.ts`. 

- `GET /api/products`: Fetches all products.
- `POST /api/products`: Creates a new product.

You can use these to build admin dashboards or integrate with external services.
