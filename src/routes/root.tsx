import {
  ActionFunctionArgs,
  json,
  Link,
  Outlet,
  redirect,
  useFetcher,
  useLoaderData,
  useLocation,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  createRequest,
  createRequests,
  deleteRequest,
  getRequestsHierarchy,
  updateRequest,
} from "../models/requests";
import Menu, { dataSchema } from "../components/menu";

const itemMapper = (item: any) => ({
  id: item.id,
  label: item.title || "New Request",
  to: `requests/${item.id}`,
  isFolder: false,
});

export async function loader() {
  const hierarchy = await getRequestsHierarchy();
  return hierarchy.map((item: any) => {
    if (item.isFolder)
      return {
        id: item.id,
        isFolder: true,
        label: item.title,
        children: item.children.map(itemMapper),
      };
    return itemMapper(item);
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("action-type");
  if (actionType === "add-feed") {
    const req = await createRequest("contentFeed");
    return redirect(`/requests/${req.id}`);
  }
  if (actionType === "add-login-requests") {
    console.log("add-login-requests");
    const [firstReq] = await createRequests("login");
    return redirect("/");
  }
  if (actionType === "update") {
    const requestId = z.string().parse(formData.get("request-id"));
    const title = z.string().parse(formData.get("title"));
    await updateRequest(requestId, { name: "title", value: title });
    // return redirect(pathname, 204);
    return json({});
  }
  if (actionType === "delete") {
    const requestId = z.string().parse(formData.get("request-id"));
    const pathname = z.string().parse(formData.get("pathname"));
    await deleteRequest(requestId);
    return pathname.includes(requestId)
      ? redirect("/", 204)
      : redirect(pathname, 204);
  }
}

export default function Root() {
  const loaderData = dataSchema.parse(useLoaderData());

  // const { pathname } = useLocation();
  // const submit = useSubmit();
  const fetcher = useFetcher();
  return (
    <>
      <div id="app" className={`bg-base-100`}>
        <header className="grid-item p-2  flex justify-between">
          <div className="font-bold">
            <Link to={"/"}>Pipes2 Debugging Tool (alpha)</Link>
          </div>
        </header>
        <div id="menu" className="grid-item flex flex-col ">
          <div className="text-right p-2 border-b-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="btn btn-xs btn-outline">New</button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className=" bg-white border py-1 mt-1 w-40 rounded-md  shadow-lg focus:outline-none flex flex-col"
                >
                  <DropdownMenu.Item
                    onClick={() => {
                      let formData = new FormData();
                      formData.append("action-type", "add-feed");

                      fetcher.submit(formData, { method: "post" });
                    }}
                    className="py-2 px-4 w-full text-xs text-left cursor-pointer hover:bg-slate-300"
                  >
                    Feed
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => {
                      let formData = new FormData();
                      formData.append("action-type", "add-login-requests");

                      fetcher.submit(formData, { method: "post" });
                    }}
                    className="py-2 px-4 w-full text-xs text-left cursor-pointer hover:bg-slate-300"
                  >
                    Login Flow Requests
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className="overflow-y-auto">
            <Menu data={loaderData} />
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
