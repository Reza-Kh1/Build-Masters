import axios from "axios";
const fetchContractor = async (search: any) => {
  const url = new URLSearchParams(search);
  const { data } = await axios.get(`contractor?${url}`);
  return data;
};

const fetchContractorName = async () => {  
  const { data } = await axios.get("Contractor/name-Contractor");
  return data;
};

const fetchSingleContractor = async (name?: string) => {
  // const url = name?.replace(/-/g, " ")
  const { data } = await axios.get(`Contractor/${name}`);
  return data?.data;
};
export { fetchContractorName, fetchContractor, fetchSingleContractor };
