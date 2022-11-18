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
import { z } from "zod";

import CtxFieldPairs from "../components/ctx-field-pairs";
import {
  deleteRequest,
  getRequest,
  RequestItem,
  updateRequest,
} from "../models/requests";
import { createResponse, getLatestResponse } from "../models/responses";

export async function action({ request, params }: ActionFunctionArgs) {
  const requestId = z.string().parse(params.requestId);

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
    // console.log(req.patch);
    await updateRequest(requestId, req);
    return json({});
  }
  if (actionType === "send") {
    const response = await createResponse(requestId);
    return redirect(`/requests/${requestId}/responses/${response.id}`);
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { responseId } = params;
  const requestId = z.string().parse(params.requestId);

  if (!responseId) {
    const latestResponse = await getLatestResponse(requestId);
    if (latestResponse?.id) {
      return redirect(`/requests/${requestId}/responses/${latestResponse.id}`);
    }
  }
  return json({ request: await getRequest(requestId) });
}

const Tab = ({ isActive, to, children, isDisabled }: any) => {
  return isDisabled ? (
    <div className="tab tab-lifted pointer-events-none opacity-30 cursor-not-allowed">
      {children}
    </div>
  ) : (
    <Link className={`tab tab-lifted ${isActive ? " tab-active" : ""}`} to={to}>
      {children}
    </Link>
  );
};

export default function RequestElement() {
  const { requestId } = useParams();
  const { request } = useLoaderData() as { request: RequestItem };
  const fetcher = useFetcher();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("activeTab");
  if (!requestId || !request) {
    throw new Error("request item is not set");
  }
  const handleChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    fetcher.submit(
      {
        id: requestId,
        name: target.name,
        value: target.value,
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
        {/* https://stackoverflow.com/a/51507806 */}
        <button type="submit" disabled style={{ display: "none" }}></button>
        <div className="form-control">
          <div className="input-group">
            <select className="select select-bordered">
              <option>GET</option>
              {/* <option>POST</option> */}
            </select>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="Request URL (https://example.com/my-feed.json)"
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
        {/* https://stackoverflow.com/a/51507806 */}
        <button type="submit" disabled style={{ display: "none" }}></button>
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
            placeholder="New Request Title"
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
          <Tab to="?activeTab=body" isActive={activeTab === "body"} isDisabled>
            Body
          </Tab>
        </div>
        {(activeTab === "ctx" || !activeTab) && (
          <>
            <CtxFieldPairs
              index={0}
              defaultKeyValue={request?.ctx && request?.ctx[0].key}
              defaultValueValue={request?.ctx && request?.ctx[0].value}
            />
             <CtxFieldPairs
              index={1}
              defaultKeyValue={request?.ctx && request?.ctx[1].key}
              defaultValueValue={request?.ctx && request?.ctx[1].value}
            />
             <CtxFieldPairs
              index={2}
              defaultKeyValue={request?.ctx && request?.ctx[2].key}
              defaultValueValue={request?.ctx && request?.ctx[2].value}
            />
             <CtxFieldPairs
              index={3}
              defaultKeyValue={request?.ctx && request?.ctx[3].key}
              defaultValueValue={request?.ctx && request?.ctx[3].value}
            />
             <CtxFieldPairs
              index={4}
              defaultKeyValue={request?.ctx && request?.ctx[4].key}
              defaultValueValue={request?.ctx && request?.ctx[4].value}
            />
          </>
        )}
      </fetcher.Form>
      <Outlet />
    </>
  );
}
