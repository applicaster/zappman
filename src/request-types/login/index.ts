import { z } from "zod";

export const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const defaultRequest = {
  requestType: "login",
  title: "Login",
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
      email: "user@example.com",
      password: "password",
    },
    null,
    2
  ),
};

// export const defaultBody = {
//   email: "user@example.com",
//   password: "password",
// };

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

