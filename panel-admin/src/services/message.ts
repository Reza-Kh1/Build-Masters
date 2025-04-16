import axios from "axios";
const fetchMessage = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`message?${url}`);
  return data;
};
export { fetchMessage };