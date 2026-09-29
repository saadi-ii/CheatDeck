import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(8),
  ADMIN_PASSWORD: z.string().min(1),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  // Shared with the frontend; when unset, the frontend is not pinged after saves.
  REVALIDATE_SECRET: z.string().min(8).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`);
  console.error(`Invalid environment variables:\n${problems.join("\n")}`);
  process.exit(1);
}

export const env = parsed.data;
