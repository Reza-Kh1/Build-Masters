import axios from "axios";
const fetchPageInfo = async (namePage: any) => {
  const { data } = await axios.get(`pages?page=${namePage}`);
  return data;
};
export { fetchPageInfo };
