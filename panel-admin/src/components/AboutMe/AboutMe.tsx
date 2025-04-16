import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { MdDataSaverOn } from "react-icons/md";
import SelectMedia from "../SelectMedia/SelectMedia";
import ImageComponent from "../ImageComponent/ImageComponent";
import { fetchPageInfo } from "../../services/pageInfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import PendingApi from "../PendingApi/PendingApi";
import deleteCache from "../../services/revalidate";
type ImgArryType = {
  url: string;
  alt: string;
};
type DataType = {
  id: number;
  page: string;
  text: {
    imgArry: ImgArryType[];
    title1: string;
    text1: string;
    title2: string;
    text2: string;
    textArry: { id: number; text: string }[];
  };
};
export default function AboutMe() {
  const [dataText, setDataText] = useState({
    title1: "",
    text1: "",
    title2: "",
    text2: "",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editImage, setEditImage] = useState<ImgArryType>();
  const [textArry, setTextArry] = useState([{ id: 1, text: "" }]);
  const [imgArry, setImgArry] = useState<ImgArryType[]>([]);
  const queryClient = useQueryClient();
  const { data } = useQuery<DataType | null>({
    queryKey: ["aboutMe"],
    queryFn: () => fetchPageInfo("aboutMe"),
    staleTime: 1000 * 60 * 60 * 24,
  });
  const addBtn = () => {
    const number = Math.floor(Math.random() * 1000);
    const newArry = {
      id: number,
      text: "",
    };
    setTextArry((prev) => [...prev, newArry]);
  };
  const deleteBtn = (id: Number) => {
    const newFilter = textArry.filter((number) => number.id !== id);
    setTextArry(newFilter);
  };
  const editImageHandler = (img: ImgArryType) => {
    setOpen(true);
    setEditImage({ url: img.url, alt: img.alt });
  };
  const deleteImageHandler = (url: string) => {
    const newDetail = imgArry.filter((i) => {
      return i.url !== url;
    });
    setImgArry(newDetail);
  };
  const { isPending, mutate: saveHandler } = useMutation({
    mutationFn: async () => {
      const body = {
        page: "aboutMe",
        text: {
          imgArry,
          title1: dataText.title1,
          text1: dataText.text1,
          title2: dataText.title2,
          text2: dataText.text2,
          textArry: textArry,
        },
      };
      await deleteCache({ tag: "aboutUs" });
      return axios.post("page/aboutMe", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutMe"] });
      toast.success("اطلاعات با موفقیت آپدیت شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const syncData = () => {
    setImgArry(data?.text?.imgArry || []);
    setDataText({
      text1: data?.text?.text1 || "",
      text2: data?.text?.text2 || "",
      title1: data?.text?.title1 || "",
      title2: data?.text?.title2 || "",
    });
    setTextArry(data?.text.textArry || [{ id: 1, text: "" }]);
  };
  useEffect(() => {
    if (data) {
      syncData();
    }
  }, [data]);
  return (
    <div className="w-full p-2">
      {isPending && <PendingApi />}
      <span className="mb-4 block font-semibold">بخش اول :</span>
      <div className="flex gap-7 mb-5">
        <div className="flex flex-col w-1/2 gap-5">
          <TextField
            fullWidth
            autoComplete="off"
            className="shadow-md"
            label={"عنوان بخش اول"}
            value={dataText.title1}
            onChange={({ target }) =>
              setDataText({ ...dataText, title1: target.value })
            }
          />
          <TextField
            fullWidth
            autoComplete="off"
            className="shadow-md"
            label={"توضیحات بخش اول"}
            rows={6}
            value={dataText.text1}
            onChange={({ target }) =>
              setDataText({ ...dataText, text1: target.value })
            }
            multiline
          />
        </div>
        <div className="w-1/2">
          <SelectMedia
            textHelp="ابعاد تصوری 288*384"
            addMedia={(alt, img) =>
              setImgArry([...imgArry, { url: img.url, alt }])
            }
          />
          <div className="grid grid-cols-3 mt-5 gap-3">
            {imgArry.map((i, index) => (
              <ImageComponent
                key={index}
                img={i}
                deleteHandler={(data) => deleteImageHandler(data.url)}
                editHandler={(data) => editImageHandler(data)}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="mb-4 block font-semibold">بخش دوم :</span>
      <div className="flex gap-6">
        <TextField
          fullWidth
          value={dataText.title2}
          autoComplete="off"
          className="shadow-md"
          label={"عنوان بخش دوم"}
          onChange={({ target }) =>
            setDataText({ ...dataText, title2: target.value })
          }
        />
        <TextField
          fullWidth
          value={dataText.text2}
          autoComplete="off"
          className="shadow-md"
          label={"متن همراه عنوان"}
          onChange={({ target }) =>
            setDataText({ ...dataText, text2: target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-4 items-center my-5">
        {textArry.map((i, index) => (
          <div className="flex w-full gap-3 items-center" key={index}>
            <IconButton
              onClick={addBtn}
              className="text-xl !bg-slate-700 !shadow-md hover:!text-gray-700 hover:!bg-gray-400 transition-all p-3 !text-white"
            >
              <i>
                <FaPlus />
              </i>
            </IconButton>
            {i.id === 1 ? null : (
              <IconButton
                onClick={() => deleteBtn(i.id)}
                className="text-xl !bg-red-700 !shadow-md hover:!text-red-700 hover:!bg-gray-300 transition-all p-3 !text-white"
              >
                <i>
                  <MdClose />
                </i>
              </IconButton>
            )}
            <TextField
              fullWidth
              autoComplete="off"
              className="shadow-md"
              label={"افزودن متن"}
              value={i.text}
              onChange={({ target }) => {
                const omal = textArry.map((num) => {
                  if (num.id === i.id) {
                    num.text = target.value;
                  }
                  return num;
                });
                setTextArry(omal);
              }}
            />
          </div>
        ))}
      </div>
      <Button
        onClick={() => saveHandler()}
        className=""
        disabled={isPending}
        endIcon={<MdDataSaverOn />}
        color="success"
        variant="contained"
      >
        ذخیره کردن اطلاعات
      </Button>
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
            const alt = formJson.alt;
            const src = formJson.image;
            const newArry = imgArry.map((i) => {
              if (i.url === editImage?.url) {
                i.alt = alt;
                i.url = src;
              }
              return i;
            });
            setImgArry(newArry);
            setOpen(false);
          },
        }}
      >
        <DialogTitle>ویرایش عکس</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            defaultValue={editImage?.url}
            id="image"
            name="image"
            label="آدرس عکس"
            type="text"
            fullWidth
            variant="standard"
            autoComplete="false"
            autoSave="false"
          />
          <TextField
            autoFocus
            defaultValue={editImage?.alt}
            margin="dense"
            id="alt"
            autoComplete="false"
            name="alt"
            label="ویرایش عنوان"
            type="text"
            fullWidth
            variant="standard"
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
    </div>
  );
}
