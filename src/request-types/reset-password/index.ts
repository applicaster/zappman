import { z } from "zod";

export const bodySchema = z.object({
  email: z.string().email(),
});

export const defaultRequest = {
  requestType: "resetPassword",
  title: "Reset Password",
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
    },
    null,
    2
  ),
};

export const responseSchema = z.object({}).or(
  z.object({
    formError: z.string().optional(),
    fieldErrors: z.object({}).optional(),
  })
);
