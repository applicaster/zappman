import localforage, { keys } from "localforage";
import { applyPatch } from "fast-json-patch";
import { nanoid } from "nanoid";
import { z } from "zod";
import * as generatedRequests from "../../tools/auto-generated-requests/requests"
import { requests } from "../requests-declare";

export const requestSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  method: z.enum(["GET", "POST"]).optional(),
  body: z.string().optional(),
  requestType: z.string(),
  title: z.string().optional(),
  folderId: z.string().optional(),
  createdAt: z.number(),
  ctx: z
    .array(z.object({ key: z.string().optional(), value: z.any().optional() }))
    .optional(),
  headers: z
    .array(z.object({ key: z.string().optional(), value: z.any().optional() }))
    .optional(),
});

export type RequestItem = z.infer<typeof requestSchema>;

const folderSchema = z.object({
  id: z.string(),
  requestsType: z.string(),
  title: z.string(),
  createdAt: z.number(),
});

type Folder = z.infer<typeof folderSchema>;

const requestsStore = localforage.createInstance({
  name: "requests",
});

const foldersStore = localforage.createInstance({
  name: "folders",
});

export async function createRequest(requestType: any) {
  const request = requests.items.find((item: any) => item.info.id == requestType);
  const id = nanoid(9);
  return requestsStore.setItem(id, {
    id,
    title: "Feed",
    createdAt: Date.now(),
    requestType,
  });
}

export async function createRequests(requestsType: any) {
  const request = requests.items.find((item: any) => item.info.id == requestsType)
  if (!request) return [];

  const folderId = nanoid(9);
  await foldersStore.setItem(folderId, {
    id: folderId,
    requestsType,
    title: request.info.label,
    createdAt: Date.now(),
  });

  const requestsArray = request.requests.map((item: any) => { return (generatedRequests as any)[item.id].defaultRequest });
  const results = await Promise.all(requestsArray)

  return Promise.all(
    results.map(async ({ requestType, title, headers, body, method, ctx }:
      { requestType: string, title: string, headers: any, body: any, method: string, ctx: any }) => {
      const id = nanoid(9);
      await requestsStore.setItem(id, {
        id,
        title,
        createdAt: Date.now(),
        requestType,
        folderId,
        method,
        headers: headers || [{}, {}, {}, {}, {}, {}],
        body,
        ctx: ctx || [{}, {}, {}, {}, {}, {}],
      });
    })
  );
}

export async function getRequest(requestId: string) {
  return requestsStore.getItem(requestId);
}

export async function getRequestsHierarchy() {
  const folders: Folder[] = [];
  await foldersStore.iterate((value: Folder, key) => {
    folders.push(value);
  });
  const requests: RequestItem[] = [];
  await requestsStore.iterate((value: RequestItem, key, iterationNumber) => {
    requests.push(value);
  });

  const foldersMenu = folders.map((folder) => {
    return {
      ...folder,
      isFolder: true,
      children: requests
        .filter((r) => r.folderId === folder.id)
        .sort((a, b) => b.createdAt - a.createdAt),
    };
  });
  return [...foldersMenu, ...requests.filter((r) => !r.folderId)].sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export async function deleteRequest(requestId: string) {
  return requestsStore.removeItem(requestId);
}

export async function deleteFolderAndRequests(folderId: string) {
  await requestsStore.iterate((value: RequestItem, key, iterationNumber) => {
    if (value.folderId === folderId) {
      requestsStore.removeItem(key);
    }
  });
  await foldersStore.removeItem(folderId);
}

export async function renameFolder(folderId: string, newTitle: string) {
  const folder: Folder = folderSchema.parse(
    await foldersStore.getItem(folderId)
  );
  return await foldersStore.setItem(folderId, { ...folder, title: newTitle });
}

export async function renameRequest(requestId: string, newTitle: string) {
  const request: RequestItem = requestSchema.parse(
    await requestsStore.getItem(requestId)
  );
  return await requestsStore.setItem(requestId, {
    ...request,
    title: newTitle,
  });
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
    // TODO: see how to remove the need of creating the array
    applyPatch(
      {
        ctx: [{}, {}, {}, {}, {}, {}],
        headers: [{}, {}, {}, {}, {}, {}],
        ...request,
      },
      [{ op: "replace", path: `/${name.replaceAll(".", "/")}`, value }]
    ).newDocument
  );
}
