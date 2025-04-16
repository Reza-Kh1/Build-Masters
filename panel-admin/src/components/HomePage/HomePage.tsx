import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { fetchPageInfo } from '../../services/pageInfo';
import axios from 'axios';
import deleteCache from '../../services/revalidate';
import { toast } from 'react-toastify';
import { MdClose, MdDataSaverOn } from 'react-icons/md';
import SelectMedia from '../SelectMedia/SelectMedia';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, IconButton, TextField } from '@mui/material';
import { IoIosArrowDown } from 'react-icons/io';
import { IoTrashBinSharp } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
type HeroDataType = {
  id: number
  img: string
  title: string
  text: string
  alt: string
}
type TabDataType = {
  id: number
  text: string
  title: string
}
type DataHomeType = {
  text: {
    tabImage: { alt: string, url: string } | null,
    tabs: TabDataType[],
    heroData: HeroDataType[]
  }
}
export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroDataType[]>([{
    id: 1,
    img: "",
    title: "",
    text: "",
    alt: ""
  }])
  const [tabData, setTabData] = useState<TabDataType[]>([{
    id: 1,
    text: "",
    title: ""
  }])
  const [imageTab, setImageTab] = useState<{ alt: string, url: string } | null>(null)
  const queryClient = useQueryClient();
  const { data } = useQuery<DataHomeType>({
    queryKey: ["home"],
    queryFn: () => fetchPageInfo("home"),
    staleTime: 1000 * 60 * 60 * 24,
  });
  const addBtnHero = () => {
    const newData = {
      id: Math.floor(Math.random() * 1000),
      img: "",
      title: "",
      text: "",
      alt: ""
    }
    setHeroData([...heroData, newData])
  }
  const addBtnTabs = () => {
    const newData = {
      id: Math.floor(Math.random() * 1000),
      title: "",
      text: "",
    }
    setTabData([...tabData, newData])
  }
  const { isPending, mutate: saveHandler } = useMutation({
    mutationFn: async () => {
      const body = {
        page: "home",
        text: {
          tabImage: imageTab,
          tabs: tabData || [],
          heroData: heroData || []
        },
      };
      await deleteCache({ tag: "home" });
      return axios.post("page/home", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home"] });
      toast.success("اطلاعات با موفقیت آپدیت شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const syncData = () => {
    setHeroData(data?.text?.heroData || [{
      id: 1,
      img: "",
      title: "",
      text: "",
      alt: ""
    }])
    setTabData(data?.text?.tabs || [{
      id: 1,
      text: "",
      title: ""
    }])
    setImageTab(data?.text?.tabImage || null)
  };
  useEffect(() => {
    if (data) {
      syncData();
    }
  }, [data]);
  return (
    <div className='w-full p-2'>
      <span className="mb-5 block font-semibold">محتوای اول صفحه :</span>
      {heroData.map((i, index) => (
        <div className='flex gap-5 my-3 items-center' key={index}>
          <IconButton
            onClick={addBtnHero}
            className={`text-xl !bg-slate-700 !shadow-md hover:!text-gray-700 hover:!bg-gray-400 transition-all p-3 !text-white`}
          >
            <i>
              <FaPlus />
            </i>
          </IconButton>
          <Accordion className='w-full' key={index}>
            <AccordionSummary
              expandIcon={<IoIosArrowDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="w-1/2">
                <TextField value={i.title}
                  fullWidth
                  autoComplete="off"
                  className="shadow-md"
                  label={"عنوان"}
                  onChange={({ target }) => {
                    const newMenu = heroData.map((maper, ind) => {
                      if (index === ind) {
                        i.title = target.value
                      }
                      return maper;
                    });
                    setHeroData(newMenu);
                  }} />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex gap-5">
                <div className='w-1/2'>
                  <TextField value={i.text}
                    fullWidth
                    multiline
                    rows={4}
                    autoComplete="off"
                    label={"متن"}
                    onChange={({ target }) => {
                      const newMenu = heroData.map((maper, ind) => {
                        if (index === ind) {
                          i.text = target.value
                        }
                        return maper;
                      });
                      setHeroData(newMenu);
                    }} />
                </div>
                <div className="w-1/2 flex gap-5 justify-between h-full">
                  <div>
                    <span className="block font-semibold mb-3">انتخاب عکس :</span>
                    <SelectMedia
                      textHelp='ابعاد تصویر 1450*550'
                      addMedia={(alt, img) => {
                        const newMenu = heroData.map((maper, ind) => {
                          if (index === ind) {
                            i.alt = alt
                            i.img = img.url
                          }
                          return maper;
                        });
                        setHeroData(newMenu);
                      }}
                    />
                  </div>
                  {i.img && (
                    <figure className="relative group w-1/3">
                      <img
                        src={i.img}
                        alt={i.alt}
                        className="shadow-md h-32 object-cover rounded-md w-full"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "/notfound.webp";
                        }}
                      />
                      <i
                        onClick={() => {
                          const newMenu = heroData.map((maper, ind) => {
                            if (index === ind) {
                              i.alt = ""
                              i.img = ""
                            }
                            return maper;
                          });
                          setHeroData(newMenu);
                        }}
                        className="absolute group-hover:opacity-100 opacity-0 top-1 text-xl right-1 bg-gray-800/70 p-1 rounded-full cursor-pointer text-white shadow-md"
                      >
                        <MdClose />
                      </i>
                      <span className="text-sm absolute left-0 bottom-0 w-full bg-black/70 text-gray-50 group-hover:opacity-100 opacity-0 transition-all rounded-md p-2">
                        {i?.alt}
                      </span>
                    </figure>
                  )}
                </div>
              </div>
            </AccordionDetails>
            <AccordionActions>
              <div className="w-full justify-between items-center flex">
                {heroData.length === 1 ? null : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setHeroData(heroData.filter(({ id }) => id !== i.id))}
                    endIcon={<IoTrashBinSharp />}
                  >
                    حذف
                  </Button>
                )}
              </div>
            </AccordionActions>
          </Accordion>
        </div>
      ))}
      <span className="my-5 block font-semibold">محتوای داخل تب ها :</span>
      {tabData.map((i, index) => (
        <div key={index} className='flex gap-5 my-3 items-center'>
          <IconButton
            onClick={addBtnTabs}
            className={`text-xl !bg-slate-700 !shadow-md hover:!text-gray-700 hover:!bg-gray-400 transition-all p-3 !text-white`}
          >
            <i>
              <FaPlus />
            </i>
          </IconButton>
          <Accordion className='w-full' key={index}>
            <AccordionSummary
              expandIcon={<IoIosArrowDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className="w-1/2">
                <TextField value={i.title}
                  fullWidth
                  autoComplete="off"
                  className="shadow-md"
                  label={"عنوان"}
                  onChange={({ target }) => {
                    const newMenu = tabData.map((maper, ind) => {
                      if (index === ind) {
                        i.title = target.value
                      }
                      return maper;
                    });
                    setTabData(newMenu);
                  }} />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <TextField value={i.text}
                fullWidth
                multiline
                rows={4}
                autoComplete="off"
                label={"متن"}
                onChange={({ target }) => {
                  const newMenu = tabData.map((maper, ind) => {
                    if (index === ind) {
                      i.text = target.value
                    }
                    return maper;
                  });
                  setTabData(newMenu);
                }} />
            </AccordionDetails>
            <AccordionActions>
              <div className="w-full justify-between items-center flex">
                {tabData.length === 1 ? null : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setTabData(tabData.filter(({ id }) => id !== i.id))}
                    endIcon={<IoTrashBinSharp />}
                  >
                    حذف
                  </Button>
                )}
              </div>
            </AccordionActions>
          </Accordion>
        </div>
      ))}
      <span className="my-5 block font-semibold">عکس مقابل تب :</span>
      <div className="w-1/2 flex gap-5 justify-between h-full">
        <div>
          <span className="block font-semibold mb-3">انتخاب عکس :</span>
          <SelectMedia
            addMedia={(alt, img) => setImageTab({ alt, url: img.url })}
          />
        </div>
        {imageTab && (
          <figure className="relative group w-1/3">
            <img
              src={imageTab.url}
              alt={imageTab.alt}
              className="shadow-md h-32 object-cover rounded-md w-full"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "/notfound.webp";
              }}
            />
            <i
              onClick={() => setImageTab(null)}
              className="absolute group-hover:opacity-100 opacity-0 top-1 text-xl right-1 bg-gray-800/70 p-1 rounded-full cursor-pointer text-white shadow-md"
            >
              <MdClose />
            </i>
            <span className="text-sm absolute left-0 bottom-0 w-full bg-black/70 text-gray-50 group-hover:opacity-100 opacity-0 transition-all rounded-md p-2">
              {imageTab.alt}
            </span>
          </figure>
        )}
      </div>
      <Button
        onClick={() => saveHandler()}
        className="!mt-5 block"
        endIcon={<MdDataSaverOn />}
        color="success"
        variant="contained"
        disabled={isPending}
      >
        ذخیره کردن اطلاعات
      </Button>
    </div>
  )
}
