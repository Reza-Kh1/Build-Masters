import axios from "axios";

const fetchUser = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`user`);
  return data;
};

const fetchGetUserContractor = async () => {
  const { data } = await axios.get('user?contractor=true');
  return data;
};
export { fetchUser, fetchGetUserContractor };
