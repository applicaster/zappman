// import MonacoEditor from "react-monaco-editor";
// import { monaco } from 'react-monaco-editor';

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";



const editorMarkers: any = [
  {
    message: "Error",
    severity:8,
    startLineNumber: 2,
    endLineNumber: 2,
    startColumn: 4,
    endColumn: 9,
  },
];

export default function ResponseElement() {
  return (
    <>
      <div className="response-info grid-item"></div>
      <div className="response-details grid-item">
        <Editor
          options={{ readOnly: true, renderValidationDecorations: 'on' }}
          
          onMount={(editor, monaco) => {
              const model = editor.getModel();
              if (!model) return;
              monaco.editor.setModelMarkers(model, "owner", editorMarkers);
           
          }}
          theme="vs-light"
          language="json"
          onValidate={(markers) => {
            console.log({markers})
          }}
          value={JSON.stringify({ entry: [] }, null, 2)}
        />
      </div>
    </>
  );
}
