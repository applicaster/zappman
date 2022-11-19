import {
  ActionFunctionArgs,
  Form,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import MenuItem from "../components/menu-item";

import {
  createRequest,
  deleteRequest,
  getRequests,
  requestSchema,
} from "../models/requests";

export async function loader() {
  return await getRequests();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("action-type");
  if (actionType === "add") {
    const req = await createRequest("contentFeed");
    return redirect(`/requests/${req.id}`);
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
  const loaderData = z.array(requestSchema).parse(useLoaderData());
  const { pathname } = useLocation();
  const submit = useSubmit();
  return (
    <>
      <div className="app bg-base-100">
        <header className="grid-item p-2 font-bold">
          <Link to={"/"}>Zappman (Alpha)</Link>
        </header>
        <div id="menu" className="grid-item flex flex-col">
          <div className="text-right p-2 border-b-2">
            <Form method="post">
              <button
                className="btn btn-xs btn-outline"
                name="action-type"
                value="add"
                type="submit"
              >
                New
              </button>
            </Form>
          </div>
          <div>
            {loaderData?.map((request) => {
              const title = request.title ?? <i>New Request</i>;
              return (
                <MenuItem
                  to={`/requests/${request.id}`}
                  title={title}
                  key={request.id}
                >
                  <DropdownMenu.Item
                    className="py-2 px-4 w-full text-xs text-left cursor-pointer hover:bg-slate-300"
                    onClick={(e) => {
                      e.preventDefault();
                      let formData = new FormData();
                      formData.append("action-type", "delete");
                      formData.append("pathname", pathname);
                      formData.append("request-id", request.id);
                      submit(formData, { method: "post" });
                    }}
                  >
                    Delete
                  </DropdownMenu.Item>
                </MenuItem>
              );
            })}
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
