import axios from "axios";
const fetchReview = async (search: any) => {
  const url = new URLSearchParams(search);
  // const url = "status=true"
  const { data } = await axios.get(`comment?isAdmin=true&${url}`);
  return data;
};
export { fetchReview };