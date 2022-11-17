import localforage from "localforage";
import { nanoid } from "nanoid";

const requestsStore = localforage.createInstance({
  name: "requests",
});

export async function createRequest(requestType) {
  const id = nanoid(9);
  return requestsStore.setItem(id, {
    id,
    createdAt: Date.now(),
    requestType 
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

export async function updateRequest(requestId, data) {
  const request = await requestsStore.getItem(requestId);
  return await requestsStore.setItem(requestId, { ...request, ...data });
}
