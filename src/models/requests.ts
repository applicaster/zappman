import localforage, { keys } from "localforage";
import { applyPatch } from "fast-json-patch";
import { nanoid } from "nanoid";
import { z } from "zod";

export const requestSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  requestType: z.enum(["contentFeed", "login"]),
  title: z.string().optional(),
  folderId: z.string().optional(),
  createdAt: z.number(),
  ctx: z
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

export async function createRequest(requestType: "contentFeed") {
  const id = nanoid(9);
  return requestsStore.setItem(id, {
    id,
    createdAt: Date.now(),
    requestType,
  });
}

export async function createRequests(requestsType: any) {
  if (requestsType === "login") {
    const folderId = nanoid(9);
    await foldersStore.setItem(folderId, {
      id: folderId,
      requestsType,
      title: "Login Requests",
      createdAt: Date.now(),
    });
    return Promise.all(
      [{ requestType: "login", title: "Login" }].map(
        async ({ requestType, title }) => {
          const id = nanoid(9);
          await requestsStore.setItem(id, {
            id,
            title,
            createdAt: Date.now(),
            requestType,
            folderId,
          });
        }
      )
    );
  }
  return [];
}

export async function getRequest(requestId: string) {
  return requestsStore.getItem(requestId);
}

// export async function getRequests() {
//   const requests: RequestItem[] = [];
//   await requestsStore.iterate((value: RequestItem, key, iterationNumber) => {
//     console.log(key, { iterationNumber }, "---");
//     requests.push(value);
//   });
//   console.log(requests.length, "--");
//   return requests.sort((a, b) => b.createdAt - a.createdAt);
// }

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
  return await requestsStore.setItem(requestId, { ...request, title: newTitle });
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
