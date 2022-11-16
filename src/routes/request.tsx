import {
  ActionFunctionArgs,
  Form,
  json,
  Link,
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useFetcher,
  useLoaderData,
  useLocation,
  useParams,
} from "react-router-dom";
import qs from "qs";

import CtxFieldPairs from "../components/ctx-field-pairs";
import { deleteRequest, getRequest, updateRequest } from "../models/requests";
import { createResponse, getLatestResponse } from "../models/responses";

export async function action({ request, params }: ActionFunctionArgs) {
  const { requestId } = params;
  const text = await request.text();

  const req: any = qs.parse(text, {
    /* @ts-expect-error - the library has wrong typings */
    allowSparse: true,
  });

  const actionType = req["action-type"];
  if (actionType === "delete") {
    await deleteRequest(requestId);
    return redirect("/");
  }
  if (actionType === "update") {
    await updateRequest(requestId, req);
    return json({});
  }
  if (actionType === "send") {
    const response = await createResponse(requestId);
    return redirect(`/requests/${requestId}/responses/${response.id}`);
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { requestId, responseId } = params;
  if (!responseId) {
    const latestResponse = await getLatestResponse(requestId);
    if (latestResponse?.id) {
      return redirect(`/requests/${requestId}/responses/${latestResponse.id}`);
    }
  }
  return json({ request: await getRequest(requestId) });
}

const Tab = ({ isActive, to, children }: any) => {
  return (
    <Link className={`tab tab-lifted ${isActive ? " tab-active" : ""}`} to={to}>
      {children}
    </Link>
  );
};

export default function RequestElement() {
  const { requestId } = useParams();
  const { request } = useLoaderData();

  const fetcher = useFetcher();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("activeTab");
  const handleChange = (e) => {
    const target = e.target as HTMLInputElement;
    fetcher.submit(
      {
        id: requestId,
        [target.name]:
          target.type === "checkbox" ? target.checked : target.value,
        "action-type": "update",
      },
      { method: "post" }
    );
  };
  return (
    <>
      <fetcher.Form
        key={`1-${requestId}`}
        method="post"
        onChange={handleChange}
        className="request-url grid-item"
      >
        <div className="form-control">
          <div className="input-group">
            <select className="select select-bordered">
              <option>GET</option>
              <option>POST</option>
            </select>
            <input
              type="text"
              className="input input-bordered w-full"
              name="url"
              defaultValue={request?.url}
            />
            <button
              className="btn last:rounded-r-sm"
              type="submit"
              name="action-type"
              value="send"
            >
              Send
            </button>
          </div>
        </div>
      </fetcher.Form>
      <fetcher.Form
        key={`2-${requestId}`}
        method="post"
        onChange={handleChange}
        className="request-details grid-item p-2"
      >
        <div className="mb-2">
          <button
            className="btn btn-xs btn-outline float-right"
            type="submit"
            name="action-type"
            value="delete"
          >
            Delete
          </button>
          <h2 className="mb-2 font-semibold">General Settings</h2>
          <input
            name="title"
            defaultValue={request?.title}
            type="text"
            placeholder="New Request"
            className="input input-sm input-bordered  w-full "
          />
        </div>
        <h2 className="mb-2 font-semibold">Context Keys</h2>
        <div className="tabs ">
          <Tab to="?activeTab=ctx" isActive={activeTab === "ctx" || !activeTab}>
            CTX
          </Tab>
          <Tab to="?activeTab=cqp" isActive={activeTab === "cqp"}>
            Custom Query Params
          </Tab>
          <Tab to="?activeTab=bt" isActive={activeTab === "bt"}>
            Bearer Token
          </Tab>
          <Tab to="?activeTab=ch" isActive={activeTab === "ch"}>
            Custom Headers
          </Tab>
          <Tab to="?activeTab=body" isActive={activeTab === "body"}>
            Body
          </Tab>
        </div>
        {(activeTab === "ctx" || !activeTab) && (
          <>
            <CtxFieldPairs />
            <CtxFieldPairs />
            <CtxFieldPairs />
            <CtxFieldPairs />
            <CtxFieldPairs />
            <CtxFieldPairs />
          </>
        )}
      </fetcher.Form>
      <Outlet />
    </>
  );
}
