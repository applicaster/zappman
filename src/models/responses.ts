import localforage from "localforage";
import { nanoid } from "nanoid";
import { z } from "zod";

import { getRequest, requestSchema } from "./requests";

export const responseSchema = z.object({
  id: z.string(),
  status: z.number().optional(),
  createdAt: z.number(),
  requestId: z.string(),
  data: z.any(),
  error: z.string().optional(),
});

export type ResponseItem = z.infer<typeof responseSchema>;

const responsesStore = localforage.createInstance({
  name: "responses",
});

export async function createResponse(requestId: string) {
  const responseId = nanoid(9);

  const request = requestSchema.parse(await getRequest(requestId));
  try {
    if (!request.url) throw new Error("URL was not set");
    const url = new URL(request.url);
    if (request?.ctx) {
      const ctxObj = request?.ctx.reduce((item, acc: any) => {
        if (item.key) {
          acc[item.key] = item.value;
        }
        return acc;
      }, {});
      if (Object.keys(ctxObj).length > 0) {
        url.searchParams.set("ctx", btoa(JSON.stringify(ctxObj)));
      }
    }
    let headers = {};
    if (request?.headers) {
      headers = request?.headers.reduce((acc, item) => {
        if (item.key) {
          acc[item.key] = item.value;
        }
        return acc;
      }, {});
    }

    const response = await fetch(url.href, {
      method: request?.method || "GET",
      body: request?.body,
      headers,
    });
    const data = await response.json();
    return responsesStore.setItem(responseId, {
      id: responseId,
      requestId,
      createdAt: Date.now(),
      data,
      status: response?.status,
    });
  } catch (error: any) {
    return responsesStore.setItem(responseId, {
      id: responseId,
      requestId,
      createdAt: Date.now(),
      error: error?.message || error.toString(),
    });
  }
}

export async function getResponse(responseId: string) {
  return responsesStore.getItem(responseId);
}

export async function getLatestResponse(requestId: string) {
  const responses: ResponseItem[] = [];
  await responsesStore.iterate((value: ResponseItem, key, iterationNumber) => {
    if (requestId === value.requestId) {
      responses.push(value);
    }
  });
  if (responses.length > 0) {
    return responses.sort((a, b) => b.createdAt - a.createdAt)[0];
  }
  return null;
}
