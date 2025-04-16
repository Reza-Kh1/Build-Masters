import axios from "axios";
const fetchOnlinePrice = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`onlineprice?${url}`);
  return data;
};
export { fetchOnlinePrice };