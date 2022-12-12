import { ActionFunctionArgs, json, redirect } from "react-router-dom";
import {
  deleteFolderAndRequests,
  renameFolder as rename,
} from "../../models/requests";

export async function deleteFolder({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const folderId = formData.get("id");
  if (typeof folderId === "string") {
    await deleteFolderAndRequests(folderId);
    return redirect("/");
  }
  throw new Error("Error deleting folder, folder id was not found.");
}

export async function renameFolder({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const folderId = formData.get("id");
  const newTitle = formData.get("new-title");
  if (typeof folderId === "string" && typeof newTitle === "string") {
    await rename(folderId, newTitle);
    return json({});
  }
  throw new Error("Error rename folder");
}
