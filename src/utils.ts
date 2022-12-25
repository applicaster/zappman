import { bodySchema, headersSchema } from "./request-types/login";

const mapper = {
  login: {
    bodySchema: bodySchema,
    headersSchema: headersSchema
  },
};

export function getBodySchema(requestType) {
  return mapper[requestType]?.bodySchema;
}

export function getHeadersSchema(requestType) {
  return mapper[requestType]?.headersSchema;
}

// export function mountMarkers(markers) {
//   return (editor, monaco) => {
//     const model = editor.getModel();
//     if (!model) return;
//     monaco.editor.setModelMarkers(
//       model,
//       "owner",
//       markers.map(({ message, offset, length }: any) => {
//         return {
//           message,
//           severity: monaco.MarkerSeverity.Error,
//           startLineNumber: model.getPositionAt(offset).lineNumber,
//           endLineNumber: model.getPositionAt(offset).lineNumber,
//           startColumn: model.getPositionAt(offset).column,
//           endColumn: model.getPositionAt(offset).column + length + 2,
//         };
//       }) || []
//     );
//     if (markers.length > 0) {
//       editor.trigger("", "editor.action.marker.next", {});
//     }
//   };
// }

// export function validateMarkers(markers) {

// }
