import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import "./App.css";
import Root, {
  action as rootAction,
  loader as rootLoader,
} from "./routes/root";
import RequestElement, {
  action as requestAction,
  loader as requestLoader,
} from "./routes/request";
import ResponseElement, { loader as responseLoader } from "./routes/response";
import EmptyRequest from "./routes/empty-request";
import EmptyResponse from "./routes/empty-response";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <EmptyRequest /> },
      {
        path: "requests/:requestId",
        element: <RequestElement />,
        loader: requestLoader,
        action: requestAction,
        children: [
          { index: true, element: <EmptyResponse /> },
          {
            loader: responseLoader,
            path: "responses/:responseId",
            element: <ResponseElement />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
