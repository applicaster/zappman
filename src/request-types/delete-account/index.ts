import { z } from "zod";

export const defaultRequest = {
  requestType: "deleteAccount",
  title: "Delete Account",
  headers: [
    { key: "Content-Type", value: "application/json" },
    {},
    {},
    {},
    {},
    {},
  ],
  method: "POST",
  
};

export const responseSchema = z.object({}).or(
  z.object({
    formError: z.string().optional(),
    fieldErrors: z.object({}).optional(),
  })
);
