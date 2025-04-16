import axios from "axios";
const fetchProject = async (search: any) => {
    const url = new URLSearchParams(search);
    const { data } = await axios.get(`project?${url}`);
    return data;
};
const fetchSingleProject = async (name?: string) => {
    const url = name?.replace(/-/g, " ")
    const { data } = await axios.get(`project/${url}`);
    return data?.data;
};
const fetchProjectWorker = async ({ pageParam, id }: any) => {    
    const { data } = await axios.get(`project?page=${pageParam || 1}&expert=${id}`);
    return data;
};
export { fetchProject, fetchSingleProject, fetchProjectWorker };
