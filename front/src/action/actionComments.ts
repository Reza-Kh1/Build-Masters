"use server";
import { fetchApi } from "./fetchApi";
const actionComments = async (prevState: any, formData: FormData) => {
  const getPostId = formData.get("postId") as string;
  const getContractorId = formData.get("contractorId") as string;
  const getRepliesId = formData.get("replies") as string;
  const body = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    content: formData.get("content"),
    rating: formData.get("rating"),
  } as any;

  if (getPostId) {
    body.postId = JSON.parse(getPostId)
  }
  if (getRepliesId) {
    body.commentReply = JSON.parse(getRepliesId)
  }
  if (getContractorId) {
    body.contractorId = JSON.parse(getContractorId)
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
      err: err,
    };
  }
};
export default actionComments;
