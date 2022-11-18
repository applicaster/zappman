import {
  ActionFunctionArgs,
  Form,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import { z } from "zod";
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
    return pathname.includes(requestId) ? redirect("/") : redirect(pathname);
  }
}

export default function Root() {
  const loaderData = z.array(requestSchema).parse(useLoaderData());
  const { pathname } = useLocation();
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
                  {({ close }: any) => (
                    <Form method="post">
                      <input
                        type="hidden"
                        value={request.id}
                        name="request-id"
                      />
                      <input type="hidden" value={pathname} name="pathname" />
                      <button
                        className="py-2 px-4 w-full text-left cursor-pointer hover:bg-slate-300"
                        type="submit"
                        name="action-type"
                        value="delete"
                        onClick={() =>
                          setTimeout(() => {
                            close();
                          }, 10)
                        }
                      >
                        Delete
                      </button>
                    </Form>
                  )}
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
