import { z } from "zod";
import { schema } from "./response-schema";

export const responseSchema = schema;

export const requestSchema = z.object({
  title: z.string().default('Feed'),
  method: z.literal('POST').default('POST')
})