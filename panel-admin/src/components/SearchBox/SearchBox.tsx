import { Button, MenuItem, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {dataOrder,dataStatus,dataCheck,dataRole,} from "../../data/selectData";
import TagAutocomplete from "../TagAutocomplete/TagAutocomplete";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { GrSearchAdvanced } from "react-icons/gr";
import WorkerSelector from "../WorkerSelector/WorkerSelector";
type SearchFormType = {
  search?: string;
  isPublished?: string;
  order?: string;
  role?: string;
};
type SearchBoxType = {
  checker?: boolean;
  isPublished?: boolean;
  notTag?: boolean;
  isUser?: boolean;
  notSearch?: boolean;
  nameWorker?: boolean
};
export default function SearchBox({
  checker,
  isPublished,
  notTag,
  isUser,
  notSearch, nameWorker
}: SearchBoxType) {
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [workerId, setWorkerId] = useState<number>(0)
  const { register, setValue, handleSubmit, watch } = useForm<SearchFormType>({
    defaultValues: {
      isPublished: "all",
      order: "desc",
      role: "all",
    },
  });
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchUser = ({ isPublished, ...other }: SearchFormType) => {
    let newTags = "";
    for (const key in tags) {
      if (Number(key) + 1 === tags.length) {
        newTags = newTags + tags[key].name;
      } else {
        newTags = newTags + tags[key].name + "-";
      }
    }
    const body = {
      page: 1,
      ...other,
      tags: newTags,
    } as any;
    if (workerId) body.expert = workerId
    if (isPublished !== "all") body.isPublished = isPublished;
    const url = "?" + new URLSearchParams(body);
    navigate(url);
  };
  const setQueryInput = (form: any) => {
    if (form?.search) setValue("search", form?.search);
    if (form?.status) setValue("isPublished", form?.isPublished || "all");
    if (form?.order) setValue("order", form?.order);
    if (form?.expert) setWorkerId(form.expert)
    if (form?.tags) {
      const tagArry = form?.tags.split("-").map((i: any) => (i = { name: i }));
      setTags(tagArry);
    }
  };
  useEffect(() => {
    const query = queryString.parse(search);
    if (query) {
      setQueryInput(query);
    }
  }, []);
  const valueStatus = watch("isPublished");
  const orderValue = watch("order");
  const valueUser = watch("role");
  return (
    <form className="w-full grid my-4 grid-cols-4 gap-3 items-center justify-center">
      {!notSearch && (
        <TextField
          autoComplete="off"
          className="shadow-md"
          label={"جستجو..."}
          fullWidth
          {...register("search")}
        />
      )}
      {!notTag && (
        <TagAutocomplete name="انتخاب تگ" setTags={setTags} tags={tags} />
      )}
      {isUser && (
        <TextField
          fullWidth
          autoComplete="off"
          select
          className="shadow-md"
          label="انتخاب سطح کاربری"
          id="evaluationField"
          value={valueUser}
          onChange={(e) => setValue("role", e.target.value)}
        >
          <MenuItem value={"all"}>نمایش همه</MenuItem>
          {dataRole?.map((i, index) => (
            <MenuItem key={index} value={i.value}>
              {i.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      {nameWorker && (
        <WorkerSelector setWorker={setWorkerId} worker={workerId} />
      )}
      <TextField
        fullWidth
        autoComplete="off"
        select
        className="shadow-md"
        label="مرتب سازی براساس"
        id="evaluationField"
        value={orderValue}
        onChange={(e) => setValue("order", e.target.value)}
      >
        {dataOrder?.map((i, index) => (
          <MenuItem key={index} value={i.value}>
            {i.name}
          </MenuItem>
        ))}
      </TextField>
      {!checker && !isPublished ? null : (
        <TextField
          fullWidth
          autoComplete="off"
          select
          className="shadow-md"
          label="وضعیت"
          id="evaluationField"
          value={valueStatus}
          onChange={(e) => setValue("isPublished", e.target.value)}
        >
          {isPublished &&
            dataStatus.map((i) => (
              <MenuItem key={i.value} value={i.value}>
                {i.name}
              </MenuItem>
            ))}
          {checker &&
            dataCheck.map((i) => (
              <MenuItem key={i.value} value={i.value}>
                {i.name}
              </MenuItem>
            ))}
        </TextField>
      )}
      <div>
        <Button
          className="w-1/2 !bg-gradient-to-tr to-slate-500 from-blue-500"
          variant="contained"
          onClick={handleSubmit(searchUser)}
          endIcon={<GrSearchAdvanced />}
        >
          جستجو
        </Button>
      </div>
    </form>
  );
}
