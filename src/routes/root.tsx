import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { createRequest, getRequests } from "../models/requests";

export async function loader() {
  return await getRequests();
}

export async function action() {
  const request = await createRequest('contentFeed');
  return redirect(`/requests/${request.id}`);
}

export default function Root() {
  const loaderData = useLoaderData();
  return (
    <>
      <div className="app bg-base-100">
        <header className="grid-item p-2 font-bold">
          <Link to={"/"}>Zappman (Alpha)</Link>
        </header>
        <div id="menu" className="grid-item flex flex-col">
          <div className="text-right p-2 border-b-2">
            <Form method="post">
              <button className="btn btn-xs btn-outline" type="submit">
                New
              </button>
            </Form>
          </div>
          <ul className="menu menu-compact py-1 flex flex-col flex-1 ">
            {loaderData?.map((request) => {
              return (
                <li key={request.id}>
                  <NavLink to={`/requests/${request.id}`}>
                    <div>
                      {request.title ? request.title : <i>New Request</i>}
                    </div>
                  </NavLink>
                </li>
              );
            })}

            <Link className="flex-1" to="/"></Link>
            {/* <li className="menu-title">
              <span>Login flow</span>
            </li>
            <li>
              <a>Login</a>
            </li>
            <li>
              <a>Refresh</a>
            </li> */}
          </ul>
        </div>
        <Outlet />
      </div>
    </>
  );
}
