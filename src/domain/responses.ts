import localforage from "localforage";
import { nanoid } from "nanoid";
import { getRequest } from "./requests";
const responsesStore = localforage.createInstance({
  name: "responses",
});

export async function createResponse(requestId) {
  const request = await getRequest(requestId);
  const response = await fetch(request.url);
  const responseId = nanoid(9);
  return responsesStore.setItem(responseId, {
    id: responseId,
    requestId,
    createdAt: Date.now(),
    data: await response.json(),
  });
}

export async function getResponse(responseId) {
  return responsesStore.getItem(responseId);
}

export async function getLatestResponse(requestId) {
  const responses = [];
  await responsesStore.iterate((value, key, iterationNumber) => {
    console.log(value.requestId, '---', requestId)
    if (requestId === value.requestId) {
      responses.push(value);
    }
  });
  if (responses.length > 0) {
    return responses.sort((a, b) => b.createdAt - a.createdAt)[0];
  }
  return null;
}
