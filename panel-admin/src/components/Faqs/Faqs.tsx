import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";
import { MdClose, MdOutlineDescription, MdReplyAll, MdTitle } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { MdDataSaverOn } from "react-icons/md";
import { IoTrashBinSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPageInfo } from "../../services/pageInfo";
import axios from "axios";
import { toast } from "react-toastify";
import PendingApi from "../PendingApi/PendingApi";
import deleteCache from "../../services/revalidate";
import { useForm } from "react-hook-form";
import FieldsInputs from "../FieldsInputs/FieldsInputs";
type DataType = {
  id: number;
  page: string;
  content: {
    description: string;
    title: string;
    accordion: {
      name: string;
      id: number;
      arry: { name: string; text: string; id: number }[];
    }[];
  };
  keyword: string[]
  description: string
  title: string
  canonicalUrl: string
};

export default function Faqs() {
  const { register, getValues, setValue } = useForm()
  const [keyword, setKeyword] = useState<string[]>([])
  const [dataText, setDataText] = useState({
    title: "",
    description: "",
  });
  const [accordion, setAccrodion] = useState([
    { name: "", id: 1, arry: [{ name: "", text: "", id: 1 }] },
  ]);
  const queryClient = useQueryClient();
  const { data } = useQuery<DataType | null>({
    queryKey: ["faqs"],
    queryFn: () => fetchPageInfo("faqs"),
    staleTime: 1000 * 60 * 60 * 24,
  });
  const deleteAccordion = (id: number) => {
    const newAc = accordion.map((i) => {
      const test = i.arry.filter((filter) => filter.id !== id);
      i.arry = test;
      return i;
    });
    setAccrodion(newAc);
  };
  const addAccordion = (id: number) => {
    const number = Math.floor(Math.random() * 1000);
    const newAccordion = accordion.map((i) => {
      if (i.id === id) {
        i.arry.push({
          id: number,
          name: "",
          text: "",
        });
      }
      return i;
    });
    setAccrodion(newAccordion);
  };
  const insertAccordion = () => {
    const number = Math.floor(Math.random() * 1000);
    const newAc = [
      ...accordion,
      { name: "", id: number, arry: [{ name: "", text: "", id: 1 }] },
    ];
    setAccrodion(newAc);
  };
  const dropAccordion = (id: number) => {
    const newAc = accordion.filter((filter) => filter.id !== id);
    setAccrodion(newAc);
  };
  const { isPending, mutate: saveHandler } = useMutation({
    mutationFn: async () => {
      const body = {
        page: 'faqs',
        content: {
          ...dataText,
          accordion,
        },
        keyword: keyword,
        description: getValues('description'),
        title: getValues('title'),
        canonicalUrl: getValues('canonicalUrl')
      }
      await deleteCache({ tag: "page/faqs" });
      return axios.post("pages", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("اطلاعات با موفقیت آپدیت شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const syncData = () => {
    setDataText({
      description: data?.content?.description || "",
      title: data?.content?.title || "",
    });
    setAccrodion(
      data?.content?.accordion || [
        { name: "", id: 1, arry: [{ name: "", text: "", id: 1 }] },
      ]
    );
    setKeyword(data?.keyword || [])
    setValue('title', data?.title)
    setValue('description', data?.description)
    setValue('canonicalUrl', data?.canonicalUrl)
  };
  useEffect(() => {
    if (data) {
      syncData();
    }
  }, [data]);
  return (
    <div className="w-full p-2">
      {isPending && <PendingApi />}
      <span className="mb-5 block font-semibold">عنوان صفحه (Title) :</span>
      <FieldsInputs data={{
        label: 'عنوان صفحه',
        name: 'title',
        type: 'text',
        icon: <MdTitle />
      }} register={register} />
      <span className="my-5 block font-semibold">تگ های صفحه (Keyword) :</span>
      <Autocomplete
        multiple
        className="shadow-md"
        id="tags-filled"
        options={[].map((option) => option)}
        defaultValue={[]}
        freeSolo
        onChange={(_, newValue) => setKeyword(newValue)}
        value={keyword}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                variant="outlined"
                label={option}
                key={key}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            autoComplete="off"
            {...params}
            label="کلمات کلیدی"
            placeholder="اینتر بزنید..."
          />
        )}
      />
      <span className="my-5 block font-semibold">توضیحات صفحه (Description) :</span>
      <FieldsInputs data={{
        label: 'توضیحات',
        name: 'description',
        type: 'text',
        icon: <MdOutlineDescription />
      }} register={register} />
      <span className="my-5 block font-semibold">آدرس صفحه اصلی برای جلوگیری از محتوای تکراری (Canonical) :</span>
      <FieldsInputs data={{
        label: 'آدرس',
        name: 'canonicalUrl',
        type: 'text',
        icon: <MdReplyAll />
      }} register={register} />
      <span className="my-5 block font-semibold">عنوان متنی صفحه :</span>
      <div className="flex flex-col gap-3">
        <TextField
          fullWidth
          autoComplete="off"
          className="shadow-md"
          label={"متن همراه عنوان"}
          value={dataText.title}
          onChange={({ target }) =>
            setDataText({ ...dataText, title: target.value })
          }
        />
        <TextField
          fullWidth
          autoComplete="off"
          className="shadow-md"
          label={"توضیحات بخش درباره ما"}
          rows={6}
          multiline
          value={dataText.description}
          onChange={({ target }) =>
            setDataText({ ...dataText, description: target.value })
          }
        />
      </div>
      <span className="my-5 block font-semibold">سوالات متداول :</span>
      <div className="mb-5">
        {accordion.map((item, index) => (
          <Accordion key={index} className="">
            <AccordionSummary
              expandIcon={<IoIosArrowDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="w-1/2">
                <TextField
                  fullWidth
                  autoComplete="off"
                  className="shadow-md"
                  label={"عنوان اصلی"}
                  value={item.name}
                  onChange={({ target }) => {
                    const newText = accordion.map((num) => {
                      if (num.id === item.id) {
                        num.name = target.value;
                      }
                      return num;
                    });
                    setAccrodion(newText);
                  }}
                />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col gap-5">
                {item.arry.map((i, indexs) => (
                  <div className="flex flex-col gap-2" key={indexs}>
                    <div className="flex items-center gap-3">
                      {item.arry.length === 1 ? null : (
                        <IconButton
                          onClick={() => deleteAccordion(i.id)}
                          className="text-xl !bg-red-700 !shadow-md hover:!text-gray-700 hover:!bg-gray-400 transition-all p-3 !text-white"
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
                        label={"عنوان"}
                        value={i.name}
                        onChange={({ target }) => {
                          const newText = accordion.map((num) => {
                            if (num.id === item.id) {
                              num.arry.map((ac) => {
                                if (ac.id === i.id) {
                                  ac.name = target.value;
                                }
                                return ac;
                              });
                            }
                            return num;
                          });
                          setAccrodion(newText);
                        }}
                      />
                    </div>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      className="shadow-md"
                      label={"توضیحات همراه عنوان"}
                      rows={4}
                      multiline
                      value={i.text}
                      onChange={({ target }) => {
                        const newText = accordion.map((num) => {
                          if (num.id === item.id) {
                            num.arry.map((ac) => {
                              if (ac.id === i.id) {
                                ac.text = target.value;
                              }
                              return ac;
                            });
                          }
                          return num;
                        });
                        setAccrodion(newText);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div></div>
            </AccordionDetails>
            <AccordionActions>
              <div className="w-full justify-between items-center flex">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addAccordion(item.id)}
                  endIcon={<FaPlus />}
                >
                  افزودن
                </Button>
                {accordion.length === 1 ? null : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => dropAccordion(item.id)}
                    endIcon={<IoTrashBinSharp />}
                  >
                    حذف
                  </Button>
                )}
              </div>
            </AccordionActions>
          </Accordion>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={insertAccordion}
            endIcon={<FaPlus />}
          >
            افزودن آکاردیون
          </Button>
        </div>
        <div>
          <Button
            onClick={() => saveHandler()}
            className="mt-5"
            endIcon={<MdDataSaverOn />}
            color="success"
            variant="contained"
            disabled={isPending}
          >
            ذخیره کردن اطلاعات
          </Button>
        </div>
      </div>
    </div>
  );
}
