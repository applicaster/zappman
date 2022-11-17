import localforage from "localforage";
import { applyPatch, validate } from "fast-json-patch";

import { nanoid } from "nanoid";

const requestsStore = localforage.createInstance({
  name: "requests",
});

export async function createRequest(requestType) {
  const id = nanoid(9);
  return requestsStore.setItem(id, {
    id,
    createdAt: Date.now(),
    requestType,
  });
}

export async function getRequest(requestId) {
  return requestsStore.getItem(requestId);
}

export async function getRequests() {
  const requests = [];
  await requestsStore.iterate((value, key, iterationNumber) => {
    requests.push(value);
  });
  return requests.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteRequest(requestId) {
  return requestsStore.removeItem(requestId);
}

export async function updateRequest(requestId, { name, value }) {
  const request = await requestsStore.getItem(requestId);

  return await requestsStore.setItem(
    requestId,
    // TODO: see how to remove the need of creating the ctx array
    applyPatch({ ctx: [{}, {}, {}, {}, {}, {}], ...request }, [
      { op: "replace", path: `/${name.replaceAll(".", "/")}`, value },
    ]).newDocument
  );
}
