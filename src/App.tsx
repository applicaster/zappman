import { createBrowserRouter, RouterProvider, Route, useRouteError } from "react-router-dom";

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


function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>;
}

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
        shouldRevalidate: () => true,
        errorElement: <ErrorBoundary />,
        children: [
          { index: true, element: <EmptyResponse /> },
          {
            loader: responseLoader,
            path: "responses/:responseId",
            element: <ResponseElement />,
            errorElement: <ErrorBoundary />,
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
