import Editor from "@monaco-editor/react";
import { findNodeAtLocation, parseTree } from "jsonc-parser";
import { z } from "zod";
import { json, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getResponse, responseSchema } from "../models/responses";
import { getRequest, requestSchema } from "../models/requests";
import { schema as contentFeedSchema } from "../validators/contentFeed";
import TimeAgo from "../components/time-ago";

async function init({ json, schema }: { json: any; schema: any }) {
  const stringifiedJson = JSON.stringify(json, null, 2);
  const parsedJson = parseTree(stringifiedJson);
  if (!json || !parsedJson) throw new Error("Not a valid JSON");
  const parsed = await schema.safeParseAsync(json);
  let markers: {
    message: string;
    offset: number;
    length: number;
  }[] = [];
  if (!parsed.success) {
    markers = parsed.error.issues.map((issue: any) => {
      const path = issue.path;
      const offset: number =
        (findNodeAtLocation(parsedJson, path)?.parent?.offset ??
          findNodeAtLocation(parsedJson, path.slice(0, -1))?.offset) ||
        0;

      const node = z
        .object({
          parent: z
            .object({
              children: z.array(z.object({ value: z.any() })),
            })
            .optional(),
        })
        .parse(
          findNodeAtLocation(parsedJson, path)?.parent?.offset
            ? findNodeAtLocation(parsedJson, path)
            : findNodeAtLocation(parsedJson, path.slice(0, -1))
        );

      const length = node?.parent?.children[0].value?.length ?? 1;
      return {
        message: issue.message,
        offset,
        length,
      };
    });

    return { markers, stringifiedJson };
  }
  return { markers: [], stringifiedJson };
}

const schemaByType = {
  contentFeed: contentFeedSchema,
  login: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
    status: z.number(),
  }),
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { requestId, responseId } = z
    .object({ requestId: z.string(), responseId: z.string() })
    .parse(params);
  const { requestType } = requestSchema.parse(await getRequest(requestId));
  console.log({ requestType });
  const response = responseSchema.parse(await getResponse(responseId));
  const { markers, stringifiedJson } = await init({
    json: response?.data ?? {},
    schema: schemaByType[requestType],
  });
  return json({
    markers,
    stringifiedJson,
    response,
    responseId,
    requestType,
  });
}

export default function ResponseElement() {
  const loaderData: any = useLoaderData();
  const response = responseSchema.parse(loaderData.response);

  return (
    <>
      <div className="response-info grid-item  flex items-center justify-between px-2">
        <div
          className={`badge badge-${
            response && response.status && response.status < 300
              ? "success"
              : "error"
          }`}
        >
          {loaderData?.response?.status || "Error"}
        </div>
        <div className="text-sm">
          {loaderData?.response?.createdAt && (
            <TimeAgo timestamp={response?.createdAt} />
          )}
        </div>
      </div>
      <div className="response-details grid-item">
        {response?.error ? (
          <div className="p-2">Error: {response?.error}</div>
        ) : (
          <Editor
            key={loaderData?.responseId}
            options={{
              readOnly: true,
              renderValidationDecorations: "on",
              wordWrap: "on",
            }}
            onMount={(editor, monaco) => {
              const model = editor.getModel();
              if (!model) return;
              monaco.editor.setModelMarkers(
                model,
                "owner",
                loaderData?.markers.map(({ message, offset, length }: any) => {
                  return {
                    message,
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: model.getPositionAt(offset).lineNumber,
                    endLineNumber: model.getPositionAt(offset).lineNumber,
                    startColumn: model.getPositionAt(offset).column,
                    endColumn: model.getPositionAt(offset).column + length + 2,
                  };
                }) || []
              );
              if (loaderData?.markers.length > 0) {
                editor.trigger("", "editor.action.marker.next", {});
              }
            }}
            theme="vs-light"
            language="json"
            value={loaderData?.stringifiedJson}
          />
        )}
      </div>
    </>
  );
}
