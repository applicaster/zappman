import localforage from "localforage";
import { applyPatch } from "fast-json-patch";
import { nanoid } from "nanoid";
import { z } from "zod";

const requestSchema = z.object({
  url: z.string().url(),
  createdAt: z.number(),
});

export type RequestItem = z.infer<typeof requestSchema>;

const requestsStore = localforage.createInstance({
  name: "requests",
});

export async function createRequest(requestType: "contentFeed") {
  const id = nanoid(9);
  return requestsStore.setItem(id, {
    id,
    createdAt: Date.now(),
    requestType,
  });
}

export async function getRequest(requestId: string) {
  return requestsStore.getItem(requestId);
}

export async function getRequests() {
  const requests: RequestItem[] = [];
  await requestsStore.iterate((value: RequestItem, key, iterationNumber) => {
    requests.push(value);
  });
  return requests.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteRequest(requestId: string) {
  return requestsStore.removeItem(requestId);
}

export async function updateRequest(
  requestId: string,
  { name, value }: { name: string; value: any }
) {
  const request: RequestItem = requestSchema.parse(
    await requestsStore.getItem(requestId)
  );

  return await requestsStore.setItem(
    requestId,
    // TODO: see how to remove the need of creating the ctx array
    applyPatch({ ctx: [{}, {}, {}, {}, {}, {}], ...request }, [
      { op: "replace", path: `/${name.replaceAll(".", "/")}`, value },
    ]).newDocument
  );
}
