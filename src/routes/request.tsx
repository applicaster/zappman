import {
  ActionFunctionArgs,
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
import Editor from "../components/editor";
import qs from "qs";
import { z } from "zod";

import CtxFieldPairs from "../components/ctx-field-pairs";
import { getRequest, RequestItem, updateRequest } from "../models/requests";
import { createResponse, getLatestResponse } from "../models/responses";
import { getBodySchema } from "../utils";


export async function action({ request, params }: ActionFunctionArgs) {
  const requestId = z.string().parse(params.requestId);

  const text = await request.text();

  const req: any = qs.parse(text, {
    /* @ts-expect-error - the library has wrong typings */
    allowSparse: true,
  });

  const actionType = req["action-type"];
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
  const { responseId } = params;
  const requestId = z.string().parse(params.requestId);

  if (!responseId) {
    const latestResponse = await getLatestResponse(requestId);
    if (latestResponse?.id) {
      return redirect(`/requests/${requestId}/responses/${latestResponse.id}`);
    }
  }
  const request = await getRequest(requestId);
  // After a request is deleted
  if (!request) return redirect("/");
  const bodySchema = getBodySchema(request?.requestType);
  const defaultBody = bodySchema
    ? JSON.stringify(getBodySchema(request?.requestType).safeParse({}), null, 2)
    : "";
  const markers = [];
  return json({
    request,
    defaultBody,
    bodySchema,
    markers,
    requestType: request?.requestType,
  });
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
  const { request, defaultBody } = useLoaderData() as {
    request: RequestItem;
  };
  const fetcher = useFetcher();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bodySchema = getBodySchema(request?.requestType);


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
            <select
              className={`select select-bordered ${
                request?.method === "POST" && "text-purple-500"
              }`}
              name="method"
              defaultValue={request?.method}
            >
              <option disabled={request?.method === "POST"}>GET</option>
              <option disabled={request?.method !== "POST"}>POST</option>
            </select>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="Request URL (https://example.com/my-feed.json)"
              name="url"
              defaultValue={request?.url}
            />
            <button
              className={`btn last:rounded-r-sm ${
                fetcher.state !== "idle" ? "btn-disabled" : ""
              }`}
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
        <h2 className="mb-2 font-semibold">Context Keys</h2>
        <div className="tabs ">
          <Tab to="?activeTab=ctx" isActive={activeTab === "ctx" || !activeTab}>
            CTX
          </Tab>
          <Tab to="?activeTab=bt" isActive={activeTab === "bt"}>
            Bearer Token
          </Tab>
          <Tab to="?activeTab=cqp" isActive={activeTab === "cqp"}>
            Query Params
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
        {activeTab === "body" && (
          <div>
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">JSON Body</span>
              </label>

              <div className="h-36">
                <Editor
                  defaultValue={request?.body || defaultBody}
                  validationSchema={bodySchema}
                  onchange={(value) => {
                    fetcher.submit(
                      {
                        id: requestId,
                        name: "body",
                        value: value || "",
                        "action-type": "update",
                      },
                      { method: "post" }
                    );
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </fetcher.Form>
      <Outlet />
    </>
  );
}
