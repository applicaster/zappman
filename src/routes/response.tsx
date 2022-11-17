import Editor from "@monaco-editor/react";
import { findNodeAtLocation, parseTree } from "jsonc-parser";
import { z } from "zod";
import { json, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getResponse } from "../models/responses";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getRequest } from "../models/requests";
import { schema as contentFeedSchema } from "../validators/contentFeed";

dayjs.extend(relativeTime);

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
    markers = parsed.error.issues
      .map((issue) => {
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
      })
    
    return { markers, stringifiedJson };
  }
  return { markers: [], stringifiedJson };
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { requestId, responseId } = params;
  const { requestType } = await getRequest(requestId);
  const response = await getResponse(responseId);
  const { markers, stringifiedJson } = await init({
    json: response?.data ?? {},
    schema: contentFeedSchema,
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
  const loaderData = useLoaderData();
  const requestType = loaderData?.requestType;
  return (
    <>
      <div className="response-info grid-item  flex items-center justify-between px-2">
        <div
          className={`badge badge-${
            loaderData?.response?.status < 300 ? "success" : "error"
          }`}
        >
          {loaderData?.response?.status || "Error"}
        </div>
        <div>
          {loaderData?.response?.createdAt &&
            dayjs(loaderData?.response?.createdAt).fromNow()}
        </div>
      </div>
      <div className="response-details grid-item">
        {loaderData?.response?.error ? (
          <div className="p-2">Error: {loaderData?.response?.error}</div>
        ) : (
          <Editor
          key={loaderData?.responseId}
            options={{ readOnly: true, renderValidationDecorations: "on" }}
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
                console.log("trigger");
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
