import axios from "axios";
const fetchPost = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`post/admin?${url}`);
  return data;
};

const fetchSinglePost = async (slug: string) => {
  const url = slug?.replace(/-/g, " ")  
  const { data } = await axios.get(`post/${url}`);
  return data;
};
export { fetchPost, fetchSinglePost };
