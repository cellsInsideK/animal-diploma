import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/schema.ts",
  out: './server/database/migrations',
  dbCredentials: {
    database: "postgres",
    port: 5432,
    host: "aws-0-eu-central-1.pooler.supabase.com",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  schemaFilter: ["public"],
});