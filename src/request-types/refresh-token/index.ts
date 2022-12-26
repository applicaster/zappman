import { z } from "zod";

export const bodySchema = z.object({
  refresh_token: z.string()
});

export const defaultRequest = {
  requestType: "refreshToken",
  title: "Refresh Token",
  headers: [
    { key: "Content-Type", value: "application/json" },
    {},
    {},
    {},
    {},
    {},
  ],
  method: "POST",
  body: JSON.stringify(
    {
      refresh_token: "token",
    },
    null,
    2
  ),
};


export const responseSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
  })
  .or(
    z.object({
      formError: z.string().optional(),
      fieldErrors: z.object({}).optional(),
    })
  );
