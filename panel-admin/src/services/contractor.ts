import axios from "axios";
const fetchContractor = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`contractor?${url}`);
  return data;
};

const fetchContractorName = async () => {
  const { data } = await axios.get("contractor?allContractorname=true");
  return data;
};

const fetchSingleContractor = async (name?: string) => {
  // const url = name?.replace(/-/g, " ")
  const { data } = await axios.get(`contractor/${name}`);
  return data;
};

export { fetchContractorName, fetchContractor, fetchSingleContractor };
