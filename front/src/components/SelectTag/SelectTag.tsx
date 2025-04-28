"use client";
import { TagsType } from "@/app/type";
import Filters from "./Filters";
import CustomButton from "../CustomButton/CustomButton";
import { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { GiSettingsKnobs } from "react-icons/gi";
type SelectTagType = {
  dataTags: TagsType[];
  urlPage: string;
  dataProject?: {
    name: string;
    id: string;
  }[];
};
export default function SelectTag({
  dataTags,
  urlPage,
  dataProject,
}: SelectTagType) {
  const [open, setOpen] = useState<boolean>(false);
  const search = useSearchParams();
  useEffect(() => {
    setOpen(false);
  }, [search]);
  return (
    <>
      <div className="w-full hidden md:flex md:gap-2">
        <Filters
          dataTags={dataTags}
          urlPage={urlPage}
          dataProject={dataProject}
        />
      </div>
      <div className="w-full block md:hidden text-left" aria-labelledby="menu responsive mobile in client">
        <CustomButton
          name="فیلتر"
          type="button"
          color="warning"
          className="!max-w-28 !text-xs"
          onClick={() => setOpen((prev) => !prev)}
          iconEnd={<GiSettingsKnobs size={18}/>}
        />
        <Drawer anchor={"right"} open={open} onClose={() => setOpen(false)}>
          <div className="min-w-56 md:hidden flex flex-col gap-3 p-3 overflow-hidden h-full dark:bg-zinc-900/80">
            <Filters
              dataTags={dataTags}
              urlPage={urlPage}
              dataProject={dataProject}
            />
          </div>
        </Drawer>
      </div>
    </>
  );
}
