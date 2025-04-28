"use server";
import { fetchApi } from "./fetchApi";
const actionComments = async (prevState: any, formData: FormData) => {
  const getPostId = formData.get("postId") as string;
  const getRepliesId = formData.get("replies") as string;
  const emailValue = formData.get("email")
  const body = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    text: formData.get("text"),
  } as any;
  if (emailValue) {
    body.email = formData.get("email")
  }
  if (getPostId) {
    body.postId = JSON.parse(getPostId)
  }
  if (getRepliesId) {
    body.replies = JSON.parse(getRepliesId)
  }
  try {
    const data = await fetchApi({ url: "comment", method: "POST", body });
    if (data?.error) throw new Error()
    if (data.success) {
      return {
        msg: "ok",
        err: "",
      }
    };
  } catch (err) {
    return {
      msg: "",
      err: "err",
    };
  }
};
export default actionComments;
