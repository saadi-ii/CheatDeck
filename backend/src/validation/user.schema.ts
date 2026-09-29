import { z } from "zod";

export const banSchema = z.object({ banned: z.boolean() });
