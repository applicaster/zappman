import { ActionFunctionArgs, json, redirect } from "react-router-dom";
import { deleteRequest as deleteRequestObj, renameRequest as rename } from "../../models/requests";

export async function renameRequest({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const requestId = formData.get("id");
  const newTitle = formData.get("new-title");
  if (typeof requestId === "string" && typeof newTitle === "string") {
    await rename(requestId, newTitle);
    return json({});
  }
  throw new Error("Error rename folder");
}

export async function deleteRequest({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const requestId = formData.get("id");
  if (typeof requestId === "string") {
    await deleteRequestObj(requestId)
    return redirect("/");
  }
  throw new Error("Error deleting request, request id was not found.");
}