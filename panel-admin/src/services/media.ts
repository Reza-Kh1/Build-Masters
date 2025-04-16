import axios from "axios";

const fetchImageDBaas = async ({ pageParam }: any) => {
    const { data } = await axios.get(`media/dbaas${pageParam ? "?next=" + pageParam : ""}`);
    return data;
};

const fetchImage = async ({ pageParam, searchQuery }: any) => {
    let url = ""
    const query = new URLSearchParams(searchQuery);
    if (pageParam) {
        url = "media?next=" + pageParam + "&" + query
    } else {
        url = "media?" + query
    }
    const { data } = await axios.get(url);
    return data;
};
export { fetchImage, fetchImageDBaas };
