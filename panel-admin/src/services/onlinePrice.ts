import axios from "axios";
const fetchOnlinePrice = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`onlinePrice?${url}`);
  return data;
};
export { fetchOnlinePrice };