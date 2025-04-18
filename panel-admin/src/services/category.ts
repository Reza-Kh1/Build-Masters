import axios from "axios";
const fetchCategory = async () => {  
  const { data } = await axios.get("category?admin=true");
  return data;
};
export { fetchCategory };
