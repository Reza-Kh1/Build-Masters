import axios from "axios";
import { toast } from "react-toastify";
type deleteCacheType = {
  tag?: string;
  path?: string;
};
const deleteCache = async ({ tag, path }: deleteCacheType) => {
  if (!tag && !path) return
  let url = "";
  if (tag) {
    url = "tag=" + tag;
  }
  if (path) {
    if (tag) {
      url = url + "&path=" + path
    } else {
      url = "path=" + path
    }
  }
  try {
    const data = await axios.delete(
      `${import.meta.env.VITE_PUBLIC_URL_SITE}api/revalidate?${url}`
    );
    return data
  } catch (err) {
    console.log(err);
    toast.error("!حذف کش با خطا مواجه شد");
  }
};
export default deleteCache;
