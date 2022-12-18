import { z } from "zod";

export const bodySchema = z.object({
  email: z.string().email().default("<USER_PASSWORD>"),
  password: z.string().default("<USER_EMAIL>"),
});

export const responseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});