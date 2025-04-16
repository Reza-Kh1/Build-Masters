import axios from "axios";
const cookieKey = import.meta.env.VITE_PUBLIC_COOKIE_KEY

const fetchUser = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`user`);
  return data;
};
const fetchGteProfile = async () => {
  const { id } = JSON.parse(localStorage.getItem(cookieKey) as any);  
  const { data } = await axios.get(`user/${id}`);
  return data.data;
};
export { fetchUser, fetchGteProfile };
