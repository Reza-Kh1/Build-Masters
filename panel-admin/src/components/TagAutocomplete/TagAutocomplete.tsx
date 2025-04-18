import { Autocomplete, Button, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "../../services/tag";
import { Link } from "react-router-dom";
import { FaShare } from "react-icons/fa6";
type TagsBoxType = {
  tags: { name: string }[];
  name: string;
  setTags: (value: { name: string }[]) => void;
};
export default function TagAutocomplete({ tags, setTags, name }: TagsBoxType) {
  const { data } = useQuery<{ name: string }[]|[]>({
    queryKey: ["TagsName"],
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    queryFn: fetchTags,
  });
  console.log(data);
  
  return data?.length ? (
    <Autocomplete
      multiple
      className="shadow-md"
      id="tags-outlined"
      options={data}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      value={tags}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField autoComplete="off" {...params} label={name} />
      )}
      onChange={(_, newValue) => setTags(newValue)}
    />
  ) : (
    <Link to={"/home/tags"}>
      <Button endIcon={<FaShare />} variant="outlined">
        هیچ تگ در دیتابیس ذخیره نشده لطفا تگ جدید ایجاد کنید!
      </Button>
    </Link>
  );
}
