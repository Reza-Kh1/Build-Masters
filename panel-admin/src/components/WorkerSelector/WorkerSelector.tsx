import { useQuery } from "@tanstack/react-query";
import { fetchWorkerName } from "../../services/worker";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Link } from "react-router-dom";
import { FaShare } from "react-icons/fa6";
type WorkerType = {
  worker: number;
  setWorker: (value: number) => void;
};
export default function WorkerSelector({ worker, setWorker }: WorkerType) {
  const { data } = useQuery<{ data: { id: number; name: string }[] }>({
    queryKey: ["workerName"],
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    queryFn: fetchWorkerName,
  });
  if (!data) return
  return (
    <div>
      {data ?
        <FormControl fullWidth className="shadow-md">
          <InputLabel id="demo-simple-select-label">نام مجری</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="نام مجری"
            value={worker || 0}
            onChange={({ target }) => setWorker(target.value as number)}
          >
            <MenuItem value={0}>انتخاب کنید</MenuItem>
            {data?.data?.map((i, index) => (
              <MenuItem key={index} value={i.id}>
                {i.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        : <Link to={"/home/tags"}>
          <Button endIcon={<FaShare />} variant="outlined">
            هیچ مجری در دیتابیس ذخیره نشده لطفا ایجاد کنید!
          </Button>
        </Link>
      }

    </div>
  );
}
