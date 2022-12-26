import { z } from "zod";

export const bodySchema = z.object({
  firstName: z.string(),
  lastName: z.string().default("lastName"),
  email: z.string().email().default("user@exaple.com"),
  password: z.string().default("password"),
  approveTermsOfUse: z.nullable(z.literal("on")).default("on"),
  approveMarketing: z.nullable(z.literal("on")).default("on"),
});

// export const defaultBody = {
//   firstName: "firstName",
//   lastName: "lastName",
//   email: "user@example.com",
//   password: "password",
//   approveTermsOfUse: "on",
//   approveMarketing: "on",
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

export const headersSchema = z.object({
  "Content-Type": z.literal("application/json").default("application/json"),
});

export const defaultRequest = {
  requestType: "register",
  title: "Register",
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
      firstName: "firstName",
      lastName: "lastName",
      email: "user@example.com",
      password: "password",
      approveTermsOfUse: "on",
      approveMarketing: "on",
    },
    null,
    2
  ),
};
