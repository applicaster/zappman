import { z } from "zod";

export const bodySchema = z.object({
  email: z.string().email().default("user@exaple.com"),
  password: z.string().default("password"),
});

export const responseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

export const headersSchema = z.object({
  "Content-Type": z.literal("application/json").default("application/json")
})
