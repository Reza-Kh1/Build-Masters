import axios from "axios";
const fetchTags = async () => {
    const { data } = await axios.get('tag');
    return data;
};
export { fetchTags };
