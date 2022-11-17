import localforage from "localforage";
import { nanoid } from "nanoid";
import { getRequest } from "./requests";
const responsesStore = localforage.createInstance({
  name: "responses",
});

export async function createResponse(requestId) {
  const responseId = nanoid(9);

  const request = await getRequest(requestId);
  try {
    const response = await fetch(request.url);
    const data = await response.json();
    return responsesStore.setItem(responseId, {
      id: responseId,
      requestId,
      createdAt: Date.now(),
      data,
      status: response.status
    });
  } catch (error) {
    return responsesStore.setItem(responseId, {
      id: responseId,
      requestId,
      createdAt: Date.now(),
      error : error?.message || error.toString(),
    });
  }

  // let data;
  // const response = await fetch(request.url).catch((e) => {
  //   console.log("--");
  //   return responsesStore.setItem(responseId, {
  //     id: responseId,
  //     requestId,
  //     createdAt: Date.now(),

  //     error: "error",
  //   });
  // });
  // console.log(response);

  // try {
  //   data = await response.json();
  // } catch (error) {}
  // return responsesStore.setItem(responseId, {
  //   id: responseId,
  //   requestId,
  //   createdAt: Date.now(),
  //   data,
  // });
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
