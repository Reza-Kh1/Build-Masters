import axios from "axios";
const fetchBackUp = async () => {  
  const { data } = await axios.get("backup");
  return data;
};
export { fetchBackUp };
