import axios from "axios";
const fetchBackUp = async () => {  
  const { data } = await axios.get("backUp");
  return data;
};
export { fetchBackUp };
