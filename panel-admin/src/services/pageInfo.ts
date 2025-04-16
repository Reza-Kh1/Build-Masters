import axios from "axios";
const fetchPageInfo = async (namePage: any) => {
  const { data } = await axios.get(`page/${namePage}`);
  return data.data;
};
export { fetchPageInfo };
