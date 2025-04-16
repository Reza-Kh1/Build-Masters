import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FaHashtag, FaPen, FaPenToSquare } from "react-icons/fa6";
import { fetchTags } from "../../services/tag";
import { toast } from "react-toastify";
import PendingApi from "../../components/PendingApi/PendingApi";
import { MdClose } from "react-icons/md";
import { TagType } from "../../type";
import DontData from "../../components/DontData/DontData";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import deleteCache from "../../services/revalidate";
type TagsType = {
  data: TagType[];
};

export default function Tags() {
  const [valueTag, setValueTag] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [editTag, setEditTag] = useState<TagType | null>(null);
  const query = useQueryClient();
  const { data } = useQuery<TagsType>({
    queryKey: ["tagsName"],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const { mutate: createTag, isPending: pendingcreate } = useMutation({
    mutationFn:async () => {
      await deleteCache({ tag:"tag"});
      return axios.post("tag", { name: valueTag });
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["tagsName"] });
      setValueTag("");
      toast.success("تگ جدید ایجاد شد");
    },
    onError: (err: any) => {
      toast.warning(err.response.data.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const { mutate: deleteTag, isPending: pendingdelete } = useMutation({
    mutationFn:async (id: number) => {
      await deleteCache({ tag:"tag"});
      return axios.delete(`tag/${id}`);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["tagsName"] });
      toast.info("تگ حذف شد");
    },
    onError: (err: any) => {
      toast.error("تمام مجری ها ،پروژه هاو پست های مربوط به تگ را حذف کنید");
      //   toast.warning(err.response.data.message);
      console.log(err);
    },
  });
  const { mutate: updatetag, isPending: pendingupate } = useMutation({
    mutationFn:async (name) => {
      await deleteCache({ tag:"tag"});
      return axios.put(`tag/${editTag?.id}`, { name });
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["tagsName"] });
      toast.success("تگ ویرایش شد");
      setOpen(false);
    },
    onError: (err: any) => {
      toast.warning(err.response.data.message || "با خطا مواجه شدیم");
      console.log(err);
      setOpen(false);
    },
  });
  return (
    <>
      <div className="w-full">
        {pendingcreate || pendingdelete || pendingupate ? <PendingApi /> : null}
        <h1 className="w-full p-2 rounded-md shadow-md bg-blue-400 text-gray-50">
          افزودن تگ
        </h1>
        <div className="flex gap-3 my-3 items-center justify-between">
          <TextField
            className="shadow-md w-1/3"
            autoComplete="off"
            label={"نام تگ"}
            value={valueTag}
            onKeyDown={(e) => {
              if (e.code === "Enter" && valueTag) {
                createTag();
              }
            }}
            onChange={({ target }) => setValueTag(target.value)}
          />
          <Button
            endIcon={<FaHashtag />}
            color="warning"
            className="w-1/5"
            onClick={() => createTag()}
            variant="contained"
            disabled={pendingcreate || valueTag.length ? false : true}
          >
            ایجاد تگ
          </Button>
        </div>
        <div className="">
          {data?.data?.length ? (
            <div className="w-ful grid gap-3 grid-cols-5">
              {data.data.map((i, index) => (
                <div key={index} className="shadow-md border rounded-md p-3">
                  <span className="text-center block">{i.name}</span>
                  <div className="w-full mt-2 gap-3 flex justify-evenly">
                    <Button
                      size="small"
                      fullWidth
                      endIcon={<FaPen />}
                      color="success"
                      onClick={() => {
                        setOpen(true), setEditTag({ id: i.id, name: i.name });
                      }}
                      variant="contained"
                      disabled={pendingupate}
                    >
                      ویرایش
                    </Button>
                    <DeleteButton
                      deletePost={() => deleteTag(i.id)}
                      pendingDelete={pendingdelete}
                      text="حذف"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DontData text="تگ یافت نشد!" />
          )}
        </div>
      </div>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const name = formJson.name;
            updatetag(name);
          },
        }}
      >
        <DialogTitle>ویرایش عکس</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            defaultValue={editTag?.name}
            margin="dense"
            autoComplete="false"
            autoSave="false"
            name="name"
            label="ویرایش نام"
            type="text"
            fullWidth
            variant="standard"
            required
          />
        </DialogContent>
        <DialogActions>
          <div className="flex justify-between items-center w-full">
            <Button
              type="submit"
              color="success"
              variant="contained"
              endIcon={<FaPenToSquare />}
            >
              ذخیره
            </Button>
            <Button
              color="error"
              variant="contained"
              endIcon={<MdClose />}
              onClick={() => setOpen(false)}
            >
              بستن
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
