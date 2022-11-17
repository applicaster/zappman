import localforage from "localforage";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getRequest, RequestItem } from "./requests";



const responsesStore = localforage.createInstance({
  name: "responses",
});

export async function createResponse(requestId) {
  const responseId = nanoid(9);

  const request: RequestItem = await getRequest(requestId);
  try {
    console.log(request);
    const url = new URL(request.url);
    const ctxObj = request?.ctx.reduce((item, acc) => {
      if (acc[item.key]) {
        acc[item.key] = item.value;
      }
      return acc;
    }, {});
    if (Object.keys(ctxObj).length > 0) {
      url.searchParams.set("ctx", btoa(JSON.stringify(ctxObj)));
    }
    console.log(url.href);
    const response = await fetch(url.href);
    const data = await response.json();
    return responsesStore.setItem(responseId, {
      id: responseId,
      requestId,
      createdAt: Date.now(),
      data,
      status: response.status,
    });
  } catch (error) {
    return responsesStore.setItem(responseId, {
      id: responseId,
      requestId,
      createdAt: Date.now(),
      error: error?.message || error.toString(),
    });
  }
}

export async function getResponse(responseId) {
  return responsesStore.getItem(responseId);
}

export async function getLatestResponse(requestId) {
  const responses = [];
  await responsesStore.iterate((value, key, iterationNumber) => {
    if (requestId === value.requestId) {
      responses.push(value);
    }
  });
  if (responses.length > 0) {
    return responses.sort((a, b) => b.createdAt - a.createdAt)[0];
  }
  return null;
}
