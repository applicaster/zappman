import "dracula-ui/styles/dracula-ui.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import "./App.css";
import Root from "./routes/root";
import RequestElement from "./routes/request";
import ResponseElement from "./routes/response";
import EmptyRequest from "./routes/empty-request";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <EmptyRequest /> },
      {
        path: "requests/:requestId",
        element: <RequestElement />,
        children: [
          {
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
