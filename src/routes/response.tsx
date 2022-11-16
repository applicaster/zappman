import Editor, { DiffEditor, useMonaco } from "@monaco-editor/react";
import { json, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { getResponse } from "../domain/responses";

export async function loader({ params }: LoaderFunctionArgs) {
  const { responseId } = params;
  return json({ response: await getResponse(responseId), responseId });
}

const editorMarkers: any = [
  {
    message: "Error",
    severity: 8,
    startLineNumber: 2,
    endLineNumber: 2,
    startColumn: 4,
    endColumn: 9,
  },
];

export default function ResponseElement() {
  const loaderData = useLoaderData();
  console.log(loaderData)
  return (
    <>
      <div className="response-info grid-item"></div>
      <div className="response-details grid-item">
        {loaderData?.response?.error ? (
          <div className="p-2">Error: {loaderData?.response?.error}</div>
        ) : (
          <Editor
            options={{ readOnly: true, renderValidationDecorations: "on" }}
            onMount={(editor, monaco) => {
              const model = editor.getModel();
              if (!model) return;
              monaco.editor.setModelMarkers(model, "owner", editorMarkers);
            }}
            theme="vs-light"
            language="json"
            value={JSON.stringify(loaderData?.response?.data || {}, null, 2)}
          />
        )}
      </div>
    </>
  );
}
