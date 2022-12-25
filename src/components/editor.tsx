import Editor from "@monaco-editor/react";
import { z } from "zod";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useRef } from "react";
import { findNodeAtLocation, parseTree } from "jsonc-parser";

export function mountMarkers(markers) {
  return (editor, monaco) => {
    const model = editor.getModel();
    if (!model) return;
    monaco.editor.setModelMarkers(
      model,
      "owner",
      markers.map(({ message, offset, length }: any) => {
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
    // if (markers.length > 0) {
    //   editor.trigger("", "editor.action.marker.next", {});
    // }
  };
}

export async function createMarkers({
  json,
  schema,
}: {
  json: string;
  schema: any;
}) {
  const parsedJson = parseTree(json);
  if (!json || !parsedJson) throw new Error("Not a valid JSON");
  const parsed = await schema.safeParseAsync(JSON.parse(json));
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

    return markers;
  }
  return [];
}

export default function ({
  onchange,
  validationSchema,
  defaultValue,
}: {
  onchange: any;
  validationSchema: any;
  defaultValue?: string;
}) {
  const monacoRef = useRef<Monaco>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  return (
    <Editor
      className="p-2 bg-white"
      theme="vs-light"
      language="json"
      onChange={(value) => {
        if (value) {
          createMarkers({
            json: value,
            schema: validationSchema,
          }).then((markers) => {
            mountMarkers(markers)(editorRef.current, monacoRef.current);
          });
        }
        onchange(value);
      }}
      onMount={async (editor, monaco) => {
        monacoRef.current = monaco;
        editorRef.current = editor;
        if (defaultValue) {
          const markers = await createMarkers({
            json: defaultValue,
            schema: validationSchema,
          });
          mountMarkers(markers)(editor, monaco);
        }
      }}
      options={{
        minimap: { enabled: false },
        glyphMargin: false,
        folding: false,
        lineNumbers: "off",
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
      }}
      defaultValue={defaultValue}
    />
  );
}
